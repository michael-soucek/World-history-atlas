import { appendFileSync } from "node:fs";
import { join } from "node:path";
import type { CrosswalkEntry, EntityType } from "@/types";
import {
  getCanonicalNameByQid,
  lookupByQid,
  lookupBySlug,
  registerResolvedPlace,
} from "@/data/crosswalk";
import {
  lookupCulture,
  lookupCultureByQid,
  lookupEvent,
  lookupEventByQid,
  lookupPerson,
  lookupPersonByQid,
  registerResolvedEntity,
} from "@/data/entityCrosswalk";
import { slugify } from "@/lib/slugify";

export type ResolutionMethod = "map-qid" | "crosswalk" | "wikidata-exact";

export interface EntityResolution {
  wikidataId: string;
  slug: string;
  canonicalName: string;
  entityType: EntityType;
  method: ResolutionMethod;
}

export interface EntityResolutionResult {
  resolved: EntityResolution | null;
  reason?: "invalid-type" | "no-article" | "ambiguous" | "not-found" | "query-failed" | "no-exact-label" | "wrong-type" | "no-enwiki";
}

function logResolutionFailure(slug: string, entityType: EntityType, reason: string): void {
  if (typeof window !== "undefined") return;
  try {
    const line = `${new Date().toISOString()}\t${entityType}\t${slug}\t${reason}\n`;
    appendFileSync(join(process.cwd(), ".resolution-failures.log"), line);
  } catch {
    // logging must never break resolution
  }
}

interface EntityDataRaw {
  labels?: Record<string, { value?: string }>;
  aliases?: Record<string, Array<{ value?: string }>>;
  sitelinks?: Record<string, { title?: string }>;
  claims?: Record<string, Array<{
    mainsnak?: {
      datavalue?: {
        value?: {
          id?: string;
        };
      };
    };
  }>>;
}

interface EntityDetails {
  qid: string;
  label: string;
  aliases: string[];
  hasEnwiki: boolean;
  sitelinksCount: number;
  statementsCount: number;
  p31: string[];
}

interface RankedCandidate {
  qid: string;
  label: string;
  sitelinksCount: number;
  statementsCount: number;
}

const RESOLUTION_CACHE = new Map<string, EntityResolutionResult>();
const ENTITY_RAW_CACHE = new Map<string, EntityDataRaw | null>();
const ENTITY_DETAILS_CACHE = new Map<string, EntityDetails | null>();
const TYPE_GUARD_CACHE = new Map<string, boolean>();
const SUBCLASS_CHAIN_CACHE = new Map<string, string[]>();
const WD_USER_AGENT = "WorldHistoryAtlas/1.0 (resolver)";
const LONG_REVALIDATE_SECONDS = 31536000;

const TYPE_IDS: Record<EntityType, string[]> = {
  // place: country, state, empire, caliphate, dynasty, kingdom,
  // historical polity, city.
  place: [
    "Q6256", // country
    "Q7275", // state
    "Q48349", // empire
    "Q23616", // caliphate
    "Q164950", // dynasty
    "Q41710", // kingdom
    "Q3024240", // historical country
    "Q15634554", // historical polity
    "Q515", // city
  ],
  person: [
    "Q5", // human
  ],
  event: [
    "Q198", // war
    "Q178561", // battle
    "Q13418847", // historical event
  ],
  culture: [
    "Q2198855", // cultural movement
    "Q11514315", // historical period
    "Q28171280", // ancient civilization
  ],
};

