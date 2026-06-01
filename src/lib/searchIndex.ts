import type { EntityType } from "@/types";

/** A single item in the static search index. */
export interface SearchItem {
  slug: string;
  name: string;
  entityType: EntityType;
  wikidataId: string;
  /** Short descriptor used in search results */
  tagline?: string;
  /** Route prefix: /place, /person, etc. */
  route: string;
}
