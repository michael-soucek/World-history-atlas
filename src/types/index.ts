// ---------------------------------------------------------------------------
// Core data model for World History Atlas
// ---------------------------------------------------------------------------

/** A territory/polity as it existed during a specific period. */
interface HistoricalFeature {
  type: "Feature";
  /** Stable unique id: "{NAME}__{validFrom}" */
  id: string;
  properties: HistoricalFeatureProperties;
  geometry: GeoJSON.Geometry;
}

interface HistoricalFeatureProperties {
  /** Feature id */
  id: string;
  /** Territory name (from historical-basemaps NAME field) */
  name: string;
  /** Sovereign / ruling power (from SUBJECTO field) */
  sovereign: string;
  /** Broader entity this belongs to (from PARTOF field) */
  partOf?: string;
  /** First year this snapshot is valid (inclusive) */
  validFrom: number;
  /** Last year this snapshot is valid (exclusive — use next snapshot year) */
  validTo: number;
  /** 1 = approximate, 2 = estimated, 3 = legally/historically defined */
  precision: 1 | 2 | 3;
  /** Wikidata Q-ID resolved from the crosswalk */
  wikidataId?: string;
  /** Slug for /place/ URL, derived from wikidataId crosswalk */
  slug?: string;
  /** Pre-computed fill color keyed by sovereign (stable across years) */
  color?: string;
  /** Pre-computed line/border color */
  lineColor?: string;
}

interface HistoricalFeatureCollection {
  type: "FeatureCollection";
  snapshotYear: number;
  features: HistoricalFeature[];
}

// ---------------------------------------------------------------------------
// Crosswalk entry — maps a canonical name to a Wikidata Q-ID and URL slug
// ---------------------------------------------------------------------------
export interface CrosswalkEntry {
  wikidataId: string;
  slug: string;
  /** Alternative name spellings that should map to the same entry */
  aliases?: string[];
}

// ---------------------------------------------------------------------------
// Content fetched from Wikipedia / Wikidata for the story panel
// ---------------------------------------------------------------------------
export type EntityType = "place" | "person" | "event" | "culture";

/** A key fact with optional source URL, for the key-facts sidebar. */
export interface KeyFact {
  label: string;
  value: string;
  url?: string;
}

/** A curated Wikipedia article section (heading + plain-text excerpt). */
export interface WikiSection {
  heading: string;
  content: string;
}

export interface PlaceContent {
  wikidataId: string;
  entityType?: EntityType;
  name: string;
  summary: string;
  /** Short descriptor, e.g. "Empire · 550 BCE – 330 BCE" */
  tagline?: string;
  keyFacts?: KeyFact[];
  imageUrl?: string;
  imageLicense?: string;
  imageAuthor?: string;
  imageSourceUrl?: string;
  imageCaption?: string;
  wikipediaUrl?: string;
  /** Representative year for "See on the map" link */
  representativeYear?: number;
  /** Curated Wikipedia article sections (Origins, History, Legacy, etc.) */
  sections?: WikiSection[];
  /**
   * Set to true when the resolved Wikidata label doesn't match the expected
   * entity name. The page should show a graceful fallback instead of
   * potentially wrong content.
   */
  labelMismatch?: boolean;
}

// ---------------------------------------------------------------------------
// Atlas URL/view state (synced with ?query params)
// ---------------------------------------------------------------------------
export interface AtlasViewState {
  year: number;
  lat: number;
  lng: number;
  zoom: number;
  /** Wikidata Q-ID of the selected region (from ?region= param) */
  selectedWikidataId?: string;
  /** Raw NAME of the selected region (from the clicked feature) */
  selectedName?: string;
  /** Sovereign of the selected region */
  selectedSovereign?: string;
}

// ---------------------------------------------------------------------------
// Era metadata for the slider
// ---------------------------------------------------------------------------
export interface Era {
  label: string;
  start: number; // inclusive
  end: number;   // exclusive
  blurb?: string;
}
