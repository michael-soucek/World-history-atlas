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

/** Tours with a stop that highlights this state (by territory name or map region id). */
export function toursFeaturing(entry: CrosswalkEntry): Tour[] {
  return TOURS.filter((tour) =>
    tour.steps.some((step) => {
      const year = step.mapState.mapYear ?? step.mapState.year;
      if (step.mapState.regionId && [entry.wikidataId, entry.mapRegionId].includes(step.mapState.regionId)) return true;
      return (step.highlight ?? []).some((name) => resolveFeature(name, name, year)?.slug === entry.slug);
    }),
  );
}
