"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { BASE_STYLE } from "@/lib/mapBaseStyle";
import { addTerritoryLayers, showYear, type CompareView } from "@/components/CompareMap";

/**
 * The Guess the Year map: one year's borders with the territory names hidden
 * until `reveal`. Pan and zoom are allowed — looking closer is part of the game.
 */
export default function GuessMap({ year, view, reveal, onLoaded }: {
  year: number;
  view: CompareView;
  reveal: boolean;
  /** Called once this year's borders are on the map. */
  onLoaded?: (year: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const [shownYear, setShownYear] = useState<number | null>(null);
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => { onLoadedRef.current = onLoaded; });
  const zoomShift = useRef(0);

  useEffect(() => {
    let disposed = false;
    import("maplibre-gl").then(({ Map, NavigationControl }) => {
      if (disposed || !ref.current) return;
      const w = ref.current.clientWidth;
      zoomShift.current = w < 640 ? -1 : 0;
      const map = new Map({
        container: ref.current,
        style: BASE_STYLE,
        center: [view.lng, view.lat],
        zoom: Math.max(view.zoom + zoomShift.current, 0.5),
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: { compact: true },
      });
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        addTerritoryLayers(map);
        map.setLayoutProperty("l", "visibility", "none");
        if (!disposed) setReady(true);
      });
      mapRef.current = map;
    });
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // The first view only seeds the camera; later rounds jump (below).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // New round: hide the names first, then load the borders and move the camera.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    let current = true;
    map.setLayoutProperty("l", "visibility", "none");
    showYear(map, year, () => current).then((drawn) => {
      if (!drawn) return;
      setShownYear(year);
      onLoadedRef.current?.(year);
    });
    map.jumpTo({ center: [view.lng, view.lat], zoom: Math.max(view.zoom + zoomShift.current, 0.5) });
    return () => { current = false; };
  }, [ready, year, view.lat, view.lng, view.zoom]);

  useEffect(() => {
    if (ready) mapRef.current?.setLayoutProperty("l", "visibility", reveal ? "visible" : "none");
  }, [ready, reveal]);

  return (
    <>
      <div ref={ref} className="absolute inset-0" />
      {shownYear !== year && (
        // Covers the previous round's borders too, so they can't be mistaken for this one's.
        <div className="absolute inset-0 grid place-items-center bg-[#cdd9e5]">
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink/40 animate-pulse">Unrolling the map…</span>
        </div>
      )}
    </>
  );
}
