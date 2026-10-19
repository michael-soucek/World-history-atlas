/**
 * Works out which state held each city in src/data/cities.json in every map
 * snapshot, and writes src/data/cityRulers.json for the /history-of pages.
 *
 * The snapshots are 76 MB together, far too much to search when someone
 * opens a page, so this runs ahead of time. Re-run it when cities.json or
 * the upstream snapshots change:
 *
 *   node scripts/build-city-rulers.mjs [cache-dir]
 *
 * Snapshots are downloaded into cache-dir (default: .cache/basemaps) once and
 * reused. The local 1985 snapshot is read from public/data.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CACHE = process.argv[2] ?? join(ROOT, ".cache/basemaps");
const RAW_BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const LIST_URL = "https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson";

/** "world_bc500.geojson" → -500, "world_1500.geojson" → 1500. */
function yearOf(filename) {
  const m = filename.match(/^world_(bc)?(\d+)\.geojson$/);
  return m ? (m[1] ? -1 : 1) * Number(m[2]) : null;
}

async function loadSnapshots() {
  mkdirSync(CACHE, { recursive: true });
  const files = (await (await fetch(LIST_URL)).json()).map((f) => f.name).filter((n) => yearOf(n) !== null);
  const snapshots = [];
  for (const name of files) {
    const path = join(CACHE, name);
    if (!existsSync(path)) {
      console.log(`Downloading ${name}…`);
      writeFileSync(path, Buffer.from(await (await fetch(`${RAW_BASE}/${name}`)).arrayBuffer()));
    }
    snapshots.push({ year: yearOf(name), path });
  }
  snapshots.push({ year: 1985, path: join(ROOT, "public/data/world_1985.geojson") });
  return snapshots.sort((a, b) => a.year - b.year);
}

// ── Point in polygon (ray casting; holes count as outside) ──
function inRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const inPolygon = (pt, rings) => inRing(pt, rings[0]) && !rings.slice(1).some((hole) => inRing(pt, hole));
function inGeometry(pt, geom) {
  if (!geom) return false;
  if (geom.type === "Polygon") return inPolygon(pt, geom.coordinates);
  if (geom.type === "MultiPolygon") return geom.coordinates.some((p) => inPolygon(pt, p));
  return false;
}

/**
 * Coastlines in the snapshots are coarse, so a harbour city can fall just
 * outside its own country. If the exact point misses, try rings of nearby
 * points out to ~35 km before giving up.
 */
const OFFSETS = [[0, 0]];
for (const r of [0.1, 0.2, 0.3]) {
  for (let k = 0; k < 8; k++) OFFSETS.push([r * Math.cos((k * Math.PI) / 4), r * Math.sin((k * Math.PI) / 4)]);
}

function featureAt(features, lng, lat) {
  for (const [dx, dy] of OFFSETS) {
    const hit = features.find((f) => inGeometry([lng + dx, lat + dy], f.geometry));
    if (hit) return hit;
  }
  return null;
}

const cities = JSON.parse(readFileSync(join(ROOT, "src/data/cities.json"), "utf8"));
const snapshots = await loadSnapshots();
const rows = Object.fromEntries(cities.map((c) => [c.slug, []]));

for (const { year, path } of snapshots) {
  const { features } = JSON.parse(readFileSync(path, "utf8"));
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
const out = {};
for (const [slug, list] of Object.entries(rows)) {
  const spans = [];
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
