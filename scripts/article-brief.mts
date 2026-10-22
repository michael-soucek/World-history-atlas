/**
 * Prints a fact brief for writing a page's own article (content/articles):
 * dates, capitals and places from the stored Wikidata facts, how the site's
 * maps draw it (place pages), the cities it ruled, and the cached Wikipedia
 * text as a fact-checking reference — not to be copied.
 *
 *   npx tsx scripts/article-brief.mts place pala-empire mamluk-sultanate
 *   npx tsx scripts/article-brief.mts --list place   # slugs still without an article
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { lookupByName } from "../src/data/crosswalk";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
type Kind = "place" | "person" | "event" | "culture";
interface CacheEntry {
  qid: string;
  entityType: Kind;
  name: string;
  slug?: string;
  summary?: string;
  sections?: { heading: string; content: string }[];
}
const cache = JSON.parse(readFileSync(join(ROOT, "public/data/entity-cache.json"), "utf8")).entries as Record<string, CacheEntry>;
const placeMaps = JSON.parse(readFileSync(join(ROOT, "src/data/placeMaps.json"), "utf8")) as Record<string, {
  name: string; years: number[]; peak: { year: number; km2: number };
  today: { name: string; share: number }[]; before?: { year: number; name: string }; after?: { year: number; name: string };
}>;
const cityRulers = JSON.parse(readFileSync(join(ROOT, "src/data/cityRulers.json"), "utf8")) as Record<string, { from: number; to: number; name: string | null; sovereign: string | null }[]>;

const crosswalkSrc = readFileSync(join(ROOT, "src/data/crosswalk.ts"), "utf8");
const entitySrc = readFileSync(join(ROOT, "src/data/entityCrosswalk.ts"), "utf8");
/** slug → qid, from the crosswalk sources. */
function slugIndex(kind: Kind): Map<string, string> {
  const out = new Map<string, string>();
  if (kind === "place") {
    const re = /wikidataId:\s*"(Q\d+)"[^{}]*?slug:\s*"([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(crosswalkSrc))) out.set(m[2], m[1]);
    return out;
  }
  // People, events and cultures: { wikidataId, slug, entityType } per entry.
  const re = /\{\s*wikidataId:\s*"(Q\d+)",\s*slug:\s*"([^"]+)",\s*entityType:\s*"(\w+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(entitySrc))) if (m[3] === kind) out.set(m[2], m[1]);
  return out;
}
const store = JSON.parse(readFileSync(join(ROOT, "public/data/wikidata-store.json"), "utf8")).entities as Record<string, {
  claims: Record<string, { mainsnak: { datavalue?: { value: unknown } } }[]>; labels?: { en?: { value: string } };
}>;
const SPAN: Record<Kind, [string, string]> = { place: ["P571", "P576"], culture: ["P571", "P576"], person: ["P569", "P570"], event: ["P580", "P582"] };
function yearOf(qid: string, prop: string): number | undefined {
  const t = (store[qid]?.claims[prop]?.[0]?.mainsnak.datavalue?.value as { time?: string } | undefined)?.time;
  const m = t?.match(/^([+-])(\d+)-/);
  return m ? (m[1] === "-" ? -1 : 1) * Number(m[2]) : undefined;
}
function names(qid: string, prop: string, max = 5): string[] {
  return [...new Set((store[qid]?.claims[prop] ?? []).map((c) => {
    const id = (c.mainsnak.datavalue?.value as { id?: string } | undefined)?.id;
    return id ? store[id]?.labels?.en?.value : undefined;
  }).filter((n): n is string => !!n))].slice(0, max);
}
const fmt = (y: number) => (y < 0 ? `${-y} BCE` : `${y}`);
const hasArticle = (kind: Kind, slug: string) => existsSync(join(ROOT, "content/articles", kind, `${slug}.md`));

const args = process.argv.slice(2);
if (args[0] === "--list") {
  const kind = args[1] as Kind;
  const slugs = [...slugIndex(kind).keys()];
  const todo = [...new Set(slugs)].filter((s) => !hasArticle(kind, s));
  console.log(`${todo.length} ${kind} pages without an article:\n${todo.join(" ")}`);
  process.exit(0);
}

const kind = args[0] as Kind;
const index = slugIndex(kind);
for (const slug of args.slice(1)) {
  const qid = index.get(slug);
  const entry = qid ? cache[qid] : undefined;
  console.log(`\n==================== ${kind}/${slug} (${qid ?? "no qid"}) ${entry?.name ?? ""}`);
  if (!qid || !entry) { console.log("  (not in the entity cache)"); continue; }
  const [a, b] = SPAN[kind];
  let start = yearOf(qid, a), end = yearOf(qid, b);
  if (kind === "event" && start === undefined) start = end = yearOf(qid, "P585");
  const span = start !== undefined ? `${fmt(start)}${end !== undefined && end !== start ? `–${fmt(end)}` : ""}` : "?";
  const extra = [
    names(qid, "P36").length ? `Capitals: ${names(qid, "P36").join(", ")}` : "",
    names(qid, "P19", 1).length ? `Born: ${names(qid, "P19", 1)[0]}` : "",
    names(qid, "P20", 1).length ? `Died: ${names(qid, "P20", 1)[0]}` : "",
    names(qid, "P276", 4).length ? `Location: ${names(qid, "P276", 4).join(", ")}` : "",
  ].filter(Boolean).join(" | ");
  console.log(`Dates (Wikidata): ${span}${extra ? ` | ${extra}` : ""}`);
  if (kind === "place") {
    const pm = placeMaps[slug];
    if (pm) {
      console.log(`On our maps: ${pm.years.map(fmt).join(", ")}; largest ${Math.round(pm.peak.km2 / 1000)}k km² in ${fmt(pm.peak.year)}; today ${pm.today.map((t) => `${t.name} ${Math.round(t.share * 100)}%`).join(", ")}${pm.before ? `; before: ${pm.before.name} (${fmt(pm.before.year)})` : ""}${pm.after ? `; after: ${pm.after.name} (${fmt(pm.after.year)})` : ""}`);
    }
    const cities: string[] = [];
    for (const [city, spans] of Object.entries(cityRulers)) {
      const held = spans.filter((s) => [s.name, s.sovereign].some((n) => n && lookupByName(n, s.from)?.slug === slug));
      if (held.length) cities.push(`${city} (${held.map((s) => `${fmt(s.from)}–${fmt(s.to)}`).join(", ")})`);
    }
    if (cities.length) console.log(`Cities held (our data): ${cities.slice(0, 14).join("; ")}`);
  }
  console.log(`Reference (Wikipedia, do not copy): ${(entry.summary ?? "").replace(/\s+/g, " ").slice(0, 1100)}`);
  if (entry.sections?.length) console.log(`Wikipedia sections: ${entry.sections.map((s) => s.heading).join(" · ")}`);
}
