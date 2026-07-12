// fallow-ignore-file unused-file
/**
 * audit-crosswalk.mjs
 * 
 * Audits every slug→QID mapping in src/data/crosswalk.ts by fetching
 * the Wikidata label for each QID and checking it against the expected name.
 * 
 * Run: node scripts/audit-crosswalk.mjs
 * 
 * Flags rows where:
 *   - The Wikidata label doesn't match the expected name
 *   - The QID resolves to a non-polity type (no valid P31 "instance of")
 */

// Full crosswalk copy (place entries only) — must be kept in sync with src/data/crosswalk.ts
const CROSSWALK = {
  "Achaemenid Empire":        { qid: "Q11768",  slug: "achaemenid-empire" },
  "Macedonian Empire":        { qid: "Q180958", slug: "macedonian-empire" },
  "Seleucid Empire":          { qid: "Q83496",  slug: "seleucid-empire" },
  "Ptolemaic Kingdom":        { qid: "Q82868",  slug: "ptolemaic-kingdom" },
  "Roman Republic":           { qid: "Q2277",   slug: "roman-republic" },
  "Roman Empire":             { qid: "Q2277",   slug: "roman-empire" },
  "Western Roman Empire":     { qid: "Q271449", slug: "western-roman-empire" },
  "Byzantine Empire":         { qid: "Q11258",  slug: "byzantine-empire" },
  "Maurya Empire":            { qid: "Q43785",  slug: "maurya-empire" },
  "Gupta Empire":             { qid: "Q35610",  slug: "gupta-empire" },
  "Han dynasty":              { qid: "Q7209",   slug: "han-dynasty" },
  "Kingdom of Aksum":         { qid: "Q206938", slug: "kingdom-of-aksum" },
  "Carthage":                 { qid: "Q6343",   slug: "carthage" },
  "Sasanian Empire":          { qid: "Q8047",   slug: "sasanian-empire" },
  "Rashidun Caliphate":       { qid: "Q79764",  slug: "rashidun-caliphate" },
  "Umayyad Caliphate":        { qid: "Q62534",  slug: "umayyad-caliphate" },
  "Abbasid Caliphate":        { qid: "Q9488",   slug: "abbasid-caliphate" },
  "Frankish Kingdom":         { qid: "Q28573",  slug: "frankish-kingdom" },
  "Carolingian Empire":       { qid: "Q12130",  slug: "carolingian-empire" },
  "Tang dynasty":             { qid: "Q10891",  slug: "tang-dynasty" },
  "Tibetan Empire":           { qid: "Q152544", slug: "tibetan-empire" },
  "Holy Roman Empire":        { qid: "Q12548",  slug: "holy-roman-empire" },
  "Mongol Empire":            { qid: "Q12544",  slug: "mongol-empire" },
  "Golden Horde":             { qid: "Q39057",  slug: "golden-horde" },
  "Ilkhanate":                { qid: "Q131021", slug: "ilkhanate" },
  "Timurid Empire":           { qid: "Q131498", slug: "timurid-empire" },
  "Song dynasty":             { qid: "Q19290",  slug: "song-dynasty" },
  "Ming dynasty":             { qid: "Q9903",   slug: "ming-dynasty" },
  "Ghana Empire":             { qid: "Q163611", slug: "ghana-empire" },
  "Mali Empire":              { qid: "Q28108",  slug: "mali-empire" },
  "Songhai Empire":           { qid: "Q41487",  slug: "songhai-empire" },
  "Khmer Empire":             { qid: "Q12827",  slug: "khmer-empire" },
  "Srivijaya":                { qid: "Q37960",  slug: "srivijaya" },
  "Majapahit":                { qid: "Q132229", slug: "majapahit" },
  "Delhi Sultanate":          { qid: "Q172316", slug: "delhi-sultanate" },
  "Aztec Empire":             { qid: "Q12542",  slug: "aztec-empire" },
  "Inca Empire":              { qid: "Q42520",  slug: "inca-empire" },
  "Republic of Venice":       { qid: "Q4948",   slug: "republic-of-venice" },
  "Papal States":             { qid: "Q170107", slug: "papal-states" },
  "Kingdom of France":        { qid: "Q70972",  slug: "kingdom-of-france" },
  "Kingdom of England":       { qid: "Q179876", slug: "kingdom-of-england" },
  "Poland":                   { qid: "Q36",     slug: "poland" },
  "Polish-Lithuanian Commonwealth": { qid: "Q218",    slug: "polish-lithuanian-commonwealth" },
  "Ottoman Empire":           { qid: "Q12560",  slug: "ottoman-empire" },
  "Safavid dynasty":          { qid: "Q131512", slug: "safavid-dynasty" },
  "Mughal Empire":            { qid: "Q152564", slug: "mughal-empire" },
  "Vijayanagara Empire":      { qid: "Q43012",  slug: "vijayanagara-empire" },
  "Maratha Empire":           { qid: "Q153348", slug: "maratha-empire" },
  "Qing dynasty":             { qid: "Q8733",   slug: "qing-dynasty" },
  "Joseon dynasty":           { qid: "Q28179",  slug: "joseon-dynasty" },
  "Spanish Empire":           { qid: "Q170603", slug: "spanish-empire" },
  "Portuguese Empire":        { qid: "Q41580",  slug: "portuguese-empire" },
  "British Empire":           { qid: "Q8680",   slug: "british-empire" },
  "Dutch Republic":           { qid: "Q8514",   slug: "dutch-republic" },
  "Kingdom of Prussia":       { qid: "Q27306",  slug: "kingdom-of-prussia" },
  "Habsburg Monarchy":        { qid: "Q172107", slug: "habsburg-monarchy" },
  "Sweden":                   { qid: "Q34",     slug: "sweden" },
  "Denmark":                  { qid: "Q35",     slug: "denmark" },
  "Russia":                   { qid: "Q159",    slug: "russia" },
  "Russian Empire":           { qid: "Q34266",  slug: "russian-empire" },
  "First French Empire":      { qid: "Q168751", slug: "first-french-empire" },
  "France":                   { qid: "Q142",    slug: "france" },
  "German Empire":            { qid: "Q43287",  slug: "german-empire" },
  "Austria-Hungary":          { qid: "Q28513",  slug: "austria-hungary" },
  "Nazi Germany":             { qid: "Q7318",   slug: "nazi-germany" },
  "United Kingdom":           { qid: "Q145",    slug: "united-kingdom" },
  "United States":            { qid: "Q30",     slug: "united-states" },
  "Mexico":                   { qid: "Q96",     slug: "mexico" },
  "Brazil":                   { qid: "Q155",    slug: "brazil" },
  "Argentina":                { qid: "Q414",    slug: "argentina" },
  "Egypt":                    { qid: "Q79",     slug: "egypt" },
  "Ethiopia":                 { qid: "Q115",    slug: "ethiopia" },
  "Zulu Kingdom":             { qid: "Q180003", slug: "zulu-kingdom" },
  "Kingdom of Kongo":         { qid: "Q3757",   slug: "kingdom-of-kongo" },
  "Japan":                    { qid: "Q17",     slug: "japan" },
  "India":                    { qid: "Q668",    slug: "india" },
  "Iran":                     { qid: "Q794",    slug: "iran" },
  "Turkey":                   { qid: "Q43",     slug: "turkey" },
  "Saudi Arabia":             { qid: "Q851",    slug: "saudi-arabia" },
  "Vietnam":                  { qid: "Q881",    slug: "vietnam" },
  "Norway":                   { qid: "Q20",     slug: "norway" },
  "Switzerland":              { qid: "Q39",     slug: "switzerland" },
  "Belgium":                  { qid: "Q31",     slug: "belgium" },
  "Hungary":                  { qid: "Q28",     slug: "hungary" },
};

