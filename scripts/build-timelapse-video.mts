/**
 * Renders the "borders over time" time-lapses (src/data/timelapses.ts) from
 * the year-by-year data in public/timelapse-data (scripts/build-cliopatria-timelapse.mts):
 *
 *  - public/timelapse/{slug}-wide.webp (1600×900): the hub card and share
 *    image, at the region's cover year;
 *  - videos/{slug}.mp4: a vertical 1080×1920 video, one frame per year with a
 *    short pause on each big change, for YouTube Shorts, TikTok and Reels.
 *    videos/ is git-ignored; the files are for posting, not for the site.
 *
 * Usage: npx tsx scripts/build-timelapse-video.mts [slug…] [--no-video] [--no-cover]
 * Needs Google Chrome (CHROME=/path to override) and an internet connection
 * (base map tiles and fonts). Encodes with ffmpeg-static.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer, { type Browser, type Page } from "puppeteer-core";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";
import { MAP } from "../src/lib/palette";
import { BASE_STYLE } from "../src/lib/mapBaseStyle";
import { createTimelapse, timelapseLayers, type TimelapseData, type YearFeatures } from "../src/lib/timelapseData";
import { TIMELAPSES, atYear, formatYear, type Bbox, type Timelapse, type TimelapseFacts } from "../src/data/timelapses";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const args = process.argv.slice(2);
const only = args.filter((a) => !a.startsWith("--"));
const makeVideo = !args.includes("--no-video");
const makeCover = !args.includes("--no-cover");
// PREVIEW=1821 saves just that year's video frame to .cache/timelapse-preview/{slug}.png, to check framing.
const PREVIEW = process.env.PREVIEW ? Number(process.env.PREVIEW) : null;

const FACTS = JSON.parse(readFileSync(join(ROOT, "src/data/timelapseFacts.json"), "utf8")) as Record<string, TimelapseFacts>;
// Captions measured on the portrait frame, where it differs from the page's (scripts/build-cliopatria-timelapse.mts).
const videoFactsPath = join(ROOT, ".cache/cliopatria/video-facts.json");
const VIDEO_FACTS = (existsSync(videoFactsPath) ? JSON.parse(readFileSync(videoFactsPath, "utf8")) : {}) as Record<string, TimelapseFacts>;

/** The slice of the MapLibre API the page scripts use (the library is injected into the page, not imported). */
interface PageMap {
  on(type: string, fn: (e: { error?: Error }) => void): void;
  once(type: string, fn: () => void): void;
  addSource(id: string, source: object): void;
  addLayer(layer: object): void;
  getSource(id: string): { setData(data: unknown): void };
}
type PageWindow = Window & { map: PageMap; maplibregl: { Map: new (options: object) => PageMap } };

// Video timing, at 30 fps: one frame per year, a pause on each big change.
const FPS = 30;
const FIRST_HOLD = 45;
const LAST_HOLD = 60;
const END_CARD = 75;
/** Keep videos under three minutes (the YouTube Shorts limit). */
const MAX_SECONDS = 172;

/**
 * Videos whose map is a wide band across the middle of the portrait frame (in
 * CSS px from the top), for regions too wide to fill it: a map can't show more
 * than one world's width, so a full-height world map would cut off Asia.
 */
const BANDS: Record<string, { top: number; height: number }> = { world: { top: 292, height: 400 } };

const CROPS = {
  wide: { width: 1280, height: 720, scale: 1.25 },
  tall: { width: 540, height: 960, scale: 2 },
} as const;
type CropName = keyof typeof CROPS;

const lib = readFileSync(join(ROOT, "node_modules/maplibre-gl/dist/maplibre-gl.js"), "utf8");

