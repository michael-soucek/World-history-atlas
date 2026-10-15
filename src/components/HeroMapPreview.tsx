"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HERO_MOMENTS } from "@/data/heroMoments";

const INTERVAL_MS = 5200;

function yearParts(y: number): { num: string; era: string } {
  return y < 0 ? { num: String(Math.abs(y)), era: "BCE" } : { num: String(y), era: "CE" };
}

/**
 * The homepage hero: the world map stepping through eight moments in
 * history. The maps are pre-rendered images, so the homepage never loads the
 * map library; "Open this map" goes to the live atlas.
 */
export default function HeroMapPreview() {
  const [index, setIndex] = useState(0);
  const [lastShown, setLastShown] = useState(0); // fallback while a new frame loads
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [playing, setPlaying] = useState(true);
  const reduced = usePrefersReducedMotion();

  // The frame on screen: the chosen one once its image has loaded,
  // otherwise the previous one.
  const shown = seen.has(index) ? index : lastShown;

  // Autoplay: advance once the current frame is actually on screen.
  useEffect(() => {
    if (!playing || reduced || shown !== index) return;
    const t = setTimeout(() => {
      setLastShown(index);
      setIndex(i => (i + 1) % HERO_MOMENTS.length);
    }, INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, shown, playing, reduced]);

  const pick = useCallback((i: number) => {
    setPlaying(false);
    setLastShown(shown);
    setIndex(i);
  }, [shown]);

  const current = HERO_MOMENTS[shown];
  const { num, era } = yearParts(current.year);

  return (
    <div className="absolute inset-0">
      {/* Pre-rendered frames (scripts/build-hero-frames.mjs), crossfaded.
          Only the current and next frames are requested. */}
      <div className="absolute inset-0" aria-hidden="true">
      {HERO_MOMENTS.map((m, i) => {
        const wanted = i === shown || i === index || i === (index + 1) % HERO_MOMENTS.length || seen.has(i);
        return (
          <picture key={m.year} className={`absolute inset-0 transition-opacity duration-[900ms] ${i === shown ? "opacity-100" : "opacity-0"}`}>
            {wanted && <source media="(max-width: 640px)" srcSet={`/hero/${m.year}-tall.webp`} />}
            {wanted && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/hero/${m.year}-wide.webp`}
                alt=""
                className="h-full w-full object-cover object-[60%_40%] sm:object-center"
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
                onLoad={() => setSeen(prev => (prev.has(i) ? prev : new Set(prev).add(i)))}
              />
            )}
          </picture>
        );
      })}
      </div>

      {/* Shade the left side for the headline, and the bottom for the chronometer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,20,36,0.94) 0%, rgba(11,20,36,0.72) 34%, rgba(11,20,36,0.08) 64%, rgba(11,20,36,0) 100%), linear-gradient(0deg, rgba(11,20,36,0.95) 0%, rgba(11,20,36,0) 34%)",
        }}
      />
      <div className="absolute inset-0 graticule-night pointer-events-none opacity-70" aria-hidden="true" />

      {/* The year, very large */}
      <div className="absolute right-4 sm:right-8 lg:right-12 bottom-[118px] sm:bottom-[132px] text-right pointer-events-none select-none">
        <p className="label text-glow/80 mb-2 sm:mb-3">The world in</p>
        <p
          key={current.year}
          className="font-display font-light text-parchment leading-[0.8] tracking-[-0.045em] tabular-nums animate-[year-in_0.7s_cubic-bezier(.2,.7,.2,1)_both]"
          style={{ fontSize: "clamp(84px, 15vw, 232px)" }}
          aria-live="polite"
        >
          {num}
          <span className="text-[0.22em] tracking-normal italic text-glow ml-[0.12em] align-top">{era}</span>
        </p>
        <p
          key={`c${current.year}`}
          className="hidden sm:block mt-4 ml-auto max-w-sm text-sm text-parchment/60 leading-snug animate-[year-in_0.7s_0.08s_cubic-bezier(.2,.7,.2,1)_both]"
        >
          {current.caption}.{" "}
          <Link href={`/map?year=${current.year}`} className="pointer-events-auto text-glow hover:text-parchment underline underline-offset-4 decoration-glow/40">
            Open this map
          </Link>
        </p>
      </div>

      {/* Chronometer */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <div className="flex items-end gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setPlaying(p => !p)}
              className="shrink-0 mb-[3px] w-8 h-8 grid place-items-center rounded-full border border-white/15 text-parchment/70 hover:text-parchment hover:border-glow/60 transition-colors"
              aria-label={playing ? "Pause the map" : "Play the map"}
            >
              {playing && !reduced ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-px" />}
            </button>
            <ol className="flex-1 grid grid-cols-8 gap-1.5 sm:gap-3" aria-label="Moments in history">
              {HERO_MOMENTS.map((m, i) => {
                const p = yearParts(m.year);
                const active = i === shown;
                return (
                  <li key={m.year}>
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-current={active ? "true" : undefined}
                      className="group w-full text-left"
                    >
                      <span className="block h-px w-full bg-white/15 relative overflow-hidden">
                        <span
                          key={active && playing && !reduced ? `run-${shown}` : `still-${i}`}
                          className={`absolute inset-y-0 left-0 bg-glow ${active ? "" : "w-0"}`}
                          style={
                            active
                              ? playing && !reduced
                                ? { animation: `chrono-fill ${INTERVAL_MS}ms linear both` }
                                : { width: "100%" }
                              : undefined
                          }
                        />
                      </span>
                      <span
                        className={`block pt-2.5 font-mono text-[10px] sm:text-[11px] tracking-wider tabular-nums transition-colors ${
                          active ? "text-parchment" : "text-parchment/40 group-hover:text-parchment/75"
                        }`}
                      >
                        {p.era === "BCE" && <span className="sm:hidden">−</span>}
                        {p.num}
                        <span className="max-sm:hidden"> {p.era}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
