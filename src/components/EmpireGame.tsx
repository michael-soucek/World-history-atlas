"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { FeatureCollection } from "geojson";
import {
  EMPIRE_ROUNDS, empireDay, empireRank, empireShareText, empireYears, formatYear, roundFor, territoriesOf,
  type EmpireResult, type EmpireRound,
} from "@/lib/empireGame";
import { msUntilNextGame, statsFrom, type PlayerStats } from "@/lib/guessGame";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import ResultCard from "@/components/ResultCard";
import MoreGames from "@/components/MoreGames";

const GREEN = "#2f7d4f";
const RED = "#b4432f";

// MapLibre needs the browser.
const EmpireMap = dynamic(() => import("@/components/EmpireMap"), { ssr: false });

/** Today's answers are remembered in this browser, so a reload doesn't reset the day. */
const storageKey = (day: number) => `name-the-empire:${day}`;

function isResult(r: unknown): r is EmpireResult {
  const o = r as EmpireResult;
  return !!o && typeof o.year === "number" && typeof o.answer === "string" && typeof o.picked === "string" && typeof o.slug === "string";
}

function loadResults(day: number): EmpireResult[] {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(day)) ?? "[]");
    return Array.isArray(saved) ? saved.filter(isResult).slice(0, EMPIRE_ROUNDS) : [];
  } catch {
    return [];
  }
}

function saveResults(day: number, results: EmpireResult[]) {
  try {
    localStorage.setItem(storageKey(day), JSON.stringify(results));
  } catch {
    // Private browsing or blocked storage: the game still works, it just won't remember.
  }
}

function loadStats(today: number): PlayerStats {
  const done: { day: number; total: number }[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const m = localStorage.key(i)?.match(/^name-the-empire:(\d+)$/);
      if (!m) continue;
      const results = loadResults(Number(m[1]));
      if (results.length === EMPIRE_ROUNDS) done.push({ day: Number(m[1]), total: results.filter((r) => r.picked === r.answer).length });
    }
  } catch {
    // Storage blocked: no stats.
  }
  return statsFrom(done, today);
}

function countdown(ms: number): string {
  const mins = Math.max(0, Math.floor(ms / 60_000));
  const h = Math.floor(mins / 60);
  return h > 0 ? `${h}h ${String(mins % 60).padStart(2, "0")}m` : `${mins}m`;
}

interface Loaded {
  borders: FeatureCollection;
  labels: FeatureCollection | null;
  round: EmpireRound;
}

/**
 * Fetch a year's borders and build its round. A year with too few nameable
 * territories (rare) falls through to the next snapshot, so a round always exists.
 */
async function loadRound(year: number, seed: number): Promise<Loaded | null> {
  const start = Math.max(0, SNAPSHOT_YEARS.indexOf(year));
  for (let i = start; i < SNAPSHOT_YEARS.length; i++) {
    const y = SNAPSHOT_YEARS[i];
    const [borders, labels] = await Promise.all([
      fetch(`/api/snapshot/${y}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/snapshot/${y}/labels`).then((r) => (r.ok ? r.json() : null)),
    ]);
    if (!borders) continue;
    const round = roundFor(y, territoriesOf(borders), seed);
    if (round) return { borders, labels, round };
  }
  return null;
}

/**
 * The game. "daily" plays today's five rounds (the same for everyone); after
 * that, practice deals five random ones as often as you like.
 */
