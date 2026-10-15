/**
 * Renders the homepage hero's map frames — one image per moment in
 * src/data/heroMoments.ts, in two crops (wide and tall) — so the homepage can
 * show the animated atlas without loading MapLibre.
 *
 * Usage: start the site (npm run build && npm start, or npm run dev), then
 *   SITE=http://localhost:3000 node scripts/build-hero-frames.mjs
 * Needs Google Chrome installed (CHROME=/path/to/chrome to override).
 * Writes public/hero/{year}-wide.webp and public/hero/{year}-tall.webp.
 */
import { readFileSync, mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const SITE = process.env.SITE ?? "http://localhost:3000";
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "public/hero";

// Keep in step with src/data/heroMoments.ts and src/lib/palette.ts (NIGHT_MAP).
const YEARS = [...readFileSync("src/data/heroMoments.ts", "utf8").matchAll(/year:\s*(-?\d+)/g)].map((m) => Number(m[1]));
const NIGHT = { sea: "#0b1424", land: "#14203a", coast: "#2a3a5e", border: "#9fb7ff" };

const CROPS = [
  { name: "wide", width: 1600, height: 900, scale: 1.25, center: [38, 24], zoom: 1.75 },
  { name: "tall", width: 430, height: 860, scale: 2, center: [52, 34], zoom: 1.15 },
];

const style = {
  version: 8,
  sources: { maplibre: { type: "vector", url: "https://demotiles.maplibre.org/tiles/tiles.json" } },
  layers: [
    { id: "ocean", type: "background", paint: { "background-color": NIGHT.sea } },
    { id: "land", type: "fill", source: "maplibre", "source-layer": "countries", paint: { "fill-color": NIGHT.land } },
    { id: "coast", type: "line", source: "maplibre", "source-layer": "countries", paint: { "line-color": NIGHT.coast, "line-width": 0.6 } },
  ],
};

mkdirSync(OUT, { recursive: true });
const lib = readFileSync("node_modules/maplibre-gl/dist/maplibre-gl.js", "utf8");
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

for (const year of YEARS) {
  const data = await (await fetch(`${SITE}/api/snapshot/${year}?lite=1`)).json();
  for (const c of CROPS) {
    const page = await browser.newPage();
    await page.setViewport({ width: c.width, height: c.height, deviceScaleFactor: c.scale });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:${NIGHT.sea}"><div id="m" style="position:absolute;inset:0"></div></body></html>`);
    await page.addScriptTag({ content: lib });
    await page.evaluate(
      (style, data, c, border) =>
        new Promise((resolve) => {
          const map = new maplibregl.Map({ container: "m", style, center: c.center, zoom: c.zoom, interactive: false, attributionControl: false, fadeDuration: 0, canvasContextAttributes: { preserveDrawingBuffer: true } });
          map.on("load", () => {
            map.addSource("t", { type: "geojson", data });
            map.addLayer({ id: "f", type: "fill", source: "t", paint: { "fill-color": ["get", "_color"], "fill-opacity": 0.5 } });
            map.addLayer({ id: "l", type: "line", source: "t", paint: { "line-color": border, "line-width": 0.7, "line-opacity": 0.38 } });
            map.once("idle", () => setTimeout(resolve, 300));
          });
        }),
      style, data, c, NIGHT.border,
    );
    const png = await page.screenshot({ type: "png" });
    const file = `${OUT}/${year}-${c.name}.webp`;
    const info = await sharp(png).webp({ quality: 72 }).toFile(file);
    console.log(file, Math.round(info.size / 1024) + " KB");
    await page.close();
  }
}
await browser.close();
