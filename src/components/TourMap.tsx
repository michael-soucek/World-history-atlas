"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import { BASE_STYLE, FILL_OPACITY, TRANSITION_MS, EMPTY_FC } from "@/lib/mapBaseStyle";
import type { TourMapState } from "@/data/tours";
import { MAP } from "@/lib/palette";

type Slot = "a" | "b";
type FC = { type: "FeatureCollection"; features: { properties?: Record<string, unknown> | null }[] };

/**
 * The map inside a guided tour. Each step sets the year, camera and the
 * territory to highlight; the map crossfades borders and flies to the view.
 * Read-only apart from zooming, so the narration stays in charge.
 */
export default function TourMap({ state }: { state: TourMapState }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const slotRef = useRef<Slot>("a");
  const yearRef = useRef<number | null>(null);
  const cacheRef = useRef(new Map<number, { borders: FC; labels: FC | null }>());
  const [ready, setReady] = useState(false);
  // Tour cameras are set for a wide screen; pull back on narrow maps.
  const zoomShift = useRef(0);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let disposed = false;
    import("maplibre-gl").then(({ Map, NavigationControl }) => {
      if (disposed || !containerRef.current) return;
      const w = containerRef.current.clientWidth;
      zoomShift.current = w < 640 ? -1.4 : w < 900 ? -0.6 : 0;
      const map = new Map({
        container: containerRef.current,
        style: BASE_STYLE,
        center: [state.lng, state.lat],
        zoom: Math.max(state.zoom - 1.5 + zoomShift.current, 0.5),
        attributionControl: { compact: true },
        dragRotate: false,
        pitchWithRotate: false,
      });
      mapRef.current = map;
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        if (disposed) return;
        for (const slot of ["a", "b"] as Slot[]) {
          map.addSource(`t-${slot}`, { type: "geojson", data: EMPTY_FC });
          map.addSource(`l-${slot}`, { type: "geojson", data: EMPTY_FC });
          map.addLayer({
            id: `t-fill-${slot}`, type: "fill", source: `t-${slot}`,
            paint: { "fill-color": ["get", "_color"], "fill-opacity": 0, "fill-opacity-transition": { duration: TRANSITION_MS, delay: 0 } },
          });
          map.addLayer({
            id: `t-line-${slot}`, type: "line", source: `t-${slot}`,
            paint: { "line-color": MAP.border, "line-width": 0.5, "line-opacity": 0, "line-opacity-transition": { duration: TRANSITION_MS, delay: 0 } },
          });
        }
        map.addSource("hl", { type: "geojson", data: EMPTY_FC });
        map.addLayer({ id: "hl-fill", type: "fill", source: "hl", paint: { "fill-color": MAP.highlight, "fill-opacity": 0.28 } });
        map.addLayer({ id: "hl-line", type: "line", source: "hl", paint: { "line-color": MAP.highlight, "line-width": 2.5 } });
        for (const slot of ["a", "b"] as Slot[]) {
          map.addLayer({
            id: `l-${slot}`, type: "symbol", source: `l-${slot}`,
            filter: ["all", ["!=", ["get", "name"], "Unknown"], [">=", ["get", "rank"], ["interpolate", ["linear"], ["zoom"], 1, 5, 4, 3, 7, 1]]],
            layout: {
              "text-field": ["case", [">=", ["get", "rank"], 5], ["upcase", ["get", "name"]], ["get", "name"]],
              "text-letter-spacing": ["case", [">=", ["get", "rank"], 5], 0.12, 0.02],
              "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 1, ["max", 7, ["*", 1.5, ["min", ["get", "rank"], 8]]], 8, ["max", 10, ["*", 2.5, ["min", ["get", "rank"], 8]]]],
              "text-max-width": 8,
              "text-padding": 4,
              "symbol-sort-key": ["-", 0, ["get", "rank"]],
            },
            paint: {
              "text-color": MAP.label,
              "text-halo-color": MAP.labelHalo,
              "text-halo-width": 1.4,
              "text-opacity": 0,
              "text-opacity-transition": { duration: TRANSITION_MS, delay: 0 },
            },
          });
        }
        setReady(true);
      });
    });
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // The first state only seeds the camera; later steps are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    let cancelled = false;

    map.flyTo({ center: [state.lng, state.lat], zoom: Math.max(state.zoom + zoomShift.current, 0.5), duration: 2200, essential: true, curve: 1.5 });

    (async () => {
      let data = cacheRef.current.get(state.year);
      if (!data) {
        const [borders, labels] = await Promise.all([
          fetch(`/api/snapshot/${state.year}`).then(r => (r.ok ? r.json() : null)),
          fetch(`/api/snapshot/${state.year}/labels`).then(r => (r.ok ? r.json() : null)),
        ]);
        if (!borders) return;
        data = { borders, labels };
        cacheRef.current.set(state.year, data);
      }
      if (cancelled || !mapRef.current) return;
      const m = mapRef.current;

      if (yearRef.current !== state.year) {
        const next: Slot = slotRef.current === "a" ? "b" : "a";
        (m.getSource(`t-${next}`) as GeoJSONSource).setData(data.borders as GeoJSON.FeatureCollection);
        (m.getSource(`l-${next}`) as GeoJSONSource).setData((data.labels ?? EMPTY_FC) as GeoJSON.FeatureCollection);
        m.setPaintProperty(`t-fill-${next}`, "fill-opacity", FILL_OPACITY);
        m.setPaintProperty(`t-line-${next}`, "line-opacity", 0.35);
        m.setPaintProperty(`l-${next}`, "text-opacity", 1);
        const prev = slotRef.current;
        m.setPaintProperty(`t-fill-${prev}`, "fill-opacity", 0);
        m.setPaintProperty(`t-line-${prev}`, "line-opacity", 0);
        m.setPaintProperty(`l-${prev}`, "text-opacity", 0);
        slotRef.current = next;
        yearRef.current = state.year;
      }

      const hl = state.regionId
        ? data.borders.features.filter(f => f.properties?.wikidataId === state.regionId)
        : [];
      (m.getSource("hl") as GeoJSONSource).setData({ type: "FeatureCollection", features: hl } as GeoJSON.FeatureCollection);
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, state.year, state.lat, state.lng, state.zoom, state.regionId]);

  return <div ref={containerRef} className="absolute inset-0" aria-label="Map for this step of the tour" />;
}
