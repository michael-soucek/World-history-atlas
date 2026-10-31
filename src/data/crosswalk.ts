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
  "Tibetan Empire": { wikidataId: "Q2431480", slug: "tibetan-empire", aliases: ["Tufan Empire"], representativeYear: 800 }, // Tibetan Empire
  "Hunnic Empire":     { wikidataId: "Q10295972", slug: "hunnic-empire", representativeYear: 434 },   // Hunnic Empire

  // ── Medieval ─────────────────────────────────────────────────────────────
  "Holy Roman Empire": { wikidataId: "Q12548", slug: "holy-roman-empire", representativeYear: 1500 }, // ✓ Holy Roman Empire
  "Mongol Empire": { wikidataId: "Q12557", slug: "mongol-empire", representativeYear: 1279 }, // ✓ Mongol Empire
  "Golden Horde": { wikidataId: "Q79965", slug: "golden-horde", aliases: ["Blue Horde", "Khanate of the Golden Horde"], representativeYear: 1300 }, // Golden Horde
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
  "Ottoman Empire":    { wikidataId: "Q12560",  slug: "ottoman-empire", aliases: ["Ottoman Sultanate", "Ottoman", "Ottomans"], representativeYear: 1700 }, // ✓ Ottoman Empire
  "Safavid dynasty": { wikidataId: "Q161205", slug: "safavid-dynasty", aliases: ["Safavid Persia", "Safavid"], representativeYear: 1600, mapRegionId: "Q18234383" }, // Safavid dynasty
  "Safavid Empire": { wikidataId: "Q18234383", slug: "safavid-empire", aliases: ["Safavid Iran"], representativeYear: 1600 }, // Safavid Empire (snapshot variant)
  "Mughal Empire":     { wikidataId: "Q33296",  slug: "mughal-empire", aliases: ["Mughals"], representativeYear: 1700 },       // Mughal Empire
  "Vijayanagara Empire": { wikidataId: "Q167639", slug: "vijayanagara-empire", aliases: ["Vijayanagara"], representativeYear: 1530 }, // Vijayanagara Empire
  "Maratha Empire": { wikidataId: "Q83618", slug: "maratha-empire", aliases: ["Mahratta states", "Marathas", "Maratha", "Maratha Confederacy"], representativeYear: 1783 }, // Maratha Confederacy
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
  "Parthian Empire": { wikidataId: "Q1986139", slug: "parthian-empire", aliases: ["Parthia"], representativeYear: 100 }, // Parthian Empire
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
  "Sokoto Caliphate": { wikidataId: "Q600524", slug: "sokoto-caliphate", aliases: ["Fulani Empire"], representativeYear: 1880 }, // Sokoto Caliphate
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
  "Magadha": { wikidataId: "Q234009", slug: "magadha", representativeYear: -323 }, // Magadha (ancient eastern India) (added 2026-10-22 from audit-missing-places)
  "Zhangzhung": { wikidataId: "Q1358851", slug: "zhangzhung", aliases: ["Zhangzhung Kingdom"], representativeYear: -400 }, // Zhangzhung, western Tibet (added 2026-10-22 from audit-missing-places)
  "Yuezhi": { wikidataId: "Q467985", slug: "yuezhi", representativeYear: -100 }, // Yuezhi (added 2026-10-22 from audit-missing-places)
  "Shunga Empire": { wikidataId: "Q651377", slug: "shunga-empire", representativeYear: -100 }, // Shunga Empire (added 2026-10-22 from audit-missing-places)
  "Satavahana dynasty": { wikidataId: "Q5257", slug: "satavahana-dynasty", aliases: ["Satavahanihara"], representativeYear: -1 }, // Satavahana dynasty (added 2026-10-22 from audit-missing-places)
  "Himyarite Kingdom": { wikidataId: "Q289577", slug: "himyarite-kingdom", aliases: ["Himyar"], representativeYear: -1 }, // Himyar (added 2026-10-22 from audit-missing-places)
  "Jin dynasty": { wikidataId: "Q7352", slug: "jin-dynasty-266-420", aliases: ["Jin", "Jin dynasty (266–420)"], years: [266, 420], representativeYear: 300 }, // Jin dynasty (266–420); 'Jin' only on the 300/400 maps (added 2026-10-22 from audit-missing-places)
  "Rouran Khaganate": { wikidataId: "Q155361", slug: "rouran-khaganate", aliases: ["Ruanruan", "Rouran"], representativeYear: 400 }, // Rouran Khaganate (added 2026-10-22 from audit-missing-places)
  "Makuria": { wikidataId: "Q829356", slug: "makuria", aliases: ["Makkura"], representativeYear: 800 }, // Makuria (added 2026-10-22 from audit-missing-places)
  "Alodia": { wikidataId: "Q449639", slug: "alodia", aliases: ["Alwa"], representativeYear: 800 }, // Alodia (Alwa) (added 2026-10-22 from audit-missing-places)
  "Uyghur Khaganate": { wikidataId: "Q831218", slug: "uyghur-khaganate", aliases: ["Uyghurs"], years: [700, 900], representativeYear: 800 }, // Uyghur Khaganate (added 2026-10-22 from audit-missing-places)
  "Nanzhao": { wikidataId: "Q1045322", slug: "nanzhao", aliases: ["Nan Chao"], representativeYear: 1000 }, // Nanzhao (added 2026-10-22 from audit-missing-places)
  "Volga Bulgaria": { wikidataId: "Q185488", slug: "volga-bulgaria", aliases: ["Bulgar Khanate", "Volga Bulgars"], representativeYear: 1000 }, // Volga Bulgaria (added 2026-10-22 from audit-missing-places)
  "Pagan Kingdom": { wikidataId: "Q888574", slug: "pagan-kingdom", aliases: ["Kingdom of Pagan", "Pagan"], years: [849, 1400], representativeYear: 1279 }, // Pagan Kingdom (added 2026-10-22 from audit-missing-places)
  "Merina Kingdom": { wikidataId: "Q1071439", slug: "merina-kingdom", aliases: ["Imerina"], representativeYear: 1815 }, // Merina Kingdom (Imerina) (added 2026-10-22 from audit-missing-places)
  "Western Xia": { wikidataId: "Q7427", slug: "western-xia", aliases: ["Xixia", "Xi Xia"], representativeYear: 1100 }, // Western Xia (added 2026-10-22 from audit-missing-places)
  "Buyid dynasty": { wikidataId: "Q273874", slug: "buyid-dynasty", aliases: ["Buyid Emirate", "Buwayhid Emirates", "Buyids"], representativeYear: 1000 }, // Buyid dynasty (added 2026-10-22 from audit-missing-places)
  "Kimek–Kipchak confederation": { wikidataId: "Q2477776", slug: "kimek-kipchak-confederation", aliases: ["Kimek-Kipchak khaganate"], representativeYear: 1000 }, // Kimek–Kipchak confederation (added 2026-10-22 from audit-missing-places)
  "Denmark–Norway": { wikidataId: "Q62651", slug: "denmark-norway", aliases: ["Denmark-Norway"], years: [1537, 1814], representativeYear: 1783 }, // Denmark–Norway (1537–1814) (added 2026-10-22 from audit-missing-places)
  "Đại Việt": { wikidataId: "Q430309", slug: "dai-viet", aliases: ["Dai Viet"], representativeYear: 1800 }, // Đại Việt (added 2026-10-22 from audit-missing-places)
  "Kara-Khanid Khanate": { wikidataId: "Q494354", slug: "kara-khanid-khanate", aliases: ["Karkhanids", "Karakhanids"], representativeYear: 1100 }, // Kara-Khanid Khanate (added 2026-10-22 from audit-missing-places)
  "Cumania": { wikidataId: "Q1122052", slug: "cumania", aliases: ["Cuman Khanates", "Cuman-Kipchak confederation"], representativeYear: 1100 }, // Cumania (Cuman–Kipchak confederation) (added 2026-10-22 from audit-missing-places)
  "Qara Khitai": { wikidataId: "Q862304", slug: "qara-khitai", aliases: ["Kara Khitai Khaganate", "Kara Khitai"], representativeYear: 1200 }, // Qara Khitai (added 2026-10-22 from audit-missing-places)
  "Novgorod Republic": { wikidataId: "Q151536", slug: "novgorod-republic", aliases: ["Principality of Novgorod", "Novgorod"], years: [1136, 1478], representativeYear: 1279 }, // Novgorod Republic (added 2026-10-22 from audit-missing-places)
  "Hafsid dynasty": { wikidataId: "Q752662", slug: "hafsid-dynasty", aliases: ["Hafsid Caliphate", "Hafsids"], representativeYear: 1300 }, // Hafsid dynasty (added 2026-10-22 from audit-missing-places)
  "Northern Yuan": { wikidataId: "Q8959", slug: "northern-yuan", representativeYear: 1400 }, // Northern Yuan (added 2026-10-22 from audit-missing-places)
  "Kalmar Union": { wikidataId: "Q62623", slug: "kalmar-union", representativeYear: 1500 }, // Kalmar Union (added 2026-10-22 from audit-missing-places)
  "White Horde": { wikidataId: "Q2553863", slug: "white-horde", representativeYear: 1400 }, // White Horde (added 2026-10-22 from audit-missing-places)
  "Aq Qoyunlu": { wikidataId: "Q555994", slug: "aq-qoyunlu", aliases: ["Emirate of the White Sheep Turks", "White Sheep Turkomans"], representativeYear: 1500 }, // Aq Qoyunlu (White Sheep Turkomans) (added 2026-10-22 from audit-missing-places)
  "Khanate of Sibir": { wikidataId: "Q190513", slug: "khanate-of-sibir", representativeYear: 1530 }, // Khanate of Sibir (added 2026-10-22 from audit-missing-places)
  "Oirat Confederation": { wikidataId: "Q4332415", slug: "oirat-confederation", representativeYear: 1492 }, // Oirat Confederation (added 2026-10-22 from audit-missing-places)
  "Sultanate of Darfur": { wikidataId: "Q1474791", slug: "sultanate-of-darfur", aliases: ["Darfur"], years: [1600, 1916], representativeYear: 1530 }, // Sultanate of Darfur (added 2026-10-22 from audit-missing-places)
  "Lunda Empire": { wikidataId: "Q1796223", slug: "lunda-empire", aliases: ["Lunda"], representativeYear: 1530 }, // Lunda Empire (added 2026-10-22 from audit-missing-places)
  "Luba Empire": { wikidataId: "Q1768252", slug: "luba-empire", aliases: ["Luba"], representativeYear: 1600 }, // Luba Empire (added 2026-10-22 from audit-missing-places)
  "Khanate of Khiva": { wikidataId: "Q491106", slug: "khanate-of-khiva", aliases: ["Khiva Khanate"], representativeYear: 1700 }, // Khanate of Khiva (added 2026-10-22 from audit-missing-places)
  "Nogai Horde": { wikidataId: "Q631210", slug: "nogai-horde", representativeYear: 1530 }, // Nogai Horde (added 2026-10-22 from audit-missing-places)
  "Kazakh Khanate": { wikidataId: "Q1433867", slug: "kazakh-khanate", aliases: ["Quazaq Khanate"], representativeYear: 1530 }, // Kazakh Khanate (added 2026-10-22 from audit-missing-places)
  "Viceroyalty of Peru": { wikidataId: "Q211435", slug: "viceroyalty-of-peru", representativeYear: 1715 }, // Viceroyalty of Peru (added 2026-10-22 from audit-missing-places)
  "Dutch East Indies": { wikidataId: "Q188161", slug: "dutch-east-indies", aliases: ["Netherlands Indies"], representativeYear: 1880 }, // Dutch East Indies (added 2026-10-22 from audit-missing-places)
  "Regency of Algiers": { wikidataId: "Q3045696", slug: "regency-of-algiers", aliases: ["Algiers"], years: [1516, 1830], representativeYear: 1715 }, // Regency of Algiers (added 2026-10-22 from audit-missing-places)
  "Dzungar Khanate": { wikidataId: "Q1923401", slug: "dzungar-khanate", representativeYear: 1650 }, // Dzungar Khanate (added 2026-10-22 from audit-missing-places)
  "Cape Colony": { wikidataId: "Q370736", slug: "cape-colony", representativeYear: 1878 }, // Cape Colony (added 2026-10-22 from audit-missing-places)
  "Colonial Brazil": { wikidataId: "Q2088324", slug: "colonial-brazil", aliases: ["Portuguese Brazil", "Viceroyalty of Brazil"], representativeYear: 1783 }, // Colonial Brazil (Viceroyalty of Brazil on the maps) (added 2026-10-22 from audit-missing-places)
  "Rupert's Land": { wikidataId: "Q738395", slug: "ruperts-land", representativeYear: 1783 }, // Rupert's Land (added 2026-10-22 from audit-missing-places)
  "Viceroyalty of New Granada": { wikidataId: "Q8965", slug: "viceroyalty-of-new-granada", representativeYear: 1800 }, // Viceroyalty of New Granada (added 2026-10-22 from audit-missing-places)
  "First Saudi State": { wikidataId: "Q146871", slug: "first-saudi-state", aliases: ["Nejd", "Emirate of Diriyah"], years: [1727, 1818], representativeYear: 1783 }, // First Saudi State (Emirate of Diriyah) (added 2026-10-22 from audit-missing-places)
  "Viceroyalty of the Río de la Plata": { wikidataId: "Q210551", slug: "viceroyalty-of-the-rio-de-la-plata", representativeYear: 1800 }, // Viceroyalty of the Río de la Plata (added 2026-10-22 from audit-missing-places)
  "Louisiana (New Spain)": { wikidataId: "Q748300", slug: "louisiana-new-spain", aliases: ["Luisiana", "Spanish Louisiana"], representativeYear: 1800 }, // Spanish Louisiana (added 2026-10-22 from audit-missing-places)
  "Rattanakosin Kingdom": { wikidataId: "Q1155700", slug: "rattanakosin-kingdom", aliases: ["Siam"], years: [1782, 1932], representativeYear: 1783 }, // Rattanakosin Kingdom (Siam) (added 2026-10-22 from audit-missing-places)
  "Union between Sweden and Norway": { wikidataId: "Q62589", slug: "sweden-norway", aliases: ["Sweden–Norway", "Sweden-Norway"], years: [1814, 1905], representativeYear: 1880 }, // Sweden–Norway (1814–1905) (added 2026-10-22 from audit-missing-places)
  "Empire of Brazil": { wikidataId: "Q217230", slug: "empire-of-brazil", representativeYear: 1880 }, // Empire of Brazil (added 2026-10-22 from audit-missing-places)
  "French Indochina": { wikidataId: "Q185682", slug: "french-indochina", aliases: ["French Indo-China"], representativeYear: 1900 }, // French Indochina (added 2026-10-22 from audit-missing-places)
  "Belgian Congo": { wikidataId: "Q213510", slug: "belgian-congo", representativeYear: 1914 }, // Belgian Congo (added 2026-10-22 from audit-missing-places)
  "Republic of China": { wikidataId: "Q13426199", slug: "republic-of-china-1912-1949", aliases: ["Republic of China (1912–1949)"], years: [1912, 1949], representativeYear: 1914 }, // Republic of China (mainland period) (added 2026-10-22 from audit-missing-places)
  "French Equatorial Africa": { wikidataId: "Q271894", slug: "french-equatorial-africa", representativeYear: 1930 }, // French Equatorial Africa (added 2026-10-22 from audit-missing-places)
  "French West Africa": { wikidataId: "Q210682", slug: "french-west-africa", representativeYear: 1914 }, // French West Africa (added 2026-10-22 from audit-missing-places)
  "Warlord Era": { wikidataId: "Q1201263", slug: "warlord-era", aliases: ["Chinese Warlords"], years: [1916, 1930], representativeYear: 1920 }, // Warlord Era China (added 2026-10-22 from audit-missing-places)

  // ── Dynasties and kingdoms drawn on the maps (added 2026-10-30) ──
  "Indo-Scythian Kingdom": { wikidataId: "Q240123", slug: "indo-scythian-kingdom", aliases: ["Saka Kingdom"], representativeYear: 200 }, // Indo-Scythian Kingdom (added 2026-10-30, dynasty batch)
  "Indo-Parthian kingdom": { wikidataId: "Q1255614", slug: "indo-parthian-kingdom", aliases: ["Suren Kingdom"], representativeYear: 200 }, // Indo-Parthian kingdom (added 2026-10-30, dynasty batch)
  "Jin dynasty (1115–1234)": { wikidataId: "Q5066", slug: "jin-dynasty-1115-1234", aliases: ["Jin Empire (Jurchen)"], representativeYear: 1200 }, // Jin dynasty (1115–1234) (added 2026-10-30, dynasty batch)
  "Western Turkic Khaganate": { wikidataId: "Q874357", slug: "western-turkic-khaganate", aliases: ["Western Gokturk Khaganate"], representativeYear: 700 }, // Western Turkic Khaganate (added 2026-10-30, dynasty batch)
  "Khwarazmian Empire": { wikidataId: "Q63134381", slug: "khwarazmian-empire", aliases: ["Khwarazmian dynasty"], representativeYear: 1200 }, // Khwarazmian Empire (added 2026-10-30, dynasty batch)
  "Ayyubid dynasty": { wikidataId: "Q180114", slug: "ayyubid-dynasty", aliases: ["Ayyubid Sultanate"], representativeYear: 1200 }, // Ayyubid dynasty (added 2026-10-30, dynasty batch)
  "Kingdom of Hungary": { wikidataId: "Q171150", slug: "kingdom-of-hungary", representativeYear: 1500 }, // Kingdom of Hungary (added 2026-10-30, dynasty batch)
  "Aghlabid dynasty": { wikidataId: "Q207600", slug: "aghlabid-dynasty", aliases: ["Aghlabid Emirate"], representativeYear: 900 }, // Aghlabid dynasty (added 2026-10-30, dynasty batch)
  "Idrisid dynasty": { wikidataId: "Q431575", slug: "idrisid-dynasty", aliases: ["Idrisid Caliphate"], representativeYear: 900 }, // Idrisid dynasty (added 2026-10-30, dynasty batch)
  "Tukulor Empire": { wikidataId: "Q536476", slug: "tukulor-empire", aliases: ["Tukular Caliphate"], representativeYear: 1880 }, // Tukulor Empire (added 2026-10-30, dynasty batch)
  "Sixteen Kingdoms": { wikidataId: "Q683551", slug: "sixteen-kingdoms", representativeYear: 400 }, // Sixteen Kingdoms (added 2026-10-30, dynasty batch)
  "Umayyad state of Córdoba": { wikidataId: "Q1337854", slug: "umayyad-state-of-cordoba", aliases: ["Emirate of Córdoba", "Caliphate of Córdoba"], representativeYear: 900 }, // Umayyad state of Córdoba (added 2026-10-30, dynasty batch)
  "Khanate of Kazan": { wikidataId: "Q186537", slug: "khanate-of-kazan", aliases: ["Kazan Khanate"], representativeYear: 1500 }, // Khanate of Kazan (added 2026-10-30, dynasty batch)
  "Nabataean Kingdom": { wikidataId: "Q11029653", slug: "nabataean-kingdom", aliases: ["Nabatean Kingdom"], representativeYear: -100 }, // Nabataean Kingdom (added 2026-10-30, dynasty batch)
  "Sukhothai Kingdom": { wikidataId: "Q863279", slug: "sukhothai-kingdom", aliases: ["Sukhothai", "Kingdom of Sukhotai"], representativeYear: 1100 }, // Sukhothai Kingdom (added 2026-10-30, dynasty batch)
  "Antigonid dynasty": { wikidataId: "Q237325", slug: "antigonid-dynasty", aliases: ["Macedon and Hellenic League", "Kingdom of Antigonus"], representativeYear: -300 }, // Antigonid dynasty (added 2026-10-30, dynasty batch)
  "Sultanate of Rum": { wikidataId: "Q975405", slug: "sultanate-of-rum", representativeYear: 1279 }, // Sultanate of Rum (added 2026-10-30, dynasty batch)
  "Kong Empire": { wikidataId: "Q1587244", slug: "kong-empire", representativeYear: 1878 }, // Kong Empire (added 2026-10-30, dynasty batch)
  "Kingdom of Tlemcen": { wikidataId: "Q17030701", slug: "kingdom-of-tlemcen", aliases: ["Zayyanid Caliphate"], representativeYear: 1500 }, // Kingdom of Tlemcen (added 2026-10-30, dynasty batch)
  "Sultanate of Zanzibar": { wikidataId: "Q157904", slug: "sultanate-of-zanzibar", representativeYear: 1900 }, // Sultanate of Zanzibar (added 2026-10-30, dynasty batch)
  "Bahmani Sultanate": { wikidataId: "Q374521", slug: "bahmani-kingdom", aliases: ["Bahmani Kingdom"], representativeYear: 1500 }, // Bahmani Kingdom (added 2026-10-30, dynasty batch)
  "Western Chalukya Empire": { wikidataId: "Q14624218", slug: "western-chalukya-empire", aliases: ["Western Chalukyas", "Chalukya Empire"], representativeYear: 1000 }, // Western Chalukya Empire (added 2026-10-30, dynasty batch)
  "Khanate of Bukhara": { wikidataId: "Q577668", slug: "khanate-of-bukhara", aliases: ["Bukara Khanate"], representativeYear: 1530 }, // Khanate of Bukhara (added 2026-10-30, dynasty batch)
  "Emirate of Bukhara": { wikidataId: "Q746558", slug: "emirate-of-bukhara", aliases: ["Bokhara Khanate"], representativeYear: 1880 }, // Emirate of Bukhara (added 2026-10-30, dynasty batch)
  "Visigothic Kingdom": { wikidataId: "Q126936", slug: "visigothic-kingdom", representativeYear: 700 }, // Visigothic Kingdom (added 2026-10-30, dynasty batch)
  "Wadai Sultanate": { wikidataId: "Q1132786", slug: "wadai-sultanate", aliases: ["Wadai", "Wadai Empire"], representativeYear: 1880 }, // Wadai Sultanate (added 2026-10-30, dynasty batch)
  "Zirid dynasty": { wikidataId: "Q205718", slug: "zirid-dynasty", aliases: ["Zirid and Hammadid emirates"], representativeYear: 1100 }, // Zirid dynasty (added 2026-10-30, dynasty batch)
  "Second Bulgarian Empire": { wikidataId: "Q420759", slug: "second-bulgarian-empire", representativeYear: 1279 }, // Second Bulgarian Empire (added 2026-10-30, dynasty batch)
  "Tuʻi Tonga Empire": { wikidataId: "Q842390", slug: "tui-tonga-empire", representativeYear: 1500 }, // Tuʻi Tonga Empire (added 2026-10-30, dynasty batch)
  "Soomra dynasty": { wikidataId: "Q3042057", slug: "soomra-dynasty", aliases: ["Soomra Emirate"], representativeYear: 1100 }, // Soomra dynasty (added 2026-10-30, dynasty batch)
  "Bosporan Kingdom": { wikidataId: "Q321371", slug: "bosporan-kingdom", aliases: ["Bosporian Kingdom"], representativeYear: -100 }, // Bosporan Kingdom (added 2026-10-30, dynasty batch)
  "Maitraka dynasty": { wikidataId: "Q6737189", slug: "maitraka-dynasty", aliases: ["Maitraka Kingdom"], representativeYear: 700 }, // Maitraka dynasty (added 2026-10-30, dynasty batch)
  "Grand Principality of Vladimir": { wikidataId: "Q83546", slug: "vladimir-suzdal", aliases: ["Principality of Vladimir-Suzdal", "Vladimir-Suzdal"], representativeYear: 1200 }, // Vladimir-Suzdal (added 2026-10-30, dynasty batch)
  "Wattasid dynasty": { wikidataId: "Q970799", slug: "wattasid-dynasty", aliases: ["Watassid Morocco", "Wattasid Caliphate"], representativeYear: 1500 }, // Wattasid dynasty (added 2026-10-30, dynasty batch)
  "Ashikaga shogunate": { wikidataId: "Q1154406", slug: "ashikaga-shogunate", representativeYear: 1400 }, // Ashikaga shogunate (added 2026-10-30, dynasty batch)
  "Kingdom of the Two Sicilies": { wikidataId: "Q180393", slug: "kingdom-of-the-two-sicilies", representativeYear: 1800 }, // Kingdom of the Two Sicilies (added 2026-10-30, dynasty batch)
  "Angevin Empire": { wikidataId: "Q538677", slug: "angevin-empire", representativeYear: 1200 }, // Angevin Empire (added 2026-10-30, dynasty batch)
  "Sultanate of Bengal": { wikidataId: "Q4083686", slug: "bengal-sultanate", aliases: ["Bengal Sultanate"], representativeYear: 1400 }, // Bengal Sultanate (added 2026-10-30, dynasty batch)
  "Kingdom of Ireland": { wikidataId: "Q215530", slug: "kingdom-of-ireland", representativeYear: 1783 }, // Kingdom of Ireland (added 2026-10-30, dynasty batch)
  "Gujarat Sultanate": { wikidataId: "Q507796", slug: "gujarat-sultanate", representativeYear: 1400 }, // Gujarat Sultanate (added 2026-10-30, dynasty batch)
  "Malwa Sultanate": { wikidataId: "Q937879", slug: "malwa-sultanate", representativeYear: 1400 }, // Malwa Sultanate (added 2026-10-30, dynasty batch)
  "Astrakhan Khanate": { wikidataId: "Q210163", slug: "astrakhan-khanate", representativeYear: 1530 }, // Astrakhan Khanate (added 2026-10-30, dynasty batch)
  "Kingdom of Galicia–Volhynia": { wikidataId: "Q239502", slug: "kingdom-of-galicia-volhynia", aliases: ["Principality of Galicia-Volhynia"], representativeYear: 1200 }, // Kingdom of Galicia–Volhynia (added 2026-10-30, dynasty batch)
  "Jaunpur Sultanate": { wikidataId: "Q167134", slug: "jaunpur-sultanate", representativeYear: 1400 }, // Jaunpur Sultanate (added 2026-10-30, dynasty batch)
  "Kingdom of Norway": { wikidataId: "Q2196956", slug: "kingdom-of-norway-872-1397", aliases: ["Kingdom of Norway (872–1397)"], representativeYear: 900 }, // Kingdom of Norway (872–1397) (added 2026-10-30, dynasty batch)
  "Samorian State": { wikidataId: "Q568712", slug: "samorian-state", aliases: ["First Samori Empire", "Second Samori Empire", "Wassoulou Empire"], representativeYear: 1880 }, // Samorian State (added 2026-10-30, dynasty batch)
  "Kingdom of Sardinia": { wikidataId: "Q165154", slug: "kingdom-of-sardinia", representativeYear: 1800 }, // Kingdom of Sardinia (added 2026-10-30, dynasty batch)
  "Duchy of Bohemia": { wikidataId: "Q2162698", slug: "duchy-of-bohemia", representativeYear: 1200 }, // Duchy of Bohemia (added 2026-10-30, dynasty batch)
  "Kingdom of Georgia": { wikidataId: "Q154667", slug: "kingdom-of-georgia", representativeYear: 1100 }, // Kingdom of Georgia (added 2026-10-30, dynasty batch)
  "Antipatrid dynasty": { wikidataId: "Q581531", slug: "antipatrid-dynasty", aliases: ["Kingdom of Kassander"], representativeYear: -300 }, // Antipatrid dynasty (added 2026-10-30, dynasty batch)
  "Karkota dynasty": { wikidataId: "Q466433", slug: "karkota-dynasty", aliases: ["Kingdom of Kashmir"], representativeYear: 700 }, // Karkota dynasty (added 2026-10-30, dynasty batch)
  "Kingdom of Croatia": { wikidataId: "Q858841", slug: "kingdom-of-croatia-925-1102", aliases: ["Croatian kingdom", "Kingdom of Croatia (925–1102)"], representativeYear: 900 }, // Kingdom of Croatia (925–1102) (added 2026-10-30, dynasty batch)
  "Principality of Kyiv": { wikidataId: "Q1483430", slug: "principality-of-kiev", aliases: ["Principality of Kiev"], representativeYear: 1200 }, // Principality of Kiev (added 2026-10-30, dynasty batch)
  "Kingdom of Kartli-Kakheti": { wikidataId: "Q282475", slug: "kingdom-of-kartli-kakheti", representativeYear: 1800 }, // Kingdom of Kartli-Kakheti (added 2026-10-30, dynasty batch)
  "Sultanate of Damagaram": { wikidataId: "Q4154364", slug: "sultanate-of-damagaram", representativeYear: 1880 }, // Sultanate of Damagaram (added 2026-10-30, dynasty batch)
  "Duchy of Benevento": { wikidataId: "Q267816", slug: "duchy-of-benevento", representativeYear: 1200 }, // Duchy of Benevento (added 2026-10-30, dynasty batch)
  "Wallachia": { wikidataId: "Q171393", slug: "wallachia", aliases: ["Principality of Wallachia"], representativeYear: 1400 }, // Wallachia (added 2026-10-30, dynasty batch)
  "Odrysian Kingdom": { wikidataId: "Q870517", slug: "odrysian-kingdom", representativeYear: -1 }, // Odrysian kingdom (added 2026-10-30, dynasty batch)
  "United Kingdom of the Netherlands": { wikidataId: "Q15864", slug: "united-kingdom-of-the-netherlands", representativeYear: 1815 }, // United Kingdom of the Netherlands (added 2026-10-30, dynasty batch)
  "Grand Principality of Serbia": { wikidataId: "Q1311990", slug: "grand-principality-of-serbia", representativeYear: 1200 }, // Grand Principality of Serbia (added 2026-10-30, dynasty batch)
  "Muslim Sicily": { wikidataId: "Q1250763", slug: "muslim-sicily", aliases: ["Emirate of Sicily"], representativeYear: 1000 }, // Muslim Sicily (added 2026-10-30, dynasty batch)
  "Principality of Polotsk": { wikidataId: "Q517333", slug: "principality-of-polotsk", representativeYear: 1100 }, // Principality of Polotsk (added 2026-10-30, dynasty batch)
  "Duchy of Swabia": { wikidataId: "Q693980", slug: "duchy-of-swabia", representativeYear: 1000 }, // Duchy of Swabia (added 2026-10-30, dynasty batch)
  "Duchy of Athens": { wikidataId: "Q334714", slug: "duchy-of-athens", representativeYear: 1300 }, // Duchy of Athens (added 2026-10-30, dynasty batch)
  "Kingdom of Jerusalem": { wikidataId: "Q55502", slug: "kingdom-of-jerusalem", representativeYear: 1100 }, // Kingdom of Jerusalem (added 2026-10-30, dynasty batch)
  "Mossi Kingdoms": { wikidataId: "Q862522", slug: "mossi-kingdoms", aliases: ["Mossi States"], representativeYear: 1715 }, // Mossi Kingdoms (added 2026-10-30, dynasty batch)
  "Hausa Kingdoms": { wikidataId: "Q1591030", slug: "hausa-kingdoms", aliases: ["Hausa States"], representativeYear: 1650 }, // Hausa Kingdoms (added 2026-10-30, dynasty batch)
  "Sosso Empire": { wikidataId: "Q13099593", slug: "sosso-empire", aliases: ["Sosso Kingdom"], representativeYear: 1200 }, // Sosso Empire (added 2026-10-30, dynasty batch)
  "Zunbil dynasty": { wikidataId: "Q229780", slug: "zunbil-dynasty", aliases: ["Kingdom of Zunbil"], representativeYear: 700 }, // Zunbil dynasty (added 2026-10-30, dynasty batch)
  "Third Saudi state": { wikidataId: "Q2011891", slug: "third-saudi-state", aliases: ["Arabia (Nejd)", "Kingdom of Hejaz and Nejd"], representativeYear: 1930 }, // Third Saudi state (added 2026-10-30, dynasty batch)

  // ── More states drawn on the maps (added 2026-10-30, batch 2) ──
  "Goguryeo": { wikidataId: "Q28370", slug: "goguryeo", aliases: ["Koguryo"], representativeYear: 400 }, // Goguryeo (added 2026-10-30, states batch 2)
  "Northern Wei": { wikidataId: "Q875305", slug: "northern-wei", aliases: ["Toba Wei"], representativeYear: 500 }, // Northern Wei (added 2026-10-30, states batch 2)
  "Mutapa Empire": { wikidataId: "Q854468", slug: "mutapa-empire", aliases: ["Mwenemutapa"], representativeYear: 1530 }, // Mutapa Empire (added 2026-10-30, states batch 2)
  "Funj Sultanate": { wikidataId: "Q1475713", slug: "funj-sultanate", aliases: ["Funj"], representativeYear: 1715 }, // Funj Sultanate (added 2026-10-30, states batch 2)
  "Gurjara-Pratihara dynasty": { wikidataId: "Q5324", slug: "pratihara-dynasty", aliases: ["Gurjara Pratihara"], representativeYear: 900 }, // Pratihara dynasty (added 2026-10-30, states batch 2)
  "Kaarta": { wikidataId: "Q924833", slug: "kaarta", representativeYear: 1800 }, // Kaarta (added 2026-10-30, states batch 2)
  "Ahmadnagar Sultanate": { wikidataId: "Q400998", slug: "ahmadnagar-sultanate", aliases: ["Ahmadnagar"], representativeYear: 1530 }, // Ahmadnagar Sultanate (added 2026-10-30, states batch 2)
  "Lozi Kingdom": { wikidataId: "Q808750", slug: "lozi-kingdom", aliases: ["Lozi"], representativeYear: 1878 }, // Lozi kingdom (added 2026-10-30, states batch 2)
  "Qataban": { wikidataId: "Q748595", slug: "qataban", representativeYear: -200 }, // Qataban (added 2026-10-30, states batch 2)
  "Ségou Empire": { wikidataId: "Q762084", slug: "segou-empire", aliases: ["Segu"], representativeYear: 1783 }, // Ségou Empire (added 2026-10-30, states batch 2)
  "Kingdom of Aragon": { wikidataId: "Q199442", slug: "kingdom-of-aragon", aliases: ["Aragón"], representativeYear: 1300 }, // Kingdom of Aragon (added 2026-10-30, states batch 2)
  "South African Republic": { wikidataId: "Q550374", slug: "south-african-republic", aliases: ["Transvaal"], representativeYear: 1880 }, // South African Republic (added 2026-10-30, states batch 2)
  "Muscat and Oman": { wikidataId: "Q157734", slug: "muscat-and-oman", representativeYear: 1930 }, // Muscat and Oman (added 2026-10-30, states batch 2)
  "Sultanate of Agadez": { wikidataId: "Q1502813", slug: "sultanate-of-agadez", aliases: ["Air"], representativeYear: 1783 }, // Sultanate of Agadez (added 2026-10-30, states batch 2)
  "Sultanate of Ifat": { wikidataId: "Q157727", slug: "sultanate-of-ifat", aliases: ["Ifat"], representativeYear: 1200 }, // Sultanate of Ifat (added 2026-10-30, states batch 2)
  "Rozvi Empire": { wikidataId: "Q986822", slug: "rozvi-empire", aliases: ["Rozwi"], representativeYear: 1715 }, // Rozvi Empire (added 2026-10-30, states batch 2)
  "Adal Sultanate": { wikidataId: "Q2365048", slug: "adal-sultanate", aliases: ["Adal"], representativeYear: 1530 }, // Adal Sultanate (added 2026-10-30, states batch 2)
  "Malacca Sultanate": { wikidataId: "Q46652", slug: "malacca-sultanate", aliases: ["Malacca"], representativeYear: 1530 }, // Malacca Sultanate (added 2026-10-30, states batch 2)
  "Sultanate of Aussa": { wikidataId: "Q791787", slug: "sultanate-of-aussa", aliases: ["Awsa"], representativeYear: 1715 }, // Sultanate of Aussa (added 2026-10-30, states batch 2)
  "Sultanate of Bagirmi": { wikidataId: "Q1472873", slug: "sultanate-of-bagirmi", aliases: ["Bagirmi"], representativeYear: 1650 }, // Sultanate of Bagirmi (added 2026-10-30, states batch 2)
  "Rashtrakuta dynasty": { wikidataId: "Q856691", slug: "rashtrakuta-empire", aliases: ["Rashtrakuta"], representativeYear: 900 }, // Rashtrakuta Empire (added 2026-10-30, states batch 2)
  "Anuradhapura Kingdom": { wikidataId: "Q1965597", slug: "anuradhapura-kingdom", aliases: ["Simhala"], representativeYear: 100 }, // Anuradhapura kingdom (added 2026-10-30, states batch 2)
  "Greco-Bactrian Kingdom": { wikidataId: "Q488880", slug: "greco-bactrian-kingdom", aliases: ["Bactria"], representativeYear: -200 }, // Greco-Bactrian Kingdom (added 2026-10-30, states batch 2)
  "United Provinces of the Río de la Plata": { wikidataId: "Q738144", slug: "united-provinces-of-the-rio-de-la-plata", representativeYear: 1815 }, // United Provinces of the Río de la Plata (added 2026-10-30, states batch 2)
  "Anglo-Egyptian Sudan": { wikidataId: "Q541455", slug: "anglo-egyptian-sudan", representativeYear: 1914 }, // Anglo-Egyptian Sudan (added 2026-10-30, states batch 2)
  "Italian Somaliland": { wikidataId: "Q319984", slug: "italian-somaliland", representativeYear: 1930 }, // Italian Somaliland (added 2026-10-30, states batch 2)
  "Dominion of Newfoundland": { wikidataId: "Q38610", slug: "dominion-of-newfoundland", representativeYear: 1930 }, // Dominion of Newfoundland (added 2026-10-30, states batch 2)
  "East Africa Protectorate": { wikidataId: "Q876185", slug: "east-africa-protectorate", aliases: ["British East Africa"], representativeYear: 1914 }, // East Africa Protectorate (added 2026-10-30, states batch 2)
  "German East Africa": { wikidataId: "Q153963", slug: "german-east-africa", aliases: ["German E. Africa (Tanganyika)"], representativeYear: 1914 }, // German East Africa (added 2026-10-30, states batch 2)
  "German South West Africa": { wikidataId: "Q153665", slug: "german-south-west-africa", aliases: ["German South-West Africa"], representativeYear: 1914 }, // German South West Africa (added 2026-10-30, states batch 2)
  "Kamerun": { wikidataId: "Q668294", slug: "kamerun", representativeYear: 1914 }, // Kamerun (added 2026-10-30, states batch 2)
  "Río de Oro": { wikidataId: "Q929147", slug: "rio-de-oro", aliases: ["Rio De Oro"], representativeYear: 1930 }, // Río de Oro (added 2026-10-30, states batch 2)
  "Portuguese Mozambique": { wikidataId: "Q889394", slug: "portuguese-mozambique", aliases: ["Portuguese East Africa"], representativeYear: 1783 }, // Portuguese Mozambique (added 2026-10-30, states batch 2)
  "New France": { wikidataId: "Q170604", slug: "new-france", representativeYear: 1700 }, // New France (added 2026-10-30, states batch 2)
  "Dutch Brazil": { wikidataId: "Q221357", slug: "dutch-brazil", representativeYear: 1700 }, // Dutch Brazil (added 2026-10-30, states batch 2)
  "Province of Quebec": { wikidataId: "Q251668", slug: "province-of-quebec-1763-1791", aliases: ["Quebec"], representativeYear: 1800 }, // Province of Quebec (1763–1791) (added 2026-10-30, states batch 2)
  "Mandatory Iraq": { wikidataId: "Q146720", slug: "mandatory-iraq", aliases: ["Mesopotamia (GB)"], representativeYear: 1930 }, // Mandatory Iraq (added 2026-10-30, states batch 2)
  "East India Company": { wikidataId: "Q83164", slug: "east-india-company", aliases: ["British East India Company"], representativeYear: 1815 }, // East India Company (added 2026-10-30, states batch 2)
  "French Cameroon": { wikidataId: "Q1028848", slug: "french-cameroon", aliases: ["French Cameroons"], representativeYear: 1930 }, // French Cameroon (added 2026-10-30, states batch 2)
  "Dendi Kingdom": { wikidataId: "Q761103", slug: "dendi-kingdom", representativeYear: 1783 }, // Dendi (province) (added 2026-10-30, states batch 2)
  "Chavín culture": { wikidataId: "Q13341477", slug: "chavin-culture", aliases: ["Chavin"], representativeYear: -323 }, // Chavín culture (added 2026-10-30, states batch 2)
  "Kingdom of Saba": { wikidataId: "Q216068", slug: "kingdom-of-saba", aliases: ["Saba"], representativeYear: -323 }, // Sheba (added 2026-10-30, states batch 2)
  "Hyderabad State": { wikidataId: "Q1240096", slug: "hyderabad-state", aliases: ["Nizam's Dominions"], representativeYear: 1800 }, // Hyderabad State (added 2026-10-30, states batch 2)
  "Chach dynasty": { wikidataId: "Q15156207", slug: "chach-dynasty", aliases: ["Kingdom of Sind"], representativeYear: 700 }, // Chach dynasty (added 2026-10-30, states batch 2)
  "Kingdom of the Masaesyli": { wikidataId: "Q1288728", slug: "masaesyli", aliases: ["Kingdom of Syphax"], representativeYear: -200 }, // Masaesyli (added 2026-10-30, states batch 2)
  "Turk Shahis": { wikidataId: "Q39047075", slug: "turk-shahis", aliases: ["Kingdom of Kapisa"], representativeYear: 700 }, // Turk Shahis (added 2026-10-30, states batch 2)
  "Oghuz Yabgu State": { wikidataId: "Q1099731", slug: "oghuz-yabgu-state", aliases: ["Oghuz Turks", "Oghuz"], representativeYear: 1100 }, // Oghuz Yabgu State (added 2026-10-30, states batch 2)
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
