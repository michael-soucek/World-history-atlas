#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CROSSWALK_PATH = path.join(ROOT, "src/data/crosswalk.ts");
const ENTITY_CROSSWALK_PATH = path.join(ROOT, "src/data/entityCrosswalk.ts");
const OUT_PATH = path.join(ROOT, "public/data/entity-cache.json");
const USER_AGENT = "BordersOfTime/1.0 (https://www.bordersoftime.com; entity-cache-build)";
/** Long "History" sections can run to 50k+ characters; keep pages readable. */
const MAX_SECTION_CHARS = 12000;
/** Cached entries with at least this many sections are reused unless --full. */
const MIN_GOOD_SECTIONS = 3;
const FULL_REBUILD = process.argv.includes("--full");

function parsePlaceCrosswalk(fileText) {
  const out = [];
  const re = /"([^"]+)"\s*:\s*\{[^{}]*wikidataId:\s*"(Q\d+)"[^{}]*slug:\s*"([^"]+)"[^{}]*\}/g;
  let m;
  while ((m = re.exec(fileText)) !== null) {
    out.push({ name: m[1], qid: m[2], slug: m[3], entityType: "place" });
  }
  return out;
}

/** Mirrors readableNameFromSlug in src/lib/entityResolver.ts. */
function readableSlug(slug) {
  return slug
    .split("-")
    .map((w, i) => {
      if (/^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(w)) return w.toUpperCase();
      if (i > 0 && /^(of|and|the|in|on|at|to)$/i.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function parseEntityCrosswalk(fileText) {
  const out = [];
  const re = /"([^"]+)"\s*:\s*\{\s*wikidataId:\s*"(Q\d+)"\s*,\s*slug:\s*"([^"]+)"\s*,\s*entityType:\s*"(person|event|culture)"([^{}]*)\}/g;
  let m;
  while ((m = re.exec(fileText)) !== null) {
    const explicit = m[5].match(/name:\s*"([^"]+)"/);
    out.push({ name: explicit ? explicit[1] : readableSlug(m[3]), qid: m[2], slug: m[3], entityType: m[4] });
  }
  return out;
}

async function fetchJson(url) {
  for (const delay of [0, 500, 1500, 4000, 9000, 15000]) {
    if (delay) await sleep(delay);
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      });
      if (res.ok) return await res.json();
      console.warn(`Fetch error ${res.status} for ${url.slice(0, 100)}...`);
      if (res.status === 429 || res.status >= 500) continue;
      return null;
    } catch (err) {
      console.warn(`Fetch timeout/network error for ${url.slice(0, 100)}...: ${err.message}`);
      // transient issue — retry
    }
  }
  return null;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Batch-fetch Wikidata entities: qid -> { label, description, enwikiTitle, wikipediaUrl }. */
async function fetchEntitiesBatch(qids) {
  const map = new Map();
  for (const ids of chunk([...new Set(qids)], 50)) {
    const url =
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join("|")}` +
      `&props=labels|descriptions|sitelinks&languages=en&sitefilter=enwiki&format=json&origin=*`;
    const data = await fetchJson(url);
    const entities = data?.entities ?? {};
    for (const [qid, entity] of Object.entries(entities)) {
      if (entity.missing !== undefined) continue;
      const label = entity.labels?.en?.value ?? "";
      const description = entity.descriptions?.en?.value ?? "";
      const enwikiTitle = entity.sitelinks?.enwiki?.title;
      const wikipediaUrl = enwikiTitle
        ? `https://en.wikipedia.org/wiki/${encodeURIComponent(enwikiTitle).replace(/%20/g, "_")}`
        : undefined;
      map.set(qid, { label, description, enwikiTitle, wikipediaUrl });
    }
    await sleep(300);
  }
  return map;
}

function normKey(s) {
  return s.replace(/_/g, " ").trim().toLowerCase();
}

