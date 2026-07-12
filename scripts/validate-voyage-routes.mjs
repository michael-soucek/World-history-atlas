#!/usr/bin/env node
// fallow-ignore-file unused-file
/**
 * scripts/validate-voyage-routes.mjs
 *
 * Validates that every waypoint and every densified route-path segment for each
 * Cook voyage lies over water, not over land.
 *
 * HOW IT WORKS
 * ────────────
 * 1. Downloads Natural Earth 50m land polygons (world-atlas@2 TopoJSON, CC0)
 *    and caches them to .cache/land-50m.json. Re-download by deleting that file.
 * 2. Decodes the TopoJSON arc-delta encoding into plain [lng, lat] rings.
 * 3. Uses a ray-casting point-in-polygon test on each check point.
 * 4. For every voyage path, samples a point every SAMPLE_KM km along each
 *    segment, then tests each point.
 * 5. For waypoints, also tests the waypoint coordinate itself (shifted slightly
 *    seaward first to account for genuine anchorage-on-land centroids).
 *
 * TOLERANCE
 * ─────────
 * Points within NEAR_COAST_KM of the nearest ring vertex (an approximation for
 * "near the coastline") are excluded — this prevents false-flagging routes that
 * legitimately hug the shore a few hundred metres offshore.
 *
 * EXIT CODES
 *   0 → all clean
 *   1 → one or more land crossings detected (lists them and suggests fixes)
 *
 * USAGE
 *   node scripts/validate-voyage-routes.mjs [--verbose]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = process.cwd();
const CACHE_DIR = join(ROOT, ".cache");
const LAND_CACHE = join(CACHE_DIR, "land-50m.json");
const LAND_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json";
const VOYAGE_DATA = join(ROOT, "src/data/voyages.ts");

const SAMPLE_KM = 8;           // densify path at this interval
const NEAR_COAST_KM = 12;      // buffer: ignore flags within this many km of a coastline vertex
const VERBOSE = process.argv.includes("--verbose");

// ── Fetch / cache land data ──────────────────────────────────────────────────

async function fetchJson(url) {
  for (const delay of [0, 1000, 3000]) {
    if (delay) await sleep(delay);
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "WorldHistoryAtlas/1.0 (validate-routes)" },
        signal: AbortSignal.timeout(30_000),
      });
      if (res.ok) return res.json();
      if (res.status >= 500 || res.status === 429) continue;
      throw new Error(`HTTP ${res.status} for ${url}`);
    } catch (e) {
      if (delay === 3000) throw e;
    }
  }
}

async function getLandTopoJSON() {
  if (existsSync(LAND_CACHE)) {
    process.stdout.write("Using cached land polygons.\n");
    return JSON.parse(readFileSync(LAND_CACHE, "utf8"));
  }
  process.stdout.write("Downloading Natural Earth 50m land polygons…\n");
  const topo = await fetchJson(LAND_URL);
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(LAND_CACHE, JSON.stringify(topo));
  process.stdout.write("Cached to .cache/land-50m.json\n");
  return topo;
}

// ── TopoJSON → ring arrays ───────────────────────────────────────────────────

function decodeTopo(topo) {
  const { scale, translate } = topo.transform;
  const arcs = topo.arcs;

  /** Decode one arc index (negative = reversed) into [[lng, lat], …] */
  function decodeArc(idx) {
    const reversed = idx < 0;
    const raw = arcs[reversed ? ~idx : idx];
    let x = 0, y = 0;
    const pts = raw.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
    return reversed ? pts.reverse() : pts;
  }

  /** Concatenate arc sequences for one polygon ring. */
  function ring(arcIndices) {
    return arcIndices.flatMap((idx, i) => {
      const pts = decodeArc(idx);
      return i === 0 ? pts : pts.slice(1);
    });
  }

  const geom = topo.objects.land;
  const rings = [];
  for (const geomItem of geom.geometries) {
    if (geomItem.type === "Polygon") {
      for (const arcGroup of geomItem.arcs) rings.push(ring(arcGroup));
    } else if (geomItem.type === "MultiPolygon") {
      for (const poly of geomItem.arcs) for (const arcGroup of poly) rings.push(ring(arcGroup));
    }
  }
  return rings;
}

// ── Geometry helpers ─────────────────────────────────────────────────────────

