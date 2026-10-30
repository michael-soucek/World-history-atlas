"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import { COMPARISONS, type Comparison } from "@/data/comparisons";

// MapLibre needs the browser.
const CompareMap = dynamic(() => import("@/components/CompareMap"), { ssr: false });

const fmt = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y} CE`);
/** Years worth comparing: the map's snapshots from 3000 BCE on. */
const YEARS = SNAPSHOT_YEARS.filter((y) => y >= -3000);

/**
 * The /compare page's interactive part: two year pickers, the preset list
 * and the split map. The chosen pair is kept in the URL (?a=1914&b=1920) so it
 * can be shared.
 */
export default function ComparePageClient({ initial }: { initial: Comparison }) {
  const [left, setLeft] = useState(initial.left);
  const [right, setRight] = useState(initial.right);
  const [view, setView] = useState(initial.view);
  const [preset, setPreset] = useState<string | null>(initial.slug || null);

  function choose(a: number, b: number, slug: string | null) {
    setLeft(a);
    setRight(b);
    setPreset(slug);
    const url = slug ? `/compare?pair=${slug}` : `/compare?a=${a}&b=${b}`;
    window.history.replaceState(null, "", url);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-wrap items-end gap-4 mb-5">
        <YearSelect label="Left" value={left} onChange={(y) => choose(y, right, null)} />
        <YearSelect label="Right" value={right} onChange={(y) => choose(left, y, null)} />
        <button
          type="button"
          onClick={() => choose(right, left, null)}
          className="h-11 px-4 rounded-md border border-ink/20 text-[14px] text-ink/70 hover:border-accent hover:text-accent transition-colors"
        >
          Swap
        </button>
      </div>

      <div className="relative h-[68svh] min-h-[420px] rounded-md overflow-hidden border border-ink/15">
        <CompareMap left={left} right={right} view={view} />
        <span className="absolute left-4 bottom-4 font-display text-4xl sm:text-6xl text-ink pointer-events-none [text-shadow:0_0_12px_var(--color-parchment,#f3efe6)]">{fmt(left)}</span>
        <span className="absolute right-4 bottom-10 font-display text-4xl sm:text-6xl text-ink pointer-events-none [text-shadow:0_0_12px_var(--color-parchment,#f3efe6)]">{fmt(right)}</span>
      </div>

      <section className="mt-12">
        <p className="label text-ink/66 mb-4">Try a comparison</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          {COMPARISONS.map((c) => (
            <li key={c.slug} className="border-b border-ink/10">
              <button
                type="button"
                onClick={() => { choose(c.left, c.right, c.slug); setView(c.view); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                aria-current={preset === c.slug ? "true" : undefined}
                className={`w-full flex items-baseline justify-between gap-3 py-3 text-left text-[15px] transition-colors hover:text-accent ${preset === c.slug ? "text-accent" : "text-ink/80"}`}
              >
                <span>{c.label}</span>
                <span className="shrink-0 font-mono text-[10px] tracking-wide text-ink/64 tabular-nums">{fmt(c.left)} / {fmt(c.right)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function YearSelect({ label, value, onChange }: { label: string; value: number; onChange: (y: number) => void }) {
  return (
    <label className="block">
      <span className="label text-ink/66 block mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 pl-3 pr-8 rounded-md border border-ink/20 bg-parchment text-[15px] text-ink focus:outline-none focus:border-accent"
      >
        {YEARS.map((y) => <option key={y} value={y}>{fmt(y)}</option>)}
      </select>
    </label>
  );
}