function normaliseExact(s: string): string {
  return s
    .toLowerCase()
    .replace(/[–—-]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function humaniseSlug(slug: string): string {
  const spaced = slug
    .replace(/^\/+|\/+$/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!spaced) return slug;

  return spaced
    .split(" ")
    .map((w) => {
      if (/^(ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(w)) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function crosswalkForSlug(slug: string, entityType: EntityType): CrosswalkEntry | undefined {
  if (entityType === "place") return lookupBySlug(slug);
  if (entityType === "person") return lookupPerson(slug);
  if (entityType === "event") return lookupEvent(slug);
  if (entityType === "culture") return lookupCulture(slug);
  return undefined;
}

function crosswalkForQid(qid: string, entityType: EntityType): CrosswalkEntry | undefined {
  if (entityType === "place") return lookupByQid(qid);
  if (entityType === "person") return lookupPersonByQid(qid);
  if (entityType === "event") return lookupEventByQid(qid);
  if (entityType === "culture") return lookupCultureByQid(qid);
  return undefined;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWikidataJson(url: string): Promise<unknown | null> {
  const delays = [0, 300, 900];

  for (let i = 0; i < delays.length; i += 1) {
    if (delays[i] > 0) await sleep(delays[i]);

    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": WD_USER_AGENT,
      },
      next: { revalidate: LONG_REVALIDATE_SECONDS },
    });

    if (res.ok) {
      try {
        return await res.json();
      } catch {
        return null;
      }
    }

    // Retry transient/rate-limit failures.
    if (res.status === 429 || res.status >= 500) continue;
    return null;
  }

  return null;
}

async function fetchEntityRaw(qid: string): Promise<EntityDataRaw | null> {
  if (ENTITY_RAW_CACHE.has(qid)) return ENTITY_RAW_CACHE.get(qid) ?? null;

  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const data = await fetchWikidataJson(url);
  if (!data || typeof data !== "object") {
    ENTITY_RAW_CACHE.set(qid, null);
    return null;
  }

  const typed = data as { entities?: Record<string, EntityDataRaw> };
  const raw = typed.entities?.[qid] ?? null;
  ENTITY_RAW_CACHE.set(qid, raw);
  return raw;
}

function getEntityIdClaims(entity: EntityDataRaw, prop: string): string[] {
  const claims = entity.claims?.[prop] ?? [];
  return claims
    .map((c) => c.mainsnak?.datavalue?.value?.id)
    .filter((v): v is string => typeof v === "string" && /^Q\d+$/.test(v));
}

async function fetchEntityDetails(qid: string): Promise<EntityDetails | null> {
  if (ENTITY_DETAILS_CACHE.has(qid)) return ENTITY_DETAILS_CACHE.get(qid) ?? null;

  const entity = await fetchEntityRaw(qid);
  if (!entity) {
    ENTITY_DETAILS_CACHE.set(qid, null);
    return null;
  }

  const label = entity.labels?.en?.value?.trim() ?? "";
  const aliases = (entity.aliases?.en ?? [])
    .map((a) => a.value?.trim() ?? "")
    .filter(Boolean);
  const sitelinks = entity.sitelinks ?? {};
  const claims = entity.claims ?? {};

  const details: EntityDetails = {
    qid,
    label,
    aliases,
    hasEnwiki: Boolean(sitelinks.enwiki?.title),
    sitelinksCount: Object.keys(sitelinks).length,
    statementsCount: Object.values(claims).reduce((acc, arr) => acc + arr.length, 0),
    p31: getEntityIdClaims(entity, "P31"),
  };

  ENTITY_DETAILS_CACHE.set(qid, details);
  return details;
}

async function getSubclassChain(qid: string, depth = 0, seen = new Set<string>()): Promise<string[]> {
  if (SUBCLASS_CHAIN_CACHE.has(qid)) {
    return SUBCLASS_CHAIN_CACHE.get(qid) ?? [];
  }

  if (depth > 6 || seen.has(qid)) return [];
  seen.add(qid);

  const entity = await fetchEntityRaw(qid);
  if (!entity) {
    SUBCLASS_CHAIN_CACHE.set(qid, []);
    return [];
  }

  const direct = getEntityIdClaims(entity, "P279");
  const out = new Set<string>(direct);

  for (const parent of direct) {
    const parentChain = await getSubclassChain(parent, depth + 1, seen);
    for (const p of parentChain) out.add(p);
  }

  const chain = [...out];
  SUBCLASS_CHAIN_CACHE.set(qid, chain);
  return chain;
}

async function passesTypeGuard(qid: string, entityType: EntityType): Promise<boolean> {
  const key = `${entityType}:${qid}`;
  const cached = TYPE_GUARD_CACHE.get(key);
  if (cached !== undefined) return cached;

  const allowed = new Set(TYPE_IDS[entityType] ?? []);
  if (allowed.size === 0) {
    TYPE_GUARD_CACHE.set(key, true);
    return true;
  }

  const details = await fetchEntityDetails(qid);
  if (!details) {
    TYPE_GUARD_CACHE.set(key, false);
    return false;
  }

  for (const cls of details.p31) {
    if (allowed.has(cls)) {
      TYPE_GUARD_CACHE.set(key, true);
      return true;
    }

    const subclasses = await getSubclassChain(cls);
    if (subclasses.some((s) => allowed.has(s))) {
      TYPE_GUARD_CACHE.set(key, true);
      return true;
    }
  }

  TYPE_GUARD_CACHE.set(key, false);
  return false;
}

async function searchWikidataCandidates(name: string): Promise<string[]> {
  const encoded = encodeURIComponent(name);
  const url =
    `https://www.wikidata.org/w/api.php` +
    `?action=wbsearchentities&search=${encoded}` +
    `&language=en&type=item&limit=25&format=json&origin=*`;

  const data = await fetchWikidataJson(url);
  if (!data || typeof data !== "object") return [];
  const json = data as { search?: Array<{ id?: string }> };
  return (json.search ?? [])
    .map((r) => r.id)
    .filter((id): id is string => typeof id === "string" && /^Q\d+$/.test(id));
}

async function resolveExactByName(
  name: string,
  entityType: EntityType,
): Promise<{ candidate: RankedCandidate | null; ambiguous: boolean; failReason?: string }> {
  const target = normaliseExact(name);
  const candidateIds = await searchWikidataCandidates(name);
  if (candidateIds.length === 0) return { candidate: null, ambiguous: false, failReason: "no-exact-label" };

  const matches: RankedCandidate[] = [];
  // Track the most informative failure reason seen across all candidates.
  // Priority: wrong-type > no-enwiki > no-exact-label > query-failed
  const REASON_PRIORITY: Record<string, number> = {
    "wrong-type": 4, "no-enwiki": 3, "no-exact-label": 2, "query-failed": 1,
  };
  let bestFailReason = "no-exact-label";

  const bump = (r: string) => {
    if ((REASON_PRIORITY[r] ?? 0) > (REASON_PRIORITY[bestFailReason] ?? 0)) {
      bestFailReason = r;
    }
  };

  for (const qid of candidateIds) {
    const details = await fetchEntityDetails(qid);
    if (!details) { bump("query-failed"); continue; }

    // Check exact label/alias first so we can attribute failures correctly.
    const exact =
      normaliseExact(details.label) === target ||
      details.aliases.some((a) => normaliseExact(a) === target);
    if (!exact) { bump("no-exact-label"); continue; }

    if (!details.hasEnwiki) { bump("no-enwiki"); continue; }

    const typeOk = await passesTypeGuard(qid, entityType);
    if (!typeOk) { bump("wrong-type"); continue; }

    matches.push({
      qid,
      label: details.label || name,
      sitelinksCount: details.sitelinksCount,
      statementsCount: details.statementsCount,
    });
  }

  if (matches.length === 0) return { candidate: null, ambiguous: false, failReason: bestFailReason };

  const ranked = matches.sort((a, b) => {
    if (b.sitelinksCount !== a.sitelinksCount) {
      return b.sitelinksCount - a.sitelinksCount;
    }
    return b.statementsCount - a.statementsCount;
  });

  if (ranked.length > 1) {
    const top = ranked[0];
    const second = ranked[1];
    const ambiguous =
      top.sitelinksCount === second.sitelinksCount &&
      top.statementsCount === second.statementsCount;
    if (ambiguous) {
      return { candidate: null, ambiguous: true };
    }
  }

  return { candidate: ranked[0], ambiguous: false };
}

async function validateQid(qid: string, entityType: EntityType): Promise<{ ok: boolean; details: EntityDetails | null; failReason?: string }> {
  const details = await fetchEntityDetails(qid);
  if (!details) return { ok: false, details: null, failReason: "query-failed" };
  if (!details.hasEnwiki) return { ok: false, details, failReason: "no-enwiki" };

  const typeOk = await passesTypeGuard(qid, entityType);
  if (!typeOk) return { ok: false, details, failReason: "wrong-type" };

  return { ok: true, details };
}

function cacheResult(key: string, result: EntityResolutionResult): EntityResolutionResult {
  RESOLUTION_CACHE.set(key, result);
  return result;
}

export function clearResolutionCache(): void {
  RESOLUTION_CACHE.clear();
}

export async function resolveEntityBySlugOrQid(
  rawSlugOrQid: string,
  entityType: EntityType,
): Promise<EntityResolutionResult> {
  const raw = decodeURIComponent(rawSlugOrQid).trim();
  const cacheKey = `${entityType}:${raw.toLowerCase()}`;
  const cached = RESOLUTION_CACHE.get(cacheKey);
  if (cached) return cached;

  // Outer safety net: any uncaught error degrades to not-found, never throws.
  try {
    return await _resolveInner(raw, cacheKey, entityType);
  } catch (err) {
    const slug = raw.toLowerCase();
    logResolutionFailure(slug, entityType, `uncaught: ${err instanceof Error ? err.message : String(err)}`);
    return cacheResult(cacheKey, { resolved: null, reason: "not-found" });
  }
}

async function _resolveInner(
  raw: string,
  cacheKey: string,
  entityType: EntityType,
): Promise<EntityResolutionResult> {
  // 1) Direct QID from map tag / deep link.
  if (/^Q\d+$/i.test(raw)) {
    const qid = raw.toUpperCase();
    try {
      const valid = await validateQid(qid, entityType);
      if (!valid.ok || !valid.details) {
        const reason = (valid.failReason ?? "invalid-type") as EntityResolutionResult["reason"];
        logResolutionFailure(qid, entityType, reason ?? "invalid-type");
        return cacheResult(cacheKey, { resolved: null, reason: "invalid-type" });
      }

      const existing = crosswalkForQid(qid, entityType);
      const slug = existing?.slug ?? slugify(valid.details.label || qid);
      const resolved: EntityResolution = {
        wikidataId: qid,
        slug,
        canonicalName: valid.details.label || raw,
        entityType,
        method: "map-qid",
      };

      return cacheResult(cacheKey, { resolved });
    } catch (err) {
      logResolutionFailure(qid, entityType, `qid-lookup-error: ${err instanceof Error ? err.message : String(err)}`);
      return cacheResult(cacheKey, { resolved: null, reason: "not-found" });
    }
  }

  const slug = raw.toLowerCase();

  // 2) Curated crosswalk override.
  const crosswalkEntry = crosswalkForSlug(slug, entityType);
  if (crosswalkEntry) {
    try {
      const details = await fetchEntityDetails(crosswalkEntry.wikidataId);
      if (details?.hasEnwiki) {
        const canonicalName =
          entityType === "place"
            ? getCanonicalNameByQid(crosswalkEntry.wikidataId) ?? details.label
            : details.label || humaniseSlug(slug);

        const resolved: EntityResolution = {
          wikidataId: crosswalkEntry.wikidataId,
          slug: crosswalkEntry.slug,
          canonicalName,
          entityType,
          method: "crosswalk",
        };

        return cacheResult(cacheKey, { resolved });
      }
      logResolutionFailure(slug, entityType, details ? "no-enwiki" : "query-failed");
      // Validation failed for crosswalk entry — fall through to exact search.
    } catch {
      // Error validating crosswalk entry — fall through to exact search.
    }
  }

  // 3) Exact label/alias match + type guard + enwiki requirement.
  const expectedName = humaniseSlug(slug);
  try {
    const exact = await resolveExactByName(expectedName, entityType);
    if (exact.ambiguous) {
      logResolutionFailure(slug, entityType, "ambiguous");
      return cacheResult(cacheKey, { resolved: null, reason: "ambiguous" });
    }
    if (!exact.candidate) {
      const reason = (exact.failReason ?? "not-found") as EntityResolutionResult["reason"];
      logResolutionFailure(slug, entityType, reason ?? "not-found");
      return cacheResult(cacheKey, { resolved: null, reason: reason ?? "not-found" });
    }

    const valid = await validateQid(exact.candidate.qid, entityType);
    if (!valid.ok || !valid.details) {
      const reason = (valid.failReason ?? "no-article") as EntityResolutionResult["reason"];
      logResolutionFailure(slug, entityType, reason ?? "no-article");
      return cacheResult(cacheKey, { resolved: null, reason: "no-article" });
    }

    const canonicalName = valid.details.label || exact.candidate.label || expectedName;
    const resolvedSlug = slugify(canonicalName) || slug;

    if (entityType === "place") {
      registerResolvedPlace(canonicalName, {
        wikidataId: exact.candidate.qid,
        slug: resolvedSlug,
      });
    } else if (entityType === "person" || entityType === "event" || entityType === "culture") {
      registerResolvedEntity(entityType, resolvedSlug, exact.candidate.qid);
    }

    const resolved: EntityResolution = {
      wikidataId: exact.candidate.qid,
      slug: resolvedSlug,
      canonicalName,
      entityType,
      method: "wikidata-exact",
    };

    return cacheResult(cacheKey, { resolved });
  } catch (err) {
    logResolutionFailure(slug, entityType, `exact-search-error: ${err instanceof Error ? err.message : String(err)}`);
    return cacheResult(cacheKey, { resolved: null, reason: "not-found" });
  }
}
