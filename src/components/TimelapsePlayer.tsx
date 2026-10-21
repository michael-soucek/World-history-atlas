"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import { ChevronLeft, ChevronRight, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { BASE_STYLE, EMPTY_FC } from "@/lib/mapBaseStyle";
import { MAP } from "@/lib/palette";
import { createTimelapse, timelapseLayers, type TimelapseData } from "@/lib/timelapseData";
import { atYear, type Bbox, type TimelapseEvent, type TimelapseLeaders, type TimelapseName } from "@/data/timelapses";

/** Years per second, and the extra pause on a year the borders change. */
const SPEEDS = [
  { label: "Slow", yps: 8, hold: 400 },
  { label: "Normal", yps: 30, hold: 140 },
  { label: "Fast", yps: 100, hold: 20 },
] as const;
const SHOW_CHANGES = 5;
/** How long a change stays in the caption. */
const RECENT_YEARS = 40;

/** There is no year 0: 1 BCE is followed by 1 CE. */
const step = (y: number, d: number) => {
  const n = y + d;
  return n === 0 ? n + Math.sign(d) : n;
};
const fix = (y: number) => (y === 0 ? 1 : y);

function yearParts(y: number) {
  return y < 0 ? { num: String(-y), era: "BCE" } : { num: String(y), era: "CE" };
}

function Names({ items, max = SHOW_CHANGES }: { items: TimelapseName[]; max?: number }) {
  const shown = items.slice(0, max);
  return (
    <>
      {shown.map((it, i) => (
        <span key={it.name}>
          {i > 0 && ", "}
          {it.slug ? (
            <Link href={`/place/${it.slug}`} className="text-ink/80 hover:text-accent underline decoration-ink/20 underline-offset-4">
              {it.name}
            </Link>
          ) : (
            it.name
          )}
        </span>
      ))}
      {items.length > max && <span className="text-ink/45"> and {items.length - max} more</span>}
    </>
  );
}

export interface TimelapsePlayerProps {
  slug: string;
  label: string;
  bbox: Bbox;
  tallBbox?: Bbox;
  from: number;
  to: number;
  changes: number[];
  events: TimelapseEvent[];
  leaders: TimelapseLeaders[];
}

/**
 * One region's borders drawn for every single year, from Cliopatria data
 * (public/timelapse-data/{slug}.json). The map is redrawn only in the years
 * the borders change; the counter ticks through every year.
 */
