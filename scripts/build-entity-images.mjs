#!/usr/bin/env node
/**
 * Builds public/data/entity-images.json — up to MAX_IMAGES freely licensed
 * images per page, taken from the page's English Wikipedia article in article
 * order, with the article's captions and full attribution.
 *
 * Licensing rules (deliberately conservative):
 *   - Only files hosted on Wikimedia Commons. Wikipedia's locally hosted
 *     "fair use" files are not on Commons, so they are never picked up.
 *   - Only public domain, CC0, CC BY and CC BY-SA licenses (any version).
 *     GFDL-only, "no derivatives", "non-commercial" and anything else is skipped.
 *   - Files Commons flags as non-free or with extra restrictions (trademark,
 *     insignia, personality rights, …) are skipped.
 *   - Every kept image records author, license name + URL and the Commons file
 *     page, which the site shows next to the image (what CC BY/BY-SA require).
 * Flags, coats of arms, logos, icons, signatures and SVG diagrams are skipped,
 * as are small images.
 *
 *   node scripts/build-entity-images.mjs           # only pages not yet done
 *   node scripts/build-entity-images.mjs --full    # redo everything
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CACHE_PATH = path.join(ROOT, "public/data/entity-cache.json");
const OUT_PATH = path.join(ROOT, "public/data/entity-images.json");
const USER_AGENT = "BordersOfTime/1.0 (https://www.bordersoftime.com; entity-image-build)";
const MAX_IMAGES = 6;
const MIN_SIDE = 400;
const THUMB_WIDTH = 900;
const FULL = process.argv.includes("--full");

const ALLOWED_LICENSE = /^(public domain|pd\b|pd-|cc0|cc[ -]by(-sa)?[ -]\d(\.\d)?)/i;
const SKIP_FILE = /flag|coat[ _]of[ _]arms|\bcoa\b|emblem|seal[ _]of|logo|icon|signature|autograph|symbol|blank|locator|location[ _]map|question[ _]book|wiki|disambig|commons-logo|edit-clear|padlock/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  for (const delay of [0, 1000, 3000, 8000, 15000]) {
    if (delay) await sleep(delay);
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" }, signal: AbortSignal.timeout(30000) });
      if (res.ok) return await res.json();
      if (res.status === 404) return null;
      console.warn(`  HTTP ${res.status} ${url.slice(0, 90)}…`);
    } catch (err) {
      console.warn(`  ${err.message} ${url.slice(0, 90)}…`);
    }
  }
  return null;
}

const stripHtml = (s) =>
  String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1) > n / 2 ? s.lastIndexOf(" ", n - 1) : n - 1) + "…");

const cleanUrl = (u) => (u ? u.replace(/\?utm_[^#]*$/, "") : u);

/** Article media in order, with captions. */
async function mediaList(title) {
  const data = await fetchJson(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replace(/ /g, "_"))}`);
  return (data?.items ?? [])
    .filter((it) => it.type === "image" && it.showInGallery !== false && it.title)
    .map((it) => ({ file: it.title, caption: stripHtml(it.caption?.text) }))
    .filter((it) => !/\.(svg|gif)$/i.test(it.file) && !SKIP_FILE.test(it.file));
}

/** Commons metadata for up to 50 files; files not on Commons come back missing. */
async function commonsInfo(files) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    `&iiprop=url|size|mime|extmetadata&iiurlwidth=${THUMB_WIDTH}` +
    "&iiextmetadatafilter=LicenseShortName|LicenseUrl|Artist|Restrictions|NonFree|ImageDescription" +
    `&titles=${files.map(encodeURIComponent).join("|")}`;
  const data = await fetchJson(url);
  const byTitle = new Map();
  const norm = new Map((data?.query?.normalized ?? []).map((n) => [n.to, n.from]));
  for (const page of Object.values(data?.query?.pages ?? {})) {
    if (page.missing !== undefined || page.imagerepository !== "local") continue; // "local" = hosted on Commons itself
    const info = page.imageinfo?.[0];
    if (info) byTitle.set(norm.get(page.title) ?? page.title, info);
  }
  return byTitle;
}

function vet(info) {
  const m = info.extmetadata ?? {};
  const license = stripHtml(m.LicenseShortName?.value);
  if (!ALLOWED_LICENSE.test(license)) return { reason: `license "${license || "none"}"` };
  if (/true/i.test(m.NonFree?.value ?? "")) return { reason: "non-free" };
  if (stripHtml(m.Restrictions?.value)) return { reason: `restrictions "${stripHtml(m.Restrictions.value)}"` };
  if (!/^image\/(jpeg|png|tiff|webp)$/.test(info.mime ?? "")) return { reason: info.mime };
  if (Math.min(info.width ?? 0, info.height ?? 0) < MIN_SIDE) return { reason: "too small" };
  const isPd = /public domain|^pd|cc0/i.test(license);
  const author = truncate(stripHtml(m.Artist?.value), 90);
  // CC licenses must name their author; skip CC files with no real author on record.
  if (!isPd && (!author || /^unknown/i.test(author))) return { reason: "CC file without author" };
  return {
    image: {
      thumb: cleanUrl(info.thumburl),
      width: info.thumbwidth,
      height: info.thumbheight,
      author,
      license,
      licenseUrl: m.LicenseUrl?.value || undefined,
      sourceUrl: info.descriptionurl,
      description: truncate(stripHtml(m.ImageDescription?.value), 200),
    },
  };
}

async function main() {
  const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")).entries ?? {};
  let out = {};
  if (!FULL && fs.existsSync(OUT_PATH)) out = JSON.parse(fs.readFileSync(OUT_PATH, "utf8")).entries ?? {};
  const todo = Object.values(cache).filter((e) => e.wikipediaUrl && (FULL || !out[e.qid]));
  console.log(`${todo.length} pages to process (${Object.keys(out).length} already done)`);
  const rejected = {};
  let n = 0;
  for (const e of todo) {
    const title = decodeURIComponent(e.wikipediaUrl.split("/wiki/")[1]).replace(/_/g, " ");
    const media = (await mediaList(title)).slice(0, 40);
    const infos = media.length ? await commonsInfo(media.map((m) => m.file)) : new Map();
    const kept = [];
    for (const m of media) {
      const info = infos.get(m.file);
      if (!info) { rejected["not on Commons"] = (rejected["not on Commons"] ?? 0) + 1; continue; }
      const v = vet(info);
      if (!v.image) { const k = v.reason.replace(/".*"/, (x) => x.slice(0, 30)); rejected[k] = (rejected[k] ?? 0) + 1; continue; }
      kept.push({ file: m.file.replace(/^File:/, ""), caption: truncate(m.caption, 220) || undefined, ...v.image });
      if (kept.length >= MAX_IMAGES) break;
    }
    out[e.qid] = kept;
    n++;
    console.log(`  ${e.entityType}:${e.name} — ${kept.length}/${media.length} kept`);
    if (n % 20 === 0) fs.writeFileSync(OUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), entries: out }));
    await sleep(400);
  }
  fs.writeFileSync(OUT_PATH, JSON.stringify({ generatedAt: new Date().toISOString(), entries: out }));
  const total = Object.values(out).reduce((a, l) => a + l.length, 0);
  console.log(`\nWrote ${OUT_PATH}: ${total} images for ${Object.keys(out).length} pages`);
  console.log("Skipped (top reasons):", Object.entries(rejected).sort((a, b) => b[1] - a[1]).slice(0, 12));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
