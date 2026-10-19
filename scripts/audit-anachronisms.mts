/**
 * Finds territories drawn on a map from a year when, by Wikidata's dates, the
 * state didn't exist: names a snapshot carried over from an earlier map
 * ("Buwayhid Emirates" in 1200; the Buyids fell in 1055), or drew too early.
 *
 *   npx tsx scripts/audit-anachronisms.mts
 *
 * Reads the corrected snapshots (scripts/lib/snapshots.ts) and the Wikidata store; prints one
 * line per suspect, with the land area involved so the big ones come first.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveFeature } from "../src/data/crosswalk";
import { loadSnapshot, snapshotYears } from "./lib/snapshots";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MARGIN = 30;

type Ring = [number, number][];
const store = JSON.parse(readFileSync(join(ROOT, "public/data/wikidata-store.json"), "utf8")).entities as Record<string, { claims: Record<string, { mainsnak: { datavalue: { value?: { time?: string } } } }[]> }>;
const yearOf = (qid: string, props: string[]) => {
  for (const p of props) {
    const t = store[qid]?.claims[p]?.[0]?.mainsnak.datavalue.value?.time;
    const m = t?.match(/^([+-])(\d+)-/);
    if (m) return (m[1] === "-" ? -1 : 1) * Number(m[2]);
  }
  return undefined;
};
const R = 6371.0088, rad = (d: number) => (d * Math.PI) / 180;
const ringArea = (ring: Ring) => { let s = 0; for (let i = 0; i < ring.length; i++) { const [x1, y1] = ring[i]; const [x2, y2] = ring[(i + 1) % ring.length]; s += rad(x2 - x1) * (2 + Math.sin(rad(y1)) + Math.sin(rad(y2))); } return Math.abs((s * R * R) / 2); };

const years = await snapshotYears();
const rows: { year: number; name: string; slug: string; start?: number; end?: number; km2: number }[] = [];
for (const year of years) {
  if (year < -3000) continue;
  const fc = await loadSnapshot(year);
  const seen = new Map<string, { slug: string; qid: string; km2: number }>();
  for (const feat of fc.features) {
    const name = feat.properties.NAME?.trim();
    if (!name || !feat.geometry) continue;
    const entry = resolveFeature(name, feat.properties.SUBJECTO?.trim() || name, year);
    if (!entry) continue;
    const polys = (feat.geometry.type === "Polygon" ? [feat.geometry.coordinates] : feat.geometry.coordinates) as Ring[][];
    const km2 = polys.reduce((s: number, p: Ring[]) => s + ringArea(p[0]), 0);
    const key = `${name}`;
    const prev = seen.get(key);
    seen.set(key, { slug: entry.slug, qid: entry.wikidataId, km2: (prev?.km2 ?? 0) + km2 });
  }
  for (const [name, { slug, qid, km2 }] of seen) {
    const start = yearOf(qid, ["P571", "P580"]);
    const end = yearOf(qid, ["P576", "P582"]);
    if ((start !== undefined && year < start - MARGIN) || (end !== undefined && year > end + MARGIN)) rows.push({ year, name, slug, start, end, km2 });
  }
}
rows.sort((a, b) => a.year - b.year || b.km2 - a.km2);
for (const r of rows) console.log(`${String(r.year).padStart(6)}  ${r.name}  →  ${r.slug} [${r.start ?? "?"}–${r.end ?? "?"}]  ${Math.round(r.km2 / 1000)}k km²`);
console.log(`${rows.length} suspects`);
