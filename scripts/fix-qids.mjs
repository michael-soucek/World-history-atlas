#!/usr/bin/env node
/**
 * fix-qids.mjs
 *
 * The QIDs in src/data/crosswalk.ts and src/data/entityCrosswalk.ts are corrupted
 * (shuffled to unrelated Wikidata items). The NAME fields are correct, however.
 *
 * This script resolves the canonical QID for each entry deterministically:
 *   name -> English Wikipedia article (redirects followed) -> pageprops.wikibase_item
 * Wikipedia article titles are canonical, so this yields the correct QID.
 *
 * It then rewrites the wikidataId values in both crosswalk files in place and
 * writes a report to reports/qid-corrections.json.
 *
 * Pass --dry to only write the report without editing source files.
 *
 * Usage: node scripts/fix-qids.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = process.cwd();
const CROSSWALK_PATH = path.join(ROOT, "src/data/crosswalk.ts");
const ENTITY_CROSSWALK_PATH = path.join(ROOT, "src/data/entityCrosswalk.ts");
const REPORT_PATH = path.join(ROOT, "reports/qid-corrections.json");
const UA = "WorldHistoryAtlas/1.0 (qid-fix)";
const DRY = process.argv.includes("--dry");

/**
 * Explicit article-title overrides where the crosswalk name does not equal the
 * canonical English Wikipedia title (or is ambiguous).
 */
const TITLE_OVERRIDES = {
  // places (keyed by crosswalk name)
  "Aztec Empire": "Aztec Empire",
  "Aztec": "Aztec Empire",
  "Macedonian Empire": "Macedonia (ancient kingdom)",
  "Frankish Kingdom": "Francia",
  "Manchu Empire": "Qing dynasty",
  "Joseon dynasty": "Joseon",
  "Confederate States": "Confederate States of America",
  "PolishLithuanian Commonwealth": "Polish–Lithuanian Commonwealth",
  "Polish-Lithuanian Commonwealth": "Polish–Lithuanian Commonwealth",
  "Safavid Empire": "Safavid Iran",
  "Safavid dynasty": "Safavid dynasty",
  // entities (keyed by slug)
  "tamerlane": "Timur",
  "attila-the-hun": "Attila",
  "constantine-i": "Constantine the Great",
  "napoleon": "Napoleon",
  "fall-of-rome": "Fall of the Western Roman Empire",
  "feudal-japan": "History of Japan",
};

/** Turn a kebab slug into a display/title guess, e.g. genghis-khan -> Genghis Khan. */
function humaniseSlug(slug) {
  const small = new Set(["of", "the", "and", "in", "on", "to", "a", "an", "de", "for"]);
  return slug
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((w, i) => {
      if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(w)) return w.toUpperCase();
      if (i > 0 && small.has(w.toLowerCase())) return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

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
  for (const delay of [0, 500, 1500, 4000, 9000]) {
    if (delay) await sleep(delay);
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: { Accept: "application/json", "User-Agent": UA },
      });
      if (res.ok) return await res.json();
      if (res.status === 429 || res.status >= 500) continue;
      return null;
    } catch {
      // retry
    }
  }
  return null;
}

/** name -> { qid, title, isDisambig } via Wikipedia pageprops. */
async function resolveByTitle(title) {
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
    `&prop=pageprops&ppprop=wikibase_item|disambiguation&redirects=1&format=json&origin=*`;
  const data = await fetchJson(url);
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || "missing" in page) return null;
  const qid = page.pageprops?.wikibase_item;
  if (!qid) return null;
  return {
    qid,
    title: page.title,
    isDisambig: page.pageprops && "disambiguation" in page.pageprops,
  };
}

function normKey(s) {
  return s.replace(/_/g, " ").trim().toLowerCase();
}

/**
 * Batch-resolve many titles at once (Wikipedia allows up to 50 titles/request).
 * Returns a Map keyed by normalised *input* title -> { qid, title, isDisambig }.
 */
