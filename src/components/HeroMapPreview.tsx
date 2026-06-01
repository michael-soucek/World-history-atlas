"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource, StyleSpecification } from "maplibre-gl";

// ── Antique-tinted map style ──────────────────────────────────────────────
// Matches the parchment/ocean palette from globals.css but tuned for a
// muted atlas plate. Territory fill colors come from the snapshot GeoJSON.
const PREVIEW_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    maplibre: {
      type: "vector",
      url: "https://demotiles.maplibre.org/tiles/tiles.json",
      attribution: "",
    },
  },
  layers: [
    {
      id: "ocean",
      type: "background",
      paint: { "background-color": "#c4d9ed" },
    },
    {
      id: "land",
      type: "fill",
      source: "maplibre",
      "source-layer": "countries",
      paint: { "fill-color": "#d8c8a0" },
    },
    {
      id: "coastline",
      type: "line",
      source: "maplibre",
      "source-layer": "countries",
      paint: {
        "line-color": "#7a5520",
        "line-width": 0.7,
        "line-blur": 0.4,
      },
    },
  ],
};

// ── Config ────────────────────────────────────────────────────────────────

const CYCLE_YEARS = [500, 1000, 1453, 1700, 1900] as const;
const CYCLE_INTERVAL_MS = 4500;
const FILL_OPACITY = 0.52;
const LINE_OPACITY = 0.65;
const TRANSITION_MS = 800;
const EMPTY_FC = { type: "FeatureCollection" as const, features: [] as [] };

type Slot = "a" | "b";

function formatYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function HeroMapPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const activeSlotRef = useRef<Slot>("a");
  const yearIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [displayYear, setDisplayYear] = useState<number>(CYCLE_YEARS[0]);
  const [yearFade, setYearFade] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let disposed = false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("maplibre-gl").then(({ Map }) => {
      if (disposed || !containerRef.current) return;

      const map = new Map({
        container: containerRef.current!,
        style: PREVIEW_STYLE,
        center: [15, 15],
        zoom: 1.35,
        interactive: false,   // no pan, zoom, click, or keyboard
        attributionControl: false,
      });

      mapRef.current = map;

      map.on("load", () => {
        if (disposed) return;

        // Dual-slot GeoJSON sources (crossfade pattern)
        for (const slot of ["a", "b"] as Slot[]) {
          map.addSource(`hero-${slot}`, { type: "geojson", data: EMPTY_FC });
        }

        // Fill layers
        for (const slot of ["a", "b"] as Slot[]) {
          map.addLayer({
            id: `hero-fill-${slot}`,
            type: "fill",
            source: `hero-${slot}`,
            paint: {
              "fill-color": ["get", "_color"],
              "fill-opacity": 0,
              "fill-opacity-transition": { duration: TRANSITION_MS, delay: 0 },
            },
          });
        }

        // Border lines
        for (const slot of ["a", "b"] as Slot[]) {
          map.addLayer({
            id: `hero-line-${slot}`,
            type: "line",
            source: `hero-${slot}`,
            paint: {
              "line-color": ["get", "_color"],
              "line-width": 0.8,
              "line-opacity": 0,
              "line-opacity-transition": { duration: TRANSITION_MS, delay: 0 },
            },
          });
        }

        const loadYear = async (year: number) => {
          if (disposed) return;
          const data = await fetch(`/api/snapshot/${year}`).then(r =>
            r.ok ? r.json() : null
          );
          if (!data || disposed || !mapRef.current) return;
          const m = mapRef.current;
          const next: Slot = activeSlotRef.current === "a" ? "b" : "a";

          (m.getSource(`hero-${next}`) as GeoJSONSource).setData(data);

          m.setPaintProperty(`hero-fill-${next}`, "fill-opacity", FILL_OPACITY);
          m.setPaintProperty(`hero-line-${next}`, "line-opacity", LINE_OPACITY);
          m.setPaintProperty(`hero-fill-${activeSlotRef.current}`, "fill-opacity", 0);
          m.setPaintProperty(`hero-line-${activeSlotRef.current}`, "line-opacity", 0);
          activeSlotRef.current = next;

          // Fade the year badge out → update → fade in
          setYearFade(false);
          setTimeout(() => {
            setDisplayYear(year);
            setYearFade(true);
          }, 220);
        };

        // Load the first year immediately
        loadYear(CYCLE_YEARS[0]);

        if (!prefersReduced) {
          timerRef.current = setInterval(() => {
            yearIndexRef.current = (yearIndexRef.current + 1) % CYCLE_YEARS.length;
            loadYear(CYCLE_YEARS[yearIndexRef.current]);
          }, CYCLE_INTERVAL_MS);
        }
      });
    });

    return () => {
      disposed = true;
      if (timerRef.current) clearInterval(timerRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="absolute inset-0">
      {/* MapLibre canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Warm vignette to blend map edges into the plate border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 130% 120% at 50% 50%, transparent 55%, rgba(216,200,160,0.30) 100%)",
        }}
      />

      {/* Year badge — mirrors HeroYearTicker position but shows the actual map year */}
      <div
        className="absolute top-2.5 left-3 flex items-center gap-1.5 bg-parchment/85 rounded-sm px-2 py-1 border border-ancient/20 pointer-events-none z-10"
        style={{ opacity: yearFade ? 1 : 0, transition: "opacity 0.22s ease" }}
        aria-live="off"
        aria-hidden="true"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-ancient/60 animate-pulse" />
        <span className="text-ancient/80 text-[11px] font-mono">{formatYear(displayYear)}</span>
      </div>
    </div>
  );
}
