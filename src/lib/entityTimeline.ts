import { cache } from "react";

const WD_USER_AGENT = "WorldHistoryAtlas/1.0 (entity-timeline)";
const LONG_REVALIDATE_SECONDS = 31536000;

interface EntityRaw {
  claims?: Record<string, Array<{
    mainsnak?: {
      datavalue?: {
        value?: {
          time?: string;
        };
      };
    };
  }>>;
}

export interface EntityLifespan {
  validFrom: number;
  validTo: number;
}

function parseWikidataYear(time?: string): number | null {
  if (!time || typeof time !== "string") return null;
  const match = time.match(/^([+-]\d{1,16})/);
  if (!match) return null;
  const raw = Number.parseInt(match[1], 10);
  if (!Number.isFinite(raw)) return null;
  return raw;
}

function claimYears(entity: EntityRaw, prop: string): number[] {
  const claims = entity.claims?.[prop] ?? [];
  const years = claims
    .map((statement) => parseWikidataYear(statement.mainsnak?.datavalue?.value?.time))
    .filter((year): year is number => typeof year === "number" && Number.isFinite(year));

  return years;
}

const fetchEntityLifespanRaw = cache(async (qid: string): Promise<EntityLifespan | null> => {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": WD_USER_AGENT,
    },
    next: { revalidate: LONG_REVALIDATE_SECONDS },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as { entities?: Record<string, EntityRaw> };
  const entity = json.entities?.[qid];
  if (!entity) return null;

  const starts = [
    ...claimYears(entity, "P571"), // inception
    ...claimYears(entity, "P580"), // start time
    ...claimYears(entity, "P1319"), // earliest date
  ];
  const ends = [
    ...claimYears(entity, "P582"), // end time
    ...claimYears(entity, "P576"), // dissolved or abolished
    ...claimYears(entity, "P1326"), // latest date
  ];

  if (starts.length === 0 && ends.length === 0) return null;

  const validFrom = starts.length > 0 ? Math.min(...starts) : -Infinity;
  const validTo = ends.length > 0 ? Math.max(...ends) : Infinity;

  if (validFrom >= validTo) return null;
  return { validFrom, validTo };
});

export async function getEntityLifespan(qid: string): Promise<EntityLifespan | null> {
  try {
    return await fetchEntityLifespanRaw(qid);
  } catch {
    return null;
  }
}

export function overlapsEra(lifespan: EntityLifespan, eraStart: number, eraEnd: number): boolean {
  return lifespan.validFrom < eraEnd && lifespan.validTo > eraStart;
}
