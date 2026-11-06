/**
 * How /tour shelves the tours. Each tour belongs to one group, listed here by
 * slug; a tour missing from every group still appears, under "More tours", so
 * a new tour can never go unlisted.
 */
export interface TourGroup {
  id: string;
  title: string;
  blurb: string;
  slugs: string[];
}

/** The three tours shown large at the top of /tour. */
export const FEATURED_TOURS = ["polynesian-voyagers", "mongol-world-conquest", "europe-through-history"];

/**
 * Which stop's picture a tour's card uses, counting from 0, where the first
 * picture is a map, a document or a poor fit for a cover.
 */
export const COVER_STOP: Record<string, number> = {
  "age-of-discovery": 2,
  "ancient-greece": 5,
  "bantu-expansion": 6,
  "black-death": 8,
  "british-empire": 1,
  "end-of-empires": 2,
  "first-world-war": 3,
  "great-travellers": 2,
  "hannibal-and-the-punic-wars": 4,
  "magyar-journey": 1,
  "out-of-africa": 6,
  "polynesian-voyagers": 17,
  "reconquista": 7,
  "renaissance": 4,
  "scramble-for-africa": 5,
  "second-world-war-europe": 4,
  "spanish-empire": 8,
  "unification-of-italy-and-germany": 1,
  "vietnam-wars": 1,
  "world-at-war": 8,
};

export const TOUR_GROUPS: TourGroup[] = [
  {
    id: "peoples",
    title: "Peoples on the move",
    blurb: "Migrations that filled continents and oceans.",
    slugs: [
      "out-of-africa",
      "polynesian-voyagers",
      "bantu-expansion",
      "huns-and-the-great-migrations",
      "magyar-journey",
      "viking-voyages",
    ],
  },
  {
    id: "ancient",
    title: "The ancient world",
    blurb: "The first cities, and the powers that fought over the Mediterranean.",
    slugs: [
      "cradle-of-civilization",
      "ancient-greece",
      "alexander-the-great",
      "hannibal-and-the-punic-wars",
      "rise-and-fall-of-rome",
    ],
  },
  {
    id: "empires",
    title: "Empires and dynasties",
    blurb: "How the great powers rose, spread and came apart.",
    slugs: [
      "chinese-dynasties",
      "empires-of-india",
      "rise-of-the-caliphates",
      "mongol-world-conquest",
      "ottoman-advance",
      "kingdoms-of-africa",
      "empires-of-the-americas",
      "conquest-of-the-aztec-and-inca",
      "spanish-empire",
      "british-empire",
      "rise-of-russia",
      "scramble-for-africa",
      "end-of-empires",
    ],
  },
  {
    id: "trade",
    title: "Trade and exploration",
    blurb: "The routes that joined the world, and what travelled along them.",
    slugs: ["silk-road", "silk-road-and-trade", "great-travellers", "age-of-discovery", "atlantic-slave-trade"],
  },
  {
    id: "ideas",
    title: "Ideas, faith and change",
    blurb: "Beliefs, diseases and inventions that spread across the map.",
    slugs: [
      "world-religions",
      "black-death",
      "renaissance",
      "reformation",
      "enlightenment",
      "age-of-revolutions",
      "industrial-revolution",
    ],
  },
  {
    id: "wars",
    title: "Wars",
    blurb: "Campaign by campaign, with the armies and battles drawn on the map.",
    slugs: [
      "the-crusades",
      "reconquista",
      "hundred-years-war",
      "thirty-years-war",
      "napoleonic-wars",
      "american-civil-war",
      "world-at-war",
      "first-world-war",
      "second-world-war-europe",
      "second-world-war-pacific",
      "korean-war",
      "vietnam-wars",
    ],
  },
  {
    id: "nations",
    title: "Nations and the modern map",
    blurb: "How today's borders were drawn.",
    slugs: ["europe-through-history", "unification-of-italy-and-germany", "cold-war", "fall-of-communism"],
  },
];
