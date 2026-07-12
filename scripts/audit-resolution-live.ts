// fallow-ignore-file unused-file
import fs from "node:fs";
import path from "node:path";
import { clearResolutionCache, readableNameFromSlug, resolveEntityBySlugOrQid } from "@/lib/entityResolver";
import { lookupBySlug } from "@/data/crosswalk";
import { isAggregateLabel } from "@/data/aggregateLabels";
import type { EntityResolutionResult } from "@/lib/entityResolver";

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, "reports");

const REPO_CONTENTS_URL =
  "https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson";
const RAW_BASE =
  "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const WD_USER_AGENT = "WorldHistoryAtlas/1.0 (resolution-live-audit)";

const POLITY_NAME_PATTERN = /(empire|caliphate|kingdom|dynasty|sultanate|republic|state|khanate|commonwealth|duchy|horde|khaganate|shogunate|principality|monarchy|tsardom|electorate|protectorate|confederation|realm)/i;

const ENWIKI_CACHE = new Map<string, Promise<boolean>>();

type Row = {
  slug: string;
  sourceName: string;
  readableName: string;
  aggregate: boolean;
  beforeResolved: boolean;
  beforeQid: string;
  beforeHasEnwiki: boolean;
  beforeStatus: "OK" | "FALLBACK";
  afterResolved: boolean;
  afterQid: string;
  afterHasEnwiki: boolean;
  afterStatus: "OK" | "FALLBACK";
};

