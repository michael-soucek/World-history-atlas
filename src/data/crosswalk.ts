import type { CrosswalkEntry } from "@/types";

/**
 * Crosswalk: maps territory/polity names (as they appear in historical-basemaps
 * NAME and SUBJECTO fields) to canonical Wikidata Q-IDs and URL slugs.
 *
 * v1: hand-mapped ~100 most prominent polities.
 * Unmapped regions degrade gracefully: show name + "search Wikipedia" link.
 *
 * Aliases capture alternate spellings/names used across different snapshot years.
 */
// ---------------------------------------------------------------------------
// QID VERSIONING NOTE
// These QIDs were audited via scripts/audit-crosswalk.mjs.
// Run that script after any changes to detect label / type mismatches.
// Confirmed-correct entries are marked ✓. Others are best-effort from
// Wikidata training data; the runtime label guard in lib/wikidata.ts catches
// any remaining mismatches and degrades gracefully.
// ---------------------------------------------------------------------------
export const CROSSWALK: Record<string, CrosswalkEntry> = {
  // ── Ancient World ────────────────────────────────────────────────────────
  "Achaemenid Empire": { wikidataId: "Q11765",  slug: "achaemenid-empire", aliases: ["Persian Empire", "Persia"] },   // Achaemenid Empire
  "Macedonian Empire": { wikidataId: "Q8168",   slug: "macedonian-empire", aliases: ["Empire of Alexander", "Alexander's Empire"] }, // Empire of Alexander
  "Seleucid Empire":   { wikidataId: "Q12280",  slug: "seleucid-empire" },                          // Seleucid Empire
  "Ptolemaic Kingdom": { wikidataId: "Q11776",  slug: "ptolemaic-kingdom", aliases: ["Ptolemaic Egypt"] }, // Ptolemaic Kingdom
  "Roman Republic":    { wikidataId: "Q6134",   slug: "roman-republic" },                            // Roman Republic
  "Roman Empire":      { wikidataId: "Q2277",   slug: "roman-empire" },                              // ✓ Roman Empire
  "Western Roman Empire": { wikidataId: "Q186077", slug: "western-roman-empire" },                  // Western Roman Empire
  "Byzantine Empire":  { wikidataId: "Q41088",  slug: "byzantine-empire", aliases: ["Eastern Roman Empire", "Byzantium"] }, // Byzantine Empire
  "Maurya Empire":     { wikidataId: "Q9232",   slug: "maurya-empire" },                             // Maurya Empire
  "Gupta Empire":      { wikidataId: "Q188889", slug: "gupta-empire" },                              // Gupta Empire
  "Han dynasty":       { wikidataId: "Q7209",   slug: "han-dynasty", aliases: ["Han Dynasty", "Han"] }, // ✓ Han dynasty
  "Kingdom of Aksum":  { wikidataId: "Q135364", slug: "kingdom-of-aksum", aliases: ["Axum", "Aksumite Empire"] }, // Kingdom of Aksum
  "Carthage":          { wikidataId: "Q6343",   slug: "carthage" },                                  // ✓ Carthage

  // ── Late Antiquity / Early Medieval ──────────────────────────────────────
  "Sasanian Empire":   { wikidataId: "Q12557",  slug: "sasanian-empire", aliases: ["Sassanid Empire", "Sassanid Persia"] }, // Sasanian Empire
  "Rashidun Caliphate": { wikidataId: "Q9587",  slug: "rashidun-caliphate" },                       // Rashidun Caliphate
  "Umayyad Caliphate": { wikidataId: "Q8806",   slug: "umayyad-caliphate", aliases: ["Umayyad"] },  // Umayyad Caliphate
  "Abbasid Caliphate": { wikidataId: "Q9589",   slug: "abbasid-caliphate", aliases: ["Abbasid"] },  // Abbasid Caliphate
  "Frankish Kingdom":  { wikidataId: "Q12131",  slug: "frankish-kingdom", aliases: ["Franks", "Francia"] }, // Francia
  "Carolingian Empire":{ wikidataId: "Q150804", slug: "carolingian-empire" },                        // Carolingian Empire
  "Tang dynasty":      { wikidataId: "Q83381",  slug: "tang-dynasty", aliases: ["Tang Dynasty", "Tang"] }, // Tang dynasty
  "Tibetan Empire":    { wikidataId: "Q152526", slug: "tibetan-empire" },                            // Tibetan Empire

  // ── Medieval ─────────────────────────────────────────────────────────────
  "Holy Roman Empire": { wikidataId: "Q12548",  slug: "holy-roman-empire" },                        // ✓ Holy Roman Empire
  "Mongol Empire":     { wikidataId: "Q12544",  slug: "mongol-empire" },                             // ✓ Mongol Empire
  "Golden Horde":      { wikidataId: "Q131054", slug: "golden-horde" },                              // Golden Horde
  "Ilkhanate":         { wikidataId: "Q19609",  slug: "ilkhanate" },                                 // Ilkhanate
  "Timurid Empire":    { wikidataId: "Q165092", slug: "timurid-empire", aliases: ["Timurids"] },    // Timurid Empire
  "Song dynasty":      { wikidataId: "Q170384", slug: "song-dynasty", aliases: ["Song Dynasty", "Song"] }, // Song dynasty
  "Ming dynasty":      { wikidataId: "Q9903",   slug: "ming-dynasty", aliases: ["Ming Dynasty", "Ming"] }, // ✓ Ming dynasty
  "Ghana Empire":      { wikidataId: "Q174193", slug: "ghana-empire" },                              // Ghana Empire
  "Mali Empire":       { wikidataId: "Q181686", slug: "mali-empire" },                               // Mali Empire
  "Songhai Empire":    { wikidataId: "Q174295", slug: "songhai-empire" },                            // Songhai Empire
  "Khmer Empire":      { wikidataId: "Q12827",  slug: "khmer-empire" },                              // Khmer Empire
  "Srivijaya":         { wikidataId: "Q170037", slug: "srivijaya" },                                 // Srivijaya
  "Majapahit":         { wikidataId: "Q205909", slug: "majapahit", aliases: ["Majapahit Empire"] }, // Majapahit
  "Delhi Sultanate":   { wikidataId: "Q9471",   slug: "delhi-sultanate" },                           // Delhi Sultanate
  "Aztec Empire":      { wikidataId: "Q12542",  slug: "aztec-empire", aliases: ["Triple Alliance", "Aztecs"] }, // ✓ Aztec
  "Inca Empire":       { wikidataId: "Q35409",  slug: "inca-empire", aliases: ["Tawantinsuyu", "Inca"] }, // Inca Empire
  "Republic of Venice":{ wikidataId: "Q4948",   slug: "republic-of-venice", aliases: ["Venice", "Venetian Republic"] }, // ✓ Republic of Venice
  "Papal States":      { wikidataId: "Q170174", slug: "papal-states" },                              // Papal States
  "Kingdom of France": { wikidataId: "Q70972",  slug: "kingdom-of-france", aliases: ["France"] },   // ✓ Kingdom of France
  "Kingdom of England":{ wikidataId: "Q179876", slug: "kingdom-of-england", aliases: ["England"] }, // ✓ Kingdom of England
  "Kingdom of Scotland":{ wikidataId: "Q219567",slug: "kingdom-of-scotland", aliases: ["Scotland"] }, // Kingdom of Scotland
  "Poland":            { wikidataId: "Q36",     slug: "poland" },                                    // ✓ Poland
  "Polish-Lithuanian Commonwealth": { wikidataId: "Q172107", slug: "polish-lithuanian-commonwealth" }, // Polish–Lithuanian Commonwealth
  "PolishLithuanian Commonwealth": { wikidataId: "Q172107", slug: "polishlithuanian-commonwealth", aliases: ["Polish Lithuanian Commonwealth"] }, // Snapshot slug variant

  // ── Early Modern ─────────────────────────────────────────────────────────
  "Ottoman Empire":    { wikidataId: "Q12560",  slug: "ottoman-empire", aliases: ["Ottoman", "Ottomans"] }, // ✓ Ottoman Empire
  "Safavid dynasty":   { wikidataId: "Q130969", slug: "safavid-dynasty", aliases: ["Safavid Persia", "Safavid"] }, // Safavid dynasty
  "Safavid Empire":    { wikidataId: "Q18234383", slug: "safavid-empire", aliases: ["Safavid Iran"] }, // Safavid Empire (snapshot variant)
  "Mughal Empire":     { wikidataId: "Q33296",  slug: "mughal-empire", aliases: ["Mughals"] },       // Mughal Empire
  "Vijayanagara Empire":{ wikidataId: "Q75197", slug: "vijayanagara-empire" },                       // Vijayanagara Empire
  "Maratha Empire":    { wikidataId: "Q9396",   slug: "maratha-empire", aliases: ["Marathas"] },     // Maratha Confederacy
  "Qing dynasty":      { wikidataId: "Q8733",   slug: "qing-dynasty", aliases: ["Qing Dynasty", "Qing", "China"] }, // ✓ Qing dynasty
  "Joseon dynasty":    { wikidataId: "Q28179",  slug: "joseon-dynasty", aliases: ["Joseon", "Korea"] }, // ✓ Joseon
  "Spanish Empire":    { wikidataId: "Q170603", slug: "spanish-empire", aliases: ["Spain"] },        // Spanish Empire
  "Portuguese Empire": { wikidataId: "Q26241",  slug: "portuguese-empire", aliases: ["Portugal"] },  // Portuguese Empire
  "British Empire":    { wikidataId: "Q8680",   slug: "british-empire", aliases: ["Great Britain", "United Kingdom"] }, // ✓ British Empire
  "Dutch Republic":    { wikidataId: "Q170072", slug: "dutch-republic", aliases: ["Netherlands", "United Provinces"] }, // Dutch Republic
  "Shan States":       { wikidataId: "Q4765854", slug: "shan-states" },                                // Shan States
  "Manchu Empire":     { wikidataId: "Q8733",   slug: "manchu-empire", aliases: ["Qing dynasty"] },  // Manchu Empire (Qing)
  "Kingdom of Prussia":{ wikidataId: "Q27306",  slug: "kingdom-of-prussia", aliases: ["Prussia"] },  // ✓ Kingdom of Prussia
  "Habsburg Monarchy": { wikidataId: "Q48056",  slug: "habsburg-monarchy", aliases: ["Austria", "Habsburg"] }, // Habsburg Monarchy
  "Sweden":            { wikidataId: "Q34",     slug: "sweden", aliases: ["Swedish Empire"] },        // ✓ Sweden
  "Denmark":           { wikidataId: "Q35",     slug: "denmark" },                                    // ✓ Denmark
  "Russia":            { wikidataId: "Q159",    slug: "russia" },                                     // ✓ Russia
  "Russian Empire":    { wikidataId: "Q34266",  slug: "russian-empire" },                             // ✓ Russian Empire

  // ── Modern ───────────────────────────────────────────────────────────────
  "First French Empire":{ wikidataId: "Q40694", slug: "first-french-empire", aliases: ["French Empire", "Napoleon"] }, // First French Empire
  "France":            { wikidataId: "Q142",    slug: "france" },                                     // ✓ France
  "German Empire":     { wikidataId: "Q43287",  slug: "german-empire", aliases: ["Germany", "Reich"] }, // ✓ German Empire
  "Austria-Hungary":   { wikidataId: "Q28513",  slug: "austria-hungary" },                            // ✓ Austria–Hungary
  "Nazi Germany":      { wikidataId: "Q7318",   slug: "nazi-germany", aliases: ["Third Reich"] },     // ✓ Nazi Germany
  "United Kingdom":    { wikidataId: "Q145",    slug: "united-kingdom" },                             // ✓ United Kingdom
  "United States":     { wikidataId: "Q30",     slug: "united-states", aliases: ["USA", "U.S.A."] }, // ✓ United States
  "Confederate States":{ wikidataId: "Q18171",  slug: "confederate-states-of-america" },              // Confederate States
  "Mexico":            { wikidataId: "Q96",     slug: "mexico" },                                     // ✓ Mexico
  "Brazil":            { wikidataId: "Q155",    slug: "brazil" },                                     // ✓ Brazil
  "Argentina":         { wikidataId: "Q414",    slug: "argentina" },                                  // ✓ Argentina
  "Egypt":             { wikidataId: "Q79",     slug: "egypt" },                                      // ✓ Egypt
  "Ethiopia":          { wikidataId: "Q115",    slug: "ethiopia", aliases: ["Abyssinia"] },           // ✓ Ethiopia
  "Zulu Kingdom":      { wikidataId: "Q180003", slug: "zulu-kingdom", aliases: ["Zululand"] },        // Zulu Kingdom
  "Kingdom of Kongo":  { wikidataId: "Q33747",  slug: "kingdom-of-kongo", aliases: ["Kongo"] },      // Kingdom of Kongo
  "Japan":             { wikidataId: "Q17",     slug: "japan" },                                      // ✓ Japan
  "India":             { wikidataId: "Q668",    slug: "india" },                                      // ✓ India
  "Iran":              { wikidataId: "Q794",    slug: "iran", aliases: ["Persia"] },                  // ✓ Iran
  "Turkey":            { wikidataId: "Q43",     slug: "turkey" },                                     // ✓ Turkey
  "Saudi Arabia":      { wikidataId: "Q851",    slug: "saudi-arabia" },                               // ✓ Saudi Arabia
  "Vietnam":           { wikidataId: "Q881",    slug: "vietnam" },                                    // ✓ Vietnam
  "Norway":            { wikidataId: "Q20",     slug: "norway" },                                     // ✓ Norway
  "Switzerland":       { wikidataId: "Q39",     slug: "switzerland", aliases: ["Swiss Confederation"] }, // ✓ Switzerland
  "Belgium":           { wikidataId: "Q31",     slug: "belgium" },                                    // ✓ Belgium
  "Hungary":           { wikidataId: "Q28",     slug: "hungary" },                                    // ✓ Hungary
};

