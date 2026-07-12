// fallow-ignore-file unused-file
/**
 * audit-entities.mjs
 *
 * Checks every entity (places + persons + events + cultures) against Wikidata
 * and Wikipedia, and flags anything that would render empty on the site.
 *
 * Usage:  node scripts/audit-entities.mjs
 * Output: table to stdout + summary counts.
 *
 * What it checks for each QID:
 *   1. Wikidata entity exists?
 *   2. English label?
 *   3. enwiki sitelink present?
 *   4. Wikipedia article reachable (MediaWiki API, follows redirects)?
 *   5. Extract non-empty?
 *   6. Flags: label-vs-slug mismatch, disambiguation page, redirect followed
 */

import { setTimeout as sleep } from "node:timers/promises";

// ---------------------------------------------------------------------------
// All entities from the codebase crosswalks (hardcoded to avoid TS imports)
// ---------------------------------------------------------------------------

const PLACES = [
  // Ancient World
  { name: "Achaemenid Empire",       qid: "Q11765",  slug: "achaemenid-empire" },
  { name: "Macedonian Empire",       qid: "Q8168",   slug: "macedonian-empire" },
  { name: "Seleucid Empire",         qid: "Q12280",  slug: "seleucid-empire" },
  { name: "Ptolemaic Kingdom",       qid: "Q11776",  slug: "ptolemaic-kingdom" },
  { name: "Roman Republic",          qid: "Q6134",   slug: "roman-republic" },
  { name: "Roman Empire",            qid: "Q2277",   slug: "roman-empire" },
  { name: "Western Roman Empire",    qid: "Q186077", slug: "western-roman-empire" },
  { name: "Byzantine Empire",        qid: "Q41088",  slug: "byzantine-empire" },
  { name: "Carthage",                qid: "Q6343",   slug: "carthage" },
  { name: "Han dynasty",             qid: "Q7209",   slug: "han-dynasty" },
  { name: "Maurya Empire",           qid: "Q9232",   slug: "maurya-empire" },
  { name: "Gupta Empire",            qid: "Q188889", slug: "gupta-empire" },
  { name: "Kingdom of Aksum",        qid: "Q135364", slug: "kingdom-of-aksum" },
  // Classical / Medieval
  { name: "Sasanian Empire",         qid: "Q12557",  slug: "sasanian-empire" },
  { name: "Rashidun Caliphate",      qid: "Q9587",   slug: "rashidun-caliphate" },
  { name: "Umayyad Caliphate",       qid: "Q8806",   slug: "umayyad-caliphate" },
  { name: "Abbasid Caliphate",       qid: "Q9589",   slug: "abbasid-caliphate" },
  { name: "Frankish Kingdom",        qid: "Q12131",  slug: "frankish-kingdom" },
  { name: "Carolingian Empire",      qid: "Q150804", slug: "carolingian-empire" },
  { name: "Holy Roman Empire",       qid: "Q12548",  slug: "holy-roman-empire" },
  { name: "Tang dynasty",            qid: "Q83381",  slug: "tang-dynasty" },
  { name: "Song dynasty",            qid: "Q170384", slug: "song-dynasty" },
  { name: "Tibetan Empire",          qid: "Q152526", slug: "tibetan-empire" },
  { name: "Mongol Empire",           qid: "Q12544",  slug: "mongol-empire" },
  { name: "Golden Horde",            qid: "Q131054", slug: "golden-horde" },
  { name: "Ilkhanate",               qid: "Q19609",  slug: "ilkhanate" },
  { name: "Timurid Empire",          qid: "Q165092", slug: "timurid-empire" },
  { name: "Ghana Empire",            qid: "Q174193", slug: "ghana-empire" },
  { name: "Mali Empire",             qid: "Q181686", slug: "mali-empire" },
  { name: "Songhai Empire",          qid: "Q174295", slug: "songhai-empire" },
  { name: "Srivijaya",               qid: "Q170037", slug: "srivijaya" },
  { name: "Majapahit",               qid: "Q205909", slug: "majapahit" },
  { name: "Delhi Sultanate",         qid: "Q9471",   slug: "delhi-sultanate" },
  // Early Modern
  { name: "Inca Empire",             qid: "Q35409",  slug: "inca-empire" },
  { name: "Aztec",                   qid: "Q12542",  slug: "aztec" },
  { name: "Papal States",            qid: "Q50405",  slug: "papal-states" },
  { name: "Republic of Venice",      qid: "Q4948",   slug: "republic-of-venice" },
  { name: "Kingdom of France",       qid: "Q70972",  slug: "kingdom-of-france" },
  { name: "Kingdom of England",      qid: "Q179876", slug: "kingdom-of-england" },
  { name: "Kingdom of Scotland",     qid: "Q219567", slug: "kingdom-of-scotland" },
  { name: "Polish-Lithuanian Commonwealth", qid: "Q160481", slug: "polish-lithuanian-commonwealth" },
  { name: "Safavid dynasty",         qid: "Q130969", slug: "safavid-dynasty" },
  { name: "Mughal Empire",           qid: "Q208234", slug: "mughal-empire" },
  { name: "Ottoman Empire",          qid: "Q12560",  slug: "ottoman-empire" },
  { name: "Vijayanagara Empire",     qid: "Q75197",  slug: "vijayanagara-empire" },
  { name: "Maratha Empire",          qid: "Q9396",   slug: "maratha-empire" },
  { name: "Portuguese Empire",       qid: "Q26241",  slug: "portuguese-empire" },
  { name: "Habsburg Monarchy",       qid: "Q48056",  slug: "habsburg-monarchy" },
  { name: "Ming dynasty",            qid: "Q9903",   slug: "ming-dynasty" },
  { name: "Qing dynasty",            qid: "Q8733",   slug: "qing-dynasty" },
  { name: "Joseon",                  qid: "Q28179",  slug: "joseon" },
  { name: "Kingdom of Kongo",        qid: "Q33747",  slug: "kingdom-of-kongo" },
  // Modern
  { name: "First French Empire",     qid: "Q40694",  slug: "first-french-empire" },
  { name: "Kingdom of Prussia",      qid: "Q27306",  slug: "kingdom-of-prussia" },
  { name: "Austria-Hungary",         qid: "Q28513",  slug: "austria-hungary" },
  { name: "British Empire",          qid: "Q8680",   slug: "british-empire" },
  { name: "German Empire",           qid: "Q43287",  slug: "german-empire" },
  { name: "Russian Empire",          qid: "Q34266",  slug: "russian-empire" },
  { name: "Zulu Kingdom",            qid: "Q180003", slug: "zulu-kingdom" },
  // Contemporary states
  { name: "France",                  qid: "Q142",    slug: "france" },
  { name: "United Kingdom",          qid: "Q145",    slug: "united-kingdom" },
  { name: "United States",           qid: "Q30",     slug: "united-states" },
  { name: "Russia",                  qid: "Q159",    slug: "russia" },
  { name: "Japan",                   qid: "Q17",     slug: "japan" },
  { name: "China",                   qid: "Q148",    slug: "china" },
  { name: "India",                   qid: "Q668",    slug: "india" },
];

