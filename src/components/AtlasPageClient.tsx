"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useAtlasStore } from "@/store/atlasStore";
import TimeSlider from "./TimeSlider";
import StoryPanel from "./StoryPanel";
import ConfidenceLegend from "./ConfidenceLegend";
import { useUrlSync } from "@/hooks/useUrlSync";
import { useManifest } from "@/hooks/useManifest";

// MapLibre must never be imported on the server
const AtlasMap = dynamic(() => import("./AtlasMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
      <span className="text-white/40 text-sm animate-pulse">Loading map…</span>
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
      className="relative w-full h-screen overflow-hidden bg-neutral-900"
      onPointerDown={dismissHint}
      onKeyDown={dismissHint}
    >
      {/* Full-screen map */}
      <AtlasMap />

      {/* Time slider — bottom overlay */}
      <TimeSlider />

      {/* Data confidence legend — bottom-left */}
      <ConfidenceLegend />

      {/* Story panel — right overlay */}
      <StoryPanel />

      {/* "Drag to travel" onboarding hint */}
      {showHint && (
        <div
          className="absolute inset-x-0 top-1/3 flex justify-center pointer-events-none
            animate-in fade-in duration-1000"
        >
          <div
            className="bg-black/60 backdrop-blur-sm border border-white/15
              rounded-2xl px-6 py-3 text-white/80 text-base font-medium
              animate-out fade-out duration-700 fill-mode-forwards"
            style={{ animationDelay: "3.5s" }}
          >
            Drag the slider to travel through time ↓
          </div>
        </div>
      )}

      {/* Top-left nav */}
      <nav className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <a
          href="/"
          className="text-white font-semibold text-sm tracking-wide
            bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5
            hover:bg-black/70 transition-colors"
        >
          Borders of Time
        </a>
        <a
          href="/about"
          className="text-white/60 text-sm bg-black/40 backdrop-blur-sm rounded-lg
            px-3 py-1.5 hover:text-white hover:bg-black/60 transition-colors"
        >
          About
        </a>
      </nav>
    </div>
  );
}
