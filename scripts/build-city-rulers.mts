/**
 * Works out which state held each city in src/data/cities.json in every map
 * snapshot, and writes src/data/cityRulers.json for the /history-of pages.
 *
 * The snapshots are 76 MB together, far too much to search when someone
 * opens a page, so this runs ahead of time. Re-run it when cities.json or
 * the upstream snapshots change:
 *
 *   npx tsx scripts/build-city-rulers.mts
 *
 * Reads the snapshots through scripts/lib/snapshots.ts, so the border fixes
 * in src/data/borderFixes.ts apply.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSnapshot, snapshotYears, type Feature } from "./lib/snapshots";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
type Ring = [number, number][];
type Geometry = Feature["geometry"];

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
const inPolygon = (pt: [number, number], rings: Ring[]) => inRing(pt, rings[0]) && !rings.slice(1).some((hole) => inRing(pt, hole));
function inGeometry(pt: [number, number], geom: Geometry) {
  if (!geom) return false;
  if (geom.type === "Polygon") return inPolygon(pt, geom.coordinates as Ring[]);
  if (geom.type === "MultiPolygon") return (geom.coordinates as Ring[][]).some((p) => inPolygon(pt, p));
  return false;
}

/**
 * Coastlines in the snapshots are coarse, so a harbour city can fall just
 * outside its own country. If the exact point misses, try rings of nearby
 * points out to ~35 km before giving up.
 */
const OFFSETS: [number, number][] = [[0, 0]];
for (const r of [0.1, 0.2, 0.3]) {
  for (let k = 0; k < 8; k++) OFFSETS.push([r * Math.cos((k * Math.PI) / 4), r * Math.sin((k * Math.PI) / 4)]);
}

function featureAt(features: Feature[], lng: number, lat: number) {
  for (const [dx, dy] of OFFSETS) {
    const hit = features.find((f) => inGeometry([lng + dx, lat + dy], f.geometry));
    if (hit) return hit;
  }
  return null;
}

interface Row { year: number; name: string | null; sovereign: string | null }
interface Span { from: number; to: number | null; name: string | null; sovereign: string | null }
const cities = JSON.parse(readFileSync(join(ROOT, "src/data/cities.json"), "utf8")) as { slug: string; lng: number; lat: number }[];
const rows: Record<string, Row[]> = Object.fromEntries(cities.map((c) => [c.slug, []]));

for (const year of await snapshotYears()) {
  const { features } = await loadSnapshot(year);
  for (const c of cities) {
    const f = featureAt(features, c.lng, c.lat);
    // "?" marks an unnamed territory in the source data.
    const raw = f?.properties.NAME?.trim();
    const name = raw && raw !== "?" ? raw : null;
    // SUBJECTO is the power the territory answered to, when that differs.
    const subject = f?.properties.SUBJECTO?.trim();
    const sovereign = subject && subject !== "?" && subject !== name ? subject : null;
    rows[c.slug].push({ year, name, sovereign });
  }
  console.log(`✓ ${year}`);
}

// Merge consecutive snapshots with the same ruler into one span.
// `to` is the next snapshot year in which something else is drawn (null: still).
const out: Record<string, Span[]> = {};
for (const [slug, list] of Object.entries(rows)) {
  const spans: Span[] = [];
  for (const r of list) {
    const last = spans.at(-1);
    if (last && last.name === r.name && last.sovereign === r.sovereign) continue;
    if (last) last.to = r.year;
    spans.push({ from: r.year, to: null, name: r.name, sovereign: r.sovereign });
  }
  out[slug] = spans;
}

writeFileSync(join(ROOT, "src/data/cityRulers.json"), JSON.stringify(out) + "\n");
console.log(`Wrote ${cities.length} cities.`);
