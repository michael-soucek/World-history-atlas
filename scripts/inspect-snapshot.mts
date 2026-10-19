/**
 * Look inside a snapshot when fixing borders: which territory covers a point,
 * and where a named territory is and how big.
 *
 *   npx tsx scripts/inspect-snapshot.mts 1930 37.6,55.75 30.5,50.45   # features at points
 *   npx tsx scripts/inspect-snapshot.mts 1930 "name=White Russia"       # a feature's extent
 *   npx tsx scripts/inspect-snapshot.mts 1930 --raw ...                 # before fixes
 *   npx tsx scripts/inspect-snapshot.mts 1200 35.2,31.8 @1300 35.2,31.8 # several years
 */
import { loadSnapshot, type Feature } from "./lib/snapshots";

// Several years in one run: "@1200" switches year for the arguments after it.
const argv = process.argv.slice(2);
const raw = argv.includes("--raw");
const groups: [number, string[]][] = [];
for (const a of argv.filter((a) => a !== "--raw")) {
  if (/^@?-?\d+$/.test(a) && (a.startsWith("@") || !groups.length)) groups.push([Number(a.replace("@", "")), []]);
  else groups[groups.length - 1][1].push(a);
}
type Ring = [number, number][];
const polys = (f: Feature): Ring[][] => (!f.geometry ? [] : f.geometry.type === "Polygon" ? [f.geometry.coordinates as Ring[]] : (f.geometry.coordinates as Ring[][]));
const inRing = ([x, y]: number[], r: Ring) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const R = 6371.0088, rad = (d: number) => (d * Math.PI) / 180;
const area = (r: Ring) => { let s = 0; for (let i = 0; i < r.length; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length]; s += rad(x2 - x1) * (2 + Math.sin(rad(y1)) + Math.sin(rad(y2))); } return Math.abs((s * R * R) / 2); };
const describe = (f: Feature) => {
  const ps = polys(f);
  const xs = ps.flatMap((p) => p[0].map((c) => c[0])), ys = ps.flatMap((p) => p[0].map((c) => c[1]));
  const km2 = ps.reduce((s, p) => s + area(p[0]), 0);
  return `"${f.properties.NAME}" <${f.properties.SUBJECTO ?? ""}> bbox ${[Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map((v) => v.toFixed(1)).join(",")}  ${Math.round(km2 / 1000)}k km²  ${ps.length} polys`;
};
for (const [year, args] of groups) {
console.log(`── ${year}`);
const fc = await loadSnapshot(year, { raw });
for (const a of args) {
  if (a.startsWith("name=")) {
    const name = a.slice(5);
    for (const f of fc.features.filter((f) => f.properties.NAME === name)) console.log(`${name}: ${describe(f)}`);
  } else {
    const pt = a.split(",").map(Number);
    const hits = fc.features.filter((f) => polys(f).some((p) => inRing(pt, p[0]) && !p.slice(1).some((h) => inRing(pt, h))));
    console.log(`${a}: ${hits.map(describe).join("  ||  ") || "nothing"}`);
  }
}
}
