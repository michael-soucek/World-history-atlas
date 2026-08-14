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
  "inca-civilization":     { wikidataId: "Q3404008",  slug: "inca-civilization",     entityType: "culture" },
  "confucianism":          { wikidataId: "Q9581",     slug: "confucianism",          entityType: "culture" },
  "hellenistic-period":    { wikidataId: "Q428995",   slug: "hellenistic-period",    entityType: "culture" },
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
