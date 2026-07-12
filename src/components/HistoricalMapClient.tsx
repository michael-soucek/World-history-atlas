"use client";

/**
 * HistoricalMapClient — the /timeline year-scrubber map.
 *
 * Uses the SAME MapLibre base style, data API, and layer structure as AtlasMap
 * (/map) so both pages are visually identical at the same year. The only
 * difference is that year is driven by a local slider instead of the atlas store.
 *
 * Shared rendering constants (BASE_STYLE, opacity, transition duration) live in
 * src/lib/mapBaseStyle.ts and are imported by both this component and AtlasMap.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import {
  BASE_STYLE,
  EMPTY_FC,
  FILL_OPACITY,
  LABEL_OPACITY,
  LINE_OPACITY,
  TRANSITION_MS,
} from "@/lib/mapBaseStyle";

const MIN_YEAR = -3000;
const MAX_YEAR = 2010;
const INITIAL_YEAR = 1700;

type Slot = "a" | "b";

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
}

async function fetchSnapshotData(year: number) {
  const [borders, labels] = await Promise.all([
    fetch(`/api/snapshot/${year}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`/api/snapshot/${year}/labels`).then((r) => (r.ok ? r.json() : null)),
  ]);
  return { borders, labels };
}

export default function HistoricalMapClient() {
  const [year, setYear] = useState(INITIAL_YEAR);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayYear, setDisplayYear] = useState(INITIAL_YEAR);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const activeSlotRef = useRef<Slot>("a");
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedYearRef = useRef<number | null>(null);
  const nextYearRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);
  const cacheRef = useRef(new Map<number, { borders: unknown; labels: unknown }>());

  // ── Slot opacity helper (identical to AtlasMap) ──────────────────────
  const setSlotOpacity = useCallback(
    (map: MapLibreMap, slot: Slot, visible: boolean) => {
      map.setPaintProperty(`territory-fill-${slot}`, "fill-opacity", visible ? FILL_OPACITY : 0);
      map.setPaintProperty(`territory-line-${slot}`, "line-opacity", visible ? LINE_OPACITY : 0);
      map.setPaintProperty(`border-labels-${slot}`, "text-opacity", visible ? LABEL_OPACITY : 0);
    },
    [],
  );

  // ── Snapshot load + crossfade (identical logic to AtlasMap) ─────────
  const loadSnapshot = useCallback(
    async (targetYear: number) => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;
      if (loadedYearRef.current === targetYear) return;

      nextYearRef.current = targetYear;
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      setLoading(true);

      try {
        const actualTarget = nextYearRef.current ?? targetYear;
        let cached = cacheRef.current.get(actualTarget);
        if (!cached) {
          const fetched = await fetchSnapshotData(actualTarget);
          if (!fetched.borders) {
            isLoadingRef.current = false;
            setLoading(false);
            return;
          }
          cacheRef.current.set(actualTarget, fetched);
          cached = fetched;
        }

        const { borders, labels } = cached;
        if (!borders) return;

        const oldSlot: Slot = activeSlotRef.current;
        const newSlot: Slot = oldSlot === "a" ? "b" : "a";

        (map.getSource(`territories-${newSlot}`) as GeoJSONSource).setData(
          borders as Parameters<GeoJSONSource["setData"]>[0],
        );
        (map.getSource(`labels-${newSlot}`) as GeoJSONSource).setData(
          (labels ?? EMPTY_FC) as Parameters<GeoJSONSource["setData"]>[0],
        );

        setSlotOpacity(map, newSlot, true);
        setSlotOpacity(map, oldSlot, false);

        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = setTimeout(() => {
          activeSlotRef.current = newSlot;
        }, TRANSITION_MS + 60);

        loadedYearRef.current = actualTarget;
        setDisplayYear(actualTarget);

        if (nextYearRef.current !== null && nextYearRef.current !== actualTarget) {
          isLoadingRef.current = false;
          loadSnapshot(nextYearRef.current);
        }
      } catch (err) {
        console.error("[HistoricalMapClient] loadSnapshot error", err);
      } finally {
        isLoadingRef.current = false;
        setLoading(false);
      }
    },
    [setSlotOpacity],
  );

  // ── Map initialisation (same layer structure as AtlasMap) ───────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let disposed = false;

    import("maplibre-gl").then(({ Map, NavigationControl }) => {
      if (disposed || !mapContainerRef.current) return;

      const map = new Map({
        container: mapContainerRef.current!,
        style: BASE_STYLE,
        center: [10, 20],
        zoom: 2,
        attributionControl: {},
      });

      mapRef.current = map;
      map.addControl(new NavigationControl(), "top-right");

      map.on("load", () => {
        // Dual-slot sources (same as AtlasMap)
        for (const slot of ["a", "b"] as const) {
          map.addSource(`territories-${slot}`, { type: "geojson", data: EMPTY_FC });
          map.addSource(`labels-${slot}`, { type: "geojson", data: EMPTY_FC });
        }

        // Fill layers — color driven by _color property on each feature
        for (const slot of ["a", "b"] as const) {
          map.addLayer({
            id: `territory-fill-${slot}`,
            type: "fill",
            source: `territories-${slot}`,
            paint: {
              "fill-color": ["get", "_color"],
              "fill-opacity": 0,
              "fill-opacity-transition": { duration: TRANSITION_MS, delay: 0 },
            },
          });
        }

        // Border lines — precision-based blur/width (same as AtlasMap)
        for (const slot of ["a", "b"] as const) {
          map.addLayer({
            id: `territory-line-${slot}`,
            type: "line",
            source: `territories-${slot}`,
            paint: {
              "line-color": ["get", "_color"],
              "line-width": ["match", ["get", "precision"], 1, 1.5, 2, 1.2, 3, 1.0, 1.0],
              "line-blur": ["match", ["get", "precision"], 1, 0.0, 2, 1.2, 3, 3.0, 0.0],
              "line-opacity": 0,
              "line-opacity-transition": { duration: TRANSITION_MS, delay: 0 },
            },
          });
        }

        // Label layers — rank-based filtering (same as AtlasMap)
        for (const slot of ["a", "b"] as const) {
          map.addLayer({
            id: `border-labels-${slot}`,
            type: "symbol",
            source: `labels-${slot}`,
            filter: [
              ">=",
              ["get", "rank"],
              ["interpolate", ["linear"], ["zoom"], 1, 5, 4, 3, 7, 1],
            ],
            layout: {
              "text-field": ["get", "name"],
              "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
              "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                1, ["max", 7, ["*", 1.5, ["min", ["get", "rank"], 8]]],
                8, ["max", 10, ["*", 2.5, ["min", ["get", "rank"], 8]]],
              ],
              "text-max-width": 8,
              "text-allow-overlap": false,
              "text-ignore-placement": false,
              "symbol-sort-key": ["-", 0, ["get", "rank"]],
              "text-padding": 4,
            },
            paint: {
              "text-color": "#ffffff",
              "text-halo-color": "rgba(0,0,0,0.75)",
              "text-halo-width": 1.2,
              "text-opacity": 0,
              "text-opacity-transition": { duration: TRANSITION_MS, delay: 0 },
            },
          });
        }
        setMapLoaded(true);
      });
    });

    return () => {
      disposed = true;
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load snapshot when slider year resolves to a new snapshot ───────
  useEffect(() => {
    if (!mapLoaded) return;

    // 150 ms debounce while the user drags the slider
    const timer = setTimeout(() => {
      loadSnapshot(year);
    }, 150);
    return () => clearTimeout(timer);
  }, [year, mapLoaded, loadSnapshot]);

  return (
    <section className="rounded-2xl border border-paper bg-white/60 p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Historical Borders Timeline</h2>
          <p className="text-sm text-ink/55">
            Scrub year by year across 48 historical snapshots from 3,000 BCE to 2010 CE.
          </p>
        </div>
        <div className="text-right text-sm text-ink/60">
          <div className="text-lg font-semibold text-ink">{formatYear(year)}</div>
          {displayYear !== year && (
            <div className="text-xs">showing map of {formatYear(displayYear)}</div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full"
          aria-label="Historical year"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-ink/40">
          <span>{formatYear(MIN_YEAR)}</span>
          <span>48 keyframes</span>
          <span>{formatYear(MAX_YEAR)}</span>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-paper"
        style={{ height: 560 }}
      >
        {loading && (
          <div className="absolute left-4 top-4 z-10 rounded-md bg-white/85 px-3 py-1 text-sm text-ink shadow-sm pointer-events-none">
            loading…
          </div>
        )}
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          aria-label="Historical world map"
        />
      </div>
    </section>
  );
}
