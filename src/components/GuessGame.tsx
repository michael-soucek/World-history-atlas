"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  GUESS_ERAS, MAX_GUESS, MIN_GUESS, ROUNDS, dayNumber, formatYear, msUntilNextGame, puzzlesFor, rankFor, scoreFor,
  shareText, sliderPos, statsFrom, tierOf, type PlayerStats,
} from "@/lib/guessGame";
import type { ShownTerritory } from "@/components/GuessMap";
import ResultCard from "@/components/ResultCard";
import MoreGames from "@/components/MoreGames";

// MapLibre needs the browser.
const GuessMap = dynamic(() => import("@/components/GuessMap"), { ssr: false });

/** Today's guesses (and which rounds used a hint) are remembered in this browser, so a reload doesn't reset the day. */
const storageKey = (day: number) => `guess-the-year:${day}`;
const hintsKey = (day: number) => `guess-the-year-hints:${day}`;

function loadHints(day: number): boolean[] {
  try {
    const saved = JSON.parse(localStorage.getItem(hintsKey(day)) ?? "[]");
    return Array.isArray(saved) ? saved.map(Boolean).slice(0, ROUNDS) : [];
  } catch {
    return [];
  }
}

function saveHints(day: number, hints: boolean[]) {
  try {
    localStorage.setItem(hintsKey(day), JSON.stringify(hints));
  } catch {
    // Storage blocked: hints just aren't remembered.
  }
}

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

/** Finished daily games saved in this browser, for the stats line. */
function loadStats(today: number): PlayerStats {
  const results: { day: number; total: number }[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const m = localStorage.key(i)?.match(/^guess-the-year:(\d+)$/);
      if (!m) continue;
      const day = Number(m[1]);
      const saved = loadGuesses(day);
      if (saved.length < ROUNDS) continue;
      const puzzles = puzzlesFor(day);
      const hints = loadHints(day);
      results.push({ day, total: saved.reduce((sum, g, j) => sum + scoreFor(g, puzzles[j].year, hints[j]), 0) });
    }
  } catch {
    // Storage blocked: no stats, the results still show.
  }
  return statsFrom(results, today);
}

function countdown(ms: number): string {
  const mins = Math.max(0, Math.floor(ms / 60_000));
  const h = Math.floor(mins / 60);
  return h > 0 ? `${h}h ${String(mins % 60).padStart(2, "0")}m` : `${mins}m`;
}

const TIER_STYLE = { great: "bg-[#2f7d4f]", close: "bg-[#c9a227]", near: "bg-[#d9822b]", far: "bg-[#b4432f]" };
const TIER_HEX = { great: "#2f7d4f", close: "#c9a227", near: "#d9822b", far: "#b4432f" };

/** Your guess (white ring) and the answer (solid ink) on an EraBar, joined by a line. Both read on every era colour. */
function GuessMarkers({ guess, answer }: { guess: number; answer: number }) {
  const g = sliderPos(guess) * 100;
  const a = sliderPos(answer) * 100;
  return (
    <div className="absolute inset-x-0 -top-1 h-4" aria-hidden="true">
      <span className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-ink" style={{ left: `${Math.min(g, a)}%`, width: `${Math.abs(a - g)}%` }} />
      <span className="absolute top-0 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-ink bg-white shadow-sm" style={{ left: `${g}%` }} />
      <span className="absolute -top-0.5 h-5 w-5 -translate-x-1/2 rounded-full bg-ink ring-[3px] ring-white shadow-sm" style={{ left: `${a}%` }} />
    </div>
  );
}

