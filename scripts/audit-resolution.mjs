#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SNAPSHOT_PATH = path.join(ROOT, "public/data/snapshot-1700-borders.geojson");
const CROSSWALK_PATH = path.join(ROOT, "src/data/crosswalk.ts");

const PLACE_TYPE_IDS = new Set([
  "Q6256", // country
  "Q7275", // state
  "Q48349", // empire
  "Q23616", // caliphate
  "Q164950", // dynasty
  "Q41710", // kingdom
  "Q3024240", // historical country
  "Q15634554", // historical polity
  "Q515", // city
]);

const ENTITY_RAW_CACHE = new Map();
const ENTITY_DETAILS_CACHE = new Map();
const SUBCLASS_CHAIN_CACHE = new Map();
const WD_USER_AGENT = "WorldHistoryAtlas/1.0 (resolution-audit)";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humaniseSlug(slug) {
  const spaced = slug.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!spaced) return slug;
  return spaced
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function normaliseExact(s) {
  return s
    .toLowerCase()
    .replace(/[–—-]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCrosswalkMap(fileText) {
  const out = new Map();
  const re = /"([^"]+)"\s*:\s*\{[^{}]*wikidataId:\s*"(Q\d+)"[^{}]*slug:\s*"([^"]+)"[^{}]*\}/g;
  let m;
  while ((m = re.exec(fileText)) !== null) {
    out.set(m[3], { name: m[1], qid: m[2], slug: m[3] });
  }
  return out;
}

function getEntityIdClaims(entity, prop) {
  const claims = entity?.claims?.[prop] ?? [];
  return claims
    .map((c) => c?.mainsnak?.datavalue?.value?.id)
    .filter((v) => typeof v === "string" && /^Q\d+$/.test(v));
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWikidataJson(url) {
  const delays = [0, 300, 900];

  for (let i = 0; i < delays.length; i += 1) {
    if (delays[i] > 0) await sleep(delays[i]);

    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        Accept: "application/json",
        "User-Agent": WD_USER_AGENT,
      },
    });

    if (res.ok) {
      try {
        return await res.json();
      } catch {
        return null;
      }
    }

    if (res.status === 429 || res.status >= 500) continue;
    return null;
  }

  return null;
}

async function fetchEntityRaw(qid) {
  if (ENTITY_RAW_CACHE.has(qid)) return ENTITY_RAW_CACHE.get(qid);

  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const json = await fetchWikidataJson(url);
  if (!json || typeof json !== "object") {
    ENTITY_RAW_CACHE.set(qid, null);
    return null;
  }

  const entity = json.entities?.[qid] ?? null;
  ENTITY_RAW_CACHE.set(qid, entity);
  return entity;
}

async function fetchEntityDetails(qid) {
  if (ENTITY_DETAILS_CACHE.has(qid)) return ENTITY_DETAILS_CACHE.get(qid);

  const entity = await fetchEntityRaw(qid);
  if (!entity) {
    ENTITY_DETAILS_CACHE.set(qid, null);
    return null;
  }

  const label = entity.labels?.en?.value ?? "";
  const aliases = (entity.aliases?.en ?? []).map((a) => a.value ?? "").filter(Boolean);
  const sitelinks = entity.sitelinks ?? {};
  const claims = entity.claims ?? {};

  const details = {
    qid,
    label,
    aliases,
    hasEnwiki: Boolean(sitelinks.enwiki?.title),
    sitelinksCount: Object.keys(sitelinks).length,
    statementsCount: Object.values(claims).reduce((n, arr) => n + arr.length, 0),
    p31: getEntityIdClaims(entity, "P31"),
  };

  ENTITY_DETAILS_CACHE.set(qid, details);
  return details;
}

async function getSubclassChain(qid, depth = 0, seen = new Set()) {
  if (SUBCLASS_CHAIN_CACHE.has(qid)) return SUBCLASS_CHAIN_CACHE.get(qid);
  if (depth > 6 || seen.has(qid)) return [];
  seen.add(qid);

  const entity = await fetchEntityRaw(qid);
  if (!entity) {
    SUBCLASS_CHAIN_CACHE.set(qid, []);
    return [];
  }

  const direct = getEntityIdClaims(entity, "P279");
  const out = new Set(direct);

  for (const parent of direct) {
    const chain = await getSubclassChain(parent, depth + 1, seen);
    for (const c of chain) out.add(c);
  }

  const result = [...out];
  SUBCLASS_CHAIN_CACHE.set(qid, result);
  return result;
}

async function passesPlaceTypeGuard(qid) {
  const details = await fetchEntityDetails(qid);
  if (!details) return false;

  for (const cls of details.p31) {
    if (PLACE_TYPE_IDS.has(cls)) return true;
    const parents = await getSubclassChain(cls);
    if (parents.some((p) => PLACE_TYPE_IDS.has(p))) return true;
  }

  return false;
}

async function validatePlaceQid(qid) {
  const details = await fetchEntityDetails(qid);
  if (!details) return { ok: false, details: null, reason: "missing-entity" };
  if (!details.hasEnwiki) return { ok: false, details, reason: "no-article" };

  const typeOk = await passesPlaceTypeGuard(qid);
  if (!typeOk) return { ok: false, details, reason: "invalid-type" };

  return { ok: true, details, reason: "" };
}

