import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** A freely licensed image vetted by scripts/build-entity-images.mjs. */
export interface EntityImage {
  file: string;
  thumb: string;
  width: number;
  height: number;
  caption?: string;
  description?: string;
  author?: string;
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
}

let filePromise: Promise<Record<string, EntityImage[]>> | null = null;

async function load(): Promise<Record<string, EntityImage[]>> {
  try {
    const text = await readFile(join(process.cwd(), "public/data/entity-images.json"), "utf8");
    return (JSON.parse(text) as { entries?: Record<string, EntityImage[]> }).entries ?? {};
  } catch {
    return {};
  }
}

/** Images for a page, minus the one already used as its hero image. */
export async function getEntityImages(qid: string, heroUrl?: string): Promise<EntityImage[]> {
  if (!filePromise) filePromise = load();
  const all = (await filePromise)[qid] ?? [];
  const heroFile = heroUrl ? decodeURIComponent(heroUrl.split("/").pop() ?? "").split("?")[0].replace(/_/g, " ") : "";
  return all.filter((img) => !heroFile || !heroFile.endsWith(img.file.replace(/_/g, " ")));
}
