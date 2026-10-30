"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SupportButton from "./SupportButton";
import BrandMark from "./BrandMark";
import { useAtlasStore } from "@/store/atlasStore";
import TimeSlider from "./TimeSlider";
import StoryPanel from "./StoryPanel";
import { useUrlSync } from "@/hooks/useUrlSync";
import { useManifest } from "@/hooks/useManifest";

// MapLibre must never be imported on the server
const AtlasMap = dynamic(() => import("./AtlasMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#cdd9e5] flex items-center justify-center">
      <span className="font-mono text-[11px] tracking-widest uppercase text-ink/64 animate-pulse">Unrolling the map…</span>
    </div>
  ),
});

interface AtlasPageClientProps {
  initialYear: number;
  initialLat: number;
  initialLng: number;
  initialZoom: number;
  initialRegionId?: string;
}

export default function AtlasPageClient({
  initialYear,
  initialLat,
  initialLng,
  initialZoom,
  initialRegionId,
}: AtlasPageClientProps) {
  const { syncFromUrl } = useAtlasStore();
  const [showHint, setShowHint] = useState(true);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync initial URL params to the store on first render
  useEffect(() => {
    syncFromUrl({
      year: initialYear,
      lat: initialLat,
      lng: initialLng,
      zoom: initialZoom,
      selectedWikidataId: initialRegionId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load live snapshot year list from manifest API
  useManifest();

  // Keep URL in sync as state changes
  useUrlSync();

  // Fade out the "drag to travel" hint after 4 s or on first interaction
  useEffect(() => {
    hintTimerRef.current = setTimeout(() => setShowHint(false), 4000);
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
  };

  return (
    <div
      className="relative w-full h-svh overflow-hidden bg-[#cdd9e5]"
      onPointerDown={dismissHint}
      onKeyDown={dismissHint}
    >
      <h1 className="sr-only">Interactive historical world map</h1>

      {/* Full-screen map */}
      <AtlasMap />

      {/* Time slider — bottom overlay */}
      <TimeSlider />

      {/* Story panel — right overlay */}
      <StoryPanel />

      {/* "Drag to travel" onboarding hint */}
      {showHint && (
        <div
          className="absolute inset-x-0 top-1/3 flex justify-center pointer-events-none
            animate-in fade-in duration-1000"
        >
          <div
            className="bg-night/80 backdrop-blur-md border border-white/10
              rounded-md px-6 py-3 text-parchment/85 text-[15px]
              animate-out fade-out duration-700 fill-mode-forwards"
            style={{ animationDelay: "3.5s" }}
          >
            Drag the slider to travel through time
          </div>
        </div>
      )}

      {/* Top-left nav */}
      <nav className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1 rounded-md bg-night/85 backdrop-blur-md border border-white/10 p-1 text-parchment" aria-label="Site">
        <Link href="/" className="flex items-center gap-2 h-9 pl-2 pr-3 rounded hover:bg-white/8 transition-colors">
          <BrandMark className="w-5 h-5 text-glow" />
          <span className="font-display text-[15px] max-sm:sr-only">Borders <span className="italic">of</span> Time</span>
        </Link>
        <span className="w-px h-5 bg-white/15" aria-hidden="true" />
        {[
          { href: "/tour", label: "Tours" },
          { href: "/browse", label: "Browse" },
          { href: "/search", label: "Search" },
        ].map(l => (
          <Link key={l.href} href={l.href} className="h-9 px-2.5 sm:px-3 grid place-items-center rounded text-[13px] text-parchment/72 hover:text-parchment hover:bg-white/8 transition-colors">
            {l.label}
          </Link>
        ))}
        <SupportButton variant="header" tone="night" />
      </nav>
    </div>
  );
}
