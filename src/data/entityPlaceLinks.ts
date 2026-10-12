/**
 * "See on the map" for a person/event/culture page has to select a bordered
 * territory feature — but a person's own Wikidata QID (say, Alexander the
 * Great, Q8409) never appears on any territory in the border data, and never
 * will: the map only knows about places. Passing it as `?region=` anyway
 * used to send visitors to a map that failed to load ("Unknown Territory —
 * Could not load content for this region") with nothing highlighted.
 *
 * This maps each person/event/culture slug to the Wikidata QID of an
 * *existing* entry in `src/data/crosswalk.ts` (the place data) that the map
 * can actually resolve and highlight — e.g. Alexander the Great →
 * "Macedonian Empire" (Q83958).
 *
 * Deliberately not exhaustive: only entries with one clear, well-established
 * association are included, and every QID here was checked against the
 * actual historical-basemaps GeoJSON for the relevant year (not assumed) —
 * a name that sounds right isn't enough, since `geoEnrich.ts` matches a
 * border feature to a crosswalk entry by exact NAME string (optionally
 * bounded to an era via CrosswalkEntry.years). That's also why some plausible-looking
 * additions are deliberately left out — see the "Not mapped" notes below.
 * Anything genuinely ambiguous (which side of a multi-party war, a movement
 * with no single associated state) is left out too. Those pages fall back
 * to a plain year-only map link rather than a guessed, possibly-wrong
 * highlight. See `EntityPage.tsx`.
 */

