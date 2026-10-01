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
  "Achaemenid Empire": { wikidataId: "Q389688", slug: "achaemenid-empire", aliases: ["Persian Empire", "Persia"], years: [-550, -330], representativeYear: -500 }, // Achaemenid Empire
  "Macedonian Empire": { wikidataId: "Q83958",   slug: "macedonian-empire", aliases: ["Empire of Alexander", "Alexander's Empire"], representativeYear: -323 }, // Empire of Alexander
  "Seleucid Empire": { wikidataId: "Q93180", slug: "seleucid-empire", aliases: ["Seleucid Kingdom"], representativeYear: -300 }, // Seleucid Empire
  "Ptolemaic Kingdom": { wikidataId: "Q2320005", slug: "ptolemaic-kingdom", aliases: ["Ptolemaic Egypt"], representativeYear: -200 }, // Ptolemaic Kingdom
  "Roman Republic": { wikidataId: "Q17167", slug: "roman-republic", aliases: ["Rome"], years: [-510, -27], representativeYear: -100 }, // Roman Republic
  "Roman Empire": { wikidataId: "Q2277", slug: "roman-empire", aliases: ["Rome (Constantinus)", "Rome (Diocletianus)", "Rome (Galerius)", "Rome (Maximian)"], representativeYear: 117 }, // ✓ Roman Empire
  "Western Roman Empire": { wikidataId: "Q42834", slug: "western-roman-empire", representativeYear: 400 }, // Western Roman Empire
  "Byzantine Empire":  { wikidataId: "Q12544",  slug: "byzantine-empire", aliases: ["Eastern Roman Empire", "Byzantium"], representativeYear: 550 }, // Byzantine Empire
  "Maurya Empire": { wikidataId: "Q62943", slug: "maurya-empire", aliases: ["Mauryan Empire"], representativeYear: -250 }, // Maurya Empire
  "Gupta Empire":      { wikidataId: "Q11774", slug: "gupta-empire", representativeYear: 400 },                              // Gupta Empire
  "Han dynasty":       { wikidataId: "Q7209",   slug: "han-dynasty", aliases: ["Han Dynasty", "Han"], representativeYear: 100 }, // ✓ Han dynasty
  "Kingdom of Aksum": { wikidataId: "Q139377", slug: "kingdom-of-aksum", aliases: ["Axum", "Aksumite Empire"], representativeYear: 300 }, // Kingdom of Aksum
  "Carthage": { wikidataId: "Q6343", slug: "carthage", aliases: ["Carthaginian Empire"], representativeYear: -300 }, // ✓ Carthage

  // ── Late Antiquity / Early Medieval ──────────────────────────────────────
  "Sasanian Empire": { wikidataId: "Q83891", slug: "sasanian-empire", aliases: ["Sassanid Empire", "Sassanid Persia"], representativeYear: 600 }, // Sasanian Empire
  "Rashidun Caliphate": { wikidataId: "Q12490507", slug: "rashidun-caliphate", representativeYear: 650, mapView: { lat: 28, lng: 45, zoom: 3.5 } }, // Rashidun Caliphate
  "Umayyad Caliphate": { wikidataId: "Q8575586", slug: "umayyad-caliphate", aliases: ["Umayyad"], representativeYear: 700 }, // Umayyad Caliphate
  "Abbasid Caliphate": { wikidataId: "Q12536", slug: "abbasid-caliphate", aliases: ["Abbasid"], representativeYear: 800 }, // Abbasid Caliphate
  "Frankish Kingdom": { wikidataId: "Q146246", slug: "frankish-kingdom", aliases: ["Franks", "Francia"], representativeYear: 600 }, // Francia
  "Carolingian Empire": { wikidataId: "Q31929", slug: "carolingian-empire", representativeYear: 800 }, // Carolingian Empire
  "Tang dynasty": { wikidataId: "Q9683", slug: "tang-dynasty", aliases: ["Tang Dynasty", "Tang", "Tang Empire"], representativeYear: 800 }, // Tang dynasty
  "Tibetan Empire": { wikidataId: "Q2431480", slug: "tibetan-empire", representativeYear: 800 }, // Tibetan Empire
  "Hunnic Empire":     { wikidataId: "Q10295972", slug: "hunnic-empire", representativeYear: 434 },   // Hunnic Empire

  // ── Medieval ─────────────────────────────────────────────────────────────
  "Holy Roman Empire": { wikidataId: "Q12548", slug: "holy-roman-empire", representativeYear: 1500 }, // ✓ Holy Roman Empire
  "Mongol Empire": { wikidataId: "Q12557", slug: "mongol-empire", representativeYear: 1279 }, // ✓ Mongol Empire
  "Golden Horde": { wikidataId: "Q79965", slug: "golden-horde", aliases: ["Khanate of the Golden Horde"], representativeYear: 1300 }, // Golden Horde
  "Ilkhanate": { wikidataId: "Q178084", slug: "ilkhanate", representativeYear: 1300 }, // Ilkhanate
  "Timurid Empire": { wikidataId: "Q484195", slug: "timurid-empire", aliases: ["Timurids", "Timurid Emirates"], representativeYear: 1400 }, // Timurid Empire
  "Song dynasty": { wikidataId: "Q7462", slug: "song-dynasty", aliases: ["Song Dynasty", "Song", "Song Empire"], representativeYear: 1100 }, // Song dynasty
  "Ming dynasty": { wikidataId: "Q9903", slug: "ming-dynasty", aliases: ["Ming Dynasty", "Ming", "Ming Empire", "Ming Chinese Empire"], representativeYear: 1500 }, // ✓ Ming dynasty
  "Ghana Empire": { wikidataId: "Q206789", slug: "ghana-empire", aliases: ["Empire of Ghana", "Ghana"], years: [300, 1100], representativeYear: 1000 }, // Ghana Empire
  "Mali Empire": { wikidataId: "Q184536", slug: "mali-empire", aliases: ["Mali"], years: [1200, 1600], representativeYear: 1300 }, // Mali Empire
  "Songhai Empire": { wikidataId: "Q202687", slug: "songhai-empire", aliases: ["Songhai"], representativeYear: 1500 }, // Songhai Empire
  "Khmer Empire": { wikidataId: "Q201705", slug: "khmer-empire", representativeYear: 1200 }, // Khmer Empire
  "Srivijaya": { wikidataId: "Q234197", slug: "srivijaya", aliases: ["Srivijaya Empire"], representativeYear: 1000 }, // Srivijaya
  "Majapahit": { wikidataId: "Q49326", slug: "majapahit", aliases: ["Majapahit Empire"], representativeYear: 1350, mapView: { lat: -5, lng: 112, zoom: 4 } }, // Majapahit
  "Delhi Sultanate": { wikidataId: "Q229411", slug: "delhi-sultanate", aliases: ["Sultanate of Delhi"], representativeYear: 1300 }, // Delhi Sultanate
  "Aztec Empire": { wikidataId: "Q2608489", slug: "aztec-empire", aliases: ["Triple Alliance", "Aztecs"], representativeYear: 1500 }, // ✓ Aztec
  "Inca Empire": { wikidataId: "Q28573", slug: "inca-empire", aliases: ["Tawantinsuyu", "Inca"], representativeYear: 1500 }, // Inca Empire
  "Republic of Venice": { wikidataId: "Q4948", slug: "republic-of-venice", aliases: ["Venice", "Venetian Republic"], representativeYear: 1500 }, // ✓ Republic of Venice
  "Papal States": { wikidataId: "Q170174", slug: "papal-states", representativeYear: 1500 }, // Papal States
  "Kingdom of France": { wikidataId: "Q70972", slug: "kingdom-of-france", aliases: ["France"], years: [987, 1791], representativeYear: 1700 }, // ✓ Kingdom of France
  "Kingdom of England": { wikidataId: "Q179876", slug: "kingdom-of-england", aliases: ["England", "England and Ireland"], years: [900, 1706], representativeYear: 1500 }, // ✓ Kingdom of England
  "Kingdom of Scotland": { wikidataId: "Q230791", slug: "kingdom-of-scotland", aliases: ["Scotland"], representativeYear: 1500 }, // Kingdom of Scotland
  "Poland": { wikidataId: "Q36", slug: "poland", representativeYear: 2000 }, // ✓ Poland
  "Polish-Lithuanian Commonwealth": { wikidataId: "Q172107", slug: "polish-lithuanian-commonwealth", aliases: ["Polish–Lithuanian Commonwealth", "Poland-Lithuania"], representativeYear: 1650 }, // Polish–Lithuanian Commonwealth
  "PolishLithuanian Commonwealth": { wikidataId: "Q172107", slug: "polishlithuanian-commonwealth", aliases: ["Polish Lithuanian Commonwealth"], representativeYear: 1650 }, // Snapshot slug variant

  // ── Early Modern ─────────────────────────────────────────────────────────
  "Ottoman Empire":    { wikidataId: "Q12560",  slug: "ottoman-empire", aliases: ["Ottoman", "Ottomans"], representativeYear: 1700 }, // ✓ Ottoman Empire
  "Safavid dynasty": { wikidataId: "Q161205", slug: "safavid-dynasty", aliases: ["Safavid Persia", "Safavid"], representativeYear: 1600, mapRegionId: "Q18234383" }, // Safavid dynasty
  "Safavid Empire": { wikidataId: "Q18234383", slug: "safavid-empire", aliases: ["Safavid Iran"], representativeYear: 1600 }, // Safavid Empire (snapshot variant)
  "Mughal Empire":     { wikidataId: "Q33296",  slug: "mughal-empire", aliases: ["Mughals"], representativeYear: 1700 },       // Mughal Empire
  "Vijayanagara Empire": { wikidataId: "Q167639", slug: "vijayanagara-empire", aliases: ["Vijayanagara"], representativeYear: 1530 }, // Vijayanagara Empire
  "Maratha Empire": { wikidataId: "Q83618", slug: "maratha-empire", aliases: ["Marathas", "Maratha", "Maratha Confederacy"], representativeYear: 1783 }, // Maratha Confederacy
  "Qing dynasty": { wikidataId: "Q8733", slug: "qing-dynasty", aliases: ["Qing Dynasty", "Qing", "China", "Qing Empire", "Manchu Empire"], years: [1644, 1912], representativeYear: 1800 }, // ✓ Qing dynasty
  "Joseon dynasty": { wikidataId: "Q28179", slug: "joseon-dynasty", aliases: ["Joseon", "Korea"], years: [1392, 1897], representativeYear: 1700 }, // ✓ Joseon
  "Spanish Empire": { wikidataId: "Q80702", slug: "spanish-empire", aliases: ["Spain", "Spanish Habsburg"], representativeYear: 1700 }, // Spanish Empire
  "Portuguese Empire": { wikidataId: "Q200464",  slug: "portuguese-empire", aliases: ["Portugal"], representativeYear: 1700 },  // Portuguese Empire
  "British Empire": { wikidataId: "Q8680", slug: "british-empire", aliases: ["Great Britain", "United Kingdom", "United Kingdom of Great Britain and Ireland", "UK"], years: [1707, 1938], representativeYear: 1920 }, // ✓ British Empire
  "Dutch Republic": { wikidataId: "Q170072", slug: "dutch-republic", aliases: ["Netherlands", "United Provinces"], representativeYear: 1650 }, // Dutch Republic
  "Shan States": { wikidataId: "Q4765854", slug: "shan-states", representativeYear: 1600 }, // Shan States
  "Manchu Empire": { wikidataId: "Q8733", slug: "manchu-empire", aliases: ["Qing dynasty"], years: [1644, 1912], representativeYear: 1800 }, // Manchu Empire (Qing)
  "Kingdom of Prussia": { wikidataId: "Q27306", slug: "kingdom-of-prussia", aliases: ["Prussia"], representativeYear: 1783 }, // ✓ Kingdom of Prussia
  "Habsburg Monarchy": { wikidataId: "Q153136", slug: "habsburg-monarchy", aliases: ["Austria", "Habsburg", "Austrian Empire", "Habsburg Austria"], years: [1500, 1815], representativeYear: 1700 }, // Habsburg Monarchy
  "Sweden": { wikidataId: "Q34", slug: "sweden", aliases: ["Swedish Empire"], representativeYear: 1650 }, // ✓ Sweden
  "Denmark": { wikidataId: "Q35", slug: "denmark", representativeYear: 2000 }, // ✓ Denmark
  "Russia": { wikidataId: "Q159", slug: "russia", representativeYear: 2000 }, // ✓ Russia
  "Russian Empire": { wikidataId: "Q34266", slug: "russian-empire", representativeYear: 1900 }, // ✓ Russian Empire

  // ── Modern ───────────────────────────────────────────────────────────────
  "First French Empire": { wikidataId: "Q71084", slug: "first-french-empire", aliases: ["French Empire", "France"], years: [1800, 1800], representativeYear: 1810 }, // First French Empire
  "France": { wikidataId: "Q142", slug: "france", representativeYear: 2000 }, // ✓ France
  "German Empire": { wikidataId: "Q43287", slug: "german-empire", aliases: ["Germany", "Reich"], years: [1871, 1918], representativeYear: 1914 }, // ✓ German Empire
  "Austria-Hungary": { wikidataId: "Q28513", slug: "austria-hungary", aliases: ["Austria Hungary", "Austro-Hungarian Empire"], representativeYear: 1900 }, // ✓ Austria–Hungary
  "Nazi Germany": { wikidataId: "Q7318", slug: "nazi-germany", aliases: ["Third Reich", "Germany"], years: [1933, 1945], representativeYear: 1938 }, // ✓ Nazi Germany
  "United Kingdom": { wikidataId: "Q145", slug: "united-kingdom", representativeYear: 2000 }, // ✓ United Kingdom
  "United States": { wikidataId: "Q30", slug: "united-states", aliases: ["USA", "U.S.A.", "United States of America"], representativeYear: 2000 }, // ✓ United States
  "Confederate States": { wikidataId: "Q81931", slug: "confederate-states-of-america", representativeYear: 1862, mapView: { lat: 33, lng: -86, zoom: 4.5 } }, // Confederate States
  "Mexico": { wikidataId: "Q96", slug: "mexico", representativeYear: 2000 }, // ✓ Mexico
  "Brazil": { wikidataId: "Q155", slug: "brazil", representativeYear: 2000 }, // ✓ Brazil
  "Argentina": { wikidataId: "Q414", slug: "argentina", representativeYear: 2000 }, // ✓ Argentina
  "Egypt": { wikidataId: "Q79", slug: "egypt", representativeYear: 2000 }, // ✓ Egypt
  "Ethiopia": { wikidataId: "Q115", slug: "ethiopia", aliases: ["Abyssinia"], representativeYear: 2000 }, // ✓ Ethiopia
  "Zulu Kingdom": { wikidataId: "Q729768", slug: "zulu-kingdom", aliases: ["Zululand", "Zulu"], representativeYear: 1880 }, // Zulu Kingdom
  "Haiti":             { wikidataId: "Q790",    slug: "haiti", representativeYear: 1820 },             // Haiti
  "Kingdom of Kongo": { wikidataId: "Q796583", slug: "kingdom-of-kongo", aliases: ["Kongo", "Congo"], years: [1390, 1857], representativeYear: 1500 }, // Kingdom of Kongo
  "Japan": { wikidataId: "Q17", slug: "japan", representativeYear: 2000 }, // ✓ Japan
  "India": { wikidataId: "Q668", slug: "india", representativeYear: 2000 }, // ✓ India
  "Iran": { wikidataId: "Q794", slug: "iran", aliases: ["Persia"], representativeYear: 2000 }, // ✓ Iran
  "Turkey": { wikidataId: "Q43", slug: "turkey", representativeYear: 2000 }, // ✓ Turkey
  "Saudi Arabia": { wikidataId: "Q851", slug: "saudi-arabia", representativeYear: 2000 }, // ✓ Saudi Arabia
  "Vietnam": { wikidataId: "Q881", slug: "vietnam", representativeYear: 2000 }, // ✓ Vietnam
  "Norway": { wikidataId: "Q20", slug: "norway", representativeYear: 2000 }, // ✓ Norway
  "Switzerland": { wikidataId: "Q39", slug: "switzerland", aliases: ["Swiss Confederation"], representativeYear: 2000 }, // ✓ Switzerland
  "Belgium": { wikidataId: "Q31", slug: "belgium", representativeYear: 2000 }, // ✓ Belgium
  "Hungary": { wikidataId: "Q28", slug: "hungary", representativeYear: 2000 }, // ✓ Hungary
};