// ---------------------------------------------------------------------------
// Build reverse lookups at module load time
// ---------------------------------------------------------------------------

/** Normalise a name for lookup: lowercase, trim, collapse internal spaces. */
function normalise(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

const _normalisedMap = new Map<string, CrosswalkEntry>();
const _slugToEntry   = new Map<string, CrosswalkEntry>();
const _qidToEntry    = new Map<string, CrosswalkEntry>();
const _qidToCanonicalName = new Map<string, string>();

for (const [name, entry] of Object.entries(CROSSWALK)) {
  _normalisedMap.set(normalise(name), entry);
  _slugToEntry.set(entry.slug, entry);
  _qidToEntry.set(entry.wikidataId, entry);
  _qidToCanonicalName.set(entry.wikidataId, name);
  if (entry.aliases) {
    for (const alias of entry.aliases) {
      _normalisedMap.set(normalise(alias), entry);
    }
  }
}

/** Look up a crosswalk entry by territory name (case-insensitive). */
export function lookupByName(name: string): CrosswalkEntry | undefined {
  return _normalisedMap.get(normalise(name));
}

/** Look up a crosswalk entry by URL slug. */
export function lookupBySlug(slug: string): CrosswalkEntry | undefined {
  return _slugToEntry.get(slug);
}

/** Look up a crosswalk entry by Wikidata Q-ID. */
export function lookupByQid(qid: string): CrosswalkEntry | undefined {
  return _qidToEntry.get(qid);
}

/** Get the canonical crosswalk name for a Wikidata Q-ID, when known. */
export function getCanonicalNameByQid(qid: string): string | undefined {
  return _qidToCanonicalName.get(qid);
}

/**
 * Register an auto-resolved place mapping at runtime so future lookups hit
 * the in-memory crosswalk directly.
 */
export function registerResolvedPlace(
  canonicalName: string,
  entry: CrosswalkEntry,
  aliases: string[] = []
): void {
  if (!canonicalName.trim()) return;

  // Never overwrite existing verified entries.
  if (_qidToEntry.has(entry.wikidataId) || _slugToEntry.has(entry.slug)) return;

  CROSSWALK[canonicalName] = {
    wikidataId: entry.wikidataId,
    slug: entry.slug,
    aliases: aliases.length > 0 ? aliases : undefined,
  };

  _normalisedMap.set(normalise(canonicalName), entry);
  _slugToEntry.set(entry.slug, entry);
  _qidToEntry.set(entry.wikidataId, entry);
  _qidToCanonicalName.set(entry.wikidataId, canonicalName);

  for (const alias of aliases) {
    _normalisedMap.set(normalise(alias), entry);
  }
}

/**
 * Resolve a feature's name and sovereign to the best available crosswalk entry.
 * Tries NAME first, then SUBJECTO.
 */
export function resolveFeature(
  name: string,
  sovereign: string
): CrosswalkEntry | undefined {
  return lookupByName(name) ?? lookupByName(sovereign);
}