/** A page holding one map, framed on the bbox, ready for draw(). */
async function openMap(browser: Browser, crop: CropName, bbox: Bbox, band?: { top: number; height: number }): Promise<Page> {
  const c = CROPS[crop];
  const page = await browser.newPage();
  if (process.env.DEBUG) {
    page.on("console", (m) => console.log("  [page]", m.text()));
    page.on("pageerror", (e) => console.log("  [page error]", (e as Error).message));
  }
  await page.setViewport({ width: c.width, height: c.height, deviceScaleFactor: c.scale });
  await page.setContent(`<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500&family=Geist+Mono:wght@500&display=block" rel="stylesheet">
<style>
  html,body{margin:0;background:${MAP.sea};}
  #m{position:absolute;${band ? `left:0;right:0;top:${band.top}px;height:${band.height}px` : "inset:0"}}
  #o{position:absolute;inset:0;pointer-events:none;display:none;font-family:Fraunces,Georgia,serif;color:#0f1726}
  .top{position:absolute;left:0;right:0;top:0;padding:46px 30px 70px;background:linear-gradient(#eef0f2 0%,#eef0f2 62%,rgba(238,240,242,0) 100%)}
  .kicker{font:500 11px/1 "Geist Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:#2346a0}
  .title{font-weight:300;font-size:34px;line-height:1.05;margin-top:10px;letter-spacing:-.01em}
  .range{font:500 12px/1 "Geist Mono",monospace;letter-spacing:.08em;color:#4b5568;margin-top:10px}
  .year{position:absolute;left:30px;top:190px;font-weight:500;font-size:70px;line-height:1;letter-spacing:-.02em;color:#0f1726;text-shadow:0 0 18px #eef0f2,0 0 6px #eef0f2;font-variant-numeric:tabular-nums}
  .era{font-size:26px;font-weight:300;margin-left:6px}
  .bar{position:absolute;left:30px;right:30px;top:275px;height:3px;background:rgba(15,23,38,.15);border-radius:2px}
  .bar i{display:block;height:100%;background:#d2462a;border-radius:2px}
  .bottom{position:absolute;left:0;right:0;bottom:0;padding:70px 30px 150px;background:linear-gradient(rgba(238,240,242,0),#eef0f2 45%)}
  .cap{font-size:15px;line-height:1.35;color:#1d2638;margin-top:12px}
  .cap:first-child{margin-top:0}
  .cap b{font:500 10px/1 "Geist Mono",monospace;letter-spacing:.16em;text-transform:uppercase;color:#2346a0;display:block;margin-bottom:6px}
  .site{font:500 13px/1 "Geist Mono",monospace;letter-spacing:.1em;color:#2346a0;margin-top:16px}
  .end{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:rgba(238,240,242,.86)}
  .end .t{font-weight:300;font-size:36px;line-height:1.1;padding:0 30px}
  .end .u{font:500 16px/1 "Geist Mono",monospace;letter-spacing:.08em;color:#2346a0;margin-top:22px}
</style></head><body><div id="m"></div><div id="o"></div></body></html>`);
  await page.addScriptTag({ content: lib });
  await page.evaluate(
    (style: object, bbox: Bbox, layers: object[]) =>
      new Promise<void>((resolve) => {
        const w = window as unknown as PageWindow;
        const map = new w.maplibregl.Map({
          container: "m", style, bounds: [[bbox[0], bbox[1]], [bbox[2], bbox[3]]], fitBoundsOptions: { padding: 12 },
          interactive: false, attributionControl: false, fadeDuration: 0, canvasContextAttributes: { preserveDrawingBuffer: true },
          renderWorldCopies: false,
        });
        w.map = map;
        map.on("load", () => {
          const empty = { type: "FeatureCollection", features: [] };
          map.addSource("t", { type: "geojson", data: empty });
          map.addSource("lab", { type: "geojson", data: empty });
          for (const layer of layers) map.addLayer(layer);
          map.once("idle", () => resolve());
        });
        map.on("error", (e: { error?: Error }) => console.log("map error", e.error?.message));
      }),
    BASE_STYLE as object, bbox, timelapseLayers(MAP) as unknown as object[],
  );
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return page;
}

