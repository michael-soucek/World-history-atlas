/**
 * Geometry for the arrows on tour maps: smoothing a few waypoints into a
 * curve, drawing a curve part-way (for the "drawing itself" animation), and
 * working out which way the arrowhead points. Pure functions, no map code.
 */
import type { RouteKind, TourRoute } from "@/data/tours";

type Point = [number, number]; // [longitude, latitude]

/** How each kind of arrow looks. Colours sit beside the site's lapis palette. */
export const ROUTE_STYLE: Record<RouteKind, { color: string; dashed: boolean; name: string }> = {
  migration: { color: "#2346a0", dashed: false, name: "Migration" },
  forced: { color: "#5b2a1a", dashed: false, name: "Forced migration" },
  raid: { color: "#d2462a", dashed: true, name: "Raid" },
  conquest: { color: "#8b1e2d", dashed: false, name: "Conquest" },
  voyage: { color: "#1f7272", dashed: false, name: "Voyage" },
  spread: { color: "#6a4aa0", dashed: false, name: "Spread of ideas" },
  plague: { color: "#2b2b2b", dashed: false, name: "Spread of plague" },
  retreat: { color: "#7a8597", dashed: true, name: "Retreat" },
};

/**
 * Turns a few waypoints into a smooth curve (Chaikin's corner cutting): each
 * pass replaces every corner with two points a quarter of the way along each
 * side. The first and last points stay where they are.
 */
export function smooth(path: Point[], passes = 3): Point[] {
  let points = path;
  for (let pass = 0; pass < passes && points.length > 2; pass++) {
    const next: Point[] = [points[0]];
    for (let i = 0; i < points.length - 1; i++) {
      const [ax, ay] = points[i];
      const [bx, by] = points[i + 1];
      next.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25]);
      next.push([ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
    }
    next.push(points[points.length - 1]);
    points = next;
  }
  return points;
}

/** Longitude/latitude to Web Mercator x/y, so lengths and angles match what's on screen. */
function project([lng, lat]: Point): Point {
  const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [(lng * Math.PI) / 180, y];
}

function distance(a: Point, b: Point): number {
  const [ax, ay] = project(a);
  const [bx, by] = project(b);
  return Math.hypot(bx - ax, by - ay);
}

/** The first `fraction` (0 to 1) of a line, by length: draws the arrow part-way. */
export function partOf(line: Point[], fraction: number): Point[] {
  if (fraction >= 1 || line.length < 2) return line;
  const lengths = line.slice(1).map((p, i) => distance(line[i], p));
  let remaining = Math.max(fraction, 0) * lengths.reduce((a, b) => a + b, 0);
  const out: Point[] = [line[0]];
  for (let i = 0; i < lengths.length; i++) {
    if (remaining >= lengths[i]) {
      out.push(line[i + 1]);
      remaining -= lengths[i];
      continue;
    }
    const t = lengths[i] === 0 ? 0 : remaining / lengths[i];
    const [ax, ay] = line[i];
    const [bx, by] = line[i + 1];
    out.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
    break;
  }
  return out;
}

/**
 * Which way the line is heading at its end, in degrees clockwise from east,
 * as seen on the (Mercator) map. Used to rotate the arrowhead.
 */
export function endAngle(line: Point[]): number {
  if (line.length < 2) return 0;
  const [ax, ay] = project(line[line.length - 2]);
  const [bx, by] = project(line[line.length - 1]);
  // Screen y grows downwards, Mercator y grows upwards: flip it.
  return (Math.atan2(-(by - ay), bx - ax) * 180) / Math.PI;
}

/** GeoJSON for a set of routes drawn `fraction` of the way: the lines and their arrowheads. */
export function routeFeatures(routes: TourRoute[], fraction = 1) {
  const lines = [];
  const heads = [];
  for (const route of routes) {
    const style = ROUTE_STYLE[route.kind];
    const line = partOf(smooth(route.path), fraction);
    const properties = { label: route.label, color: style.color, dashed: style.dashed };
    lines.push({ type: "Feature" as const, properties, geometry: { type: "LineString" as const, coordinates: line } });
    heads.push({
      type: "Feature" as const,
      properties: { ...properties, angle: endAngle(line) },
      geometry: { type: "Point" as const, coordinates: line[line.length - 1] },
    });
  }
  return {
    lines: { type: "FeatureCollection" as const, features: lines },
    heads: { type: "FeatureCollection" as const, features: heads },
  };
}
