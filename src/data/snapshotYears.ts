/**
 * The years for which historical-basemaps snapshots exist.
 * Negative values = BCE (e.g. -500 = 500 BCE).
 * Source: https://github.com/aourednik/historical-basemaps
 *
 * Files:  BCE → world_bc{N}.geojson   |   CE → world_{N}.geojson
 */
export const SNAPSHOT_YEARS: number[] = [
  // BCE (stored as negative integers)
  -123000, -10000, -8000, -5000, -4000, -3000, -2000, -1500, -1000,
  -700, -500, -400, -323, -300, -200, -100, -1,
  // CE
  100, 200, 300, 400, 500, 600, 700, 800, 900,
  1000, 1100, 1200, 1279, 1300, 1400, 1492, 1500, 1530,
  1600, 1650, 1700, 1715, 1783, 1800, 1815, 1880,
  1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000, 2010,
];

// Practical map floor: allow scrubbing back to 12,000 BCE.
// The first available snapshot within this range is 10,000 BCE.
export const MIN_YEAR = -12000;
export const MAX_YEAR = SNAPSHOT_YEARS[SNAPSHOT_YEARS.length - 1];
export const DEFAULT_YEAR = 1700;

/**
 * Convert a year integer (negative = BCE) to the historical-basemaps filename.
 * e.g. -500 → "world_bc500.geojson", 1700 → "world_1700.geojson"
 */
function yearToFilename(year: number): string {
  if (year < 0) return `world_bc${Math.abs(year)}.geojson`;
  return `world_${year}.geojson`;
}

/**
 * Return the most recent snapshot year <= the requested year.
 */
export function getSnapshotYearFor(year: number): number {
  const firstUsable = SNAPSHOT_YEARS.find((y) => y >= MIN_YEAR) ?? SNAPSHOT_YEARS[0];
  let result = firstUsable;
  for (const sy of SNAPSHOT_YEARS) {
    if (sy < firstUsable) continue;
    if (sy <= year) result = sy;
    else break;
  }
  return result;
}

/** Format a year as "500 BCE" or "1700 CE". */
export function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return "1 BCE";
  return `${year} CE`;
}

export const ERAS = [
  { label: "Prehistoric",  start: -123000, end:  -3000 },
  { label: "Ancient",      start:   -3000, end:   -500 },
  { label: "Classical",    start:    -500, end:    500 },
  { label: "Medieval",     start:     500, end:   1500 },
  { label: "Early Modern", start:    1500, end:   1800 },
  { label: "Modern",       start:    1800, end:   2011 },
] as const;

export function getEraForYear(year: number): string {
  for (const era of ERAS) {
    if (year >= era.start && year < era.end) return era.label;
  }
  return "Modern";
}

function yearToSliderValue(year: number): number {
  return Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
}

export function clampYear(year: number): number {
  return Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
}
