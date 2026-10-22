import "server-only";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The site's own articles, one Markdown file per page in
 * content/articles/{place|person|event|culture}/{slug}.md:
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
}

const DIR = join(process.cwd(), "content/articles");

export function getOurArticle(kind: "place" | "person" | "event" | "culture" | "explorer", slug: string): OurArticle | null {
  const path = join(DIR, kind, `${slug}.md`);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const head = fm?.[1] ?? "";
  const body = fm ? raw.slice(fm[0].length) : raw;
  const sources = [...head.matchAll(/^\s*-\s*(.+?)\s*\|\s*(\S+)\s*$/gm)].map((m) => ({ label: m[1], href: m[2] }));
  const written = head.match(/^written:\s*(\S+)/m)?.[1];
  const blocks: ArticleBlock[] = body
    .split(/\n{2,}/)
    .map((b) => b.trim().replace(/\s*\n\s*/g, " "))
    .filter(Boolean)
    .map((b) => (b.startsWith("## ") ? { kind: "h2" as const, text: b.slice(3).trim() } : { kind: "p" as const, text: b }));
  return blocks.length ? { blocks, sources, written } : null;
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
