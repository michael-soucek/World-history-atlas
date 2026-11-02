import type { Metadata } from "next";

export const DEFAULT_SOCIAL_IMAGE = "/og-image.jpg"; // 1200×630, built by scripts/build-brand-assets.mjs

interface PageSeoArgs {
  title: string;
  description: string;
  type?: "website" | "article";
  imageUrl?: string;
  /** This page's own path, e.g. "/era/medieval" — sets the canonical tag. Omit only for pages that intentionally have none (e.g. a 404 fallback). */
  path?: string;
}

/** About what Google shows of a title before cutting it off with "…". */
export const TITLE_MAX = 60;
const BRAND = " — Borders of Time";

/**
 * Adds " — Borders of Time" only when the whole title still fits in the ~60
 * characters Google shows; it prints the site name above each result anyway,
 * so a cut-off brand only crowds out the words people searched for.
 */
export const brandTitle = (core: string) => (core.length + BRAND.length <= TITLE_MAX ? `${core}${BRAND}` : core);

/**
 * The first of several title wordings, most descriptive first, that fits in
 * ~60 characters (else the shortest), branded when there's room. Lets one
 * template serve "Rome" and "Spanish American wars of independence" alike.
 */
export function fitTitle(...candidates: string[]): string {
  const fits = candidates.find((c) => c.length <= TITLE_MAX);
  return brandTitle(fits ?? candidates.reduce((a, b) => (b.length < a.length ? b : a)));
}

export function buildPageMetadata(args: PageSeoArgs): Metadata {
  const imageUrl = args.imageUrl || DEFAULT_SOCIAL_IMAGE;
  return {
    title: args.title,
    description: args.description,
    ...(args.path ? { alternates: { canonical: args.path } } : {}),
    openGraph: {
      title: args.title,
      description: args.description,
      siteName: "Borders of Time",
      type: args.type ?? "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images: [imageUrl],
    },
  };
}

/**
 * Where the last full sentence in `text` ends (index of its full stop), or -1.
 * Skips the stops in initials and abbreviations: "Harry S. Truman",
 * "St. Petersburg", "c. 1200".
 */
function lastSentenceEnd(text: string): number {
  for (let i = text.lastIndexOf(". "); i > 0; i = text.lastIndexOf(". ", i - 1)) {
    const word = text.slice(0, i).split(/[\s(]/).pop() ?? "";
    if (/^((?:[A-Z]\.)*[A-Z]|St|Mt|Dr|Mr|Mrs|Ms|Jr|Sr|c|ca|vs|No|Co|Ft|Gen|Col|Lt|Capt|Rev)$/.test(word)) continue;
    return i;
  }
  return -1;
}

/**
 * Trim text for a meta description (Google shows about 155 characters):
 * end at a full sentence when one fits, otherwise at a word, with "…".
 */
export function metaDescription(text: string | undefined | null, max = 158): string | undefined {
  const t = text?.replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = lastSentenceEnd(cut);
  if (sentence >= 90) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:(—–-]+$/, "").trim() + "…";
}

/**
 * The date part of an entity tagline ("Historical figure · 1769 CE – 1821 CE")
 * in compact title form: "1769–1821", "500–330 BCE". Single dates and
 * "from/until" forms are returned only when `allowSingle` (events).
 */
export function titleDates(tagline: string | undefined, allowSingle = false): string | undefined {
  const part = tagline?.split(" · ")[1];
  if (!part) return undefined;
  const range = part.match(/^(.+?) – (.+)$/);
  if (range) {
    const [a, b] = [range[1], range[2]];
    // A one-year event: "1787", not "1787–1787".
    if (a === b) return a.replace(/ CE$/, "");
    // Drop "CE" when both ends are CE ("1769–1821"); say "BCE" once when both are ("356–323 BCE").
    if (a.endsWith(" CE") && b.endsWith(" CE")) return `${a.slice(0, -3)}–${b.slice(0, -3)}`;
    if (a.endsWith(" BCE") && b.endsWith(" BCE")) return `${a.slice(0, -4)}–${b}`;
    return `${a}–${b}`;
  }
  if (!allowSingle) return undefined;
  return part.replace(/^(from|until) /, "").replace(/ CE$/, "");
}

type EntityKind = "place" | "person" | "event" | "culture";

/** What a search for this kind of page is usually after. */
const ENTITY_TITLE_SUFFIX: Record<EntityKind, string> = {
  place: "Interactive Map & History",
  person: "Biography & Map",
  event: "Map, Timeline & History",
  culture: "History & Map",
};

/** Shorter wordings of the suffix, tried in order when a long name and dates leave no room. */
const SHORTER_SUFFIXES: Record<string, string[]> = {
  "Interactive Map & History": ["Map & History", "History"],
  "Biography & Map": ["Biography"],
  "Map, Timeline & History": ["Map & History", "History"],
  "History & Map": ["History"],
  "Life, Ideas & Works": ["Life & Ideas"],
};

/**
 * A closing sentence for a description too short to fill Google's snippet,
 * saying what else the page has (all of it is on every page of that kind).
 */
const DESCRIPTION_TAIL: Record<EntityKind, string[]> = {
  place: ["Its borders on the map, key dates and history.", "Its borders on the map."],
  person: ["Life, key dates and the map of their world.", "Key dates and a map of their world."],
  event: ["Key dates, the people involved and the map of the time.", "Key dates and the map of the time."],
  culture: ["Key dates, its story and where it flourished on the map.", "Key dates and where it flourished."],
};

/**
 * Adds the first of `tails` that fits to a description too short to fill
 * Google's snippet (a whole sentence that ends early, never a cut-off one).
 */
