"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import { BASE_STYLE, EMPTY_FC } from "@/lib/mapBaseStyle";
import { MAP } from "@/lib/palette";
import type { Territory } from "@/lib/empireGame";

/**
 * The Name the Empire map: one year's borders in muted paper tones with a
 * single territory lit up in vermilion. Names stay hidden until `reveal`,
 * then show for everything. Pan and zoom are allowed.
 */
export default function EmpireMap({ borders, labels, target, reveal }: {
  borders: FeatureCollection | null;
  labels: FeatureCollection | null;
  target: Territory | null;
  reveal: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    import("maplibre-gl").then(({ Map, NavigationControl }) => {
      if (disposed || !ref.current) return;
      const map = new Map({
        container: ref.current,
        style: BASE_STYLE,
        center: [20, 25],
        zoom: 1.2,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: { compact: true },
      });
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        map.addSource("t", { type: "geojson", data: EMPTY_FC });
        map.addSource("l", { type: "geojson", data: EMPTY_FC });
        map.addLayer({ id: "t-fill", type: "fill", source: "t", paint: { "fill-color": "#d8d2c4", "fill-opacity": 0.55 } });
        map.addLayer({ id: "t-target", type: "fill", source: "t", filter: ["==", ["get", "name"], ""], paint: { "fill-color": MAP.highlight, "fill-opacity": 0.78 } });
        map.addLayer({ id: "t-line", type: "line", source: "t", paint: { "line-color": MAP.border, "line-width": 0.6, "line-opacity": 0.4 } });
        map.addLayer({ id: "t-target-line", type: "line", source: "t", filter: ["==", ["get", "name"], ""], paint: { "line-color": "#8f2a16", "line-width": 1.6 } });
        map.addLayer({
          id: "l", type: "symbol", source: "l",
          layout: {
            visibility: "none",
            "text-field": ["get", "name"],
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 1, 9, 6, 14],
            "text-max-width": 8,
            "text-padding": 3,
            "symbol-sort-key": ["-", 0, ["get", "rank"]],
          },
          filter: ["all", ["!=", ["get", "name"], "Unknown"], [">=", ["get", "rank"], ["interpolate", ["linear"], ["zoom"], 1, 5, 4, 3, 7, 1]]],
          paint: { "text-color": MAP.label, "text-halo-color": MAP.labelHalo, "text-halo-width": 1.4 },
        });
        if (!disposed) setReady(true);
      });
      mapRef.current = map;
    });
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // New round: swap the data, light up the target and frame it with some context around it.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !borders || !target) return;
    (map.getSource("t") as GeoJSONSource).setData(borders);
    (map.getSource("l") as GeoJSONSource).setData(labels ?? EMPTY_FC);
    const filter = ["==", ["get", "name"], target.name] as ["==", ["get", string], string];
    map.setFilter("t-target", filter);
    map.setFilter("t-target-line", filter);
    const [w, s, e, n] = target.bbox;
    const wide = ref.current ? ref.current.clientWidth : 800;
    if (e - w > 300) {
      // Wraps the whole globe (or crosses the date line): show the world.
      map.jumpTo({ center: [target.center[0], 30], zoom: wide < 640 ? 0.4 : 1 });
    } else {
      map.fitBounds([[w, s], [e, n]], { padding: wide < 640 ? 40 : 90, maxZoom: 5, duration: 0 });
      // Step back a little so the neighbours are in view too.
      map.jumpTo({ zoom: Math.max(map.getZoom() - 0.6, 0.4) });
    }
  }, [ready, borders, labels, target]);

  useEffect(() => {
    if (ready) mapRef.current?.setLayoutProperty("l", "visibility", reveal ? "visible" : "none");
  }, [ready, reveal]);

  return (
    <>
      <div ref={ref} className="absolute inset-0" />
      {(!ready || !borders) && (
        <div className="absolute inset-0 grid place-items-center bg-[#cdd9e5]">
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink/64 animate-pulse">Unrolling the map…</span>
        </div>
      )}
    </>
  );
}
