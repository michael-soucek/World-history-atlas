import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PEOPLE_CROSSWALK } from "@/data/entityCrosswalk";

/**
 * The site's own articles, one Markdown file per page in
 * content/articles/{place|person|event|culture|explorer|country|philosophy}/{slug}.md:
 *
 *   ---
 *   sources:
 *     - Label | https://…
 *   written: 2026-10-22
 *   ---
 *   Paragraphs separated by blank lines. "## Heading" starts a section.
 *   Links: [text](/place/slug) or [text](https://…).
 *
 * Read at build time; pages without a file simply don't show one.
 */
export type ArticleBlock = { kind: "h2"; text: string } | { kind: "p"; text: string };
export interface OurArticle {
  blocks: ArticleBlock[];
  sources: { label: string; href: string }[];
  written?: string;
  /** Simple "key: value" frontmatter fields (name, wikidata, born, died, roles…). */
  meta: Record<string, string>;
  /** Country articles: key dates, "  - 1291: Text." lines under `timeline:`. */
  timeline: { year: string; text: string }[];
}

export type ArticleKind = "place" | "person" | "event" | "culture" | "explorer" | "country" | "philosophy";

const DIR = join(process.cwd(), "content/articles");

/**
 * Links to person, country and philosophy pages that don't exist yet (their
 * article hasn't been written, or the person isn't registered) show as plain
 * text, so pages can go live in stages without dead links.
 */
function linkTargetExists(href: string): boolean {
  const m = href.match(/^\/(person|country|philosophy)\/([a-z0-9-]+)$/);
  if (!m) return true;
  const [, kind, slug] = m;
  if (kind === "person") return Object.values(PEOPLE_CROSSWALK).some((e) => e.slug === slug);
  return existsSync(join(DIR, kind, `${slug}.md`));
}
const dropDeadLinks = (text: string) =>
  text.replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, (whole, label: string, href: string) => (linkTargetExists(href) ? whole : label));

export function getOurArticle(kind: ArticleKind, slug: string): OurArticle | null {
  const path = join(DIR, kind, `${slug}.md`);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const head = fm?.[1] ?? "";
  const body = fm ? raw.slice(fm[0].length) : raw;
  const sources = [...head.matchAll(/^\s*-\s*(.+?)\s*\|\s*(\S+)\s*$/gm)].map((m) => ({ label: m[1], href: m[2] }));
  const written = head.match(/^written:\s*(\S+)/m)?.[1];
  const meta = Object.fromEntries([...head.matchAll(/^([a-z]+):[ \t]*(\S.*?)\s*$/gm)].map((m) => [m[1], m[2]]));
  const tl = head.match(/^timeline:\n((?:[ \t]+-.*\n?)+)/m)?.[1] ?? "";
  const timeline = [...tl.matchAll(/^[ \t]+-\s*(~?-?\d+)\s*:\s*(.+?)\s*$/gm)].map((m) => ({ year: m[1], text: m[2] }));
  const blocks: ArticleBlock[] = body
    .split(/\n{2,}/)
    .map((b) => dropDeadLinks(b.trim().replace(/\s*\n\s*/g, " ")))
    .filter(Boolean)
    .map((b) => (b.startsWith("## ") ? { kind: "h2" as const, text: b.slice(3).trim() } : { kind: "p" as const, text: b }));
  return blocks.length ? { blocks, sources, written, meta, timeline } : null;
}

/** Markdown links reduced to their text: "[Rome](/place/rome)" → "Rome". */
const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/** The article's opening paragraph as plain text, for search snippets and previews. */
export function articleIntro(article: OurArticle | null): string | undefined {
  const p = article?.blocks.find((b) => b.kind === "p");
  return p ? plain(p.text) : undefined;
}

export function articleWordCount(article: OurArticle): number {
  return article.blocks.reduce((n, b) => n + plain(b.text).split(/\s+/).filter(Boolean).length, 0);
}
