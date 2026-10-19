/**
 * Checks every tour stop's `highlight` names against the map snapshot the
 * stop will actually show, by asking the running site's snapshot API. A name
 * that doesn't exist would silently highlight nothing.
 *
 * Usage: start the site (npm run dev), then
 *   SITE=http://localhost:3000 node scripts/validate-tour-highlights.mjs
 */
import { readFileSync } from "node:fs";

const SITE = process.env.SITE ?? "http://localhost:3000";

// Read the tour data as text: pull out each stop's year and highlight list.
const TOUR_FILES = ["tours.ts", "movementTours.ts", "eventTours.ts", "warTours.ts"];
const source = TOUR_FILES.map((f) => readFileSync(new URL(`../src/data/${f}`, import.meta.url), "utf8")).join("\n");
// A stop draws mapYear's borders when it has one, otherwise year's.
const stops = [...source.matchAll(/mapState: \{ year: (-?\d+)(?:, mapYear: (-?\d+))?[^}]*\},\s*\n\s*highlight: (\[[^\]]*\])/g)].map((m) => ({
  year: Number(m[2] ?? m[1]),
  names: JSON.parse(m[3]),
}));

const cache = new Map();
let problems = 0;
for (const { year, names } of stops) {
  if (!cache.has(year)) {
    const res = await fetch(`${SITE}/api/snapshot/${year}`);
    const data = await res.json();
    cache.set(year, new Set(data.features.map((f) => f.properties.name)));
  }
  const available = cache.get(year);
  for (const name of names) {
    if (!available.has(name)) {
      problems++;
      console.log(`✗ ${year}: "${name}" is not in this year's map`);
    }
  }
}
console.log(problems ? `${problems} problem(s)` : `All ${stops.length} highlighted stops resolve.`);
process.exit(problems ? 1 : 0);