export function padDescription(description: string, ...tails: string[]): string {
  if (description.length >= 115 || description.endsWith("…")) return description;
  const stop = /[.!?]$/.test(description) ? "" : ".";
  const tail = tails.find((t) => description.length + stop.length + 1 + t.length <= 160);
  return tail ? `${description}${stop} ${tail}` : description;
}

/** A place with no Wikidata image of its own leads with the first vetted article image (see splitHero). */
async function leadImage(qid?: string): Promise<string | undefined> {
  if (!qid) return undefined;
  const { getEntityImages } = await import("@/lib/entityImages");
  return (await getEntityImages(qid))[0]?.thumb;
}

/**
 * Metadata for a place / person / event / culture page, e.g.
 * "Napoleon (1769–1821): Biography & Map — Borders of Time". The description
 * comes from the site's own data (the map measurements for a place, the
 * "in time and on the map" section for the rest) rather than the
 * encyclopedia's first sentence, which made every result look like a copy of
 * Wikipedia's.
 */
export async function entityMetadata(
  kind: EntityKind,
  slug: string,
  content: { name: string; summary?: string; tagline?: string; imageUrl?: string },
): Promise<Metadata> {
  const { placeDescription } = await import("@/lib/placeMaps");
  const { contextDescription, entityContext, fmtSpan, fmtYear, storedFacts } = await import("@/lib/entityContext");
  const { lookupBySlug } = await import("@/data/crosswalk");
  let dates = titleDates(content.tagline, kind === "event");
  // A place's tagline often lacks its dates; the stored Wikidata facts usually have them.
  const qid = kind === "place" ? lookupBySlug(slug)?.wikidataId : undefined;
  if (!dates && qid) {
    const { start, end } = await storedFacts(qid, "place");
    if (start !== undefined && end !== undefined && end >= start) dates = fmtSpan(start, end);
  }
  // Google shows the site name above each result anyway; keep it in the title
  // only when there's room, so the subject and dates aren't what gets cut off.
  // Some article titles already carry their dates, e.g. "Jin dynasty (266–420)".
  const namedWithDates = /\([^)]*\d[^)]*\)\s*$/.test(content.name);
  // People with our own article: its born/died years are checked against the
  // historians' consensus (Wikidata often has a single disputed year), and a
  // "~" marks them as approximate.
  if (kind === "person") {
    const { getOurArticle: ourArticle } = await import("@/lib/ourArticles");
    const meta = ourArticle("person", slug)?.meta;
    const yr = (v?: string) => (v && /^~?-?\d+$/.test(v) ? Number(v.replace("~", "")) : undefined);
    const born = yr(meta?.born);
    const died = yr(meta?.died);
    if (born !== undefined && died !== undefined && died >= born) {
      const approx = meta!.born.startsWith("~") || meta!.died.startsWith("~");
      dates = `${approx ? "c. " : ""}${fmtSpan(born, died)}`;
    } else if (meta?.wikidata && (born !== undefined || died !== undefined)) {
      // Only one year is known (a pharaoh's birth, say): show that alone rather
      // than pair it with a guessed year from Wikidata.
      const one = (v: string, y: number, word: string) => `${word} ${v.startsWith("~") ? "c. " : ""}${fmtYear(y)}`;
      dates = died !== undefined ? one(meta.died, died, "d.") : one(meta!.born, born!, "b.");
    }
  }
  // Philosophers are searched for their ideas, not a map.
  const { PHILOSOPHER_SLUGS } = await import("@/data/philosophy");
  const suffix = kind === "person" && PHILOSOPHER_SLUGS.has(slug) ? "Life, Ideas & Works" : ENTITY_TITLE_SUFFIX[kind];
  const head = `${content.name}${dates && !namedWithDates ? ` (${dates})` : ""}`;
  const title = fitTitle(...[suffix, ...(SHORTER_SUFFIXES[suffix] ?? [])].map((s) => `${head}: ${s}`));
  const ctx = kind === "place" ? null : await entityContext(kind, slug);
  const own = kind === "place" ? placeDescription(slug, content.name, dates) : ctx ? contextDescription(ctx) : undefined;
  // Next best: the opening of the page's own article, before the encyclopedia's summary.
  const { articleIntro, getOurArticle } = await import("@/lib/ourArticles");
  // People, events and cultures: our own article's opening says what they
  // were far better than the encyclopedia's one-line label ("aspect of
  // history") plus a list of contemporaries; for people the dates are worked
  // in after the name.
  const intro = kind !== "place" ? articleIntro(getOurArticle(kind, slug)) : undefined;
  const personIntro =
    intro && dates && !namedWithDates && new RegExp(`^${content.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} (was|is|had|became|ruled)\\b`).test(intro)
      ? `${content.name} (${dates})${intro.slice(content.name.length)}`
      : intro;
  const raw =
    metaDescription(personIntro) ??
    metaDescription(own) ??
    metaDescription(articleIntro(getOurArticle(kind, slug))) ??
    metaDescription(content.summary) ??
    `${content.name} on the interactive history map: when and where it happened, with key facts and pictures.`;
  const description = padDescription(raw, ...DESCRIPTION_TAIL[kind]);
  // Hand-written search snippet from the article's frontmatter ("title:" and
  // "description:"), for pages where the generated one isn't getting clicks.
  const custom = getOurArticle(kind, slug)?.meta;
  return {
    ...buildPageMetadata({
      title: custom?.title ? brandTitle(custom.title) : title,
      description: custom?.description ?? description,
      path: `/${kind}/${slug}`, type: "article", imageUrl: content.imageUrl ?? (await leadImage(qid)) }),
  };
}
