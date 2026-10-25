/**
 * Guess the Year: each day, five maps of borders with the names hidden;
 * the player guesses the year of each. Everyone gets the same five maps on
 * the same day (picked from the date), like a daily crossword.
 *
 * Pure functions only — the page (GuessGame.tsx) handles state and storage.
 */
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";

export interface Puzzle {
  /** Snapshot year whose borders are shown. */
  year: number;
  region: string;
  view: { lat: number; lng: number; zoom: number };
}

export const ROUNDS = 5;
/** The slider's range. Earlier snapshots are mostly prehistoric cultures, too hard to date. */
export const MIN_GUESS = -1000;
export const MAX_GUESS = 2010;

/** Day 1 of the daily game (UTC). */
const LAUNCH = Date.UTC(2026, 9, 19);

const VIEWS: { region: string; view: Puzzle["view"] }[] = [
  { region: "Europe", view: { lat: 50, lng: 12, zoom: 3.2 } },
  { region: "The Mediterranean", view: { lat: 38, lng: 18, zoom: 3.4 } },
  { region: "The Middle East", view: { lat: 32, lng: 44, zoom: 3.3 } },
  { region: "East Asia", view: { lat: 35, lng: 110, zoom: 2.8 } },
  { region: "South Asia", view: { lat: 22, lng: 80, zoom: 3.3 } },
  { region: "Central Asia", view: { lat: 45, lng: 65, zoom: 3 } },
  { region: "Africa", view: { lat: 3, lng: 20, zoom: 2.5 } },
  { region: "The Americas", view: { lat: 15, lng: -80, zoom: 2.1 } },
  { region: "The whole world", view: { lat: 25, lng: 20, zoom: 1.2 } },
];

/**
 * One year from each of five eras, so a day never asks five medieval maps.
 * The order is shuffled afterwards.
 */
const ERA_BUCKETS: [number, number][] = [
  [-1000, -1],
  [1, 999],
  [1000, 1499],
  [1500, 1899],
  [1900, 2010],
];

/** Small seeded random generator (mulberry32): same seed, same sequence. */
function seeded(seed: number) {
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
export function dayNumber(date: Date): number {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.max(1, Math.floor((utcMidnight - LAUNCH) / 86_400_000) + 1);
}

/** The five puzzles for a seed (the day number, or anything for practice). */
export function puzzlesFor(seed: number): Puzzle[] {
  const rand = seeded(seed * 7919 + 17);
  const pick = <T>(list: T[]) => list[Math.floor(rand() * list.length)];
  const views = [...VIEWS];
  const puzzles = ERA_BUCKETS.map(([lo, hi]) => {
    const year = pick(SNAPSHOT_YEARS.filter((y) => y >= lo && y <= hi));
    // Each view at most once a day.
    const v = views.splice(Math.floor(rand() * views.length), 1)[0];
    return { year, region: v.region, view: v.view };
  });
  // Shuffle (Fisher–Yates) so the eras don't always come in order.
  for (let i = puzzles.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [puzzles[i], puzzles[j]] = [puzzles[j], puzzles[i]];
  }
  return puzzles;
}

/**
 * Points for one guess, out of 1000. Falls off smoothly with distance:
 * 25 years off ≈ 880, 100 ≈ 610, 300 ≈ 220.
 */
export function scoreFor(guess: number, answer: number): number {
  return Math.round(1000 * Math.exp(-Math.abs(guess - answer) / 200));
}

export type Tier = "great" | "close" | "near" | "far";

/** About 45, 160 and 380 years off are the tier edges. */
export function tierOf(points: number): Tier {
  return points >= 800 ? "great" : points >= 450 ? "close" : points >= 150 ? "near" : "far";
}

/** A title for a day's total, with a line to go under it. */
export function rankFor(total: number): { title: string; line: string } {
  if (total >= 4500) return { title: "Master cartographer", line: "You read those borders like a calendar." };
  if (total >= 3500) return { title: "Historian", line: "Most of those maps didn't fool you." };
  if (total >= 2500) return { title: "Scholar", line: "A solid eye for the shape of history." };
  if (total >= 1500) return { title: "Time traveller", line: "You landed in the right era more than once." };
  if (total >= 750) return { title: "Apprentice", line: "Some eras clicked, others didn't." };
  return { title: "Tourist", line: "The borders had other ideas today. Tomorrow brings new maps." };
}

const EMOJI: Record<Tier, string> = { great: "🟩", close: "🟨", near: "🟧", far: "🟥" };

const yearsOff = (n: number) => `${n.toLocaleString("en-US")} ${n === 1 ? "year" : "years"} off`;

/**
 * The text for "Share": the score, a title, and one line per map with the
 * region and how far off the guess was. No answers, so no spoilers.
 */
export function shareText(day: number | null, puzzles: Puzzle[], guesses: number[]): string {
  const points = guesses.map((g, i) => scoreFor(g, puzzles[i].year));
  const total = points.reduce((a, b) => a + b, 0);
  const name = day ? `Guess the Year #${day}` : "Guess the Year (practice)";
  const lines = puzzles.map((p, i) => {
    const off = Math.abs(guesses[i] - p.year);
    return `${EMOJI[tierOf(points[i])]} ${p.region}: ${off === 0 ? "spot on" : yearsOff(off)}`;
  });
  return [
    `Borders of Time · ${name}`,
    `${total.toLocaleString("en-US")}/${(ROUNDS * 1000).toLocaleString("en-US")} · ${rankFor(total).title}`,
    "",
    ...lines,
    "",
    "Can you date the world from its borders?",
    "https://bordersoftime.com/play",
  ].join("\n");
}

export interface PlayerStats {
  played: number;
  /** Days in a row, ending today (or yesterday, if today isn't finished yet). */
  streak: number;
  best: number;
}

/** Stats from finished daily games, given as { day, total }. */
export function statsFrom(results: { day: number; total: number }[], today: number): PlayerStats {
  const days = new Set(results.map((r) => r.day));
  let streak = 0;
  for (let d = days.has(today) ? today : today - 1; days.has(d); d--) streak++;
  return { played: results.length, streak, best: Math.max(0, ...results.map((r) => r.total)) };
}

/** Milliseconds until the next daily game (midnight UTC). */
export function msUntilNextGame(now: Date): number {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) - now.getTime();
}

export const formatYear = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y} CE`);
