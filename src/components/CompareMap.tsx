"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import { BASE_STYLE, EMPTY_FC, FILL_OPACITY } from "@/lib/mapBaseStyle";
import { MAP } from "@/lib/palette";

export interface CompareView {
  lat: number;
  lng: number;
  zoom: number;
}

/** Load one year's borders and labels into a map's "t" and "l" sources. */
async function showYear(map: MapLibreMap, year: number, isCurrent: () => boolean) {
  const [borders, labels] = await Promise.all([
    fetch(`/api/snapshot/${year}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`/api/snapshot/${year}/labels`).then((r) => (r.ok ? r.json() : null)),
  ]);
  if (!borders || !isCurrent()) return;
  (map.getSource("t") as GeoJSONSource).setData(borders);
  (map.getSource("l") as GeoJSONSource).setData(labels ?? EMPTY_FC);
}

/** The border, fill and label layers both halves draw (same look as the tours). */
function addTerritoryLayers(map: MapLibreMap) {
  map.addSource("t", { type: "geojson", data: EMPTY_FC });
  map.addSource("l", { type: "geojson", data: EMPTY_FC });
  map.addLayer({ id: "t-fill", type: "fill", source: "t", paint: { "fill-color": ["get", "_color"], "fill-opacity": FILL_OPACITY } });
  map.addLayer({ id: "t-line", type: "line", source: "t", paint: { "line-color": MAP.border, "line-width": 0.6, "line-opacity": 0.45 } });
  map.addLayer({
    id: "l", type: "symbol", source: "l",
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
    paint: { "text-color": MAP.label, "text-halo-color": MAP.labelHalo, "text-halo-width": 1.4 },
  });
}

/**
 * Two maps of the same place in different years, stacked: the left year
 * underneath, the right year on top, clipped at a divider you drag (or move
 * with the arrow keys). Only the lower map takes input; the upper one copies
 * its camera, so panning and zooming moves both.
 */
export default function CompareMap({ left, right, view }: { left: number; right: number; view: CompareView }) {
  const lowerRef = useRef<HTMLDivElement>(null);
  const upperRef = useRef<HTMLDivElement>(null);
  const maps = useRef<{ lower: MapLibreMap; upper: MapLibreMap } | null>(null);
  const [ready, setReady] = useState(false);
  const [split, setSplit] = useState(50); // divider position, % from the left
  const dragging = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);
  // Preset cameras are set for a wide screen; pull back on narrow ones.
  const zoomShift = useRef(0);

  // Create both maps once.
  useEffect(() => {
    let disposed = false;
    import("maplibre-gl").then(({ Map, NavigationControl }) => {
      if (disposed || !lowerRef.current || !upperRef.current) return;
      const w = lowerRef.current.clientWidth;
      zoomShift.current = w < 640 ? -1.2 : w < 900 ? -0.5 : 0;
      const options = { style: BASE_STYLE, center: [view.lng, view.lat] as [number, number], zoom: Math.max(view.zoom + zoomShift.current, 0.5), dragRotate: false, pitchWithRotate: false };
      const lower = new Map({ ...options, container: lowerRef.current, attributionControl: { compact: true } });
      const upper = new Map({ ...options, container: upperRef.current, interactive: false, attributionControl: false });
      lower.addControl(new NavigationControl({ showCompass: false }), "top-right");
      lower.on("move", () => upper.jumpTo({ center: lower.getCenter(), zoom: lower.getZoom() }));
      let loaded = 0;
      for (const m of [lower, upper]) {
        m.on("load", () => {
          addTerritoryLayers(m);
          if (++loaded === 2 && !disposed) setReady(true);
        });
      }
      maps.current = { lower, upper };
    });
    return () => {
      disposed = true;
      maps.current?.lower.remove();
      maps.current?.upper.remove();
      maps.current = null;
    };
    // The first view only seeds the camera; later changes fly (below).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !maps.current) return;
    let current = true;
    showYear(maps.current.lower, left, () => current);
    return () => { current = false; };
  }, [ready, left]);

  useEffect(() => {
    if (!ready || !maps.current) return;
    let current = true;
    showYear(maps.current.upper, right, () => current);
    return () => { current = false; };
  }, [ready, right]);

  useEffect(() => {
    if (!ready || !maps.current) return;
    maps.current.lower.flyTo({ center: [view.lng, view.lat], zoom: Math.max(view.zoom + zoomShift.current, 0.5), duration: 1200 });
  }, [ready, view.lat, view.lng, view.zoom]);

  function moveTo(clientX: number) {
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    setSplit(Math.min(98, Math.max(2, ((clientX - box.left) / box.width) * 100)));
  }

  return (
    <div ref={frameRef} className="relative w-full h-full overflow-hidden bg-[#cdd9e5]">
      <div ref={lowerRef} className="absolute inset-0" />
      <div ref={upperRef} className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 0 0 ${split}%)` }} />

      {/* The divider: a hairline with a grab handle. */}
      <div className="absolute inset-y-0 w-px bg-ink pointer-events-none" style={{ left: `${split}%` }} />
      <button
        type="button"
        role="slider"
        aria-label="Divider between the two years"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(split)}
        aria-valuetext={`${Math.round(split)}% showing the left year`}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ink text-parchment grid place-items-center shadow-lg cursor-ew-resize touch-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{ left: `${split}%` }}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
        onPointerUp={() => { dragging.current = false; }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setSplit((s) => Math.max(2, s - 4));
          if (e.key === "ArrowRight") setSplit((s) => Math.min(98, s + 4));
        }}
      >
        <span aria-hidden="true" className="text-[15px] leading-none tracking-tighter">‹ ›</span>
      </button>
    </div>
  );
}
