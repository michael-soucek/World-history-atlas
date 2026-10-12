import type { CrosswalkEntry, EntityType } from "@/types";

/** Crosswalk for historical persons. */
export const PEOPLE_CROSSWALK: Record<string, CrosswalkEntry & { entityType: EntityType }> = {
  "genghis-khan":          { wikidataId: "Q720", slug: "genghis-khan",          entityType: "person" },
  "alexander-the-great":   { wikidataId: "Q8409", slug: "alexander-the-great",  entityType: "person" },
  "julius-caesar":         { wikidataId: "Q1048", slug: "julius-caesar",         entityType: "person" },
  "cleopatra":             { wikidataId: "Q635", slug: "cleopatra",             entityType: "person" },
  "charlemagne":           { wikidataId: "Q3044", slug: "charlemagne",           entityType: "person" },
  "saladin":               { wikidataId: "Q8581", slug: "saladin",               entityType: "person" },
  "tamerlane":             { wikidataId: "Q8462", slug: "tamerlane",            entityType: "person" },
  "napoleon":              { wikidataId: "Q517",  slug: "napoleon",              entityType: "person" },
  "constantine-i":         { wikidataId: "Q8413", slug: "constantine-i",         entityType: "person" },
  "augustus":              { wikidataId: "Q1405", slug: "augustus",              entityType: "person" },
  "attila-the-hun":        { wikidataId: "Q36724", slug: "attila-the-hun",       entityType: "person" },
  "kublai-khan":           { wikidataId: "Q7523",  slug: "kublai-khan",          entityType: "person" },
  "suleiman-the-magnificent": { wikidataId: "Q8474", slug: "suleiman-the-magnificent", entityType: "person" },
  "akbar":                 { wikidataId: "Q8597", slug: "akbar",               entityType: "person" },
  "cyrus-the-great":       { wikidataId: "Q8423", slug: "cyrus-the-great",      entityType: "person" },
  "hannibal":              { wikidataId: "Q36456",  slug: "hannibal",             entityType: "person" },
  "ramesses-ii":           { wikidataId: "Q1523", slug: "ramesses-ii",          entityType: "person" },
  // Added 2026-10: rulers, thinkers, scientists and modern leaders from every region
"mansa-musa": { wikidataId: "Q309333", slug: "mansa-musa", entityType: "person", name: "Mansa Musa" },
  "sundiata-keita": { wikidataId: "Q175772", slug: "sundiata-keita", entityType: "person", name: "Sundiata Keita" },
  "shaka": { wikidataId: "Q27695", slug: "shaka", entityType: "person", name: "Shaka" },
  "nzinga-of-ndongo-and-matamba": { wikidataId: "Q467650", slug: "nzinga-of-ndongo-and-matamba", entityType: "person", name: "Nzinga of Ndongo and Matamba" },
  "moctezuma-ii": { wikidataId: "Q141791", slug: "moctezuma-ii", entityType: "person", name: "Moctezuma II" },
  "pachacuti": { wikidataId: "Q213758", slug: "pachacuti", entityType: "person", name: "Pachacuti" },
  "simon-bolivar": { wikidataId: "Q8605", slug: "simon-bolivar", entityType: "person", name: "Simón Bolívar" },
  "toussaint-louverture": { wikidataId: "Q205783", slug: "toussaint-louverture", entityType: "person", name: "Toussaint Louverture" },
  "qin-shi-huang": { wikidataId: "Q7192", slug: "qin-shi-huang", entityType: "person", name: "Qin Shi Huang" },
  "wu-zetian": { wikidataId: "Q9738", slug: "wu-zetian", entityType: "person", name: "Wu Zetian" },
  "kangxi-emperor": { wikidataId: "Q17790", slug: "kangxi-emperor", entityType: "person", name: "Kangxi Emperor" },
  "empress-dowager-cixi": { wikidataId: "Q47842", slug: "empress-dowager-cixi", entityType: "person", name: "Empress Dowager Cixi" },
  "tokugawa-ieyasu": { wikidataId: "Q171977", slug: "tokugawa-ieyasu", entityType: "person", name: "Tokugawa Ieyasu" },
  "emperor-meiji": { wikidataId: "Q174231", slug: "emperor-meiji", entityType: "person", name: "Emperor Meiji" },
  "peter-the-great": { wikidataId: "Q8479", slug: "peter-the-great", entityType: "person", name: "Peter the Great" },
  "catherine-the-great": { wikidataId: "Q36450", slug: "catherine-the-great", entityType: "person", name: "Catherine the Great" },
  "ivan-the-terrible": { wikidataId: "Q7996", slug: "ivan-the-terrible", entityType: "person", name: "Ivan the Terrible" },
  "ashoka": { wikidataId: "Q8589", slug: "ashoka", entityType: "person", name: "Ashoka" },
  "chandragupta-maurya": { wikidataId: "Q188541", slug: "chandragupta-maurya", entityType: "person", name: "Chandragupta Maurya" },
  "shah-jahan": { wikidataId: "Q83672", slug: "shah-jahan", entityType: "person", name: "Shah Jahan" },
  "hammurabi": { wikidataId: "Q36359", slug: "hammurabi", entityType: "person", name: "Hammurabi" },
  "sargon-of-akkad": { wikidataId: "Q199461", slug: "sargon-of-akkad", entityType: "person", name: "Sargon of Akkad" },
  "hatshepsut": { wikidataId: "Q129234", slug: "hatshepsut", entityType: "person", name: "Hatshepsut" },
  "nebuchadnezzar-ii": { wikidataId: "Q12591", slug: "nebuchadnezzar-ii", entityType: "person", name: "Nebuchadnezzar II" },
  "darius-the-great": { wikidataId: "Q44387", slug: "darius-the-great", entityType: "person", name: "Darius the Great" },
  "pericles": { wikidataId: "Q80398", slug: "pericles", entityType: "person", name: "Pericles" },
  "justinian-i": { wikidataId: "Q41866", slug: "justinian-i", entityType: "person", name: "Justinian I" },
  "harun-al-rashid": { wikidataId: "Q131002", slug: "harun-al-rashid", entityType: "person", name: "Harun al-Rashid" },
  "mehmed-ii": { wikidataId: "Q34503", slug: "mehmed-ii", entityType: "person", name: "Mehmed II" },
  "william-the-conqueror": { wikidataId: "Q37594", slug: "william-the-conqueror", entityType: "person", name: "William the Conqueror" },
  "joan-of-arc": { wikidataId: "Q7226", slug: "joan-of-arc", entityType: "person", name: "Joan of Arc" },
  "isabella-i-of-castile": { wikidataId: "Q45859", slug: "isabella-i-of-castile", entityType: "person", name: "Isabella I of Castile" },
  "charles-v-holy-roman-emperor": { wikidataId: "Q32500", slug: "charles-v-holy-roman-emperor", entityType: "person", name: "Charles V, Holy Roman Emperor" },
  "elizabeth-i": { wikidataId: "Q7207", slug: "elizabeth-i", entityType: "person", name: "Elizabeth I" },
  "louis-xiv": { wikidataId: "Q7742", slug: "louis-xiv", entityType: "person", name: "Louis XIV" },
  "queen-victoria": { wikidataId: "Q9439", slug: "queen-victoria", entityType: "person", name: "Queen Victoria" },
  "otto-von-bismarck": { wikidataId: "Q8442", slug: "otto-von-bismarck", entityType: "person", name: "Otto von Bismarck" },
  "confucius": { wikidataId: "Q4604", slug: "confucius", entityType: "person", name: "Confucius" },
  "buddha": { wikidataId: "Q9441", slug: "buddha", entityType: "person", name: "The Buddha" },
  "jesus": { wikidataId: "Q302", slug: "jesus", entityType: "person", name: "Jesus" },
  "muhammad": { wikidataId: "Q9458", slug: "muhammad", entityType: "person", name: "Muhammad" },
  "socrates": { wikidataId: "Q913", slug: "socrates", entityType: "person", name: "Socrates" },
  "plato": { wikidataId: "Q859", slug: "plato", entityType: "person", name: "Plato" },
  "aristotle": { wikidataId: "Q868", slug: "aristotle", entityType: "person", name: "Aristotle" },
  "martin-luther": { wikidataId: "Q9554", slug: "martin-luther", entityType: "person", name: "Martin Luther" },
  "leonardo-da-vinci": { wikidataId: "Q762", slug: "leonardo-da-vinci", entityType: "person", name: "Leonardo da Vinci" },
  "galileo-galilei": { wikidataId: "Q307", slug: "galileo-galilei", entityType: "person", name: "Galileo Galilei" },
  "isaac-newton": { wikidataId: "Q935", slug: "isaac-newton", entityType: "person", name: "Isaac Newton" },
  "charles-darwin": { wikidataId: "Q1035", slug: "charles-darwin", entityType: "person", name: "Charles Darwin" },
  "marie-curie": { wikidataId: "Q7186", slug: "marie-curie", entityType: "person", name: "Marie Curie" },
  "albert-einstein": { wikidataId: "Q937", slug: "albert-einstein", entityType: "person", name: "Albert Einstein" },
  "george-washington": { wikidataId: "Q23", slug: "george-washington", entityType: "person", name: "George Washington" },
  "abraham-lincoln": { wikidataId: "Q91", slug: "abraham-lincoln", entityType: "person", name: "Abraham Lincoln" },
  "vladimir-lenin": { wikidataId: "Q1394", slug: "vladimir-lenin", entityType: "person", name: "Vladimir Lenin" },
  "joseph-stalin": { wikidataId: "Q855", slug: "joseph-stalin", entityType: "person", name: "Joseph Stalin" },
  "adolf-hitler": { wikidataId: "Q352", slug: "adolf-hitler", entityType: "person", name: "Adolf Hitler" },
  "winston-churchill": { wikidataId: "Q8016", slug: "winston-churchill", entityType: "person", name: "Winston Churchill" },
  "franklin-d-roosevelt": { wikidataId: "Q8007", slug: "franklin-d-roosevelt", entityType: "person", name: "Franklin D. Roosevelt" },
  "mao-zedong": { wikidataId: "Q5816", slug: "mao-zedong", entityType: "person", name: "Mao Zedong" },
  "mahatma-gandhi": { wikidataId: "Q1001", slug: "mahatma-gandhi", entityType: "person", name: "Mahatma Gandhi" },
  "ho-chi-minh": { wikidataId: "Q36014", slug: "ho-chi-minh", entityType: "person", name: "Ho Chi Minh" },
  "sun-yat-sen": { wikidataId: "Q8573", slug: "sun-yat-sen", entityType: "person", name: "Sun Yat-sen" },
  "nelson-mandela": { wikidataId: "Q8023", slug: "nelson-mandela", entityType: "person", name: "Nelson Mandela" },
};

