import { NextRequest, NextResponse } from "next/server";
import { buildManifest, stateIndexForYear } from "@/app/api/manifest/route";
import { enrichBorderProps, type RawProperties } from "@/lib/geoEnrich";

import { packJson, roundGeometry, sendJson, type PackedJson } from "@/lib/geoResponse";

// Server-side in-memory cache: stateTileKey (+ "lite") → packed JSON
const borderCache = new Map<string, PackedJson>();

/** Coordinate precision: ~100 m for the atlas, ~1 km for the homepage preview. */
const DIGITS = 3;
const LITE_DIGITS = 2;

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

    // ?lite=1 — colours and outlines only, coarser coordinates: the
    // homepage preview, which never zooms in or reads territory names.
    const lite = req.nextUrl.searchParams.get("lite") === "1";
    const cacheKey = `${state.validFrom}:${state.validTo}:${snapshot.snapshotYear}${lite ? ":lite" : ""}`;
    const hit = borderCache.get(cacheKey);
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
      type: string;
      features: Array<{
        type: string;
        properties: RawProperties;
        geometry: unknown;
      }>;
    };

    const enriched = {
      type: "FeatureCollection",
      requestedYear: year,
      snapshotYear: snapshot.snapshotYear,
      stateYear: state.stateYear,
      validFrom: state.validFrom,
      validTo: state.validTo,
      sources: state.sources,
      features: raw.features.map((f) => {
        const properties = enrichBorderProps(
          f.properties,
          f.geometry,
          state.validFrom,
          state.validTo,
          undefined,
          undefined,
          snapshot.snapshotYear
        );
        return {
          type: "Feature",
          properties: lite ? { _color: properties._color } : properties,
          // Area is computed above from the full-precision geometry.
          geometry: roundGeometry(structuredClone(f.geometry), lite ? LITE_DIGITS : DIGITS),
        };
      }),
    };

    const packed = packJson(enriched);
    borderCache.set(cacheKey, packed);
    return sendJson(req, packed);
  } catch (err) {
    console.error(`[snapshot] year=${year}`, err);
    return NextResponse.json({ error: "Failed to fetch snapshot" }, { status: 500 });
  }
}
