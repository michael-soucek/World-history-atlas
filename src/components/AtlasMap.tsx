"use client";

import { useEffect, useRef, useCallback } from "react";
import type { Map as MapLibreMap, GeoJSONSource, StyleSpecification } from "maplibre-gl";
import { useAtlasStore } from "@/store/atlasStore";

// ── Base map style ─────────────────────────────────────────────────────────
// Minimal style: ocean background + neutral land fill only.
// All modern country fills, borders, and labels are intentionally omitted so
// they cannot bleed through gaps in the historical layer.
const BASE_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    maplibre: {
      type: "vector",
      url: "https://demotiles.maplibre.org/tiles/tiles.json",
      attribution: '© <a href="https://www.maplibre.org">MapLibre</a>',
    },
  },
  layers: [
    {
      id: "ocean",
      type: "background",
      paint: { "background-color": "#D8F2FF" },
    },
    {
      // Land — source-layer "countries" contains all land polygons.
      // Single flat colour; our historical fills go on top.
      id: "land",
      type: "fill",
      source: "maplibre",
      "source-layer": "countries",
      paint: { "fill-color": "#EAB38F" },
    },
    {
      // Coastline matches demotiles ocean blue
      id: "coastline",
      type: "line",
      source: "maplibre",
      "source-layer": "countries",
      paint: {
        "line-color": "#198EC8",
        "line-width": 0.8,
        "line-blur": 0.5,
      },
    },
  ],
};

// ── Constants ──────────────────────────────────────────────────────────────

const FILL_OPACITY = 0.55;
const LINE_OPACITY = 0.8;
const LABEL_OPACITY = 1.0;
const TRANSITION_MS = 300;
const EMPTY_FC = { type: "FeatureCollection" as const, features: [] as [] };

type Slot = "a" | "b";

// ── Data fetching ──────────────────────────────────────────────────────────

