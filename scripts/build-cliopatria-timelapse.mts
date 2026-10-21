/**
 * Builds the year-by-year "borders over time" data from Cliopatria (Seshat
 * Global History Databank, CC BY 4.0), which records every polity's borders
 * with the range of years each shape applies to — so a map can be drawn for
 * any single year, not just the atlas's 50 snapshot years.
 *
 * For each time-lapse in src/data/timelapses.ts it writes:
 *   public/timelapse-data/{slug}.json  TopoJSON of every shape in the region
 *                                      (clipped, simplified), each tagged with
 *                                      its first and last year, plus labels;
 *   src/data/timelapseFacts.json       the years the map changes, the largest
 *                                      states and what appears or vanishes.
 *
 * Get the data first (git-ignored):
 *   mkdir -p .cache/cliopatria && cd .cache/cliopatria
 *   curl -LO https://github.com/Seshat-Global-History-Databank/cliopatria/raw/main/cliopatria.geojson.zip && unzip cliopatria.geojson.zip
 * Then: npx tsx scripts/build-cliopatria-timelapse.mts [slug…]
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as pc from "polyclip-ts";
import polylabel from "polylabel";
import { resolveFeature } from "../src/data/crosswalk";
import { getSovereignColor } from "../src/data/sovereignColors";
import { TIMELAPSES, TIMELAPSE_END, type Bbox, type TimelapseFacts, type TimelapseEvent, type TimelapseLeaders } from "../src/data/timelapses";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CACHE = join(ROOT, ".cache/cliopatria");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
/** States at least this large inside the frame count for "appeared" / "gone". */
const BIG_KM2 = 100_000;
const TOP = 4;

type Ring = [number, number][];
type Geometry = { type: "Polygon"; coordinates: Ring[] } | { type: "MultiPolygon"; coordinates: Ring[][] };
interface Row {
  type: "Feature";
  properties: { Name: string; FromYear: number; ToYear: number; Type: string; MemberOf: string; Wikipedia: string };
  geometry: Geometry | null;
}

const polygons = (g: Geometry | null): Ring[][] => (!g ? [] : g.type === "Polygon" ? [g.coordinates] : g.coordinates);

// Area on the sphere (km²), outer ring minus holes — as in build-place-maps.mts.
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

function bboxOf(g: Geometry | null): Bbox | null {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of polygons(g)) for (const [x, y] of p[0]) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return x0 === Infinity ? null : [x0, y0, x1, y1];
}
const overlaps = (a: Bbox, b: Bbox) => !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]);

/** The polygons of a shape inside the bbox. */
function clipTo(p: Ring[], [w, s, e, n]: Bbox): Ring[][] {
  const b = bboxOf({ type: "Polygon", coordinates: p })!;
  if (!overlaps(b, [w, s, e, n])) return [];
  if (b[0] >= w && b[2] <= e && b[1] >= s && b[3] <= n) return [p];
  try {
    return pc.intersection(p as pc.Geom, [[[w, s], [e, s], [e, n], [w, n], [w, s]]] as pc.Geom) as Ring[][];
  } catch {
    return [];
  }
}

const pad = ([w, s, e, n]: Bbox, k: number): Bbox => {
  const dx = (e - w) * k, dy = (n - s) * k;
  return [Math.max(-180, w - dx), Math.max(-85, s - dy), Math.min(180, e + dx), Math.min(85, n + dy)];
};

/** Ring area in square degrees (signed), for dropping specks too small to see. */
function planarArea(ring: Ring): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
  return a / 2;
}

/** Douglas–Peucker, keeping the ring closed. */
function simplify(ring: Ring, tol: number): Ring {
  if (ring.length <= 4) return ring;
  const keep = new Uint8Array(ring.length);
  keep[0] = keep[ring.length - 1] = 1;
  const stack: [number, number][] = [[0, ring.length - 1]];
  const t2 = tol * tol;
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = ring[a], [bx, by] = ring[b];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let far = -1, farD = t2;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = ring[i];
      let d: number;
      if (!len2) d = (px - ax) ** 2 + (py - ay) ** 2;
      else {
        const k = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
        d = (px - ax - k * dx) ** 2 + (py - ay - k * dy) ** 2;
      }
      if (d > farD) { farD = d; far = i; }
    }
    if (far >= 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  // A closed ring's first and last points coincide, so split at the point farthest from the start too.
  const out = ring.filter((_, i) => keep[i]);
  if (out.length < 4) {
    let far = 0, farD = -1;
    for (let i = 1; i < ring.length - 1; i++) {
      const d = (ring[i][0] - ring[0][0]) ** 2 + (ring[i][1] - ring[0][1]) ** 2;
      if (d > farD) { farD = d; far = i; }
    }
    return [ring[0], ...simplify(ring.slice(0, far + 1), tol).slice(1, -1), ring[far], ...simplify(ring.slice(far), tol).slice(1)];
  }
  return out;
}

/** "(British Empire)" → "British Empire". */
const plain = (s: string) => s.replace(/^\((.*)\)$/, "$1").trim();

