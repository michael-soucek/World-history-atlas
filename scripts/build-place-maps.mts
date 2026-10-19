/**
 * Works out how every place in the crosswalk appears across the map
 * snapshots — which years draw it, how large it is in each, who borders it at
 * its largest, and what the map shows in the same spot just before and just
 * after — and writes src/data/placeMaps.json for the "On our maps" section of
 * the /place pages.
 *
 * Like build-city-rulers.mjs this reads all the snapshots (76 MB), far too
 * much per request, so it runs ahead of time. Re-run it when the crosswalk or
 * the upstream snapshots change:
 *
 *   npx tsx scripts/build-place-maps.mts [cache-dir]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as pc from "polyclip-ts";
import { resolveFeature } from "../src/data/crosswalk";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CACHE = process.argv[2] ?? join(ROOT, ".cache/basemaps");
const RAW_BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const LIST_URL = "https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson";

type Ring = [number, number][];
type Geometry = { type: "Polygon"; coordinates: Ring[] } | { type: "MultiPolygon"; coordinates: Ring[][] };
interface Feature {
  properties: { NAME?: string; SUBJECTO?: string };
  geometry: Geometry | null;
}

function yearOf(filename: string): number | null {
  const m = filename.match(/^world_(bc)?(\d+)\.geojson$/);
  return m ? (m[1] ? -1 : 1) * Number(m[2]) : null;
}

async function loadSnapshots() {
  mkdirSync(CACHE, { recursive: true });
  const files = ((await (await fetch(LIST_URL)).json()) as { name: string }[])
    .map((f) => f.name)
    .filter((n) => yearOf(n) !== null);
  const snapshots: { year: number; path: string }[] = [];
  for (const name of files) {
    const path = join(CACHE, name);
    if (!existsSync(path)) {
      console.log(`Downloading ${name}…`);
      writeFileSync(path, Buffer.from(await (await fetch(`${RAW_BASE}/${name}`)).arrayBuffer()));
    }
    snapshots.push({ year: yearOf(name)!, path });
  }
  snapshots.push({ year: 1985, path: join(ROOT, "public/data/world_1985.geojson") });
  return snapshots.sort((a, b) => a.year - b.year);
}

const polygons = (g: Geometry | null): Ring[][] =>
  !g ? [] : g.type === "Polygon" ? [g.coordinates] : g.coordinates;

// ── Area on the sphere (km²), outer ring minus holes ──
const R = 6371.0088;
const rad = (d: number) => (d * Math.PI) / 180;
function ringArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    sum += rad(x2 - x1) * (2 + Math.sin(rad(y1)) + Math.sin(rad(y2)));
  }
  return Math.abs((sum * R * R) / 2);
}
const polygonArea = (p: Ring[]) => Math.max(0, ringArea(p[0]) - p.slice(1).reduce((s, h) => s + ringArea(h), 0));

// ── Point in polygon (ray casting; holes count as outside) ──
function inRing([x, y]: [number, number], ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const inPolygon = (pt: [number, number], p: Ring[]) => inRing(pt, p[0]) && !p.slice(1).some((h) => inRing(pt, h));

/** A point inside the polygon: the bbox centre if it's inside, else a scan. */
function interiorPoint(p: Ring[]): [number, number] {
  const xs = p[0].map((c) => c[0]);
  const ys = p[0].map((c) => c[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const centre: [number, number] = [(x0 + x1) / 2, (y0 + y1) / 2];
  if (inPolygon(centre, p)) return centre;
  for (let n = 4; n <= 32; n *= 2) {
    for (let i = 1; i < n; i++) {
      for (let j = 1; j < n; j++) {
        const pt: [number, number] = [x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * j) / n];
        if (inPolygon(pt, p)) return pt;
      }
    }
  }
  return p[0][0];
}

interface Label {
  name: string;
  slug?: string;
}

/** The name and atlas page the site would show for a snapshot feature. */
function labelOf(f: Feature, year: number): Label | null {
  const raw = f.properties.NAME?.trim();
  const name = raw && raw !== "?" ? raw : null;
  const subject = f.properties.SUBJECTO?.trim();
  const sovereign = subject && subject !== "?" ? subject : null;
  if (!name && !sovereign) return null;
  const entry = resolveFeature(name ?? sovereign!, sovereign ?? name!, year);
  return { name: entry?.name ?? name ?? sovereign!, slug: entry?.slug };
}

function featureAt(features: Feature[], pt: [number, number]) {
  return features.find((f) => polygons(f.geometry).some((p) => inPolygon(pt, p))) ?? null;
}

// Vertices bucketed on a 0.25° grid, for "do these two shapes touch?".
const CELL = 0.25;
const cellKey = (x: number, y: number) => `${Math.floor(x / CELL)},${Math.floor(y / CELL)}`;

interface YearShape {
  km2: number;
  /** Largest polygon, for before/after lookups. */
  main: Ring[];
  cells: Set<string>;
  /** The snapshot names counted under this place (provinces, colonies, khanates…). */
  parts: Set<string>;
}

const snapshots = await loadSnapshots();
const shapes = new Map<string, Map<number, YearShape>>(); // slug → year → shape
const labelsBySlug = new Map<string, string>();
const featuresByYear = new Map<number, Feature[]>();
const ownerCells = new Map<number, Map<string, Set<string>>>(); // year → cell → labels there

for (const { year, path } of snapshots) {
  const { features } = JSON.parse(readFileSync(path, "utf8")) as { features: Feature[] };
  featuresByYear.set(year, features);
  const cells = new Map<string, Set<string>>();
  ownerCells.set(year, cells);
  for (const f of features) {
    const label = labelOf(f, year);
    if (!label) continue;
    const key = label.slug ?? `name:${label.name}`;
    for (const p of polygons(f.geometry)) {
      for (const [x, y] of p[0]) {
        const k = cellKey(x, y);
        if (!cells.has(k)) cells.set(k, new Set());
        cells.get(k)!.add(key);
      }
    }
    if (!label.slug) continue;
    labelsBySlug.set(label.slug, label.name);
    if (!shapes.has(label.slug)) shapes.set(label.slug, new Map());
    const byYear = shapes.get(label.slug)!;
    const s = byYear.get(year) ?? { km2: 0, main: [], cells: new Set<string>(), parts: new Set<string>() };
    const own = f.properties.NAME?.trim();
    if (own && own !== "?") s.parts.add(own);
    for (const p of polygons(f.geometry)) {
      const a = polygonArea(p);
      if (!s.main.length || a > polygonArea(s.main)) s.main = p;
      s.km2 += a;
      for (const [x, y] of p[0]) s.cells.add(cellKey(x, y));
    }
    byYear.set(year, s);
  }
  console.log(`✓ ${year}`);
}

const years = snapshots.map((s) => s.year);
const nameOfKey = (key: string) => (key.startsWith("name:") ? { name: key.slice(5) } : { name: labelsBySlug.get(key) ?? key, slug: key });

// ── Where each place lies today: its largest extent laid over the 2010 map ──
const MODERN_YEAR = 2010;
const modern = featuresByYear.get(MODERN_YEAR)!
  .filter((f) => f.geometry && f.properties.NAME?.trim())
  .map((f) => {
    const geom = polygons(f.geometry);
    const xs = geom.flatMap((p) => p[0].map((c) => c[0]));
    const ys = geom.flatMap((p) => p[0].map((c) => c[1]));
    return { name: f.properties.NAME!.trim(), geom, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
  });

/** Modern countries covering at least 2% of a place's largest extent, largest share first. */
function todayFor(slug: string, year: number): { name: string; share: number }[] {
  const own = featuresByYear.get(year)!.filter((f) => labelOf(f, year)?.slug === slug).flatMap((f) => polygons(f.geometry));
  const total = own.reduce((s, p) => s + polygonArea(p), 0);
  if (!total) return [];
  const xs = own.flatMap((p) => p[0].map((c) => c[0]));
  const ys = own.flatMap((p) => p[0].map((c) => c[1]));
  const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  const shares = new Map<string, number>();
  for (const c of modern) {
    if (c.box[0] > box[2] || box[0] > c.box[2] || c.box[1] > box[3] || box[1] > c.box[3]) continue;
    try {
      const overlap = pc.intersection(own as pc.Geom, c.geom as pc.Geom);
      const km2 = overlap.reduce((s, p) => s + polygonArea(p as Ring[]), 0);
      if (km2) shares.set(c.name, (shares.get(c.name) ?? 0) + km2 / total);
    } catch {
      // A malformed snapshot shape: skip this pair rather than the whole place.
    }
  }
  return [...shares]
    .filter(([, share]) => share >= 0.02)
    .sort((a, b) => b[1] - a[1])
    .map(([name, share]) => ({ name, share: Math.round(share * 100) / 100 }));
}

const out: Record<string, unknown> = {};
for (const [slug, byYear] of shapes) {
  const drawn = [...byYear.keys()].sort((a, b) => a - b);
  const area = drawn.map((y) => [y, Math.round(byYear.get(y)!.km2)] as [number, number]);
  const [peakYear, peakKm2] = area.reduce((best, cur) => (cur[1] > best[1] ? cur : best));

  // Neighbours at the peak: anything with vertices in the same or an adjacent cell.
  const cells = ownerCells.get(peakYear)!;
  const near = new Set<string>();
  for (const k of byYear.get(peakYear)!.cells) {
    const [cx, cy] = k.split(",").map(Number);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) for (const o of cells.get(`${cx + dx},${cy + dy}`) ?? []) near.add(o);
  }
  near.delete(slug);
  // Only neighbours with their own atlas page: unnamed tribal areas and
  // stray colonial specks make a noisy list.
  const neighbours = [...near]
    .filter((k) => !k.startsWith("name:"))
    .map(nameOfKey)
    .sort((a, b) => a.name.localeCompare(b.name));

  // What the map shows at this place's heart in the snapshot before it first
  // appears, and in the snapshot after it last appears.
  const first = drawn[0];
  const last = drawn[drawn.length - 1];
  const prevYear = years[years.indexOf(first) - 1];
  const nextYear = years[years.indexOf(last) + 1];
  const at = (year: number | undefined, pt: [number, number]) => {
    if (year === undefined) return null;
    const f = featureAt(featuresByYear.get(year)!, pt);
    const l = f ? labelOf(f, year) : null;
    return l && l.slug !== slug ? { year, ...l } : null;
  };
  out[slug] = {
    name: labelsBySlug.get(slug),
    years: drawn,
    area,
    peak: { year: peakYear, km2: peakKm2, parts: [...byYear.get(peakYear)!.parts].sort() },
    // Places on the modern map itself would just list themselves.
    today: peakYear >= MODERN_YEAR ? [] : todayFor(slug, peakYear),
    neighbours,
    before: at(prevYear, interiorPoint(byYear.get(first)!.main)),
    after: at(nextYear, interiorPoint(byYear.get(last)!.main)),
  };
}

writeFileSync(join(ROOT, "src/data/placeMaps.json"), JSON.stringify(out) + "\n");
console.log(`Wrote ${Object.keys(out).length} places.`);
