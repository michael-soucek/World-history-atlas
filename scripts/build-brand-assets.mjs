/**
 * Renders the favicon PNGs, favicon.ico, apple-touch icon, PWA icons and the
 * default social-sharing image from public/favicon.svg and a hero frame.
 *   node scripts/build-brand-assets.mjs
 * Needs Google Chrome (CHROME=/path/to/chrome to override) for the social image.
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import puppeteer from "puppeteer-core";

const svg = readFileSync("public/favicon.svg");
const png = (size) => sharp(svg, { density: 72 * (size / 64) * 2 }).resize(size, size).png().toBuffer();

for (const [file, size] of [["public/favicon-32.png", 32], ["public/icon-192.png", 192], ["public/icon-512.png", 512]]) {
  writeFileSync(file, await png(size));
  console.log(file);
}
// Apple touch icons get no transparency and their own rounded mask.
writeFileSync(
  "public/apple-touch-icon.png",
  await sharp(svg, { density: 600 }).resize(180, 180).flatten({ background: "#0b1424" }).png().toBuffer(),
);
console.log("public/apple-touch-icon.png");

// favicon.ico: PNG-compressed entries at 16, 32 and 48 px.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
const ico = Buffer.concat([header, ...images]);
writeFileSync("src/app/favicon.ico", ico);
console.log("src/app/favicon.ico");

// Social image: 1200×630, hero map frame + wordmark.
const frame = readFileSync("public/hero/1279-wide.webp").toString("base64");
const mark = svg.toString().replace(/<rect[^>]*\/>/, "");
const html = `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=Geist+Mono:wght@400&display=block" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;background:#0b1424;color:#eef0f2;font-family:Fraunces,serif;overflow:hidden;position:relative}
  .map{position:absolute;inset:0;background:url(data:image/webp;base64,${frame}) 62% 40%/cover}
  .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,20,36,.97) 0%,rgba(11,20,36,.85) 42%,rgba(11,20,36,.15) 75%,rgba(11,20,36,.05) 100%)}
  .c{position:absolute;left:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;width:640px}
  .brand{display:flex;align-items:center;gap:16px;font-size:30px;letter-spacing:-.01em}
  .brand svg{width:48px;height:48px}
  h1{margin:46px 0 0;font-weight:300;font-size:82px;line-height:1;letter-spacing:-.035em}
  h1 em{color:#9fb7ff}
  p{margin:30px 0 0;font-family:'Geist Mono',monospace;font-size:19px;letter-spacing:.14em;text-transform:uppercase;color:#9fb7ff}
</style></head><body>
<div class="map"></div><div class="shade"></div>
<div class="c">
  <div class="brand">${mark.replace("<svg ", '<svg width="48" height="48" ')}<span>Borders <em>of</em> Time</span></div>
  <h1>Watch the world <em>redraw</em> itself.</h1>
  <p>An atlas of five thousand years</p>
</div></body></html>`;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
const shot = await page.screenshot({ type: "png" });
await browser.close();
await sharp(shot).jpeg({ quality: 84, mozjpeg: true }).toFile("public/og-image.jpg");
console.log("public/og-image.jpg");
