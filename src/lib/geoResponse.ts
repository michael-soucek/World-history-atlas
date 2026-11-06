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

/**
 * Send JSON uncompressed: Vercel's CDN compresses it on production. Don't
 * pre-gzip here: Next.js strips a route handler's Content-Encoding header, so
 * clients would get undecodable bytes. Largest response is 2.6 MB (1492), under
 * Vercel's 4.5 MB function limit.
 */
export function sendJson(body: string): NextResponse {
  return new NextResponse(body, {
    headers: { "Content-Type": "application/json", "Cache-Control": CACHE_CONTROL },
  });
}
