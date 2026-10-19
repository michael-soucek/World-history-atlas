import "server-only";
/**
 * Where a person, event or culture sits in the atlas: the world maps from its
 * years, the state most associated with it and that state's size on those
 * maps, who else on the site lived at the same time, what else happened, and
 * which guided tours mention it. It's the site's own data, so it gives every
 * page something the encyclopedia text beneath it doesn't have; it also
 * writes the pages' search-result descriptions.
 *
 * Dates come from the local Wikidata store (scripts/build-wikidata-store.mjs).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { CULTURES_CROSSWALK, EVENTS_CROSSWALK, PEOPLE_CROSSWALK } from "@/data/entityCrosswalk";
import { getCanonicalNameByQid, lookupByQid } from "@/data/crosswalk";
import { ENTITY_PLACE_OVERRIDE } from "@/data/entityPlaceLinks";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import { TOURS } from "@/data/tours";
import { formatArea, placeMaps, sizeComparison, withArticle } from "@/lib/placeMaps";

export type TimedKind = "person" | "event" | "culture";

export interface TimedEntry {
  kind: TimedKind;
  slug: string;
  name: string;
  start?: number;
  end?: number;
}

export interface EntityContext extends TimedEntry {
  /** Short Wikidata description, e.g. "French military leader and emperor". */
  description?: string;
  /** World maps (snapshot years) from its own years. */
  maps: number[];
  /** The nearest maps from before it began and after it ended (events). */
  before?: number;
  after?: number;
  /** The state most associated with it, and its area on the maps above. */
  place?: { slug: string; name: string; qid: string; area: [number, number][] };
  people: TimedEntry[];
  events: TimedEntry[];
  tours: { slug: string; title: string; stops: number[] }[];
}

interface StoredEntity {
  labels?: { en?: { value: string } };
  descriptions?: { en?: { value: string } };
  claims: Record<string, { mainsnak: { datavalue: { value?: { time?: string } } } }[]>;
}

/** Which Wikidata dates mark the start and end of each kind of page. */
const SPAN_PROPS: Record<TimedKind, [string[], string[]]> = {
  person: [["P569"], ["P570"]],
  event: [["P580", "P585", "P571"], ["P582", "P585", "P576"]],
  culture: [["P571", "P580"], ["P576", "P582"]],
};

function yearOf(entity: StoredEntity | undefined, props: string[]): number | undefined {
  for (const prop of props) {
    const time = entity?.claims[prop]?.[0]?.mainsnak.datavalue.value?.time;
    const m = time?.match(/^([+-])(\d+)-/);
    if (m) return (m[1] === "-" ? -1 : 1) * Number(m[2]);
  }
  return undefined;
}

let indexPromise: Promise<{ entries: TimedEntry[]; entities: Record<string, StoredEntity>; qids: Map<string, string> }> | null = null;

function loadIndex() {
  indexPromise ??= (async () => {
    const [store, cache] = await Promise.all(
      ["wikidata-store.json", "entity-cache.json"].map((f) =>
        readFile(join(process.cwd(), "public/data", f), "utf8").then((t) => JSON.parse(t)).catch(() => ({})),
      ),
    );
    const entities = (store.entities ?? {}) as Record<string, StoredEntity>;
    const cachedNames = (cache.entries ?? {}) as Record<string, { name?: string }>;
    const entries: TimedEntry[] = [];
    const qids = new Map<string, string>();
    const sources: [TimedKind, typeof PEOPLE_CROSSWALK][] = [["person", PEOPLE_CROSSWALK], ["event", EVENTS_CROSSWALK], ["culture", CULTURES_CROSSWALK]];
    for (const [kind, crosswalk] of sources) {
      for (const e of Object.values(crosswalk)) {
        const entity = entities[e.wikidataId];
        const name = e.name ?? cachedNames[e.wikidataId]?.name ?? entity?.labels?.en?.value ?? e.slug;
        let start = yearOf(entity, SPAN_PROPS[kind][0]);
        let end = yearOf(entity, SPAN_PROPS[kind][1]);
        if (start !== undefined && end !== undefined && end < start) [start, end] = [end, start];
        entries.push({ kind, slug: e.slug, name, start, end });
        qids.set(`${kind}:${e.slug}`, e.wikidataId);
      }
    }
    return { entries, entities, qids };
  })();
  return indexPromise;
}