async function draw(page: Page, f: YearFeatures) {
  // Chrome doesn't draw background tabs, so the map would never go idle.
  await page.bringToFront();
  await page.evaluate(
    (borders, labels) =>
      new Promise<void>((resolve) => {
        const map = (window as unknown as PageWindow).map;
        map.getSource("t").setData(borders);
        map.getSource("lab").setData(labels);
        map.once("idle", () => setTimeout(resolve, 60));
      }),
    f.borders as unknown as object, f.labels as unknown as object,
  );
}

const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

/** Screenshot just the overlay (title, year, caption) on a transparent background. */
async function overlayPng(page: Page, html: string): Promise<Buffer> {
  await page.evaluate((html) => {
    const o = document.getElementById("o")!;
    o.style.display = "block";
    o.innerHTML = html;
    document.getElementById("m")!.style.visibility = "hidden";
    document.documentElement.style.background = document.body.style.background = "transparent";
  }, html);
  const png = Buffer.from(await page.screenshot({ type: "png", omitBackground: true }));
  await page.evaluate(() => {
    document.getElementById("o")!.style.display = "none";
    document.getElementById("m")!.style.visibility = "";
    document.documentElement.style.background = document.body.style.background = "";
  });
  return png;
}

/** The overlay without the year and progress bar, which are drawn per frame from sprites (see yearSprites). */
function overlayHtml(t: Timelapse, facts: TimelapseFacts, year: number) {
  const leader = atYear(facts.leaders, year);
  const top3 = (leader?.largest ?? []).slice(0, 3).map((r) => esc(r.name)).join(" · ");
  const ev = atYear(facts.events, year);
  const recent = ev && year - ev.year <= 25 ? ev : null;
  const change = recent
    ? [
        recent.appeared.length ? `New: ${recent.appeared.slice(0, 3).map((n) => esc(n.name)).join(", ")}` : "",
        recent.gone.length ? `Gone: ${recent.gone.slice(0, 3).map((n) => esc(n.name)).join(", ")}` : "",
      ].filter(Boolean).join("<br>")
    : "";
  return `<div class="top"><div class="kicker">Borders of Time</div>
    <div class="title">${esc(t.possessive)} borders,<br>every year</div>
    <div class="range">${esc(formatYear(facts.from))} → ${facts.to}</div></div>
    <div class="bottom">
      ${change ? `<div class="cap"><b>In ${esc(formatYear(recent!.year))}</b>${change}</div>` : ""}
      <div class="cap"><b>Largest on the map</b>${top3}</div>
      <div class="site">bordersoftime.com</div></div>`;
}

/**
 * Screenshotting the overlay for each of ~4,000 years is slow, so the year is
 * assembled from pictures of each digit (the figures are tabular, so equally
 * wide) and the progress bar from two rectangles. Positions in device pixels.
 */
