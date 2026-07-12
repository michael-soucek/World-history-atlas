/**
 * Shared MapLibre base-map style used by every map on the site.
 *
 * Both AtlasMap (the full /map experience) and HistoricalMapClient
 * (the /timeline scrubber) import from here so they can never drift apart.
 */
import type { StyleSpecification } from "maplibre-gl";

export const BASE_STYLE: StyleSpecification = {
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

/** Opacity constants shared across both map components. */
export const FILL_OPACITY = 0.55;
export const LINE_OPACITY = 0.8;
export const LABEL_OPACITY = 1.0;
export const TRANSITION_MS = 1000;
export const EMPTY_FC = { type: "FeatureCollection" as const, features: [] as [] };