async function resolveTitlesBatch(titles) {
  const result = new Map();
  const unique = [...new Set(titles)];
  for (let i = 0; i < unique.length; i += 40) {
    const chunk = unique.slice(i, i + 40);
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&titles=${chunk.map(encodeURIComponent).join("|")}` +
      `&prop=pageprops&ppprop=wikibase_item|disambiguation&redirects=1&format=json&origin=*`;
    const data = await fetchJson(url);
    const query = data?.query ?? {};
    // Map input title -> canonical page title through normalized + redirects.
    const forward = new Map(); // normalised input -> resolved page title
    for (const n of query.normalized ?? []) forward.set(normKey(n.from), n.to);
    for (const r of query.redirects ?? []) {
      // redirect.from may itself be a normalized value
      for (const [k, v] of forward) if (v === r.from) forward.set(k, r.to);
      forward.set(normKey(r.from), r.to);
    }
    const pagesByTitle = new Map();
    for (const p of Object.values(query.pages ?? {})) {
      if (p && p.title) pagesByTitle.set(normKey(p.title), p);
    }
    for (const input of chunk) {
      const resolvedTitle = forward.get(normKey(input)) ?? input;
      const page = pagesByTitle.get(normKey(resolvedTitle)) ?? pagesByTitle.get(normKey(input));
      if (!page || "missing" in page) continue;
      const qid = page.pageprops?.wikibase_item;
      if (!qid) continue;
      result.set(normKey(input), {
        qid,
        title: page.title,
        isDisambig: page.pageprops && "disambiguation" in page.pageprops,
      });
    }
    await sleep(300);
  }
  return result;
}

/** Confirm a QID's live English label for the report. */
async function labelFor(qid) {
  const data = await fetchJson(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
  return data?.entities?.[qid]?.labels?.en?.value ?? "";
}

async function main() {
  let placeText = fs.readFileSync(CROSSWALK_PATH, "utf8");
  let entityText = fs.readFileSync(ENTITY_CROSSWALK_PATH, "utf8");

  const places = parsePlaceCrosswalk(placeText);
  const others = parseEntityCrosswalk(entityText);
  const all = [...places, ...others];

  const corrections = [];
  const problems = [];

  // Compute the title guess for every entry, then batch-resolve.
  const withTitles = all.map((e) => {
    const nameGuess = e.entityType === "place" ? e.name : humaniseSlug(e.name);
    const title = TITLE_OVERRIDES[e.name] ?? TITLE_OVERRIDES[e.slug] ?? nameGuess;
    return { ...e, title };
  });
  const resolved = await resolveTitlesBatch(withTitles.map((e) => e.title));

  for (const e of withTitles) {
    const res = resolved.get(normKey(e.title));
    if (!res) {
      problems.push({ ...e, error: "no-article" });
      process.stdout.write(`\u2717 ${e.entityType} "${e.name}" (title "${e.title}") \u2014 no article\n`);
      continue;
    }
    if (res.isDisambig) {
      problems.push({ ...e, error: "disambiguation", article: res.title, qid: res.qid });
      process.stdout.write(`? ${e.entityType} "${e.name}" \u2014 "${res.title}" is a disambiguation page (${res.qid})\n`);
      continue;
    }
    const changed = res.qid !== e.qid;
    corrections.push({
      entityType: e.entityType,
      name: e.name,
      slug: e.slug,
      oldQid: e.qid,
      newQid: res.qid,
      article: res.title,
      changed,
    });
    if (changed) {
      process.stdout.write(`\u2713 ${e.entityType} "${e.name}": ${e.qid} -> ${res.qid} (${res.title})\n`);
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), corrections, problems }, null, 2));

  const changedCount = corrections.filter((c) => c.changed).length;
  process.stdout.write(`\n${changedCount} QIDs need correction, ${problems.length} problems, ${corrections.length} resolved.\n`);
  process.stdout.write(`Report: ${REPORT_PATH}\n`);

  if (DRY) {
    process.stdout.write("Dry run — source files not modified.\n");
    return;
  }

  // Apply corrections by replacing the exact wikidataId within each entry's braces.
  // We match on the unique combination of the OLD qid + slug to avoid collisions.
  let placeEdits = 0;
  let entityEdits = 0;
  for (const c of corrections) {
    if (!c.changed) continue;
    if (c.entityType === "place") {
      // Replace `wikidataId: "OLD"` only within the object that also has this slug.
      const re = new RegExp(
        `(wikidataId:\\s*")${c.oldQid}("[^{}]*slug:\\s*"${c.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}")`,
      );
      const before = placeText;
      placeText = placeText.replace(re, `$1${c.newQid}$2`);
      if (placeText !== before) placeEdits += 1;
      else process.stdout.write(`   ! could not apply place edit for ${c.name} (${c.oldQid})\n`);
    } else {
      const re = new RegExp(
        `(wikidataId:\\s*")${c.oldQid}("\\s*,\\s*slug:\\s*"${c.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}")`,
      );
      const before = entityText;
      entityText = entityText.replace(re, `$1${c.newQid}$2`);
      if (entityText !== before) entityEdits += 1;
      else process.stdout.write(`   ! could not apply entity edit for ${c.name} (${c.oldQid})\n`);
    }
  }

  fs.writeFileSync(CROSSWALK_PATH, placeText, "utf8");
  fs.writeFileSync(ENTITY_CROSSWALK_PATH, entityText, "utf8");
  process.stdout.write(`Applied ${placeEdits} place edits, ${entityEdits} entity edits.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