async function fetchSnapshotData(year: number) {
  const [borders, labels] = await Promise.all([
    fetch(`/api/snapshot/${year}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`/api/snapshot/${year}/labels`).then((r) => (r.ok ? r.json() : null)),
  ]);
  return { borders, labels };
}

// ── Component ─────────────────────────────────────────────────────────────

export default function AtlasMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const activeSlotRef = useRef<Slot>("a");
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSnapshotRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);

  const { snapshotYear, setView, selectRegion } = useAtlasStore();

  // ── Slot opacity helper ────────────────────────────────────────────────

  const setSlotOpacity = useCallback(
    (
      map: MapLibreMap,
      slot: Slot,
      visible: boolean
    ) => {
      map.setPaintProperty(`territory-fill-${slot}`, "fill-opacity", visible ? FILL_OPACITY : 0);
      map.setPaintProperty(`territory-line-${slot}`, "line-opacity", visible ? LINE_OPACITY : 0);
      map.setPaintProperty(`border-labels-${slot}`, "text-opacity", visible ? LABEL_OPACITY : 0);
    },
    []
  );

  // ── Map initialisation ─────────────────────────────────────────────────

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // `disposed` lets the cleanup cancel the async import callback.
    // React StrictMode double-invokes effects (mount → cleanup → mount).
    // Without this, both invocations would resolve their `import()` and each
    // create a MapLibre map in the same container, corrupting mapRef.
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

      // Set ref BEFORE registering the load handler so that if the load
      // event fires synchronously (inline styles can do this), mapRef is ready.
      mapRef.current = map;

      map.addControl(new NavigationControl(), "top-right");

      map.on("load", () => {
        // ── GeoJSON sources ───────────────────────────────────────────
        for (const slot of ["a", "b"] as const) {
          map.addSource(`territories-${slot}`, {
            type: "geojson",
            data: EMPTY_FC,
          });
          map.addSource(`labels-${slot}`, {
            type: "geojson",
            data: EMPTY_FC,
          });
        }
        // Separate source for click-selected feature (no crossfade needed)
        map.addSource("territory-selected", {
          type: "geojson",
          data: EMPTY_FC,
        });

        // ── Fill layers (dual-slot crossfade) ─────────────────────────
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

        // ── Line layers (dual-slot crossfade) ─────────────────────────
        for (const slot of ["a", "b"] as const) {
          map.addLayer({
            id: `territory-line-${slot}`,
            type: "line",
            source: `territories-${slot}`,
            paint: {
              "line-color": ["get", "_color"],
              // Crisp borders for high-precision data, blurred for approximate
              "line-width": [
                "match",
                ["get", "precision"],
                1, 1.5,
                2, 1.2,
                3, 1.0,
                1.0,
              ],
              "line-blur": [
                "match",
                ["get", "precision"],
                1, 3.0,
                2, 1.0,
                3, 0.0,
                1.5,
              ],
              "line-opacity": 0,
              "line-opacity-transition": { duration: TRANSITION_MS, delay: 0 },
            },
          });
        }

        // ── Selection highlight ────────────────────────────────────────
        map.addLayer({
          id: "territory-highlight",
          type: "fill",
          source: "territory-selected",
          paint: {
            "fill-color": "#ffffff",
            "fill-opacity": 0.22,
          },
        });

        // ── Label layers (dual-slot crossfade) ─────────────────────────
        for (const slot of ["a", "b"] as const) {
          map.addLayer({
            id: `border-labels-${slot}`,
            type: "symbol",
            source: `labels-${slot}`,
            // Show rank ≥5 at world zoom, rank ≥3 at mid zoom, all at close zoom
            filter: [
              ">=",
              ["get", "rank"],
              [
                "interpolate",
                ["linear"],
                ["zoom"],
                1, 5,
                4, 3,
                7, 1,
              ],
            ],
            layout: {
              "text-field": ["get", "name"],
              "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
              // Scale text size with both zoom and feature rank
              "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                1,
                ["max", 7, ["*", 1.5, ["min", ["get", "rank"], 8]]],
                8,
                ["max", 10, ["*", 2.5, ["min", ["get", "rank"], 8]]],
              ],
              "text-max-width": 8,
              "text-allow-overlap": false,
              "text-ignore-placement": false,
              // Higher rank labels win collision conflicts
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

        // ── Cursor management ─────────────────────────────────────────
        map.on("mousemove", (e) => {
          const hit = map.queryRenderedFeatures(e.point, {
            layers: [
              `territory-fill-${activeSlotRef.current}`,
            ],
          });
          map.getCanvas().style.cursor = hit.length > 0 ? "pointer" : "";
        });

        // ── Click handler ─────────────────────────────────────────────
        map.on("click", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["territory-fill-a", "territory-fill-b"],
          });

          if (features.length === 0) {
            (
              map.getSource("territory-selected") as GeoJSONSource
            ).setData(EMPTY_FC);
            useAtlasStore.getState().clearSelection();
            return;
          }

          const feature = features[0];
          const props = feature.properties as {
            wikidataId?: string;
            name?: string;
            sovereign?: string;
          };

          // Highlight the clicked feature
          (map.getSource("territory-selected") as GeoJSONSource).setData({
            type: "FeatureCollection",
            features: [JSON.parse(JSON.stringify(feature))],
          });

          selectRegion({
            wikidataId: props.wikidataId ?? undefined,
            name: props.name ?? "",
            sovereign: props.sovereign ?? "",
          });
        });

        // ── View sync ─────────────────────────────────────────────────
        map.on("moveend", () => {
          const c = map.getCenter();
          setView(c.lat, c.lng, map.getZoom());
        });

        // ── Initial snapshot load ──────────────────────────────────────
        // The "snapshotYear changed" useEffect fires before mapRef is set
        // (MapLibre loads async), so we must trigger the first load here,
        // after all sources and layers are ready.
        loadSnapshot(useAtlasStore.getState().snapshotYear);
      });
    });

    return () => {
      disposed = true; // cancel pending import().then() on StrictMode double-invoke
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load snapshot + crossfade on year change ───────────────────────────

  const loadSnapshot = useCallback(
    async (year: number) => {
      const map = mapRef.current;
      if (!map) return;
      if (currentSnapshotRef.current === year) return;
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      try {
        const { borders, labels } = await fetchSnapshotData(year);
        if (!borders) return;

        const oldSlot: Slot = activeSlotRef.current;
        const newSlot: Slot = oldSlot === "a" ? "b" : "a";

        // Load data into the incoming slot
        (map.getSource(`territories-${newSlot}`) as GeoJSONSource).setData(
          borders
        );
        (map.getSource(`labels-${newSlot}`) as GeoJSONSource).setData(
          labels ?? EMPTY_FC
        );

        // Trigger MapLibre paint transitions (300 ms fade)
        setSlotOpacity(map, newSlot, true);
        setSlotOpacity(map, oldSlot, false);

        // Clear any selection since the data changed
        (map.getSource("territory-selected") as GeoJSONSource).setData(
          EMPTY_FC
        );
        useAtlasStore.getState().clearSelection();

        // After the transition completes, mark the new slot as active
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = setTimeout(() => {
          activeSlotRef.current = newSlot;
        }, TRANSITION_MS + 60);

        currentSnapshotRef.current = year;
      } catch (err) {
        console.error("[loadSnapshot] ERROR", err);
      } finally {
        isLoadingRef.current = false;
      }
    },
    [setSlotOpacity]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      loadSnapshot(snapshotYear);
    } else {
      map.once("load", () => loadSnapshot(snapshotYear));
    }
  }, [snapshotYear, loadSnapshot]);

  return (
    <div
      ref={mapContainerRef}
      className="absolute inset-0 w-full h-full"
      aria-label="Interactive historical world map"
    />
  );
}
