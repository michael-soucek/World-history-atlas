#!/usr/bin/env node
/**
 * World History Atlas — Data Pipeline (v3)
 * Reads available snapshots from GitHub, simplifies with mapshaper,
 * computes polylabel anchors + area-rank, optionally merges OHM data,
 * tiles with tippecanoe, and writes public/data/year-manifest.json.
 *
 * Usage:
 *   node scripts/pipeline.mjs [--year 1700] [--all] [--tiles] [--ohm]
 *
 * --ohm  Fetch country-level features from OpenHistoricalMap and merge them
 *        (CE years only; OHM data tagged source=OHM, confidence=high).
 *        Merge rule: OHM feature wins if its normalised name matches an
 *        existing feature AND its confidence is >= the existing one.
 *        Otherwise the OHM feature is appended (supplementing coverage).
 */

import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { tmpdir } from "os";
import { createHash } from "crypto";
import { fetchOHMForYear } from "./ohm-fetch.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "data");
mkdirSync(OUT_DIR, { recursive: true });

const RAW_BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const REPO_CONTENTS_URL = "https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson";

function parseFilename(name) {
  const ce = name.match(/^world_(\d+)\.geojson$/);
  if (ce) return parseInt(ce[1], 10);
  const bce = name.match(/^world_bc(\d+)\.geojson$/);
  if (bce) return -parseInt(bce[1], 10);
  return null;
}

function yearToFilename(year) {
  return year < 0 ? `world_bc${Math.abs(year)}.geojson` : `world_${year}.geojson`;
}

async function fetchSnapshotYears() {
  console.log("  Fetching snapshot index from GitHub...");
  const res = await fetch(REPO_CONTENTS_URL, {
    headers: { "User-Agent": "WorldHistoryAtlas/1.0", Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) throw new Error("GitHub API returned " + res.status);
  const files = await res.json();
  const years = files.map(f => parseFilename(f.name)).filter(y => y !== null);
  years.sort((a, b) => a - b);
  console.log("  Found " + years.length + " snapshots (" + years[0] + " ... " + years[years.length - 1] + ")");
  return years;
}

async function fetchSnapshot(year) {
  const url = RAW_BASE + "/" + yearToFilename(year);
  console.log("  GET " + url);
  const res = await fetch(url, { headers: { "User-Agent": "WorldHistoryAtlas/1.0" } });
  if (!res.ok) { console.warn("  ! " + year + ": " + res.status + " -- skip"); return null; }
  return res.json();
}

function simplify(inPath, outPath) {
  try { execSync("mapshaper --version", { stdio: "ignore" }); }
  catch { console.warn("  ! mapshaper not found (npm i -g mapshaper)"); return false; }
  const cmd = "mapshaper \"" + inPath + "\" -simplify visvalingam 5% keep-shapes -snap -o \"" + outPath + "\" format=geojson";
  try { execSync(cmd, { stdio: "pipe" }); return true; }
  catch (e) { console.warn("  ! mapshaper failed: " + e.message); return false; }
}

let _polylabel = null;
async function polylabelPoint(rings) {
  if (!_polylabel) {
    try { const m = await import("polylabel"); _polylabel = m.default ?? m; }
    catch { return null; }
  }
  try { return _polylabel(rings, 0.5); } catch { return null; }
}

function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a) / 2;
}

function geometryArea(geom) {
  if (!geom) return 0;
  if (geom.type === "Polygon") return geom.coordinates.reduce((s, r) => s + ringArea(r), 0);
  if (geom.type === "MultiPolygon") return geom.coordinates.reduce((s, p) => s + p.reduce((ss, r) => ss + ringArea(r), 0), 0);
  return 0;
}

function stableId(year, name) {
  return createHash("sha1").update(year + "::" + name).digest("hex").slice(0, 12);
}

