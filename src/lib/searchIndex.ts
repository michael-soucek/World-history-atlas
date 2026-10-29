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
  /** Overrides the type label shown beside the result ("Country", "Philosophy"). */
  label?: string;
  /** Other names people search by ("Captain Cook", "Constantinople"). */
  aliases?: string[];
}

/** Lowercase, accents stripped, punctuation to spaces: "Zhèng Hé's" → "zheng he s". */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Titles and filler people type but names don't carry: "Captain Cook" is
 * James Cook, "King Henry VIII" is Henry VIII. Dropped from the query unless
 * they're all it has.
 */
const SKIP = new Set([
  "the", "of", "a", "an", "and", "captain", "capt", "king", "queen", "emperor", "empress",
  "sir", "saint", "st", "pope", "prince", "princess", "president", "general", "admiral",
  "lord", "lady", "tsar", "czar", "sultan", "pharaoh", "dr",
]);

/** How well one item matches, 0 for not at all. Every query word must start a word in the item. */
function score(item: SearchItem, words: string[], phrase: string): number {
  const name = normalize(item.name);
  const extra = normalize([item.tagline, ...(item.aliases ?? []), item.slug.replace(/-/g, " ")].join(" "));
  const nameWords = name.split(" ");
  const allWords = nameWords.concat(extra.split(" "));
  if (!words.every((w) => allWords.some((x) => x.startsWith(w)))) return 0;
  if (name === phrase) return 100;
  if (name.startsWith(phrase)) return 80;
  if (words.every((w) => nameWords.some((x) => x.startsWith(w)))) return 60;
  return 20;
}

/** Best matches first, alphabetical within a tier. */
export function searchItems(items: readonly SearchItem[], query: string, limit = 50): SearchItem[] {
  const phrase = normalize(query);
  if (!phrase) return items.slice(0, limit);
  const all = phrase.split(" ");
  const words = all.filter((w) => !SKIP.has(w));
  const use = words.length ? words : all;
  let scored = items.map((item) => ({ item, s: score(item, use, use.join(" ")) })).filter((r) => r.s > 0);
  // Nothing has every word ("Napoleon Bonaparte" vs "Napoleon"): take items with any of them.
  if (!scored.length && use.length > 1) {
    scored = items
      .map((item) => ({ item, s: use.reduce((n, w) => n + (score(item, [w], w) && w.length > 2 ? 1 : 0), 0) }))
      .filter((r) => r.s > 0);
  }
  return scored
    .sort((a, b) => b.s - a.s || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map((r) => r.item);
}

/** Where a result links: "/person/julius-caesar", or "/world-wars" for a section page. */
export const itemHref = (item: SearchItem) => (item.slug ? `/${item.route}/${item.slug}` : `/${item.route}`);
