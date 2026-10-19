"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MAX_GUESS, MIN_GUESS, ROUNDS, dayNumber, formatYear, puzzlesFor, scoreFor, shareText, tierOf,
} from "@/lib/guessGame";

// MapLibre needs the browser.
const GuessMap = dynamic(() => import("@/components/GuessMap"), { ssr: false });

/** Today's guesses are remembered in this browser, so a reload doesn't reset the day. */
const storageKey = (day: number) => `guess-the-year:${day}`;

function loadGuesses(day: number): number[] {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(day)) ?? "[]");
    return Array.isArray(saved) ? saved.filter((n) => typeof n === "number").slice(0, ROUNDS) : [];
  } catch {
    return [];
  }
}

function saveGuesses(day: number, guesses: number[]) {
  try {
    localStorage.setItem(storageKey(day), JSON.stringify(guesses));
  } catch {
    // Private browsing or blocked storage: the game still works, it just won't remember.
  }
}

const TIER_STYLE = { great: "bg-[#2f7d4f]", close: "bg-[#c9a227]", far: "bg-[#b4432f]" };

/**
 * The game. "daily" plays today's five maps (the same for everyone); after
 * that, "practice" deals five random ones as often as you like.
 */
export default function GuessGame() {
  const [day] = useState(() => dayNumber(new Date()));
  const [seed, setSeed] = useState<number | null>(null); // null = today's daily game
  const puzzles = puzzlesFor(seed ?? day);
  const [guesses, setGuesses] = useState<number[]>([]);
  const [value, setValue] = useState(1000);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  // Which year's borders the map has finished drawing: no guessing a blank map.
  const [loadedYear, setLoadedYear] = useState<number | null>(null);

  // Pick up where today's game was left. Done after mount: storage is browser-only.
  useEffect(() => {
    const saved = loadGuesses(day);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGuesses(saved);
    setRevealed(saved.length > 0 && saved.length < ROUNDS);
  }, [day]);

  const round = revealed ? guesses.length - 1 : guesses.length;
  const finished = guesses.length === ROUNDS && !revealed;
  const puzzle = puzzles[Math.min(round, ROUNDS - 1)];
  const points = guesses.map((g, i) => scoreFor(g, puzzles[i].year));
  const total = points.reduce((a, b) => a + b, 0);

  function guess() {
    const next = [...guesses, value];
    setGuesses(next);
    setRevealed(true);
    if (seed === null) saveGuesses(day, next);
  }

  function nextRound() {
    setRevealed(false);
    setValue(1000);
  }

  function practice() {
    setSeed(Math.floor(Math.random() * 1e9));
    setGuesses([]);
    setRevealed(false);
    setValue(1000);
    setCopied(false);
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(shareText(seed === null ? day : null, points));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (finished) {
    return (
      <div className="max-w-3xl">
        <p className="label text-ink/45 mb-3">{seed === null ? `Daily game #${day}` : "Practice game"}</p>
        <p className="font-display text-6xl sm:text-7xl tracking-tight text-ink tabular-nums">
          {total.toLocaleString("en-US")}<span className="text-ink/30 text-3xl sm:text-4xl"> / {(ROUNDS * 1000).toLocaleString("en-US")}</span>
        </p>
        <ol className="mt-10 border-t border-ink/80">
          {puzzles.map((p, i) => (
            <li key={i} className="grid grid-cols-[1rem_1fr_auto] gap-x-4 items-baseline py-4 border-b border-ink/10">
              <span className={`w-3 h-3 rounded-sm self-center ${TIER_STYLE[tierOf(points[i])]}`} aria-hidden="true" />
              <span className="min-w-0">
                <span className="block font-display text-xl text-ink">{formatYear(p.year)} <span className="text-ink/40 text-base">· {p.region}</span></span>
                <span className="block text-[13px] text-ink/50">You guessed {formatYear(guesses[i])}</span>
              </span>
              <span className="text-right">
                <span className="block font-mono text-[13px] text-ink tabular-nums">{points[i]}</span>
                <Link href={`/map?year=${p.year}&lat=${p.view.lat}&lng=${p.view.lng}&z=${p.view.zoom}`} className="font-mono text-[11px] text-ink/40 hover:text-accent">
                  Open map →
                </Link>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={share} className="h-12 px-6 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors">
            {copied ? "Copied!" : "Share result"}
          </button>
          <button type="button" onClick={practice} className="h-12 px-6 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
            Play a practice round
          </button>
        </div>
        {seed === null && <p className="mt-6 text-sm text-ink/50">A new daily game starts at midnight UTC.</p>}
      </div>
    );
  }

  const last = guesses.length - 1;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 lg:gap-10">
      <div className="relative h-[56svh] lg:h-[68svh] min-h-[360px] rounded-md overflow-hidden border border-ink/15 bg-[#cdd9e5]">
        <GuessMap year={puzzle.year} view={puzzle.view} reveal={revealed} onLoaded={setLoadedYear} />
      </div>

      <div>
        <p className="label text-ink/45">
          {seed === null ? `Daily #${day}` : "Practice"} · Map {round + 1} of {ROUNDS}
        </p>
        <p className="mt-2 font-display text-2xl text-ink">{puzzle.region}</p>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < guesses.length ? TIER_STYLE[tierOf(points[i])] : i === round ? "bg-ink/40" : "bg-ink/10"}`} />
          ))}
        </div>

        {!revealed ? (
          <>
            <p className="mt-8 text-[15px] text-ink/60 leading-relaxed">
              When were these the borders? Drag to your guess. You can pan and zoom the map.
            </p>
            <p className="mt-6 font-display text-5xl tracking-tight text-ink tabular-nums" aria-live="polite">{formatYear(value)}</p>
            <input
              type="range"
              min={MIN_GUESS}
              max={MAX_GUESS}
              step={5}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              aria-label="Your guess for the year"
              aria-valuetext={formatYear(value)}
              className="mt-4 w-full accent-[var(--color-accent,#2346a0)]"
            />
            <div className="flex justify-between font-mono text-[10px] text-ink/40">
              <span>{formatYear(MIN_GUESS)}</span><span>{formatYear(MAX_GUESS)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              {[-100, -10, 10, 100].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setValue((v) => Math.min(MAX_GUESS, Math.max(MIN_GUESS, v + d)))}
                  className="flex-1 h-9 rounded-md border border-ink/15 font-mono text-[12px] text-ink/60 hover:border-accent hover:text-accent transition-colors"
                >
                  {d > 0 ? `+${d}` : d}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={guess}
              disabled={loadedYear !== puzzle.year}
              className="mt-6 w-full h-12 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors disabled:opacity-40 disabled:hover:bg-ink"
            >
              Guess
            </button>
          </>
        ) : (
          <div className="mt-8" aria-live="polite">
            <p className="label text-ink/45">The answer</p>
            <p className="mt-1 font-display text-5xl tracking-tight text-ink">{formatYear(puzzles[last].year)}</p>
            <p className="mt-3 text-[15px] text-ink/60">
              You guessed {formatYear(guesses[last])}, {Math.abs(guesses[last] - puzzles[last].year).toLocaleString("en-US")} years off.
            </p>
            <p className="mt-4 font-mono text-[13px] text-ink tabular-nums">+{points[last]} points</p>
            <p className="mt-6 text-sm text-ink/50">The names are now showing on the map.</p>
            <button
              type="button"
              onClick={nextRound}
              className="mt-6 w-full h-12 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors"
            >
              {guesses.length === ROUNDS ? "See your score" : "Next map"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
