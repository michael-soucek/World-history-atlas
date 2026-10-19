"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import { BASE_STYLE, FILL_OPACITY, TRANSITION_MS, EMPTY_FC } from "@/lib/mapBaseStyle";
import type { TourMapState, TourMarker, TourRoute } from "@/data/tours";
import { MAP } from "@/lib/palette";
import { routeFeatures } from "@/lib/tourRoutes";

type Slot = "a" | "b";
type FC = { type: "FeatureCollection"; features: { properties?: Record<string, unknown> | null }[] };

/** How long an arrow takes to draw itself across the map. */
const DRAW_MS = 1800;

/**
 * An arrowhead pointing east, drawn once on a canvas. Added as an SDF image so
 * each arrow can tint it with its own colour (icon-color).
 */
function arrowImage(size = 48) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(size * 0.92, size / 2);
  ctx.lineTo(size * 0.12, size * 0.14);
  ctx.lineTo(size * 0.32, size / 2);
  ctx.lineTo(size * 0.12, size * 0.86);
  ctx.closePath();
  ctx.fill();
  return ctx.getImageData(0, 0, size, size);
}

/** Two crossed swords, for battle markers (drawn in the highlight colour). */
function battleImage(size = 40) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.lineCap = "round";
  const sword = (flip: number) => {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((flip * Math.PI) / 4);
    // Blade
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, -size * 0.42); ctx.lineTo(0, size * 0.3); ctx.stroke();
    ctx.strokeStyle = MAP.highlight;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -size * 0.42); ctx.lineTo(0, size * 0.3); ctx.stroke();
    // Cross-guard
    ctx.strokeStyle = MAP.label;
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-size * 0.13, size * 0.2); ctx.lineTo(size * 0.13, size * 0.2); ctx.stroke();
    ctx.restore();
  };
  sword(1);
  sword(-1);
  return ctx.getImageData(0, 0, size, size);
}

/**
 * Diagonal stripes in one colour on a clear background, for territory held
 * by occupation. Fill patterns can't be tinted per feature, so each side's
 * colour gets its own image (named in the zone data, e.g. "hatch-2f2b28").
 */
function hatchImage(color: string, size = 16) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 2.2;
  ctx.lineCap = "square";
  for (const offset of [-size, 0, size]) {
    ctx.beginPath();
    ctx.moveTo(offset, size);
    ctx.lineTo(offset + size, 0);
    ctx.stroke();
  }
  return ctx.getImageData(0, 0, size, size);
}

/**
 * The map inside a guided tour. Each step sets the year, camera and the
 * territory to highlight; the map crossfades borders and flies to the view.
 * Steps can also draw arrows (migrations, raids, voyages…) that animate along
 * their path, and labelled markers. With `trail`, earlier steps' arrows stay
 * on the map, faded. War tours add `zones`: who holds what at each stop,
 * shaded by side (hatched where occupied), over muted base borders.
 * Read-only apart from zooming, so the narration stays in charge.
 */
