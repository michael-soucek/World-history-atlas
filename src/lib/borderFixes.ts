/**
 * Applies the border corrections in src/data/borderFixes.ts to a
 * historical-basemaps snapshot. Pure: the snapshot API and every build script
 * (through scripts/lib/snapshots.mts) call it, so the map, the city rulers,
 * the place measurements and the war zones all see the same corrected
 * borders.
 */
import * as pc from "polyclip-ts";
import { BORDER_FIXES, type BorderFix, type Match } from "@/data/borderFixes";

type Ring = [number, number][];
type MultiPoly = Ring[][];

export interface FeatureProps {
  NAME?: string | null;
  SUBJECTO?: string | null;
  PARTOF?: string | null;
  BORDERPRECISION?: number | null;
  ABBREVN?: string | null;
  [key: string]: unknown;
}
export interface Feature {
  type: "Feature";
  properties: FeatureProps;
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: unknown } | null;
}
export interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
  [key: string]: unknown;
}

const polygons = (f: Feature): MultiPoly =>
  !f.geometry ? [] : f.geometry.type === "Polygon" ? [f.geometry.coordinates as Ring[]] : (f.geometry.coordinates as MultiPoly);
const setPolygons = (f: Feature, geom: MultiPoly) => {
  f.geometry = geom.length ? { type: "MultiPolygon", coordinates: geom } : null;
};
const close = (ring: Ring): Ring => {
  const [a, b] = [ring[0], ring[ring.length - 1]];
  return a[0] === b[0] && a[1] === b[1] ? ring : [...ring, a];
};

function inRing([x, y]: [number, number], ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const contains = (f: Feature, pt: [number, number]) =>
  polygons(f).some((p) => inRing(pt, p[0]) && !p.slice(1).some((h) => inRing(pt, h)));

function matches(f: Feature, m: Match) {
  if (m.name !== undefined && (f.properties.NAME ?? "").trim() !== m.name) return false;
  if (m.subject !== undefined && (f.properties.SUBJECTO ?? "").trim() !== m.subject) return false;
  if (m.at && !contains(f, m.at)) return false;
  return true;
}

/** Run polyclip, and on its rare failures on messy upstream rings, keep the input. */
function safely(fn: () => MultiPoly, fallback: MultiPoly): MultiPoly {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

function applyOne(fix: BorderFix, features: Feature[]): Feature[] {
  switch (fix.op) {
    case "rename": {
      for (const f of features) if (matches(f, fix.match)) Object.assign(f.properties, fix.set);
      return features;
    }
    case "drop": {
      return features.filter((f) => !matches(f, fix.match));
    }
    case "merge": {
      // Never by an empty name: that would sweep up every unnamed shape on the map.
      const names = fix.names.filter(Boolean);
      const parts = features.filter((f) => names.includes((f.properties.NAME ?? "").trim()));
      if (!parts.length) return features;
      const geom = safely(() => pc.union(polygons(parts[0]) as pc.Geom, ...parts.slice(1).map((p) => polygons(p) as pc.Geom)) as MultiPoly, parts.flatMap(polygons));
      const merged: Feature = { type: "Feature", properties: { ...parts[0].properties, ...fix.set }, geometry: null };
      setPolygons(merged, geom);
      return [...features.filter((f) => !parts.includes(f)), merged];
    }
    case "assign": {
      const area: MultiPoly = [[close(fix.area)]];
      const taken: MultiPoly[] = [];
      for (const f of features) {
        if (fix.from && !fix.from.some((m) => matches(f, m))) continue;
        const geom = polygons(f);
        if (!geom.length) continue;
        const inside = safely(() => pc.intersection(geom as pc.Geom, area as pc.Geom) as MultiPoly, []);
        if (!inside.length) continue;
        taken.push(inside);
        setPolygons(f, safely(() => pc.difference(geom as pc.Geom, area as pc.Geom) as MultiPoly, geom));
      }
      if (!taken.length) return features;
      const gained = safely(() => pc.union(taken[0] as pc.Geom, ...taken.slice(1).map((t) => t as pc.Geom)) as MultiPoly, taken.flat());
      // Join the largest existing territory of that name (an empire's mainland, not an outlying island).
      const size = (f: Feature) => polygons(f).reduce((n, p) => n + p[0].length, 0);
      const target = features
        .filter((f) => f.geometry && (f.properties.NAME ?? "").trim() === fix.to.NAME && (f.properties.SUBJECTO ?? null) === (fix.to.SUBJECTO ?? f.properties.SUBJECTO ?? null))
        .sort((a, b) => size(b) - size(a))[0];
      if (target) {
        setPolygons(target, safely(() => pc.union(polygons(target) as pc.Geom, gained as pc.Geom) as MultiPoly, [...polygons(target), ...gained]));
      } else {
        const added: Feature = { type: "Feature", properties: { BORDERPRECISION: 1, ...fix.to }, geometry: null };
        setPolygons(added, gained);
        features.push(added);
      }
      return features.filter((f) => f.geometry);
    }
  }
}

/** The snapshot for `year` with every fix for that year applied, in order. Doesn't modify its input. */
export function applyBorderFixes<T extends FeatureCollection>(year: number, fc: T): T {
  const fixes = BORDER_FIXES.filter((f) => f.years.includes(year));
  if (!fixes.length) return fc;
  let features: Feature[] = fc.features.map((f) => ({ ...f, properties: { ...f.properties } }));
  for (const fix of fixes) features = applyOne(fix, features);
  return { ...fc, features };
}
