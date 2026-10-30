"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { BASE_STYLE } from "@/lib/mapBaseStyle";
import { addTerritoryLayers, showYear, type CompareView } from "@/components/CompareMap";
import { MAP } from "@/lib/palette";

/**
 * The Guess the Year map: one year's borders with the territory names hidden
 * until `reveal`. Pan and zoom are allowed — looking closer is part of the game.
 */
/** A territory drawn in the map's starting view: states with a page first, then biggest first. */
export interface ShownTerritory {
  name: string;
  /** Entity page slug, when the site has a page for it. */
  slug: string | null;
}

export default function GuessMap({ year, view, reveal, hint, onLoaded, onTerritories }: {
  year: number;
  view: CompareView;
  reveal: boolean;
  /** One name to show before the reveal (the hint), or null. */
  hint?: string | null;
  /** Called once this year's borders are on the map. */
  onLoaded?: (year: number) => void;
  /** The biggest territories in the starting view, once they're drawn. */
  onTerritories?: (year: number, list: ShownTerritory[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const [shownYear, setShownYear] = useState<number | null>(null);
  const onLoadedRef = useRef(onLoaded);
  const onTerritoriesRef = useRef(onTerritories);
  useEffect(() => { onLoadedRef.current = onLoaded; onTerritoriesRef.current = onTerritories; });
  const baseLabelFilter = useRef<unknown>(null);
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
        // The hint: one territory outlined in vermilion (its name shows in the side panel).
        map.addLayer({ id: "hint-line", type: "line", source: "t", filter: ["==", ["get", "name"], ""], paint: { "line-color": MAP.highlight, "line-width": 2.5 } });
        baseLabelFilter.current = map.getFilter("l");
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
    map.jumpTo({ center: [view.lng, view.lat], zoom: Math.max(view.zoom + zoomShift.current, 0.5) });
    showYear(map, year, () => current).then((drawn) => {
      if (!drawn) return;
      setShownYear(year);
      onLoadedRef.current?.(year);
      // Once drawn, list what's in view: the hint and the reveal's "On this map" use it.
      map.once("idle", () => {
        if (!current) return;
        const areas = new Map<string, { area: number; slug: string | null }>();
        for (const f of map.queryRenderedFeatures({ layers: ["t-fill"] })) {
          const { name, slug, area } = f.properties as { name?: string; slug?: string; area?: number };
          if (!name || name === "Unknown") continue;
          const prev = areas.get(name);
          if (!prev || (area ?? 0) > prev.area) areas.set(name, { area: area ?? 0, slug: slug || prev?.slug || null });
        }
        // States with a page of their own first (they make useful hints), then by size.
        const list = [...areas.entries()]
          .sort((a, b) => Number(!!b[1].slug) - Number(!!a[1].slug) || b[1].area - a[1].area)
          .slice(0, 6)
          .map(([name, v]) => ({ name, slug: v.slug }));
        onTerritoriesRef.current?.(year, list);
      });
    });
    return () => { current = false; };
  }, [ready, year, view.lat, view.lng, view.zoom]);

  // Names: all of them after the reveal, just the hint's (outlined) before it, none otherwise.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    map.setFilter("hint-line", ["==", ["get", "name"], !reveal && hint ? hint : ""]);
    if (reveal || !hint) {
      map.setFilter("l", baseLabelFilter.current as Parameters<MapLibreMap["setFilter"]>[1]);
      map.setLayoutProperty("l", "visibility", reveal ? "visible" : "none");
    } else {
      map.setFilter("l", ["==", ["get", "name"], hint]);
      map.setLayoutProperty("l", "visibility", "visible");
    }
  }, [ready, reveal, hint]);

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