async function searchWikidataCandidates(name) {
  const encoded = encodeURIComponent(name);
  const url =
    `https://www.wikidata.org/w/api.php` +
    `?action=wbsearchentities&search=${encoded}` +
    `&language=en&type=item&limit=25&format=json&origin=*`;

  const json = await fetchWikidataJson(url);
  if (!json || typeof json !== "object") return [];
  return (json.search ?? [])
    .map((r) => r.id)
    .filter((id) => typeof id === "string" && /^Q\d+$/.test(id));
}

async function resolveExactPlace(name) {
  const target = normaliseExact(name);
  const ids = await searchWikidataCandidates(name);
  const matches = [];

  for (const qid of ids) {
    const details = await fetchEntityDetails(qid);
    if (!details || !details.hasEnwiki) continue;

    const exact =
      normaliseExact(details.label) === target ||
      details.aliases.some((a) => normaliseExact(a) === target);
    if (!exact) continue;

    const typeOk = await passesPlaceTypeGuard(qid);
    if (!typeOk) continue;

    matches.push({
      qid,
      label: details.label || name,
      sitelinks: details.sitelinksCount,
      statements: details.statementsCount,
    });
  }

  if (matches.length === 0) return { candidate: null, ambiguous: false };

  matches.sort((a, b) => {
    if (b.sitelinks !== a.sitelinks) return b.sitelinks - a.sitelinks;
    return b.statements - a.statements;
  });

  if (matches.length > 1) {
    const a = matches[0];
    const b = matches[1];
    if (a.sitelinks === b.sitelinks && a.statements === b.statements) {
      return { candidate: null, ambiguous: true };
    }
  }

  return { candidate: matches[0], ambiguous: false };
}

function majorPolitySignal(name) {
  return /(empire|caliphate|kingdom|dynasty|sultanate|republic|state|khanate|commonwealth)/i.test(name);
}

function shouldAttemptExactResolution(name) {
  return majorPolitySignal(name);
}

async function main() {
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
  const crosswalkText = fs.readFileSync(CROSSWALK_PATH, "utf8");
  const crosswalk = parseCrosswalkMap(crosswalkText);

  const slugToName = new Map();
  for (const f of snapshot.features ?? []) {
    const name = String(f.properties?.name ?? "").trim();
    const sovereign = String(f.properties?.sovereign ?? "").trim();
    if (name) slugToName.set(slugify(name), name);
    if (sovereign) slugToName.set(slugify(sovereign), sovereign);
  }

  const slugs = [...slugToName.keys()].filter(Boolean).sort();
  const slugArg = process.argv.find((a) => a.startsWith("--slugs="));
  const explicitSlugs = slugArg
    ? slugArg
      .slice("--slugs=".length)
      .split(",")
      .map((s) => slugify(s.trim()))
      .filter(Boolean)
    : null;
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : null;
  const auditSlugs = explicitSlugs
    ? explicitSlugs
    : limit
      ? slugs.slice(0, limit)
      : slugs;

  console.log(`Auditing ${auditSlugs.length} place slugs...\n`);
  console.log("slug\tmethod\tqid\tlabel\thas-article\treason");

  let resolvedCount = 0;
  let crosswalkCount = 0;
  let exactCount = 0;
  let fallbackCount = 0;
  const flagged = [];

  for (const slug of auditSlugs) {
    const sourceName = slugToName.get(slug) ?? humaniseSlug(slug);
    let method = "fallback";
    let qid = "";
    let label = "";
    let hasArticle = "no";
    let reason = "not-found";

    const cw = crosswalk.get(slug);
    if (cw) {
      const valid = await validatePlaceQid(cw.qid);
      if (valid.ok) {
        method = "crosswalk";
        qid = cw.qid;
        label = valid.details.label;
        hasArticle = "yes";
        reason = "";
      } else {
        reason = valid.reason;
      }
    }

    if (method === "fallback" && shouldAttemptExactResolution(sourceName)) {
      try {
        const exact = await resolveExactPlace(sourceName);
        if (exact.ambiguous) {
          reason = "ambiguous";
        } else if (exact.candidate) {
          const valid = await validatePlaceQid(exact.candidate.qid);
          if (valid.ok) {
            method = "wikidata-exact";
            qid = exact.candidate.qid;
            label = valid.details.label;
            hasArticle = "yes";
            reason = "";
          } else {
            reason = valid.reason;
          }
        }
      } catch {
        reason = "lookup-error";
      }
    }

    if (method !== "fallback") {
      resolvedCount += 1;
      if (method === "crosswalk") crosswalkCount += 1;
      if (method === "wikidata-exact") exactCount += 1;
    } else {
      fallbackCount += 1;
      if (majorPolitySignal(sourceName)) {
        flagged.push({ slug, name: sourceName, reason });
      }
    }

    console.log(`${slug}\t${method}\t${qid}\t${label}\t${hasArticle}\t${reason}`);
  }

  console.log("\n---");
  console.log(`Total: ${auditSlugs.length}`);
  console.log(`Resolved: ${resolvedCount}`);
  console.log(`Crosswalk: ${crosswalkCount}`);
  console.log(`Wikidata exact: ${exactCount}`);
  console.log(`Fallback: ${fallbackCount}`);

  if (flagged.length > 0) {
    console.log("\nMajor-polity fallbacks to inspect:");
    for (const f of flagged) {
      console.log(`- ${f.slug} (${f.name}) reason=${f.reason}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
