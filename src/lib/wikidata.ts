import type { PlaceContent, KeyFact, EntityType, WikiSection } from "@/types";
import { getPrebuiltContentByQid } from "@/lib/prebuiltEntityCache";

const WD_USER_AGENT = "WorldHistoryAtlas/1.0 (content)";
const LONG_REVALIDATE_SECONDS = 31536000;

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry(url: string): Promise<Record<string, unknown> | null> {
  const delays = [0, 300, 900];

  for (const delayMs of delays) {
    if (delayMs > 0) await sleep(delayMs);

    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: {
          Accept: "application/json",
          "User-Agent": WD_USER_AGENT,
        },
        next: { revalidate: LONG_REVALIDATE_SECONDS },
      });

      if (res.ok) {
        try {
          return (await res.json()) as Record<string, unknown>;
        } catch {
          return null;
        }
      }

      if (res.status === 429 || res.status >= 500) continue;
      return null;
    } catch {
      // transient network failure, try again
    }
  }

  return null;
}

/** Fetch the Wikidata entity JSON for a Q-ID. Cached for 24 h server-side. */
async function fetchEntity(qid: string): Promise<Record<string, unknown>> {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const json = await fetchJsonWithRetry(url);
  if (!json) throw new Error(`Wikidata fetch failed for ${qid}`);
  const data = json as { entities?: Record<string, unknown> };
  return (data.entities?.[qid] ?? {}) as Record<string, unknown>;
}

/** Extract the English Wikipedia sitelink title from an entity. */
function getWikipediaTitle(entity: Record<string, unknown>): string | undefined {
  const sitelinks = (entity.sitelinks as Record<string, { title: string }>) ?? {};
  return sitelinks["enwiki"]?.title;
}

/** Extract the P18 image filename from an entity. */
function getImageFilename(entity: Record<string, unknown>): string | undefined {
  const claims = (entity.claims as Record<string, unknown[]>) ?? {};
  const p18 = claims["P18"];
  if (!p18 || p18.length === 0) return undefined;
  const first = p18[0] as {
    mainsnak?: { datavalue?: { value?: string } };
  };
  return first?.mainsnak?.datavalue?.value;
}

interface CommonsImageInfo {
  url: string;
  license?: string;
  author?: string;
  sourceUrl?: string;
}

/** Fetch image info (URL, license, author) for a Wikimedia Commons filename. */
async function fetchCommonsImageInfo(filename: string): Promise<CommonsImageInfo | undefined> {
  // Encode the filename — Commons uses "File:" prefix
  const encodedTitle = encodeURIComponent(`File:${filename}`);
  const apiUrl =
    `https://commons.wikimedia.org/w/api.php` +
    `?action=query&titles=${encodedTitle}` +
    `&prop=imageinfo` +
    `&iiprop=url|extmetadata` +
    `&iiextmetadatafilter=LicenseShortName|Artist|Credit` +
    `&format=json&origin=*`;

  try {
    const raw = await fetchJsonWithRetry(apiUrl);
    if (!raw) return undefined;
    const json = raw as {
      query?: {
        pages?: Record<
          string,
          {
            imageinfo?: Array<{
              url?: string;
              extmetadata?: {
                LicenseShortName?: { value: string };
                Artist?: { value: string };
                Credit?: { value: string };
              };
            }>;
          }
        >;
      };
    };
    const pages = json.query?.pages ?? {};
    const page = Object.values(pages)[0];
    if (!page) return undefined;
    const info = page.imageinfo?.[0];
    if (!info?.url) return undefined;

    // Strip HTML tags from author/credit fields and handle double-string artifacts
    const stripHtml = (s?: string) => {
      if (!s) return undefined;
      const clean = s.replace(/<[^>]+>/g, "").trim();
      // Handle cases like "Unknown artistUnknown artist" where the string concatenated itself
      const half = clean.length / 2;
      if (clean.length > 0 && clean.length % 2 === 0) {
        const firstHalf = clean.substring(0, half);
        const secondHalf = clean.substring(half);
        if (firstHalf === secondHalf) return firstHalf;
      }
      return clean;
    };

    return {
      url: info.url,
      license: info.extmetadata?.LicenseShortName?.value,
      author: stripHtml(info.extmetadata?.Artist?.value),
      sourceUrl: info.url,
    };
  } catch {
    return undefined;
  }
}

