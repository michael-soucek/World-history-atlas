import { load } from "cheerio";

const WIKI_USER_AGENT = "WorldHistoryAtlas/1.0 (wikipedia-content)";
const LONG_REVALIDATE_SECONDS = 31536000;

export interface WikipediaSummaryResponse {
  summary: string;
  url: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

export interface WikipediaSection {
  heading: string;
  content: string;
}

export interface WikipediaSearchSummary {
  title: string;
  summary: string;
  url: string;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWikipediaJson(url: string): Promise<Record<string, unknown> | null> {
  const delays = [0, 300, 900];

  for (const delayMs of delays) {
    if (delayMs > 0) await sleep(delayMs);

    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: {
          Accept: "application/json",
          "User-Agent": WIKI_USER_AGENT,
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
      // transient network issue; retry
    }
  }

  return null;
}

async function fetchWikipediaRestSummary(title: string): Promise<WikipediaSummaryResponse | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const json = await fetchWikipediaJson(url);
  if (!json || typeof json !== "object") return null;

  const typed = json as {
    extract?: string;
    content_urls?: { desktop?: { page?: string } };
  };

  const summary = normalizeWikipediaText(typed.extract ?? "");
  if (!summary) return null;

  return {
    summary,
    url:
      typed.content_urls?.desktop?.page ??
      `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`,
  };
}

/**
 * Fetch the English Wikipedia lead section for a page title.
 *
 * Uses the MediaWiki TextExtracts + info APIs instead of the REST v1 summary
 * endpoint because:
 *  - `redirects=1`  automatically follows page redirects (REST v1 can 404)
 *  - `exintro=1`    returns the entire lead section, not just the first sentence
 *  - `explaintext=1` strips wiki markup to clean plain text
 *  - `inprop=url`   returns the canonical page URL (no guessing needed)
 *
 * Cached server-side for 24 h.
 */
export async function fetchWikipediaSummary(
  title: string
): Promise<WikipediaSummaryResponse> {
  const encoded = encodeURIComponent(title);
  const apiUrl =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query&titles=${encoded}` +
    `&prop=extracts|info` +
    `&exintro=1&explaintext=1` +
    `&inprop=url&redirects=1` +
    `&format=json&origin=*` +
    `&atlas_clean=${CLEAN_PIPELINE_VERSION}`;

  const raw = await fetchWikipediaJson(apiUrl);
  if (!raw) {
    const fallback = await fetchWikipediaRestSummary(title);
    if (fallback) return fallback;
    throw new Error(`Wikipedia API failed for "${title}"`);
  }

  const json = raw as {
    query?: {
      redirects?: Array<{ from: string; to: string }>;
      pages?: Record<string, {
        pageid?: number;
        missing?: "";
        extract?: string;
        fullurl?: string;
      }>;
    };
  };

  const pages = json.query?.pages ?? {};
  const page = Object.values(pages)[0];

  if (!page || "missing" in page) {
    const fallback = await fetchWikipediaRestSummary(title);
    if (fallback) return fallback;
    throw new Error(`Wikipedia page not found: "${title}"`);
  }

  const extract = normalizeWikipediaText(page.extract ?? "");
  const url =
    page.fullurl ??
    `https://en.wikipedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`;

  if (extract.length >= 120) {
    return { summary: extract, url };
  }

  const fallback = await fetchWikipediaRestSummary(title);
  if (fallback?.summary) return fallback;

  return { summary: extract, url };
}

/**
 * Best-effort search fallback used when we have no verified QID match.
 * Returns the top Wikipedia result summary for the query, when available.
 */
export async function fetchWikipediaSearchSummary(
  query: string,
): Promise<WikipediaSearchSummary | null> {
  const q = query.trim();
  if (!q) return null;

  const searchUrl =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query&list=search&srsearch=${encodeURIComponent(q)}` +
    `&srlimit=1&format=json&origin=*` +
    `&atlas_clean=${CLEAN_PIPELINE_VERSION}`;

  try {
    const raw = await fetchWikipediaJson(searchUrl);
    if (!raw) return null;

    const json = raw as {
      query?: {
        search?: Array<{ title?: string }>;
      };
    };

    const title = json.query?.search?.[0]?.title?.trim();
    if (!title) return null;

    const summary = await fetchWikipediaSummary(title);
    return { title, summary: summary.summary, url: summary.url };
  } catch {
    return null;
  }
}

// Section headings to include (in priority order). Any heading whose
// lowercase form contains one of these keywords is selected.
const SECTION_KEYWORDS = [
  "origin",
  "history",
  "rise",
  "formation",
  "establishment",
  "foundation",
  "early",
  "background",
  "expansion",
  "height",
  "golden age",
  "peak",
  "decline",
  "fall",
  "collapse",
  "legacy",
  "culture",
  "government",
  "economy",
  "religion",
  "military",
];

const MAX_SECTION_CHARS = 1200;
const MAX_SECTIONS = 5;
const CLEAN_PIPELINE_VERSION = "2";

function normalizeWikipediaText(text: string): string {
  return text
    // Remove citation markers and edit links that can survive text extraction.
    .replace(/\[(?:\s*\d+\s*)+\]/g, "")
    .replace(/\[\s*edit\s*\]/gi, "")
    // Drop hatnote-style text if it still appears in plain text.
    .replace(/(^|\n)\s*Main article:\s*[^\n]*/gi, "")
    .replace(/(^|\n)\s*See also:\s*[^\n]*/gi, "")
    // Normalize whitespace and punctuation spacing.
    .replace(/[\t\f\v\u00a0]+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncateAtBoundary(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;

  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length > 1) {
    const kept: string[] = [];
    let total = 0;
    for (const p of paragraphs) {
      const next = kept.length > 0 ? total + 2 + p.length : total + p.length;
      if (next > maxChars) break;
      kept.push(p);
      total = next;
    }
    if (kept.length > 0) return kept.join("\n\n");
  }

  const slice = text.slice(0, maxChars);
  const sentenceCut = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? ")
  );
  if (sentenceCut > Math.floor(maxChars * 0.55)) {
    return slice.slice(0, sentenceCut + 1).trim();
  }

  const wordCut = slice.lastIndexOf(" ");
  if (wordCut > Math.floor(maxChars * 0.75)) {
    return slice.slice(0, wordCut).trim();
  }

  return slice.trim();
}

function extractCleanSectionText(html: string, heading: string): string {
  const $ = load(html);

  // Remove non-content and metadata blocks before extracting text.
  $(
    [
      "script",
      "style",
      "table",
      "figure",
      "figcaption",
      "sup.reference",
      ".reference",
      ".reflist",
      ".mw-editsection",
      ".hatnote",
      ".shortdescription",
      ".infobox",
      ".thumbcaption",
      ".gallery",
      ".gallerytext",
      ".navbox",
      ".metadata",
      ".coordinates",
      ".geo-inline",
      ".geo-default",
      ".mw-empty-elt",
      "#coordinates",
    ].join(",")
  ).remove();

  const blocks = $("p, li")
    .toArray()
    .map(el => $(el).text())
    .map(t => normalizeWikipediaText(t))
    .filter(Boolean)
    .filter(t => !/^Main article:/i.test(t));

  const fallback = normalizeWikipediaText($.root().text());
  let content = blocks.length > 0 ? blocks.join("\n\n") : fallback;

  if (heading) {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const headingPrefix = new RegExp(`^${escapedHeading}(?:\\s*[:.\\-–—])?\\s*`, "i");
    content = content.replace(headingPrefix, "");
  }

  content = normalizeWikipediaText(content);
  return truncateAtBoundary(content, MAX_SECTION_CHARS);
}

/**
 * Fetch key article sections for a Wikipedia page title using the
 * MediaWiki parse API. Returns up to MAX_SECTIONS curated sections
 * (filtered by SECTION_KEYWORDS), each capped at MAX_SECTION_CHARS.
 * Cached server-side for 24 h.
 */
export async function fetchWikipediaSections(title: string): Promise<WikipediaSection[]> {
  const encoded = encodeURIComponent(title);
  // Use the parse API with prop=sections to get the section list, then
  // prop=text for the HTML, then strip tags to get plain text.
  const sectionsUrl =
    `https://en.wikipedia.org/w/api.php` +
      `?action=parse&page=${encoded}&prop=sections&redirects=1&format=json&origin=*` +
      `&atlas_clean=${CLEAN_PIPELINE_VERSION}`;

  try {
    const raw = await fetchWikipediaJson(sectionsUrl);
    if (!raw) return [];

    const json = raw as {
      parse?: {
        sections?: Array<{
          toclevel: number;
          line: string;
          index: string;
        }>;
      };
    };

    const allSections = json.parse?.sections ?? [];
    // Only top-level sections (toclevel 1), filtered by keyword
    const selected = allSections
      .filter(s => s.toclevel === 1)
      .filter(s => {
        const lower = s.line.toLowerCase().replace(/<[^>]+>/g, "");
        return SECTION_KEYWORDS.some(kw => lower.includes(kw));
      })
      .slice(0, MAX_SECTIONS);

    if (selected.length === 0) return [];

    // Fetch section HTML, sanitize once server-side, and cache the clean text.
    const results = await Promise.all(
      selected.map(async (sec): Promise<WikipediaSection | null> => {
        const secUrl =
          `https://en.wikipedia.org/w/api.php` +
          `?action=parse&page=${encoded}&prop=text&section=${sec.index}` +
          `&redirects=1&format=json&origin=*` +
          `&atlas_clean=${CLEAN_PIPELINE_VERSION}`;
        try {
          const rawSec = await fetchWikipediaJson(secUrl);
          if (!rawSec) return null;
          const j = rawSec as { parse?: { text?: { "*"?: string } } };
          const html = j.parse?.text?.["*"] ?? "";
          const heading = sec.line.replace(/<[^>]+>/g, "").trim();
          const plain = extractCleanSectionText(html, heading);
          return plain.length > 80 ? { heading, content: plain } : null;
        } catch {
          return null;
        }
      })
    );

    return results.filter((s): s is WikipediaSection => s !== null);
  } catch {
    return [];
  }
}
