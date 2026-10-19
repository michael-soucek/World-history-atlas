#!/usr/bin/env node
/**
 * Saves the Wikidata facts every page uses — dates, capitals, birthplaces,
 * the lead image and its licence — to public/data/wikidata-store.json, so
 * pages build from a local copy instead of hundreds of live requests.
 *
 * Fetched live during a build, Wikidata rate-limited some of them at random:
 * a page could lose its dates, facts and image (Napoleon's title lost
 * "(1769–1821)"). src/lib/wikidata.ts reads this store first and only asks
 * Wikidata about entities that aren't in it.
 *
 * Batched (50 entities a request), so the whole site takes about a minute:
 *
 *   node scripts/build-wikidata-store.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_PATH = path.join(ROOT, "public/data/wikidata-store.json");
const USER_AGENT = "BordersOfTime/1.0 (https://www.bordersoftime.com; wikidata-store-build)";

/** The properties src/lib/wikidata.ts reads: facts, tagline, map year and image. */
const PROPS = [
  "P18", "P571", "P576", "P36", "P35", "P17", "P910", "P155", "P156",
  "P569", "P570", "P19", "P20", "P106", "P27", "P22", "P25", "P585", "P580", "P582", "P276",
];
/** Properties whose values are other entities, shown by their English name. */
const ENTITY_PROPS = ["P36", "P35", "P17", "P910", "P155", "P156", "P19", "P20", "P106", "P27", "P22", "P25", "P276"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

async function fetchJson(url) {
  for (const delay of [0, 1000, 3000, 8000, 15000]) {
    if (delay) await sleep(delay);
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { Accept: "application/json", "User-Agent": USER_AGENT } });
      if (res.ok) return await res.json();
      console.warn(`HTTP ${res.status} for ${url.slice(0, 90)}…`);
      if (res.status !== 429 && res.status < 500) return null;
    } catch (err) {
      console.warn(`Network error (${err.message}), retrying`);
    }
  }
  return null;
}

/** Every Q-ID the site has a page for: places, people, events, cultures, explorers. */
function siteQids() {
  const files = ["src/data/crosswalk.ts", "src/data/entityCrosswalk.ts", "src/data/voyages.ts"];
  const qids = new Set();
  for (const f of files) for (const m of fs.readFileSync(path.join(ROOT, f), "utf8").matchAll(/wikidataId:\s*"(Q\d+)"/g)) qids.add(m[1]);
  return [...qids];
}

/** Keep only what the site reads: the first few claims of each property, value and rank. */
function trimEntity(entity) {
  const claims = {};
  for (const prop of PROPS) {
    const list = entity.claims?.[prop];
    if (!list?.length) continue;
    claims[prop] = list.slice(0, 4).map((c) => ({ rank: c.rank, mainsnak: { datavalue: { value: c.mainsnak?.datavalue?.value } } }));
  }
  const out = { claims };
  if (entity.labels?.en) out.labels = { en: { value: entity.labels.en.value } };
  if (entity.descriptions?.en) out.descriptions = { en: { value: entity.descriptions.en.value } };
  if (entity.sitelinks?.enwiki) out.sitelinks = { enwiki: { title: entity.sitelinks.enwiki.title } };
  return out;
}

async function fetchEntities(qids, props) {
  const out = {};
  for (const ids of chunk(qids, 50)) {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join("|")}&props=${props}&languages=en&sitefilter=enwiki&format=json`;
    const data = await fetchJson(url);
    if (!data) throw new Error(`Wikidata batch failed (${ids[0]}…); nothing written`);
    for (const [qid, entity] of Object.entries(data.entities ?? {})) if (entity.missing === undefined) out[qid] = entity;
    await sleep(400);
  }
  return out;
}

/** Commons details for each lead image: a 1280px rendition, licence and author. */
async function fetchImages(filenames) {
  const out = {};
  const strip = (s) => {
    if (!s) return undefined;
    const clean = s.replace(/<[^>]+>/g, "").trim();
    const half = clean.length / 2;
    return clean.length && clean.length % 2 === 0 && clean.slice(0, half) === clean.slice(half) ? clean.slice(0, half) : clean;
  };
  for (const names of chunk(filenames, 40)) {
    const titles = names.map((n) => `File:${n}`).join("|");
    const url =
      `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}` +
      `&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1280&iiextmetadatafilter=LicenseShortName|Artist|Credit&format=json`;
    const data = await fetchJson(url);
    if (!data) throw new Error("Commons batch failed; nothing written");
    const byTitle = new Map(Object.values(data.query?.pages ?? {}).map((p) => [p.title, p]));
    const normalized = new Map((data.query?.normalized ?? []).map((n) => [n.from, n.to]));
    for (const name of names) {
      const page = byTitle.get(normalized.get(`File:${name}`) ?? `File:${name}`);
      const info = page?.imageinfo?.[0];
      if (!info?.url) continue;
      out[name] = {
        url: (info.thumburl || info.url).replace(/\?utm_[^#]*$/, ""),
        license: info.extmetadata?.LicenseShortName?.value,
        author: strip(info.extmetadata?.Artist?.value),
        sourceUrl: info.descriptionurl || info.url,
      };
    }
    await sleep(400);
  }
  return out;
}

const qids = siteQids();
console.log(`${qids.length} pages' entities…`);
const raw = await fetchEntities(qids, "labels|descriptions|claims|sitelinks");
const entities = Object.fromEntries(Object.entries(raw).map(([q, e]) => [q, trimEntity(e)]));

// Names for the entities those facts point to (capitals, birthplaces, occupations…).
const linked = new Set();
for (const e of Object.values(entities)) {
  for (const prop of ENTITY_PROPS) {
    for (const c of e.claims[prop] ?? []) {
      const id = c.mainsnak.datavalue.value?.id;
      if (id && !entities[id]) linked.add(id);
    }
  }
}
console.log(`${linked.size} linked entities for their names…`);
const labelled = await fetchEntities([...linked], "labels");
for (const [q, e] of Object.entries(labelled)) entities[q] = { claims: {}, ...(e.labels?.en ? { labels: { en: { value: e.labels.en.value } } } : {}) };

const files = [...new Set(Object.values(entities).map((e) => e.claims.P18?.[0]?.mainsnak.datavalue.value).filter(Boolean))];
console.log(`${files.length} lead images…`);
const images = await fetchImages(files);

fs.writeFileSync(OUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), entities, images }));
console.log(`Wrote ${Object.keys(entities).length} entities and ${Object.keys(images).length} images to ${path.relative(ROOT, OUT_PATH)} (${Math.round(fs.statSync(OUT_PATH).size / 1024)} KB)`);
