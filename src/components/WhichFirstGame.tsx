"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import MoreGames from "@/components/MoreGames";
import { formatEventYear, nextPair, streakRank } from "@/lib/timelineGames";
import type { DatedEvent } from "@/data/datedEvents";

const BEST_KEY = "which-came-first:best";

function loadBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    // Storage blocked: the best score just isn't remembered.
  }
}

const GREEN = "#2f7d4f";
const RED = "#b4432f";

/**
 * "Which came first?": two events, tap the earlier one. Each right answer
 * adds to the streak and the next pair is closer in time; one miss ends the run.
 */
export default function WhichFirstGame() {
  const used = useRef(new Set<string>());
  const [pair, setPair] = useState<[DatedEvent, DatedEvent] | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);

  const deal = useCallback((s: number) => {
    const p = nextPair(s, used.current);
    used.current.add(p[0].id);
    used.current.add(p[1].id);
    setPair(p);
    setPicked(null);
  }, []);

  // Dealt after mount: the pair is random, so it can't be rendered on the server.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBest(loadBest());
    deal(0);
  }, [deal]);

  const right = pair && picked ? (pair[0].id === picked ? pair[0].year < pair[1].year : pair[1].year < pair[0].year) : null;

  function pick(id: string) {
    if (!pair || picked) return;
    setPicked(id);
    const correct = pair[0].id === id ? pair[0].year < pair[1].year : pair[1].year < pair[0].year;
    if (correct) {
      const s = streak + 1;
      setStreak(s);
      if (s > best) {
        setBest(s);
        saveBest(s);
      }
    }
  }

  function next() {
    if (right) deal(streak);
    else setOver(true);
  }

  function restart() {
    used.current = new Set();
    setStreak(0);
    setOver(false);
    deal(0);
  }

  // Arrow keys pick left/right; Enter or Space moves on.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!pair || over) return;
      if (!picked && (e.key === "ArrowLeft" || e.key === "ArrowRight")) pick(e.key === "ArrowLeft" ? pair[0].id : pair[1].id);
      else if (picked && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (over) {
    const rank = streakRank(streak);
    const text = [
      "Borders of Time · Which Came First?",
      `Streak: ${streak} · ${rank.title}`,
      `${"🟩".repeat(Math.min(streak, 20))}🟥`,
      "",
      "How long can you keep history in order?",
      "https://bordersoftime.com/play/which-came-first",
    ].join("\n");
    return (
      <div className="max-w-3xl">
        <ResultCard
          game="Which Came First?"
          edition="Streak"
          score={String(streak)}
          outOf="in a row"
          rank={rank.title}
          line={rank.line}
          tiles={[...Array.from({ length: Math.min(streak, 19) }, () => ({ color: GREEN })), { color: RED }]}
          stats={[["This run", String(streak)], ["Best", String(best)], ["Pairs seen", String(streak + 1)]]}
          text={text}
          url="bordersoftime.com/play/which-came-first"
        >
          {pair && (
            <div>
              <h2 className="font-display text-2xl text-ink">The one that got you</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {[...pair].sort((a, b) => a.year - b.year).map((e, i) => (
                  <li key={e.id} className="rounded-lg border border-ink/10 bg-card p-5">
                    <p className="label text-ink/45">{i === 0 ? "Came first" : "Came second"}</p>
                    <p className="mt-2 font-display text-3xl text-ink tabular-nums">{formatEventYear(e.year)}</p>
                    <p className="mt-1 text-[15px] text-ink/75">{e.text}</p>
                    {e.href && <Link href={e.href} className="mt-3 inline-block font-mono text-[11px] text-ink/45 hover:text-accent">Read about it →</Link>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={restart} className="h-12 px-6 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors">
              Start a new run
            </button>
          </div>
          <MoreGames current="/play/which-came-first" />
        </ResultCard>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="label text-ink/45">Streak</p>
          <p className="font-display text-5xl tracking-tight text-ink tabular-nums">{streak}</p>
        </div>
        <div className="text-right">
          <p className="label text-ink/45">Best</p>
          <p className="font-display text-3xl text-ink/60 tabular-nums">{best}</p>
        </div>
      </div>
      <p className="mt-6 text-[15px] text-ink/60">Which of these happened first? The pairs get closer in time as your streak grows.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] items-stretch">
        {(pair ?? [null, null]).map((e, i) => {
          const isPick = e && picked === e.id;
          const isEarlier = e && pair && e.year < pair[1 - i].year;
          const tone = !picked || !e
            ? "border-ink/15 bg-card hover:border-accent hover:-translate-y-0.5"
            : isEarlier
              ? "border-[#2f7d4f] bg-[#2f7d4f]/8"
              : isPick
                ? "border-[#b4432f] bg-[#b4432f]/8"
                : "border-ink/10 bg-card opacity-70";
          return (
            <div key={e?.id ?? i} className="contents">
              {i === 1 && (
                <div className="flex items-center justify-center font-display italic text-2xl text-ink/35" aria-hidden="true">or</div>
              )}
              <button
                type="button"
                disabled={!e || !!picked}
                onClick={() => e && pick(e.id)}
                className={`relative min-h-44 flex flex-col items-start justify-start rounded-xl border-2 p-6 text-left transition-all disabled:cursor-default ${tone}`}
              >
                <span className="font-display text-2xl sm:text-[28px] leading-snug text-ink">{e?.text ?? " "}</span>
                <span className={`mt-4 block font-display text-4xl tabular-nums transition-opacity ${picked ? "opacity-100" : "opacity-0"} ${isEarlier ? "text-[#2f7d4f]" : "text-ink/50"}`}>
                  {e ? formatEventYear(e.year) : ""}
                </span>
                {picked && isEarlier && <span className="absolute top-4 right-4 label text-[#2f7d4f]">First</span>}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 min-h-12" aria-live="polite">
        {picked && pair && (
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-display text-2xl text-ink">{right ? "Correct." : "Not this time."}</p>
            <button type="button" onClick={next} className="h-12 px-6 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors">
              {right ? "Next pair" : "See your result"}
            </button>
            <span className="text-[13px] text-ink/45 max-sm:hidden">or press Enter</span>
          </div>
        )}
        {!picked && <p className="text-[13px] text-ink/40 max-sm:hidden">Tip: the left and right arrow keys pick a card.</p>}
      </div>
    </div>
  );
}