/** Ray-casting point-in-polygon for one ring. */
function pointInRing(lng, lat, ring) {
  let inside = false;
  const n = ring.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersects = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** Is [lng, lat] on land? Checks all rings. */
function isOnLand(lng, lat, rings) {
  for (const r of rings) {
    if (pointInRing(lng, lat, r)) return true;
  }
  return false;
}

const DEG2RAD = Math.PI / 180;
const EARTH_KM = 6371;

/** Haversine distance in km between two [lng, lat] pairs. */
function distKm(a, b) {
  const dLat = (b[1] - a[1]) * DEG2RAD;
  const dLng = (b[0] - a[0]) * DEG2RAD;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * DEG2RAD) * Math.cos(b[1] * DEG2RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** Interpolate a point fraction f ∈ [0,1] along the great-circle from a to b. */
function interpolate(a, b, f) {
  if (f <= 0) return a;
  if (f >= 1) return b;
  const φ1 = a[1] * DEG2RAD, λ1 = a[0] * DEG2RAD;
  const φ2 = b[1] * DEG2RAD, λ2 = b[0] * DEG2RAD;
  const dφ = φ2 - φ1, dλ = λ2 - λ1;
  const h = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  const δ = 2 * Math.asin(Math.min(1, Math.sqrt(h)));
  if (δ === 0) return a;
  const sinδ = Math.sin(δ);
  const A = Math.sin((1 - f) * δ) / sinδ;
  const B = Math.sin(f * δ) / sinδ;
  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);
  const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) / DEG2RAD;
  const lng = Math.atan2(y, x) / DEG2RAD;
  return [lng, lat];
}

/** Densify a segment into one sample point every SAMPLE_KM km. */
function densifySegment(a, b, stepKm) {
  const d = distKm(a, b);
  const steps = Math.max(1, Math.ceil(d / stepKm));
  const pts = [];
  for (let s = 0; s <= steps; s++) pts.push(interpolate(a, b, s / steps));
  return pts;
}

/**
 * Minimum distance from [lng, lat] to any vertex in any ring — cheap proxy for
 * "near the coastline". Full poly-edge distance would be better but this is a
 * fast approximation and sufficient for our purposes.
 */
function minDistToCoast(lng, lat, rings) {
  let min = Infinity;
  for (const r of rings) {
    for (const v of r) {
      const d = distKm([lng, lat], v);
      if (d < min) min = d;
    }
  }
  return min;
}

// ── Voyage data parsing ──────────────────────────────────────────────────────
// Parse the TypeScript source with a lightweight regex — avoids a TS compiler
// dependency in this script.

