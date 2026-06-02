import { NextRequest, NextResponse } from "next/server";
import { buildManifest, stateIndexForYear } from "@/app/api/manifest/route";
import { enrichBorderProps, type RawProperties } from "@/lib/geoEnrich";

// Server-side in-memory cache: stateTileKey → enriched JSON string
const borderCache = new Map<string, string>();

export async function GET(
  _req: NextRequest,
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
    if (borderCache.has(cacheKey)) {
      return new NextResponse(borderCache.get(cacheKey)!, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    const upstream = await fetch(snapshot.rawUrl, {
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
      features: raw.features.map((f) => ({
        type: "Feature",
        properties: enrichBorderProps(
          f.properties,
          f.geometry,
          state.validFrom,
          state.validTo
        ),
        geometry: f.geometry,
      })),
    };

    const json = JSON.stringify(enriched);
    borderCache.set(cacheKey, json);

    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error(`[snapshot] year=${year}`, err);
    return NextResponse.json({ error: "Failed to fetch snapshot" }, { status: 500 });
  }
}
