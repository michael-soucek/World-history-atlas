/**
 * Which states drawn on the site's maps have no place page? Walks every
 * snapshot, looks each feature's NAME up the way the map does (name first,
 * then year-bounded), and ranks the misses by land area summed across the
 * snapshots they appear in — big, long-lived states first.
 *
 *   npx tsx scripts/audit-missing-places.mts [--top 80] [--json out.json]
 */
import { writeFileSync } from "node:fs";
import { lookupByName } from "../src/data/crosswalk";
import { loadSnapshot, snapshotYears } from "./lib/snapshots";

type Ring = [number, number][];
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
type Geom = { type: string; coordinates: unknown } | null;
function area(g: Geom): number {
  if (!g) return 0;
  const polys = (g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : []) as Ring[][];
  return polys.reduce((s, p) => s + Math.max(0, ringArea(p[0]) - p.slice(1).reduce((h, r) => h + ringArea(r), 0)), 0);
}

const args = process.argv.slice(2);
const top = Number(args[args.indexOf("--top") + 1]) || 80;
const junk = (n?: string) => !n || n === "?" || /^unknown$/i.test(n) || /^\d+$/.test(n) || n.length < 3;

const misses = new Map<string, { name: string; years: number[]; maxKm2: number; sumKm2: number; subjecto: Set<string> }>();
let features = 0, matched = 0;
for (const year of await snapshotYears()) {
  if (year < -3000) continue;
  const fc = await loadSnapshot(year);
  for (const f of fc.features as { properties: Record<string, string>; geometry: Geom }[]) {
    const name = f.properties.NAME?.trim();
    if (junk(name)) continue;
    features++;
    if (lookupByName(name!, year)) { matched++; continue; }
    const km2 = area(f.geometry);
    const m = misses.get(name!) ?? { name: name!, years: [], maxKm2: 0, sumKm2: 0, subjecto: new Set<string>() };
    if (!m.years.includes(year)) m.years.push(year);
    m.maxKm2 = Math.max(m.maxKm2, km2);
    m.sumKm2 += km2;
    const sub = f.properties.SUBJECTO?.trim();
    if (sub && sub !== name) m.subjecto.add(sub);
    misses.set(name!, m);
  }
}
const ranked = [...misses.values()].sort((a, b) => b.sumKm2 - a.sumKm2);
console.log(`${features} named features from 3000 BCE on; ${matched} have a page (${((matched / features) * 100).toFixed(1)}%). ${misses.size} distinct names without one.\n`);
const fmt = (y: number) => (y < 0 ? `${-y}BCE` : `${y}`);
for (const m of ranked.slice(0, top)) {
  console.log(`${m.name.padEnd(42)} ${String(m.years.length).padStart(2)} maps  ${fmt(Math.min(...m.years))}–${fmt(Math.max(...m.years))}  max ${Math.round(m.maxKm2 / 1000)}k km²${m.subjecto.size ? `  (part of: ${[...m.subjecto].slice(0, 2).join(", ")})` : ""}`);
}
const out = args.indexOf("--json");
if (out > -1) writeFileSync(args[out + 1], JSON.stringify(ranked.map((m) => ({ ...m, subjecto: [...m.subjecto] })), null, 1));
