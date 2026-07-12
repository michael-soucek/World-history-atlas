"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import type { Tour } from "@/data/tours";

interface TourPlayerProps {
  tour: Tour;
}

export default function TourPlayer({ tour }: TourPlayerProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const current = tour.steps[step];

  // Sync the map URL whenever the step changes
  useEffect(() => {
    const ms = current.mapState;
    const params = new URLSearchParams({
      year: String(ms.year),
      lat: String(ms.lat),
      lng: String(ms.lng),
      z: String(ms.zoom),
      ...(ms.regionId ? { region: ms.regionId } : {}),
    });
    // Open map in a new window / tab if this is just the tour page (no iframe)
    // We'll store the map state so the "View on map" link stays in sync
  }, [current]);

  // Auto-advance when playing
  useEffect(() => {
    if (!playing) return;
    if (step >= tour.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep(s => s + 1), 8000);
    return () => clearTimeout(timer);
  }, [playing, step, tour.steps.length]);

  const goTo = (i: number) => {
    setStep(i);
    setPlaying(false);
  };

  const ms = current.mapState;
  const mapHref = `/map?year=${ms.year}&lat=${ms.lat}&lng=${ms.lng}&z=${ms.zoom}${ms.regionId ? `&region=${ms.regionId}` : ""}`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10">
        <Link href="/tour" className="hover:text-ancient/80 transition-colors">Tours</Link>
        <span className="text-ink/20">/</span>
        <span className="text-ink/55">{tour.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main card */}
        <div className="lg:col-span-3 space-y-5">
          {/* Step progress dots */}
          <div className="flex items-center gap-1.5">
            {tour.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === step ? "w-6 h-1.5 bg-ancient" : i < step ? "w-3 h-1.5 bg-ink/35" : "w-3 h-1.5 bg-ink/12"
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
            <span className="ml-2 text-ink/25 text-xs font-mono">{step + 1}/{tour.steps.length}</span>
          </div>

          {/* Step content */}
          <div className="rounded-2xl border border-paper bg-white/60 p-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ancient/30 to-transparent" />
            <p className="text-ancient/60 text-xs font-mono mb-3">
              {current.mapState.year < 0 ? `${Math.abs(current.mapState.year)} BCE` : `${current.mapState.year} CE`}
            </p>
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-display text-2xl font-bold text-ink">{current.title}</h2>
              <ReadAloudButton text={current.text} className="mt-1" />
            </div>
            <p className="text-ink/65 leading-relaxed text-base">{current.text}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => goTo(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded-lg px-4 py-2 text-sm border border-paper text-ink/60 hover:text-ink hover:border-paper/60 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPlaying(p => !p)}
              className="rounded-lg px-5 py-2 text-sm bg-ancient text-white hover:bg-ancient/90 font-semibold transition-colors shadow-md shadow-ancient/20"
            >
              {playing ? "⏸ Pause" : "▶ Play"}
            </button>
            <button
              onClick={() => goTo(Math.min(tour.steps.length - 1, step + 1))}
              disabled={step === tour.steps.length - 1}
              className="rounded-lg px-4 py-2 text-sm border border-paper text-ink/60 hover:text-ink hover:border-paper/60 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
            <Link
              href={mapHref}
              target="_blank"
              className="ml-auto rounded-lg px-4 py-2 text-sm border border-ancient/30 text-ancient/80 hover:bg-ancient-wash hover:border-ancient/50 transition-colors"
            >
              Open map ↗
            </Link>
          </div>
        </div>

        {/* Sidebar: step list */}
        <div className="lg:col-span-2">
          <p className="text-ink/30 text-xs font-semibold uppercase tracking-widest mb-3">All steps</p>
          <ol className="space-y-1">
            {tour.steps.map((s, i) => (
              <li key={i}>
                <button
                  onClick={() => goTo(i)}
                  className={`w-full text-left rounded-xl px-4 py-3 text-sm transition-all duration-150 ${
                    i === step
                      ? "bg-ancient-wash border border-ancient/25 text-ink"
                      : "border border-transparent text-ink/45 hover:text-ink/80 hover:bg-ink/5"
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-ink/25 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-medium leading-snug">{s.title}</span>
                  </div>
                  <span className="block text-xs mt-0.5 font-mono text-ink/25 pl-6">
                    {s.mapState.year < 0 ? `${Math.abs(s.mapState.year)} BCE` : `${s.mapState.year} CE`}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