/**
 * Resolve the image for a Wikidata entity (P18 → Wikimedia Commons).
 * Always returns license + author so attribution can be displayed.
 */
async function resolveWikidataImage(qid: string): Promise<{
  imageUrl?: string;
  imageLicense?: string;
  imageAuthor?: string;
  imageSourceUrl?: string;
}> {
  try {
    const entity = await fetchEntity(qid);
    const filename = getImageFilename(entity);
    if (!filename) return {};
    const info = await fetchCommonsImageInfo(filename);
    if (!info) return {};
    return {
      imageUrl: info.url,
      imageLicense: info.license,
      imageAuthor: info.author,
      imageSourceUrl: info.sourceUrl,
    };
  } catch {
    return {};
  }
}

/**
 * Fetch Wikipedia title for a Q-ID via Wikidata.
 */
async function getWikipediaTitleForQid(qid: string): Promise<string | undefined> {
  try {
    const entity = await fetchEntity(qid);
    return getWikipediaTitle(entity);
  } catch {
    return undefined;
  }
}

/**
 * Check if the Wikidata label is a close-enough match to the expected name.
 * Normalises both strings (lowercase, strip punctuation, collapse whitespace)
 * and accepts the match if one contains the other or if they share 60%+ of
 * their words (handles "Aztec" matching "Aztec Empire" etc.).
 */
function labelMatchesExpected(label: string, expected: string): boolean {
  const norm = (s: string) =>
    s.toLowerCase().replace(/[–—\-]/g, " ").replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
  const l = norm(label);
  const e = norm(expected);
  if (l === e) return true;
  if (l.includes(e) || e.includes(l)) return true;
  // Word-overlap check (at least 60% of the shorter string's words appear in the longer)
  const lWords = new Set(l.split(" "));
  const eWords = e.split(" ");
  const overlap = eWords.filter(w => lWords.has(w)).length;
  return overlap / Math.min(lWords.size, eWords.length) >= 0.6;
}

function enrichShortSummary(summary: string, sections: WikiSection[], fallback: string): string {
  const base = (summary || fallback || "").trim();
  if (base.length >= 180) return base;
  if (sections.length === 0) return base;

  const first = sections[0]?.content?.trim() ?? "";
  if (!first) return base;
  if (first.toLowerCase().includes(base.toLowerCase())) return first;

  return `${base}\n\n${first}`.trim();
}

/**
 * Build the full place content (summary + image + attribution) for a Q-ID.
 * Called server-side; results are cached by Next.js fetch cache.
 *
 * LABEL GUARD: if the Wikidata entity's English label doesn't match
 * `fallbackName`, returns content with `labelMismatch: true` so the page
 * can show a graceful fallback rather than wrong content.
 */