export const ENTITY_PLACE_OVERRIDE: Record<string, string> = {
  // People
  "genghis-khan": "Q12557", // Mongol Empire
  "alexander-the-great": "Q83958", // Macedonian Empire
  "julius-caesar": "Q17167", // Roman Republic (died 44 BCE, before the Empire)
  "cleopatra": "Q2320005", // Ptolemaic Kingdom
  "charlemagne": "Q31929", // Carolingian Empire
  "tamerlane": "Q484195", // Timurid Empire
  "napoleon": "Q71084", // First French Empire
  "constantine-i": "Q2277", // Roman Empire
  "augustus": "Q2277", // Roman Empire
  "suleiman-the-magnificent": "Q12560", // Ottoman Empire
  "akbar": "Q33296", // Mughal Empire
  "cyrus-the-great": "Q389688", // Achaemenid Empire
  "hannibal": "Q6343", // Carthage
  "attila-the-hun": "Q10295972", // Hunnic Empire — confirmed present by name in the 400 CE snapshot (gone by 500, matching its real collapse after Attila's 453 death)
  // Not mapped: saladin — checked the 1200 CE snapshot directly; the
  // Egypt/Levant region is still labelled "Fatimid Caliphate" there (the
  // dynasty Saladin overthrew in 1171), so the source data doesn't
  // distinguish the Ayyubid period at all — there's no feature to link to,
  // not just a missing crosswalk entry. ramesses-ii — the -1500/-1000 BCE
  // snapshots do have a feature named "Egypt", but the crosswalk's existing
  // "Egypt" entry is the modern country's QID (Q79); pointing this era at it
  // would show present-day Egypt's Wikipedia content on a 1213 BCE page.
  // Name matching is now year-aware (CrosswalkEntry.years), so this could be
  // fixed by adding an "ancient Egypt" crosswalk entry bounded to BCE years.

  // Added 2026-10 — each checked against the snapshot named in
  // ENTITY_YEAR_OVERRIDE, resolving names the same way lookupByName does.
  "mansa-musa": "Q184536", // Mali Empire
  "sundiata-keita": "Q184536", // Mali Empire
  "shaka": "Q729768", // Zulu Kingdom
  "moctezuma-ii": "Q2608489", // Aztec Empire
  "pachacuti": "Q28573", // Inca Empire
  "qin-shi-huang": "Q7183", // Qin dynasty
  "kangxi-emperor": "Q8733", // Qing dynasty
  "empress-dowager-cixi": "Q8733", // Qing dynasty
  "tokugawa-ieyasu": "Q205662", // Tokugawa shogunate
  "emperor-meiji": "Q188712", // Empire of Japan
  "peter-the-great": "Q186096", // Tsardom of Russia
  "catherine-the-great": "Q34266", // Russian Empire
  "ivan-the-terrible": "Q186096", // Tsardom of Russia
  "ashoka": "Q62943", // Maurya Empire
  "chandragupta-maurya": "Q62943", // Maurya Empire
  "shah-jahan": "Q33296", // Mughal Empire
  "hammurabi": "Q47690", // Babylonia
  "nebuchadnezzar-ii": "Q47690", // Babylonia
  "darius-the-great": "Q389688", // Achaemenid Empire
  "justinian-i": "Q12544", // Byzantine Empire
  "harun-al-rashid": "Q12536", // Abbasid Caliphate
  "mehmed-ii": "Q12560", // Ottoman Empire
  "william-the-conqueror": "Q179876", // Kingdom of England
  "joan-of-arc": "Q70972", // Kingdom of France
  "isabella-i-of-castile": "Q217196", // Crown of Castile
  "charles-v-holy-roman-emperor": "Q12548", // Holy Roman Empire
  "elizabeth-i": "Q179876", // Kingdom of England
  "louis-xiv": "Q70972", // Kingdom of France
  "queen-victoria": "Q8680", // British Empire
  "otto-von-bismarck": "Q43287", // German Empire
  "martin-luther": "Q12548", // Holy Roman Empire
  "george-washington": "Q30", // United States
  "abraham-lincoln": "Q30", // United States
  "vladimir-lenin": "Q15180", // Soviet Union
  "joseph-stalin": "Q15180", // Soviet Union
  "adolf-hitler": "Q7318", // Nazi Germany
  "winston-churchill": "Q8680", // British Empire
  "franklin-d-roosevelt": "Q30", // United States
  "mao-zedong": "Q148", // China
  "mahatma-gandhi": "Q129286", // British Raj
  "ho-chi-minh": "Q881", // Vietnam
  "nelson-mandela": "Q258", // South Africa
  "kublai-khan": "Q7313", // Yuan dynasty

  // Events
  "fall-of-rome": "Q42834", // Western Roman Empire
  "mongol-invasion-of-europe": "Q79965", // Golden Horde
  "french-revolution": "Q70972", // Kingdom of France
  "fall-of-tenochtitlan": "Q2608489", // Aztec Empire
  "spanish-conquest-of-the-inca-empire": "Q28573", // Inca Empire
  "an-lushan-rebellion": "Q9683", // Tang dynasty
  "house-of-wisdom": "Q12536", // Abbasid Caliphate
  "siege-of-baghdad": "Q178084", // Ilkhanate (the Mongol state Hulagu founded on the Abbasids' ruins; the Abbasids only appear in the 800–900 snapshots)
  "meiji-restoration": "Q17", // Japan
  "american-revolution": "Q30", // United States
  "battle-of-hastings": "Q179876", // Kingdom of England
  "battle-of-marathon": "Q389688", // Achaemenid Empire (the invading side — same logic as Mongol Invasion of Europe → Golden Horde)
  "fall-of-constantinople": "Q12544", // Byzantine Empire (the empire that fell — same logic as Fall of Rome → Western Roman Empire)
  "protestant-reformation": "Q12548", // Holy Roman Empire (where it started and played out politically, not a claim it was the only place affected)
  "haitian-revolution": "Q790", // Haiti — see ENTITY_YEAR_OVERRIDE below; the event's own start year predates Haiti existing as a feature
  // Not mapped: black-death, crusades, age-of-discovery, bantu-expansion —
  // no single associated place, or the natural one isn't in the crosswalk.

  // Added 2026-10 (verified the same way as the people above)
  "greco-persian-wars": "Q389688", // Achaemenid Empire
  "punic-wars": "Q6343", // Carthage
  "qins-wars-of-unification": "Q7183", // Qin dynasty
  "battle-of-tours": "Q8575586", // Umayyad Caliphate
  "battle-of-ain-jalut": "Q282428", // Mamluk Sultanate
  "reconquista": "Q238445", // Emirate of Granada
  "thirty-years-war": "Q12548", // Holy Roman Empire
  "glorious-revolution": "Q179876", // Kingdom of England
  "industrial-revolution": "Q8680", // British Empire
  "napoleonic-wars": "Q71084", // First French Empire
  "first-opium-war": "Q8733", // Qing dynasty
  "taiping-rebellion": "Q8733", // Qing dynasty
  "american-civil-war": "Q30", // United States
  "unification-of-germany": "Q43287", // German Empire
  "unification-of-italy": "Q38", // Italy
  "russian-revolution": "Q15180", // Soviet Union
  "holocaust": "Q7318", // Nazi Germany
  "partition-of-india": "Q668", // India
  "chinese-civil-war": "Q148", // China
  "vietnam-war": "Q881", // Vietnam
  "apollo-11": "Q30", // United States
  "dissolution-of-the-soviet-union": "Q15180", // Soviet Union

  // Cultures
  "islamic-golden-age": "Q12536", // Abbasid Caliphate
  "feudal-japan": "Q17", // Japan
  "ancient-rome": "Q2277", // Roman Empire
  "aztec-civilization": "Q2608489", // Aztec Empire
  "inca-civilization": "Q28573", // Inca Empire
  "hellenistic-period": "Q93180", // Seleucid Empire (the largest, longest-lived Hellenistic successor state)
  // Not mapped: silk-road, renaissance, ancient-greece, ancient-egypt (only
  // the modern Egypt QID exists), viking-age, polynesian-navigation,
  // maya-civilization, confucianism — no single associated place, or the
  // natural one isn't in the crosswalk.
};

