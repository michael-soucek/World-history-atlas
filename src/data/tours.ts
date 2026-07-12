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
        mapState: { year: 600, lat: 40, lng: 35, zoom: 4, regionId: "Q12544" },
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
        mapState: { year: 1200, lat: 48, lng: 105, zoom: 3, regionId: "Q12557" },
      },
      {
        title: "The Conquest of Northern China",
        text: "The Mongols shattered the Jin dynasty over a series of campaigns, sacking Zhongdu (modern Beijing) in 1215. Their siege technology — learned from Chinese engineers — let them crack fortified cities that nomads had always found impenetrable.",
        mapState: { year: 1279, lat: 38, lng: 112, zoom: 4, regionId: "Q12557" },
      },
      {
        title: "The Destruction of the Abbasid Caliphate",
        text: "In 1258, Hulagu Khan's army sacked Baghdad — then the largest city in the world. The Abbasid Caliph was executed. The 'Abbasid Caliphate's 500-year reign ended in a week. It was one of the great cultural catastrophes of the medieval world.",
        mapState: { year: 1279, lat: 33, lng: 45, zoom: 5 },
      },
      {
        title: "The Empire at Its Peak",
        text: "At its peak in 1279, the Mongol Empire spanned from Poland to Korea — some 24 million square kilometers. It was the largest contiguous land empire in history. But it had also begun to fragment into four khanates: the Yuan, the Ilkhanate, the Chagatai, and the Golden Horde.",
        mapState: { year: 1279, lat: 45, lng: 70, zoom: 2.5, regionId: "Q12557" },
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
        mapState: { year: 1492, lat: 5, lng: 20, zoom: 2.5, regionId: "Q200464" },
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
  {
    slug: "rise-of-the-caliphates",
    title: "The Rise of the Islamic Caliphates",
    description: "In little more than a century, Arab armies carrying a new faith built one of the largest empires the world had ever seen — from the Atlantic to the Indus.",
    duration: 6,
    difficulty: "standard",
    steps: [
      {
        title: "Arabia on the Eve of Islam",
        text: "In 600 CE, the Arabian Peninsula sat between two exhausted superpowers — the Byzantine and Sasanian empires — locked in decades of ruinous war. Arabia itself was a patchwork of tribes, trading towns, and faiths. Into this world, in the city of Mecca, the Prophet Muhammad began preaching around 610 CE.",
        mapState: { year: 600, lat: 24, lng: 42, zoom: 4 },
      },
      {
        title: "The Rashidun Conquests",
        text: "After Muhammad's death in 632, the first four 'Rightly Guided' caliphs led a stunning expansion. Within a decade the Rashidun Caliphate had taken Syria, Egypt, and Mesopotamia from the Byzantines and shattered the Sasanian Empire entirely — one of the most rapid conquests in history.",
        mapState: { year: 700, lat: 30, lng: 44, zoom: 3, regionId: "Q12490507" },
      },
      {
        title: "The Umayyads Reach Three Continents",
        text: "The Umayyad Caliphate, ruling from Damascus, pushed the frontier from the Atlantic coast of Morocco to the edge of India. In 711 an Umayyad army crossed into Iberia; by 732 raiders had reached central France. It was, at its height, among the largest empires that had ever existed.",
        mapState: { year: 750, lat: 33, lng: 20, zoom: 2.5, regionId: "Q8575586" },
      },
      {
        title: "The Abbasid Golden Age",
        text: "In 750 the Abbasid Caliphate seized power and founded a new capital at Baghdad. There the House of Wisdom gathered Greek, Persian, and Indian learning; scholars advanced algebra, medicine, and astronomy. For centuries Baghdad was among the richest and most learned cities on earth.",
        mapState: { year: 800, lat: 33, lng: 44, zoom: 4, regionId: "Q12536" },
      },
      {
        title: "Fragmentation and Rival Caliphates",
        text: "No empire so vast could stay united. By the 10th century rival caliphates had emerged — the Fatimids in Egypt and a revived Umayyad line in Córdoba — while local dynasties ruled in the caliph's name. The unity of the early conquests gave way to a rich, plural Islamic world.",
        mapState: { year: 1000, lat: 30, lng: 35, zoom: 3 },
      },
      {
        title: "The Sack of Baghdad",
        text: "The Abbasid caliphate endured in name until 1258, when the Mongols under Hulagu Khan stormed Baghdad and executed the last caliph. The political caliphate was over — but the religion, law, science, and art it had nurtured would shape civilizations from West Africa to Southeast Asia.",
        mapState: { year: 1279, lat: 33, lng: 44, zoom: 4 },
      },
    ],
  },
  {
    slug: "silk-road-and-trade",
    title: "The Silk Road & Indian Ocean Trade",
    description: "Long before oceans were crossed, overland caravans and monsoon-driven ships linked China, India, the Islamic world, Africa, and Europe in a web of commerce and ideas.",
    duration: 6,
    difficulty: "standard",
    steps: [
      {
        title: "The Road Opens",
        text: "Around 130 BCE, the Han dynasty's envoy Zhang Qian returned from Central Asia, and China began trading silk westward in earnest. The network of routes later called the Silk Road carried silk, spices, and — just as importantly — Buddhism, papermaking, and disease across Eurasia.",
        mapState: { year: -100, lat: 40, lng: 90, zoom: 3, regionId: "Q7209" },
      },
      {
        title: "Tang China and the Cosmopolitan Route",
        text: "Under the Tang dynasty (618–907), the Silk Road reached a golden age. Chang'an, the Tang capital, was perhaps the world's largest city — home to Sogdian merchants, Nestorian Christians, Zoroastrians, and Muslims. Goods and faiths flowed both ways across Central Asia.",
        mapState: { year: 700, lat: 38, lng: 95, zoom: 3, regionId: "Q9683" },
      },
      {
        title: "The Indian Ocean Monsoon Trade",
        text: "South of the land routes, seasonal monsoon winds powered a vast maritime trade. From the ports of the Swahili coast to Arabia, India, and beyond, dhows carried gold, ivory, textiles, and spices. This ocean network often moved more wealth than the overland Silk Road ever did.",
        mapState: { year: 1000, lat: 5, lng: 60, zoom: 3 },
      },
      {
        title: "Srivijaya and the Straits",
        text: "Whoever controlled the Strait of Malacca controlled the sea route between India and China. From the 7th century the maritime empire of Srivijaya, centered on Sumatra, grew rich taxing this traffic and became a great center of Buddhist learning in Southeast Asia.",
        mapState: { year: 1000, lat: 0, lng: 104, zoom: 4, regionId: "Q234197" },
      },
      {
        title: "Gold Across the Sahara",
        text: "A parallel trade crossed the Sahara by camel caravan. West African empires — Ghana, then Mali — grew wealthy exchanging gold and salt. When Mansa Musa of Mali made his pilgrimage to Mecca in 1324, the gold he spent along the way reportedly disrupted economies for years.",
        mapState: { year: 1300, lat: 16, lng: -4, zoom: 3.5, regionId: "Q184536" },
      },
      {
        title: "Majapahit and the Spice Islands",
        text: "By the 14th century the Javanese empire of Majapahit dominated the archipelago's lucrative spice trade. Nutmeg, cloves, and mace — grown almost nowhere else on earth — drew merchants from China, India, and Arabia, and would soon lure Europeans halfway around the world.",
        mapState: { year: 1400, lat: -7, lng: 112, zoom: 4, regionId: "Q49326" },
      },
    ],
  },
  {
    slug: "chinese-dynasties",
    title: "China's Dynastic Cycle",
    description: "For over two thousand years, Chinese history moved through a rhythm of unification, flourishing, decline, and renewal — a succession of dynasties that shaped East Asia.",
    duration: 6,
    difficulty: "standard",
    steps: [
      {
        title: "The First Emperor",
        text: "In 221 BCE, the state of Qin conquered its rivals and its king declared himself Qin Shi Huang, First Emperor of a unified China. He standardized writing, weights, and roads, and began the Great Wall. The dynasty was brutal and brief, but the idea of a single unified China endured.",
        mapState: { year: -200, lat: 34, lng: 109, zoom: 4 },
      },
      {
        title: "The Han Golden Age",
        text: "The Han dynasty (206 BCE–220 CE) gave China four centuries of stability, Confucian government, and expansion. The empire grew to rival Rome in size and population, opened the Silk Road, and so defined Chinese identity that the majority ethnic group still calls itself 'Han'.",
        mapState: { year: 100, lat: 34, lng: 108, zoom: 3, regionId: "Q7209" },
      },
      {
        title: "The Cosmopolitan Tang",
        text: "After centuries of division, the Tang dynasty (618–907) reunified China and presided over a cultural golden age. Poetry, Buddhism, and trade flourished; the capital Chang'an drew merchants and pilgrims from across Asia. Tang China was confident, open, and immensely influential on Korea and Japan.",
        mapState: { year: 750, lat: 34, lng: 108, zoom: 3, regionId: "Q9683" },
      },
      {
        title: "Song Innovation",
        text: "The Song dynasty (960–1279) was an age of invention: gunpowder weapons, the magnetic compass, printing, and paper money. Its cities were the largest and most sophisticated on earth. Yet militarily it was pressed hard by northern nomads — and finally overwhelmed by the Mongols.",
        mapState: { year: 1100, lat: 32, lng: 115, zoom: 3, regionId: "Q7462" },
      },
      {
        title: "The Ming Restoration",
        text: "After a century of Mongol Yuan rule, the Ming dynasty (1368–1644) restored native Chinese government. It rebuilt the Great Wall in the form we know today, moved the capital to Beijing, and in the early 1400s sent Admiral Zheng He's vast treasure fleets across the Indian Ocean.",
        mapState: { year: 1450, lat: 36, lng: 114, zoom: 3, regionId: "Q9903" },
      },
      {
        title: "The Qing and the Last Dynasty",
        text: "The Manchu-led Qing dynasty (1644–1912) built China's largest territorial empire, roughly the shape of the country today. But 19th-century pressures — the Opium Wars, rebellions, and foreign encroachment — eroded it, and in 1912 the dynastic system that had lasted two millennia came to an end.",
        mapState: { year: 1750, lat: 36, lng: 110, zoom: 2.5, regionId: "Q8733" },
      },
    ],
  },
  {
    slug: "empires-of-the-americas",
    title: "Empires of the Americas",
    description: "Long before European contact, the Americas were home to sophisticated civilizations — and their collision with Spain in the 16th century reshaped the world.",
    duration: 5,
    difficulty: "standard",
    steps: [
      {
        title: "Mesoamerica's Deep Roots",
        text: "By 1300 CE, central Mexico had already seen millennia of civilization — the Olmec, Teotihuacan, and the Maya, whose cities, writing, and astronomy flourished across the Yucatán. These cultures built the foundations on which later empires would rise.",
        mapState: { year: 1300, lat: 18, lng: -90, zoom: 4 },
      },
      {
        title: "The Aztec Triple Alliance",
        text: "From their island capital Tenochtitlan — one of the largest cities in the world — the Aztecs built an empire across central Mexico through the 15th century. It was a society of monumental temples, tribute, causeways, and floating gardens, home to perhaps five million people.",
        mapState: { year: 1500, lat: 19, lng: -99, zoom: 4, regionId: "Q2608489" },
      },
      {
        title: "The Inca and the Andes",
        text: "In South America, the Inca Empire stretched over 4,000 km along the Andes — the largest empire in the pre-Columbian Americas. Without the wheel or a writing system, the Inca bound it together with a vast road network, terraced agriculture, and knotted-cord records called quipu.",
        mapState: { year: 1500, lat: -13, lng: -72, zoom: 3.5, regionId: "Q28573" },
      },
      {
        title: "The Spanish Conquest",
        text: "Between 1519 and 1533, small Spanish forces under Hernán Cortés and Francisco Pizarro toppled the Aztec and Inca empires. Steel, horses, indigenous allies, and above all Old World diseases — which killed a catastrophic share of the population — brought the great American empires down.",
        mapState: { year: 1530, lat: 5, lng: -75, zoom: 2.5, regionId: "Q80702" },
      },
      {
        title: "A New World Order",
        text: "Spain's American empire became the engine of a global economy. Silver from Potosí and Mexico flowed across the Atlantic and Pacific, funding European wars and buying Chinese goods. The Americas were now permanently, and often violently, bound into a single world system.",
        mapState: { year: 1600, lat: -10, lng: -65, zoom: 2.5, regionId: "Q80702" },
      },
    ],
  },
  {
    slug: "world-at-war",
    title: "The World at War: 1914–1945",
    description: "Two global wars in the space of a single generation reshaped borders, toppled empires, and killed tens of millions — remaking the modern world.",
    duration: 6,
    difficulty: "standard",
    steps: [
      {
        title: "Europe's Armed Peace",
        text: "By 1914, Europe was divided into rival alliances and swollen with empires — German, Austro-Hungarian, Russian, British, and French — bristling with new industrial weapons. A single assassination in Sarajevo would be enough to set the whole system alight.",
        mapState: { year: 1914, lat: 48, lng: 16, zoom: 3, regionId: "Q28513" },
      },
      {
        title: "The Great War",
        text: "The First World War (1914–1918) bogged down into industrialized slaughter — trenches, machine guns, poison gas. Some 17 million died. When it ended, four empires had fallen: the German, Austro-Hungarian, Russian, and Ottoman. New nations were drawn across their ruins.",
        mapState: { year: 1916, lat: 49, lng: 5, zoom: 4, regionId: "Q43287" },
      },
      {
        title: "A Fragile Peace",
        text: "The Treaty of Versailles (1919) redrew Europe and burdened Germany with blame and reparations. Amid economic collapse and resentment, extreme movements rose. By the 1930s Adolf Hitler's Nazi Germany was rearming and tearing up the postwar settlement.",
        mapState: { year: 1930, lat: 52, lng: 13, zoom: 4 },
      },
      {
        title: "The Second World War Erupts",
        text: "In 1939 Germany invaded Poland, and war engulfed Europe again. Nazi Germany overran most of the continent by 1941. This was total war, waged against civilians as much as armies — and at its heart lay the Holocaust, the systematic murder of six million Jews.",
        mapState: { year: 1941, lat: 50, lng: 20, zoom: 3, regionId: "Q7318" },
      },
      {
        title: "A Global Conflict",
        text: "The war spanned the planet. Japan's expansion across the Pacific brought the United States in after Pearl Harbor in 1941; campaigns raged across North Africa, the Soviet Union, and Southeast Asia. It became the deadliest conflict in human history.",
        mapState: { year: 1942, lat: 20, lng: 100, zoom: 2 },
      },
      {
        title: "The Reckoning",
        text: "By 1945 Germany and Japan were defeated, the latter after atomic bombs fell on Hiroshima and Nagasaki. Some 70–85 million people had died. From the wreckage rose two superpowers, the United Nations, and a Cold War that would divide the world for decades.",
        mapState: { year: 1945, lat: 40, lng: 30, zoom: 2, regionId: "Q7318" },
      },
    ],
  },
  {
    slug: "end-of-empires",
    title: "The End of Empires: Decolonization",
    description: "In the decades after 1945, the great colonial empires dissolved and dozens of new nations were born across Asia, Africa, and the Middle East.",
    duration: 5,
    difficulty: "standard",
    steps: [
      {
        title: "Empires at Their Zenith",
        text: "In 1900 a handful of European powers ruled much of the globe. The British Empire alone governed a quarter of the world's land and people. Colonized societies had long resisted, but two world wars would fatally weaken the imperial powers and embolden movements for independence.",
        mapState: { year: 1914, lat: 20, lng: 20, zoom: 1.8, regionId: "Q8680" },
      },
      {
        title: "The Partition of India",
        text: "In 1947, after decades of struggle led by figures like Mohandas Gandhi, Britain withdrew from its most populous colony. British India was partitioned into India and Pakistan. Independence was joyous — but partition triggered mass migration and violence that killed hundreds of thousands.",
        mapState: { year: 1947, lat: 22, lng: 79, zoom: 3.5, regionId: "Q668" },
      },
      {
        title: "The Wind of Change in Africa",
        text: "The late 1950s and 1960s saw a wave of African independence — Ghana in 1957, then dozens more. In 1960 alone, seventeen African nations became independent. Borders drawn by European mapmakers, however, would leave a difficult legacy for the new states.",
        mapState: { year: 1960, lat: 2, lng: 20, zoom: 2.5 },
      },
      {
        title: "Wars of Independence",
        text: "Not all empires let go peacefully. France fought bitter wars in Indochina and Algeria; Vietnam's long struggle against colonial and then Cold War powers lasted decades. Independence was often won at enormous cost in lives and upheaval.",
        mapState: { year: 1954, lat: 16, lng: 107, zoom: 4, regionId: "Q881" },
      },
      {
        title: "A World of Nations",
        text: "By the 1970s the age of overseas empires was effectively over. The United Nations, which began with 51 members in 1945, would grow past 190. The map of the world had been redrawn — a planet of nation-states, still grappling with the legacies of the imperial age.",
        mapState: { year: 1975, lat: 10, lng: 10, zoom: 1.8 },
      },
    ],
  },
];

/** Look up a tour by slug. */
export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find(t => t.slug === slug);
}
