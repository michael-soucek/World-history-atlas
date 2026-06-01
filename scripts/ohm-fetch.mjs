#!/usr/bin/env node
/**
 * OpenHistoricalMap (OHM) data fetcher
 *
 * Queries the OHM Overpass API for country-level (admin_level=2) administrative
 * boundaries that existed at a given year, assembles way segments into GeoJSON
 * polygons, and returns a FeatureCollection tagged with:
 *   source: "OHM"
 *   confidence: "high"
 *
 * Limitations:
 *   - Only CE years are supported (OHM Overpass date filtering uses ISO 8601)
 *   - Relations with complex inner/outer member topology may fall back to
 *     bounding-box geometry; these are tagged confidence: "medium"
 *   - Rate-limit: OHM Overpass allows ~180 s per query; large years may time out.
 *
 * Usage (standalone):
 *   node scripts/ohm-fetch.mjs 1700
 *
 * Import in pipeline:
 *   import { fetchOHMForYear } from "./ohm-fetch.mjs";
 */

const OHM_OVERPASS = "https://overpass-api.openhistoricalmap.org/api/interpreter";

// ── Coordinate helpers ─────────────────────────────────────────────────────

function approxEq(a, b) {
  return Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6;
}

/**
 * Chain a list of way-segments (each an array of [lon, lat] nodes) into
 * closed rings.  Returns an array of rings (each ring is an array of [lon,lat]
 * with first === last).
 */
function chainSegments(segments) {
  if (!segments.length) return [];

  const rings  = [];
  // Work on mutable copies
  const pool   = segments.map(s => s.slice());

  while (pool.length) {
    const ring = pool.shift();

    let extended = true;
    while (extended) {
      extended = false;
      for (let i = 0; i < pool.length; i++) {
        const seg    = pool[i];
        const tail   = ring[ring.length - 1];

        if (approxEq(seg[0], tail)) {
          ring.push(...seg.slice(1));
          pool.splice(i, 1);
          extended = true;
          break;
        }
        if (approxEq(seg[seg.length - 1], tail)) {
          ring.push(...seg.slice(0, -1).reverse());
          pool.splice(i, 1);
          extended = true;
          break;
        }
      }
    }

    // Close the ring
    if (!approxEq(ring[0], ring[ring.length - 1])) {
      ring.push(ring[0]);
    }

    if (ring.length >= 4) rings.push(ring);
  }

  return rings;
}

/**
 * Build a GeoJSON Polygon/MultiPolygon geometry from a Overpass relation,
 * using only its "outer" way members.
 * Returns null if geometry cannot be assembled.
 */
function buildGeometry(relation, fallbackToBbox = true) {
  const outerSegs = (relation.members ?? [])
    .filter(m => m.type === "way" && m.role === "outer" && Array.isArray(m.geometry))
    .map(m => m.geometry.map(n => [n.lon, n.lat]));

  if (!outerSegs.length) {
    // Fall back to bounding box if available
    if (!fallbackToBbox || !relation.bounds) return null;
    const { minlat, minlon, maxlat, maxlon } = relation.bounds;
    return {
      type: "Polygon",
      coordinates: [[
        [minlon, minlat], [maxlon, minlat],
        [maxlon, maxlat], [minlon, maxlat],
        [minlon, minlat],
      ]],
      _bboxFallback: true,
    };
  }

  const rings = chainSegments(outerSegs);
  if (!rings.length) return null;

  if (rings.length === 1) {
    return { type: "Polygon", coordinates: [rings[0]] };
  }
  // Multiple outer rings → MultiPolygon (each ring is its own polygon)
  return { type: "MultiPolygon", coordinates: rings.map(r => [r]) };
}

/**
 * Parse an EDTF / ISO 8601 date string (possibly just a year like "1700" or
 * "-500", or full ISO "1700-01-01") into an integer year.
 */
function parseEdtfYear(str) {
  if (!str) return null;
  const m = String(str).match(/^(-?\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Fetch country-level (admin_level=2) administrative features from OHM for a
 * given year.  Returns a GeoJSON FeatureCollection.
 *
 * @param {number} year  CE year only (negative years are skipped — OHM Overpass
 *                       does not reliably support BCE date filtering).
 * @param {object} opts
 * @param {number} opts.timeout  Overpass timeout in seconds (default 120)
 * @param {boolean} opts.verbose  Print progress (default false)
 */
export async function fetchOHMForYear(year, { timeout = 120, verbose = false } = {}) {
  if (year < 1) {
    if (verbose) console.log(`  OHM: Skipping BCE year ${year} (not reliably supported)`);
    return { type: "FeatureCollection", features: [] };
  }

  // ISO 8601 mid-year date for Overpass [date] filter
  const dateStr = `${year}-06-15T00:00:00Z`;

  const query = `[out:json][timeout:${timeout}][date:"${dateStr}"];
(
  relation["boundary"="administrative"]["admin_level"="2"];
);
out geom;`;

  if (verbose) console.log(`  OHM: Querying for year ${year} (${dateStr})…`);

  const res = await fetch(OHM_OVERPASS, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "WorldHistoryAtlas/1.0",
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) {
    throw new Error(`OHM Overpass returned ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const relations = (data.elements ?? []).filter(e => e.type === "relation");

  if (verbose) console.log(`  OHM: Got ${relations.length} admin_level=2 relations`);

  const features = [];

  for (const rel of relations) {
    const tags = rel.tags ?? {};

    // Skip if no useful name
    const name = tags.name || tags["name:en"] || tags.int_name || null;
    if (!name) continue;

    const geom = buildGeometry(rel);
    if (!geom) continue;

    const isBboxFallback = geom._bboxFallback === true;
    if (isBboxFallback) delete geom._bboxFallback;

    const startYear = parseEdtfYear(tags.start_date);
    const endYear   = parseEdtfYear(tags.end_date);

    const sovereign = tags["subject:wikidata"]
      ? (tags["official_name"] || name)
      : (tags.sovereign || name);

    features.push({
      type: "Feature",
      id: `ohm-${rel.id}`,
      properties: {
        id:               `ohm-${rel.id}`,
        name,
        sovereign,
        sovereignColorKey: sovereign.trim().toLowerCase().replace(/\s+/g, " "),
        source:            "OHM",
        confidence:        isBboxFallback ? "medium" : "high",
        precision:         isBboxFallback ? 1 : 2,
        validFrom:         startYear ?? year,
        validTo:           endYear   ?? year + 1,
        wikidataId:        tags.wikidata || null,
        ohmId:             rel.id,
        // Filled downstream (by pipeline or API route)
        _color:   null,
        area:     null,
        rank:     null,
      },
      geometry: geom,
    });
  }

  if (verbose) console.log(`  OHM: ${features.length} features assembled`);

  return { type: "FeatureCollection", features };
}

// ── Standalone CLI ────────────────────────────────────────────────────────

if (process.argv[1] && process.argv[1].endsWith("ohm-fetch.mjs")) {
  const year = parseInt(process.argv[2], 10);
  if (isNaN(year)) {
    console.error("Usage: node scripts/ohm-fetch.mjs <year>");
    process.exit(1);
  }

  console.log(`Fetching OHM data for ${year}…`);
  fetchOHMForYear(year, { verbose: true })
    .then(fc => {
      console.log(`\nResult: ${fc.features.length} features`);
      if (fc.features.length > 0) {
        console.log("Sample:", JSON.stringify(fc.features[0].properties, null, 2));
      }
    })
    .catch(e => { console.error(e); process.exit(1); });
}