export async function buildPlaceContent(qid: string, fallbackName: string, entityType: EntityType = "place"): Promise<PlaceContent> {
  const prebuilt = await getPrebuiltContentByQid(qid, entityType, fallbackName);
  if (prebuilt?.summary && (prebuilt.sections?.length ?? 0) > 0) return prebuilt;

  const [entity, imageData] = await Promise.all([
    fetchEntity(qid).catch(() => ({} as Record<string, unknown>)),
    resolveWikidataImage(qid),
  ]);

  // ── Label guard ──────────────────────────────────────────────────────────
  // Reject the entity if its English label doesn't match the expected name.
  // This prevents a wrong QID from rendering unrelated content.
  const labels = (entity.labels as Record<string, { value: string }>) ?? {};
  const wikidataLabel = labels["en"]?.value ?? "";
  if (wikidataLabel && !labelMatchesExpected(wikidataLabel, fallbackName)) {
    return {
      wikidataId: qid,
      entityType,
      name: fallbackName,
      summary: "",
      labelMismatch: true,
    };
  }

  const wikipediaTitle = getWikipediaTitle(entity);

  // Always derive the URL from the sitelink so the "Read on Wikipedia" button
  // works even when the content fetch fails.
  const sitelinkUrl = wikipediaTitle
    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaTitle).replace(/%20/g, "_")}`
    : undefined;

  let summary = prebuilt?.summary ?? "";
  let wikipediaUrl: string | undefined = sitelinkUrl;
  let sections: WikiSection[] = prebuilt?.sections ?? [];

  if (wikipediaTitle) {
    const { fetchWikipediaSummary, fetchWikipediaSections } = await import("./wikipedia");
    const [summaryResult, sectionsResult] = await Promise.allSettled([
      fetchWikipediaSummary(wikipediaTitle),
      fetchWikipediaSections(wikipediaTitle),
    ]);
    if (summaryResult.status === "fulfilled") {
      summary = summaryResult.value.summary;
      // Prefer the canonical URL returned by the API (follows redirects)
      wikipediaUrl = summaryResult.value.url ?? sitelinkUrl;
    } else {
      // Wikipedia fetch failed — fall back to Wikidata description
      const descriptions = (entity.descriptions as Record<string, { value: string }>) ?? {};
      summary = prebuilt?.summary || descriptions["en"]?.value || "";
    }
    if (sectionsResult.status === "fulfilled") {
      sections = sectionsResult.value;
    }

    const descriptions = (entity.descriptions as Record<string, { value: string }>) ?? {};
    const wikidataDescription = descriptions["en"]?.value ?? "";
    summary = enrichShortSummary(summary, sections, wikidataDescription);
  } else {
    // No enwiki sitelink — use Wikidata description
    const descriptions = (entity.descriptions as Record<string, { value: string }>) ?? {};
    summary = descriptions["en"]?.value ?? "";
  }

  // Safety net: if the live fetch produced no summary (e.g. transient network
  // failure at build time), fall back to the pre-built cache so the page is
  // never rendered blank.
  if (!summary?.trim() && prebuilt?.summary?.trim()) {
    summary = prebuilt.summary;
    wikipediaUrl = wikipediaUrl ?? prebuilt.wikipediaUrl;
  }

  // Derive a display name from entity labels
  const name = wikidataLabel || fallbackName;

  const keyFacts = await extractKeyFacts(entity, entityType);
  const tagline = buildTagline(entity, entityType, name);
  const representativeYear = extractRepresentativeYear(entity, entityType);

  return {
    wikidataId: qid,
    entityType,
    name,
    tagline,
    summary,
    keyFacts,
    wikipediaUrl,
    representativeYear,
    sections,
    ...imageData,
  };
}

/**
 * Build content for a non-place entity (person, event, culture).
 *
 * Unlike `buildPlaceContent` this function:
 *  - TRUSTS the provided QID — no label guard (the entity crosswalk is hand-curated)
 *  - Uses `entity.labels.en` as the display name so pages show "Cleopatra",
 *    not the kebab slug "cleopatra"
 *  - Derives the Wikipedia title from `entity.sitelinks.enwiki.title` (exact)
 *  - Follows a robust fallback chain:
 *      1. enwiki sitelink  → MediaWiki API (follows redirects automatically)
 *      2. Wikipedia fetch fails → Wikidata description (short, always present)
 *      3. No enwiki sitelink → Wikidata description
 *  - Always sets `wikipediaUrl` from the sitelink so "Read on Wikipedia" works
 *    even when the article fetch itself fails
 */
export async function buildEntityContent(
  qid: string,
  entityType: EntityType,
  /** Slug or any fallback label; only used if Wikidata labels are unavailable */
  fallbackName?: string,
): Promise<PlaceContent> {
  const prebuilt = await getPrebuiltContentByQid(qid, entityType, fallbackName);

  // If we have prebuilt content with a summary, still fetch Wikidata live for
  // key facts, tagline, representative year, and image (lightweight single-entity
  // fetch, cached by Next.js for one year). Summary + sections come from the cache.
  if (prebuilt?.summary) {
    const [entity, imageData] = await Promise.all([
      fetchEntity(qid).catch(() => ({} as Record<string, unknown>)),
      resolveWikidataImage(qid),
    ]);
    const labels = (entity.labels as Record<string, { value: string }>) ?? {};
    const keyFacts = await extractKeyFacts(entity, entityType);
    const tagline = buildTagline(entity, entityType, prebuilt.name);
    const representativeYear = extractRepresentativeYear(entity, entityType);
    return {
      ...prebuilt,
      name: labels["en"]?.value || prebuilt.name,
      tagline,
      keyFacts,
      representativeYear,
      ...imageData,
    };
  }

  const [entity, imageData] = await Promise.all([
    fetchEntity(qid).catch(() => ({} as Record<string, unknown>)),
    resolveWikidataImage(qid),
  ]);

  const labels       = (entity.labels       as Record<string, { value: string }>) ?? {};
  const descriptions = (entity.descriptions as Record<string, { value: string }>) ?? {};
  const sitelinks    = (entity.sitelinks    as Record<string, { title: string }>) ?? {};

  // Prefer Wikidata English label; fall back to the provided slug/name
  const name = labels["en"]?.value || fallbackName || qid;
  const wikidataDescription = descriptions["en"]?.value ?? "";

  // Exact Wikipedia article title from the sitelink (avoids guessing)
  const enwikiTitle = sitelinks["enwiki"]?.title;

  // Build the Wikipedia URL from the sitelink so the button always works
  const sitelinkUrl = enwikiTitle
    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(enwikiTitle).replace(/%20/g, "_")}`
    : undefined;

  let summary = "";
  let wikipediaUrl: string | undefined = sitelinkUrl;
  let sections: WikiSection[] = [];

  if (enwikiTitle) {
    const { fetchWikipediaSummary, fetchWikipediaSections } = await import("./wikipedia");
    const [summaryResult, sectionsResult] = await Promise.allSettled([
      fetchWikipediaSummary(enwikiTitle),
      fetchWikipediaSections(enwikiTitle),
    ]);
    if (summaryResult.status === "fulfilled") {
      summary = summaryResult.value.summary;
      wikipediaUrl = summaryResult.value.url ?? sitelinkUrl;
    } else {
      // Fallback: Wikidata description (always short but always present)
      summary = wikidataDescription;
    }
    if (sectionsResult.status === "fulfilled") {
      sections = sectionsResult.value;
    }

    summary = enrichShortSummary(summary, sections, wikidataDescription);
  } else {
    // No enwiki sitelink at all
    summary = wikidataDescription;
  }

  const keyFacts = await extractKeyFacts(entity, entityType);
  const tagline = buildTagline(entity, entityType, name);
  const representativeYear = extractRepresentativeYear(entity, entityType);

  return {
    wikidataId: qid,
    entityType,
    name,
    tagline,
    summary,
    keyFacts,
    wikipediaUrl,
    representativeYear,
    sections,
    ...imageData,
  };
}

