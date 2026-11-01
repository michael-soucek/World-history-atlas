"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Pause, Play, Maximize2 } from "lucide-react";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import SupportNudge from "@/components/SupportNudge";
import type { Tour, TourRoute, TourSide, TourStep } from "@/data/tours";

/** The tours collected on /world-wars (other war tours, like the Civil War, shade territory too). */
const WORLD_WAR_TOURS = new Set(["first-world-war", "second-world-war-europe", "second-world-war-pacific"]);
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
  const mapRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<HTMLElement>(null);
  const firstStep = useRef(true);

  // When the stop changes, bring its heading back into view if the reader had
  // scrolled down through the previous one's text (or the legends below it).
  // On phones the map stays pinned at the top, so the heading goes just below it.
  useEffect(() => {
    if (firstStep.current) { firstStep.current = false; return; }
    const el = stopRef.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const offset = wide ? 80 : (mapRef.current?.getBoundingClientRect().bottom ?? 64) + 12;
    const top = el.getBoundingClientRect().top;
    if (top < offset || top > window.innerHeight * 0.55) {
      window.scrollTo({ top: window.scrollY + top - offset, behavior: "smooth" });
    }
  }, [step]);

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
      <div ref={mapRef} className="relative z-10 h-[40svh] min-h-[240px] sticky top-16 lg:h-[calc(100svh-4rem)] bg-[#cdd9e5] overflow-hidden">
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
      <div className="border-l border-ink/10 bg-parchment flex flex-col">
        <div className="px-5 sm:px-8 xl:px-10 pt-8 sm:pt-10 pb-10 flex-1">
          <nav className="label flex items-center gap-2.5 text-ink/64 mb-8" aria-label="Breadcrumb">
            <Link href="/tour" className="hover:text-accent transition-colors">Guided tours</Link>
            <span aria-hidden="true">/</span>
            {WORLD_WAR_TOURS.has(tour.slug) ? (
              <>
                <Link href="/world-wars" className="hover:text-accent transition-colors">The world wars</Link>
                <span aria-hidden="true">/</span>
              </>
            ) : null}
            <span className="text-ink/72">{tour.steps.length} stops</span>
          </nav>

          <h1 className="font-display font-light text-4xl sm:text-[44px] leading-[1.02] tracking-[-0.03em] text-ink text-balance">{tour.title}</h1>
          <p className="mt-3 text-[15px] text-ink/70 leading-relaxed">{tour.description}</p>

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
          <article ref={stopRef} key={step} className="mt-8 animate-[year-in_0.6s_cubic-bezier(.2,.7,.2,1)_both]" aria-live="polite">
            <p className="font-mono text-[11px] tracking-wider text-accent tabular-nums">
              Stop {String(step + 1).padStart(2, "0")} · {current.date ?? `${y.n} ${y.e}`}
            </p>
            <h2 className="mt-2 font-display text-[26px] sm:text-[30px] leading-tight tracking-tight text-ink text-balance">{current.title}</h2>
            <p className="mt-4 font-text text-[17px] leading-[1.65] text-ink/85 max-w-[62ch]">{current.text}</p>
            {current.zones?.length && tour.sides ? <ZoneLegend sides={tour.sides} step={current} /> : null}
            {current.routes?.length || current.markers?.some(m => m.kind === "battle") ? (
              <RouteLegend routes={current.routes ?? []} battles={current.markers?.some(m => m.kind === "battle") ?? false} />
            ) : null}
          </article>

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
                    <span className={`font-mono text-[11px] tabular-nums ${i === step ? "text-accent" : "text-ink/64"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-[15px] leading-snug transition-colors ${i === step ? "text-ink font-medium" : "text-ink/70 group-hover:text-ink"}`}>
                      {s.title}
                    </span>
                    <span className="font-mono text-[11px] text-ink/64 tabular-nums text-right">{s.date ?? `${sy.n} ${sy.e}`}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Controls: pinned to the bottom of the screen while the narration scrolls. */}
        <div className="sticky bottom-0 z-20 border-t border-ink/15 bg-parchment/95 backdrop-blur px-4 sm:px-8 xl:px-10 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(Math.max(0, step - 1))}
              disabled={step === 0}
              className="w-11 h-11 shrink-0 grid place-items-center rounded-md border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous stop"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              onClick={() => (step >= last && !playing ? (setStep(0), setPlaying(true)) : setPlaying(p => !p))}
              className="w-11 h-11 shrink-0 grid place-items-center rounded-md border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/40 transition-colors"
              aria-label={playing ? "Pause the tour" : step >= last ? "Replay the tour" : "Play the tour automatically"}
              title={playing ? "Pause" : step >= last ? "Replay" : "Play automatically"}
            >
              {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
            </button>
            <div className="min-w-0 flex-1 px-1">
              <p className="font-mono text-[11px] tracking-wider text-accent tabular-nums">
                Stop {step + 1} of {tour.steps.length}
              </p>
              <p className="truncate text-[13px] text-ink/72">{current.title}</p>
            </div>
            {/* Keyed by stop: moving on unmounts the old button, which cancels its speech. */}
            <ReadAloudButton key={step} text={current.text} variant="minimal" className="shrink-0 max-sm:hidden" />
            {step < last ? (
              <button
                onClick={() => goTo(step + 1)}
                className="h-11 shrink-0 px-4 sm:px-5 inline-flex items-center gap-2 rounded-md bg-ink text-parchment hover:bg-accent text-sm font-semibold transition-colors"
                aria-label={`Next stop: ${tour.steps[step + 1].title}`}
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => goTo(0)}
                className="h-11 shrink-0 px-4 sm:px-5 inline-flex items-center gap-2 rounded-md bg-ink text-parchment hover:bg-accent text-sm font-semibold transition-colors"
              >
                <ArrowLeft size={16} />
                Start again
              </button>
            )}
          </div>
          <p className="mt-2 text-[11px] text-ink/64 max-lg:hidden">Use the ← → keys to move between stops.</p>
        </div>
      </div>
    </div>
  );
}

