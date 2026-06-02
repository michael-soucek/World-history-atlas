#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CROSSWALK_PATH = path.join(ROOT, "src/data/crosswalk.ts");
const REPORTS_DIR = path.join(ROOT, "reports");

const REPO_CONTENTS_URL =
  "https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson";
const RAW_BASE =
  "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";

const WD_USER_AGENT = "WorldHistoryAtlas/1.0 (resolution-audit-full)";

const PLACE_TYPE_IDS = new Set([
  "Q6256", // country
  "Q7275", // state
  "Q48349", // empire
  "Q23616", // caliphate
  "Q164950", // dynasty
  "Q41710", // kingdom
  "Q3024240", // historical country
  "Q15634554", // historical polity
  "Q515", // city
]);

const POLITY_NAME_PATTERN = /(empire|caliphate|kingdom|dynasty|sultanate|republic|state|khanate|commonwealth|duchy|horde|khaganate|shogunate|principality|monarchy|tsardom|electorate|protectorate|confederation|realm)/i;

const SEARCH_PROMISE_CACHE = new Map();
const ENTITY_PROMISE_CACHE = new Map();

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readableNameFromSlug(slug) {
  const spaced = String(slug || "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!spaced) return String(slug || "");

  return spaced
    .split(" ")
    .map((w) => {
      if (/^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(w)) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function normaliseExact(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[–—-]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreNameMatch(name, details) {
  const target = normaliseExact(name);
  const label = normaliseExact(details.label);
  const aliases = details.aliases.map((a) => normaliseExact(a));

  if (label === target || aliases.includes(target)) return 1000;

  const targetTokens = new Set(target.split(" ").filter(Boolean));
  const labelTokens = new Set(label.split(" ").filter(Boolean));
  const overlap = [...targetTokens].filter((t) => labelTokens.has(t)).length;
  const tokenScore = targetTokens.size > 0 ? overlap / targetTokens.size : 0;

  let score = Math.round(tokenScore * 100);
  if (label.startsWith(target) || target.startsWith(label)) score += 60;
  if (aliases.some((a) => a.startsWith(target) || target.startsWith(a))) score += 40;
  return score;
}

function parseFilename(name) {
  const ce = String(name).match(/^world_(\d+)\.geojson$/);
  if (ce) return Number.parseInt(ce[1], 10);
  const bce = String(name).match(/^world_bc(\d+)\.geojson$/);
  if (bce) return -Number.parseInt(bce[1], 10);
  return null;
}

function parseCrosswalkMap(fileText) {
  const out = new Map();
  const re = /"([^"]+)"\s*:\s*\{[^{}]*wikidataId:\s*"(Q\d+)"[^{}]*slug:\s*"([^"]+)"[^{}]*\}/g;
  let m;
  while ((m = re.exec(fileText)) !== null) {
    out.set(m[3], { name: m[1], qid: m[2], slug: m[3] });
  }
  return out;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry(url, timeoutMs = 7000) {
  const delays = [0, 120, 320];

  for (const delayMs of delays) {
    if (delayMs > 0) await sleep(delayMs);

    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          Accept: "application/json",
          "User-Agent": WD_USER_AGENT,
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
      // transient
    }
  }

  return null;
}

async function listSnapshotUrls() {
  const json = await fetchJsonWithRetry(REPO_CONTENTS_URL);
  if (!json || !Array.isArray(json)) return [];

  const years = [];
  for (const file of json) {
    const year = parseFilename(file?.name);
    if (year !== null) years.push(year);
  }

  years.sort((a, b) => a - b);

  return years.map((year) => {
    const filename = year < 0
      ? `world_bc${Math.abs(year)}.geojson`
      : `world_${year}.geojson`;

    return {
      filename,
      rawUrl: `${RAW_BASE}/${filename}`,
    };
  });
}

async function collectAllPlaceSlugs() {
  const snapshots = await listSnapshotUrls();
  const slugToName = new Map();

  for (let i = 0; i < snapshots.length; i += 1) {
    const snap = snapshots[i];
    console.log(`Snapshot ${i + 1}/${snapshots.length}: ${snap.filename}`);

    const data = await fetchJsonWithRetry(snap.rawUrl, 45000);
    const features = data?.features;
    if (!Array.isArray(features)) continue;

    for (const feature of features) {
      const props = feature?.properties ?? {};
      const name = String(props.NAME ?? "").trim();
      const sovereign = String(props.SUBJECTO ?? "").trim();

      if (name) {
        const slug = slugify(name);
        if (slug && !slugToName.has(slug)) slugToName.set(slug, name);
      }

      if (sovereign) {
        const slug = slugify(sovereign);
        if (slug && !slugToName.has(slug)) slugToName.set(slug, sovereign);
      }
    }
  }

  return slugToName;
}

function getEntityIdClaims(entity, prop) {
  const claims = entity?.claims?.[prop] ?? [];
  return claims
    .map((c) => c?.mainsnak?.datavalue?.value?.id)
    .filter((v) => typeof v === "string" && /^Q\d+$/.test(v));
}

async function fetchEntityDetails(qid) {
  if (ENTITY_PROMISE_CACHE.has(qid)) return ENTITY_PROMISE_CACHE.get(qid);

  const promise = (async () => {
    const data = await fetchJsonWithRetry(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
    if (!data || typeof data !== "object") return null;

    const entity = data?.entities?.[qid];
    if (!entity) return null;

    const label = entity?.labels?.en?.value ?? "";
    const aliases = (entity?.aliases?.en ?? []).map((a) => a.value ?? "").filter(Boolean);
    const sitelinks = entity?.sitelinks ?? {};
    const claims = entity?.claims ?? {};

    return {
      qid,
      label,
      aliases,
      hasEnwiki: Boolean(sitelinks.enwiki?.title),
      sitelinksCount: Object.keys(sitelinks).length,
      statementsCount: Object.values(claims).reduce((n, arr) => n + arr.length, 0),
      p31: getEntityIdClaims(entity, "P31"),
    };
  })();

  ENTITY_PROMISE_CACHE.set(qid, promise);
  return promise;
}

async function searchWikidataCandidates(name) {
  const key = normaliseExact(name);
  if (SEARCH_PROMISE_CACHE.has(key)) return SEARCH_PROMISE_CACHE.get(key);

  const promise = (async () => {
    const encoded = encodeURIComponent(name);
    const url =
      `https://www.wikidata.org/w/api.php` +
      `?action=wbsearchentities&search=${encoded}` +
      `&language=en&type=item&limit=6&format=json&origin=*`;

    const json = await fetchJsonWithRetry(url);
    if (!json || typeof json !== "object") return [];

    return (json.search ?? [])
      .map((r) => r.id)
      .filter((id) => typeof id === "string" && /^Q\d+$/.test(id));
  })();

  SEARCH_PROMISE_CACHE.set(key, promise);
  return promise;
}

function isEntityCandidateName(name) {
  return POLITY_NAME_PATTERN.test(String(name || ""));
}

function passesTypeGuard(details) {
  return details.p31.some((cls) => PLACE_TYPE_IDS.has(cls));
}

async function resolveBaseline(slug, readableName, crosswalkBySlug) {
  const cw = crosswalkBySlug.get(slug);
  if (!cw) {
    return {
      resolved: false,
      qid: "",
      hasEnwiki: false,
      status: "FALLBACK",
    };
  }

  const details = await fetchEntityDetails(cw.qid);
  const ok = Boolean(details?.hasEnwiki);

  return {
    resolved: ok,
    qid: cw.qid,
    hasEnwiki: ok,
    status: ok ? "OK" : "FALLBACK",
    label: details?.label || readableName,
  };
}

async function resolveImproved(slug, readableName, crosswalkBySlug) {
  const cw = crosswalkBySlug.get(slug);
  if (cw) {
    const details = await fetchEntityDetails(cw.qid);
    if (details?.hasEnwiki && passesTypeGuard(details)) {
      return {
        resolved: true,
        qid: cw.qid,
        hasEnwiki: true,
        status: "OK",
      };
    }
  }

  const ids = await searchWikidataCandidates(readableName);
  if (ids.length === 0) {
    return {
      resolved: false,
      qid: "",
      hasEnwiki: false,
      status: "FALLBACK",
    };
  }

  const detailList = await Promise.all(ids.map((qid) => fetchEntityDetails(qid)));
  const candidates = detailList
    .filter((d) => d && d.hasEnwiki && passesTypeGuard(d))
    .map((d) => ({
      qid: d.qid,
      score: scoreNameMatch(readableName, d),
      sitelinksCount: d.sitelinksCount,
      statementsCount: d.statementsCount,
      hasEnwiki: true,
    }))
    .filter((c) => c.score >= 40)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.sitelinksCount !== a.sitelinksCount) return b.sitelinksCount - a.sitelinksCount;
      return b.statementsCount - a.statementsCount;
    });

  if (candidates.length === 0) {
    return {
      resolved: false,
      qid: "",
      hasEnwiki: false,
      status: "FALLBACK",
    };
  }

  return {
    resolved: true,
    qid: candidates[0].qid,
    hasEnwiki: true,
    status: "OK",
  };
}

async function runWithConcurrency(items, limit, worker) {
  const out = new Array(items.length);
  let index = 0;

  async function loop() {
    while (true) {
      const i = index;
      index += 1;
      if (i >= items.length) return;
      out[i] = await worker(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => loop()));
  return out;
}

function toCsv(rows) {
  const header = [
    "slug",
    "readableName",
    "baselineResolved",
    "baselineQid",
    "baselineHasEnwiki",
    "baselineStatus",
    "improvedResolved",
    "improvedQid",
    "improvedHasEnwiki",
    "improvedStatus",
  ];

  const lines = [header.join(",")];

  for (const row of rows) {
    const values = [
      row.slug,
      row.readableName,
      row.baselineResolved,
      row.baselineQid,
      row.baselineHasEnwiki,
      row.baselineStatus,
      row.improvedResolved,
      row.improvedQid,
      row.improvedHasEnwiki,
      row.improvedStatus,
    ].map((v) => {
      const s = String(v ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    });

    lines.push(values.join(","));
  }

  return lines.join("\n");
}

async function main() {
  const crosswalkText = fs.readFileSync(CROSSWALK_PATH, "utf8");
  const crosswalkBySlug = parseCrosswalkMap(crosswalkText);

  console.log("Collecting full place slug universe from all historical snapshots...");
  const slugToName = await collectAllPlaceSlugs();

  const allSlugs = [...slugToName.keys()].sort();
  const slugs = allSlugs.filter((slug) => isEntityCandidateName(slugToName.get(slug) || slug));

  console.log(`Collected ${allSlugs.length} unique place slugs.`);
  console.log(`Auditing full entity-candidate slug list: ${slugs.length} slugs.\n`);

  const rows = await runWithConcurrency(slugs, 10, async (slug, i) => {
    if (i === 0 || (i + 1) % 25 === 0) {
      console.log(`Resolving ${i + 1}/${slugs.length} ...`);
    }

    const readableName = readableNameFromSlug(slugToName.get(slug) || slug);
    const before = await resolveBaseline(slug, readableName, crosswalkBySlug);
    const after = await resolveImproved(slug, readableName, crosswalkBySlug);

    return {
      slug,
      readableName,
      baselineResolved: before.resolved,
      baselineQid: before.qid,
      baselineHasEnwiki: before.hasEnwiki,
      baselineStatus: before.status,
      improvedResolved: after.resolved,
      improvedQid: after.qid,
      improvedHasEnwiki: after.hasEnwiki,
      improvedStatus: after.status,
    };
  });

  const baselineFallback = rows
    .filter((r) => !r.baselineResolved)
    .map((r) => r.slug)
    .sort();

  const improvedFallback = rows
    .filter((r) => !r.improvedResolved)
    .map((r) => r.slug)
    .sort();

  const baselineOk = rows.filter((r) => r.baselineResolved).length;
  const improvedOk = rows.filter((r) => r.improvedResolved).length;

  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const csvPath = path.join(REPORTS_DIR, `resolution-audit-full-${timestamp}.csv`);
  const jsonPath = path.join(REPORTS_DIR, `resolution-audit-summary-${timestamp}.json`);

  fs.writeFileSync(csvPath, toCsv(rows), "utf8");
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalSlugsSeen: allSlugs.length,
        totalEntities: rows.length,
        okBefore: baselineOk,
        okAfter: improvedOk,
        fallbackBeforeCount: baselineFallback.length,
        fallbackAfterCount: improvedFallback.length,
        fallbackBefore: baselineFallback,
        fallbackAfter: improvedFallback,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log("\n=== BEFORE / AFTER SUMMARY ===");
  console.log(`Total entities: ${rows.length}`);
  console.log(`# OK before: ${baselineOk}`);
  console.log(`# OK after: ${improvedOk}`);
  console.log(`# FALLBACK before: ${baselineFallback.length}`);
  console.log(`# FALLBACK after: ${improvedFallback.length}`);

  console.log("\n=== FALLBACK LIST (BEFORE) ===");
  for (const slug of baselineFallback) console.log(slug);

  console.log("\n=== FALLBACK LIST (AFTER) ===");
  for (const slug of improvedFallback) console.log(slug);

  console.log("\nAudit artifacts:");
  console.log(`- ${csvPath}`);
  console.log(`- ${jsonPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