export default function TourMap({
  state,
  routes = [],
  trail = [],
  markers = [],
  highlight = [],
  zonesUrl = null,
  muted = false,
}: {
  state: TourMapState;
  /** Arrows for the current step; they draw themselves in. */
  routes?: TourRoute[];
  /** Arrows from earlier steps, shown faded. */
  trail?: TourRoute[];
  markers?: TourMarker[];
  /** Territory names to highlight in this year's snapshot. */
  highlight?: string[];
  /** Who holds what at this stop (from scripts/build-war-zones.mts), or null for none. */
  zonesUrl?: string | null;
  /** Fade the base map's colours so war zones read clearly over it. */
  muted?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const slotRef = useRef<Slot>("a");
  const yearRef = useRef<number | null>(null);
  const cacheRef = useRef(new Map<number, { borders: FC; labels: FC | null }>());
  const zoneCacheRef = useRef(new Map<string, FC>());
  const baseOpacity = muted ? FILL_OPACITY * 0.04 : FILL_OPACITY;
  const [ready, setReady] = useState(false);
  // Tour cameras are set for a wide screen; pull back on narrow maps.
  const zoomShift = useRef(0);
  // A stable string, so the effect below only reruns when the names change.
  const highlightKey = highlight.join("|");

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
        // War zones: a wash of each side's colour, stripes where occupied, a firm edge (the front).
        map.addSource("zones", { type: "geojson", data: EMPTY_FC });
        map.addLayer({
          id: "zone-fill", type: "fill", source: "zones", filter: ["!=", ["geometry-type"], "Point"],
          paint: { "fill-color": ["get", "color"], "fill-opacity": ["case", ["get", "occupied"], 0.2, 0.42] },
        });
        map.addLayer({
          id: "zone-hatch", type: "fill", source: "zones", filter: ["all", ["!=", ["geometry-type"], "Point"], ["get", "occupied"]],
          paint: { "fill-pattern": ["get", "pattern"] },
        });
        map.addLayer({
          id: "zone-line", type: "line", source: "zones", filter: ["!=", ["geometry-type"], "Point"],
          layout: { "line-join": "round" },
          paint: { "line-color": ["get", "color"], "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.8, 6, 1.8], "line-opacity": 0.85 },
        });
        // Arrow and marker layers are added after the territory labels (below), so they sit on top.
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
        map.addLayer({
          id: "zone-label", type: "symbol", source: "zones", filter: ["==", ["geometry-type"], "Point"],
          layout: {
            "text-field": ["upcase", ["get", "label"]],
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 2, 10, 6, 13],
            "text-letter-spacing": 0.12,
            "text-max-width": 9,
          },
          paint: { "text-color": ["get", "color"], "text-halo-color": MAP.labelHalo, "text-halo-width": 1.6 },
        });
        addRouteLayers(map);
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
      const bordersYear = state.mapYear ?? state.year;
      let data = cacheRef.current.get(bordersYear);
      if (!data) {
        const [borders, labels] = await Promise.all([
          fetch(`/api/snapshot/${bordersYear}`).then(r => (r.ok ? r.json() : null)),
          fetch(`/api/snapshot/${bordersYear}/labels`).then(r => (r.ok ? r.json() : null)),
        ]);
        if (!borders) return;
        data = { borders, labels };
        cacheRef.current.set(bordersYear, data);
      }
      if (cancelled || !mapRef.current) return;
      const m = mapRef.current;

      if (yearRef.current !== bordersYear) {
        const next: Slot = slotRef.current === "a" ? "b" : "a";
        (m.getSource(`t-${next}`) as GeoJSONSource).setData(data.borders as GeoJSON.FeatureCollection);
        (m.getSource(`l-${next}`) as GeoJSONSource).setData((data.labels ?? EMPTY_FC) as GeoJSON.FeatureCollection);
        m.setPaintProperty(`t-fill-${next}`, "fill-opacity", baseOpacity);
        m.setPaintProperty(`t-line-${next}`, "line-opacity", 0.35);
        m.setPaintProperty(`l-${next}`, "text-opacity", 1);
        const prev = slotRef.current;
        m.setPaintProperty(`t-fill-${prev}`, "fill-opacity", 0);
        m.setPaintProperty(`t-line-${prev}`, "line-opacity", 0);
        m.setPaintProperty(`l-${prev}`, "text-opacity", 0);
        slotRef.current = next;
        yearRef.current = bordersYear;
      }

      const names = new Set(highlightKey ? highlightKey.split("|") : []);
      const hl = data.borders.features.filter(
        f =>
          (state.regionId && f.properties?.wikidataId === state.regionId) ||
          names.has(String(f.properties?.name ?? "")),
      );
      (m.getSource("hl") as GeoJSONSource).setData({ type: "FeatureCollection", features: hl } as GeoJSON.FeatureCollection);
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, state.year, state.mapYear, state.lat, state.lng, state.zoom, state.regionId, highlightKey, baseOpacity]);

  // War zones: fetched per stop and cached, with a striped pattern made for
  // each occupying side's colour the first time it appears.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    let cancelled = false;
    (async () => {
      let data: FC | undefined = zonesUrl ? zoneCacheRef.current.get(zonesUrl) : { type: "FeatureCollection", features: [] };
      if (!data && zonesUrl) {
        data = await fetch(zonesUrl).then(r => (r.ok ? r.json() : null)) ?? undefined;
        if (data) zoneCacheRef.current.set(zonesUrl, data);
      }
      if (cancelled || !data || !mapRef.current) return;
      const m = mapRef.current;
      for (const f of data.features) {
        const pattern = f.properties?.pattern;
        if (typeof pattern === "string" && !m.hasImage(pattern)) m.addImage(pattern, hatchImage(String(f.properties?.color)), { pixelRatio: 2 });
      }
      (m.getSource("zones") as GeoJSONSource).setData(data as GeoJSON.FeatureCollection);
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, zonesUrl]);

  // Arrows: earlier steps' arrows appear at once (faded); this step's arrows
  // draw themselves from start to arrowhead. Visitors who ask for reduced
  // motion get the finished arrows straight away.
  const routesKey = JSON.stringify(routes);
  const trailKey = JSON.stringify(trail);
  const markersKey = JSON.stringify(markers);
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const current: TourRoute[] = JSON.parse(routesKey);
    const past: TourRoute[] = JSON.parse(trailKey);
    const points: TourMarker[] = JSON.parse(markersKey);

    (map.getSource("trail-lines") as GeoJSONSource).setData(routeFeatures(past).lines as GeoJSON.FeatureCollection);
    (map.getSource("trail-heads") as GeoJSONSource).setData(routeFeatures(past).heads as GeoJSON.FeatureCollection);
    (map.getSource("markers") as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: points.map(m => ({ type: "Feature", properties: { label: m.label, battle: m.kind === "battle" }, geometry: { type: "Point", coordinates: m.at } })),
    });

    const draw = (fraction: number) => {
      const { lines, heads } = routeFeatures(current, fraction);
      (map.getSource("route-lines") as GeoJSONSource).setData(lines as GeoJSON.FeatureCollection);
      (map.getSource("route-heads") as GeoJSONSource).setData(heads as GeoJSON.FeatureCollection);
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || current.length === 0) {
      draw(1);
      return;
    }
    let frame = 0;
    let start: number | null = null;
    // Start drawing as the camera settles, so the arrow isn't half-drawn off screen.
    const delay = setTimeout(() => {
      const tick = (now: number) => {
        start ??= now;
        const t = Math.min((now - start) / DRAW_MS, 1);
        draw(1 - Math.pow(1 - t, 3)); // ease out
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, 900);
    draw(0);
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(frame);
    };
  }, [ready, routesKey, trailKey, markersKey]);

  return <div ref={containerRef} className="absolute inset-0" aria-label="Map for this step of the tour" />;
}

