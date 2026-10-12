#!/usr/bin/env node
/**
 * Builds public/data/world_1985.geojson — a Cold War snapshot the upstream
 * historical-basemaps dataset doesn't have (it jumps from 1960 to 1994).
 *
 * Derived from the upstream 1994 file, with:
 *   - the USSR, Yugoslavia, Czechoslovakia, East and West Germany taken from
 *     the upstream 1960 file (their outer borders didn't change 1960–1990),
 *     replacing their post-1990 successor states;
 *   - Eritrea merged into Ethiopia (annexed 1962, independent 1993);
 *   - Namibia relabelled South West Africa, administered by South Africa
 *     (independent 1990).
 * Yemen stays unified, matching how the upstream data draws it in 1960.
 *
 *   node scripts/build-snapshot-1985.mjs
 */

import { writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import * as pc from "polyclip-ts";

const RAW_BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const OUT = join(process.cwd(), "public/data/world_1985.geojson");

const SUCCESSOR_STATES = new Set([
  "Russia", "Ukraine", "Byelarus", "Moldova", "Estonia", "Latvia", "Lithuania", "Georgia", "Armenia",
  "Azerbaijan", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan",
  "Slovenia", "Croatia", "Bosnia and Herzegovina", "Serbia", "Montenegro", "Macedonia",
  "Czech Republic", "Slovakia", "Germany",
]);
const FROM_1960 = ["USSR", "Yugoslavia", "Czechoslovakia", "East Germany", "West Germany"];

async function load(file) {
  const res = await fetch(`${RAW_BASE}/${file}`);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return res.json();
}

const asMulti = (g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);
const byName = (features, name) => {
  const f = features.find((x) => x.properties.NAME === name);
  if (!f) throw new Error(`No feature named ${name}`);
  return f;
};

const [y1994, y1960] = await Promise.all([load("world_1994.geojson"), load("world_1960.geojson")]);

const removed = y1994.features.filter((f) => SUCCESSOR_STATES.has(f.properties.NAME));
if (removed.length !== SUCCESSOR_STATES.size) throw new Error("Upstream 1994 names changed — check SUCCESSOR_STATES");
const features = y1994.features.filter((f) => !SUCCESSOR_STATES.has(f.properties.NAME));
for (const name of FROM_1960) features.push(structuredClone(byName(y1960.features, name)));

const ethiopia = byName(features, "Ethiopia");
const eritrea = byName(features, "Eritrea");
ethiopia.geometry = { type: "MultiPolygon", coordinates: pc.union(asMulti(ethiopia.geometry), asMulti(eritrea.geometry)) };
features.splice(features.indexOf(eritrea), 1);

Object.assign(byName(features, "Namibia").properties, {
  NAME: "South West Africa",
  ABBREVN: "S.W. Africa",
  SUBJECTO: "South Africa",
  PARTOF: "South Africa",
});

writeFileSync(OUT, JSON.stringify({ type: "FeatureCollection", features }));
console.log(`Wrote ${OUT}: ${features.length} features, ${(statSync(OUT).size / 1e6).toFixed(1)} MB`);
