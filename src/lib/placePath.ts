import { lookupByQid, lookupBySlug } from "@/data/crosswalk";
import { lookupCultureByQid } from "@/data/entityCrosswalk";

/**
 * The final URL of a place page. A few crosswalk slugs only redirect: spelling
 * variants (manchu-empire → /place/qing-dynasty) and map peoples that are
 * really culture pages (ancestral-puebloans → /culture/ancestral-puebloans).
 * Linking the final URL saves crawlers (and readers) a redirect hop.
 */
export function placePath(slug: string): string {
  const entry = lookupBySlug(slug);
  if (!entry) return `/place/${slug}`;
  const culture = lookupCultureByQid(entry.wikidataId);
  if (culture) return `/culture/${culture.slug}`;
  return `/place/${lookupByQid(entry.wikidataId)?.slug ?? slug}`;
}
