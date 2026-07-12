"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import { useAtlasStore } from "@/store/atlasStore";
import {
  BASE_STYLE,
  FILL_OPACITY,
  LINE_OPACITY,
  LABEL_OPACITY,
  TRANSITION_MS,
  EMPTY_FC,
} from "@/lib/mapBaseStyle";

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
  const currentStateRef = useRef<number | null>(null);
  const nextYearRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);
  const stateDataCacheRef = useRef<Map<number, { borders: any; labels: any }>>(new Map());

  const [mapLoaded, setMapLoaded] = useState(false);
  const { stateYear, setView, selectRegion, selectedWikidataId } = useAtlasStore();
  const lastFlownIdRef = useRef<string | null>(null);

  // ── Selection sync logic ───────────────────────────────────────────────

  const syncSelectionHighlight = useCallback((year: number) => {
    const map = mapRef.current;
    const wikidataId = useAtlasStore.getState().selectedWikidataId;
    if (!map) return;

    if (!wikidataId) {
      if (map.getSource("territory-selected")) {
        (map.getSource("territory-selected") as GeoJSONSource).setData(EMPTY_FC);
      }
      lastFlownIdRef.current = null;
      return;
    }

    // Find the feature in the current year's data
    const cache = stateDataCacheRef.current.get(year);
    if (!cache || !cache.borders) return;

    const feature = cache.borders.features.find(
      (f: any) => f.properties?.wikidataId === wikidataId
    );

    if (feature) {
      // Update highlight territory
      if (map.getSource("territory-selected")) {
        (map.getSource("territory-selected") as GeoJSONSource).setData({
          type: "FeatureCollection",
          features: [JSON.parse(JSON.stringify(feature))],
        });
      }

      // Fly to if this is a new selection (from search/link)
      if (lastFlownIdRef.current !== wikidataId) {
        if (feature.geometry) {
          let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
          const processCoords = (coords: any) => {
            if (Array.isArray(coords[0])) {
              coords.forEach(processCoords);
            } else {
              const [lng, lat] = coords;
              if (lng < minLng) minLng = lng;
              if (lng > maxLng) maxLng = lng;
              if (lat < minLat) minLat = lat;
              if (lat > maxLat) maxLat = lat;
            }
          };
          processCoords(feature.geometry.coordinates);
          if (minLng !== Infinity) {
            map.fitBounds(
              [[minLng, minLat], [maxLng, maxLat]],
              { padding: 80, maxZoom: 5, duration: 1200 }
            );
          }
        }
        lastFlownIdRef.current = wikidataId;
      }
    } else {
      // Feature not found in this year's data
      if (map.getSource("territory-selected")) {
        (map.getSource("territory-selected") as GeoJSONSource).setData(EMPTY_FC);
      }
    }
  }, []);

  useEffect(() => {
    syncSelectionHighlight(stateYear);
  }, [selectedWikidataId, stateYear, syncSelectionHighlight]);

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
        center: [0, 20],
        zoom: 1.6,
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
                1, 0.0,
                2, 1.2,
                3, 3.0,
                0.0,
              ],
              "line-opacity": 0,
              "line-opacity-transition": { duration: TRANSITION_MS, delay: 0 },
            },
          });
        }

        // ── Selection highlight ────────────────────────────────────────
        map.addLayer({
          id: "territory-highlight-fill",
          type: "fill",
          source: "territory-selected",
          paint: {
            "fill-color": "#ffffff",
            "fill-opacity": 0.25,
          },
        });
        map.addLayer({
          id: "territory-highlight-outline",
          type: "line",
          source: "territory-selected",
          paint: {
            "line-color": "#ffffff",
            "line-width": 2.5,
            "line-blur": 0.5,
            "line-opacity": 0.8,
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

          // Mark as "already flown" so the effect doesn't jump the camera on click selection
          if (props.wikidataId) {
            lastFlownIdRef.current = props.wikidataId;
          }

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

        setMapLoaded(true);
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
      if (currentStateRef.current === year) return;

      // Note the latest requested year
      nextYearRef.current = year;

      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      try {
        // Always try to load the latest requested year
        let targetYear = nextYearRef.current ?? year;

        let cached = stateDataCacheRef.current.get(targetYear);
        if (!cached) {
          const fetched = await fetchSnapshotData(targetYear);
          if (!fetched.borders) return;
          cached = fetched;
          stateDataCacheRef.current.set(targetYear, fetched);
        }

        const { borders, labels } = cached;
        const oldSlot: Slot = activeSlotRef.current;
        const newSlot: Slot = oldSlot === "a" ? "b" : "a";

        // Load data into the incoming slot
        (map.getSource(`territories-${newSlot}`) as GeoJSONSource).setData(borders);
        (map.getSource(`labels-${newSlot}`) as GeoJSONSource).setData(labels ?? EMPTY_FC);

        // Trigger MapLibre paint transitions
        setSlotOpacity(map, newSlot, true);
        setSlotOpacity(map, oldSlot, false);

        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = setTimeout(() => {
          activeSlotRef.current = newSlot;
        }, TRANSITION_MS + 60);

        currentStateRef.current = targetYear;
        syncSelectionHighlight(targetYear);
      } catch (err) {
        console.error("[AtlasMap] loadSnapshot ERROR", err);
      } finally {
        isLoadingRef.current = false;
        // Process queue
        if (nextYearRef.current !== null && nextYearRef.current !== currentStateRef.current) {
          loadSnapshot(nextYearRef.current);
        }
      }
    },
    [setSlotOpacity, syncSelectionHighlight]
  );

  useEffect(() => {
    if (!mapLoaded) return;

    // 150ms debounce to avoid spamming updates during scrubbing
    const timer = setTimeout(() => {
      loadSnapshot(stateYear);
    }, 150);
    return () => clearTimeout(timer);
  }, [stateYear, mapLoaded, loadSnapshot]);

  return (
    <div
      ref={mapContainerRef}
      className="absolute inset-0 w-full h-full"
      aria-label="Interactive historical world map"
    />
  );
}
