"use client";

import { useCallback, useMemo } from "react";
import { useAtlasStore } from "@/store/atlasStore";
import { formatYear, getEraForYear, ERAS } from "@/data/snapshotYears";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Position of a snapshot index as a 0–100% value along the track. */
function idxPct(idx: number, total: number): number {
  return total <= 1 ? 0 : (idx / (total - 1)) * 100;
}

/** Find the index of the snapshot year closest to (but not past) the target. */
function yearToIdx(year: number, years: number[]): number {
  let best = 0;
  for (let i = 0; i < years.length; i++) {
    if (years[i] <= year) best = i;
    else break;
  }
  return best;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function TimeSlider() {
  const { snapshotYear, snapshotYears, setYear } = useAtlasStore();

  const n = snapshotYears.length;
  const currentIdx = useMemo(
    () => yearToIdx(snapshotYear, snapshotYears),
    [snapshotYear, snapshotYears]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const idx = parseInt(e.target.value, 10);
      const y = snapshotYears[idx];
      if (y !== undefined) setYear(y);
    },
    [setYear, snapshotYears]
  );

  // Arrow keys step through snapshots; Home/End jump to first/last
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Home") {
        e.preventDefault();
        setYear(snapshotYears[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        setYear(snapshotYears[n - 1]);
      }
      // ArrowLeft/Right are handled natively by the range input (step=1 on index)
    },
    [setYear, snapshotYears, n]
  );

  // Map each ERA to a pixel range based on the index distribution
  const eraBands = useMemo(
    () =>
      ERAS.map((era) => {
        const startIdx = snapshotYears.findIndex((y) => y >= era.start);
        const endIdx = snapshotYears.findIndex((y) => y >= era.end);
        const s = startIdx < 0 ? n - 1 : startIdx;
        const e = endIdx < 0 ? n : endIdx;
        return {
          label: era.label,
          left: idxPct(s, n),
          width: idxPct(Math.max(0, e - s), n),
        };
      }),
    [snapshotYears, n]
  );

  const displayYear = formatYear(snapshotYear);
  const era = getEraForYear(snapshotYear);
  const thumbPct = idxPct(currentIdx, n);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
      {/* Gradient fade */}
      <div className="h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="bg-black/70 backdrop-blur-sm px-4 pt-3 pb-4 pointer-events-auto">
        {/* Year readout */}
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-white text-4xl font-bold font-mono tabular-nums leading-none">
            {displayYear}
          </span>
          <span className="text-white/60 text-sm font-medium">{era}</span>
          <span className="ml-auto text-white/35 text-[10px] tabular-nums">
            {currentIdx + 1} / {n} snapshots
          </span>
        </div>

        {/* Slider track + ticks */}
        <div className="relative mt-2 mb-1">
          {/* Era background bands — positioned by index, not calendar year */}
          <div className="absolute inset-0 h-1 top-3 overflow-hidden rounded pointer-events-none">
            {eraBands.map((b) =>
              b.width > 0 ? (
                <div
                  key={b.label}
                  className="absolute h-full"
                  style={{
                    left: `${b.left}%`,
                    width: `${b.width}%`,
                    background: "rgba(255,255,255,0.07)",
                    borderRight: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
              ) : null
            )}
          </div>

          {/* Snapshot tick marks — one per actual data year */}
          <div className="absolute w-full top-0 pointer-events-none" style={{ height: 7 }}>
            {snapshotYears.map((sy, i) => (
              <div
                key={sy}
                className="absolute w-px h-full rounded-full"
                style={{
                  left: `${idxPct(i, n)}%`,
                  transform: "translateX(-50%)",
                  background:
                    sy === snapshotYear
                      ? "rgba(251,191,36,0.9)"
                      : "rgba(255,255,255,0.30)",
                }}
              />
            ))}
          </div>

          {/* Index-based range input — each step = one real snapshot year */}
          <input
            type="range"
            min={0}
            max={Math.max(0, n - 1)}
            step={1}
            value={currentIdx}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label="Select historical year"
            aria-valuetext={displayYear}
            className="relative w-full appearance-none h-1 rounded mt-1.5 cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-amber-400
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-grab
              [&::-webkit-slider-thumb:active]:cursor-grabbing
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-amber-400
              [&::-moz-range-thumb]:border-0"
            style={{
              background: `linear-gradient(to right,
                rgba(251,191,36,0.8) 0%,
                rgba(251,191,36,0.8) ${thumbPct}%,
                rgba(255,255,255,0.2) ${thumbPct}%,
                rgba(255,255,255,0.2) 100%)`,
            }}
          />
        </div>

        {/* Era labels + data source note */}
        <div className="relative mt-1" style={{ height: 16 }}>
          {eraBands.map((b) =>
            b.width > 0.5 ? (
              <div
                key={b.label}
                className="absolute text-white/40 text-[10px] font-medium leading-none top-0"
                style={{ left: `${b.left}%` }}
              >
                {b.label}
              </div>
            ) : null
          )}
          <a
            href="/about"
            className="absolute right-0 top-0 text-white/25 text-[10px] hover:text-white/50 transition-colors leading-none"
            title="Data from aourednik/historical-basemaps. Some regions show placeholder names where historical records are incomplete."
          >
            53 snapshots · data notes ↗
          </a>
        </div>
      </div>
    </div>
  );
}