// ---------------------------------------------------------------------------
// Key-fact extraction helpers
// ---------------------------------------------------------------------------

type EntityClaims = Record<string, Array<{
  mainsnak?: {
    datavalue?: {
      type?: string;
      value?: unknown;
    };
  };
  rank?: string;
}>>;

/** Extract the preferred or first claim value for a property. */
function getClaimValue(claims: EntityClaims, prop: string): unknown | undefined {
  const list = claims[prop];
  if (!list || list.length === 0) return undefined;
  // Prefer "preferred" rank
  const preferred = list.find(c => c.rank === "preferred") ?? list[0];
  return preferred?.mainsnak?.datavalue?.value;
}

/** Render a Wikidata time value as a human-readable year string. */
function timeValueToYear(val: unknown): string | undefined {
  if (!val || typeof val !== "object") return undefined;
  const tv = val as { time?: string; precision?: number };
  if (!tv.time) return undefined;
  // time format: "+YYYY-MM-DDTHH:MM:SSZ" or "-YYYY-MM-DDTHH:MM:SSZ"
  const m = tv.time.match(/^([+-])(\d+)-(\d{2})-/);
  if (!m) return undefined;
  const sign = m[1] === "-" ? -1 : 1;
  const year = parseInt(m[2], 10) * sign;
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return "1 BCE";
  return `${year} CE`;
}