const overlap = (a: TimedEntry, b: TimedEntry) =>
  a.start !== undefined && a.end !== undefined && b.start !== undefined && b.end !== undefined
    ? Math.min(a.end, b.end) - Math.max(a.start, b.start)
    : -Infinity;

/** Other names the tours use for a page's subject. */
const ALSO_KNOWN_AS: Record<string, string[]> = {
  "world-war-i": ["First World War", "Great War"],
  "world-war-ii": ["Second World War"],
  holocaust: ["Holocaust"],
  "cold-war": ["Cold War"],
  "napoleon": ["Napoleon Bonaparte"],
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A few Wikidata facts for the quick answers, by English name. */
export interface StoredFacts {
  start?: number;
  end?: number;
  capitals: string[];
  birthPlace?: string;
  deathPlace?: string;
  locations: string[];
  before: string[];
  after: string[];
  description?: string;
}

export async function storedFacts(qid: string, kind: TimedKind | "place"): Promise<StoredFacts> {
  const { entities } = await loadIndex();
  const e = entities[qid];
  const names = (prop: string, max = 6) =>
    [...new Set((e?.claims[prop] ?? []).map((c) => {
      const id = (c.mainsnak.datavalue.value as { id?: string } | undefined)?.id;
      return id ? entities[id]?.labels?.en?.value : undefined;
    }).filter((n): n is string => !!n))].slice(0, max);
  const span = kind === "place" ? SPAN_PROPS.culture : SPAN_PROPS[kind];
  return {
    start: yearOf(e, span[0]),
    end: yearOf(e, span[1]),
    capitals: names("P36"),
    birthPlace: names("P19", 1)[0],
    deathPlace: names("P20", 1)[0],
    locations: [...new Set([...names("P276", 4), ...names("P17", 4)])].slice(0, 5),
    before: names("P155", 3),
    after: names("P156", 3),
    description: e?.descriptions?.en?.value,
  };
}

export async function entityContext(kind: TimedKind, slug: string): Promise<EntityContext | null> {
  const { entries, entities, qids } = await loadIndex();
  const self = entries.find((e) => e.kind === kind && e.slug === slug);
  if (!self) return null;
  const qid = qids.get(`${kind}:${slug}`)!;
  // Wikidata often repeats the dates ("1939–1945 global conflict"); they're already in the title.
  const description = entities[qid]?.descriptions?.en?.value
    ?.replace(/\s*\(\s*-?\d+\s*[–-]\s*-?\d+\s*\)\s*$/, "")
    .replace(/^(c\.\s*)?\d{1,4}(\s*BCE?|\s*CE|\s*AD)?\s*[–-]\s*\d{1,4}(\s*BCE?|\s*CE|\s*AD)?\s+/i, "")
    .trim();
  const { start, end } = self;
  const dated = start !== undefined && end !== undefined;

  // Maps from its own years; for an event, also the last before and first after.
  const usable = SNAPSHOT_YEARS.filter((y) => y >= -10000);
  const maps = dated ? usable.filter((y) => y >= start! && y <= end!) : [];
  const before = dated && kind === "event" ? [...usable].reverse().find((y) => y <= start!) : undefined;
  const after = dated && kind === "event" ? usable.find((y) => y >= end!) : undefined;

  // The state most associated with it, measured on those maps.
  let place: EntityContext["place"];
  const placeQid = ENTITY_PLACE_OVERRIDE[slug];
  const placeEntry = placeQid ? lookupByQid(placeQid) : undefined;
  if (placeQid && placeEntry) {
    const data = placeMaps(placeEntry.slug);
    const years = new Set([...maps, ...(before !== undefined ? [before] : []), ...(after !== undefined ? [after] : [])]);
    place = {
      slug: placeEntry.slug,
      qid: placeQid,
      // The site's name for it; the snapshot's own label can be a successor's ("White Horde").
      name: getCanonicalNameByQid(placeQid) ?? data?.name ?? placeEntry.slug,
      area: (data?.area ?? []).filter(([y]) => years.has(y)),
    };
  }

  // Contemporaries: people whose lives overlapped by at least ten years (for an
  // event, anyone alive and grown during it), and events of the same years.
  const others = entries.filter((e) => !(e.kind === kind && e.slug === slug));
  const minOverlap = kind === "person" ? 10 : 0;
  const people = others
    .filter((e) => e.kind === "person" && overlap(self, e) >= minOverlap && (kind === "person" || e.start! + 15 <= end!))
    .sort((a, b) => overlap(self, b) - overlap(self, a) || a.name.localeCompare(b.name))
    .slice(0, 10);
  const events = others
    .filter((e) => e.kind === "event" && e.start !== undefined && e.end !== undefined && overlap(self, e) >= 0)
    .sort((a, b) => a.start! - b.start!)
    .slice(0, 10);

  // Tours that mention it by name.
  const names = [self.name, ...(ALSO_KNOWN_AS[slug] ?? [])].map(escapeRe).join("|");
  const named = new RegExp(`\\b(${names})\\b`, "i");
  const tours = TOURS.map((t) => ({
    slug: t.slug,
    title: t.title,
    stops: t.steps.flatMap((s, i) => (named.test(`${s.title} ${s.text}`) ? [i + 1] : [])),
  })).filter((t) => t.stops.length);

  return { ...self, description, maps, before, after, place, people, events, tours };
}

// ── Wording shared by the page section and the search description ──

/** "69 BCE", "800 CE", "1769". */
export function fmtYear(y: number): string {
  if (y < 0) return `${-y} BCE`;
  return y < 1000 ? `${y} CE` : String(y);
}

/** "1769–1821", "69–30 BCE", "27 BCE–14 CE". */
export function fmtSpan(start: number, end: number): string {
  if (start === end) return fmtYear(start);
  if (start < 0 && end < 0) return `${-start}–${-end} BCE`;
  if (start < 0) return `${-start} BCE–${end} CE`;
  return end < 1000 ? `${start}–${end} CE` : `${start}–${end}`;
}

/** "a, b and c". */
export function listOf(items: string[]): string {
  return items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** The largest area among the maps listed, with a modern comparison when one is close. */
export function largest(area: [number, number][]) {
  if (!area.length) return null;
  const [year, km2] = area.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { year, km2, text: formatArea(km2), like: sizeComparison(km2) };
}

/**
 * The search-result description for a person, event or culture page, built
 * from the atlas's own data rather than the encyclopedia's first sentence.
 */
export function contextDescription(ctx: EntityContext): string {
  const parts: string[] = [];
  const dated = ctx.start !== undefined && ctx.end !== undefined;
  const span = dated ? fmtSpan(ctx.start!, ctx.end!) : "";
  // Lower-case the first letter only when it starts an ordinary word ("Queen of…", not "French…").
  const lowerable = (d: string) => /^(A|An|The|[A-Z][a-z]+ (of|and|in|from|by|who|which|that)\b)/.test(d) || !/^[A-Z][a-z]+(ian|ese|ish|ic|ch|an|i)\b/.test(d);
  const desc = ctx.description ? (lowerable(ctx.description) ? ctx.description.charAt(0).toLowerCase() + ctx.description.slice(1) : ctx.description) : "";
  parts.push(`${ctx.name}${span ? ` (${span})` : ""}${desc ? `, ${desc}` : ""}.`);
  const peak = ctx.place ? largest(ctx.place.area) : null;
  if (ctx.place && peak) {
    parts.push(`See ${withArticle(ctx.place.name)} on the ${fmtYear(peak.year)} map, about ${peak.text.split(" (")[0]}.`);
  } else if (ctx.place) {
    parts.push(`See ${withArticle(ctx.place.name)} on the interactive map.`);
  } else if (ctx.kind === "event" && ctx.before !== undefined && ctx.after !== undefined && ctx.before !== ctx.after) {
    parts.push(`Compare the world maps of ${fmtYear(ctx.before)} and ${fmtYear(ctx.after)}.`);
  }
  const who = ctx.kind === "event" ? "Who lived through it" : ctx.kind === "person" ? "Contemporaries" : "People";
  if (ctx.people.length) parts.push(`${who}: ${listOf(ctx.people.slice(0, 3).map((p) => p.name))}.`);
  parts.push(
    ctx.kind === "culture"
      ? "See where and when it flourished on the interactive history map."
      : "Explore it on the interactive history map.",
  );
  // Whole sentences only, within what Google shows (about 158 characters).
  let out = parts[0];
  for (const part of parts.slice(1)) if (`${out} ${part}`.length <= 158) out = `${out} ${part}`;
  return out;
}
