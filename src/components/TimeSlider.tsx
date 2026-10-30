"use client";

import { useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAtlasStore } from "@/store/atlasStore";
import { clampYear, formatYear, getEraForYear, ERAS, MAX_YEAR, MIN_YEAR } from "@/data/snapshotYears";

// ── Time scale ─────────────────────────────────────────────────────────────
// A piecewise-linear scale: each age gets a fair share of the track instead
// of prehistory taking 80% of it. Ticks, era bands, labels and the handle all
// use this one scale, so they always line up.

const ANCHORS: [number, number][] = [
  [MIN_YEAR, 0],
  [-3000, 0.1],
  [-500, 0.26],
  [500, 0.44],
  [1500, 0.66],
  [1800, 0.82],
  [MAX_YEAR, 1],
];

const RESOLUTION = 2000; // input steps along the track

function yearToPos(year: number): number {
  const y = clampYear(year);
  for (let i = 1; i < ANCHORS.length; i++) {
    const [y0, p0] = ANCHORS[i - 1];
    const [y1, p1] = ANCHORS[i];
    if (y <= y1) return p0 + ((y - y0) / (y1 - y0)) * (p1 - p0);
  }
  return 1;
}

function posToYear(pos: number): number {
  for (let i = 1; i < ANCHORS.length; i++) {
    const [y0, p0] = ANCHORS[i - 1];
    const [y1, p1] = ANCHORS[i];
    if (pos <= p1) return Math.round(y0 + ((pos - p0) / (p1 - p0)) * (y1 - y0));
  }
  return MAX_YEAR;
}

function parts(year: number) {
  const f = formatYear(year);
  const [n, e] = f.split(" ");
  return { n, e };
}

// ── Component ─────────────────────────────────────────────────────────────