/** Render a Wikidata entity-id value as a label. */
async function entityValueToLabel(val: unknown): Promise<string | undefined> {
  if (!val || typeof val !== "object") return undefined;
  const ev = val as { "entity-type"?: string; id?: string };
  if (!ev.id) return undefined;
  try {
    const entity = await fetchEntity(ev.id);
    const labels = (entity.labels as Record<string, { value: string }>) ?? {};
    return labels["en"]?.value;
  } catch {
    return undefined;
  }
}

/** Extract structured key facts from a Wikidata entity. */
async function extractKeyFacts(entity: Record<string, unknown>, entityType: EntityType): Promise<KeyFact[]> {
  const claims = (entity.claims as EntityClaims) ?? {};
  const facts: KeyFact[] = [];

  // Properties to try per entity type (in display order)
  const propertyMap: Record<EntityType, Array<[string, string]>> = {
    place: [
      ["P571", "Founded"],
      ["P576", "Dissolved"],
      ["P36",  "Capital"],
      ["P35",  "Head of state"],
      ["P17",  "Country"],
      ["P910", "Part of"],
      ["P155", "Preceded by"],
      ["P156", "Followed by"],
    ],
    person: [
      ["P569", "Born"],
      ["P570", "Died"],
      ["P19",  "Place of birth"],
      ["P20",  "Place of death"],
      ["P106", "Occupation"],
      ["P27",  "Citizenship"],
      ["P22",  "Father"],
      ["P25",  "Mother"],
    ],
    event: [
      ["P585", "Date"],
      ["P580", "Start"],
      ["P582", "End"],
      ["P17",  "Country"],
      ["P276", "Location"],
    ],
    culture: [
      ["P571", "Founded"],
      ["P576", "Dissolved"],
      ["P17",  "Country"],
      ["P276", "Location"],
      ["P910", "Part of"],
    ],
  };

  for (const [prop, label] of propertyMap[entityType] ?? []) {
    const val = getClaimValue(claims, prop);
    if (!val) continue;
    const valObj = val as { type?: string; "entity-type"?: string };
    let value: string | undefined;
    if (typeof val === "object" && "time" in (val as object)) {
      value = timeValueToYear(val);
    } else if (typeof val === "object" && "entity-type" in (val as object)) {
      value = await entityValueToLabel(val);
    } else if (typeof val === "string" || typeof val === "number") {
      value = String(val);
    }
    if (value) facts.push({ label, value });
  }
  return facts;
}

/** Build a short tagline, e.g. "Empire · 550 BCE – 330 BCE". */
function buildTagline(entity: Record<string, unknown>, entityType: EntityType, _name: string): string | undefined {
  const claims = (entity.claims as EntityClaims) ?? {};
  const parts: string[] = [];

  const typeLabels: Record<EntityType, string> = {
    place: "Empire / Polity",
    person: "Historical figure",
    event: "Event",
    culture: "Culture / Topic",
  };
  parts.push(typeLabels[entityType]);

  const startVal = getClaimValue(claims, "P571") ?? getClaimValue(claims, "P580") ?? getClaimValue(claims, "P569");
  const endVal   = getClaimValue(claims, "P576") ?? getClaimValue(claims, "P582") ?? getClaimValue(claims, "P570");
  const startYear = startVal ? timeValueToYear(startVal) : undefined;
  const endYear   = endVal   ? timeValueToYear(endVal)   : undefined;

  if (startYear && endYear) parts.push(`${startYear} – ${endYear}`);
  else if (startYear) parts.push(`from ${startYear}`);
  else if (endYear)   parts.push(`until ${endYear}`);

  return parts.join(" · ");
}

/** Extract a representative "see on the map" year from an entity. */
function extractRepresentativeYear(entity: Record<string, unknown>, _entityType: EntityType): number | undefined {
  const claims = (entity.claims as EntityClaims) ?? {};
  // Try inception, then start, then date of birth
  for (const prop of ["P571", "P580", "P569", "P585"]) {
    const val = getClaimValue(claims, prop);
    if (!val || typeof val !== "object") continue;
    const tv = val as { time?: string };
    if (!tv.time) continue;
    const m = tv.time.match(/^([+-])(\d+)-/);
    if (!m) continue;
    const sign = m[1] === "-" ? -1 : 1;
    return parseInt(m[2], 10) * sign;
  }
  return undefined;
}