/**
 * For a handful of entries above, the entity's own computed
 * `representativeYear` (see `extractRepresentativeYear` in
 * `src/lib/wikidata.ts`) doesn't land on a snapshot where the linked place
 * actually appears — e.g. the Haitian Revolution's Wikidata start date
 * (1791) resolves to the nearest snapshot at-or-before it (1783), years
 * before Haiti existed as an independent state and a distinct border
 * feature (confirmed present from the 1815 snapshot onward). This overrides
 * the year used in the map link specifically, without touching the
 * genuinely-correct year shown in the page's own key facts.
 */
export const ENTITY_YEAR_OVERRIDE: Record<string, number> = {
  "haitian-revolution": 1815,
  "napoleon": 1810, // died 1821; the First French Empire is only in the 1800 snapshot
  "cyrus-the-great": -500, // died 530 BCE; Achaemenid Empire first appears at 500 BCE
  "mongol-invasion-of-europe": 1279, // Golden Horde first appears in the 1279 snapshot
  "an-lushan-rebellion": 800, // 755 → 700 snapshot predates the "Tang Empire" feature
  "siege-of-baghdad": 1279,
  "american-revolution": 1783, // 1775 → 1715 snapshot; the US first appears in 1783
  "feudal-japan": 1500,
  "ancient-rome": 117, // founding of Rome (753 BCE) predates any Roman feature
  "aztec-civilization": 1500,
  "inca-civilization": 1500,
  "hellenistic-period": -300, // Seleucid Kingdom first appears in the 300 BCE snapshot
  // Added 2026-10: the snapshot each new link above was verified against.
  "mansa-musa": 1300,
  "sundiata-keita": 1279,
  "shaka": 1815,
  "moctezuma-ii": 1500,
  "pachacuti": 1500,
  "qin-shi-huang": -300,
  "kangxi-emperor": 1700,
  "empress-dowager-cixi": 1880,
  "tokugawa-ieyasu": 1650,
  "emperor-meiji": 1900,
  "peter-the-great": 1700,
  "catherine-the-great": 1783,
  "ivan-the-terrible": 1530,
  "ashoka": -300,
  "chandragupta-maurya": -300,
  "shah-jahan": 1650,
  "hammurabi": -1500,
  "nebuchadnezzar-ii": -700,
  "darius-the-great": -500,
  "justinian-i": 500,
  "harun-al-rashid": 800,
  "mehmed-ii": 1492,
  "william-the-conqueror": 1100,
  "joan-of-arc": 1400,
  "isabella-i-of-castile": 1492,
  "charles-v-holy-roman-emperor": 1530,
  "elizabeth-i": 1600,
  "louis-xiv": 1700,
  "queen-victoria": 1880,
  "otto-von-bismarck": 1880,
  "martin-luther": 1530,
  "george-washington": 1783,
  "abraham-lincoln": 1815,
  "vladimir-lenin": 1920,
  "joseph-stalin": 1938,
  "adolf-hitler": 1938,
  "winston-churchill": 1938,
  "franklin-d-roosevelt": 1938,
  "mao-zedong": 1960,
  "mahatma-gandhi": 1930,
  "ho-chi-minh": 1960,
  "nelson-mandela": 1994,
  "kublai-khan": 1279,
  "greco-persian-wars": -500,
  "punic-wars": -300,
  "qins-wars-of-unification": -300,
  "battle-of-tours": 700,
  "battle-of-ain-jalut": 1279,
  "reconquista": 1400,
  "thirty-years-war": 1600,
  "glorious-revolution": 1650,
  "industrial-revolution": 1815,
  "napoleonic-wars": 1800,
  "first-opium-war": 1815,
  "taiping-rebellion": 1880,
  "american-civil-war": 1880,
  "unification-of-germany": 1880,
  "unification-of-italy": 1880,
  "russian-revolution": 1920,
  "holocaust": 1938,
  "partition-of-india": 1960,
  "chinese-civil-war": 1960,
  "vietnam-war": 1960,
  "apollo-11": 1960,
  "dissolution-of-the-soviet-union": 1985,
};