/** Crosswalk for historical events. */
export const EVENTS_CROSSWALK: Record<string, CrosswalkEntry & { entityType: EntityType }> = {
  // Original 8 — Europe/Mediterranean
  "fall-of-rome":               { wikidataId: "Q608613",  slug: "fall-of-rome",               entityType: "event" },
  "black-death":                { wikidataId: "Q42005",   slug: "black-death",                entityType: "event" },
  "mongol-invasion-of-europe":  { wikidataId: "Q852171",  slug: "mongol-invasion-of-europe",  entityType: "event" },
  "crusades":                   { wikidataId: "Q12546",   slug: "crusades",                   entityType: "event" },
  "age-of-discovery":           { wikidataId: "Q133641",  slug: "age-of-discovery",           entityType: "event" },
  "battle-of-marathon":         { wikidataId: "Q31900",   slug: "battle-of-marathon",         entityType: "event" },
  "french-revolution":          { wikidataId: "Q6534",    slug: "french-revolution",          entityType: "event" },
  "fall-of-constantinople":     { wikidataId: "Q160077",  slug: "fall-of-constantinople",     entityType: "event" },
  // Americas
  "fall-of-tenochtitlan":               { wikidataId: "Q593267",  slug: "fall-of-tenochtitlan",               entityType: "event" },
  "spanish-conquest-of-the-inca-empire":{ wikidataId: "Q636771",  slug: "spanish-conquest-of-the-inca-empire",entityType: "event" },
  "haitian-revolution":                 { wikidataId: "Q689128",  slug: "haitian-revolution",                 entityType: "event" },
  // Asia & Africa
  "an-lushan-rebellion":        { wikidataId: "Q253774",  slug: "an-lushan-rebellion",        entityType: "event" },
  "house-of-wisdom":            { wikidataId: "Q33018",   slug: "house-of-wisdom",            entityType: "event" },
  "bantu-expansion":            { wikidataId: "Q130251",  slug: "bantu-expansion",            entityType: "event" },
  "meiji-restoration":          { wikidataId: "Q8707",    slug: "meiji-restoration",          entityType: "event" },
  "siege-of-baghdad":           { wikidataId: "Q369560",  slug: "siege-of-baghdad",           entityType: "event" },
  // Europe (additional)
  "protestant-reformation":     { wikidataId: "Q12562",   slug: "protestant-reformation",     entityType: "event" },
  "american-revolution":        { wikidataId: "Q192769",  slug: "american-revolution",        entityType: "event" },
  "battle-of-hastings":         { wikidataId: "Q83224",   slug: "battle-of-hastings",         entityType: "event" },
  // Added 2026-10: ancient, early-modern and 19th–20th century events
"neolithic-revolution": { wikidataId: "Q180548", slug: "neolithic-revolution", entityType: "event", name: "Neolithic Revolution" },
  "late-bronze-age-collapse": { wikidataId: "Q1059758", slug: "late-bronze-age-collapse", entityType: "event", name: "Late Bronze Age collapse" },
  "greco-persian-wars": { wikidataId: "Q76026", slug: "greco-persian-wars", entityType: "event", name: "Greco-Persian Wars" },
  "peloponnesian-war": { wikidataId: "Q33745", slug: "peloponnesian-war", entityType: "event", name: "Peloponnesian War" },
  "punic-wars": { wikidataId: "Q124988", slug: "punic-wars", entityType: "event", name: "Punic Wars" },
  "qins-wars-of-unification": { wikidataId: "Q2986801", slug: "qins-wars-of-unification", entityType: "event", name: "Qin's wars of unification" },
  "battle-of-tours": { wikidataId: "Q173077", slug: "battle-of-tours", entityType: "event", name: "Battle of Tours" },
  "battle-of-ain-jalut": { wikidataId: "Q244356", slug: "battle-of-ain-jalut", entityType: "event", name: "Battle of Ain Jalut" },
  "reconquista": { wikidataId: "Q79791", slug: "reconquista", entityType: "event", name: "Reconquista" },
  "hundred-years-war": { wikidataId: "Q12551", slug: "hundred-years-war", entityType: "event", name: "Hundred Years' War" },
  "sengoku-period": { wikidataId: "Q204023", slug: "sengoku-period", entityType: "event", name: "Sengoku period" },
  "columbian-exchange": { wikidataId: "Q767253", slug: "columbian-exchange", entityType: "event", name: "Columbian exchange" },
  "atlantic-slave-trade": { wikidataId: "Q10701282", slug: "atlantic-slave-trade", entityType: "event", name: "Atlantic slave trade" },
  "thirty-years-war": { wikidataId: "Q2487", slug: "thirty-years-war", entityType: "event", name: "Thirty Years' War" },
  "glorious-revolution": { wikidataId: "Q189508", slug: "glorious-revolution", entityType: "event", name: "Glorious Revolution" },
  "industrial-revolution": { wikidataId: "Q2269", slug: "industrial-revolution", entityType: "event", name: "Industrial Revolution" },
  "napoleonic-wars": { wikidataId: "Q78994", slug: "napoleonic-wars", entityType: "event", name: "Napoleonic Wars" },
  "spanish-american-wars-of-independence": { wikidataId: "Q1123201", slug: "spanish-american-wars-of-independence", entityType: "event", name: "Spanish American wars of independence" },
  "first-opium-war": { wikidataId: "Q191282", slug: "first-opium-war", entityType: "event", name: "First Opium War" },
  "taiping-rebellion": { wikidataId: "Q192408", slug: "taiping-rebellion", entityType: "event", name: "Taiping Rebellion" },
  "american-civil-war": { wikidataId: "Q8676", slug: "american-civil-war", entityType: "event", name: "American Civil War" },
  "unification-of-germany": { wikidataId: "Q154705", slug: "unification-of-germany", entityType: "event", name: "Unification of Germany" },
  "unification-of-italy": { wikidataId: "Q51122", slug: "unification-of-italy", entityType: "event", name: "Unification of Italy" },
  "scramble-for-africa": { wikidataId: "Q179848", slug: "scramble-for-africa", entityType: "event", name: "Scramble for Africa" },
  "world-war-i": { wikidataId: "Q361", slug: "world-war-i", entityType: "event", name: "World War I" },
  "russian-revolution": { wikidataId: "Q8729", slug: "russian-revolution", entityType: "event", name: "Russian Revolution" },
  "great-depression": { wikidataId: "Q8698", slug: "great-depression", entityType: "event", name: "Great Depression" },
  "world-war-ii": { wikidataId: "Q362", slug: "world-war-ii", entityType: "event", name: "World War II" },
  "holocaust": { wikidataId: "Q2763", slug: "holocaust", entityType: "event", name: "The Holocaust" },
  "partition-of-india": { wikidataId: "Q129053", slug: "partition-of-india", entityType: "event", name: "Partition of India" },
  "chinese-civil-war": { wikidataId: "Q179975", slug: "chinese-civil-war", entityType: "event", name: "Chinese Civil War" },
  "cold-war": { wikidataId: "Q8683", slug: "cold-war", entityType: "event", name: "Cold War" },
  "korean-war": { wikidataId: "Q8663", slug: "korean-war", entityType: "event", name: "Korean War" },
  "decolonisation-of-africa": { wikidataId: "Q1146918", slug: "decolonisation-of-africa", entityType: "event", name: "Decolonisation of Africa" },
  "vietnam-war": { wikidataId: "Q8740", slug: "vietnam-war", entityType: "event", name: "Vietnam War" },
  "cuban-missile-crisis": { wikidataId: "Q128160", slug: "cuban-missile-crisis", entityType: "event", name: "Cuban Missile Crisis" },
  "apollo-11": { wikidataId: "Q43653", slug: "apollo-11", entityType: "event", name: "Apollo 11" },
  "revolutions-of-1989": { wikidataId: "Q382861", slug: "revolutions-of-1989", entityType: "event", name: "Revolutions of 1989" },
  "dissolution-of-the-soviet-union": { wikidataId: "Q5167679", slug: "dissolution-of-the-soviet-union", entityType: "event", name: "Dissolution of the Soviet Union" },
};

