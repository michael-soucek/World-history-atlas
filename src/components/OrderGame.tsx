"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import MoreGames from "@/components/MoreGames";
import { ORDER_COUNT, formatEventYear, orderDay, orderMarks, orderPuzzle, orderRank } from "@/lib/timelineGames";
import { msUntilNextGame, statsFrom, type PlayerStats } from "@/lib/guessGame";
import { DATED_EVENTS, type DatedEvent } from "@/data/datedEvents";

const storageKey = (day: number) => `put-in-order:${day}`;
const GREEN = "#2f7d4f";
const RED = "#b4432f";

/** A saved answer: the player's order of event ids. */
function loadOrder(day: number): DatedEvent[] | null {
  try {
    const ids = JSON.parse(localStorage.getItem(storageKey(day)) ?? "null");
    if (!Array.isArray(ids)) return null;
    const events = ids.map((id) => DATED_EVENTS.find((e) => e.id === id)).filter((e): e is DatedEvent => !!e);
    return events.length === ORDER_COUNT ? events : null;
  } catch {
    return null;
  }
}

function saveOrder(day: number, order: DatedEvent[]) {
  try {
    localStorage.setItem(storageKey(day), JSON.stringify(order.map((e) => e.id)));
  } catch {
    // Storage blocked: the game still works, it just won't remember.
  }
}