function slugify(name: string): string {
  return String(name || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFilename(name: string): number | null {
  const ce = name.match(/^world_(\d+)\.geojson$/);
  if (ce) return Number.parseInt(ce[1], 10);
  const bce = name.match(/^world_bc(\d+)\.geojson$/);
  if (bce) return -Number.parseInt(bce[1], 10);
  return null;
}

function toCsv(rows: Row[]): string {
  const header = [
    "slug",
    "sourceName",
    "readableName",
    "aggregate",
    "beforeResolved",
    "beforeQid",
    "beforeHasEnwiki",
    "beforeStatus",
    "afterResolved",
    "afterQid",
    "afterHasEnwiki",
    "afterStatus",
  ];

  const lines = [header.join(",")];

  for (const row of rows) {
    const values = [
      row.slug,
      row.sourceName,
      row.readableName,
      row.aggregate,
      row.beforeResolved,
      row.beforeQid,
      row.beforeHasEnwiki,
      row.beforeStatus,
      row.afterResolved,
      row.afterQid,
      row.afterHasEnwiki,
      row.afterStatus,
    ].map((v) => {
      const s = String(v ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    });

    lines.push(values.join(","));
  }

  return lines.join("\n");
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry(url: string, timeoutMs = 10000): Promise<any> {
  const delays = [0, 150, 450];

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

      if (res.ok) return await res.json();
      if (res.status === 429 || res.status >= 500) continue;
      return null;
    } catch {
      // retry
    }
  }

  return null;
}

async function listSnapshotUrls(): Promise<Array<{ filename: string; rawUrl: string }>> {
  const json = await fetchJsonWithRetry(REPO_CONTENTS_URL);
  if (!Array.isArray(json)) return [];

  const years: number[] = [];
  for (const file of json) {
    const year = parseFilename(file?.name);
    if (year !== null) years.push(year);
  }

  years.sort((a, b) => a - b);

  return years.map((year) => {
    const filename = year < 0 ? `world_bc${Math.abs(year)}.geojson` : `world_${year}.geojson`;
    return { filename, rawUrl: `${RAW_BASE}/${filename}` };
  });
}

async function collectEntityCandidateSlugs(): Promise<{ allCount: number; slugToName: Map<string, string>; slugs: string[] }> {
  const snapshots = await listSnapshotUrls();
  const slugToName = new Map<string, string>();

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

  const allSlugs = [...slugToName.keys()].sort();
  const slugs = allSlugs.filter((slug) => POLITY_NAME_PATTERN.test(slugToName.get(slug) || slug));

  return {
    allCount: allSlugs.length,
    slugToName,
    slugs,
  };
}

async function hasEnwiki(qid: string): Promise<boolean> {
  if (!qid) return false;
  if (ENWIKI_CACHE.has(qid)) return ENWIKI_CACHE.get(qid)!;

  const p = (async () => {
    const data = await fetchJsonWithRetry(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
    const entity = data?.entities?.[qid];
    return Boolean(entity?.sitelinks?.enwiki?.title);
  })();

  ENWIKI_CACHE.set(qid, p);
  return p;
}

async function runWithConcurrency<T, R>(items: T[], limit: number, worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
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

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function main() {
  console.log("Collecting full place slug universe from all historical snapshots...");
  const { allCount, slugToName, slugs } = await collectEntityCandidateSlugs();
  console.log(`Collected ${allCount} unique place slugs.`);
  console.log(`Auditing full entity-candidate slug list: ${slugs.length} slugs.\n`);

  clearResolutionCache();

  const rows = await runWithConcurrency(slugs, 4, async (slug, index) => {
    if (index === 0 || (index + 1) % 25 === 0) {
      console.log(`Resolving ${index + 1}/${slugs.length} ...`);
    }

    const sourceName = String(slugToName.get(slug) || "").trim();
    const readableName = sourceName || readableNameFromSlug(slug);
    const aggregate = isAggregateLabel(sourceName || readableName);

    const baselineEntry = lookupBySlug(slug);
    const beforeResolved = Boolean(baselineEntry);
    const beforeQid = baselineEntry?.wikidataId ?? "";
    const beforeHasEnwiki = beforeQid ? await hasEnwiki(beforeQid) : false;

    const afterRes = await withTimeout<EntityResolutionResult>(
      resolveEntityBySlugOrQid(slug, "place", {
        sourceName: sourceName || undefined,
      }),
      25000,
      { resolved: null, reason: "query-failed" },
    );
    const afterQid = afterRes.resolved?.wikidataId ?? "";
    const afterResolved = Boolean(afterQid);
    const afterHasEnwiki = afterQid ? await hasEnwiki(afterQid) : false;

    return {
      slug,
      sourceName,
      readableName,
      aggregate,
      beforeResolved,
      beforeQid,
      beforeHasEnwiki,
      beforeStatus: beforeResolved ? "OK" : "FALLBACK",
      afterResolved,
      afterQid,
      afterHasEnwiki,
      afterStatus: afterResolved ? "OK" : "FALLBACK",
    } satisfies Row;
  });

  const aggregateLabels = rows.filter((r) => r.aggregate).map((r) => r.slug).sort();

  const beforeFallback = rows
    .filter((r) => !r.beforeResolved && !r.aggregate)
    .map((r) => r.slug)
    .sort();
  const afterFallback = rows
    .filter((r) => !r.afterResolved && !r.aggregate)
    .map((r) => r.slug)
    .sort();

  const okBefore = rows.filter((r) => r.beforeResolved && !r.aggregate).length;
  const okAfter = rows.filter((r) => r.afterResolved && !r.aggregate).length;
  const countableEntities = rows.filter((r) => !r.aggregate).length;

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const csvPath = path.join(REPORTS_DIR, `resolution-audit-live-${timestamp}.csv`);
  const jsonPath = path.join(REPORTS_DIR, `resolution-audit-live-summary-${timestamp}.json`);

  fs.writeFileSync(csvPath, toCsv(rows), "utf8");
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalSlugsSeen: allCount,
        totalEntities: rows.length,
        countableEntities,
        aggregateExcludedCount: aggregateLabels.length,
        aggregateExcluded: aggregateLabels,
        okBefore,
        okAfter,
        fallbackBeforeCount: beforeFallback.length,
        fallbackAfterCount: afterFallback.length,
        fallbackBefore: beforeFallback,
        fallbackAfter: afterFallback,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log("\n=== BEFORE / AFTER SUMMARY ===");
  console.log(`Total entities: ${rows.length}`);
  console.log(`Aggregate labels excluded: ${aggregateLabels.length}`);
  console.log(`Countable entities: ${countableEntities}`);
  console.log(`# OK before: ${okBefore}`);
  console.log(`# OK after: ${okAfter}`);
  console.log(`# FALLBACK before: ${beforeFallback.length}`);
  console.log(`# FALLBACK after: ${afterFallback.length}`);

  console.log("\n=== FALLBACK LIST (BEFORE) ===");
  for (const slug of beforeFallback) console.log(slug);

  console.log("\n=== FALLBACK LIST (AFTER) ===");
  for (const slug of afterFallback) console.log(slug);

  console.log("\n=== AGGREGATE LABELS (EXCLUDED) ===");
  for (const slug of aggregateLabels) console.log(slug);

  console.log("\nAudit artifacts:");
  console.log(`- ${csvPath}`);
  console.log(`- ${jsonPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