/** Batch-fetch Wikipedia lead extracts: normalised title -> extract string. */
async function fetchExtractsBatch(titles) {
  const map = new Map();
  for (const chunkTitles of chunk([...new Set(titles)], 20)) {
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&titles=${chunkTitles.map(encodeURIComponent).join("|")}` +
      `&prop=extracts&exintro=1&explaintext=1&exlimit=20&redirects=1&format=json&origin=*`;
    const data = await fetchJson(url);
    const query = data?.query ?? {};
    const forward = new Map();
    for (const n of query.normalized ?? []) forward.set(normKey(n.from), n.to);
    for (const r of query.redirects ?? []) {
      for (const [k, v] of forward) if (v === r.from) forward.set(k, r.to);
      forward.set(normKey(r.from), r.to);
    }
    const pagesByTitle = new Map();
    for (const p of Object.values(query.pages ?? {})) {
      if (p && p.title) pagesByTitle.set(normKey(p.title), p);
    }
    for (const input of chunkTitles) {
      const resolvedTitle = forward.get(normKey(input)) ?? input;
      const page = pagesByTitle.get(normKey(resolvedTitle)) ?? pagesByTitle.get(normKey(input));
      const extract = String(page?.extract ?? "").trim();
      if (extract) map.set(normKey(input), extract);
    }
    await sleep(300);
  }
  return map;
}

/**
 * Fetch an article's main sections as plain text in ONE request (the TextExtracts
 * API with section headings kept as "== Heading =="), then split locally. The
 * older approach called the Parse API once per section, six at a time, and got
 * rate-limited (HTTP 429) on a full run.
 */
async function fetchSections(title) {
  // Skip apparatus; keep the article's own top-level sections in order. (An
  // earlier keyword allow-list — "history", "rise", … — dropped every section
  // of articles like the French Revolution, headed "Causes", "The Directory".)
  const SKIP_HEADINGS = /^(see also|notes?|references?|citations?|footnotes|sources|bibliography|further reading|external links|gallery|works cited|general and cited (references|sources)|explanatory notes|in popular culture|popular culture|filmography|discography|selected works|list of)/i;
  const MAX_SECTIONS = 6;
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1` +
    `&exsectionformat=wiki&redirects=1&format=json&origin=*&titles=${encodeURIComponent(title)}`;
  const data = await fetchJson(url);
  const page = Object.values(data?.query?.pages ?? {})[0];
  const text = String(page?.extract ?? "");
  if (!text) return [];

  // Split on top-level "== Heading ==" lines; the lead (before the first) is the summary.
  const parts = text.split(/^==[ \t]*([^=\n][^\n]*?)[ \t]*==[ \t]*$/m);
  const sections = [];
  for (let i = 1; i < parts.length && sections.length < MAX_SECTIONS; i += 2) {
    const heading = parts[i].trim();
    if (SKIP_HEADINGS.test(heading)) continue;
    let content = parts[i + 1]
      .replace(/^=+[ \t]*[^\n]*?[ \t]*=+[ \t]*$/gm, "") // subsection headings
      .replace(/\[(?:\s*\d+\s*)+\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (content.length > MAX_SECTION_CHARS) {
      const cut = content.lastIndexOf(". ", MAX_SECTION_CHARS);
      content = content.slice(0, cut > MAX_SECTION_CHARS / 2 ? cut + 1 : MAX_SECTION_CHARS).trim();
    }
    if (content.length > 100) sections.push({ heading, content });
  }
  return sections;
}

async function main() {
  const placeEntries = parsePlaceCrosswalk(fs.readFileSync(CROSSWALK_PATH, "utf8"));
  const otherEntries = parseEntityCrosswalk(fs.readFileSync(ENTITY_CROSSWALK_PATH, "utf8"));

  // One entry per QID (first occurrence wins — keeps canonical name).
  const byQid = new Map();
  for (const e of [...placeEntries, ...otherEntries]) {
    if (!byQid.has(e.qid)) byQid.set(e.qid, e);
  }
  const entries = [...byQid.values()];

  let previous = {};
  try {
    previous = JSON.parse(fs.readFileSync(OUT_PATH, "utf8")).entries ?? {};
  } catch {
    // no existing cache — build from scratch
  }

  console.log(`Resolving ${entries.length} unique entities…`);
  const entityData = await fetchEntitiesBatch(entries.map((e) => e.qid));

  const titlesToFetch = [];
  for (const e of entries) {
    const d = entityData.get(e.qid);
    if (d?.enwikiTitle) titlesToFetch.push(d.enwikiTitle);
  }
  console.log(`Fetching ${titlesToFetch.length} Wikipedia lead extracts…`);
  const extracts = await fetchExtractsBatch(titlesToFetch);

  console.log(`Fetching extracts and sections for ${entries.length} entities…`);
  const out = { generatedAt: new Date().toISOString(), entries: {} };
  let ok = 0;
  let shortOnly = 0;
  let failed = 0;

  // Fetch in smaller chunks to avoid rate limits
  const CONCURRENCY = 1; // Sequential is safest for high-volume sections
  const results = [];
  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    const slice = entries.slice(i, i + CONCURRENCY);
    const sliceResults = [];
    
    for (const e of slice) {
      const d = entityData.get(e.qid);
      if (!d) {
        sliceResults.push({ qid: e.qid, failed: true });
        continue;
      }

      const prev = previous[e.qid];
      if (!FULL_REBUILD && prev && prev.entityType === e.entityType && (prev.sections?.length ?? 0) >= MIN_GOOD_SECTIONS) {
        sliceResults.push({ qid: e.qid, data: prev, hasExtract: true, reused: true });
        continue;
      }
      const extract = d.enwikiTitle ? extracts.get(normKey(d.enwikiTitle)) : "";
      const t0 = Date.now();
      const sections = d.enwikiTitle ? await fetchSections(d.enwikiTitle) : [];
      console.log(`  ${e.entityType}:${d.label || e.slug} — ${sections.length} sections (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
      
      sliceResults.push({
        qid: e.qid,
        data: {
          qid: e.qid,
          entityType: e.entityType,
          // The site's own display name (crosswalk key, explicit name, or
          // slug) — Wikidata labels can be vandalised and article titles carry
          // disambiguators like "Macedonia (ancient kingdom)".
          name: e.name || d.label || e.slug,
          summary: extract || d.description || "",
          sections,
          wikipediaUrl: d.wikipediaUrl,
        },
        hasExtract: !!extract
      });
      await sleep(200); // Small pause between items in a slice
    }
    
    results.push(...sliceResults);
    // Save progress periodically so an interrupted run keeps what it fetched.
    if (results.filter((r) => !r.reused && !r.failed).length % 10 === 0 && !sliceResults.every((r) => r.reused)) {
      const partial = { generatedAt: new Date().toISOString(), entries: { ...previous } };
      for (const r of results) if (!r.failed) partial.entries[r.qid] = r.data;
      fs.writeFileSync(OUT_PATH, JSON.stringify(partial, null, 2), "utf8");
    }
    if (results.length % 20 === 0) console.log(`(${results.length}/${entries.length})`);
    if (!sliceResults.every((r) => r.reused)) await sleep(1200); // Larger pause between slices
  }
  console.log("\n");

  for (const r of results) {
    if (r.failed) {
      failed += 1;
      continue;
    }
    out.entries[r.qid] = r.data;
    if (!r.hasExtract && r.data.summary) shortOnly += 1;
    ok += 1;
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), "utf8");

  console.log(`Built ${OUT_PATH}`);
  console.log(`Cached entries: ${ok}`);
  console.log(`  with Wikipedia extract: ${ok - shortOnly}`);
  console.log(`  description-only (no extract): ${shortOnly}`);
  console.log(`Failed entries: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