// ---------------------------------------------------------------------------
// Build reverse lookups at module load time
// ---------------------------------------------------------------------------

/** Normalise a name for lookup: lowercase, trim, collapse internal spaces. */
function normalise(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

const _normalisedMap = new Map<string, CrosswalkEntry[]>();
const _slugToEntry   = new Map<string, CrosswalkEntry>();
const _qidToEntry    = new Map<string, CrosswalkEntry>();
const _qidToCanonicalName = new Map<string, string>();

function addName(name: string, entry: CrosswalkEntry): void {
  const key = normalise(name);
  const list = _normalisedMap.get(key);
  if (!list) {
    _normalisedMap.set(key, [entry]);
  } else if (!list.includes(entry)) {
    // Year-bounded entries are more specific, so they're tried first.
    if (entry.years) list.unshift(entry);
    else list.push(entry);
  }
}

for (const [name, entry] of Object.entries(CROSSWALK)) {
  addName(name, entry);
  _slugToEntry.set(entry.slug, entry);
  _qidToEntry.set(entry.wikidataId, entry);
  _qidToCanonicalName.set(entry.wikidataId, name);
  if (entry.aliases) {
    for (const alias of entry.aliases) addName(alias, entry);
  }
}

function inYears(entry: CrosswalkEntry, year: number | undefined): boolean {
  if (!entry.years || year === undefined) return true;
  return year >= entry.years[0] && year <= entry.years[1];
}

/**
 * Look up a crosswalk entry by territory name (case-insensitive). When a
 * snapshot year is given, entries whose `years` range excludes it are skipped.
 */
export function lookupByName(name: string, year?: number): CrosswalkEntry | undefined {
  const list = _normalisedMap.get(normalise(name));
  if (!list) return undefined;
  if (year === undefined) return list.find((e) => !e.years) ?? list[0];
  return list.find((e) => inYears(e, year));
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

  addName(canonicalName, entry);
  _slugToEntry.set(entry.slug, entry);
  _qidToEntry.set(entry.wikidataId, entry);
  _qidToCanonicalName.set(entry.wikidataId, canonicalName);

  for (const alias of aliases) addName(alias, entry);
}

/**
 * Resolve a feature's name and sovereign to the best available crosswalk entry.
 * Tries NAME first, then SUBJECTO. `snapshotYear` picks the era-appropriate
 * entry for generic names (e.g. "France" in 1700 vs 1900).
 */
export function resolveFeature(
  name: string,
  sovereign: string,
  snapshotYear?: number
): CrosswalkEntry | undefined {
  return lookupByName(name, snapshotYear) ?? lookupByName(sovereign, snapshotYear);
}

/** Map-link parameters (year, region, camera) for a crosswalk entry. */
export function mapLinkFor(entry: CrosswalkEntry): {
  year?: number;
  regionId?: string;
  view?: { lat: number; lng: number; zoom: number };
} {
  return {
    year: entry.representativeYear,
    regionId: entry.mapView ? undefined : (entry.mapRegionId ?? entry.wikidataId),
    view: entry.mapView,
  };
}
