import { NextResponse } from "next/server";

const REPO_CONTENTS_URL =
  "https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson";

const RAW_BASE =
  "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";

// ── Parse a filename like "world_1700.geojson" or "world_bc500.geojson" ──
function parseFilename(name: string): number | null {
  // CE years
  const ce = name.match(/^world_(\d+)\.geojson$/);
  if (ce) return parseInt(ce[1], 10);
  // BCE years  (negative)
  const bce = name.match(/^world_bc(\d+)\.geojson$/);
  if (bce) return -parseInt(bce[1], 10);
  return null;
}

export interface YearManifestEntry {
  snapshotYear: number;
  filename: string;
  rawUrl: string;
  validFrom: number;
  validTo: number; // exclusive
}

export interface YearManifest {
  /** Snapshot entries, sorted ascending by year. */
  snapshots: YearManifestEntry[];
  /** Every integer year → index into `snapshots`. */
  yearToSnapshot: Record<number, number>;
  /** Full range covered. */
  minYear: number;
  maxYear: number;
  generatedAt: string;
}

let cachedManifest: YearManifest | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 h

export async function buildManifest(): Promise<YearManifest> {
  const now = Date.now();
  if (cachedManifest && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedManifest;
  }

  const res = await fetch(REPO_CONTENTS_URL, {
    headers: {
      "User-Agent": "WorldHistoryAtlas/1.0",
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}`);
  }

  const files = (await res.json()) as Array<{ name: string }>;

  // Parse and sort snapshot years
  const snapshotYears: number[] = [];
  for (const { name } of files) {
    const year = parseFilename(name);
    if (year !== null) snapshotYears.push(year);
  }
  snapshotYears.sort((a, b) => a - b);

  const snapshots: YearManifestEntry[] = snapshotYears.map((year, i) => {
    const nextYear = snapshotYears[i + 1] ?? year + 1;
    const filename = year < 0
      ? `world_bc${Math.abs(year)}.geojson`
      : `world_${year}.geojson`;
    return {
      snapshotYear: year,
      filename,
      rawUrl: `${RAW_BASE}/${filename}`,
      validFrom: year,
      validTo: nextYear,
    };
  });

  const minYear = snapshotYears[0];
  const maxYear = snapshotYears[snapshotYears.length - 1];

  // Build year→snapshot index for every year in range
  // (avoid materializing millions of entries; just store the actual snapshot years)
  // The yearToSnapshot map is sparse: only keys that are snapshot years map to indices.
  // The runtime `bordersForYear` function does a binary search anyway.
  const yearToSnapshot: Record<number, number> = {};
  for (let i = 0; i < snapshotYears.length; i++) {
    yearToSnapshot[snapshotYears[i]] = i;
  }

  const manifest: YearManifest = {
    snapshots,
    yearToSnapshot,
    minYear,
    maxYear,
    generatedAt: new Date().toISOString(),
  };

  cachedManifest = manifest;
  cacheTimestamp = now;
  return manifest;
}

/**
 * Find the snapshot index that covers `year` (binary search on sorted snapshot years).
 */
export function snapshotIndexForYear(snapshots: YearManifestEntry[], year: number): number {
  let lo = 0;
  let hi = snapshots.length - 1;
  let best = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (snapshots[mid].validFrom <= year) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    const manifest = await buildManifest();
    return NextResponse.json(manifest, {
      headers: { "Cache-Control": "public, max-age=21600, s-maxage=21600" },
    });
  } catch (err) {
    console.error("[manifest]", err);
    return NextResponse.json(
      { error: "Failed to build year manifest" },
      { status: 500 }
    );
  }
}
