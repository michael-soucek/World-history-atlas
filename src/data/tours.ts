import type { EntityType } from "@/types";

export interface TourMapState {
  year: number;
  lat: number;
  lng: number;
  zoom: number;
  regionId?: string; // Wikidata Q-ID to highlight
}

export interface TourStep {
  title: string;
  text: string;
  /** Optional Wikimedia Commons image URL */
  imageUrl?: string;
  imageCaption?: string;
  mapState: TourMapState;
}

export interface Tour {
  slug: string;
  title: string;
  description: string;
  /** Approximate duration in minutes */
  duration: number;
  difficulty: "intro" | "standard" | "deep-dive";
  entityType?: EntityType;
  /** Cover image (Wikimedia Commons) */
  coverImageUrl?: string;
  steps: TourStep[];
}

export const TOURS: Tour[] = [
  {
    slug: "rise-and-fall-of-rome",
    title: "The Rise and Fall of Rome",
    description: "From a small city on the Tiber to an empire spanning three continents — and its long collapse.",
    duration: 5,
    difficulty: "intro",
    steps: [
      {
        title: "A City on the Tiber",
        text: "In 500 BCE, Rome was just one of many city-states on the Italian peninsula, dominated by the Etruscans to the north and the Greek colonies to the south. Its republican government — two consuls elected annually — was an experiment in shared power that would prove remarkably durable.",
        mapState: { year: -500, lat: 42, lng: 12.5, zoom: 5, regionId: "Q2277" },
      },
      {
        title: "The Republic Conquers Italy",
        text: "By 200 BCE, Rome had unified the Italian peninsula and decisively beaten Carthage in the First Punic War. The Macedonian Wars were next. Rome was no longer a city-state — it was becoming an empire while still calling itself a republic.",
        mapState: { year: -200, lat: 40, lng: 18, zoom: 4, regionId: "Q2277" },
      },
      {
        title: "The Height of Roman Power",
        text: "Under Trajan (98–117 CE), the Roman Empire reached its greatest territorial extent — from Scotland to Mesopotamia. Some 70 million people lived within its borders, connected by 80,000 km of roads and a common legal system. It was the largest empire the Western world had ever seen.",
        mapState: { year: 100, lat: 38, lng: 20, zoom: 3, regionId: "Q2277" },
      },
      {
        title: "The Divided Empire",
        text: "By 300 CE, the empire had grown too large to govern from one center. Diocletian formally split it in two. The Eastern half — wealthier, more urbanized, better positioned on trade routes — would outlast the Western by a thousand years.",
        mapState: { year: 300, lat: 42, lng: 25, zoom: 4 },
      },
      {
        title: "The Fall of the West",
        text: "In 476 CE, the Germanic chieftain Odoacer deposed the last Western Roman Emperor, Romulus Augustulus. The Western Empire was gone — though many Romans barely noticed. The Eastern Empire, centered on Constantinople, continued as Byzantium.",
        mapState: { year: 500, lat: 45, lng: 15, zoom: 4 },
      },
      {
        title: "Byzantium Endures",
        text: "What we call the Byzantine Empire was simply the Eastern Roman Empire — it never called itself anything else. Under Justinian (527–565 CE), it briefly reconquered North Africa and Italy. But the pressures of the Arab conquests and the Seljuks slowly reduced it to a rump state around Constantinople.",
        mapState: { year: 600, lat: 40, lng: 35, zoom: 4, regionId: "Q11258" },
      },
    ],
  },
  {
    slug: "mongol-world-conquest",
    title: "The Mongol World Conquest",
    description: "How a nomadic confederation from the Mongolian steppe built the largest contiguous land empire in history in under 80 years.",
    duration: 6,
    difficulty: "standard",
    steps: [
      {
        title: "Before Genghis Khan",
        text: "In 1100 CE, the Mongolian steppe was divided among dozens of warring tribes — Mongols, Tatars, Merkits, Naimans. No single power united them. To the south, the Jin dynasty controlled northern China. Central Asia was divided among the Khwarazmian Empire and other powers.",
        mapState: { year: 1100, lat: 48, lng: 105, zoom: 3 },
      },
      {
        title: "Unification Under Temüjin",
        text: "By 1206, Temüjin — born into a minor clan, enslaved as a child — had unified all the Mongolian tribes and been proclaimed Genghis Khan ('Universal Ruler'). His innovations: meritocracy over tribal hierarchy, and a cavalry doctrine of terrifying speed and precision.",
        mapState: { year: 1200, lat: 48, lng: 105, zoom: 3, regionId: "Q12544" },
      },
      {
        title: "The Conquest of Northern China",
        text: "The Mongols shattered the Jin dynasty over a series of campaigns, sacking Zhongdu (modern Beijing) in 1215. Their siege technology — learned from Chinese engineers — let them crack fortified cities that nomads had always found impenetrable.",
        mapState: { year: 1279, lat: 38, lng: 112, zoom: 4, regionId: "Q12544" },
      },
      {
        title: "The Destruction of the Abbasid Caliphate",
        text: "In 1258, Hulagu Khan's army sacked Baghdad — then the largest city in the world. The Abbasid Caliph was executed. The 'Abbasid Caliphate's 500-year reign ended in a week. It was one of the great cultural catastrophes of the medieval world.",
        mapState: { year: 1279, lat: 33, lng: 45, zoom: 5 },
      },
      {
        title: "The Empire at Its Peak",
        text: "At its peak in 1279, the Mongol Empire spanned from Poland to Korea — some 24 million square kilometers. It was the largest contiguous land empire in history. But it had also begun to fragment into four khanates: the Yuan, the Ilkhanate, the Chagatai, and the Golden Horde.",
        mapState: { year: 1279, lat: 45, lng: 70, zoom: 2.5, regionId: "Q12544" },
      },
    ],
  },
  {
    slug: "age-of-discovery",
    title: "The Age of Discovery",
    description: "How European sailors — motivated by spice, gold, and religion — connected the world's continents for the first time.",
    duration: 5,
    difficulty: "intro",
    steps: [
      {
        title: "A World Still Unconnected",
        text: "In 1400, the Americas, sub-Saharan Africa, and Australasia were effectively unknown to European cartographers. The Ottoman Empire's control of overland routes to Asia made spices expensive. European powers needed a sea route.",
        mapState: { year: 1400, lat: 20, lng: 20, zoom: 2 },
      },
      {
        title: "Portugal Rounds Africa",
        text: "Portuguese sailors crept down the African coast throughout the 1400s. In 1488, Bartolomeu Dias rounded the Cape of Good Hope. In 1498, Vasco da Gama reached India. Portugal now controlled the sea route to Asian spice markets — bypassing the Ottomans entirely.",
        mapState: { year: 1492, lat: 5, lng: 20, zoom: 2.5, regionId: "Q41580" },
      },
      {
        title: "Columbus Reaches the Americas",
        text: "In 1492, Christopher Columbus — sailing for Spain — reached the Caribbean, believing he had found Asia. He had found a continent unknown to Europeans. Within decades, the Aztec and Inca empires would be conquered and their silver would flow to Spain.",
        mapState: { year: 1492, lat: 20, lng: -70, zoom: 3 },
      },
      {
        title: "The World Divided",
        text: "The Treaty of Tordesillas (1494) divided the world between Spain and Portugal along a meridian. Brazil went to Portugal; the rest of the Americas to Spain. No one asked the indigenous peoples of the Americas, Africa, or Asia.",
        mapState: { year: 1530, lat: 10, lng: -30, zoom: 2.5 },
      },
      {
        title: "A Connected World",
        text: "By 1600, the Columbian Exchange — the transfer of crops, animals, diseases, and people between hemispheres — had permanently altered every civilization on earth. Potatoes and maize transformed European diets. Smallpox and measles killed an estimated 90% of some indigenous American populations.",
        mapState: { year: 1600, lat: 20, lng: 10, zoom: 2 },
      },
    ],
  },
];

/** Look up a tour by slug. */
export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find(t => t.slug === slug);
}
