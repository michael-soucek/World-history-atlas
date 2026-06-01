import type { Era } from "@/types";

/**
 * Canonical era definitions, shared across the timeline, browse, and slider UI.
 * start is inclusive, end is exclusive.
 */
export const ERA_LIST: Era[] = [
  {
    label: "Prehistoric",
    start: -Infinity,
    end: -3000,
    blurb:
      "The long age before writing, when humans spread across the globe, took up farming, and raised the first villages and monuments. It is known only through archaeology — tools, bones, and art rather than names and dates.",
  },
  {
    label: "Ancient",
    start: -3000,
    end: -500,
    blurb:
      "The age of the first cities, writing, and states — from Mesopotamia and Egypt to the Indus Valley and early China. Empires, law codes, and long-distance trade appeared as people began to record their world.",
  },
  {
    label: "Classical",
    start: -500,
    end: 500,
    blurb:
      "An era of large empires and enduring ideas across Eurasia — Greece and Rome, Persia, Maurya and Han China — linked by routes like the Silk Road. Much of the world's lasting philosophy, religion, and science took shape here.",
  },
  {
    label: "Medieval",
    start: 500,
    end: 1400,
    blurb:
      "After Rome's western collapse, power fragmented and reformed: the Byzantine and Islamic worlds flourished, dynasties rose in China and India, and trading states like Mali grew rich. Faith and commerce tied distant regions together.",
  },
  {
    label: "Early Modern",
    start: 1400,
    end: 1800,
    blurb:
      "Oceans became highways. Europeans reached the Americas, gunpowder empires spanned Asia, and goods, people, and diseases crossed continents for the first time — reshaping the world, often through conquest and slavery.",
  },
  {
    label: "Modern",
    start: 1800,
    end: Infinity,
    blurb:
      "Industry, nations, and rapid change. Steam, electricity, and later digital technology transformed daily life; empires expanded and then dissolved; and world wars, decolonization, and globalization drew nearly every society into one connected world.",
  },
];

export function getEraForYear(year: number): Era {
  return ERA_LIST.find(e => year >= e.start && year < e.end) ?? ERA_LIST[ERA_LIST.length - 1];
}

/** URL-safe slug for an era label. */
export function eraSlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "-");
}

/** Era label from URL slug. */
export function eraFromSlug(slug: string): Era | undefined {
  return ERA_LIST.find(e => eraSlug(e.label) === slug);
}
