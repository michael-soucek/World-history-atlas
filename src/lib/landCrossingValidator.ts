/**
 * Land-crossing validator for voyage routes.
 * 
 * Validates that route polylines don't cross major landmasses using
 * bounding-box checks and simple coastline heuristics. This is a
 * first-pass validator; future enhancements should use detailed
 * coastline data (e.g., Natural Earth) for more precision.
 */

/**
 * Major landmasses defined by bounding boxes (rough approximations).
 * Used for quick rejection of obviously-crossing routes.
 */
const MAJOR_LANDMASSES = [
  // North America
  { name: "North America", bounds: { n: 85, s: 15, e: -50, w: -170 } },
  // Central America / Caribbean
  { name: "Central America", bounds: { n: 18, s: 8, e: -75, w: -95 } },
  // South America
  { name: "South America", bounds: { n: 15, s: -56, e: -30, w: -82 } },
  // Greenland
  { name: "Greenland", bounds: { n: 84, s: 60, e: -11, w: -73 } },
  // Europe
  { name: "Europe", bounds: { n: 71, s: 36, e: 40, w: -10 } },
  // Africa
  { name: "Africa", bounds: { n: 37, s: -35, e: 52, w: -18 } },
  // Middle East
  { name: "Middle East", bounds: { n: 40, s: 15, e: 65, w: 25 } },
  // South Asia
  { name: "South Asia", bounds: { n: 38, s: 8, e: 98, w: 65 } },
  // Southeast Asia
  { name: "Southeast Asia", bounds: { n: 21, s: -10, e: 141, w: 95 } },
  // East Asia
  { name: "East Asia", bounds: { n: 54, s: 18, e: 135, w: 98 } },
  // Australia
  { name: "Australia", bounds: { n: -10, s: -44, e: 154, w: 113 } },
];

/**
 * Check if a point is within a bounding box.
 */
function pointInBounds(
  lat: number,
  lng: number,
  bounds: { n: number; s: number; e: number; w: number }
): boolean {
  return lat <= bounds.n && lat >= bounds.s && lng <= bounds.e && lng >= bounds.w;
}

/**
 * Check if a line segment (lng1, lat1) → (lng2, lat2) crosses a landmass bounding box.
 * Uses a simple approach: checks both endpoints and multiple intermediate points.
 */
function segmentCrossesLandmass(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  bounds: { n: number; s: number; e: number; w: number }
): boolean {
  // If both endpoints are outside, and the segment doesn't cross the box, it's safe
  const p1Inside = pointInBounds(lat1, lng1, bounds);
  const p2Inside = pointInBounds(lat2, lng2, bounds);

  if (p1Inside || p2Inside) return true; // At least one endpoint is on land

  // Check if the segment line crosses the bounding box
  // (simplified: we assume a straight line in lat/lng space)
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const latInterp = lat1 + (lat2 - lat1) * t;
    const lngInterp = lng1 + (lng2 - lng1) * t;
    if (pointInBounds(latInterp, lngInterp, bounds)) {
      return true;
    }
  }

  return false;
}

/**
 * Validate that a route (array of [lng, lat] pairs) doesn't cross land.
 * Returns { valid: boolean, errors: string[] }
 * 
 * Note: This is a heuristic validator. False positives/negatives are possible
 * with complex coastlines. Use detailed coastline data for production systems.
 */
export function validateRouteLandCrossings(
  path: [number, number][]
): { valid: boolean; errors: string[] } {
  if (!path || path.length < 2) {
    return { valid: false, errors: ["Route must have at least 2 waypoints"] };
  }

  const errors: string[] = [];

  // Check each segment
  for (let i = 0; i < path.length - 1; i++) {
    const [lng1, lat1] = path[i];
    const [lng2, lat2] = path[i + 1];

    // Check against all major landmasses
    for (const landmass of MAJOR_LANDMASSES) {
      if (segmentCrossesLandmass(lat1, lng1, lat2, lng2, landmass.bounds)) {
        errors.push(
          `Segment ${i}-${i + 1} (${lat1.toFixed(2)},${lng1.toFixed(2)}) → (${lat2.toFixed(2)},${lng2.toFixed(2)}) ` +
          `may cross ${landmass.name} — verify against detailed maps`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all waypoints in a voyage to ensure they're not on land (within reason).
 * This is a looser check than route validation — just checks if points seem reasonable.
 */
export function validateWaypointsPlausible(
  waypoints: Array<{ lat: number; lng: number; name: string }>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const wp of waypoints) {
    // Check if point is in any major landmass (rough)
    for (const landmass of MAJOR_LANDMASSES) {
      if (pointInBounds(wp.lat, wp.lng, landmass.bounds)) {
        // This is a soft warning; ports/cities often exist on coastlines
        errors.push(`Waypoint "${wp.name}" at (${wp.lat}, ${wp.lng}) is within ${landmass.name} bounds — verify if this is a port/coastal location`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