/** Crosswalk for cultures / topics. */
export const CULTURES_CROSSWALK: Record<string, CrosswalkEntry & { entityType: EntityType }> = {
  // Original 8
  "silk-road":             { wikidataId: "Q36288",    slug: "silk-road",             entityType: "culture" },
  "renaissance":           { wikidataId: "Q4692",     slug: "renaissance",           entityType: "culture" },
  "islamic-golden-age":    { wikidataId: "Q745799",   slug: "islamic-golden-age",    entityType: "culture" },
  "ancient-greece":        { wikidataId: "Q11772",    slug: "ancient-greece",        entityType: "culture" },
  "ancient-egypt":         { wikidataId: "Q11768",    slug: "ancient-egypt",         entityType: "culture" },
  "viking-age":            { wikidataId: "Q213649",   slug: "viking-age",            entityType: "culture" },
  "feudal-japan":          { wikidataId: "Q130436",   slug: "feudal-japan",          entityType: "culture" },
  "ancient-rome":          { wikidataId: "Q1747689",  slug: "ancient-rome",          entityType: "culture" },
  // New — broader world coverage
  "polynesian-navigation": { wikidataId: "Q826781",   slug: "polynesian-navigation", entityType: "culture" },
  "maya-civilization":     { wikidataId: "Q28567",    slug: "maya-civilization",     entityType: "culture" },
  "aztec-civilization":    { wikidataId: "Q12542",    slug: "aztec-civilization",    entityType: "culture" },
  "inca-civilization":     { wikidataId: "Q60197531",  slug: "inca-civilization",     entityType: "culture" },
  "confucianism":          { wikidataId: "Q9581",     slug: "confucianism",          entityType: "culture" },
  "hellenistic-period":    { wikidataId: "Q428995",   slug: "hellenistic-period",    entityType: "culture" },
  // Added 2026-10: early civilizations, world religions, intellectual movements
"sumer": { wikidataId: "Q35355", slug: "sumer", entityType: "culture", name: "Sumer" },
  "mycenaean-greece": { wikidataId: "Q181264", slug: "mycenaean-greece", entityType: "culture", name: "Mycenaean Greece" },
  "phoenicia": { wikidataId: "Q41642", slug: "phoenicia", entityType: "culture", name: "Phoenicia" },
  "nok-culture": { wikidataId: "Q927291", slug: "nok-culture", entityType: "culture", name: "Nok culture" },
  "swahili-culture": { wikidataId: "Q1758211", slug: "swahili-culture", entityType: "culture", name: "Swahili culture" },
  "mississippian-culture": { wikidataId: "Q1052095", slug: "mississippian-culture", entityType: "culture", name: "Mississippian culture" },
  "ancestral-puebloans": { wikidataId: "Q478805", slug: "ancestral-puebloans", entityType: "culture", name: "Ancestral Puebloans" },
  "aboriginal-australians": { wikidataId: "Q12060728", slug: "aboriginal-australians", entityType: "culture", name: "Aboriginal Australians" },
  "judaism": { wikidataId: "Q9268", slug: "judaism", entityType: "culture", name: "Judaism" },
  "hinduism": { wikidataId: "Q9089", slug: "hinduism", entityType: "culture", name: "Hinduism" },
  "buddhism": { wikidataId: "Q748", slug: "buddhism", entityType: "culture", name: "Buddhism" },
  "zoroastrianism": { wikidataId: "Q9601", slug: "zoroastrianism", entityType: "culture", name: "Zoroastrianism" },
  "christianity": { wikidataId: "Q5043", slug: "christianity", entityType: "culture", name: "Christianity" },
  "islam": { wikidataId: "Q432", slug: "islam", entityType: "culture", name: "Islam" },
  "scientific-revolution": { wikidataId: "Q214078", slug: "scientific-revolution", entityType: "culture", name: "Scientific Revolution" },
  "age-of-enlightenment": { wikidataId: "Q12539", slug: "age-of-enlightenment", entityType: "culture", name: "Age of Enlightenment" },
};

