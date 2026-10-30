/**
 * Name the Empire: each day, five maps. One territory is lit up, the year is
 * shown, and the player picks its name from four. Everyone gets the same
 * five rounds on the same day.
 *
 * Pure functions only — EmpireGame.tsx handles state, data and storage.
 */
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";

export const EMPIRE_ROUNDS = 5;

/** Day 1 of the daily game (UTC). */
const LAUNCH = Date.UTC(2026, 9, 30);

/** One year from each era, so a day mixes ancient and modern maps. */
const ERA_BUCKETS: [number, number][] = [
  [-500, -1],
  [1, 999],
  [1000, 1499],
  [1500, 1899],
  [1900, 2010],
];

/** A territory's minimum size (sum of its pieces' `area`) to be asked about. */
const MIN_AREA = 25;

/** Small seeded random generator (mulberry32): same seed, same sequence. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Puzzle number for a date: 1 on launch day. */
export function empireDay(date: Date): number {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.max(1, Math.floor((utcMidnight - LAUNCH) / 86_400_000) + 1);
}

/** The five years for a seed (the day number, or anything for practice), shuffled. */
export function empireYears(seed: number): number[] {
  const rand = seeded(seed * 104729 + 3);
  const years = ERA_BUCKETS.map(([lo, hi]) => {
    const pool = SNAPSHOT_YEARS.filter((y) => y >= lo && y <= hi);
    return pool[Math.floor(rand() * pool.length)];
  });
  for (let i = years.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [years[i], years[j]] = [years[j], years[i]];
  }
  return years;
}

type Position = number[];
interface Geometry { type: string; coordinates: unknown }
export interface Territory {
  name: string;
  /** Entity page slug, for "Read about it". */
  slug: string;
  area: number;
  /** [west, south, east, north] of all its pieces. */
  bbox: [number, number, number, number];
  /** Rough centre, for picking nearby decoys. */
  center: [number, number];
}

export interface EmpireRound {
  year: number;
  answer: Territory;
  /** The answer and three decoys, in display order. */
  choices: string[];
}

function eachPosition(coords: unknown, fn: (p: Position) => void) {
  if (!Array.isArray(coords)) return;
  if (typeof coords[0] === "number") fn(coords as Position);
  else for (const c of coords) eachPosition(c, fn);
}

/**
 * The territories that can be asked about in one year's borders: named,
 * linked to a page, and big enough to recognise. Pieces with the same name
 * (an empire's islands, say) are merged.
 */
export function territoriesOf(fc: { features: { properties: Record<string, unknown>; geometry: Geometry | null }[] }): Territory[] {
  const byName = new Map<string, Territory>();
  for (const f of fc.features) {
    const p = f.properties;
    const name = typeof p.name === "string" ? p.name : "";
    const slug = typeof p.slug === "string" ? p.slug : "";
    if (!name || name === "Unknown" || !slug || !f.geometry) continue;
    let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
    eachPosition(f.geometry.coordinates, ([x, y]) => {
      if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y;
    });
    if (!isFinite(w)) continue;
    const area = typeof p.area === "number" ? p.area : 0;
    const t = byName.get(name);
    if (!t) {
      byName.set(name, { name, slug, area, bbox: [w, s, e, n], center: [(w + e) / 2, (s + n) / 2] });
    } else {
      // The biggest piece sets the centre.
      if (area > t.area / 2) t.center = [(w + e) / 2, (s + n) / 2];
      t.area += area;
      t.bbox = [Math.min(t.bbox[0], w), Math.min(t.bbox[1], s), Math.max(t.bbox[2], e), Math.max(t.bbox[3], n)];
    }
  }
  return [...byName.values()].filter((t) => t.area >= MIN_AREA).sort((a, b) => a.name.localeCompare(b.name));
}

const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/**
 * One round for a year: the answer and three decoys. Two decoys are the
 * answer's nearest neighbours (so the map's location alone doesn't give it
 * away), one is from anywhere. Same seed and data, same round.
 */
export function roundFor(year: number, territories: Territory[], seed: number): EmpireRound | null {
  if (territories.length < 4) return null;
  const rand = seeded(seed * 31 + Math.abs(year) * 7 + (year < 0 ? 1 : 0));
  const answer = territories[Math.floor(rand() * territories.length)];
  const others = territories.filter((t) => t.name !== answer.name);
  const near = [...others].sort((a, b) => dist(a.center, answer.center) - dist(b.center, answer.center)).slice(0, 2);
  const rest = others.filter((t) => !near.includes(t));
  const far = rest[Math.floor(rand() * rest.length)];
  const choices = [answer, ...near, far].filter(Boolean).map((t) => t.name);
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return { year, answer, choices };
}

/** A finished round, as saved: enough to show results without refetching. */
export interface EmpireResult {
  year: number;
  answer: string;
  slug: string;
  picked: string;
}

export function empireRank(correct: number): { title: string; line: string } {
  if (correct === EMPIRE_ROUNDS) return { title: "Imperial cartographer", line: "Five for five. Every border, named." };
  if (correct === 4) return { title: "Historian", line: "One got away, the rest didn't stand a chance." };
  if (correct === 3) return { title: "Scholar", line: "More right than wrong across the centuries." };
  if (correct === 2) return { title: "Traveller", line: "A couple of familiar shapes in there." };
  return { title: "Tourist", line: "Those borders kept their secrets today. New maps tomorrow." };
}

export const formatYear = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y} CE`);

/** Share text: score and a row of squares. No names, so no spoilers. */
export function empireShareText(day: number | null, results: EmpireResult[]): string {
  const correct = results.filter((r) => r.picked === r.answer).length;
  const name = day ? `Name the Empire #${day}` : "Name the Empire (practice)";
  return [
    `Borders of Time · ${name}`,
    `${correct}/${EMPIRE_ROUNDS} · ${empireRank(correct).title}`,
    results.map((r) => (r.picked === r.answer ? "🟩" : "🟥")).join(""),
    "",
    "Can you name the empire from its borders?",
    "https://bordersoftime.com/play/empire",
  ].join("\n");
}
