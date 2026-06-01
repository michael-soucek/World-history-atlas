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

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const delays = [0, 150, 450];
  for (const delayMs of delays) {
    if (delayMs > 0) await sleep(delayMs);

    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
      });

      if (res.ok) {
        try {
          return await res.json();
        } catch {
          return null;
        }
      }

      if (res.status === 429 || res.status >= 500) continue;
      return null;
    } catch {
      // transient network issue
    }
  }

  return null;
}

async function fetchEntityData(qid) {
  const data = await fetchJson(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
  if (!data || typeof data !== "object") return null;
  const entity = data.entities?.[qid];
  if (!entity) return null;

  const label = entity.labels?.en?.value ?? "";
  const description = entity.descriptions?.en?.value ?? "";
  const enwikiTitle = entity.sitelinks?.enwiki?.title;
  const wikipediaUrl = enwikiTitle
    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(enwikiTitle).replace(/%20/g, "_")}`
    : undefined;

  return { label, description, enwikiTitle, wikipediaUrl };
}

async function fetchWikipediaSummary(title) {
  const encoded = encodeURIComponent(title);
  const url =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query&titles=${encoded}` +
    `&prop=extracts|info&exintro=1&explaintext=1&inprop=url&redirects=1` +
    `&format=json&origin=*`;

  const data = await fetchJson(url);
  if (!data || typeof data !== "object") return "";

  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || page.missing) return "";

  return String(page.extract ?? "").trim();
}

async function main() {
  const placeText = fs.readFileSync(CROSSWALK_PATH, "utf8");
  const entityText = fs.readFileSync(ENTITY_CROSSWALK_PATH, "utf8");

  const placeEntries = parsePlaceCrosswalk(placeText);
  const otherEntries = parseEntityCrosswalk(entityText);
  const entries = [...placeEntries, ...otherEntries];
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : entries.length;
  const selectedEntries = entries.slice(0, Math.max(0, limit));

  const out = {
    generatedAt: new Date().toISOString(),
    entries: {},
  };

  let ok = 0;
  let failed = 0;

  for (let i = 0; i < selectedEntries.length; i += 1) {
    const entry = selectedEntries[i];

    if (i % 20 === 0) {
      console.log(`Progress: ${i}/${selectedEntries.length}`);
    }

    // Preserve first success per QID to avoid duplicate fetch work.
    if (out.entries[entry.qid]) continue;

    const entity = await fetchEntityData(entry.qid);
    if (!entity) {
      failed += 1;
      continue;
    }

    let summary = entity.description || "";
    if (entity.enwikiTitle) {
      const wikiSummary = await fetchWikipediaSummary(entity.enwikiTitle);
      if (wikiSummary) summary = wikiSummary;
    }

    out.entries[entry.qid] = {
      qid: entry.qid,
      entityType: entry.entityType,
      name: entity.label || entry.name || entry.slug,
      summary,
      wikipediaUrl: entity.wikipediaUrl,
    };

    ok += 1;
    await sleep(40);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), "utf8");

  console.log(`Built ${OUT_PATH}`);
  console.log(`Input entries: ${selectedEntries.length}`);
  console.log(`Cached entries: ${ok}`);
  console.log(`Failed entries: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