function loadStats(today: number): PlayerStats {
  const done: { day: number; total: number }[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const m = localStorage.key(i)?.match(/^put-in-order:(\d+)$/);
      if (!m) continue;
      const order = loadOrder(Number(m[1]));
      if (order) done.push({ day: Number(m[1]), total: orderMarks(order).filter(Boolean).length });
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

/**
 * "Put it in order": five events, earliest at the top. Move them with the
 * arrows (or drag on a computer), then check. One go per day, plus practice.
 */
export default function OrderGame() {
  const [day] = useState(() => orderDay(new Date()));
  const [seed, setSeed] = useState<number | null>(null); // null = today's daily
  const [order, setOrder] = useState<DatedEvent[]>(() => orderPuzzle(day));
  const [checked, setChecked] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const saved = loadOrder(day);
    if (!saved) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(saved);
    setChecked(true);
  }, [day]);

  const finishedDaily = seed === null && checked;
  useEffect(() => {
    if (!finishedDaily) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats(day));
    const tick = () => setMsLeft(msUntilNextGame(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [finishedDaily, day]);

  function move(from: number, to: number) {
    if (checked || to < 0 || to >= order.length || from === to) return;
    const next = [...order];
    const [e] = next.splice(from, 1);
    next.splice(to, 0, e);
    setOrder(next);
  }

  function check() {
    setChecked(true);
    if (seed === null) saveOrder(day, order);
  }

  function practice() {
    const s = Math.floor(Math.random() * 1e9);
    setSeed(s);
    setOrder(orderPuzzle(s));
    setChecked(false);
  }

  function backToDaily() {
    setSeed(null);
    const saved = loadOrder(day);
    setOrder(saved ?? orderPuzzle(day));
    setChecked(!!saved);
  }

  const marks = orderMarks(order);
  const right = marks.filter(Boolean).length;
  const sorted = [...order].sort((a, b) => a.year - b.year);

  const list = (
    <ol className="grid gap-2">
      {order.map((e, i) => {
        const ok = marks[i];
        return (
          <li
            key={e.id}
            draggable={!checked}
            onDragStart={() => setDragging(i)}
            onDragOver={(ev) => { ev.preventDefault(); if (dragging !== null && dragging !== i) { move(dragging, i); setDragging(i); } }}
            onDragEnd={() => setDragging(null)}
            className={`grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 sm:gap-x-4 rounded-lg border bg-card px-4 py-3.5 transition-shadow ${
              checked ? (ok ? "border-[#2f7d4f]/40" : "border-[#b4432f]/40") : "border-ink/12 cursor-grab active:cursor-grabbing hover:shadow-sm"
            } ${dragging === i ? "opacity-50" : ""}`}
          >
            <span className={`grid h-8 w-8 place-items-center rounded-full font-mono text-[13px] ${checked ? (ok ? "bg-[#2f7d4f] text-white" : "bg-[#b4432f] text-white") : "bg-ink/8 text-ink/60"}`}>
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-[16px] sm:text-[17px] leading-snug text-ink">{e.text}</span>
              {checked && (
                <span className="block mt-1 font-mono text-[12px] text-ink/55">
                  {formatEventYear(e.year)}
                  {!ok && <> · belongs at no. {sorted.findIndex((x) => x.id === e.id) + 1}</>}
                  {e.href && <> · <Link href={e.href} className="hover:text-accent">read about it</Link></>}
                </span>
              )}
            </span>
            {!checked && (
              <span className="flex flex-col gap-1">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move "${e.text}" earlier`} className="h-8 w-9 rounded-md border border-ink/15 text-ink/60 hover:border-accent hover:text-accent disabled:opacity-25">↑</button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === order.length - 1} aria-label={`Move "${e.text}" later`} className="h-8 w-9 rounded-md border border-ink/15 text-ink/60 hover:border-accent hover:text-accent disabled:opacity-25">↓</button>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );

  if (checked) {
    const rank = orderRank(right);
    const edition = seed === null ? `Daily #${day}` : "Practice";
    const text = [
      `Borders of Time · Put It in Order${seed === null ? ` #${day}` : " (practice)"}`,
      `${right}/${ORDER_COUNT} in place · ${rank.title}`,
      marks.map((m) => (m ? "🟩" : "🟥")).join(""),
      "",
      "Can you put history in order?",
      "https://bordersoftime.com/play/order",
    ].join("\n");
    return (
      <div className="max-w-3xl">
        <ResultCard
          game="Put It in Order"
          edition={edition}
          score={String(right)}
          outOf={`/ ${ORDER_COUNT}`}
          rank={rank.title}
          line={rank.line}
          tiles={marks.map((m, i) => ({ color: m ? GREEN : RED, top: `No. ${i + 1}`, bottom: formatEventYear(order[i].year) }))}
          stats={seed === null && stats ? [["Played", String(stats.played)], ["Day streak", String(stats.streak)], ["Best", `${stats.best}/${ORDER_COUNT}`]] : undefined}
          text={text}
          url="bordersoftime.com/play/order"
        >
          <h2 className="font-display text-2xl text-ink">Your order</h2>
          <div className="mt-4">{list}</div>
          <section className="mt-12 border-t border-ink/10 pt-8">
            {seed === null ? (
              <>
                <h2 className="font-display text-2xl text-ink">Want to keep playing?</h2>
                <p className="mt-1 text-[15px] text-ink/60 max-w-xl">
                  Today’s five are done{msLeft !== null && <>, and new ones arrive in <span className="tabular-nums">{countdown(msLeft)}</span></>}. Until then, practise with five random events.
                </p>
              </>
            ) : (
              <h2 className="font-display text-2xl text-ink">Another round?</h2>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={practice} className="h-12 px-6 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
                {seed === null ? "Practise with five random events" : "Five more"}
              </button>
              {seed !== null && (
                <button type="button" onClick={backToDaily} className="h-12 px-6 rounded-md border border-ink/20 text-[15px] text-ink/80 hover:border-accent hover:text-accent transition-colors">
                  Back to today’s game
                </button>
              )}
            </div>
          </section>
          <MoreGames current="/play/order" />
        </ResultCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <p className="label text-ink/45">{seed === null ? `Daily #${day}` : "Practice"} · {ORDER_COUNT} events</p>
      <p className="mt-3 text-[15px] text-ink/60">
        Put these in the order they happened, <span className="text-ink">earliest at the top</span>. Use the arrows, or drag them on a computer.
      </p>
      <p className="mt-6 label text-ink/40">Earliest</p>
      <div className="mt-2">{list}</div>
      <p className="mt-2 label text-ink/40">Latest</p>
      <button type="button" onClick={check} className="mt-8 w-full sm:w-auto h-12 px-8 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors">
        Check my order
      </button>
    </div>
  );
}
