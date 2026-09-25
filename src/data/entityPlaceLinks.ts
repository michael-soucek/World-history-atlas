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
 * border feature to a crosswalk entry by exact NAME string, with no
 * awareness of which era it's from. That's also why some plausible-looking
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
  "kublai-khan": "Q12557", // Mongol Empire (also founded the Yuan dynasty, not separately in the crosswalk)
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
  // Adding a second "ancient Egypt" entry wouldn't help either — the name
  // matching in geoEnrich.ts has no year-awareness, so two entries sharing
  // the name "Egypt" would just create an ambiguous lookup and risk breaking
  // the modern Egypt place page instead. Fixing this properly means making
  // that matching year-aware, which is a real but separate piece of work.

  // Events
  "fall-of-rome": "Q42834", // Western Roman Empire
  "mongol-invasion-of-europe": "Q79965", // Golden Horde
  "french-revolution": "Q70972", // Kingdom of France
  "fall-of-tenochtitlan": "Q2608489", // Aztec Empire
  "spanish-conquest-of-the-inca-empire": "Q28573", // Inca Empire
  "an-lushan-rebellion": "Q9683", // Tang dynasty
  "house-of-wisdom": "Q12536", // Abbasid Caliphate
  "siege-of-baghdad": "Q12536", // Abbasid Caliphate
  "meiji-restoration": "Q17", // Japan
  "american-revolution": "Q30", // United States
  "battle-of-hastings": "Q179876", // Kingdom of England
  "battle-of-marathon": "Q389688", // Achaemenid Empire (the invading side — same logic as Mongol Invasion of Europe → Golden Horde)
  "fall-of-constantinople": "Q12544", // Byzantine Empire (the empire that fell — same logic as Fall of Rome → Western Roman Empire)
  "protestant-reformation": "Q12548", // Holy Roman Empire (where it started and played out politically, not a claim it was the only place affected)
  "haitian-revolution": "Q790", // Haiti — see ENTITY_YEAR_OVERRIDE below; the event's own start year predates Haiti existing as a feature
  // Not mapped: black-death, crusades, age-of-discovery, bantu-expansion —
  // no single associated place, or the natural one isn't in the crosswalk.

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
};
