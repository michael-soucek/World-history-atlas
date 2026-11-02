/**
 * The "borders over time" time-lapses: one animated map per region, drawn for
 * every single year from `from` to TIMELAPSE_END, from the Cliopatria dataset
 * (Seshat Global History Databank, CC BY 4.0).
 *
 * The map data and the facts are built ahead of time:
 *   npx tsx scripts/build-cliopatria-timelapse.mts [slug…]
 *     → public/timelapse-data/{slug}.json + src/data/timelapseFacts.json
 *   SITE=http://localhost:3000 npx tsx scripts/build-timelapse-video.mts [slug…]
 *     → public/timelapse/{slug}-wide.webp (cover) + videos/{slug}.mp4 (vertical, for social media)
 */

export type Bbox = [west: number, south: number, east: number, north: number];

export interface Timelapse {
  slug: string;
  /** "Europe" — used in "Europe's borders over time". */
  label: string;
  /** Possessive form for titles. */
  possessive: string;
  /** First year shown. */
  from: number;
  /** The area the map frames, and the area the "largest states" figures measure. */
  bbox: Bbox;
  /** Optional tighter frame for the portrait (phone / video) crop. */
  tallBbox?: Bbox;
  /** Optional frame for the video only, where it differs from the portrait crop. */
  videoBbox?: Bbox;
  /** The year shown on the hub card and share image. */
  cover: number;
  /** Matching /region page, if there is one. */
  region?: string;
  intro: string;
  /** A guided tour that tells this region's story, linked beside the animation. */
  tour?: { slug: string; title: string; blurb: string };
  /** Single years worth opening on the full map, each with a one-line reason. */
  keyYears?: { year: number; note: string }[];
  /** Questions people search for, answered on the page and marked up as an FAQ. */
  faq?: { q: string; a: string }[];
}