console.log("reading Cliopatria…");
const file = readdirSync(CACHE).find((f) => f.endsWith(".geojson"));
if (!file) throw new Error(`No Cliopatria GeoJSON in ${CACHE}: see the header of this script`);
const rows = (JSON.parse(readFileSync(join(CACHE, file), "utf8")) as { features: Row[] }).features
  // Drawn: the polities themselves. "(Grouped)" records are unions of their
  // members (empires, alliances) and would be drawn twice; they colour the members instead.
  .filter((r) => r.properties.Type === "POLITY" && !r.properties.Name.startsWith("(") && r.geometry);
const boxes = rows.map((r) => bboxOf(r.geometry));
console.log(`${rows.length} shapes`);

/** The empire a polity belongs to, for its colour and for "largest" (British Raj → British Empire). */
const groupOf = (r: Row) => plain(r.properties.MemberOf.split(";")[0] || r.properties.Name);

const linkCache = new Map<string, string | undefined>();
function slugFor(name: string, year: number): string | undefined {
  const key = `${name}|${Math.round(year / 50)}`;
  if (!linkCache.has(key)) linkCache.set(key, resolveFeature(name, name, year)?.slug);
  return linkCache.get(key);
}
const named = (name: string, year: number) => {
  const slug = slugFor(name, year);
  return slug ? { name, slug } : { name };
};

mkdirSync(join(ROOT, "public/timelapse-data"), { recursive: true });
const factsPath = join(ROOT, "src/data/timelapseFacts.json");
const out: Record<string, TimelapseFacts> = existsSync(factsPath) && only.length ? JSON.parse(readFileSync(factsPath, "utf8")) : {};
/** Captions for the videos where the portrait frame differs from the page's (git-ignored; read by build-timelapse-video.mts). */
const videoFactsPath = join(CACHE, "video-facts.json");
const videoOut: Record<string, TimelapseFacts> = existsSync(videoFactsPath) && only.length ? JSON.parse(readFileSync(videoFactsPath, "utf8")) : {};

interface InView { n: string; g: string; f: number; t: number; km2: number; tallKm2: number }

/** Walk every year: when the map changes, what appears or vanishes, and who holds the most land in the frame. */
function factsFor(from: number, inView: InView[], area: "km2" | "tallKm2") {
  const years: number[] = [];
  for (let y = from; y <= TIMELAPSE_END; y++) if (y !== 0) years.push(y); // no year 0
  const changes: number[] = []; // years the map differs from the year before
  const events: TimelapseEvent[] = [];
  const leaders: TimelapseLeaders[] = [];
  let prevShapes = "";
  let prevAll = new Set<string>();
  let prevBig = new Set<string>();
  let prevTop = "";
  for (const y of years) {
    const alive = inView.filter((s) => s[area] > 0 && s.f <= y && s.t >= y);
    const key = alive.map((s) => `${s.n}:${s.f}`).sort().join("|");
    if (key !== prevShapes && y !== from) changes.push(y);
    prevShapes = key;
    const byName = new Map<string, number>();
    const byGroup = new Map<string, number>();
    for (const s of alive) {
      byName.set(s.n, (byName.get(s.n) ?? 0) + s[area]);
      byGroup.set(s.g, (byGroup.get(s.g) ?? 0) + s[area]);
    }
    const all = new Set(byName.keys());
    const big = new Set([...byName].filter(([, a]) => a >= BIG_KM2).map(([n]) => n));
    if (y !== from) {
      // "Appeared" = large now and not on the map at all last year; "gone" the reverse.
      const appeared = [...big].filter((n) => !prevAll.has(n));
      const gone = [...prevBig].filter((n) => !all.has(n));
      if (appeared.length || gone.length) events.push({ year: y, appeared: appeared.map((n) => named(n, y)), gone: gone.map((n) => named(n, y - 1)) });
    }
    prevAll = all;
    prevBig = big;
    const top = [...byGroup].sort((a, b) => b[1] - a[1]).slice(0, TOP);
    const topKey = top.map(([g]) => g).join("|");
    if (topKey !== prevTop) leaders.push({ year: y, largest: top.map(([g, a]) => ({ ...named(g, y), km2: Math.round(a / 1000) * 1000 })) });
    prevTop = topKey;
  }
  return { years, changes, events, leaders };
}

