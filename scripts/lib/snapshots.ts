/**
 * The snapshots as the site shows them: the historical-basemaps files (cached
 * in .cache/basemaps, downloaded on first use; 1985 is the site's own) with
 * the border fixes in src/data/borderFixes.ts applied. Every build script
 * that reads borders goes through here, so the fixes reach the city rulers,
 * place measurements and war zones as well as the map.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { applyBorderFixes, type Feature, type FeatureCollection } from "../../src/lib/borderFixes";

export type { Feature, FeatureCollection };

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const RAW_BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
export const CACHE = join(ROOT, ".cache/basemaps");

const filename = (year: number) => (year < 0 ? `world_bc${-year}.geojson` : `world_${year}.geojson`);

export async function loadSnapshot(year: number, { raw = false } = {}): Promise<FeatureCollection> {
  let path = join(CACHE, filename(year));
  if (year === 1985) path = join(ROOT, "public/data/world_1985.geojson");
  else if (!existsSync(path)) {
    mkdirSync(CACHE, { recursive: true });
    writeFileSync(path, Buffer.from(await (await fetch(`${RAW_BASE}/${filename(year)}`)).arrayBuffer()));
  }
  const fc = JSON.parse(readFileSync(path, "utf8")) as FeatureCollection;
  return raw ? fc : applyBorderFixes(year, fc);
}

/** Every snapshot year, oldest first: the upstream files (as cached) plus the site's own 1985. */
export async function snapshotYears(): Promise<number[]> {
  const yearOf = (name: string) => {
    const m = name.match(/^world_(bc)?(\d+)\.geojson$/);
    return m ? (m[1] ? -1 : 1) * Number(m[2]) : null;
  };
  let names: string[] = existsSync(CACHE) ? readdirSync(CACHE) : [];
  if (names.filter((n) => yearOf(n) !== null).length < 50) {
    const list = (await (await fetch("https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson")).json()) as { name: string }[];
    names = list.map((f) => f.name);
  }
  const years = names.map(yearOf).filter((y): y is number => y !== null);
  return [...new Set([...years, 1985])].sort((a, b) => a - b);
}
