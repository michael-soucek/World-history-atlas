/**
 * Cross-links from an empire's page to the rest of the site: the cities it
 * held (from the "Who ruled it?" data) and the guided tours that highlight
 * it. Both indexes are built once, on first use.
 */
import { CITY_LIST, rulersOf, type City } from "@/lib/cityHistory";
import { resolveFeature } from "@/data/crosswalk";
import { TOURS, type Tour } from "@/data/tours";
import type { CrosswalkEntry } from "@/types";

let cityIndex: Map<string, City[]> | null = null;

/** Cities whose timeline links to /place/{slug}, alphabetically. */
export function citiesHeldBy(slug: string): City[] {
  if (!cityIndex) {
    cityIndex = new Map();
    for (const city of CITY_LIST) {
      const held = new Set(rulersOf(city.slug).flatMap((s) => (s.href ? [s.href] : [])));
      for (const href of held) {
        const key = href.replace("/place/", "");
        cityIndex.set(key, [...(cityIndex.get(key) ?? []), city]);
      }
    }
  }
  return cityIndex.get(slug) ?? [];
}

/**
 * Tours with a stop that highlights this state (by territory name or map
 * region id), or, in the war tours, shades it as one side's own territory.
 */
export function toursFeaturing(entry: CrosswalkEntry): Tour[] {
  return TOURS.filter((tour) =>
    tour.steps.some((step) => {
      const year = step.mapState.mapYear ?? step.mapState.year;
      if (step.mapState.regionId && [entry.wikidataId, entry.mapRegionId].includes(step.mapState.regionId)) return true;
      if ((step.highlight ?? []).some((name) => resolveFeature(name, name, year)?.slug === entry.slug)) return true;
      const zoneNames = (step.zones ?? []).filter((z) => !z.occupied).flatMap((z) => z.countries ?? []);
      return !!tour.zoneYear && zoneNames.some((name) => resolveFeature(name, name, tour.zoneYear!)?.slug === entry.slug);
    }),
  );
}

/** Map tours of an event, for the event's page (the world wars and their parts). */
const EVENT_TOURS: Record<string, string[]> = {
  "world-war-i": ["first-world-war"],
  "russian-revolution": ["first-world-war"],
  "world-war-ii": ["second-world-war-europe", "second-world-war-pacific"],
  holocaust: ["second-world-war-europe"],
};

export function toursOfEvent(slug: string): Tour[] {
  return (EVENT_TOURS[slug] ?? []).flatMap((s) => TOURS.filter((t) => t.slug === s));
}