// Valid P31 "instance of" QIDs for a place/polity entity
const VALID_PLACE_P31 = new Set([
  "Q3024240",  // historical country
  "Q6256",     // country
  "Q7275",     // state
  "Q48349",    // polity
  "Q6242",     // empire (sometimes used)
  "Q2001788",  // empire
  "Q24229398", // nation
  "Q3624078",  // sovereign state
  "Q1250464",  // kingdom (not always used)
  "Q28171280", // ancient civilization
  "Q839954",   // archaeological culture
  "Q15634663", // states with limited recognition
  "Q2221906",  // geographic location (fallback)
  "Q1048835",  // political territorial entity
  "Q859563",   // city-state
  "Q3947",     // house
  "Q484652",   // international organization
  "Q7270",     // republic
  "Q179637",   // dynasty
  "Q4182287",  // republic (historical)
  "Q1520223",  // colonial empire
  "Q15043157", // caliphate
  "Q30103",    // city
  "Q515",      // city (another form)
  "Q1637706",  // city with millions of inhabitants
]);

function normaliseName(name) {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

function labelMatchesName(label, expectedName) {
  const l = normaliseName(label);
  const e = normaliseName(expectedName);
  if (l === e) return true;
  // Check for substring overlap (e.g. "Roman Empire" vs "Roman republic/empire")
  if (l.includes(e) || e.includes(l)) return true;
  return false;
}

async function fetchEntityBatch(qids) {
  const ids = [...new Set(qids)].join("|");
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids}&props=labels|claims&languages=en&format=json&origin=*`;
  const res = await fetch(url);
  const json = await res.json();
  return json.entities ?? {};
}

async function main() {
  const entries = Object.entries(CROSSWALK);
  const allQids = [...new Set(entries.map(([, v]) => v.qid))];

  // Fetch in batches of 50 (Wikidata API limit)
  const entityMap = {};
  for (let i = 0; i < allQids.length; i += 50) {
    const batch = allQids.slice(i, i + 50);
    const data = await fetchEntityBatch(batch);
    Object.assign(entityMap, data);
    if (i + 50 < allQids.length) await new Promise(r => setTimeout(r, 300));
  }

  const rows = [];
  const flags = [];

  for (const [name, { qid, slug }] of entries) {
    const entity = entityMap[qid];
    if (!entity) {
      rows.push({ name, slug, qid, label: "FETCH_FAILED", p31: "-", ok: false, reason: "fetch failed" });
      flags.push(`FETCH_FAILED  ${qid}  ${slug}`);
      continue;
    }
    const label = entity.labels?.en?.value ?? "(no en label)";

    // Check P31
    const p31Claims = entity.claims?.P31 ?? [];
    const p31Ids = p31Claims.map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
    const hasValidP31 = p31Ids.some(id => VALID_PLACE_P31.has(id));
    // Also count if it has ANY territorial/geographic P31 (using Q keyword match)
    const hasAnyP31 = p31Ids.length > 0;

    const labelOk = labelMatchesName(label, name);
    const ok = labelOk; // P31 check is informational only for now since some valid entities use narrow QIDs

    const reason = !labelOk ? `label mismatch: "${label}"` : (hasAnyP31 && !hasValidP31 ? `P31 not in allowlist: ${p31Ids.join(",")}` : "");

    rows.push({ name, slug, qid, label, p31: p31Ids.join(", ") || "(none)", ok, reason });
    if (!ok || (hasAnyP31 && !hasValidP31)) {
      flags.push(`${ok ? "P31_WARN" : "LABEL_FAIL"}  ${qid}  ${slug}  expected="${name}"  got="${label}"  p31=[${p31Ids.join(",")}]`);
    }
  }

  // Print table
  console.log("\nAUDIT RESULTS:");
  console.log("=".repeat(100));
  const colW = [32, 36, 10, 8];
  console.log(
    "Name".padEnd(colW[0]) + "Wikidata Label".padEnd(colW[1]) + "QID".padEnd(colW[2]) + "OK".padEnd(colW[3]) + "Note"
  );
  console.log("-".repeat(100));
  for (const r of rows) {
    const ok = r.ok ? "✓" : "✗ FAIL";
    console.log(
      r.name.padEnd(colW[0]) +
      r.label.slice(0, 35).padEnd(colW[1]) +
      r.qid.padEnd(colW[2]) +
      ok.padEnd(colW[3]) +
      (r.reason || "")
    );
  }

  console.log("\n");
  if (flags.length === 0) {
    console.log("✓ All entries passed.");
  } else {
    console.log(`⚠  ${flags.length} issue(s) found:`);
    for (const f of flags) console.log("  " + f);
  }
}

main().catch(console.error);