export default function TimelapsePlayer({ slug, label, bbox, tallBbox, from, to, changes, events, leaders }: TimelapsePlayerProps) {
  const reduced = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const tlRef = useRef<ReturnType<typeof createTimelapse> | null>(null);
  const drawnKey = useRef("");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [year, setYear] = useState(from);
  const [playing, setPlaying] = useState(true);
  const [touched, setTouched] = useState(false); // the reader has used the controls
  const [speed, setSpeed] = useState(1);
  const changeSet = useMemo(() => new Set(changes), [changes]);
  const eventYears = useMemo(() => events.map((e) => e.year), [events]);

  // Autoplay unless the reader prefers reduced motion (then only on request);
  // playback stops at the last year.
  const active = ready && playing && (touched || !reduced) && year < to;

  // The map, and the data for every year.
  useEffect(() => {
    let disposed = false;
    const el = box.current!;
    const frame = () => (el.clientWidth < el.clientHeight && tallBbox ? tallBbox : bbox);
    Promise.all([
      import("maplibre-gl"),
      fetch(`/timelapse-data/${slug}.json`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TimelapseData>;
      }),
    ])
      .then(([{ Map }, data]) => {
        if (disposed) return;
        tlRef.current = createTimelapse(data);
        const b = frame();
        const map = new Map({
          container: el,
          style: BASE_STYLE,
          bounds: [[b[0], b[1]], [b[2], b[3]]],
          fitBoundsOptions: { padding: 8 },
          interactive: false,
          renderWorldCopies: false,
          fadeDuration: 0,
          attributionControl: { compact: true, customAttribution: "Borders: Cliopatria (Seshat), CC BY 4.0" },
        });
        map.on("load", () => {
          map.addSource("t", { type: "geojson", data: EMPTY_FC });
          map.addSource("lab", { type: "geojson", data: EMPTY_FC });
          for (const layer of timelapseLayers(MAP)) map.addLayer(layer as Parameters<MapLibreMap["addLayer"]>[0]);
          // Start the credits folded into the (i) button, so they don't cover the map; the source is also credited below it.
          el.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
          if (!disposed) setReady(true);
        });
        map.on("resize", () => {
          const r = frame();
          map.fitBounds([[r[0], r[1]], [r[2], r[3]]], { padding: 8, animate: false });
        });
        mapRef.current = map;
      })
      .catch(() => !disposed && setFailed(true));
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [slug, bbox, tallBbox]);

  // Redraw only when the set of shapes changes.
  useEffect(() => {
    const map = mapRef.current;
    const tl = tlRef.current;
    if (!ready || !map || !tl) return;
    if (tl.keyAt(year) === drawnKey.current) return;
    const { key, borders, labels } = tl.at(year);
    (map.getSource("t") as GeoJSONSource).setData(borders);
    (map.getSource("lab") as GeoJSONSource).setData(labels);
    drawnKey.current = key;
  }, [ready, year]);

  useEffect(() => {
    if (!active) return;
    const { yps, hold } = SPEEDS[speed];
    const t = setTimeout(() => setYear((y) => Math.min(step(y, 1), to)), 1000 / yps + (changeSet.has(year) ? hold : 0));
    return () => clearTimeout(t);
  }, [active, year, speed, to, changeSet]);

  const go = useCallback((y: number) => {
    setTouched(true);
    setPlaying(false);
    setYear(fix(Math.max(from, Math.min(to, y))));
  }, [from, to]);

  const toggle = () => {
    setTouched(true);
    if (active) {
      setPlaying(false);
      return;
    }
    if (year >= to) setYear(from);
    setPlaying(true);
  };

  const nextEvent = eventYears.find((y) => y > year);
  const prevEvent = [...eventYears].reverse().find((y) => y < year);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return; // the slider handles its own arrows
    const d = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowRight") { e.preventDefault(); go(step(year, d)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(step(year, -d)); }
    else if (e.key === " ") { e.preventDefault(); toggle(); }
  };

  const { num, era } = yearParts(year);
  const leader = atYear(leaders, year);
  const latest = atYear(events, year);
  const recent = latest && year - latest.year <= RECENT_YEARS ? latest : null;
  const span = to - from;
  const pos = (y: number) => ((y - from) / span) * 100;

  return (
    <div onKeyDown={onKey}>
      <div
        className="relative overflow-hidden rounded-sm border border-ink/10 bg-[#cdd9e5] aspect-[9/16] max-h-[78vh] mx-auto sm:aspect-[16/9] sm:max-h-none sm:mx-0"
        role="img"
        aria-label={`Map of ${label} in ${num} ${era}`}
      >
        <div ref={box} className="absolute inset-0" />
        {!ready && (
          <p className="absolute inset-0 flex items-center justify-center font-mono text-[12px] tracking-wide text-ink/50">
            {failed ? "The map couldn’t load. Try reloading the page." : `Loading ${(span).toLocaleString("en")} years of borders…`}
          </p>
        )}
        <div className="absolute left-3 top-3 sm:left-5 sm:top-5 rounded-sm bg-paper/85 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 shadow-sm pointer-events-none">
          <p className="font-display text-[34px] sm:text-[52px] leading-none tracking-[-0.03em] text-ink tabular-nums">
            {num}
            <span className="ml-1.5 text-[15px] sm:text-[20px] font-light">{era}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 sm:gap-2">
        <button type="button" onClick={() => prevEvent !== undefined && go(prevEvent)} disabled={prevEvent === undefined} className="p-2 text-ink/60 hover:text-accent disabled:opacity-30" aria-label="Previous big change">
          <SkipBack size={17} />
        </button>
        <button type="button" onClick={() => go(step(year, -1))} disabled={year <= from} className="hidden sm:block p-1.5 text-ink/60 hover:text-accent disabled:opacity-30" aria-label="Previous year">
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={toggle}
          disabled={!ready}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
          aria-label={active ? "Pause" : "Play"}
        >
          {active ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button type="button" onClick={() => go(step(year, 1))} disabled={year >= to} className="hidden sm:block p-1.5 text-ink/60 hover:text-accent disabled:opacity-30" aria-label="Next year">
          <ChevronRight size={18} />
        </button>
        <button type="button" onClick={() => nextEvent !== undefined && go(nextEvent)} disabled={nextEvent === undefined} className="p-2 text-ink/60 hover:text-accent disabled:opacity-30" aria-label="Next big change">
          <SkipForward size={17} />
        </button>
        <div className="relative flex-1 min-w-0 mx-1">
          {/* Ticks: the years a large state appears or vanishes. */}
          <svg className="absolute inset-x-0 -bottom-2 h-1.5 w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 1" aria-hidden>
            {eventYears.map((y) => (
              <line key={y} x1={pos(y)} x2={pos(y)} y1={0} y2={1} stroke="currentColor" strokeWidth={0.15} className="text-ink/30" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <input
            type="range"
            min={from}
            max={to}
            value={year}
            onChange={(e) => go(Number(e.target.value))}
            className="w-full accent-[var(--color-accent,#2346a0)]"
            aria-label="Year"
            aria-valuetext={`${num} ${era}`}
          />
        </div>
        <button
          type="button"
          onClick={() => setSpeed((s) => (s + 1) % SPEEDS.length)}
          className="font-mono text-[11px] w-14 text-ink/55 hover:text-accent"
          aria-label={`Speed: ${SPEEDS[speed].label}. Change speed`}
        >
          {SPEEDS[speed].label}
        </button>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-ink/40 tabular-nums">
        <span>{yearParts(from).num} {yearParts(from).era}</span>
        <span className="hidden sm:inline">← → one year · shift for ten · marks show big changes</span>
        <span>{to}</span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 text-[15px] leading-relaxed text-ink/70 min-h-[7.5rem]">
        <div>
          <p className="label text-ink/40 mb-1.5">Largest on the map</p>
          <p>{leader ? <Names items={leader.largest} max={4} /> : "—"}</p>
        </div>
        {recent && (
          <div>
            <p className="label text-ink/40 mb-1.5">In {yearParts(recent.year).num} {yearParts(recent.year).era}</p>
            {recent.appeared.length > 0 && <p><span className="text-ink/45">New: </span><Names items={recent.appeared} /></p>}
            {recent.gone.length > 0 && <p><span className="text-ink/45">Gone: </span><Names items={recent.gone} /></p>}
          </div>
        )}
      </div>
      <p className="mt-4 text-[14px]">
        <Link href={`/map?year=${year}`} className="text-accent hover:underline underline-offset-4">
          Open {num} {era} in the full atlas →
        </Link>
      </p>
    </div>
  );
}
