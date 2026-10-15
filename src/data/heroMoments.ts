/**
 * The moments the homepage hero cycles through. Every year is a real
 * snapshot year. After changing this list, re-render the frames:
 *   node scripts/build-hero-frames.mjs
 */
export const HERO_MOMENTS = [
  { year: -323, caption: "Alexander dies in Babylon; his empire stretches from Greece to the Indus" },
  { year: 100,  caption: "Rome and Han China anchor the two ends of the classical world" },
  { year: 800,  caption: "Charlemagne is crowned emperor; the Abbasids rule from Baghdad" },
  { year: 1279, caption: "Kublai Khan completes the conquest of Song China" },
  { year: 1600, caption: "The gunpowder empires: Ottoman, Safavid and Mughal" },
  { year: 1815, caption: "The Congress of Vienna redraws Europe after Napoleon" },
  { year: 1914, caption: "The world on the eve of the First World War" },
  { year: 2010, caption: "A planet divided almost entirely into nation-states" },
] as const;