function normaliseSovereign(s) {
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

async function enrichFeature(feature, snapshotYear, validTo, sourceOverride, confidenceOverride) {
  const props = feature.properties || {};
  const name = props.NAME || props.name || "Unknown";
  const sovereign = props.SUBJECTO || props.sovereign || name;
  const sovereignColorKey = normaliseSovereign(sovereign);
  const precision = [1, 2, 3].includes(props.BORDERPRECISION ?? props.precision) ? (props.BORDERPRECISION ?? props.precision) : 1;
  const id = stableId(snapshotYear, name);
  const area = geometryArea(feature.geometry);
  const rank = area > 0 ? Math.min(8, Math.floor(Math.log10(area * 1000))) : 0;

  // Source and confidence
  const source     = sourceOverride     ?? props.source     ?? "historical-basemaps";
  const confidence = confidenceOverride ?? props.confidence ?? (precision === 3 ? "high" : precision === 2 ? "medium" : "low");

  let labelPoint = null;
  if (feature.geometry) {
    if (feature.geometry.type === "Polygon") {
      const pt = await polylabelPoint(feature.geometry.coordinates);
      if (pt) labelPoint = { type: "Point", coordinates: [pt[0], pt[1]] };
    } else if (feature.geometry.type === "MultiPolygon") {
      let biggest = null, biggestArea = 0;
      for (const poly of feature.geometry.coordinates) {
        const a = ringArea(poly[0]);
        if (a > biggestArea) { biggestArea = a; biggest = poly; }
      }
      if (biggest) {
        const pt = await polylabelPoint(biggest);
        if (pt) labelPoint = { type: "Point", coordinates: [pt[0], pt[1]] };
      }
    }
  }

  return {
    type: "Feature",
    id,
    properties: { id, name, sovereign, sovereignColorKey, source, confidence, precision, validFrom: snapshotYear, validTo, area, rank },
    geometry: feature.geometry,
    _labelPoint: labelPoint,
  };
}

async function buildEnrichedCollections(raw, snapshotYear, validTo) {
  const enriched = await Promise.all(raw.features.map(f => enrichFeature(f, snapshotYear, validTo)));
  const borders = { type: "FeatureCollection", features: enriched.map(({ _labelPoint, ...f }) => f) };
  const labels  = {
    type: "FeatureCollection",
    features: enriched.filter(f => f._labelPoint).map(f => ({
      type: "Feature",
      id: f.id + "_lbl",
      properties: { name: f.properties.name, sovereign: f.properties.sovereign, sovereignColorKey: f.properties.sovereignColorKey, rank: f.properties.rank, area: f.properties.area },
      geometry: f._labelPoint,
    })),
  };
  return { borders, labels };
}

// ── OHM merge (Step 3–4) ─────────────────────────────────────────────────────

const CONF_RANK = { high: 2, medium: 1, low: 0 };

/**
 * Merge OHM features into the existing enriched border collection.
 *
 * Conflict rule (from the data-gap-filling plan):
 *   Higher confidence wins, then higher precision, then more specific period.
 *
 * - If an OHM feature's normalised name matches an existing feature AND the OHM
 *   confidence is >= existing confidence: replace the existing feature with the
 *   OHM-enriched one.
 * - Otherwise: append the OHM feature (supplements coverage in blank areas).
 *
 * The sources of both features are recorded in the winning feature's properties
 *   as `mergedSources` (array) so the About page can cite them.
 */
async function mergeWithOHM(enrichedBorders, ohmFC, snapshotYear, validTo) {
  if (!ohmFC.features.length) return enrichedBorders;

  // Index existing features by normalised name
  const byName = new Map();
  for (let i = 0; i < enrichedBorders.features.length; i++) {
    const p = enrichedBorders.features[i].properties;
    const key = normaliseSovereign(p.name);
    byName.set(key, i);
  }

  const result = [...enrichedBorders.features];
  let replaced = 0, appended = 0;

  for (const ohmRaw of ohmFC.features) {
    const enriched = await enrichFeature(ohmRaw, snapshotYear, validTo, "OHM", "high");
    const { _labelPoint, ...f } = enriched;

    const key = normaliseSovereign(f.properties.name);
    const existingIdx = byName.get(key);

    if (existingIdx !== undefined) {
      const existing = result[existingIdx].properties;
      const ohmConfRank  = CONF_RANK[f.properties.confidence] ?? 0;
      const exstConfRank = CONF_RANK[existing.confidence]      ?? 0;
      const ohmPrecision  = f.properties.precision ?? 1;
      const exstPrecision = existing.precision      ?? 1;

      // Replace if OHM wins on confidence or (equal confidence and higher precision)
      const ohmWins = ohmConfRank > exstConfRank ||
        (ohmConfRank === exstConfRank && ohmPrecision > exstPrecision);

      if (ohmWins) {
        f.properties.mergedSources = [existing.source, "OHM"];
        result[existingIdx] = f;
        replaced++;
      }
      // If existing wins: keep it but record OHM as a corroborating source
      else {
        result[existingIdx].properties.mergedSources = [
          existing.source, "OHM",
        ];
      }
    } else {
      // No name match: append (fills new territory)
      result.push(f);
      byName.set(key, result.length - 1);
      appended++;
    }
  }

  console.log(`  OHM merge: ${replaced} replaced, ${appended} appended`);
  return { type: "FeatureCollection", features: result };
}

function generateTiles(bordersPath, labelsPath, year) {
  try { execSync("tippecanoe --version", { stdio: "ignore" }); }
  catch { console.warn("  ! tippecanoe not found (brew install tippecanoe)"); return; }
  const outMbtiles = join(OUT_DIR, "snapshot-" + year + ".mbtiles");
  const cmd = "tippecanoe --output=\"" + outMbtiles + "\" --force --minimum-zoom=1 --maximum-zoom=8 -zg --drop-densest-as-needed --named-layer=borders:\"" + bordersPath + "\" --named-layer=border-labels:\"" + labelsPath + "\"";
  try { execSync(cmd, { stdio: "pipe" }); console.log("  + Tiles: " + outMbtiles); }
  catch (e) { console.warn("  ! tippecanoe failed: " + e.message); }
}

function writeManifest(allYears) {
  const snapshots = allYears.map((year, i) => ({
    snapshotYear: year,
    filename: yearToFilename(year),
    rawUrl: RAW_BASE + "/" + yearToFilename(year),
    bordersFile: "data/snapshot-" + year + "-borders.geojson",
    labelsFile:  "data/snapshot-" + year + "-labels.geojson",
    validFrom: year,
    validTo: allYears[i + 1] ?? year + 1,
  }));
  const yearToSnapshot = {};
  for (let i = 0; i < allYears.length; i++) yearToSnapshot[allYears[i]] = i;
  const manifest = {
    snapshots, yearToSnapshot,
    snapshotYears: allYears,
    minYear: allYears[0],
    maxYear: allYears[allYears.length - 1],
    generatedAt: new Date().toISOString(),
    source: "https://github.com/aourednik/historical-basemaps",
  };
  const path = join(OUT_DIR, "year-manifest.json");
  writeFileSync(path, JSON.stringify(manifest, null, 2));
  console.log("  + Manifest: " + path);
  return manifest;
}

async function main() {
  const args = process.argv.slice(2);
  const doAll   = args.includes("--all");
  const doTiles = args.includes("--tiles");
  const doOHM   = args.includes("--ohm");
  const yearArg = args.indexOf("--year");
  if (doOHM) console.log("OHM merge enabled (CE years only)\n");

  const allYears = await fetchSnapshotYears();

  const targetYears = doAll
    ? allYears
    : yearArg >= 0
      ? [parseInt(args[yearArg + 1], 10)]
      : [1700];

  console.log("\nProcessing " + targetYears.length + " year(s): " + targetYears.join(", ") + "\n");

  const tmp = tmpdir();
  const processed = [];

  for (let i = 0; i < targetYears.length; i++) {
    const year = targetYears[i];
    const snapshotIdx = allYears.indexOf(year);
    const validTo = snapshotIdx >= 0 && allYears[snapshotIdx + 1] ? allYears[snapshotIdx + 1] : year + 1;

    console.log("[" + (i + 1) + "/" + targetYears.length + "] Year " + year + " (validTo: " + validTo + "):");

    const raw = await fetchSnapshot(year);
    if (!raw) continue;

    const rawPath   = join(tmp, "wha_raw_"   + year + ".geojson");
    const simplPath = join(tmp, "wha_simpl_" + year + ".geojson");
    writeFileSync(rawPath, JSON.stringify(raw));

    const ok = simplify(rawPath, simplPath);
    const sourceGeojson = ok ? JSON.parse(readFileSync(simplPath, "utf8")) : raw;

    console.log("  Enriching " + sourceGeojson.features.length + " features...");
    const { borders: hbBorders, labels: hbLabels } = await buildEnrichedCollections(sourceGeojson, year, validTo);

    // ── OHM merge (Step 3–4) ─────────────────────────────────────────────
    let finalBorders = hbBorders;
    let finalLabels  = hbLabels;

    if (doOHM && year > 0) {
      try {
        console.log("  Fetching OHM data...");
        const ohmFC = await fetchOHMForYear(year, { verbose: true });
        finalBorders = await mergeWithOHM(hbBorders, ohmFC, year, validTo);
        // Re-compute label points for any new/replaced features
        const labelled = await Promise.all(
          finalBorders.features.map(async f => {
            if (!f.geometry) return null;
            const pt = f.geometry.type === "Polygon"
              ? await polylabelPoint(f.geometry.coordinates)
              : (() => {
                  // Biggest outer ring for MultiPolygon
                  let biggest = null, biggestArea = 0;
                  for (const poly of (f.geometry.coordinates ?? [])) {
                    const a = ringArea(poly[0] ?? []);
                    if (a > biggestArea) { biggestArea = a; biggest = poly; }
                  }
                  return biggest ? polylabelPoint(biggest) : null;
                })();
            if (!pt) return null;
            return {
              type: "Feature",
              id: f.id + "_lbl",
              properties: {
                name: f.properties.name,
                sovereign: f.properties.sovereign,
                sovereignColorKey: f.properties.sovereignColorKey,
                rank: f.properties.rank,
                area: f.properties.area,
              },
              geometry: { type: "Point", coordinates: [pt[0], pt[1]] },
            };
          })
        );
        finalLabels = { type: "FeatureCollection", features: labelled.filter(Boolean) };
      } catch (e) {
        console.warn("  ! OHM fetch failed: " + e.message + " -- using historical-basemaps only");
      }
    }

    const bordersOut = join(OUT_DIR, "snapshot-" + year + "-borders.geojson");
    const labelsOut  = join(OUT_DIR, "snapshot-" + year + "-labels.geojson");
    writeFileSync(bordersOut, JSON.stringify(finalBorders));
    writeFileSync(labelsOut,  JSON.stringify(finalLabels));
    console.log("  + Borders: " + finalBorders.features.length + " features");
    console.log("  + Labels:  " + finalLabels.features.length + " points");

    if (doTiles) generateTiles(bordersOut, labelsOut, year);
    processed.push(year);

  writeManifest(allYears);
  console.log("\nDone -- " + processed.length + " snapshot(s) processed.\n");
}

main().catch(e => { console.error("Pipeline failed:", e); process.exit(1); });
