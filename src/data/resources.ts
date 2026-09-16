/**
 * Curated "further reading & viewing" suggestions shown alongside people,
 * places, cultures, tours, and explorers. This is where affiliate revenue
 * (Amazon Associates, Bookshop.org, museum ticket partners, etc.) would
 * eventually live — but every `affiliateUrl` below is deliberately left
 * `undefined`. Nothing here links to a real storefront yet.
 *
 * The titles and creators are real, well-known, reputable works — genuine
 * further-reading suggestions, not placeholder text — so this file is a
 * legitimate starting point for content, not just a demo. Only the *monetized
 * link* is a placeholder.
 *
 * TODO before enabling affiliate revenue: sign up for the relevant program
 * (Amazon Associates, Bookshop.org affiliates, a museum's ticketing partner
 * program, etc.), then fill in `affiliateUrl` for each entry you want live.
 * `ResourceCard` automatically turns an entry into a real, disclosed link the
 * moment `affiliateUrl` is set — no other code changes needed.
 *
 * Keys are `"<entityType>:<slug>"` for person/place/event/culture pages
 * (matching EntityPage's `entityType`/`entry.slug`), or `"tour:<slug>"` /
 * `"explorer:<slug>"`. A key with no entry here simply shows nothing.
 */

export type ResourceType = "book" | "documentary" | "museum" | "course";

export interface Resource {
  type: ResourceType;
  title: string;
  /** Author, director, or institution. */
  creator?: string;
  blurb: string;
  /** Left undefined = placeholder. See the file-level TODO above. */
  affiliateUrl?: string;
}

export const RESOURCES: Record<string, Resource[]> = {
  "person:genghis-khan": [
    {
      type: "book",
      title: "Genghis Khan and the Making of the Modern World",
      creator: "Jack Weatherford",
      blurb:
        "The book credited with rehabilitating Genghis Khan's reputation in the West — argues the Mongol Empire quietly shaped trade, law, and communication across Eurasia.",
    },
    {
      type: "documentary",
      title: "Genghis Khan (Netflix docudrama, 2023)",
      blurb: "A dramatized retelling of the Mongol founder's rise, framed with historian commentary.",
    },
  ],
  "person:alexander-the-great": [
    {
      type: "book",
      title: "Alexander the Great",
      creator: "Robin Lane Fox",
      blurb:
        "A classic, deeply researched biography that reconstructs the campaigns from Macedon to the Indus using the surviving ancient sources.",
    },
  ],
  "place:roman-empire": [
    {
      type: "book",
      title: "SPQR: A History of Ancient Rome",
      creator: "Mary Beard",
      blurb:
        "A leading Cambridge classicist's account of Rome's first thousand years — as much about how we know what we know as about the events themselves.",
    },
    {
      type: "museum",
      title: "Colosseum & Roman Forum tickets",
      creator: "Parco Archeologico del Colosseo",
      blurb: "Skip-the-line entry to the Colosseum, Roman Forum, and Palatine Hill in Rome.",
    },
  ],
  "culture:ancient-egypt": [
    {
      type: "book",
      title: "The Rise and Fall of Ancient Egypt",
      creator: "Toby Wilkinson",
      blurb:
        "A single-volume narrative history spanning three thousand years of pharaonic Egypt, from unification to Cleopatra.",
    },
  ],
  "tour:mongol-world-conquest": [
    {
      type: "book",
      title: "Genghis Khan and the Making of the Modern World",
      creator: "Jack Weatherford",
      blurb: "Background reading for this tour's route across the Mongol conquests.",
    },
  ],
  "explorer:james-cook": [
    {
      type: "book",
      title: "Blue Latitudes: Boldly Going Where Captain Cook Has Gone Before",
      creator: "Tony Horwitz",
      blurb:
        "A journalist retraces Cook's three Pacific voyages in the present day, alternating with the 18th-century original.",
    },
  ],
};

/** All suggestions for a given key, or an empty array if none are curated yet. */
export function getResources(key: string): Resource[] {
  return RESOURCES[key] ?? [];
}
