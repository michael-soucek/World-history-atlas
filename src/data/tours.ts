import type { EntityType } from "@/types";
import { WAR_TOURS } from "@/data/warTours";
import { CLASSIC_TOURS, EVENT_TOURS, MOVEMENT_TOURS, NEW_TOURS } from "@/data/newTours";

export interface TourMapState {
  /** The year shown on the map, and the borders drawn unless mapYear says otherwise. */
  year: number;
  /**
   * Draw this year's borders instead. For when the nearest earlier snapshot
   * is misleading: e.g. the 900 data still places the Magyars in Ukraine, so
   * stops from 900 to 955 draw the 1000 borders, which match the story.
   */
  mapYear?: number;
  lat: number;
  lng: number;
  zoom: number;
  regionId?: string; // Wikidata Q-ID to highlight
}

/**
 * What an arrow on the tour map stands for. Each kind has its own colour and
 * line style (see ROUTE_STYLE in src/lib/tourRoutes.ts), and the legend
 * beside the narration explains them.
 */
export type RouteKind =
  | "migration" // a people moving and resettling
  | "forced" // people moved against their will (the slave trade, deportations)
  | "raid" // armed expeditions that came back
  | "conquest" // armies taking and holding land
  | "voyage" // journeys by sea
  | "spread" // ideas, inventions or movements spreading
  | "plague" // the spread of a disease
  | "retreat"; // an army or people pulling back

/** An arrow drawn on the map for one tour stop. */
export interface TourRoute {
  /** Shown in the legend and along the line, e.g. "Pecheneg attack, 895". */
  label: string;
  kind: RouteKind;
  /** Waypoints as [longitude, latitude], from start to arrowhead. Drawn as a smooth curve. */
  path: [number, number][];
}

/** A labelled point on the map: a battle, city or settlement. */
export interface TourMarker {
  label: string;
  /** [longitude, latitude] */
  at: [number, number];
  /** Battles get a crossed-swords symbol; everything else a dot. */
  kind?: "battle" | "place";
}

/** One side in a war, for tours that shade who holds what (see TourZone). */
export interface TourSide {
  key: string;
  /** Shown in the legend, e.g. "Axis and allies". */
  name: string;
  color: string;
}

/**
 * Territory one side holds at a stop. The shapes are worked out ahead of time
 * by scripts/build-war-zones.mts from the tour's `zoneYear` snapshot, so
 * coastlines and borders match the map: `countries` take whole snapshot
 * shapes, `area` is a rough hand-drawn outline (a front line, usually)
 * trimmed to land, or to `within` when given. Zones are claimed in order:
 * a zone never covers ground an earlier zone at the same stop already took.
 */
export interface TourZone {
  side: string;
  /** Held by force outside the side's own pre-war borders: drawn hatched. */
  occupied?: boolean;
  /** A name drawn on the map, e.g. "Vichy France". */
  label?: string;
  countries?: string[];
  area?: [number, number][];
  within?: string[];
  /** Holes cut out of the zone, e.g. a besieged city still holding out. */
  minus?: [number, number][][];
}

export interface TourStep {
  title: string;
  /** A finer date than the year, e.g. "June 1941", shown with the stop. */
  date?: string;
  text: string;
  /** Optional Wikimedia Commons image URL */
  imageUrl?: string;
  imageCaption?: string;
  mapState: TourMapState;
  /** Arrows for this stop: migrations, raids, voyages, spreading ideas. */
  routes?: TourRoute[];
  /** Labelled points for this stop. */
  markers?: TourMarker[];
  /**
   * Territories to highlight, by their exact name in the map snapshot for
   * this year (e.g. "Magyars", "Khanate of the Golden Horde"). Safer than
   * regionId, which some snapshot shapes lack or have wrong.
   */
  highlight?: string[];
  /** Who holds what at this stop, for war tours (needs the tour's `sides`). */
  zones?: TourZone[];
  /** "Did you know?": one surprising, sourced detail about this stop, in a sentence or two. */
  fact?: string;
  /** The people at this stop, as /person page slugs. */
  people?: string[];
  /**
   * Pages to read next, as site paths ("/event/battle-of-hastings", "/site/colosseum",
   * "/place/mali-empire", "/history-of/rome", "/culture/vikings", "/country/egypt").
   * The first one with a picture gives the stop its image.
   */
  readMore?: string[];
  /** false when none of the stop's pages has a picture that fits it. */
  image?: false;
}

export interface Tour {
  slug: string;
  title: string;
  description: string;
  /** Approximate duration in minutes */
  duration: number;
  difficulty: "intro" | "standard" | "deep-dive";
  entityType?: EntityType;
  /** Cover image (Wikimedia Commons) */
  coverImageUrl?: string;
  /** Keep earlier stops' arrows on the map, faded, so a long journey builds up. */
  trail?: boolean;
  /** The sides in a war tour, for the territory shading and its legend. */
  sides?: TourSide[];
  /** The snapshot whose country names and coastlines the zones are cut from. */
  zoneYear?: number;
  steps: TourStep[];
}

export const TOURS: Tour[] = [...CLASSIC_TOURS];

/** Look up a tour by slug. */
// Tours with migration and campaign arrows live in movementTours.ts.
TOURS.push(...MOVEMENT_TOURS, ...EVENT_TOURS, ...WAR_TOURS, ...NEW_TOURS);

export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find(t => t.slug === slug);
}
