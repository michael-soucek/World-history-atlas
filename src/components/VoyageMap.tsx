"use client";

import { useEffect, useRef, useState } from "react";
import type {
  Map as MapLibreMap,
  StyleSpecification,
  Popup as MapLibrePopup,
  LngLatBoundsLike,
  MapLayerMouseEvent,
} from "maplibre-gl";
import type { Voyage } from "@/data/voyages";

// Same muted base plate used across the atlas (ocean + neutral land + coast).
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
    { id: "ocean", type: "background", paint: { "background-color": "#D8F2FF" } },
    {
      id: "land",
      type: "fill",
      source: "maplibre",
      "source-layer": "countries",
      paint: { "fill-color": "#EAB38F" },
    },
    {
      id: "coastline",
      type: "line",
      source: "maplibre",
      "source-layer": "countries",
      paint: { "line-color": "#198EC8", "line-width": 0.8, "line-blur": 0.5 },
    },
  ],
};

/**
 * Unwrap a sequence of [lng, lat] coordinates so consecutive longitudes never
 * jump more than 180°. This makes routes that cross the Pacific / antimeridian
 * (e.g. Tahiti to New Zealand) render as one continuous line instead of
 * wrapping the long way around the map.
 */
function unwrapSequence(coords: [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  let prevLng: number | null = null;
  for (const [lngRaw, lat] of coords) {
    let lng = lngRaw;
    if (prevLng !== null) {
      while (lng - prevLng > 180) lng -= 360;
      while (lng - prevLng < -180) lng += 360;
    }
    prevLng = lng;
    out.push([lng, lat]);
  }
  return out;
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Interpolate points along the great circle between two [lng, lat] points so
 * long open-ocean legs render as gentle curves rather than rigid Cartesian
 * diagonals in the Web-Mercator projection. Short legs (dense coastal anchors)
 * are left essentially unchanged.
 */
function greatCircleDensify(coords: [number, number][], maxSegDeg = 4): [number, number][] {
  if (coords.length < 2) return coords.slice();
  const out: [number, number][] = [];
  for (let i = 0; i < coords.length - 1; i += 1) {
    const [lng1, lat1] = coords[i];
    const [lng2, lat2] = coords[i + 1];
    out.push([lng1, lat1]);

    const φ1 = lat1 * DEG2RAD, λ1 = lng1 * DEG2RAD;
    const φ2 = lat2 * DEG2RAD, λ2 = lng2 * DEG2RAD;
    // Central angle (haversine).
    const dφ = φ2 - φ1;
    const dλ = λ2 - λ1;
    const h = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
    const δ = 2 * Math.asin(Math.min(1, Math.sqrt(h)));
    const segDeg = δ * RAD2DEG;
    const steps = Math.floor(segDeg / maxSegDeg);
    if (steps <= 1 || δ === 0) continue;

    const sinδ = Math.sin(δ);
    for (let s = 1; s < steps; s += 1) {
      const f = s / steps;
      const A = Math.sin((1 - f) * δ) / sinδ;
      const B = Math.sin(f * δ) / sinδ;
      const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
      const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
      const z = A * Math.sin(φ1) + B * Math.sin(φ2);
      const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * RAD2DEG;
      const lng = Math.atan2(y, x) * RAD2DEG;
      out.push([lng, lat]);
    }
  }
  out.push(coords[coords.length - 1]);
  return out;
}

/** The unwrapped, densified line coordinates used to draw a voyage's route. */
function voyageLineCoords(voyage: Voyage): [number, number][] {
  const raw: [number, number][] =
    voyage.path && voyage.path.length > 1
      ? voyage.path
      : voyage.waypoints.map((w) => [w.lng, w.lat]);
  return unwrapSequence(greatCircleDensify(raw));
}

/**
 * Pick the longitude for a waypoint marker that best lines up with the drawn
 * (unwrapped) route, so markers sit on the line even across the antimeridian.
 */
function alignLng(lngRaw: number, lat: number, line: [number, number][]): number {
  let best = lngRaw;
  let bestD = Infinity;
  for (let k = -2; k <= 2; k += 1) {
    const cand = lngRaw + k * 360;
    for (const [px, py] of line) {
      const d = (cand - px) ** 2 + (lat - py) ** 2;
      if (d < bestD) {
        bestD = d;
        best = cand;
      }
    }
  }
  return best;
}

function voyageFeatureCollection(voyage: Voyage) {
  const line = voyageLineCoords(voyage);
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates: line },
        properties: { kind: "route", color: voyage.color },
      },
      ...voyage.waypoints.map((wp, i) => {
        const lng = alignLng(wp.lng, wp.lat, line);
        return {
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [lng, wp.lat] },
          properties: {
            kind: "waypoint",
            color: voyage.color,
            name: wp.name,
            date: wp.date,
            note: wp.note ?? "",
            pivotal: wp.pivotal ? 1 : 0,
            order: i + 1,
          },
        };
      }),
    ],
  };
}