/** Sources and layers for arrows and markers, drawn above everything else. */
function addRouteLayers(map: MapLibreMap) {
  map.addImage("tour-arrow", arrowImage(), { sdf: true });
  map.addImage("tour-battle", battleImage(), { pixelRatio: 2 });
  for (const id of ["trail-lines", "trail-heads", "route-lines", "route-heads", "markers"]) {
    map.addSource(id, { type: "geojson", data: EMPTY_FC });
  }

  // Earlier steps: thin and faded.
  map.addLayer({
    id: "trail-line", type: "line", source: "trail-lines",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": ["get", "color"], "line-width": 2, "line-opacity": 0.3 },
  });
  map.addLayer({
    id: "trail-head", type: "symbol", source: "trail-heads",
    layout: { "icon-image": "tour-arrow", "icon-size": 0.4, "icon-rotate": ["get", "angle"], "icon-rotation-alignment": "map", "icon-allow-overlap": true, "icon-ignore-placement": true },
    paint: { "icon-color": ["get", "color"], "icon-opacity": 0.35 },
  });

  // This step: a pale halo so arrows read over any territory colour, then the line.
  map.addLayer({
    id: "route-halo", type: "line", source: "route-lines",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": MAP.labelHalo, "line-width": 7 },
  });
  map.addLayer({
    id: "route-line", type: "line", source: "route-lines", filter: ["!", ["get", "dashed"]],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": ["get", "color"], "line-width": 3.4 },
  });
  map.addLayer({
    id: "route-line-dashed", type: "line", source: "route-lines", filter: ["get", "dashed"],
    layout: { "line-join": "round" },
    paint: { "line-color": ["get", "color"], "line-width": 3.2, "line-dasharray": [2, 1.4] },
  });
  // Small chevrons along each line show the direction of travel.
  map.addLayer({
    id: "route-chevrons", type: "symbol", source: "route-lines",
    layout: {
      "symbol-placement": "line", "symbol-spacing": 110,
      "icon-image": "tour-arrow", "icon-size": 0.32, "icon-rotation-alignment": "map",
      "icon-allow-overlap": true, "icon-ignore-placement": true,
    },
    paint: { "icon-color": MAP.labelHalo },
  });
  map.addLayer({
    id: "route-head", type: "symbol", source: "route-heads",
    layout: { "icon-image": "tour-arrow", "icon-size": 0.75, "icon-rotate": ["get", "angle"], "icon-rotation-alignment": "map", "icon-allow-overlap": true, "icon-ignore-placement": true },
    paint: { "icon-color": ["get", "color"], "icon-halo-color": MAP.labelHalo, "icon-halo-width": 1.5 },
  });
  map.addLayer({
    id: "route-label", type: "symbol", source: "route-lines",
    layout: {
      "symbol-placement": "line-center", "text-field": ["get", "label"],
      "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"], "text-size": 12.5,
      "text-offset": [0, -1.1], "text-keep-upright": true, "text-max-angle": 40,
    },
    paint: { "text-color": ["get", "color"], "text-halo-color": MAP.labelHalo, "text-halo-width": 1.6 },
  });

  // Markers: battles, cities, landings.
  map.addLayer({
    id: "marker-dot", type: "circle", source: "markers", filter: ["!", ["get", "battle"]],
    paint: { "circle-radius": 5, "circle-color": MAP.label, "circle-stroke-color": MAP.labelHalo, "circle-stroke-width": 2 },
  });
  map.addLayer({
    id: "marker-battle", type: "symbol", source: "markers", filter: ["get", "battle"],
    layout: { "icon-image": "tour-battle", "icon-allow-overlap": true, "icon-ignore-placement": true },
  });
  map.addLayer({
    id: "marker-label", type: "symbol", source: "markers",
    layout: {
      "text-field": ["get", "label"], "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      "text-size": 12, "text-anchor": "top", "text-offset": [0, 0.7], "text-max-width": 10,
    },
    paint: { "text-color": MAP.label, "text-halo-color": MAP.labelHalo, "text-halo-width": 1.6 },
  });
}
