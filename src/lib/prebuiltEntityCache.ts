import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { EntityType, PlaceContent } from "@/types";

interface PrebuiltEntityEntry {
  qid: string;
  entityType: EntityType;
  name: string;
  summary: string;
  sections?: Array<{ heading: string; content: string }>;
  wikipediaUrl?: string;
}

interface PrebuiltEntityCacheFile {
  entries?: Record<string, PrebuiltEntityEntry>;
}

let cachePromise: Promise<PrebuiltEntityCacheFile | null> | null = null;

async function loadCacheFile(): Promise<PrebuiltEntityCacheFile | null> {
  try {
    const path = join(process.cwd(), "public/data/entity-cache.json");
    const text = await readFile(path, "utf8");
    return JSON.parse(text) as PrebuiltEntityCacheFile;
  } catch {
    return null;
  }
}

/** Decode HTML entities and strip citation/reference artifacts from cached text. */
function cleanCachedText(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
    .replace(/\[(?:\s*\d+\s*)+\]/g, "")
    .replace(/\[\s*edit\s*\]/gi, "")
    .replace(/(^|\s)\^[^\n]*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function getPrebuiltContentByQid(
  qid: string,
  entityType: EntityType,
  fallbackName?: string,
): Promise<PlaceContent | null> {
  if (!cachePromise) cachePromise = loadCacheFile();
  const cache = await cachePromise;
  const entry = cache?.entries?.[qid];
  if (!entry) return null;
  if (entry.entityType !== entityType) return null;

  return {
    wikidataId: qid,
    entityType,
    name: entry.name || fallbackName || qid,
    summary: cleanCachedText(entry.summary || ""),
    wikipediaUrl: entry.wikipediaUrl,
    keyFacts: [],
    sections: (entry.sections || []).map(s => ({
      heading: s.heading,
      content: cleanCachedText(s.content),
    })),
  };
}