const lineLayerId = (id: string) => `voyage-line-${id}`;
const haloLayerId = (id: string) => `voyage-halo-${id}`;
const dotLayerId = (id: string) => `voyage-dot-${id}`;

interface VoyageMapProps {
  voyages: Voyage[];
  /** Voyage ids visible on first load. Defaults to the first voyage. */
  initialVisibleIds?: string[];
  className?: string;
}

export default function VoyageMap({ voyages, initialVisibleIds, className }: VoyageMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<MapLibrePopup | null>(null);
  const readyRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>(() => {
    const defaults = initialVisibleIds ?? (voyages[0] ? [voyages[0].id] : []);
    return Object.fromEntries(voyages.map((v) => [v.id, defaults.includes(v.id)]));
  });

  // Fit the map to the currently-visible voyages.
  function fitToVisible(map: MapLibreMap, vis: Record<string, boolean>) {
    let west = Infinity, south = Infinity, east = -Infinity, north = -Infinity;
    let any = false;
    for (const v of voyages) {
      if (!vis[v.id]) continue;
      for (const [lng, lat] of voyageLineCoords(v)) {
        any = true;
        west = Math.min(west, lng);
        east = Math.max(east, lng);
        south = Math.min(south, lat);
        north = Math.max(north, lat);
      }
    }
    if (!any) return;
    const bounds: LngLatBoundsLike = [[west, south], [east, north]];
    map.fitBounds(bounds, { padding: 64, duration: 700, maxZoom: 5 });
  }

  // Initialise the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let disposed = false;

    import("maplibre-gl").then(({ Map, NavigationControl, Popup }) => {
      if (disposed || !containerRef.current) return;
      const map = new Map({
        container: containerRef.current,
        style: BASE_STYLE,
        center: [-160, 0],
        zoom: 1.4,
        attributionControl: {},
      });
      mapRef.current = map;
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      popupRef.current = new Popup({ closeButton: false, closeOnClick: false, offset: 12 });

      map.on("load", () => {
        if (disposed) return;

        for (const voyage of voyages) {
          const sourceId = `voyage-${voyage.id}`;
          map.addSource(sourceId, { type: "geojson", data: voyageFeatureCollection(voyage) });

          map.addLayer({
            id: lineLayerId(voyage.id),
            type: "line",
            source: sourceId,
            filter: ["==", ["get", "kind"], "route"],
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": voyage.color, "line-width": 2.5, "line-opacity": 0.9 },
          });

          map.addLayer({
            id: haloLayerId(voyage.id),
            type: "circle",
            source: sourceId,
            filter: ["==", ["get", "kind"], "waypoint"],
            paint: {
              "circle-radius": ["case", ["==", ["get", "pivotal"], 1], 7, 4],
              "circle-color": "#ffffff",
              "circle-stroke-color": voyage.color,
              "circle-stroke-width": ["case", ["==", ["get", "pivotal"], 1], 2.5, 1.5],
            },
          });

          map.addLayer({
            id: dotLayerId(voyage.id),
            type: "circle",
            source: sourceId,
            filter: ["all", ["==", ["get", "kind"], "waypoint"], ["==", ["get", "pivotal"], 1]],
            paint: { "circle-radius": 3, "circle-color": voyage.color },
          });

          // Interactions on the waypoint halos.
          const showPopup = (e: MapLayerMouseEvent) => {
            const f = e.features?.[0];
            if (!f || f.geometry.type !== "Point") return;
            const [lng, lat] = f.geometry.coordinates as [number, number];
            const p = f.properties as Record<string, string>;
            const note = p.note ? `<div class="vm-note">${p.note}</div>` : "";
            popupRef.current
              ?.setLngLat([lng, lat])
              .setHTML(
                `<div class="vm-popup"><div class="vm-date">${p.date}</div>` +
                  `<div class="vm-name">${p.name}</div>${note}</div>`,
              )
              .addTo(map);
          };
          map.on("mouseenter", haloLayerId(voyage.id), (e) => {
            map.getCanvas().style.cursor = "pointer";
            showPopup(e);
          });
          map.on("mousemove", haloLayerId(voyage.id), showPopup);
          map.on("mouseleave", haloLayerId(voyage.id), () => {
            map.getCanvas().style.cursor = "";
            popupRef.current?.remove();
          });
          map.on("click", haloLayerId(voyage.id), showPopup);
        }

        readyRef.current = true;
        setReady(true);
      });
    });

    return () => {
      disposed = true;
      popupRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
  }, [voyages]);

  // Apply visibility whenever it changes (and once the map is ready).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    for (const v of voyages) {
      const vis = visible[v.id] ? "visible" : "none";
      for (const id of [lineLayerId(v.id), haloLayerId(v.id), dotLayerId(v.id)]) {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", vis);
      }
    }
    fitToVisible(map, visible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, ready]);

  function toggle(id: string) {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const allOn = voyages.every((v) => visible[v.id]);
  function toggleAll() {
    const next = !allOn;
    setVisible(Object.fromEntries(voyages.map((v) => [v.id, next])));
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <div ref={containerRef} className="absolute inset-0 rounded-2xl overflow-hidden" />

      {/* Legend / toggles */}
      <div className="absolute top-3 left-3 z-10 max-w-[15rem] rounded-xl border border-paper bg-parchment/90 backdrop-blur-sm p-3 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-ink/50 text-[11px] font-semibold uppercase tracking-wider">Voyages</p>
          {voyages.length > 1 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-[11px] text-ancient/70 hover:text-ancient font-medium transition-colors"
            >
              {allOn ? "Hide all" : "Show all"}
            </button>
          )}
        </div>
        <ul className="space-y-1.5">
          {voyages.map((v) => {
            const on = visible[v.id];
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => toggle(v.id)}
                  aria-pressed={on}
                  className={`flex items-start gap-2 w-full text-left rounded-lg px-2 py-1.5 transition-colors ${
                    on ? "bg-white/70" : "hover:bg-white/40"
                  }`}
                >
                  <span
                    className="mt-1 w-3 h-3 rounded-full shrink-0 border"
                    style={{
                      backgroundColor: on ? v.color : "transparent",
                      borderColor: v.color,
                    }}
                    aria-hidden="true"
                  />
                  <span className={`text-xs leading-tight ${on ? "text-ink/80" : "text-ink/40"}`}>
                    <span className="font-semibold">{v.label}</span>{" "}
                    <span className="font-mono text-[10px] text-ink/40">{v.years}</span>
                    <span className="block text-[10px] text-ink/40">{v.ship}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {!ready && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-parchment/60 rounded-2xl pointer-events-none">
          <span className="text-ink/40 text-sm animate-pulse">Loading map…</span>
        </div>
      )}
    </div>
  );
}
