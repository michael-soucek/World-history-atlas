import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { readableNameFromSlug } from "@/lib/entityResolver";
import type { ArticleKind } from "@/lib/ourArticles";
import { PHILOSOPHER_SLUGS } from "@/data/philosophy";

/**
 * Which of the site's own articles link to a page: "mentioned in" lists on
 * country and philosophy pages, so links run both ways.
 */
export interface Backlink {
  kind: ArticleKind;
  slug: string;
  href: string;
  name: string;
  /** Person articles' birth year, for ordering philosophers. */
  born?: number;
  /** The first /philosophy/… page the article links: a philosopher's own era. */
  era?: string;
}

const DIR = join(process.cwd(), "content/articles");

const placeNames = new Map(Object.entries(CROSSWALK).map(([name, e]) => [e.slug, name]));
const entityNames = new Map(
  [...Object.values(PEOPLE_CROSSWALK), ...Object.values(EVENTS_CROSSWALK), ...Object.values(CULTURES_CROSSWALK)].flatMap((e) =>
    e.name ? [[e.slug, e.name] as const] : [],
  ),
);

function nameOf(kind: ArticleKind, slug: string, head: string): string {
  const own = head.match(/^name:\s*(.+?)\s*$/m)?.[1];
  if (own) return own;
  if (kind === "place" && placeNames.has(slug)) return placeNames.get(slug)!;
  return entityNames.get(slug) ?? readableNameFromSlug(slug);
}

/** "~-570" → -570 */
const year = (v?: string) => (v ? Number(v.replace("~", "")) : undefined);

/** target path ("/country/italy") → articles linking to it. Built once per build. */
export const backlinkIndex = cache((): Map<string, Backlink[]> => {
  const index = new Map<string, Backlink[]>();
  for (const kind of readdirSync(DIR) as ArticleKind[]) {
    for (const file of readdirSync(join(DIR, kind)).filter((f) => f.endsWith(".md"))) {
      const slug = file.slice(0, -3);
      const raw = readFileSync(join(DIR, kind, file), "utf8");
      const head = raw.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
      const self = `/${kind}/${slug}`;
      const href = kind === "country" ? `/country/${slug}` : self;
      const era = raw.match(/\]\((\/philosophy\/[a-z-]+)\)/)?.[1];
      const entry: Backlink = { kind, slug, href, name: nameOf(kind, slug, head), born: year(head.match(/^born:\s*(\S+)/m)?.[1]), era };
      const targets = new Set([...raw.matchAll(/\]\((\/[a-z-]+\/[a-z0-9-]+)\)/g)].map((m) => m[1]));
      for (const t of targets) {
        if (t === self) continue;
        if (!index.has(t)) index.set(t, []);
        index.get(t)!.push(entry);
      }
    }
  }
  return index;
});

export function backlinksTo(path: string): Backlink[] {
  return backlinkIndex().get(path) ?? [];
}

/** Philosophers whose own era (their first era link) is this page, oldest first. */
export function philosophersOf(eraPath: string): Backlink[] {
  return backlinksTo(eraPath)
    .filter((b) => b.kind === "person" && b.era === eraPath && PHILOSOPHER_SLUGS.has(b.slug))
    .sort((a, b) => (a.born ?? 9999) - (b.born ?? 9999));
}
