/**
 * Works out which state held each city in src/data/cities.json in every map
 * snapshot, and writes src/data/cityRulers.json for the /history-of pages.
 * Does the same for each country's capital in src/data/countries.json
 * (src/data/countryRulers.json, for the /country pages), plus a map view
 * framing the modern country (src/data/countryViews.json).
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
type Point = { slug: string; lng: number; lat: number };
const cities = JSON.parse(readFileSync(join(ROOT, "src/data/cities.json"), "utf8")) as Point[];
const countries = JSON.parse(readFileSync(join(ROOT, "src/data/countries.json"), "utf8")) as Point[];
// Countries are keyed "country:{slug}" so they can't collide with a city.
const points: Point[] = [...cities, ...countries.map((c) => ({ ...c, slug: `country:${c.slug}` }))];
const rows: Record<string, Row[]> = Object.fromEntries(points.map((c) => [c.slug, []]));

/** Bounding box of a geometry's outer rings. */
function bbox(geom: Geometry): [number, number, number, number] {
  let [w, s, e, n] = [180, 90, -180, -90];
  const polys = geom?.type === "Polygon" ? [geom.coordinates as Ring[]] : geom?.type === "MultiPolygon" ? (geom.coordinates as Ring[][]) : [];
  for (const [outer] of polys) for (const [x, y] of outer) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
  return [w, s, e, n];
}

const years = await snapshotYears();
for (const year of years) {
  const { features } = await loadSnapshot(year);
  for (const c of points) {
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

const cityOut = Object.fromEntries(Object.entries(out).filter(([k]) => !k.startsWith("country:")));
const countryOut = Object.fromEntries(Object.entries(out).filter(([k]) => k.startsWith("country:")).map(([k, v]) => [k.slice(8), v]));
writeFileSync(join(ROOT, "src/data/cityRulers.json"), JSON.stringify(cityOut) + "\n");
writeFileSync(join(ROOT, "src/data/countryRulers.json"), JSON.stringify(countryOut) + "\n");

// A map view for each country: the latest snapshot's shape at its capital,
// framed by its bounding box. Small or far-flung states (island chains,
// shapes crossing the antimeridian) fall back to the capital at a fixed zoom.
const { features: modern } = await loadSnapshot(years.at(-1)!);
const views: Record<string, { lat: number; lng: number; zoom: number }> = {};
for (const c of countries) {
  const f = featureAt(modern, c.lng, c.lat);
  const [w, s, e, n] = f ? bbox(f.geometry) : [c.lng, c.lat, c.lng, c.lat];
  const span = Math.max(e - w, (n - s) * 1.4);
  const ok = f && span > 0 && span < 90;
  const zoom = Math.max(2, Math.min(7, Math.log2(360 / span) - 0.6));
  views[c.slug] = ok
    ? { lat: +((s + n) / 2).toFixed(2), lng: +((w + e) / 2).toFixed(2), zoom: +zoom.toFixed(1) }
    : { lat: c.lat, lng: c.lng, zoom: f && span >= 90 ? 3 : 5 };
}
writeFileSync(join(ROOT, "src/data/countryViews.json"), JSON.stringify(views) + "\n");
console.log(`Wrote ${cities.length} cities and ${countries.length} countries.`);
