"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GeoJSON, MapContainer } from "react-leaflet";
import type { GeoJsonObject, FeatureCollection } from "geojson";
import type { Layer } from "leaflet";

export const KEYFRAMES = [
  -3000, -2000, -1500, -1000, -700, -500, -400, -323, -300, -200, -100, -1,
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1279, 1300,
  1400, 1492, 1500, 1530, 1600, 1650, 1700, 1715, 1783, 1800, 1815, 1880,
  1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000, 2010,
] as const;

const MIN_YEAR = -3000;
const MAX_YEAR = 2010;
const INITIAL_YEAR = 1700;
const MAP_BOUNDS: [[number, number], [number, number]] = [[-85, -180], [85, 180]];

function slugFor(year: number): string {
  return year < 0 ? `bc${-year}` : `${year}`;
}

function nearestKeyframe(year: number): number {
  let best: number = KEYFRAMES[0];
  for (const keyframe of KEYFRAMES) {
    if (keyframe <= year) best = keyframe;
    else break;
  }
  return best;
}

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
}

function hashName(name: string): number {
  let hash = 2166136261;
  for (let i = 0; i < name.length; i += 1) {
    hash ^= name.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function colorForName(name: string): string {
  const hash = hashName(name || "unknown");
  const hue = hash % 360;
  const sat = 42 + (hash % 18);
  const light = 43 + (hash % 10);
  return `hsl(${hue} ${sat}% ${light}%)`;
}

type BasemapProperties = {
  NAME?: string;
};

export default function HistoricalMapClient() {
  const [year, setYear] = useState(INITIAL_YEAR);
  const [activeKeyframe, setActiveKeyframe] = useState(() => nearestKeyframe(INITIAL_YEAR));
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef(new Map<number, FeatureCollection>());

  const resolvedKeyframe = useMemo(() => nearestKeyframe(year), [year]);

  useEffect(() => {
    let cancelled = false;

    async function loadKeyframe(targetKeyframe: number) {
      setActiveKeyframe(targetKeyframe);
      setError(null);

      const cached = cacheRef.current.get(targetKeyframe);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = `https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/world_${slugFor(targetKeyframe)}.geojson`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch keyframe ${targetKeyframe}`);
        }

        const geojson = (await response.json()) as FeatureCollection;
        cacheRef.current.set(targetKeyframe, geojson);

        if (!cancelled) {
          setData(geojson);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load map data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadKeyframe(resolvedKeyframe);

    return () => {
      cancelled = true;
    };
  }, [resolvedKeyframe]);

  return (
    <section className="rounded-2xl border border-paper bg-white/60 p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Historical Borders Timeline</h2>
          <p className="text-sm text-ink/55">
            Scrub year by year across the historical-basemaps keyframes without refetching the same snapshot twice.
          </p>
        </div>
        <div className="text-right text-sm text-ink/60">
          <div className="text-lg font-semibold text-ink">{formatYear(year)}</div>
          {resolvedKeyframe !== year ? (
            <div>showing map of {formatYear(resolvedKeyframe)}</div>
          ) : (
            <div>showing map of {formatYear(activeKeyframe)}</div>
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
          onChange={(event) => setYear(Number(event.target.value))}
          className="w-full"
          aria-label="Historical year"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-ink/40">
          <span>{formatYear(MIN_YEAR)}</span>
          <span>{KEYFRAMES.length} keyframes</span>
          <span>{formatYear(MAX_YEAR)}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-paper bg-ocean" style={{ height: 560 }}>
        {loading ? (
          <div className="absolute left-4 top-4 z-[500] rounded-md bg-white/85 px-3 py-1 text-sm text-ink shadow-sm">
            loading...
          </div>
        ) : null}

        {error ? (
          <div className="absolute inset-x-4 top-4 z-[500] rounded-md bg-red-50/95 px-3 py-2 text-sm text-red-900 shadow-sm">
            {error}
          </div>
        ) : null}

        <MapContainer
          center={[20, 10]}
          zoom={2}
          minZoom={2}
          maxZoom={7}
          zoomControl={false}
          attributionControl={false}
          maxBounds={MAP_BOUNDS}
          maxBoundsViscosity={1}
          style={{ height: "100%", width: "100%", background: "#d8f2ff" }}
        >
          {data ? (
            <GeoJSON
              key={activeKeyframe}
              data={data as GeoJsonObject}
              style={(feature) => {
                const props = (feature?.properties ?? {}) as BasemapProperties;
                const name = props.NAME ?? "Unknown";
                return {
                  color: "rgba(34, 34, 34, 0.55)",
                  weight: 0.7,
                  fillColor: colorForName(name),
                  fillOpacity: 0.72,
                };
              }}
              onEachFeature={(feature, layer: Layer) => {
                const props = (feature.properties ?? {}) as BasemapProperties;
                const name = props.NAME ?? "Unknown";
                if ("bindTooltip" in layer && typeof layer.bindTooltip === "function") {
                  layer.bindTooltip(name, {
                    sticky: true,
                    direction: "auto",
                    opacity: 0.95,
                  });
                }
              }}
            />
          ) : null}
        </MapContainer>
      </div>
    </section>
  );
}
