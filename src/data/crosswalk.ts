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
  "Han dynasty":       { wikidataId: "Q7209",   slug: "han-dynasty", aliases: ["Han Dynasty", "Han", "Han Empire"], representativeYear: 100 }, // ✓ Han dynasty
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
  "Portuguese Empire": { wikidataId: "Q200464",  slug: "portuguese-empire", aliases: ["Portugal"], years: [1415, 1999], representativeYear: 1700 },  // Portuguese Empire (Ceuta 1415 to Macau 1999)
  "Portugal": { wikidataId: "Q45", slug: "portugal", representativeYear: 2000 }, // Portugal: medieval kingdom and modern state
  "British Empire": { wikidataId: "Q8680", slug: "british-empire", aliases: ["Great Britain", "United Kingdom", "United Kingdom of Great Britain and Ireland", "UK"], years: [1707, 1938], representativeYear: 1920 }, // ✓ British Empire
  "Dutch Republic": { wikidataId: "Q170072", slug: "dutch-republic", aliases: ["Netherlands", "United Provinces"], years: [1581, 1795], representativeYear: 1650 }, // Dutch Republic
  "Netherlands": { wikidataId: "Q55", slug: "netherlands", years: [1815, 2010], representativeYear: 2000 }, // Kingdom of the Netherlands, after Napoleon
  "Shan States": { wikidataId: "Q4765854", slug: "shan-states", representativeYear: 1600 }, // Shan States
  "Manchu Empire": { wikidataId: "Q8733", slug: "manchu-empire", aliases: ["Qing dynasty"], years: [1644, 1912], representativeYear: 1800 }, // Manchu Empire (Qing)
  "Kingdom of Prussia": { wikidataId: "Q27306", slug: "kingdom-of-prussia", aliases: ["Prussia"], representativeYear: 1783 }, // ✓ Kingdom of Prussia
  "Habsburg Monarchy": { wikidataId: "Q153136", slug: "habsburg-monarchy", aliases: ["Austria", "Habsburg", "Austrian Empire", "Habsburg Austria"], years: [1500, 1815], representativeYear: 1700 }, // Habsburg Monarchy
  "Sweden": { wikidataId: "Q34", slug: "sweden", aliases: ["Swedish Empire"], representativeYear: 1650 }, // ✓ Sweden
  "Denmark": { wikidataId: "Q35", slug: "denmark", representativeYear: 2000 }, // ✓ Denmark
  "Russia": { wikidataId: "Q159", slug: "russia", representativeYear: 2000 }, // ✓ Russia
  "Russian Empire": { wikidataId: "Q34266", slug: "russian-empire", representativeYear: 1900 }, // ✓ Russian Empire

  // ── Modern ───────────────────────────────────────────────────────────────
  "First French Empire": { wikidataId: "Q71084", slug: "first-french-empire", aliases: ["French Empire", "France"], years: [1804, 1814], representativeYear: 1810 }, // First French Empire
  "French First Republic": { wikidataId: "Q58296", slug: "french-first-republic", aliases: ["France"], years: [1792, 1803], representativeYear: 1800 }, // France in the 1800 snapshot (the Consulate)
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

  // Ancient Egypt by period. The ancient snapshots label Egypt plainly "Egypt";
  // these year-bounded entries keep it from resolving to the modern country.
  "Prehistoric Egypt": { wikidataId: "Q208520", slug: "prehistoric-egypt", aliases: ["Egypt"], years: [-6000, -3151], representativeYear: -4000 }, // Prehistoric Egypt
  "Early Dynastic Egypt": { wikidataId: "Q187979", slug: "early-dynastic-egypt", aliases: ["Egypt"], years: [-3150, -2686], representativeYear: -3000 }, // Early Dynastic Period of Egypt
  "Middle Kingdom of Egypt": { wikidataId: "Q191324", slug: "middle-kingdom-of-egypt", aliases: ["Egypt"], years: [-2055, -1650], representativeYear: -2000 }, // Middle Kingdom of Egypt
  "New Kingdom of Egypt": { wikidataId: "Q180568", slug: "new-kingdom-of-egypt", aliases: ["Egypt"], years: [-1550, -1070], representativeYear: -1500 }, // New Kingdom of Egypt
  "Third Intermediate Period of Egypt": { wikidataId: "Q212728", slug: "third-intermediate-period-of-egypt", aliases: ["Egypt"], years: [-1069, -664], representativeYear: -1000 }, // Third Intermediate Period of Egypt

  // ── Added 2026-10: coverage expansion ─────────────────────────────────────
  // Keys are display names; aliases include the exact NAME string used in the
  // historical-basemaps snapshots (checked against every snapshot file). QIDs
  // resolved from the English Wikipedia article.
  "Elam": { wikidataId: "Q128904", slug: "elam", representativeYear: -2000 }, // Elam
  "Assyria": { wikidataId: "Q41137", slug: "assyria", representativeYear: -1000 }, // Assyria
  "Babylonia": { wikidataId: "Q47690", slug: "babylonia", representativeYear: -1000 }, // Babylonia
  "Hittites": { wikidataId: "Q5406", slug: "hittites", representativeYear: -1500 }, // Hittites
  "Minoan civilization": { wikidataId: "Q134178", slug: "minoan-civilization", aliases: ["Minoan"], representativeYear: -3000 }, // Minoan civilization
  "Indus Valley Civilisation": { wikidataId: "Q42534", slug: "indus-valley-civilisation", aliases: ["Indus valley civilization"], representativeYear: -3000 }, // Indus Valley Civilisation
  "Olmecs": { wikidataId: "Q135364", slug: "olmecs", aliases: ["Olmec"], representativeYear: -700 }, // Olmecs
  "Kingdom of Kush": { wikidataId: "Q241790", slug: "kingdom-of-kush", aliases: ["Kush", "Meroe", "Kushites"], representativeYear: -1000 }, // Kingdom of Kush
  "Urartu": { wikidataId: "Q185068", slug: "urartu", representativeYear: -1000 }, // Urartu
  "Scythians": { wikidataId: "Q131802", slug: "scythians", representativeYear: -200 }, // Scythians
  "Celts": { wikidataId: "Q35966", slug: "celts", aliases: ["Celtic kingdoms"], representativeYear: -300 }, // Celts
  "Zhou dynasty": { wikidataId: "Q35216", slug: "zhou-dynasty", aliases: ["Zhou states"], representativeYear: -400 }, // Zhou dynasty
  "Qin dynasty": { wikidataId: "Q7183", slug: "qin-dynasty", aliases: ["Qin"], representativeYear: -323 }, // Qin dynasty
  "Xiongnu": { wikidataId: "Q188836", slug: "xiongnu", representativeYear: -200 }, // Xiongnu
  "Parthian Empire": { wikidataId: "Q1986139", slug: "parthian-empire", representativeYear: 100 }, // Parthian Empire
  "Kushan Empire": { wikidataId: "Q25979", slug: "kushan-empire", representativeYear: -100 }, // Kushan Empire
  "Teotihuacan": { wikidataId: "Q172613", slug: "teotihuacan", representativeYear: 100 }, // Teotihuacan
  "Moche culture": { wikidataId: "Q208188", slug: "moche-culture", aliases: ["Moche"], representativeYear: 300 }, // Moche culture
  "Silla": { wikidataId: "Q28456", slug: "silla", representativeYear: 400 }, // Silla
  "Sui dynasty": { wikidataId: "Q7405", slug: "sui-dynasty", aliases: ["Sui Empire"], representativeYear: 600 }, // Sui dynasty
  "Göktürks": { wikidataId: "Q205466", slug: "gokturks", representativeYear: 600 }, // Göktürks
  "Khazars": { wikidataId: "Q173282", slug: "khazars", representativeYear: 800 }, // Khazars
  "Kievan Rus'": { wikidataId: "Q1108445", slug: "kievan-rus", aliases: ["Kievan Rus", "Kyivan Rus", "Rus' Khaganate"], representativeYear: 1100 }, // Kievan Rus'
  "Pala Empire": { wikidataId: "Q668412", slug: "pala-empire", aliases: ["Palas"], representativeYear: 900 }, // Pala Empire
  "Fatimid Caliphate": { wikidataId: "Q160307", slug: "fatimid-caliphate", representativeYear: 1100 }, // Fatimid Caliphate
  "Samanid Empire": { wikidataId: "Q12150341", slug: "samanid-empire", representativeYear: 900 }, // Samanid Empire
  "Ghaznavid Empire": { wikidataId: "Q249578", slug: "ghaznavid-empire", aliases: ["Ghaznavid Emirate"], representativeYear: 1100 }, // Ghaznavid Empire
  "Seljuk Empire": { wikidataId: "Q3708094", slug: "seljuk-empire", aliases: ["Seljuk Caliphate"], representativeYear: 1100 }, // Seljuk Empire
  "Liao dynasty": { wikidataId: "Q4958", slug: "liao-dynasty", aliases: ["Liao"], representativeYear: 1100 }, // Liao dynasty
  "Chola dynasty": { wikidataId: "Q151148", slug: "chola-dynasty", aliases: ["Chola Empire", "Cholas", "Chola"], representativeYear: 1279 }, // Chola dynasty
  "Kingdom of Great Zimbabwe": { wikidataId: "Q596092", slug: "kingdom-of-great-zimbabwe", aliases: ["Great Zimbabwe"], representativeYear: 1200 }, // Kingdom of Great Zimbabwe
  "Toltec": { wikidataId: "Q187897", slug: "toltec", aliases: ["Toltec Empire"], representativeYear: 1000 }, // Toltec
  "Tiwanaku": { wikidataId: "Q61750", slug: "tiwanaku", aliases: ["Tiahuanaco Empire"], representativeYear: 900 }, // Tiwanaku
  "Wari culture": { wikidataId: "Q605340", slug: "wari-culture", aliases: ["Huari Empire"], representativeYear: 900 }, // Wari culture
  "Chimor": { wikidataId: "Q581741", slug: "chimor", aliases: ["Chimú Empire"], representativeYear: 1200 }, // Chimor
  "Almoravid dynasty": { wikidataId: "Q75613", slug: "almoravid-dynasty", representativeYear: 1100 }, // Almoravid dynasty
  "Almohad Caliphate": { wikidataId: "Q199688", slug: "almohad-caliphate", representativeYear: 1200 }, // Almohad Caliphate
  "Goryeo": { wikidataId: "Q28208", slug: "goryeo", aliases: ["Korea"], years: [918, 1391], representativeYear: 1200 }, // Goryeo
  "Kanem–Bornu Empire": { wikidataId: "Q1139762", slug: "kanem-bornu-empire", aliases: ["Kanem-Bornu", "Kanem"], representativeYear: 1650 }, // Kanem–Bornu Empire
  "Champa": { wikidataId: "Q216786", slug: "champa", representativeYear: 1000 }, // Champa
  "Mamluk Sultanate": { wikidataId: "Q282428", slug: "mamluk-sultanate", aliases: ["Mamluke Sultanate"], representativeYear: 1400 }, // Mamluk Sultanate
  "Yuan dynasty": { wikidataId: "Q7313", slug: "yuan-dynasty", aliases: ["Great Khanate"], years: [1271, 1368], representativeYear: 1300 }, // Yuan dynasty
  "Chagatai Khanate": { wikidataId: "Q487829", slug: "chagatai-khanate", representativeYear: 1400 }, // Chagatai Khanate
  "Kamakura shogunate": { wikidataId: "Q736839", slug: "kamakura-shogunate", aliases: ["Shogun Japan (Kamakura)"], representativeYear: 1300 }, // Kamakura shogunate
  "State of the Teutonic Order": { wikidataId: "Q156020", slug: "state-of-the-teutonic-order", aliases: ["Teutonic Knights", "Teutonic Order"], representativeYear: 1400 }, // State of the Teutonic Order
  "Grand Principality of Moscow": { wikidataId: "Q170770", slug: "grand-principality-of-moscow", aliases: ["Grand Duchy of Moscow"], representativeYear: 1492 }, // Grand Principality of Moscow
  "Ayutthaya Kingdom": { wikidataId: "Q841364", slug: "ayutthaya-kingdom", aliases: ["Ayutthaya"], representativeYear: 1530 }, // Ayutthaya Kingdom
  "Emirate of Granada": { wikidataId: "Q238445", slug: "emirate-of-granada", aliases: ["Granada"], representativeYear: 1300 }, // Emirate of Granada
  "Crown of Castile": { wikidataId: "Q217196", slug: "crown-of-castile", aliases: ["Castile", "Castilla", "Castille"], representativeYear: 1300 }, // Crown of Castile
  "Crimean Khanate": { wikidataId: "Q160440", slug: "crimean-khanate", representativeYear: 1500 }, // Crimean Khanate
  "Tsardom of Russia": { wikidataId: "Q186096", slug: "tsardom-of-russia", aliases: ["Tsardom of Muscovy"], representativeYear: 1650 }, // Tsardom of Russia
  "Oyo Empire": { wikidataId: "Q849623", slug: "oyo-empire", aliases: ["Oyo"], representativeYear: 1700 }, // Oyo Empire
  "Asante Empire": { wikidataId: "Q722071", slug: "asante-empire", aliases: ["Asante"], representativeYear: 1800 }, // Asante Empire
  "Kingdom of Benin": { wikidataId: "Q171203", slug: "kingdom-of-benin", aliases: ["Benin"], years: [1200, 1900], representativeYear: 1530 }, // Kingdom of Benin
  "Tokugawa shogunate": { wikidataId: "Q205662", slug: "tokugawa-shogunate", representativeYear: 1700 }, // Tokugawa shogunate
  "Haudenosaunee": { wikidataId: "Q68518", slug: "haudenosaunee", aliases: ["Iroquois"], representativeYear: 1600 }, // Haudenosaunee
  "Comanche": { wikidataId: "Q117133", slug: "comanche", representativeYear: 1600 }, // Comanche
  "New Spain": { wikidataId: "Q170603", slug: "new-spain", aliases: ["Viceroyalty of New Spain"], representativeYear: 1700 }, // New Spain
  "Sikh Empire": { wikidataId: "Q83572", slug: "sikh-empire", aliases: ["Sikhs"], representativeYear: 1800 }, // Sikh Empire
  "Hawaiian Kingdom": { wikidataId: "Q156418", slug: "hawaiian-kingdom", aliases: ["Kingdom of Hawaii"], representativeYear: 1880 }, // Hawaiian Kingdom
  "Sokoto Caliphate": { wikidataId: "Q600524", slug: "sokoto-caliphate", representativeYear: 1880 }, // Sokoto Caliphate
  "British Raj": { wikidataId: "Q129286", slug: "british-raj", representativeYear: 1914 }, // British Raj
  "Empire of Japan": { wikidataId: "Q188712", slug: "empire-of-japan", aliases: ["Imperial Japan"], years: [1868, 1945], representativeYear: 1920 }, // Empire of Japan
  "Soviet Union": { wikidataId: "Q15180", slug: "soviet-union", aliases: ["USSR", "White Russia", "Far Eastern SSR"], representativeYear: 1938 }, // Soviet Union
  "China": { wikidataId: "Q148", slug: "china", years: [1949, 2010], representativeYear: 1994 }, // China
  "Italy": { wikidataId: "Q38", slug: "italy", aliases: ["Kingdom of Italy"], representativeYear: 1938 }, // Italy
  "Spain": { wikidataId: "Q29", slug: "spain", years: [1900, 2010], representativeYear: 1938 }, // Spain
  "Canada": { wikidataId: "Q16", slug: "canada", representativeYear: 1930 }, // Canada
  "Australia": { wikidataId: "Q408", slug: "australia", representativeYear: 1945 }, // Australia
  "South Africa": { wikidataId: "Q258", slug: "south-africa", aliases: ["Union of South Africa"], representativeYear: 1960 }, // South Africa
  "Morocco": { wikidataId: "Q1028", slug: "morocco", representativeYear: 1880 }, // Morocco
  "Afghanistan": { wikidataId: "Q889", slug: "afghanistan", representativeYear: 1920 }, // Afghanistan
  "Tibet": { wikidataId: "Q17252", slug: "tibet", years: [950, 1950], representativeYear: 1530 }, // Tibet
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
