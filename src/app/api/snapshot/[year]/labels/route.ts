import { NextRequest, NextResponse } from "next/server";
import { buildManifest, stateIndexForYear } from "@/app/api/manifest/route";
import { geometryArea, normaliseSovereign, type RawProperties } from "@/lib/geoEnrich";
import polylabel from "polylabel";

import { packJson, sendJson, type PackedJson } from "@/lib/geoResponse";

// Server-side in-memory cache: stateTileKey → packed labels JSON
const labelCache = new Map<string, PackedJson>();

// ── Geometry helpers ───────────────────────────────────────────────────────

/** Find the outer ring of the largest polygon in a MultiPolygon. */
function biggestOuterRing(geom: unknown): number[][] | null {
  if (!geom || typeof geom !== "object") return null;
  const g = geom as { type: string; coordinates: unknown };

  if (g.type === "Polygon") {
    const rings = g.coordinates as number[][][];
    return rings[0] ?? null;
  }

  if (g.type === "MultiPolygon") {
    const polys = g.coordinates as number[][][][];
    let bestRing: number[][] | null = null;
    let bestArea = 0;
    for (const poly of polys) {
      const ring = poly[0];
      if (!ring) continue;
      let a = 0;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
      }
      a = Math.abs(a) / 2;
      if (a > bestArea) {
        bestArea = a;
        bestRing = ring;
      }
    }
    return bestRing;
  }
  return null;
}

/** Compute polylabel point for a geometry. Returns null if unsupported. */
function computeLabelPoint(geom: unknown): [number, number] | null {
  if (!geom || typeof geom !== "object") return null;
  const g = geom as { type: string; coordinates: unknown };
  try {
    if (g.type === "Polygon") {
      const rings = g.coordinates as number[][][];
      const pt = polylabel(rings, 0.5);
      return [pt[0], pt[1]];
    }
    if (g.type === "MultiPolygon") {
      const ring = biggestOuterRing(geom);
      if (!ring) return null;
      const pt = polylabel([ring], 0.5);
      return [pt[0], pt[1]];
    }
  } catch {
    return null;
  }
  return null;
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ year: string }> }
): Promise<NextResponse> {
  const { year: yearParam } = await params;
  const year = parseInt(yearParam, 10);

  if (isNaN(year)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  try {
    const manifest = await buildManifest();
    const stateIdx = stateIndexForYear(manifest.states, year);
    const state = manifest.states[stateIdx];
    const snapshot = manifest.snapshots[state.snapshotIndex];

    if (!snapshot || !state) {
      return NextResponse.json({ error: "No state found" }, { status: 404 });
    }

    const cacheKey = `${state.validFrom}:${state.validTo}:${snapshot.snapshotYear}`;
    const hit = labelCache.get(cacheKey);
    if (hit) return sendJson(req, hit);

    const upstream = await fetch(new URL(snapshot.rawUrl, req.url), {
      headers: { "User-Agent": "WorldHistoryAtlas/1.0" },
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: 502 }
      );
    }

    const raw = (await upstream.json()) as {
      features: Array<{ properties: RawProperties; geometry: unknown }>;
    };

    const labelFeatures: Array<{
      type: "Feature";
      properties: {
        name: string;
        sovereign: string;
        sovereignColorKey: string;
        rank: number;
        area: number;
      };
      geometry: { type: "Point"; coordinates: [number, number] };
    }> = [];

    for (const f of raw.features) {
      const pt = computeLabelPoint(f.geometry);
      if (!pt) continue;

      const name = f.properties.NAME ?? "Unknown";
      const sovereign = f.properties.SUBJECTO || name;
      const sovereignColorKey = normaliseSovereign(sovereign);
      const area = geometryArea(f.geometry);
      const rank = area > 0 ? Math.min(8, Math.floor(Math.log10(area * 1000))) : 0;

      labelFeatures.push({
        type: "Feature",
        properties: { name, sovereign, sovereignColorKey, rank, area: Math.round(area * 1000) / 1000 },
        geometry: { type: "Point", coordinates: [Math.round(pt[0] * 1000) / 1000, Math.round(pt[1] * 1000) / 1000] },
      });
    }

    const geojson = {
      type: "FeatureCollection",
      requestedYear: year,
      snapshotYear: snapshot.snapshotYear,
      stateYear: state.stateYear,
      validFrom: state.validFrom,
      validTo: state.validTo,
      sources: state.sources,
      features: labelFeatures,
    };
    const packed = packJson(geojson);
    labelCache.set(cacheKey, packed);
    return sendJson(req, packed);
  } catch (err) {
    console.error(`[labels] year=${year}`, err);
    return NextResponse.json(
      { error: "Failed to compute labels" },
      { status: 500 }
    );
  }
}