// Build slug → entry maps
const _personBySlug = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _eventBySlug  = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _cultureBySlug = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _personByQid = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _eventByQid = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _cultureByQid = new Map<string, CrosswalkEntry & { entityType: EntityType }>();

for (const e of Object.values(PEOPLE_CROSSWALK)) {
  _personBySlug.set(e.slug, e);
  _personByQid.set(e.wikidataId, e);
}
for (const e of Object.values(EVENTS_CROSSWALK)) {
  _eventBySlug.set(e.slug, e);
  _eventByQid.set(e.wikidataId, e);
}
for (const e of Object.values(CULTURES_CROSSWALK)) {
  _cultureBySlug.set(e.slug, e);
  _cultureByQid.set(e.wikidataId, e);
}

export function lookupPerson(slug: string)  { return _personBySlug.get(slug); }
export function lookupEvent(slug: string)   { return _eventBySlug.get(slug); }
export function lookupCulture(slug: string) { return _cultureBySlug.get(slug); }

export function lookupPersonByQid(qid: string)  { return _personByQid.get(qid); }
export function lookupEventByQid(qid: string)   { return _eventByQid.get(qid); }
export function lookupCultureByQid(qid: string) { return _cultureByQid.get(qid); }

export function registerResolvedEntity(
  entityType: EntityType,
  slug: string,
  wikidataId: string,
): CrosswalkEntry & { entityType: EntityType } {
  const entry: CrosswalkEntry & { entityType: EntityType } = {
    wikidataId,
    slug,
    entityType,
  };

  if (entityType === "person") {
    // Never overwrite existing verified entries.
    if (_personBySlug.has(slug) || _personByQid.has(wikidataId)) {
      return _personBySlug.get(slug) ?? _personByQid.get(wikidataId) ?? entry;
    }
    _personBySlug.set(slug, entry);
    _personByQid.set(wikidataId, entry);
  } else if (entityType === "event") {
    if (_eventBySlug.has(slug) || _eventByQid.has(wikidataId)) {
      return _eventBySlug.get(slug) ?? _eventByQid.get(wikidataId) ?? entry;
    }
    _eventBySlug.set(slug, entry);
    _eventByQid.set(wikidataId, entry);
  } else if (entityType === "culture") {
    if (_cultureBySlug.has(slug) || _cultureByQid.has(wikidataId)) {
      return _cultureBySlug.get(slug) ?? _cultureByQid.get(wikidataId) ?? entry;
    }
    _cultureBySlug.set(slug, entry);
    _cultureByQid.set(wikidataId, entry);
  }

  return entry;
}

/** All people, events, cultures — for browse/search. */
function allEntities() {
  return [
    ...Object.values(PEOPLE_CROSSWALK),
    ...Object.values(EVENTS_CROSSWALK),
    ...Object.values(CULTURES_CROSSWALK),
  ];
}
