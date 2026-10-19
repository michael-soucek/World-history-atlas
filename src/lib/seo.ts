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
 * in compact title form: "1769–1821", "500 BCE–330 BCE". Single dates and
 * "from/until" forms are returned only when `allowSingle` (events).
 */
export function titleDates(tagline: string | undefined, allowSingle = false): string | undefined {
  const part = tagline?.split(" · ")[1];
  if (!part) return undefined;
  const range = part.match(/^(.+?) – (.+)$/);
  if (range) {
    const [a, b] = [range[1], range[2]];
    // Drop "CE" when both ends are CE: "1769–1821".
    return a.endsWith(" CE") && b.endsWith(" CE") ? `${a.slice(0, -3)}–${b.slice(0, -3)}` : `${a}–${b}`;
  }
  if (!allowSingle) return undefined;
  return part.replace(/^(from|until) /, "").replace(/ CE$/, "");
}

type EntityKind = "place" | "person" | "event" | "culture";

/** What a search for this kind of page is usually after. */
const ENTITY_TITLE_SUFFIX: Record<EntityKind, string> = {
  place: "History & Map",
  person: "Biography & Map",
  event: "History & Map",
  culture: "History & Map",
};

/**
 * Metadata for a place / person / event / culture page, e.g.
 * "Napoleon (1769–1821): Biography & Map — Borders of Time".
 */
export function entityMetadata(
  kind: EntityKind,
  slug: string,
  content: { name: string; summary?: string; tagline?: string; imageUrl?: string },
): Metadata {
  const dates = titleDates(content.tagline, kind === "event");
  const title = `${content.name}${dates ? ` (${dates})` : ""}: ${ENTITY_TITLE_SUFFIX[kind]} — Borders of Time`;
  const description =
    metaDescription(content.summary) ??
    `${content.name} on the interactive history map: when and where it happened, with key facts and pictures.`;
  return {
    ...buildPageMetadata({ title, description, path: `/${kind}/${slug}`, type: "article", imageUrl: content.imageUrl }),
  };
}