export default function EmpireGame() {
  const [day] = useState(() => empireDay(new Date()));
  const [seed, setSeed] = useState<number | null>(null); // null = today's daily game
  const years = empireYears(seed ?? day);
  const [results, setResults] = useState<EmpireResult[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const saved = loadResults(day);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(saved);
  }, [day]);

  const round = revealed ? results.length - 1 : results.length;
  const finished = results.length === EMPIRE_ROUNDS && !revealed;
  const year = years[Math.min(round, EMPIRE_ROUNDS - 1)];
  const roundSeed = (seed ?? day) * 10 + round;

  // Load the current round's map. Kept while revealed, so the answer stays on screen.
  useEffect(() => {
    if (finished || revealed) return;
    let current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(null);
    setFailed(false);
    loadRound(year, roundSeed)
      .then((l) => {
        if (!current) return;
        if (l) setLoaded(l);
        else setFailed(true);
      })
      .catch(() => current && setFailed(true));
    return () => { current = false; };
  }, [year, roundSeed, finished, revealed]);

  const finishedDaily = seed === null && finished;
  useEffect(() => {
    if (!finishedDaily) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats(day));
    const tick = () => setMsLeft(msUntilNextGame(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [finishedDaily, day]);

  function pick(name: string) {
    if (!loaded || revealed) return;
    const r = loaded.round;
    const next = [...results, { year: r.year, answer: r.answer.name, slug: r.answer.slug, picked: name }];
    setResults(next);
    setRevealed(true);
    if (seed === null) saveResults(day, next);
  }

  function nextRound() {
    setRevealed(false);
  }

  function practice() {
    setSeed(Math.floor(Math.random() * 1e9));
    setResults([]);
    setRevealed(false);
  }

  function backToDaily() {
    setSeed(null);
    setResults(loadResults(day));
    setRevealed(false);
  }

  const text = empireShareText(seed === null ? day : null, results);

  if (finished) {
    const correct = results.filter((r) => r.picked === r.answer).length;
    const rank = empireRank(correct);
    return (
      <div className="max-w-4xl">
        <ResultCard
          game="Name the Empire"
          edition={seed === null ? `Daily #${day}` : "Practice"}
          score={String(correct)}
          outOf={`/ ${EMPIRE_ROUNDS}`}
          rank={rank.title}
          line={rank.line}
          tiles={results.map((r) => ({ color: r.picked === r.answer ? GREEN : RED, top: formatYear(r.year), bottom: r.picked === r.answer ? "named it" : "missed" }))}
          stats={seed === null && stats ? [["Played", stats.played.toLocaleString("en-US")], ["Day streak", stats.streak.toLocaleString("en-US")], ["Best", `${stats.best}/${EMPIRE_ROUNDS}`]] : undefined}
          text={text}
          url="bordersoftime.com/play/empire"
        >
          <h2 className="font-display text-2xl text-ink">Round by round</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {results.map((r, i) => {
              const right = r.picked === r.answer;
              return (
                <li key={i} className="rounded-lg border border-ink/10 bg-card overflow-hidden">
                  <span className="block h-1.5" style={{ background: right ? GREEN : RED }} aria-hidden="true" />
                  <div className="p-5">
                    <p className="label text-ink/45">Round {i + 1} · {formatYear(r.year)}</p>
                    <p className="mt-2 font-display text-2xl text-ink">{r.answer}</p>
                    <p className="mt-1 text-[13.5px] text-ink/55">{right ? "You named it." : `You said ${r.picked}.`}</p>
                    <Link href={`/place/${r.slug}`} className="mt-3 inline-block font-mono text-[11px] text-ink/45 hover:text-accent">Read its history →</Link>
                  </div>
                </li>
              );
            })}
          </ol>

          <section className="mt-12 border-t border-ink/10 pt-8">
            {seed === null ? (
              <>
                <h2 className="font-display text-2xl text-ink">Want to keep playing?</h2>
                <p className="mt-1 text-[15px] text-ink/60 max-w-xl">
                  Today’s five are done{msLeft !== null && <>, and the next daily game starts in <span className="tabular-nums">{countdown(msLeft)}</span></>}.
                  Until then, play five random rounds as often as you like.
                </p>
              </>
            ) : (
              <h2 className="font-display text-2xl text-ink">Another round?</h2>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={practice} className="h-12 px-6 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
                {seed === null ? "Play five random rounds" : "Play five more"}
              </button>
              {seed !== null && (
                <button type="button" onClick={backToDaily} className="h-12 px-6 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
                  Back to today’s game
                </button>
              )}
            </div>
          </section>
          <MoreGames current="/play/empire" />
        </ResultCard>
      </div>
    );
  }

  const last = results[results.length - 1];
  const r = loaded?.round;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 lg:gap-10">
      <div className="relative h-[52svh] lg:h-[68svh] min-h-[340px] rounded-md overflow-hidden border border-ink/15 bg-[#cdd9e5]">
        <EmpireMap borders={loaded?.borders ?? null} labels={loaded?.labels ?? null} target={r?.answer ?? null} reveal={revealed} />
        {failed && (
          <div className="absolute inset-0 grid place-items-center bg-[#cdd9e5] p-6 text-center text-[15px] text-ink/60">
            This map didn’t load. Check your connection and reload the page.
          </div>
        )}
      </div>

      <div>
        <p className="label text-ink/45">
          {seed === null ? `Daily #${day}` : "Random rounds"} · Round {round + 1} of {EMPIRE_ROUNDS}
        </p>
        <p className="mt-2 font-display text-4xl tracking-tight text-ink tabular-nums">{r ? formatYear(r.year) : " "}</p>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: EMPIRE_ROUNDS }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < results.length ? (results[i].picked === results[i].answer ? "bg-[#2f7d4f]" : "bg-[#b4432f]") : i === round ? "bg-ink/40" : "bg-ink/10"
              }`}
            />
          ))}
        </div>

        <p className="mt-8 text-[15px] text-ink/60 leading-relaxed">
          {revealed ? "Names are now showing on the map." : <>Which state is <span className="text-[#b4432f] font-semibold">lit up in red</span>?</>}
        </p>

        <div className="mt-4 grid gap-2" role="group" aria-label="Choices">
          {(r?.choices ?? ["", "", "", ""]).map((name, i) => {
            const isAnswer = revealed && last && name === last.answer;
            const isWrongPick = revealed && last && name === last.picked && name !== last.answer;
            return (
              <button
                key={name || i}
                type="button"
                disabled={!r || revealed}
                onClick={() => pick(name)}
                className={`min-h-12 px-4 py-2.5 rounded-md border text-left text-[15px] transition-colors ${
                  isAnswer
                    ? "border-[#2f7d4f] bg-[#2f7d4f] text-white"
                    : isWrongPick
                      ? "border-[#b4432f] bg-[#b4432f]/10 text-[#8f2a16] line-through"
                      : revealed
                        ? "border-ink/10 text-ink/40"
                        : "border-ink/20 text-ink hover:border-accent hover:text-accent disabled:opacity-40"
                }`}
              >
                {name || " "}
              </button>
            );
          })}
        </div>

        {revealed && last && (
          <div className="mt-6" aria-live="polite">
            <p className="font-display text-2xl text-ink">{last.picked === last.answer ? "Correct." : "Not this time."}</p>
            <p className="mt-1 text-[15px] text-ink/60">
              That was {last.answer}, as its borders stood in {formatYear(last.year)}.{" "}
              <Link href={`/place/${last.slug}`} target="_blank" className="underline underline-offset-4 decoration-ink/25 hover:text-accent">
                Read its history
              </Link>
            </p>
            <button
              type="button"
              onClick={nextRound}
              className="mt-6 w-full h-12 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors"
            >
              {results.length === EMPIRE_ROUNDS ? "See your score" : "Next round"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