async function yearSprites(page: Page) {
  const s = CROPS.tall.scale;
  const P = 14; // room for the text glow
  await page.evaluate(() => {
    const o = document.getElementById("o")!;
    o.style.display = "block";
    o.innerHTML = '<div class="year"><span id="d">0</span><span class="era" id="e">BCE</span></div>';
    document.getElementById("m")!.style.visibility = "hidden";
    document.documentElement.style.background = document.body.style.background = "transparent";
  });
  const rect = (id: string) => page.$eval(`#${id}`, (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const d = await rect("d");
  const e = await rect("e");
  const clip = (r: { x: number; y: number; w: number; h: number }) => ({ x: r.x - P, y: r.y - P, width: r.w + 2 * P, height: r.h + 2 * P });
  // Each picture holds only its own text: the clips' margins overlap the neighbour.
  const show = (id: string, on: boolean) => page.$eval(`#${id}`, (el, on) => { (el as HTMLElement).style.visibility = on ? "" : "hidden"; }, on);
  await show("e", false);
  const digits: Buffer[] = [];
  for (const c of "0123456789") {
    await page.$eval("#d", (el, c) => { el.textContent = c; }, c);
    digits.push(Buffer.from(await page.screenshot({ type: "png", omitBackground: true, clip: clip(d) })));
  }
  await show("e", true);
  await show("d", false);
  const era = Buffer.from(await page.screenshot({ type: "png", omitBackground: true, clip: clip(e) }));
  await page.evaluate(() => {
    document.getElementById("o")!.style.display = "none";
    document.getElementById("m")!.style.visibility = "";
    document.documentElement.style.background = document.body.style.background = "";
  });
  const bar = { left: 30 * s, top: 275 * s, width: (CROPS.tall.width - 60) * s, height: 3 * s };
  const rectPng = (width: number, height: number, background: { r: number; g: number; b: number; alpha: number }) =>
    sharp({ create: { width: Math.max(1, Math.round(width)), height, channels: 4, background } }).png().toBuffer();
  const barBack = await rectPng(bar.width, bar.height, { r: 15, g: 23, b: 38, alpha: 0.15 });

  /** The composite layers for one year's counter and progress. */
  return async (year: number, progress: number) => {
    const num = String(Math.abs(year));
    const layers: { input: Buffer; left: number; top: number }[] = [...num].map((c, i) => ({
      input: digits[+c], left: Math.round((d.x + i * d.w - P) * s), top: Math.round((d.y - P) * s),
    }));
    if (year < 0) layers.push({ input: era, left: Math.round((d.x + num.length * d.w + (e.x - d.x - d.w) - P) * s), top: Math.round((e.y - P) * s) });
    layers.push({ input: barBack, left: bar.left, top: bar.top });
    if (progress > 0) layers.push({ input: await rectPng(bar.width * progress, bar.height, { r: 210, g: 70, b: 42, alpha: 1 }), left: bar.left, top: bar.top });
    return layers;
  };
}

const endHtml = (t: Timelapse) =>
  `<div class="end"><div class="t">Explore every year of ${esc(t.label)} on the map</div><div class="u">bordersoftime.com</div></div>`;

const shot = async (page: Page) => Buffer.from(await page.screenshot({ type: "png" }));

/** An ffmpeg process taking raw RGB frames on stdin. */
function encoder(out: string, width: number, height: number) {
  const p = spawn(ffmpeg as unknown as string, [
    "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${width}x${height}`, "-r", String(FPS), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "slow", "-movflags", "+faststart", out,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise<void>((resolve, reject) => p.on("close", (code) => (code ? reject(new Error(`ffmpeg exited ${code}`)) : resolve())));
  return {
    write: (frame: Buffer) => new Promise<void>((resolve) => (p.stdin.write(frame) ? resolve() : p.stdin.once("drain", () => resolve()))),
    end: () => { p.stdin.end(); return done; },
  };
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"], protocolTimeout: 120_000 });

for (const t of TIMELAPSES.filter((t) => !only.length || only.includes(t.slug))) {
  if ((t.videoBbox ?? t.tallBbox) && !VIDEO_FACTS[t.slug]) throw new Error(`No video captions for ${t.slug}: run scripts/build-cliopatria-timelapse.mts`);
  const facts = VIDEO_FACTS[t.slug] ?? FACTS[t.slug];
  if (!facts) throw new Error(`No facts for ${t.slug}: run scripts/build-cliopatria-timelapse.mts`);
  const data = JSON.parse(readFileSync(join(ROOT, "public/timelapse-data", `${t.slug}.json`), "utf8")) as TimelapseData;
  const tl = createTimelapse(data);

  if (PREVIEW !== null) {
    const tall = await openMap(browser, "tall", t.videoBbox ?? t.tallBbox ?? t.bbox, BANDS[t.slug]);
    await draw(tall, tl.at(PREVIEW));
    const map = await shot(tall);
    const overlay = await overlayPng(tall, overlayHtml(t, facts, PREVIEW));
    mkdirSync(join(ROOT, ".cache/timelapse-preview"), { recursive: true });
    await sharp(map).composite([{ input: overlay }]).toFile(join(ROOT, ".cache/timelapse-preview", `${t.slug}.png`));
    console.log(`${t.slug}: preview ${formatYear(PREVIEW)}`);
    await tall.close();
    continue;
  }
  if (makeCover) {
    const wide = await openMap(browser, "wide", t.bbox);
    await draw(wide, tl.at(t.cover));
    mkdirSync(join(ROOT, "public/timelapse"), { recursive: true });
    const { size } = await sharp(await shot(wide)).webp({ quality: 72 }).toFile(join(ROOT, "public/timelapse", `${t.slug}-wide.webp`));
    console.log(`${t.slug}: cover ${formatYear(t.cover)} (${Math.round(size / 1024)} KB)`);
    await wide.close();
  }
  if (!makeVideo) continue;

  const tall = await openMap(browser, "tall", t.videoBbox ?? t.tallBbox ?? t.bbox, BANDS[t.slug]);
  const W = CROPS.tall.width * CROPS.tall.scale;
  const H = CROPS.tall.height * CROPS.tall.scale;
  mkdirSync(join(ROOT, "videos"), { recursive: true });
  const mp4 = join(ROOT, "videos", `${t.slug}.mp4`);
  const enc = encoder(mp4, W, H);

  const years: number[] = [];
  for (let y = facts.from; y <= facts.to; y++) if (y !== 0) years.push(y);
  const eventYears = new Set(facts.events.map((e) => e.year));
  const budget = MAX_SECONDS * FPS - years.length - FIRST_HOLD - LAST_HOLD - END_CARD;
  const pause = Math.max(0, Math.min(4, Math.floor(budget / Math.max(1, eventYears.size))));

  const counter = await yearSprites(tall);
  const overlays = new Map<string, Buffer>(); // the captions change far less often than the year
  let key = "";
  let map: Buffer | null = null; // raw RGB
  let frames = 0;
  const started = Date.now();
  for (const [i, year] of years.entries()) {
    const k = tl.keyAt(year);
    if (k !== key || !map) {
      await draw(tall, tl.at(year));
      map = await sharp(await shot(tall)).removeAlpha().raw().toBuffer();
      key = k;
    }
    const html = overlayHtml(t, facts, year);
    if (!overlays.has(html)) overlays.set(html, await overlayPng(tall, html));
    const frame = await sharp(map, { raw: { width: W, height: H, channels: 3 } })
      .composite([{ input: overlays.get(html)!, left: 0, top: 0 }, ...(await counter(year, i / (years.length - 1)))])
      .removeAlpha()
      .raw()
      .toBuffer();
    const n = i === 0 ? FIRST_HOLD : i === years.length - 1 ? LAST_HOLD : 1 + (eventYears.has(year) ? pause : 0);
    for (let h = 0; h < n; h++) await enc.write(frame);
    frames += n;
    if (i % 25 === 0) {
      const eta = ((Date.now() - started) / (i + 1)) * (years.length - i - 1);
      process.stdout.write(`\r${t.slug} ${formatYear(year)} (${i + 1}/${years.length}, ~${Math.round(eta / 60000)} min left)   `);
    }
  }
  const endCard = await overlayPng(tall, endHtml(t));
  const last = await sharp(map!, { raw: { width: W, height: H, channels: 3 } }).composite([{ input: endCard }]).removeAlpha().raw().toBuffer();
  for (let h = 0; h < END_CARD; h++) await enc.write(last);
  frames += END_CARD;
  await enc.end();
  console.log(`\n${t.slug}: ${mp4} (${(frames / FPS).toFixed(1)} s)`);
  await tall.close();
}
await browser.close();
