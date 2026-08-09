#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CROSSWALK_PATH = path.join(ROOT, "src/data/crosswalk.ts");
const ENTITY_CROSSWALK_PATH = path.join(ROOT, "src/data/entityCrosswalk.ts");
const OUT_PATH = path.join(ROOT, "public/data/entity-cache.json");
const USER_AGENT = "WorldHistoryAtlas/1.0 (entity-cache-build)";

function parsePlaceCrosswalk(fileText) {
  const out = [];
  const re = /"([^"]+)"\s*:\s*\{[^{}]*wikidataId:\s*"(Q\d+)"[^{}]*slug:\s*"([^"]+)"[^{}]*\}/g;
  let m;
  while ((m = re.exec(fileText)) !== null) {
    out.push({ name: m[1], qid: m[2], slug: m[3], entityType: "place" });
  }
  return out;
}

function parseEntityCrosswalk(fileText) {
  const out = [];
  const re = /"([^"]+)"\s*:\s*\{\s*wikidataId:\s*"(Q\d+)"\s*,\s*slug:\s*"([^"]+)"\s*,\s*entityType:\s*"(person|event|culture)"\s*\}/g;
  let m;
  while ((m = re.exec(fileText)) !== null) {
    out.push({ name: m[1], qid: m[2], slug: m[3], entityType: m[4] });
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

/** Fetch curated sections for a Wikipedia title using MediaWiki Parse API. */
async function fetchSections(title) {
  const CLEAN_PIPELINE_VERSION = "2";
  const SECTION_KEYWORDS = [
    "origin", "history", "rise", "formation", "establishment", "foundation", "early",
    "background", "expansion", "height", "golden age", "peak", "decline", "fall",
    "collapse", "legacy", "culture", "government", "economy", "religion", "military",
    "period", "century", "era", "empire", "dynasty",
  ];
  const MAX_SECTIONS = 5;

  const encoded = encodeURIComponent(title);
  const sectionsUrl =
    `https://en.wikipedia.org/w/api.php` +
    `?action=parse&page=${encoded}&prop=sections&redirects=1&format=json&origin=*` +
    `&atlas_clean=${CLEAN_PIPELINE_VERSION}`;

  const raw = await fetchJson(sectionsUrl);
  if (!raw || !raw.parse?.sections) return [];

  const allSections = raw.parse.sections || [];
  const selected = allSections
    .filter(s => s.toclevel === 1)
    .filter(s => {
      const lower = s.line.toLowerCase().replace(/<[^>]+>/g, "");
      return SECTION_KEYWORDS.some(kw => lower.includes(kw));
    })
    .slice(0, MAX_SECTIONS);

  if (selected.length === 0) return [];

  const results = await Promise.all(
    selected.map(async (sec) => {
      const secUrl =
        `https://en.wikipedia.org/w/api.php` +
        `?action=parse&page=${encoded}&prop=text&section=${sec.index}` +
        `&redirects=1&format=json&origin=*` +
        `&atlas_clean=${CLEAN_PIPELINE_VERSION}`;
      const rawSec = await fetchJson(secUrl);
      if (!rawSec || !rawSec.parse?.text?.["*"]) return null;

      const html = rawSec.parse.text["*"];
      const heading = sec.line.replace(/<[^>]+>/g, "").trim();
      
      // Basic tag stripping for the build script
      let content = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<table[^>]*>[\s\S]*?<\/table>/gi, "")
        .replace(/<div[^>]*class="[^"]*thumb[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
        
      // Remove [edit] etc
      content = content.replace(/\[\s*edit\s*\]/gi, "");
      
      return content.length > 100 ? { heading, content } : null;
    })
  );

  return results.filter(Boolean);
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

      const extract = d.enwikiTitle ? extracts.get(normKey(d.enwikiTitle)) : "";
      const sections = d.enwikiTitle ? await fetchSections(d.enwikiTitle) : [];
      
      sliceResults.push({
        qid: e.qid,
        data: {
          qid: e.qid,
          entityType: e.entityType,
          name: d.label || e.name || e.slug,
          summary: extract || d.description || "",
          sections,
          wikipediaUrl: d.wikipediaUrl,
        },
        hasExtract: !!extract
      });
      await sleep(200); // Small pause between items in a slice
    }
    
    results.push(...sliceResults);
    process.stdout.write(".");
    if (results.length % 20 === 0) console.log(` (${results.length}/${entries.length})`);
    await sleep(1200); // Larger pause between slices
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
