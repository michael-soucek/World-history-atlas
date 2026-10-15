import { gzipSync } from "node:zlib";
import { NextResponse } from "next/server";

/**
 * Snapshot borders never change for a given year range, so browsers and the
 * CDN can keep them for a long time.
 */
const CACHE_CONTROL = "public, max-age=604800, s-maxage=31536000, stale-while-revalidate=86400";

/** Round every coordinate in a GeoJSON geometry, in place. 3 decimals ≈ 100 m. */
export function roundGeometry(geom: unknown, digits: number): unknown {
  const f = 10 ** digits;
  const walk = (c: unknown): unknown => {
    if (!Array.isArray(c)) return c;
    if (typeof c[0] === "number") return (c as number[]).map((n) => Math.round(n * f) / f);
    return c.map(walk);
  };
  if (geom && typeof geom === "object" && "coordinates" in geom) {
    const g = geom as { coordinates: unknown };
    g.coordinates = walk(g.coordinates);
  }
  return geom;
}

export interface PackedJson {
  raw: string;
  gz: Buffer;
}

export function packJson(value: unknown): PackedJson {
  const raw = JSON.stringify(value);
  return { raw, gz: gzipSync(raw, { level: 9 }) };
}

/** Send pre-gzipped JSON when the client accepts it. */
export function sendJson(req: Request, body: PackedJson): NextResponse {
  const gzip = /\bgzip\b/.test(req.headers.get("accept-encoding") ?? "");
  return new NextResponse(gzip ? new Uint8Array(body.gz) : body.raw, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": CACHE_CONTROL,
      Vary: "Accept-Encoding",
      ...(gzip ? { "Content-Encoding": "gzip" } : {}),
    },
  });
}