export default function TimeSlider() {
  const { year, snapshotYear, snapshotYears, setYear, selectedWikidataId, selectedName } = useAtlasStore();
  // The story panel takes the right-hand 22.5rem on wider screens.
  const panelOpen = Boolean(selectedWikidataId || selectedName);

  const visible = useMemo(
    () => snapshotYears.filter((y) => y >= MIN_YEAR && y <= MAX_YEAR),
    [snapshotYears]
  );

  const prevSnap = [...visible].reverse().find((y) => y < year);
  const nextSnap = visible.find((y) => y > year);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setYear(clampYear(posToYear(parseInt(e.target.value, 10) / RESOLUTION)));
    },
    [setYear]
  );

  // Arrow keys step map by map; Shift+arrow by a single year; Home/End jump.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Home") { e.preventDefault(); setYear(MIN_YEAR); }
      else if (e.key === "End") { e.preventDefault(); setYear(MAX_YEAR); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        if (e.shiftKey) setYear(clampYear(year - 1));
        else if (prevSnap !== undefined) setYear(prevSnap);
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        if (e.shiftKey) setYear(clampYear(year + 1));
        else if (nextSnap !== undefined) setYear(nextSnap);
      }
    },
    [setYear, year, prevSnap, nextSnap]
  );

  const bands = useMemo(
    () =>
      ERAS.map((era) => {
        const left = yearToPos(Math.max(MIN_YEAR, era.start)) * 100;
        const right = yearToPos(Math.min(MAX_YEAR, era.end)) * 100;
        return { label: era.label, left, width: Math.max(0, right - left) };
      }),
    []
  );

  const y = parts(year);
  const era = getEraForYear(year);
  const thumbPct = yearToPos(year) * 100;

  return (
    <div className={`absolute bottom-0 left-0 right-0 z-10 pointer-events-none transition-[right] duration-300 ${panelOpen ? "sm:right-90" : ""}`}>
      <div className="h-24 bg-linear-to-t from-night/70 to-transparent" />

      <div className="bg-night/90 backdrop-blur-md border-t border-white/10 pointer-events-auto text-parchment">
        <div className="px-4 sm:px-6 pt-4 pb-4 sm:pb-5">
          {/* Readout */}
          <div className="flex items-end gap-4 mb-4">
            <p className="font-display font-light leading-[0.85] tracking-[-0.03em] tabular-nums text-[44px] sm:text-[64px]" aria-live="polite">
              {y.n}
              <span className="text-[0.32em] italic tracking-normal text-glow ml-1.5 align-top">{y.e}</span>
            </p>
            <div className="pb-1 min-w-0">
              <p className="font-display italic text-lg sm:text-xl text-parchment/80 leading-tight">{era}</p>
              <p className="font-mono text-[10px] sm:text-[11px] tracking-wider text-parchment/60 mt-0.5 truncate">
                Borders from the {formatYear(snapshotYear)} map
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => prevSnap !== undefined && setYear(prevSnap)}
                disabled={prevSnap === undefined}
                className="h-9 sm:h-10 pl-2 pr-3 inline-flex items-center gap-1 rounded-md border border-white/15 text-[12px] font-mono text-parchment/70 hover:text-parchment hover:border-glow/60 disabled:opacity-30 transition-colors"
                aria-label={prevSnap !== undefined ? `Previous map: ${formatYear(prevSnap)}` : "No earlier map"}
              >
                <ChevronLeft size={15} aria-hidden="true" />
                <span className="max-sm:hidden">{prevSnap !== undefined ? formatYear(prevSnap) : "—"}</span>
              </button>
              <button
                type="button"
                onClick={() => nextSnap !== undefined && setYear(nextSnap)}
                disabled={nextSnap === undefined}
                className="h-9 sm:h-10 pl-3 pr-2 inline-flex items-center gap-1 rounded-md border border-white/15 text-[12px] font-mono text-parchment/70 hover:text-parchment hover:border-glow/60 disabled:opacity-30 transition-colors"
                aria-label={nextSnap !== undefined ? `Next map: ${formatYear(nextSnap)}` : "No later map"}
              >
                <span className="max-sm:hidden">{nextSnap !== undefined ? formatYear(nextSnap) : "—"}</span>
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Track */}
          <div className="relative h-8">
            {/* Era bands */}
            <div className="absolute inset-x-0 top-[14px] h-[3px] pointer-events-none">
              {bands.map((b, i) => (
                <div
                  key={b.label}
                  className={`absolute h-full ${i % 2 ? "bg-white/[0.16]" : "bg-white/[0.09]"}`}
                  style={{ left: `${b.left}%`, width: `${b.width}%` }}
                />
              ))}
              <div className="absolute h-full left-0 bg-glow/80" style={{ width: `${thumbPct}%` }} />
            </div>
            {/* One tick per map */}
            <div className="absolute inset-x-0 top-[6px] h-[19px] pointer-events-none">
              {visible.map((sy) => (
                <div
                  key={sy}
                  className="absolute top-0 w-px -translate-x-1/2"
                  style={{
                    left: `${yearToPos(sy) * 100}%`,
                    height: sy === snapshotYear ? 19 : 7,
                    background: sy === snapshotYear ? "#9fb7ff" : "rgba(238,240,242,0.35)",
                  }}
                />
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={RESOLUTION}
              step={1}
              value={Math.round(thumbPct * (RESOLUTION / 100))}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              aria-label="Select historical year"
              aria-valuetext={formatYear(year)}
              className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer
                [&::-webkit-slider-runnable-track]:h-8
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:mt-[7px]
                [&::-webkit-slider-thumb]:w-[18px]
                [&::-webkit-slider-thumb]:h-[18px]
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-parchment
                [&::-webkit-slider-thumb]:border-[3px]
                [&::-webkit-slider-thumb]:border-glow
                [&::-webkit-slider-thumb]:shadow-[0_0_0_6px_rgba(159,183,255,0.2)]
                [&::-webkit-slider-thumb]:cursor-grab
                [&::-webkit-slider-thumb:active]:cursor-grabbing
                [&::-moz-range-track]:bg-transparent
                [&::-moz-range-thumb]:w-[18px]
                [&::-moz-range-thumb]:h-[18px]
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-parchment
                [&::-moz-range-thumb]:border-[3px]
                [&::-moz-range-thumb]:border-glow"
            />
          </div>

          {/* Era labels, centred in their bands */}
          <div className="relative h-4 mt-1 max-sm:hidden">
            {bands.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setYear(posToYear((b.left + b.width / 2) / 100))}
                className={`absolute -translate-x-1/2 font-mono text-[10px] tracking-wider uppercase whitespace-nowrap transition-colors ${
                  b.label === era ? "text-glow" : "text-parchment/60 hover:text-parchment/80"
                }`}
                style={{ left: `${b.left + b.width / 2}%` }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
