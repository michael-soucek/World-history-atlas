"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Pause, Play, Maximize2 } from "lucide-react";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import SupportNudge from "@/components/SupportNudge";
import type { Tour, TourRoute, TourSide, TourStep } from "@/data/tours";
import { ROUTE_STYLE } from "@/lib/tourRoutes";

// MapLibre must never be imported on the server.
const TourMap = dynamic(() => import("./TourMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#cdd9e5]" />,
});

interface TourPlayerProps {
  tour: Tour;
}

const STEP_MS = 9000;

function fmt(y: number) {
  return y < 0 ? { n: String(Math.abs(y)), e: "BCE" } : { n: String(y), e: "CE" };
}

export default function TourPlayer({ tour }: TourPlayerProps) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const current = tour.steps[step];
  const last = tour.steps.length - 1;

  // Deep links from the world-wars hub open at a given stop: /tour/x?stop=5.
  // (A 0ms timer rather than setState in the effect body, as below.)
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("stop"));
    if (!Number.isInteger(n) || n < 2 || n > tour.steps.length) return;
    const timer = setTimeout(() => setStep(n - 1), 0);
    return () => clearTimeout(timer);
  }, [tour.steps.length]);

  // Auto-advance when playing. The last-step case still stops "immediately"
  // to the user (a 0ms timer, not a synchronous setState in the effect body —
  // see react-hooks/set-state-in-effect) rather than waiting another step.
  useEffect(() => {
    if (!playing) return;
    if (step >= last) {
      const timer = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setStep(s => s + 1), STEP_MS);
    return () => clearTimeout(timer);
  }, [playing, step, last]);

  // Arrow keys step through the tour.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === "ArrowRight") { setPlaying(false); setStep(s => Math.min(last, s + 1)); }
      if (e.key === "ArrowLeft") { setPlaying(false); setStep(s => Math.max(0, s - 1)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  const goTo = (i: number) => {
    setStep(i);
    setPlaying(false);
  };

  const ms = current.mapState;
  // Earlier stops' arrows stay on the map (faded) for tours that trace a long journey.
  const trail = tour.trail ? tour.steps.slice(0, step).flatMap(s => s.routes ?? []) : [];
  const mapHref = `/map?year=${ms.year}&lat=${ms.lat}&lng=${ms.lng}&z=${ms.zoom}${ms.regionId ? `&region=${ms.regionId}` : ""}`;
  const y = fmt(ms.year);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_500px]">
      {/* ── The map ── */}
      <div className="relative h-[46svh] min-h-[300px] lg:h-[calc(100svh-4rem)] lg:sticky lg:top-16 bg-[#cdd9e5] overflow-hidden">
        <TourMap
          state={ms}
          routes={current.routes}
          trail={trail}
          markers={current.markers}
          highlight={current.highlight}
          zonesUrl={current.zones?.length ? `/data/war-zones/${tour.slug}/${step}.json` : null}
          muted={!!tour.sides}
        />
        <div className="absolute left-4 sm:left-6 bottom-4 sm:bottom-6 pointer-events-none select-none">
          <p
            key={ms.year}
            className="font-display font-light text-ink leading-[0.85] tracking-[-0.04em] tabular-nums animate-[year-in_0.7s_cubic-bezier(.2,.7,.2,1)_both] [text-shadow:0_0_24px_rgba(238,240,242,0.95)]"
            style={{ fontSize: "clamp(56px, 8vw, 128px)" }}
          >
            {y.n}<span className="text-[0.24em] italic tracking-normal text-accent ml-[0.1em] align-top">{y.e}</span>
          </p>
        </div>
        <Link
          href={mapHref}
          className="absolute right-3 bottom-8 sm:bottom-9 inline-flex items-center gap-2 h-9 px-3 rounded-md bg-parchment/90 backdrop-blur border border-ink/10 text-[13px] text-ink/75 hover:text-accent transition-colors"
        >
          <Maximize2 size={13} aria-hidden="true" />
          Explore freely
        </Link>
      </div>

      {/* ── The narration ── */}
      <div className="border-l border-ink/10 bg-parchment">
        <div className="px-5 sm:px-8 xl:px-10 pt-8 sm:pt-10 pb-12">
          <nav className="label flex items-center gap-2.5 text-ink/40 mb-8" aria-label="Breadcrumb">
            <Link href="/tour" className="hover:text-accent transition-colors">Guided tours</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink/60">{tour.steps.length} stops</span>
          </nav>

          <h1 className="font-display font-light text-4xl sm:text-[44px] leading-[1.02] tracking-[-0.03em] text-ink text-balance">{tour.title}</h1>
          <p className="mt-3 text-[15px] text-ink/55 leading-relaxed">{tour.description}</p>

          {/* Progress */}
          <div className="mt-8 flex gap-1" role="tablist" aria-label="Tour stops">
            {tour.steps.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === step}
                onClick={() => goTo(i)}
                className="group flex-1 py-2"
                aria-label={`Stop ${i + 1}: ${s.title}`}
              >
                <span className="block h-[3px] bg-ink/12 relative overflow-hidden">
                  <span
                    key={i === step && playing ? `p${step}` : `s${i}`}
                    className={`absolute inset-y-0 left-0 ${i < step || (i === step && !playing) ? "w-full" : "w-0"} ${i <= step ? "bg-accent" : ""} group-hover:bg-ink/40`}
                    style={i === step && playing ? { animation: `chrono-fill ${STEP_MS}ms linear both` } : undefined}
                  />
                </span>
              </button>
            ))}
          </div>

          {/* Current stop */}
          <article key={step} className="mt-8 animate-[year-in_0.6s_cubic-bezier(.2,.7,.2,1)_both]" aria-live="polite">
            <p className="font-mono text-[11px] tracking-wider text-accent tabular-nums">
              Stop {String(step + 1).padStart(2, "0")} · {current.date ?? `${y.n} ${y.e}`}
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight tracking-tight text-ink">{current.title}</h2>
            <p className="mt-4 font-text text-[18px] leading-[1.7] text-ink/85">{current.text}</p>
            {current.zones?.length && tour.sides ? <ZoneLegend sides={tour.sides} step={current} /> : null}
            {current.routes?.length || current.markers?.some(m => m.kind === "battle") ? (
              <RouteLegend routes={current.routes ?? []} battles={current.markers?.some(m => m.kind === "battle") ?? false} />
            ) : null}
          </article>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-2">
            <button
              onClick={() => goTo(Math.max(0, step - 1))}
              disabled={step === 0}
              className="w-11 h-11 grid place-items-center rounded-md border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous stop"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              onClick={() => (step >= last && !playing ? (setStep(0), setPlaying(true)) : setPlaying(p => !p))}
              className="h-11 px-5 inline-flex items-center gap-2 rounded-md bg-ink text-parchment hover:bg-accent text-sm font-semibold transition-colors"
            >
              {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              {playing ? "Pause" : step >= last ? "Replay" : step === 0 ? "Play tour" : "Resume"}
            </button>
            <button
              onClick={() => goTo(Math.min(last, step + 1))}
              disabled={step === last}
              className="w-11 h-11 grid place-items-center rounded-md border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next stop"
            >
              <ArrowRight size={17} />
            </button>
            <ReadAloudButton text={current.text} variant="minimal" className="ml-auto" />
          </div>
          <p className="mt-3 text-[11px] text-ink/35 max-lg:hidden">Tip: use the ← → keys.</p>

          {step === last && (
            <div className="mt-8">
              <SupportNudge where={`tour:${tour.slug}`} trigger="tour" />
            </div>
          )}

          {/* All stops */}
          <ol className="mt-10 border-t border-ink/80">
            {tour.steps.map((s, i) => {
              const sy = fmt(s.mapState.year);
              return (
                <li key={i} className="border-b border-ink/10">
                  <button
                    onClick={() => goTo(i)}
                    aria-current={i === step ? "step" : undefined}
                    className="group w-full grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 py-3.5 text-left"
                  >
                    <span className={`font-mono text-[11px] tabular-nums ${i === step ? "text-accent" : "text-ink/35"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-[15px] leading-snug transition-colors ${i === step ? "text-ink font-medium" : "text-ink/55 group-hover:text-ink"}`}>
                      {s.title}
                    </span>
                    <span className="font-mono text-[11px] text-ink/40 tabular-nums text-right">{s.date ?? `${sy.n} ${sy.e}`}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

/** Who holds what: one swatch per side at this stop, striped where it occupies land. */
function ZoneLegend({ sides, step }: { sides: TourSide[]; step: TourStep }) {
  const present = sides.filter(side => step.zones?.some(z => z.side === side.key));
  return (
    <div className="mt-6 border-t border-ink/10 pt-4">
      <p className="label text-ink/40">Who holds what</p>
      <ul className="mt-2.5 space-y-2">
        {present.map(side => {
          const occupies = step.zones?.some(z => z.side === side.key && z.occupied);
          return (
            <li key={side.key} className="flex items-center gap-3 text-[14px] leading-snug text-ink/75">
              <span className="flex shrink-0 gap-1" aria-hidden="true">
                <svg width="15" height="12" viewBox="0 0 15 12">
                  <rect x="0.5" y="0.5" width="14" height="11" fill={side.color} fillOpacity="0.4" stroke={side.color} />
                </svg>
                <svg width="15" height="12" viewBox="0 0 15 12" className={occupies ? "" : "invisible"}>
                  <defs>
                    <pattern id={`hatch-legend-${side.key}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="4" stroke={side.color} strokeWidth="1.6" />
                    </pattern>
                  </defs>
                  <rect x="0.5" y="0.5" width="14" height="11" fill={`url(#hatch-legend-${side.key})`} stroke={side.color} />
                </svg>
              </span>
              <span>
                {side.name}
                {occupies ? <span className="text-ink/40"> · striped where occupied</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2.5 text-[12px] leading-relaxed text-ink/45">
        Unshaded: neutral or out of the war. Front lines are simplified.
      </p>
    </div>
  );
}

/** What each arrow on the map means, for the current stop. */
function RouteLegend({ routes, battles }: { routes: TourRoute[]; battles: boolean }) {
  return (
    <div className="mt-6 border-t border-ink/10 pt-4">
      <p className="label text-ink/40">On the map</p>
      <ul className="mt-2.5 space-y-2">
        {routes.map(route => {
          const style = ROUTE_STYLE[route.kind];
          return (
            <li key={route.label} className="flex items-center gap-3 text-[14px] leading-snug text-ink/75">
              <svg width="34" height="10" viewBox="0 0 34 10" aria-hidden="true" className="shrink-0">
                <line x1="1" y1="5" x2="25" y2="5" stroke={style.color} strokeWidth="2.6" strokeDasharray={style.dashed ? "5 3.5" : undefined} />
                <path d="M33 5 L24 0.8 L26.5 5 L24 9.2 Z" fill={style.color} />
              </svg>
              <span>
                {route.label}
                <span className="text-ink/40"> · {style.name}</span>
              </span>
            </li>
          );
        })}
        {battles ? (
          <li className="flex items-center gap-3 text-[14px] leading-snug text-ink/75">
            <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true" className="shrink-0">
              <g transform="translate(17 7)" strokeLinecap="round">
                <line x1="-5" y1="-5" x2="5" y2="5" stroke="#d2462a" strokeWidth="2.2" />
                <line x1="5" y1="-5" x2="-5" y2="5" stroke="#d2462a" strokeWidth="2.2" />
              </g>
            </svg>
            <span>Battle</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
