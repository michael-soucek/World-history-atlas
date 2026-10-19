/**
 * Builds the territory shading for the war tours: for every stop with
 * `zones` (src/data/warTours.ts), works out the land each side holds and
 * writes it to public/data/war-zones/{tour}/{stop}.json, which TourMap loads.
 *
 * Countries come whole from the tour's `zoneYear` snapshot; hand-drawn areas
 * (front lines, mostly) are trimmed to land, or to the `within` countries, so
 * coastlines and borders match the map underneath. Zones are claimed in
 * order: each one loses whatever an earlier zone at the same stop took.
 *
 * Re-run after editing any zone:
 *
 *   npx tsx scripts/build-war-zones.mts [cache-dir]
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as pc from "polyclip-ts";
import polylabel from "polylabel";
import { TOURS, type TourZone } from "../src/data/tours";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CACHE = process.argv[2] ?? join(ROOT, ".cache/basemaps");
const OUT = join(ROOT, "public/data/war-zones");
const RAW_BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";

type Ring = [number, number][];
type MultiPoly = Ring[][];
type Box = [number, number, number, number];
interface Shape { geom: MultiPoly; box: Box }

async function loadSnapshot(year: number) {
  mkdirSync(CACHE, { recursive: true });
  const path = join(CACHE, `world_${year}.geojson`);
  if (!existsSync(path)) {
    console.log(`Downloading world_${year}.geojson…`);
    writeFileSync(path, Buffer.from(await (await fetch(`${RAW_BASE}/world_${year}.geojson`)).arrayBuffer()));
  }
  return JSON.parse(readFileSync(path, "utf8")) as {
    features: { properties: { NAME?: string | null }; geometry: { type: string; coordinates: unknown } | null }[];
  };
}

function boxOf(geom: MultiPoly): Box {
  let [w, s, e, n] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const poly of geom) for (const [x, y] of poly[0] ?? []) {
    w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y);
  }
  return [w, s, e, n];
}
const overlaps = (a: Box, b: Box) => a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3];
const close = (ring: Ring): Ring => {
  const [first, last] = [ring[0], ring[ring.length - 1]];
  return first[0] === last[0] && first[1] === last[1] ? ring : [...ring, first];
};

/** Douglas–Peucker: drops points that bend the outline by less than `tolerance` degrees. */
function simplify(ring: Ring, tolerance: number): Ring {
  if (ring.length <= 4) return ring;
  const keep = new Uint8Array(ring.length);
  keep[0] = keep[ring.length - 1] = 1;
  const stack: [number, number][] = [[0, ring.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = ring[a];
    const [bx, by] = ring[b];
    const len = Math.hypot(bx - ax, by - ay);
    let worst = -1;
    let index = -1;
    for (let i = a + 1; i < b; i++) {
      const [x, y] = ring[i];
      const d = len === 0 ? Math.hypot(x - ax, y - ay) : Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / len;
      if (d > worst) [worst, index] = [d, i];
    }
    if (worst > tolerance) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  return ring.filter((_, i) => keep[i]);
}

/**
 * Smooths away detail finer than the snapshots themselves have, rounds to
 * 0.01° (about 1 km) and drops the slivers and specks that leaves behind.
 */
function tidy(geom: MultiPoly): MultiPoly {
  const out: MultiPoly = [];
  for (const poly of geom) {
    const rings: Ring[] = [];
    for (const ring of poly) {
      if (ringArea(ring) < 0.003) continue;
      const r: Ring = [];
      for (const [x, y] of simplify(ring, 0.03)) {
        const p: [number, number] = [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
        const prev = r[r.length - 1];
        if (!prev || prev[0] !== p[0] || prev[1] !== p[1]) r.push(p);
      }
      if (r.length >= 4) rings.push(r);
    }
    if (rings.length && rings[0].length >= 4) out.push(rings);
  }
  return out;
}

/** Rough area in square degrees, to find a zone's largest piece for its label. */
function ringArea(ring: Ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  return Math.abs(a / 2);
}

let problems = 0;
rmSync(OUT, { recursive: true, force: true });

for (const tour of TOURS.filter((t) => t.sides && t.zoneYear)) {
  const snapshot = await loadSnapshot(tour.zoneYear!);
  const shapes = new Map<string, MultiPoly>();
  const land: Shape[] = [];
  for (const f of snapshot.features) {
    if (!f.geometry) continue;
    const geom = (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates) as MultiPoly;
    land.push({ geom, box: boxOf(geom) });
    const name = f.properties.NAME;
    if (name) shapes.set(name, [...(shapes.get(name) ?? []), ...geom]);
  }
  const country = (name: string, where: string): MultiPoly => {
    const geom = shapes.get(name);
    if (!geom) {
      problems++;
      console.log(`✗ ${where}: "${name}" is not in the ${tour.zoneYear} snapshot`);
      return [];
    }
    return geom;
  };
  const colors = new Map(tour.sides!.map((s) => [s.key, s.color]));

  /** The zone's ground, before earlier zones take their share. */
  function ground(zone: TourZone, where: string): MultiPoly {
    let geom: MultiPoly = [];
    for (const name of zone.countries ?? []) geom = pc.union(geom, country(name, where));
    if (zone.area) {
      const area: MultiPoly = [[close(zone.area)]];
      if (zone.within) {
        let base: MultiPoly = [];
        for (const name of zone.within) base = pc.union(base, country(name, where));
        geom = pc.union(geom, pc.intersection(area, base));
      } else {
        const box = boxOf(area);
        for (const piece of land) if (overlaps(box, piece.box)) geom = pc.union(geom, pc.intersection(area, piece.geom));
      }
    }
    for (const hole of zone.minus ?? []) geom = pc.difference(geom, [[close(hole)]]);
    return geom;
  }

  mkdirSync(join(OUT, tour.slug), { recursive: true });
  let bytes = 0;
  for (const [i, step] of tour.steps.entries()) {
    if (!step.zones?.length) continue;
    const where = `${tour.slug} stop ${i + 1}`;
    let claimed: MultiPoly = [];
    const groups = new Map<string, { side: string; occupied: boolean; geom: MultiPoly }>();
    const labels: { label: string; side: string; geom: MultiPoly }[] = [];
    for (const zone of step.zones) {
      if (!colors.has(zone.side)) {
        problems++;
        console.log(`✗ ${where}: unknown side "${zone.side}"`);
        continue;
      }
      let geom = ground(zone, where);
      if (claimed.length) geom = pc.difference(geom, claimed);
      if (!geom.length) {
        problems++;
        console.log(`✗ ${where}: a ${zone.side} zone (${zone.label ?? zone.countries?.join(", ") ?? "area"}) is empty`);
        continue;
      }
      claimed = pc.union(claimed, geom);
      const key = `${zone.side}|${zone.occupied ? 1 : 0}`;
      const group = groups.get(key) ?? { side: zone.side, occupied: !!zone.occupied, geom: [] };
      group.geom = pc.union(group.geom, geom);
      groups.set(key, group);
      if (zone.label) labels.push({ label: zone.label, side: zone.side, geom });
    }

    const features = [];
    for (const { side, occupied, geom } of groups.values()) {
      const color = colors.get(side)!;
      features.push({
        type: "Feature",
        properties: { side, color, occupied, pattern: occupied ? `hatch-${color.slice(1)}` : null },
        geometry: { type: "MultiPolygon", coordinates: tidy(geom) },
      });
    }
    for (const { label, side, geom } of labels) {
      const largest = geom.reduce((a, b) => (ringArea(b[0]) > ringArea(a[0]) ? b : a));
      const [x, y] = polylabel(largest, 0.2);
      features.push({
        type: "Feature",
        properties: { label, color: colors.get(side) },
        geometry: { type: "Point", coordinates: [Math.round(x * 100) / 100, Math.round(y * 100) / 100] },
      });
    }
    const json = JSON.stringify({ type: "FeatureCollection", features });
    bytes += json.length;
    writeFileSync(join(OUT, tour.slug, `${i}.json`), json);
  }
  console.log(`${tour.slug}: ${tour.steps.filter((s) => s.zones?.length).length} stops, ${Math.round(bytes / 1024)} KB`);
}

if (problems) {
  console.log(`${problems} problem(s)`);
  process.exit(1);
}