function parseCoordArray(src, label) {
  // Match: path: [ ... ] or waypoints: [ ... ]
  const pattern = new RegExp(`${label}\\s*:\\s*\\[([\\s\\S]*?)\\]`, "g");
  const matches = [];
  let m;
  while ((m = pattern.exec(src)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

function extractPaths(src) {
  // Extract every `path: [ ... ]` block → [[lng,lat], ...]
  const pathRe = /path:\s*\[([\s\S]*?)\],\n\s*waypoints/g;
  const results = [];
  let m;
  while ((m = pathRe.exec(src)) !== null) {
    const coords = [...m[1].matchAll(/\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g)]
      .map(([, lng, lat]) => [parseFloat(lng), parseFloat(lat)]);
    if (coords.length) results.push(coords);
  }
  return results;
}

function extractWaypoints(src) {
  // Extract every waypoint { lat, lng } block
  const waypointSectionRe = /waypoints:\s*\[([\s\S]*?)\],\s*\n\s*\}/g;
  const wpRe = /lat:\s*(-?[\d.]+)\s*,\s*lng:\s*(-?[\d.]+)[,\s\n]*(?:note|pivotal|name|date)?/g;
  const all = [];
  let sec;
  while ((sec = waypointSectionRe.exec(src)) !== null) {
    const wps = [];
    let wm;
    const body = sec[1];
    while ((wm = wpRe.exec(body)) !== null) {
      wps.push([parseFloat(wm[2]), parseFloat(wm[1])]); // [lng, lat]
    }
    if (wps.length) all.push(wps);
  }
  return all;
}

function extractVoyageIds(src) {
  const ids = [];
  const re = /id:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) ids.push(m[1]);
  return ids;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const topo = await getLandTopoJSON();
  process.stdout.write("Decoding land polygons…\n");
  const rings = decodeTopo(topo);
  process.stdout.write(`Decoded ${rings.length} land rings.\n\n`);

  const src = readFileSync(VOYAGE_DATA, "utf8");
  const voyageIds = extractVoyageIds(src);
  const paths = extractPaths(src);
  const waypointSets = extractWaypoints(src);

  if (paths.length !== waypointSets.length) {
    process.stderr.write(`Parse warning: ${paths.length} paths vs ${waypointSets.length} waypoint sets — check regex if voyage count seems wrong.\n`);
  }

  const flags = [];

  for (let vi = 0; vi < Math.min(paths.length, waypointSets.length); vi++) {
    const id = voyageIds[vi] ?? `voyage-${vi + 1}`;
    const path = paths[vi];
    const waypoints = waypointSets[vi];
    process.stdout.write(`Checking ${id}: ${path.length} path pts, ${waypoints.length} waypoints…\n`);

    // 1. Check every waypoint coordinate.
    for (const [lng, lat] of waypoints) {
      if (!isOnLand(lng, lat, rings)) continue;
      const coastDist = minDistToCoast(lng, lat, rings);
      if (coastDist <= NEAR_COAST_KM) {
        if (VERBOSE) process.stdout.write(`  NEAR-COAST waypoint [${lng.toFixed(3)}, ${lat.toFixed(3)}] (${coastDist.toFixed(1)}km from coast) — within tolerance, skipping.\n`);
        continue;
      }
      flags.push({ voyage: id, kind: "waypoint", lng, lat, coastDist });
    }

    // 2. Check every densified segment of the path.
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i], b = path[i + 1];
      const samples = densifySegment(a, b, SAMPLE_KM);
      for (const [lng, lat] of samples) {
        if (!isOnLand(lng, lat, rings)) continue;
        const coastDist = minDistToCoast(lng, lat, rings);
        if (coastDist <= NEAR_COAST_KM) {
          if (VERBOSE) process.stdout.write(`  NEAR-COAST path sample [${lng.toFixed(3)}, ${lat.toFixed(3)}] (seg ${i}→${i+1}, ${coastDist.toFixed(1)}km) — within tolerance.\n`);
          continue;
        }
        flags.push({ voyage: id, kind: "path-segment", segA: a, segB: b, lng, lat, coastDist });
      }
    }
  }

  // Deduplicate flags that share the same segment (only report each segment once).
  const seen = new Set();
  const deduped = flags.filter((f) => {
    const key = f.kind === "waypoint"
      ? `${f.voyage}:wp:${f.lng.toFixed(2)},${f.lat.toFixed(2)}`
      : `${f.voyage}:seg:${f.segA?.[0].toFixed(2)},${f.segA?.[1].toFixed(2)}->${f.segB?.[0].toFixed(2)},${f.segB?.[1].toFixed(2)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (deduped.length === 0) {
    process.stdout.write("\n✓ All voyage routes are water-only (0 land crossings detected).\n");
    process.exit(0);
  }

  process.stdout.write(`\n✗ ${deduped.length} land crossing(s) detected:\n\n`);
  for (const f of deduped) {
    if (f.kind === "waypoint") {
      process.stdout.write(`  [${f.voyage}] WAYPOINT on land: [${f.lng.toFixed(4)}, ${f.lat.toFixed(4)}] (${f.coastDist.toFixed(1)} km from coast)\n`);
      process.stdout.write(`    → Move this coordinate to the harbour/bay immediately offshore\n`);
    } else {
      process.stdout.write(`  [${f.voyage}] PATH SEGMENT crosses land:\n`);
      process.stdout.write(`    segment: [${f.segA[0].toFixed(4)}, ${f.segA[1].toFixed(4)}] → [${f.segB[0].toFixed(4)}, ${f.segB[1].toFixed(4)}]\n`);
      process.stdout.write(`    land point at: [${f.lng.toFixed(4)}, ${f.lat.toFixed(4)}] (${f.coastDist.toFixed(1)} km from coast)\n`);
      process.stdout.write(`    → Add intermediate waypoints or reroute the path segment around land\n`);
    }
  }

  process.stdout.write(`\nFix all the above in src/data/voyages.ts and re-run this script.\n`);
  process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(2); });
