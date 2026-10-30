/**
 * Logic for the two timeline games, built on DATED_EVENTS:
 *  - "Which came first?": two events, pick the earlier; keep going until a miss.
 *    The pairs get closer together as the streak grows.
 *  - "Put it in order": five events a day to sort, earliest first.
 *
 * Pure functions only — the components handle state and storage.
 */
import { DATED_EVENTS, type DatedEvent } from "@/data/datedEvents";
import { seeded } from "@/lib/empireGame";

export const ORDER_COUNT = 5;

/** Day 1 of the daily "Put it in order" (UTC). */
const ORDER_LAUNCH = Date.UTC(2026, 9, 30);

export function orderDay(date: Date): number {
  const utcMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.max(1, Math.floor((utcMidnight - ORDER_LAUNCH) / 86_400_000) + 1);
}

/**
 * The gap in years between a pair, by streak: generous at first, then
 * tighter, so a long streak means knowing the details.
 */
function gapFor(streak: number): [number, number] {
  if (streak < 3) return [300, 5000];
  if (streak < 7) return [80, 600];
  if (streak < 12) return [25, 200];
  return [1, 80];
}

/**
 * A pair for "Which came first?", never two events from the same year and
 * never an event already used this game. Falls back to any unused pair with
 * different years if nothing fits the gap.
 */
export function nextPair(streak: number, used: Set<string>, rand: () => number = Math.random): [DatedEvent, DatedEvent] {
  const pool = DATED_EVENTS.filter((e) => !used.has(e.id));
  const list = pool.length >= 2 ? pool : DATED_EVENTS;
  const [lo, hi] = gapFor(streak);
  for (let tries = 0; tries < 400; tries++) {
    const a = list[Math.floor(rand() * list.length)];
    const b = list[Math.floor(rand() * list.length)];
    const gap = Math.abs(a.year - b.year);
    if (a.id !== b.id && gap >= lo && gap <= hi) return [a, b];
  }
  for (;;) {
    const a = list[Math.floor(rand() * list.length)];
    const b = list[Math.floor(rand() * list.length)];
    if (a.year !== b.year) return [a, b];
  }
}

/** A title for a "Which came first?" streak. */
export function streakRank(streak: number): { title: string; line: string } {
  if (streak >= 20) return { title: "Living chronicle", line: "The centuries line up for you." };
  if (streak >= 12) return { title: "Historian", line: "Even the close calls didn't catch you." };
  if (streak >= 7) return { title: "Scholar", line: "You got past the easy ones and kept going." };
  if (streak >= 3) return { title: "Time traveller", line: "A good start. The gaps get smaller from here." };
  return { title: "Tourist", line: "History is tricky. Try another run." };
}

/** Today's five events for "Put it in order": all different years, spread across eras, shuffled. */
export function orderPuzzle(seed: number): DatedEvent[] {
  const rand = seeded(seed * 2654435761 + 11);
  const bands: [number, number][] = [[-1000, 499], [500, 1399], [1400, 1799], [1800, 1913], [1914, 2100]];
  // Most days span all eras; one day in three stays inside two neighbouring eras, which is harder.
  const tight = rand() < 0.34;
  const start = Math.floor(rand() * (bands.length - 1));
  const chosen: DatedEvent[] = [];
  const years = new Set<number>();
  for (let i = 0; i < ORDER_COUNT; i++) {
    const [lo, hi] = tight ? [bands[start][0], bands[start + 1][1]] : bands[i % bands.length];
    const pool = DATED_EVENTS.filter((e) => e.year >= lo && e.year <= hi && !years.has(e.year) && !chosen.includes(e));
    const pick = pool[Math.floor(rand() * pool.length)];
    if (!pick) continue;
    chosen.push(pick);
    years.add(pick.year);
  }
  // Shuffle until it isn't already in order.
  for (let t = 0; t < 10; t++) {
    for (let i = chosen.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
    }
    if (chosen.some((e, i) => i > 0 && chosen[i - 1].year > e.year)) break;
  }
  return chosen;
}

/** Which positions are right, comparing the player's order to the true one. */
export function orderMarks(order: DatedEvent[]): boolean[] {
  const sorted = [...order].sort((a, b) => a.year - b.year);
  return order.map((e, i) => sorted[i].id === e.id);
}

export function orderRank(right: number): { title: string; line: string } {
  if (right === ORDER_COUNT) return { title: "Perfect order", line: "Every event in its place." };
  if (right >= 3) return { title: "Historian", line: "Most of the timeline fell into place." };
  if (right >= 1) return { title: "Apprentice", line: "A couple in the right spot. The rest swapped places." };
  return { title: "Time-scrambled", line: "Nothing in place today. Tomorrow's five are new." };
}

export const formatEventYear = (y: number) => (y < 0 ? `${Math.abs(y)} BCE` : `${y}`);
