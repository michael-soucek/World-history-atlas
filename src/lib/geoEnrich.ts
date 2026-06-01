/**
 * Server-side geometry enrichment utilities.
 * Used by API routes and the build-time pipeline.
 */

import { getSovereignColor } from "@/data/sovereignColors";
import { resolveFeature } from "@/data/crosswalk";

// ── Raw upstream property shape ────────────────────────────────────────────

export interface RawProperties {
  NAME?: string;
  ABBREVN?: string;
  SUBJECTO?: string;
  PARTOF?: string;
  BORDERPRECISION?: number;
  [key: string]: unknown;
}

// ── Enriched output shapes ─────────────────────────────────────────────────

export type ConfidenceLevel = "high" | "medium" | "low";

export interface EnrichedBorderProperties {
  id: string;
  name: string;
  sovereign: string;
  sovereignColorKey: string;
  _color: string;
  precision: 1 | 2 | 3;
  validFrom: number;
  validTo: number;
  area: number;
  rank: number;
  /** Data-provenance source identifier */
  source: string;
  /** How reliable/documented this border is */
  confidence: ConfidenceLevel;
  wikidataId?: string;
  slug?: string;
}

// ── Internal helpers ───────────────────────────────────────────────────────

function clampPrecision(v: number | undefined): 1 | 2 | 3 {
  if (v === 1 || v === 2 || v === 3) return v;
  return 1;
}

function ringArea(ring: number[][]): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a) / 2;
}

/** Approximate area in square degrees (good enough for rank comparison). */
export function geometryArea(geom: unknown): number {
  if (!geom || typeof geom !== "object") return 0;
  const g = geom as { type: string; coordinates: unknown };
  if (g.type === "Polygon") {
    return (g.coordinates as number[][][]).reduce((s, r) => s + ringArea(r), 0);
  }
  if (g.type === "MultiPolygon") {
    return (g.coordinates as number[][][][]).reduce(
      (s, p) => s + p.reduce((ss, r) => ss + ringArea(r), 0),
      0
    );
  }
  return 0;
}

/**
 * Stable 8-hex-digit ID derived from snapshot year + feature name.
 * Same inputs always produce the same ID (FNV-1a).
 */
export function stableId(year: number, name: string): string {
  const str = `${year}::${name}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/** Normalise a sovereign name to a stable, case-folded color key. */
export function normaliseSovereign(s: string | undefined): string {
  return (s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

// ── Main enrichment function ───────────────────────────────────────────────

/**
 * Enrich raw GeoJSON feature properties with:
 *  - stable ID, normalised sovereign key, sovereign color
 *  - border precision (1–3)
 *  - approximate area + log10-based rank (0–8)
 *  - Wikidata ID + slug from the crosswalk table (if known)
 */
/** Derive a confidence level from border precision for the historical-basemaps source. */
function precisionToConfidence(p: 1 | 2 | 3): ConfidenceLevel {
  if (p === 3) return "high";
  if (p === 2) return "medium";
  return "low";
}

/**
 * Enrich raw GeoJSON feature properties.
 *
 * @param sourceOverride  Override the default "historical-basemaps" source tag.
 * @param confidenceOverride  Override the precision-derived confidence level.
 */
export function enrichBorderProps(
  rawProps: RawProperties,
  geometry: unknown,
  snapshotYear: number,
  validTo: number,
  sourceOverride?: string,
  confidenceOverride?: ConfidenceLevel
): EnrichedBorderProperties {
  const name = rawProps.NAME ?? "Unknown";
  const sovereign = rawProps.SUBJECTO || name;
  const sovereignColorKey = normaliseSovereign(sovereign);
  const precision = clampPrecision(rawProps.BORDERPRECISION);
  const area = geometryArea(geometry);
  const rank = area > 0 ? Math.min(8, Math.floor(Math.log10(area * 1000))) : 0;
  const crosswalkEntry = resolveFeature(name, sovereign);
  const source = sourceOverride ?? "historical-basemaps";
  const confidence = confidenceOverride ?? precisionToConfidence(precision);

  return {
    id: stableId(snapshotYear, name),
    name,
    sovereign,
    sovereignColorKey,
    _color: getSovereignColor(sovereignColorKey),
    precision,
    validFrom: snapshotYear,
    validTo,
    area,
    rank,
    source,
    confidence,
    wikidataId: crosswalkEntry?.wikidataId,
    slug: crosswalkEntry?.slug,
  };
}