for (const t of TIMELAPSES.filter((t) => !only.length || only.includes(t.slug))) {
  const view = t.bbox;
  const videoBox = t.videoBbox ?? t.tallBbox;
  const union = [t.tallBbox, t.videoBbox].reduce<Bbox>((u, b) => (b ? [Math.min(u[0], b[0]), Math.min(u[1], b[1]), Math.max(u[2], b[2]), Math.max(u[3], b[3])] : u), view);
  const drawn = pad(union, 0.7);
  const picked = rows
    .map((r, i) => ({ r, b: boxes[i] }))
    .filter(({ r, b }) => b && overlaps(b, drawn) && r.properties.ToYear >= t.from && r.properties.FromYear <= TIMELAPSE_END)
    .map(({ r }) => r);

  // Clip to the drawn area, simplify to the map's scale and round to a grid;
  // the browser rebuilds GeoJSON from the integer rings.
  const degPerPx = (view[2] - view[0]) / 1600;
  const unit = +(degPerPx / 2).toPrecision(2);
  const tol = degPerPx * 0.7;
  const minRing = (degPerPx * 2) ** 2;

  const names: string[] = [];
  const nameIndex = new Map<string, number>();
  const idx = (s: string) => {
    if (!nameIndex.has(s)) { nameIndex.set(s, names.length); names.push(s); }
    return nameIndex.get(s)!;
  };
  const colors: string[] = [];
  const colorIndex = new Map<string, number>();
  const colorOf = (g: string) => {
    const c = getSovereignColor(g);
    if (!colorIndex.has(c)) { colorIndex.set(c, colors.length); colors.push(c); }
    return colorIndex.get(c)!;
  };
  const geoms: number[][][][] = []; // polygons → rings → delta-encoded x,y
  const geomIndex = new Map<string, number>();
  const shapes: [number, number, number, number][] = []; // from, to, colour, geometry
  const labels: [number, number, number, number, number, number][] = []; // lon, lat, from, to, name, rank
  const inView: InView[] = [];
  let points = 0;

  for (const r of picked) {
    const f = Math.max(r.properties.FromYear, t.from);
    const to = Math.min(r.properties.ToYear, TIMELAPSE_END);
    const polys: Ring[][] = [];
    for (const p of polygons(r.geometry)) {
      for (const q of clipTo(p, drawn)) {
        const [outer, ...holes] = q.map((ring) => simplify(ring, tol));
        const visible = (ring: Ring) => ring.length >= 4 && Math.abs(planarArea(ring)) >= minRing;
        if (visible(outer)) polys.push([outer, ...holes.filter(visible)]);
      }
    }
    if (!polys.length) continue;
    const enc = polys.map((rings) => rings.map((ring) => {
      const out: number[] = [];
      let px = 0, py = 0;
      for (const [x, y] of ring) {
        const ix = Math.round(x / unit), iy = Math.round(y / unit);
        if (out.length && ix === px && iy === py) continue;
        out.push(ix - px, iy - py);
        px = ix; py = iy;
      }
      points += out.length / 2;
      return out;
    }));
    const key = JSON.stringify(enc);
    if (!geomIndex.has(key)) { geomIndex.set(key, geoms.length); geoms.push(enc); }
    shapes.push([f, to, colorOf(groupOf(r)), geomIndex.get(key)!]);

    // Area inside the frame, and where the label goes.
    let km2 = 0;
    let best: Ring[] | null = null;
    let bestKm2 = 0;
    for (const p of polygons(r.geometry)) {
      for (const q of clipTo(p, view)) {
        const a = polygonArea(q);
        km2 += a;
        if (a > bestKm2) { bestKm2 = a; best = q; }
      }
    }
    // The videos use the portrait frame, so their captions are measured on it.
    const tallKm2 = !videoBox ? km2 : polygons(r.geometry).reduce((sum, p) => sum + clipTo(p, videoBox).reduce((s2, q) => s2 + polygonArea(q), 0), 0);
    inView.push({ n: r.properties.Name, g: groupOf(r), f, t: to, km2, tallKm2 });
    if (best && bestKm2 > 2000) {
      const [x, y] = polylabel(best, degPerPx * 2);
      const rank = km2 >= 1_500_000 ? 7 : km2 >= 500_000 ? 6 : km2 >= 150_000 ? 5 : km2 >= 40_000 ? 4 : km2 >= 12_000 ? 3 : 2;
      labels.push([+x.toFixed(2), +y.toFixed(2), f, to, idx(r.properties.Name), rank]);
    }
  }
  const data = { unit, colors, names, geoms, shapes, labels };
  const dataPath = join(ROOT, "public/timelapse-data", `${t.slug}.json`);
  writeFileSync(dataPath, JSON.stringify(data));

  const { years, changes, events, leaders } = factsFor(t.from, inView, "km2");
  if (videoBox) videoOut[t.slug] = { slug: t.slug, from: t.from, to: TIMELAPSE_END, ...factsFor(t.from, inView, "tallKm2") };
  else delete videoOut[t.slug];
  out[t.slug] = { slug: t.slug, from: t.from, to: TIMELAPSE_END, changes, events, leaders };
  const kb = Math.round(readFileSync(dataPath).length / 1024);
  console.log(`${t.slug}: ${shapes.length} shapes (${geoms.length} distinct, ${points} points), ${labels.length} labels, ${kb} KB; map changes in ${changes.length} of ${years.length} years; ${events.length} events`);
}

writeFileSync(factsPath, JSON.stringify(out));
writeFileSync(videoFactsPath, JSON.stringify(videoOut));
console.log("wrote src/data/timelapseFacts.json");
