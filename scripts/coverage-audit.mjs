#!/usr/bin/env node
/**
 * World History Atlas — Coverage Audit (Step 1 of data-gap-filling plan)
 *
 * For every locally-cached snapshot GeoJSON, reports:
 *   - Feature count, total covered area (sq°), % missing key fields
 *   - Per-continent breakdown
 *   - Largest individual features
 *
 * Outputs:
 *   public/data/coverage-report.json
 *   public/data/coverage-dashboard.html
 *
 * Usage:
 *   node scripts/coverage-audit.mjs
 *   node scripts/coverage-audit.mjs --fetch-all   # also downloads uncached years
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");
const DATA_DIR  = join(ROOT, "public", "data");
const RAW_BASE  = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";

// ── Continent bounding boxes [minLon, minLat, maxLon, maxLat] ─────────────
const CONTINENTS = [
  { name: "Europe",        bbox: [-30,  34,  50,  72] },
  { name: "Asia",          bbox: [ 26, -10, 180,  77] },
  { name: "Africa",        bbox: [-18, -35,  52,  38] },
  { name: "North America", bbox: [-170, 15, -50,  85] },
  { name: "South America", bbox: [-82, -56, -34,  15] },
  { name: "Oceania",       bbox: [110, -50, 180,   0] },
  { name: "Antarctica",    bbox: [-180,-90, 180, -60] },
];

// ── Era buckets ──────────────────────────────────────────────────────────
const ERAS = [
  { name: "Deep Antiquity", test: y => y <= -3000 },
  { name: "Antiquity",      test: y => y > -3000 && y <= 500 },
  { name: "Medieval",       test: y => y > 500   && y <= 1400 },
  { name: "Early Modern",   test: y => y > 1400  && y <= 1800 },
  { name: "Modern",         test: y => y > 1800 },
];

// ── Geometry helpers ─────────────────────────────────────────────────────

function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a) / 2;
}

function geometryArea(geom) {
  if (!geom) return 0;
  if (geom.type === "Polygon")
    return geom.coordinates.reduce((s, r) => s + ringArea(r), 0);
  if (geom.type === "MultiPolygon")
    return geom.coordinates.reduce((s, p) => s + p.reduce((ss, r) => ss + ringArea(r), 0), 0);
  return 0;
}

function bboxCentroid(geom) {
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  const rings =
    geom.type === "Polygon"      ? geom.coordinates :
    geom.type === "MultiPolygon" ? geom.coordinates.flat() : [];
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
  if (!isFinite(minLon)) return [0, 0];
  return [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
}

function assignContinent(geom) {
  const [lon, lat] = bboxCentroid(geom);
  for (const { name, bbox: [x0, y0, x1, y1] } of CONTINENTS) {
    if (lon >= x0 && lon <= x1 && lat >= y0 && lat <= y1) return name;
  }
  return "Unknown";
}

// ── Audit a single FeatureCollection ────────────────────────────────────

function auditSnapshot(year, fc) {
  const features = fc.features ?? [];
  const total = features.length;
  let missingName = 0, missingSovereign = 0, missingDates = 0;
  let totalArea = 0;
  const byCont = {};
  const bySource = {};
  const byConf = { high: 0, medium: 0, low: 0 };
  const topFeatures = [];

  for (const f of features) {
    const p = f.properties ?? {};
    const name     = p.name || p.NAME || "";
    const sovereign= p.sovereign || p.SUBJECTO || "";
    const validFrom= p.validFrom ?? p.VALIDFROM ?? null;
    const validTo  = p.validTo   ?? p.VALIDTO   ?? null;
    const area     = geometryArea(f.geometry);
    const conf     = p.confidence ?? "unknown";
    const src      = p.source     ?? "historical-basemaps";

    if (!name)      missingName++;
    if (!sovereign) missingSovereign++;
    if (validFrom === null || validTo === null) missingDates++;

    totalArea += area;

    const cont = assignContinent(f.geometry);
    if (!byCont[cont]) byCont[cont] = { featureCount: 0, totalArea: 0 };
    byCont[cont].featureCount++;
    byCont[cont].totalArea += area;

    bySource[src] = (bySource[src] ?? 0) + 1;
    if (conf === "high" || conf === "medium" || conf === "low") byConf[conf]++;

    topFeatures.push({ name: name || "(unnamed)", area });
  }

  topFeatures.sort((a, b) => b.area - a.area);

  return {
    year,
    era: (ERAS.find(e => e.test(year)) ?? { name: "Unknown" }).name,
    featureCount: total,
    totalAreaSqDeg: parseFloat(totalArea.toFixed(2)),
    missingName,
    missingSovereign,
    missingDates,
    missingNamePct:      total ? parseFloat((missingName      / total * 100).toFixed(1)) : 0,
    missingSovereignPct: total ? parseFloat((missingSovereign / total * 100).toFixed(1)) : 0,
    missingDatesPct:     total ? parseFloat((missingDates     / total * 100).toFixed(1)) : 0,
    byContinent: byCont,
    bySource,
    byConfidence: byConf,
    top5Features: topFeatures.slice(0, 5).map(f => ({
      name: f.name,
      areaSqDeg: parseFloat(f.area.toFixed(2)),
    })),
  };
}

// ── HTML dashboard ───────────────────────────────────────────────────────

function buildDashboard(snapshots) {
  const rows = snapshots.map(s => {
    const confBar = [
      `<span style="background:#4ade80;opacity:.7;width:${s.byConfidence.high   / (s.featureCount||1) * 80}px;display:inline-block;height:8px;border-radius:2px"></span>`,
      `<span style="background:#facc15;opacity:.7;width:${s.byConfidence.medium / (s.featureCount||1) * 80}px;display:inline-block;height:8px;border-radius:2px"></span>`,
      `<span style="background:#f87171;opacity:.7;width:${s.byConfidence.low    / (s.featureCount||1) * 80}px;display:inline-block;height:8px;border-radius:2px"></span>`,
    ].join("");

    const yearLabel = s.year < 0 ? `${Math.abs(s.year)} BCE` : `${s.year} CE`;
    return `<tr>
      <td>${yearLabel}</td>
      <td>${s.era}</td>
      <td>${s.featureCount}</td>
      <td>${s.totalAreaSqDeg.toLocaleString()}</td>
      <td>${s.missingNamePct}%</td>
      <td>${s.missingSovereignPct}%</td>
      <td>${s.missingDatesPct}%</td>
      <td>${confBar}</td>
      <td>${Object.keys(s.bySource).join(", ")}</td>
    </tr>`;
  }).join("\n");

  const eraSummary = {};
  for (const s of snapshots) {
    const e = s.era;
    if (!eraSummary[e]) eraSummary[e] = { count: 0, totalFeatures: 0, totalArea: 0 };
    eraSummary[e].count++;
    eraSummary[e].totalFeatures += s.featureCount;
    eraSummary[e].totalArea += s.totalAreaSqDeg;
  }
  const eraRows = Object.entries(eraSummary).map(([era, d]) =>
    `<tr><td>${era}</td><td>${d.count}</td><td>${Math.round(d.totalFeatures / d.count)}</td><td>${Math.round(d.totalArea / d.count).toLocaleString()}</td></tr>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Coverage Dashboard — World History Atlas</title>
<style>
  body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 2rem; }
  h1 { color: #f8fafc; margin-bottom: 0.25rem; }
  .subtitle { color: #64748b; margin-bottom: 2rem; font-size: .9rem; }
  table { border-collapse: collapse; width: 100%; font-size: .85rem; }
  th { background: #1e293b; color: #94a3b8; text-align: left; padding: .5rem .75rem; font-weight: 600; }
  td { padding: .4rem .75rem; border-bottom: 1px solid #1e293b; }
  tr:hover td { background: #1e293b; }
  h2 { margin-top: 2.5rem; color: #cbd5e1; }
  .legend { display: flex; gap: 1.5rem; margin-bottom: 1rem; font-size: .8rem; color: #94a3b8; }
  .dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 4px; }
</style>
</head>
<body>
<h1>Coverage Dashboard</h1>
<p class="subtitle">Generated ${new Date().toISOString()} &nbsp;·&nbsp;
  ${snapshots.length} snapshots audited
</p>

<div class="legend">
  <span><span class="dot" style="background:#4ade80;opacity:.9"></span>High confidence</span>
  <span><span class="dot" style="background:#facc15;opacity:.9"></span>Medium confidence</span>
  <span><span class="dot" style="background:#f87171;opacity:.9"></span>Low confidence</span>
</div>

<h2>All snapshots</h2>
<table>
  <thead>
    <tr>
      <th>Year</th><th>Era</th><th>Features</th><th>Area (sq°)</th>
      <th>Missing name</th><th>Missing sovereign</th><th>Missing dates</th>
      <th>Confidence (H/M/L)</th><th>Sources</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>

<h2>Summary by era</h2>
<table>
  <thead>
    <tr><th>Era</th><th>Snapshots</th><th>Avg features</th><th>Avg area (sq°)</th></tr>
  </thead>
  <tbody>${eraRows}</tbody>
</table>
</body>
</html>`;
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const fetchAll = process.argv.includes("--fetch-all");

  // Read manifest to get the full year list
  const manifestPath = join(DATA_DIR, "year-manifest.json");
  if (!existsSync(manifestPath)) {
    console.error("year-manifest.json not found — run the pipeline first.");
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const allYears = manifest.snapshotYears ?? [];

  console.log(`Auditing ${allYears.length} snapshot years...`);

  const results = [];
  let fetched = 0, skipped = 0;

  for (const year of allYears) {
    const localPath = join(DATA_DIR, `snapshot-${year}-borders.geojson`);

    let fc;
    if (existsSync(localPath)) {
      fc = JSON.parse(readFileSync(localPath, "utf8"));
    } else if (fetchAll) {
      const filename = year < 0 ? `world_bc${Math.abs(year)}.geojson` : `world_${year}.geojson`;
      const url = `${RAW_BASE}/${filename}`;
      process.stdout.write(`  Fetching ${year}…`);
      const res = await fetch(url, { headers: { "User-Agent": "WorldHistoryAtlas/1.0" } });
      if (!res.ok) { console.log(` ${res.status} skip`); skipped++; continue; }
      fc = await res.json();
      fetched++;
      console.log(` ${fc.features?.length ?? 0} features`);
    } else {
      skipped++;
      continue; // not cached, skip unless --fetch-all
    }

    results.push(auditSnapshot(year, fc));
  }

  console.log(`\nAudited ${results.length} snapshots (${fetched} fetched, ${skipped} skipped — run with --fetch-all to include all)`);

  // Write JSON report
  const report = {
    generatedAt: new Date().toISOString(),
    snapshotsAudited: results.length,
    snapshotsTotal: allYears.length,
    note: skipped > 0 ? `${skipped} snapshots not cached locally — re-run with --fetch-all for full report` : undefined,
    snapshots: results,
    eraSummary: ERAS.map(era => {
      const eraSnaps = results.filter(r => era.test(r.year));
      return {
        era: era.name,
        snapshotsAudited: eraSnaps.length,
        avgFeatureCount: eraSnaps.length
          ? Math.round(eraSnaps.reduce((s, r) => s + r.featureCount, 0) / eraSnaps.length) : 0,
        avgAreaSqDeg: eraSnaps.length
          ? parseFloat((eraSnaps.reduce((s, r) => s + r.totalAreaSqDeg, 0) / eraSnaps.length).toFixed(1)) : 0,
        avgMissingNamePct: eraSnaps.length
          ? parseFloat((eraSnaps.reduce((s, r) => s + r.missingNamePct, 0) / eraSnaps.length).toFixed(1)) : 0,
      };
    }),
  };

  const reportPath = join(DATA_DIR, "coverage-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nWrote: ${reportPath}`);

  const dashPath = join(DATA_DIR, "coverage-dashboard.html");
  writeFileSync(dashPath, buildDashboard(results));
  console.log(`Wrote: ${dashPath}`);

  // Print a quick console summary
  console.log("\n── Quick summary ────────────────────────────────────────────");
  for (const era of ERAS) {
    const eraSnaps = results.filter(r => era.test(r.year));
    if (!eraSnaps.length) continue;
    const avgF = Math.round(eraSnaps.reduce((s, r) => s + r.featureCount, 0) / eraSnaps.length);
    const avgM = (eraSnaps.reduce((s, r) => s + r.missingNamePct, 0) / eraSnaps.length).toFixed(1);
    console.log(`  ${era.name.padEnd(16)} ${eraSnaps.length} snapshots  avg ${avgF} features  ${avgM}% missing names`);
  }
  console.log("");
}

main().catch(e => { console.error("Audit failed:", e); process.exit(1); });
