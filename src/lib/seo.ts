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

/**
 * Adds " — Borders of Time" only when the title still fits in the ~60
 * characters Google shows; it prints the site name above each result anyway.
 */
export const brandTitle = (core: string) => (core.length <= 52 ? `${core} — Borders of Time` : core);

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
 * Trim text for a meta description (Google shows about 155 characters):
 * end at a full sentence when one fits, otherwise at a word, with "…".
 */
export function metaDescription(text: string | undefined | null, max = 158): string | undefined {
  const t = text?.replace(/\s+/g, " ").trim();
  if (!t) return undefined;
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
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
  const { contextDescription, entityContext, fmtSpan, storedFacts } = await import("@/lib/entityContext");
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
    }
  }
  // Philosophers are searched for their ideas, not a map.
  const { PHILOSOPHER_SLUGS } = await import("@/data/philosophy");
  const suffix = kind === "person" && PHILOSOPHER_SLUGS.has(slug) ? "Life, Ideas & Works" : ENTITY_TITLE_SUFFIX[kind];
  const core = `${content.name}${dates && !namedWithDates ? ` (${dates})` : ""}: ${suffix}`;
  const title = core.length <= 52 ? `${core} — Borders of Time` : core;
  const ctx = kind === "place" ? null : await entityContext(kind, slug);
  const own = kind === "place" ? placeDescription(slug, content.name, dates) : ctx ? contextDescription(ctx) : undefined;
  // Next best: the opening of the page's own article, before the encyclopedia's summary.
  const { articleIntro, getOurArticle } = await import("@/lib/ourArticles");
  // People: our own article's opening says who they were far better than a
  // list of contemporaries, with the dates worked in after the name.
  const intro = kind === "person" ? articleIntro(getOurArticle(kind, slug)) : undefined;
  const personIntro =
    intro && dates && !namedWithDates && new RegExp(`^${content.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} (was|is|had|became|ruled)\\b`).test(intro)
      ? `${content.name} (${dates})${intro.slice(content.name.length)}`
      : intro;
  const description =
    metaDescription(personIntro) ??
    metaDescription(own) ??
    metaDescription(articleIntro(getOurArticle(kind, slug))) ??
    metaDescription(content.summary) ??
    `${content.name} on the interactive history map: when and where it happened, with key facts and pictures.`;
  return {
    ...buildPageMetadata({ title, description, path: `/${kind}/${slug}`, type: "article", imageUrl: content.imageUrl ?? (await leadImage(qid)) }),
  };
}
