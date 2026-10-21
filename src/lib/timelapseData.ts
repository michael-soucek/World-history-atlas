/**
 * Reads the year-by-year map data written by scripts/build-cliopatria-timelapse.mts
 * (public/timelapse-data/{slug}.json) and gives the borders and labels for any
 * one year. Used by the /borders-over-time player and the video renderer.
 */

export interface TimelapseData {
  /** Grid size, in degrees, of the integer coordinates. */
  unit: number;
  colors: string[];
  names: string[];
  /** Polygons → rings → delta-encoded x, y pairs. */
  geoms: number[][][][];
  /** from, to, colour index, geometry index */
  shapes: [number, number, number, number][];
  /** lon, lat, from, to, name index, rank (2–7, by land in the frame) */
  labels: [number, number, number, number, number, number][];
}

type Position = [number, number];
export interface YearFeatures {
  /** Changes whenever the set of shapes does, so callers can skip redrawing. */
  key: string;
  borders: GeoJSON.FeatureCollection<GeoJSON.MultiPolygon, { color: string }>;
  labels: GeoJSON.FeatureCollection<GeoJSON.Point, { name: string; rank: number }>;
}

export function createTimelapse(data: TimelapseData) {
  const decoded = new Map<number, Position[][][]>();
  const geometry = (i: number) => {
    let g = decoded.get(i);
    if (!g) {
      g = data.geoms[i].map((rings) =>
        rings.map((d) => {
          const ring: Position[] = [];
          let x = 0, y = 0;
          for (let k = 0; k < d.length; k += 2) {
            x += d[k];
            y += d[k + 1];
            ring.push([+(x * data.unit).toFixed(4), +(y * data.unit).toFixed(4)]);
          }
          if (ring.length && (ring[0][0] !== ring.at(-1)![0] || ring[0][1] !== ring.at(-1)![1])) ring.push(ring[0]);
          return ring;
        }),
      );
      decoded.set(i, g);
    }
    return g;
  };

  /** The indexes of the shapes on the map in `year`. */
  const aliveAt = (year: number) => {
    const out: number[] = [];
    for (let i = 0; i < data.shapes.length; i++) {
      const s = data.shapes[i];
      if (s[0] <= year && s[1] >= year) out.push(i);
    }
    return out;
  };

  return {
    keyAt: (year: number) => aliveAt(year).join(","),
    at(year: number): YearFeatures {
      const alive = aliveAt(year);
      return {
        key: alive.join(","),
        borders: {
          type: "FeatureCollection",
          features: alive.map((i) => {
            const [, , c, g] = data.shapes[i];
            return { type: "Feature", properties: { color: data.colors[c] }, geometry: { type: "MultiPolygon", coordinates: geometry(g) } };
          }),
        },
        labels: {
          type: "FeatureCollection",
          features: data.labels
            .filter((l) => l[2] <= year && l[3] >= year)
            .map(([x, y, , , n, rank]) => ({ type: "Feature", properties: { name: data.names[n], rank }, geometry: { type: "Point", coordinates: [x, y] } })),
        },
      };
    },
  };
}

/** MapLibre layers for the borders and labels (sources "t" and "lab"). */
export function timelapseLayers(palette: { border: string; label: string; labelHalo: string }) {
  return [
    { id: "f", type: "fill", source: "t", paint: { "fill-color": ["get", "color"], "fill-opacity": 0.55 } },
    { id: "l", type: "line", source: "t", paint: { "line-color": palette.border, "line-width": 0.7, "line-opacity": 0.5 } },
    {
      id: "lab",
      type: "symbol",
      source: "lab",
      filter: [">=", ["get", "rank"], ["interpolate", ["linear"], ["zoom"], 1, 5, 2.5, 4, 4, 3, 5.5, 2]],
      layout: {
        "text-field": ["case", [">=", ["get", "rank"], 6], ["upcase", ["get", "name"]], ["get", "name"]],
        "text-letter-spacing": ["case", [">=", ["get", "rank"], 6], 0.08, 0.02],
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "text-size": ["interpolate", ["linear"], ["get", "rank"], 2, 9, 5, 10.5, 7, 13],
        "text-max-width": 8,
        "text-padding": 3,
        "symbol-sort-key": ["-", 0, ["get", "rank"]],
      },
      paint: { "text-color": palette.label, "text-halo-color": palette.labelHalo, "text-halo-width": 1.3 },
    },
  ] as const;
}