const PERSONS = [
  { name: "Genghis Khan",            qid: "Q720",    slug: "genghis-khan" },
  { name: "Alexander the Great",     qid: "Q8409",   slug: "alexander-the-great" },
  { name: "Julius Caesar",           qid: "Q1048",   slug: "julius-caesar" },
  { name: "Cleopatra",               qid: "Q1413",   slug: "cleopatra" },
  { name: "Charlemagne",             qid: "Q3044",   slug: "charlemagne" },
  { name: "Saladin",                 qid: "Q9431",   slug: "saladin" },
  { name: "Tamerlane",               qid: "Q44077",  slug: "tamerlane" },
  { name: "Napoleon",                qid: "Q517",    slug: "napoleon" },
  { name: "Constantine I",           qid: "Q8413",   slug: "constantine-i" },
  { name: "Augustus",                qid: "Q1405",   slug: "augustus" },
  { name: "Attila the Hun",          qid: "Q36724",  slug: "attila-the-hun" },
  { name: "Kublai Khan",             qid: "Q7523",   slug: "kublai-khan" },
  { name: "Suleiman the Magnificent",qid: "Q43610",  slug: "suleiman-the-magnificent" },
  { name: "Akbar",                   qid: "Q133680", slug: "akbar" },
  { name: "Cyrus the Great",         qid: "Q23967",  slug: "cyrus-the-great" },
  { name: "Hannibal",                qid: "Q38375",  slug: "hannibal" },
  { name: "Ramesses II",             qid: "Q157459", slug: "ramesses-ii" },
];