/** Who holds what: one swatch per side at this stop, striped where it occupies land. */
function ZoneLegend({ sides, step }: { sides: TourSide[]; step: TourStep }) {
  const present = sides.filter(side => step.zones?.some(z => z.side === side.key));
  return (
    <div className="mt-5 border-t border-ink/10 pt-3.5">
      <p className="label text-ink/64">Who holds what</p>
      <ul className="mt-2 space-y-1.5">
        {present.map(side => {
          const occupies = step.zones?.some(z => z.side === side.key && z.occupied);
          return (
            <li key={side.key} className="flex items-center gap-3 text-[13px] leading-snug text-ink/75">
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
                {occupies ? <span className="text-ink/64"> · striped where occupied</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2.5 text-[12px] leading-relaxed text-ink/66">
        Unshaded: neutral or out of the war. Front lines are simplified.
      </p>
    </div>
  );
}

/** What each arrow on the map means, for the current stop. */
function RouteLegend({ routes, battles }: { routes: TourRoute[]; battles: boolean }) {
  return (
    <div className="mt-5 border-t border-ink/10 pt-3.5">
      <p className="label text-ink/64">On the map</p>
      <ul className="mt-2 space-y-1.5">
        {routes.map(route => {
          const style = ROUTE_STYLE[route.kind];
          return (
            <li key={route.label} className="flex items-center gap-3 text-[13px] leading-snug text-ink/75">
              <svg width="34" height="10" viewBox="0 0 34 10" aria-hidden="true" className="shrink-0">
                <line x1="1" y1="5" x2="25" y2="5" stroke={style.color} strokeWidth="2.6" strokeDasharray={style.dashed ? "5 3.5" : undefined} />
                <path d="M33 5 L24 0.8 L26.5 5 L24 9.2 Z" fill={style.color} />
              </svg>
              <span>
                {route.label}
                <span className="text-ink/64"> · {style.name}</span>
              </span>
            </li>
          );
        })}
        {battles ? (
          <li className="flex items-center gap-3 text-[13px] leading-snug text-ink/75">
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