export const TIMELAPSES: Timelapse[] = [
  {
    slug: "europe",
    cover: 1812,
    label: "Europe",
    possessive: "Europe’s",
    from: -2000,
    bbox: [-11, 35, 44, 67],
    tallBbox: [-11, 35, 36, 62],
    region: "europe",
    intro:
      "Bronze Age kingdoms, Greek city-states, Rome’s rise and fall, the medieval kingdoms, Napoleon, two world wars and the end of the Soviet Union: four thousand years of Europe’s borders, one year at a time.",
    tour: {
      slug: "europe-through-history",
      title: "Europe Through History",
      blurb: "A guided tour in 19 stops, from Greek colonies and Rome to the Iron Curtain and the Europe of today, with the map moving to each moment as you read.",
    },
    keyYears: [
      { year: -500, note: "Greek city-states, Etruscans, Carthage and a young Rome" },
      { year: 100, note: "The Roman Empire near its greatest size" },
      { year: 500, note: "The kingdoms that replaced Rome in the west" },
      { year: 800, note: "Charlemagne’s empire" },
      { year: 1000, note: "The first Christian kingdoms of the north and east" },
      { year: 1300, note: "The Golden Horde and the rise of Moscow" },
      { year: 1500, note: "Spain united, the Ottomans in the Balkans" },
      { year: 1650, note: "After the Peace of Westphalia" },
      { year: 1815, note: "The Congress of Vienna settlement" },
      { year: 1914, note: "The four empires on the eve of war" },
      { year: 1920, note: "The new states after the First World War" },
      { year: 1938, note: "On the eve of the Second World War" },
      { year: 1945, note: "Germany occupied, Poland moved west" },
      { year: 1985, note: "The Cold War divide" },
      { year: 1994, note: "After the fall of communism" },
    ],
    faq: [
      {
        q: "How have Europe’s borders changed over time?",
        a: "Europe has been redrawn again and again: by Rome’s conquests and its fall in the west, by Charlemagne and the medieval kingdoms, by the Ottoman advance, by Napoleon and the Congress of Vienna, by the unification of Italy and Germany, and by the settlements after both world wars. The last big redrawing came between 1989 and 1993, when the Soviet Union, Yugoslavia and Czechoslovakia broke up.",
      },
      {
        q: "When did Europe’s borders change the most?",
        a: "The biggest single redrawings followed great wars and collapses: the Napoleonic Wars and the 1815 settlement, the end of the First World War, when four empires fell and states such as Poland, Czechoslovakia and Yugoslavia appeared, the end of the Second World War, and the end of communism from 1989 to 1993.",
      },
      {
        q: "What did Europe look like in 1914?",
        a: "Four empires, the German, Austro-Hungarian, Russian and Ottoman, ruled most of central and eastern Europe. Poland, Czechoslovakia, Finland and the Baltic states did not exist as independent countries. All four empires were gone by 1922.",
      },
      {
        q: "How many countries are there in Europe today?",
        a: "Usually about 44 to 50, depending on whether countries that lie partly in Asia, such as Turkey, Kazakhstan and the Caucasus states, are counted, and on how disputed states such as Kosovo are treated.",
      },
      {
        q: "What is the oldest border in Europe?",
        a: "The border between Portugal and Spain is often called the oldest in Europe: most of it has barely changed since the Treaty of Alcañices in 1297.",
      },
    ],
  },
  {
    slug: "world",
    cover: 1914,
    label: "the world",
    possessive: "The world’s",
    from: -2000,
    bbox: [-170, -50, 180, 75],
    tallBbox: [-20, -26, 150, 74],
    videoBbox: [-180, -56, 180, 76],
    intro:
      "Four thousand years of states and empires across the whole planet, from Egypt’s Middle Kingdom and the cities of Mesopotamia to a world divided almost entirely into nation-states.",
  },
  {
    slug: "middle-east",
    cover: 1600,
    label: "the Middle East",
    possessive: "The Middle East’s",
    from: -2000,
    bbox: [22, 12, 63, 43],
    region: "middle-east",
    intro:
      "Babylon, Assyria and Persia, Alexander and his successors, the caliphates, the Ottomans and the modern states drawn after the First World War.",
  },
  {
    slug: "east-asia",
    cover: 1279,
    label: "East Asia",
    possessive: "East Asia’s",
    from: -2000,
    bbox: [72, 16, 146, 54],
    tallBbox: [92, 18, 142, 54],
    region: "east-asia",
    intro:
      "China’s dynasties expanding and splitting apart, the Mongol conquests, Korea and Japan, the Qing Empire and the borders of the 20th century.",
  },
  {
    slug: "south-asia",
    cover: 1700,
    label: "South Asia",
    possessive: "South Asia’s",
    from: -2000,
    bbox: [60, 5, 98, 38],
    region: "south-asia",
    intro:
      "The Maurya and Gupta empires, the Delhi Sultanate, the Mughals, British rule and the partition of 1947.",
  },
  {
    slug: "africa",
    cover: 1914,
    label: "Africa",
    possessive: "Africa’s",
    from: -2000,
    bbox: [-19, -36, 53, 38],
    region: "africa",
    intro:
      "Carthage and Kush, Aksum, the Sahel empires of Ghana, Mali and Songhai, the European scramble for Africa and independence in the 20th century.",
  },
  {
    slug: "americas",
    cover: 1783,
    label: "the Americas",
    possessive: "The Americas’",
    from: -700,
    bbox: [-128, -56, -34, 58],
    tallBbox: [-118, -56, -34, 50],
    region: "americas",
    intro:
      "The Aztec and Inca empires, the Spanish, Portuguese, French and British colonies, independence across two continents and the growth of the United States.",
  },
];

export const TIMELAPSE_BY_SLUG: Record<string, Timelapse> = Object.fromEntries(TIMELAPSES.map((t) => [t.slug, t]));

/** The last year Cliopatria covers. */
export const TIMELAPSE_END = 2024;

export function formatYear(y: number): string {
  return y < 0 ? `${-y} BCE` : `${y}`;
}

export interface TimelapseName { name: string; slug?: string }

/** Large states (≥ 100,000 km² in the frame) newly on the map in `year`, and ones gone from it. */
export interface TimelapseEvent { year: number; appeared: TimelapseName[]; gone: TimelapseName[] }

/** From `year` on (until the next entry), the states and empires holding the most land in the frame. */
export interface TimelapseLeaders { year: number; largest: (TimelapseName & { km2: number })[] }

export interface TimelapseFacts {
  slug: string;
  from: number;
  to: number;
  /** Every year in which the map differs from the year before. */
  changes: number[];
  events: TimelapseEvent[];
  leaders: TimelapseLeaders[];
}

/** The latest entry at or before `year` in a list sorted by year. */
export function atYear<T extends { year: number }>(list: T[], year: number): T | undefined {
  let lo = 0, hi = list.length - 1, found: T | undefined;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (list[mid].year <= year) { found = list[mid]; lo = mid + 1; } else hi = mid - 1;
  }
  return found;
}