const EVENTS = [
  { name: "Fall of Rome",            qid: "Q47092",  slug: "fall-of-rome" },
  { name: "Black Death",             qid: "Q42196",  slug: "black-death" },
  { name: "Mongol invasion of Europe",qid: "Q180614",slug: "mongol-invasion-of-europe" },
  { name: "Crusades",                qid: "Q8065",   slug: "crusades" },
  { name: "Age of Discovery",        qid: "Q133641", slug: "age-of-discovery" },
  { name: "Battle of Marathon",      qid: "Q46383",  slug: "battle-of-marathon" },
  { name: "French Revolution",       qid: "Q6534",   slug: "french-revolution" },
  { name: "Fall of Constantinople",  qid: "Q155231", slug: "fall-of-constantinople" },
];

const CULTURES = [
  { name: "Silk Road",               qid: "Q152490", slug: "silk-road" },
  { name: "Renaissance",             qid: "Q4692",   slug: "renaissance" },
  { name: "Islamic Golden Age",      qid: "Q7178",   slug: "islamic-golden-age" },
  { name: "Ancient Greece",          qid: "Q11772",  slug: "ancient-greece" },
  { name: "Ancient Egypt",           qid: "Q11768",  slug: "ancient-egypt" },
  { name: "Viking Age",              qid: "Q128207", slug: "viking-age" },
  { name: "Feudal Japan",            qid: "Q228668", slug: "feudal-japan" },
  { name: "Ancient Rome",            qid: "Q11817",  slug: "ancient-rome" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchWikidata(qid) {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Wikidata ${qid}: HTTP ${res.status}`);
  const data = await res.json();
  return data.entities?.[qid];
}

async function fetchWikipedia(title) {
  const encoded = encodeURIComponent(title);
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}` +
    `&prop=extracts|info&exintro=1&explaintext=1&inprop=url&redirects=1` +
    `&format=json&origin=*`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) return null;
  const json = await res.json();
  const pages = json.query?.pages ?? {};
  const redirects = json.query?.redirects ?? [];
  const page = Object.values(pages)[0];
  if (!page || "missing" in page) return null;
  return {
    extract: (page.extract ?? "").trim(),
    url: page.fullurl,
    redirectedFrom: redirects[0]?.from,
  };
}

function norm(s) {
  return s.toLowerCase().replace(/[–—\-]/g, " ").replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

function labelMatches(label, expected) {
  const l = norm(label), e = norm(expected);
  if (l === e) return true;
  if (l.includes(e) || e.includes(l)) return true;
  const lWords = new Set(l.split(" "));
  const eWords = e.split(" ");
  const overlap = eWords.filter(w => lWords.has(w)).length;
  return overlap / Math.min(lWords.size, eWords.length) >= 0.6;
}

// ---------------------------------------------------------------------------
// Core audit function
// ---------------------------------------------------------------------------

async function auditEntity(category, { name, qid, slug }) {
  const result = {
    category,
    name,
    qid,
    slug,
    wikidataLabel: "",
    enwikiTitle: "",
    labelMatch: true,
    wikiStatus: "",
    extractLen: 0,
    redirectedFrom: "",
    flags: [],
  };

  try {
    const entity = await fetchWikidata(qid);
    if (!entity) {
      result.flags.push("WIKIDATA_NOT_FOUND");
      return result;
    }

    result.wikidataLabel = entity.labels?.en?.value ?? "";
    const sitelinks = entity.sitelinks ?? {};
    result.enwikiTitle = sitelinks.enwiki?.title ?? "";

    if (result.wikidataLabel && !labelMatches(result.wikidataLabel, name)) {
      result.labelMatch = false;
      result.flags.push(`LABEL_MISMATCH: expected "${name}", got "${result.wikidataLabel}"`);
    }

    if (!result.enwikiTitle) {
      result.flags.push("NO_ENWIKI_SITELINK");
      result.wikiStatus = "—";
      return result;
    }

    const wiki = await fetchWikipedia(result.enwikiTitle);
    if (!wiki) {
      result.flags.push("WIKI_PAGE_NOT_FOUND");
      result.wikiStatus = "404";
      return result;
    }

    result.extractLen = wiki.extract.length;
    result.wikiStatus = "OK";
    if (wiki.redirectedFrom) {
      result.redirectedFrom = wiki.redirectedFrom;
    }
    if (result.extractLen === 0) {
      result.flags.push("EMPTY_EXTRACT");
    } else if (result.extractLen < 100) {
      result.flags.push("EXTRACT_TOO_SHORT");
    }

    // Disambiguation heuristic
    if (wiki.extract.toLowerCase().startsWith(norm(result.enwikiTitle) + " may refer to") ||
        wiki.extract.toLowerCase().includes("may refer to:") ||
        wiki.extract.toLowerCase().includes("disambiguation")) {
      result.flags.push("DISAMBIGUATION_PAGE");
    }
  } catch (err) {
    result.flags.push(`ERROR: ${err.message}`);
    result.wikiStatus = "ERR";
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const allEntities = [
    ...PLACES.map(e => ["place", e]),
    ...PERSONS.map(e => ["person", e]),
    ...EVENTS.map(e => ["event", e]),
    ...CULTURES.map(e => ["culture", e]),
  ];

  console.log(`\nAuditing ${allEntities.length} entities…\n`);

  const results = [];
  for (const [category, entity] of allEntities) {
    process.stdout.write(`  [${category}] ${entity.name} (${entity.qid})…`);
    const r = await auditEntity(category, entity);
    const status = r.flags.length ? ` ⚠ ${r.flags.join(" | ")}` : " ✓";
    console.log(status);
    results.push(r);
    await sleep(500); // 500 ms per entity — Wikidata rate-limits aggressively at higher rates
  }

  // Summary
  const issues = results.filter(r => r.flags.length > 0);
  const noSitelink = results.filter(r => r.flags.some(f => f.includes("NO_ENWIKI_SITELINK")));
  const labelMismatch = results.filter(r => r.flags.some(f => f.includes("LABEL_MISMATCH")));
  const wikiMissing = results.filter(r => r.flags.some(f => f.includes("WIKI_PAGE_NOT_FOUND")));
  const disambig = results.filter(r => r.flags.some(f => f.includes("DISAMBIGUATION")));
  const emptyExtract = results.filter(r => r.flags.some(f => f.includes("EMPTY_EXTRACT") || f.includes("TOO_SHORT")));

  console.log("\n" + "=".repeat(70));
  console.log("AUDIT SUMMARY");
  console.log("=".repeat(70));
  console.log(`Total entities:      ${results.length}`);
  console.log(`✓  OK:               ${results.length - issues.length}`);
  console.log(`⚠  Issues:           ${issues.length}`);
  console.log(`   Label mismatch:   ${labelMismatch.length}`);
  console.log(`   No enwiki link:   ${noSitelink.length}`);
  console.log(`   Wiki 404:         ${wikiMissing.length}`);
  console.log(`   Disambiguation:   ${disambig.length}`);
  console.log(`   Empty extract:    ${emptyExtract.length}`);

  if (issues.length > 0) {
    console.log("\n" + "-".repeat(70));
    console.log("DETAILS (issues only)");
    console.log("-".repeat(70));
    for (const r of issues) {
      console.log(`[${r.category}] ${r.name} (${r.qid})`);
      console.log(`  Slug:        ${r.slug}`);
      console.log(`  WD label:    ${r.wikidataLabel || "(none)"}`);
      console.log(`  enwiki:      ${r.enwikiTitle || "(none)"}`);
      console.log(`  Wiki status: ${r.wikiStatus}  extract: ${r.extractLen} chars`);
      if (r.redirectedFrom) console.log(`  Redirected:  ${r.redirectedFrom} → ${r.enwikiTitle}`);
      console.log(`  FLAGS:       ${r.flags.join(" | ")}`);
      console.log();
    }
  }

  console.log("=".repeat(70) + "\n");
}

main().catch(console.error);
