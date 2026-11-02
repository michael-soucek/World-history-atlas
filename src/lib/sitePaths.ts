import { getCanonicalNameByQid, lookupBySlug } from "@/data/crosswalk";
import { CULTURES_CROSSWALK, EVENTS_CROSSWALK, PEOPLE_CROSSWALK } from "@/data/entityCrosswalk";
import { getSite } from "@/lib/siteHistory";
import { getCity } from "@/lib/cityHistory";
import { getCountry } from "@/lib/countries";

/** slug → [name, QID] for one of the entity crosswalks. */
const bySlug = (table: Record<string, { slug: string; wikidataId: string }>) =>
  new Map(Object.entries(table).map(([name, e]) => [e.slug, [name, e.wikidataId] as const]));
const PEOPLE = bySlug(PEOPLE_CROSSWALK);
const EVENTS = bySlug(EVENTS_CROSSWALK);
const CULTURES = bySlug(CULTURES_CROSSWALK);

/** A site path's display name and the key its images are stored under; null if no such page. */
export function resolvePath(path: string): { label: string; imageKey?: string } | null {
  const [, kind, slug] = path.split("/");
  const entity = (m: typeof PEOPLE) => {
    const e = m.get(slug);
    return e ? { label: e[0], imageKey: e[1] } : null;
  };
  switch (kind) {
    case "person": return entity(PEOPLE);
    case "event": return entity(EVENTS);
    case "culture": return entity(CULTURES);
    case "place": {
      const e = lookupBySlug(slug);
      return e ? { label: getCanonicalNameByQid(e.wikidataId) ?? slug, imageKey: e.wikidataId } : null;
    }
    case "site": {
      const s = getSite(slug);
      return s ? { label: s.name, imageKey: s.wikidataId } : null;
    }
    case "history-of": {
      const c = getCity(slug);
      return c ? { label: c.name, imageKey: `city:${slug}` } : null;
    }
    case "country": {
      const c = getCountry(slug);
      return c ? { label: c.name } : null;
    }
    default: return null;
  }
}