/** The five eras as coloured bands, with a label under each (labels hide on narrow screens). */
function EraBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="flex h-2 rounded-full overflow-hidden" aria-hidden="true">
        {GUESS_ERAS.map((e, i) => {
          const to = GUESS_ERAS[i + 1]?.from ?? MAX_GUESS;
          return <span key={e.label} style={{ width: `${(sliderPos(to) - sliderPos(e.from)) * 100}%`, background: e.color, opacity: 0.85 }} />;
        })}
      </div>
      {children}
      {/* Two staggered rows, so the narrow modern bands' labels don't collide. */}
      <div className="relative h-7 mt-1.5 font-mono text-[9.5px] uppercase tracking-wider text-ink/65" aria-hidden="true">
        {GUESS_ERAS.map((e, i) => {
          const to = GUESS_ERAS[i + 1]?.from ?? MAX_GUESS;
          const mid = ((sliderPos(e.from) + sliderPos(to)) / 2) * 100;
          const edge = i === 0 ? "translate-x-0" : i === GUESS_ERAS.length - 1 ? "-translate-x-full" : "-translate-x-1/2";
          return (
            <span
              key={e.label}
              className={`absolute whitespace-nowrap ${edge} ${i % 2 ? "top-3.5" : "top-0"}`}
              style={{ left: i === 0 ? 0 : i === GUESS_ERAS.length - 1 ? "100%" : `${mid}%` }}
            >
              {e.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The game. "daily" plays today's five maps (the same for everyone); after
 * that, "practice" deals five random ones as often as you like.
 */
export default function GuessGame() {
  const [day] = useState(() => dayNumber(new Date()));
  const [seed, setSeed] = useState<number | null>(null); // null = today's daily game
  const puzzles = puzzlesFor(seed ?? day);
  const [guesses, setGuesses] = useState<number[]>([]);
  const [hints, setHints] = useState<boolean[]>([]);
  // Hint shown for the round in progress (not yet guessed).
  const [hintNow, setHintNow] = useState(false);
  // The biggest territories in view, for the hint and the reveal.
  const [shown, setShown] = useState<{ year: number; list: ShownTerritory[] } | null>(null);
  const [value, setValue] = useState(1000);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [msLeft, setMsLeft] = useState<number | null>(null);
  // Which year's borders the map has finished drawing: no guessing a blank map.
  const [loadedYear, setLoadedYear] = useState<number | null>(null);

  // Pick up where today's game was left. Done after mount: storage is browser-only.
  useEffect(() => {
    const saved = loadGuesses(day);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGuesses(saved);
    setHints(loadHints(day));
    setRevealed(saved.length > 0 && saved.length < ROUNDS);
  }, [day]);

  const finishedDaily = seed === null && guesses.length === ROUNDS && !revealed;

  // Stats and the countdown only matter once today's game is over.
  useEffect(() => {
    if (!finishedDaily) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats(day));
    const tick = () => setMsLeft(msUntilNextGame(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [finishedDaily, day]);

  const round = revealed ? guesses.length - 1 : guesses.length;
  const finished = guesses.length === ROUNDS && !revealed;
  const puzzle = puzzles[Math.min(round, ROUNDS - 1)];
  const points = guesses.map((g, i) => scoreFor(g, puzzles[i].year, hints[i]));
  const inView = shown && shown.year === puzzle.year ? shown.list : null;
  const total = points.reduce((a, b) => a + b, 0);

  function guess() {
    const next = [...guesses, value];
    const nextHints = [...hints.slice(0, guesses.length), hintNow];
    setGuesses(next);
    setHints(nextHints);
    setRevealed(true);
    if (seed === null) {
      saveGuesses(day, next);
      saveHints(day, nextHints);
    }
  }

  function nextRound() {
    setRevealed(false);
    setHintNow(false);
    setValue(1000);
  }

  function practice() {
    setSeed(Math.floor(Math.random() * 1e9));
    setGuesses([]);
    setHints([]);
    setHintNow(false);
    setRevealed(false);
    setValue(1000);
  }

  function backToDaily() {
    const saved = loadGuesses(day);
    setSeed(null);
    setGuesses(saved);
    setHints(loadHints(day));
    setHintNow(false);
    setRevealed(saved.length > 0 && saved.length < ROUNDS);
    setValue(1000);
  }

  const text = shareText(seed === null ? day : null, puzzles, guesses, hints);

  if (finished) {
    const rank = rankFor(total);
    const avgOff = Math.round(guesses.reduce((sum, g, i) => sum + Math.abs(g - puzzles[i].year), 0) / ROUNDS);
    return (
      <div className="max-w-4xl">
        <ResultCard
          game="Guess the Year"
          edition={seed === null ? `Daily #${day}` : "Practice"}
          score={total.toLocaleString("en-US")}
          outOf={`/ ${(ROUNDS * 1000).toLocaleString("en-US")}`}
          rank={rank.title}
          line={`${rank.line} On average you were ${avgOff.toLocaleString("en-US")} years off.`}
          tiles={puzzles.map((p, i) => ({
            color: TIER_HEX[tierOf(points[i])],
            top: p.region.replace(/^The (.)/, (_, c: string) => c.toUpperCase()),
            bottom: guesses[i] === p.year ? "spot on" : `${Math.abs(guesses[i] - p.year).toLocaleString("en-US")} yrs off`,
          }))}
          stats={seed === null && stats ? [["Played", stats.played.toLocaleString("en-US")], ["Day streak", stats.streak.toLocaleString("en-US")], ["Best score", stats.best.toLocaleString("en-US")]] : undefined}
          text={text}
          url="bordersoftime.com/play"
        >
          <h2 className="font-display text-2xl text-ink">Map by map</h2>
          <p className="mt-2 flex gap-5 text-[13px] text-ink/72">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-ink" aria-hidden="true" />The answer</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-ink bg-white" aria-hidden="true" />Your guess</span>
          </p>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {puzzles.map((p, i) => {
              const off = Math.abs(guesses[i] - p.year);
              return (
                <li key={i} className="rounded-lg border border-ink/10 bg-card overflow-hidden">
                  <span className="block h-1.5" style={{ background: TIER_HEX[tierOf(points[i])] }} aria-hidden="true" />
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="label text-ink/65">Map {i + 1} · {p.region}</p>
                      <p className="font-mono text-[13px] text-ink tabular-nums">{points[i]} pts</p>
                    </div>
                    <p className="mt-2 font-display text-3xl text-ink tabular-nums">{formatYear(p.year)}</p>
                    <p className="mt-1 text-[13.5px] text-ink/70">
                      You said {formatYear(guesses[i])} · {off === 0 ? "spot on" : `${off.toLocaleString("en-US")} years off`}{hints[i] ? " · hint used" : ""}
                    </p>
                    <div className="mt-4 px-[7px]">
                      <EraBar>
                        <GuessMarkers guess={guesses[i]} answer={p.year} />
                      </EraBar>
                    </div>
                    <Link href={`/map?year=${p.year}&lat=${p.view.lat}&lng=${p.view.lng}&z=${p.view.zoom}`} className="mt-1 inline-block font-mono text-[11px] text-ink/65 hover:text-accent">
                      Explore this map →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>

          <section className="mt-12 border-t border-ink/10 pt-8">
            {seed === null ? (
              <>
                <h2 className="font-display text-2xl text-ink">Want to keep playing?</h2>
                <p className="mt-1 text-[15px] text-ink/72 max-w-xl">
                  Today’s five maps are done{msLeft !== null && <>, and the next daily game starts in <span className="tabular-nums">{countdown(msLeft)}</span></>}.
                  Until then, play five random maps as often as you like. They don’t change your daily score.
                </p>
              </>
            ) : (
              <h2 className="font-display text-2xl text-ink">Another round?</h2>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={practice} className="h-12 px-6 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
                {seed === null ? "Play five random maps" : "Play five more"}
              </button>
              {seed !== null && (
                <button type="button" onClick={backToDaily} className="h-12 px-6 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
                  Back to today’s game
                </button>
              )}
            </div>
          </section>
          <MoreGames current="/play" />
        </ResultCard>
      </div>
    );
  }

  const last = guesses.length - 1;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 lg:gap-10">
      <div className="relative h-[56svh] lg:h-[68svh] min-h-[360px] rounded-md overflow-hidden border border-ink/15 bg-[#cdd9e5]">
        <GuessMap
          year={puzzle.year}
          view={puzzle.view}
          reveal={revealed}
          hint={!revealed && hintNow && inView?.[0] ? inView[0].name : null}
          onLoaded={setLoadedYear}
          onTerritories={(year, list) => setShown({ year, list })}
        />
      </div>

      <div>
        <p className="label text-ink/65">
          {seed === null ? `Daily #${day}` : "Random maps"} · Map {round + 1} of {ROUNDS}
        </p>
        <p className="mt-2 font-display text-2xl text-ink">{puzzle.region}</p>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < guesses.length ? TIER_STYLE[tierOf(points[i])] : i === round ? "bg-ink/40" : "bg-ink/10"}`} />
          ))}
        </div>

        {!revealed ? (
          <>
            <p className="mt-8 text-[15px] text-ink/72 leading-relaxed">
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
            <div className="mt-1 px-[7px]">
              <EraBar />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-ink/62">
              <span>{formatYear(MIN_GUESS)}</span><span>{formatYear(MAX_GUESS)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              {[-100, -10, 10, 100].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setValue((v) => Math.min(MAX_GUESS, Math.max(MIN_GUESS, v + d)))}
                  className="flex-1 h-9 rounded-md border border-ink/15 font-mono text-[12px] text-ink/72 hover:border-accent hover:text-accent transition-colors"
                >
                  {d > 0 ? `+${d}` : d}
                </button>
              ))}
            </div>
            <div className="mt-4 text-[13px] text-ink/70">
              {hintNow ? (
                <p>
                  <span className="text-ink">Hint:</span> the territory outlined in red is{" "}
                  <span className="font-semibold text-[var(--color-vermilion)]">{inView?.[0]?.name}</span>. This map now scores half points.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setHintNow(true)}
                  disabled={!inView?.length}
                  className="underline underline-offset-4 decoration-ink/25 hover:text-accent disabled:opacity-40 disabled:no-underline"
                >
                  Stuck? Show one name (half points)
                </button>
              )}
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
            <p className="label text-ink/65">The answer</p>
            <p className="mt-1 font-display text-5xl tracking-tight text-ink">{formatYear(puzzles[last].year)}</p>
            <p className="mt-3 text-[15px] text-ink/72">
              You guessed {formatYear(guesses[last])}, {Math.abs(guesses[last] - puzzles[last].year).toLocaleString("en-US")} years off.
            </p>
            <div className="mt-6 px-[7px]">
              <EraBar>
                <GuessMarkers guess={guesses[last]} answer={puzzles[last].year} />
              </EraBar>
              <p className="mt-1 flex gap-4 text-[12px] text-ink/68">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-ink bg-white" aria-hidden="true" />Your guess</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-ink" aria-hidden="true" />The answer</span>
              </p>
            </div>
            <p className="mt-4 font-mono text-[13px] text-ink tabular-nums">+{points[last]} {points[last] === 1 ? "point" : "points"}{hints[last] ? " (half, hint used)" : ""}</p>
            {inView && inView.length > 0 && (
              <div className="mt-6">
                <p className="label text-ink/65">On this map</p>
                <ul className="mt-2 text-[15px] leading-relaxed">
                  {inView.slice(0, 4).map((t) => (
                    <li key={t.name}>
                      {t.slug ? (
                        <Link href={`/place/${t.slug}`} target="_blank" className="text-ink hover:text-accent underline underline-offset-4 decoration-ink/20">{t.name}</Link>
                      ) : (
                        <span className="text-ink/70">{t.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
