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
        mapState: { year: -500, lat: 42, lng: 12.5, zoom: 5, regionId: "Q17167" },
      },
      {
        title: "The Republic Conquers Italy",
        text: "By 200 BCE, Rome had unified the Italian peninsula and decisively beaten Carthage in the First Punic War. The Macedonian Wars were next. Rome was no longer a city-state — it was becoming an empire while still calling itself a republic.",
        mapState: { year: -200, lat: 40, lng: 18, zoom: 4, regionId: "Q17167" },
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
        mapState: { year: 1200, lat: 38, lng: 112, zoom: 4, regionId: "Q12557" },
      },
      {
        title: "The Destruction of the Abbasid Caliphate",
        text: "In 1258, Hulagu Khan's army sacked Baghdad — then the largest city in the world. The Abbasid Caliph was executed. The 'Abbasid Caliphate's 500-year reign ended in a week. It was one of the great cultural catastrophes of the medieval world.",
        mapState: { year: 1279, lat: 33, lng: 45, zoom: 5 },
      },
      {
        title: "The Empire at Its Peak",
        text: "At its peak in 1279, the Mongol Empire spanned from Poland to Korea — some 24 million square kilometers. It was the largest contiguous land empire in history. But it had also begun to fragment into four khanates: the Yuan, the Ilkhanate, the Chagatai, and the Golden Horde.",
        mapState: { year: 1279, lat: 45, lng: 70, zoom: 2.5, regionId: "Q7313" },
      },
    ],
  },
  {
    slug: "silk-road",
    title: "The Silk Road",
    description: "The ancient network of trade routes that linked China with the Mediterranean for over 1,500 years.",
    duration: 5,
    difficulty: "intro",
    steps: [
      {
        title: "The Opening of the Road",
        text: "In 138 BCE, the Han Emperor Wu sent Zhang Qian to the West. Though he was trying to find allies against the Xiongnu, he discovered high-quality horses and established the first formal trade links into Central Asia.",
        mapState: { year: -100, lat: 38, lng: 110, zoom: 4, regionId: "Q7209" },
      },
      {
        title: "The Kushan Crossroads",
        text: "By 100 CE, the Kushan Empire in central Asia sat at the pivot point of the world's trade. Silk moved west from China; gold, glass, and wine moved east from Rome; and Buddhism began its journey north into the heart of Asia.",
        mapState: { year: 100, lat: 35, lng: 70, zoom: 4, regionId: "Q25979" },
      },
      {
        title: "The Golden Age of Tang",
        text: "During the Tang Dynasty (618–907 CE), the Silk Road reached its peak. Chang'an became the largest and most cosmopolitan city in the world, filled with merchants from Persia, Sogdia, and beyond.",
        mapState: { year: 800, lat: 36, lng: 108, zoom: 4, regionId: "Q9683" },
      },
      {
        title: "The Pax Mongolica",
        text: "The Mongol conquests in the 13th century actually made the Silk Road safer than ever. Under a single political authority, travelers like Marco Polo could cross the entire continent with unprecedented ease.",
        mapState: { year: 1300, lat: 45, lng: 80, zoom: 3, regionId: "Q487829" },
      },
      {
        title: "Maritime Competition",
        text: "By 1500, the land routes of the Silk Road began to decline. Ships were becoming larger and more efficient, and the Ottoman control of the eastern Mediterranean pushed Europeans to find new sea routes directly to the East.",
        mapState: { year: 1500, lat: 35, lng: 45, zoom: 3, regionId: "Q12560" },
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
        mapState: { year: 700, lat: 30, lng: 44, zoom: 3 },
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
        mapState: { year: 800, lat: 38, lng: 95, zoom: 3, regionId: "Q9683" },
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
        mapState: { year: 1400, lat: -7, lng: 112, zoom: 4 },
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
        mapState: { year: 800, lat: 34, lng: 108, zoom: 3, regionId: "Q9683" },
      },
      {
        title: "Song Innovation",
        text: "The Song dynasty (960–1279) was an age of invention: gunpowder weapons, the magnetic compass, printing, and paper money. Its cities were the largest and most sophisticated on earth. Yet militarily it was pressed hard by northern nomads — and finally overwhelmed by the Mongols.",
        mapState: { year: 1100, lat: 32, lng: 115, zoom: 3, regionId: "Q7462" },
      },
      {
        title: "The Ming Restoration",
        text: "After a century of Mongol Yuan rule, the Ming dynasty (1368–1644) restored native Chinese government. It rebuilt the Great Wall in the form we know today, moved the capital to Beijing, and in the early 1400s sent Admiral Zheng He's vast treasure fleets across the Indian Ocean.",
        mapState: { year: 1492, lat: 36, lng: 114, zoom: 3, regionId: "Q9903" },
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
        mapState: { year: 1945, lat: 40, lng: 30, zoom: 2 },
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
        mapState: { year: 1960, lat: 16, lng: 107, zoom: 4, regionId: "Q881" },
      },
      {
        title: "A World of Nations",
        text: "By the 1970s the age of overseas empires was effectively over. The United Nations, which began with 51 members in 1945, would grow past 190. The map of the world had been redrawn — a planet of nation-states, still grappling with the legacies of the imperial age.",
        mapState: { year: 1975, lat: 10, lng: 10, zoom: 1.8 },
      },
    ],
  },
  {
    slug: "kingdoms-of-africa",
    title: "Great Kingdoms of Africa",
    description: "Pharaohs of Kush, the trading empire of Aksum, the gold of Ghana and Mali, the stone city of Great Zimbabwe — three thousand years of African states.",
    duration: 6,
    difficulty: "intro",
    steps: [
      {
        title: "The Kingdom of Kush",
        text: "South of Egypt, along the Nile in what is now Sudan, the Kingdom of Kush grew rich on gold, ivory and trade. Around 744 BCE its kings turned the tables on their old overlord and conquered Egypt itself, ruling it for nearly a century as the 25th Dynasty. Later, from their capital at Meroë, Kushite rulers built hundreds of pyramids — more than Egypt ever did.",
        mapState: { year: -700, lat: 18, lng: 32, zoom: 4.5, regionId: "Q241790" },
      },
      {
        title: "Aksum, Empire of the Red Sea",
        text: "By the 3rd century CE, Aksum in the Ethiopian highlands controlled trade between the Roman world, Arabia and India. It minted its own gold coins and raised towering carved stone stelae. Around 330 CE King Ezana adopted Christianity, making Aksum one of the first states anywhere to do so — the root of the Ethiopian Orthodox Church.",
        mapState: { year: 300, lat: 14, lng: 39, zoom: 4.5, regionId: "Q139377" },
      },
      {
        title: "Ghana: The Land of Gold",
        text: "In the western Sahel, the Ghana Empire (not the modern country, which took its name) controlled the trans-Saharan trade: gold from the south exchanged for salt from the desert. Arab writers called it the land of gold; the geographer al-Bakri described its king's court and capital, Koumbi Saleh, in 1068.",
        mapState: { year: 1000, lat: 16, lng: -8, zoom: 4.5, regionId: "Q206789" },
      },
      {
        title: "Mali and Mansa Musa",
        text: "Around 1235, Sundiata Keita founded the Mali Empire, which came to stretch from the Atlantic coast deep into the Sahel. Its most famous ruler, Mansa Musa, made the pilgrimage to Mecca in 1324 with so much gold that he depressed its price in Cairo for years. Timbuktu became a renowned center of Islamic scholarship.",
        mapState: { year: 1300, lat: 15, lng: -6, zoom: 4, regionId: "Q184536" },
      },
      {
        title: "Great Zimbabwe",
        text: "On the plateau between the Zambezi and Limpopo rivers, the Shona built Great Zimbabwe, a city of massive dry-stone walls raised without mortar between the 11th and 15th centuries. Its rulers grew wealthy exporting gold and ivory through the Swahili ports of the Indian Ocean coast — Chinese porcelain and Persian glass have been found in its ruins.",
        mapState: { year: 1300, lat: -20, lng: 30.9, zoom: 5, regionId: "Q596092" },
      },
      {
        title: "Songhai, the Largest Empire",
        text: "In the 1400s Songhai, centered on Gao on the Niger, overtook Mali and became one of the largest states in African history. Under Askia Muhammad it was run by a professional administration and army. It fell in 1591, when a Moroccan army armed with firearms defeated it at the Battle of Tondibi.",
        mapState: { year: 1500, lat: 16, lng: 0, zoom: 4, regionId: "Q202687" },
      },
      {
        title: "Benin, Oyo and Asante",
        text: "In the forest belt nearer the coast, powerful kingdoms flourished: Benin, famous for its bronze and ivory court art; Oyo, a Yoruba cavalry empire; and Asante, whose wealth came from gold. They traded — including, tragically, in enslaved people — with Europeans on the coast, until the 'Scramble for Africa' after 1880 brought nearly the whole continent under colonial rule.",
        mapState: { year: 1800, lat: 7, lng: 2, zoom: 5, regionId: "Q722071" },
      },
    ],
  },
  {
    slug: "empires-of-india",
    title: "Empires of India",
    description: "From the planned cities of the Indus to the Mughals and the British Raj — how South Asia was united, divided and united again.",
    duration: 6,
    difficulty: "intro",
    steps: [
      {
        title: "The Indus Valley Cities",
        text: "Between about 2600 and 1900 BCE, cities like Harappa and Mohenjo-daro flourished along the Indus River. They had grid-planned streets, standardized bricks and weights, and drainage systems unmatched elsewhere for centuries. Their script has never been deciphered, and why the cities declined is still debated.",
        mapState: { year: -2000, lat: 27, lng: 69, zoom: 5, regionId: "Q42534" },
      },
      {
        title: "The Maurya Empire and Ashoka",
        text: "Around 321 BCE Chandragupta Maurya founded the first empire to unite most of the subcontinent. His grandson Ashoka, horrified by the bloodshed of his conquest of Kalinga, embraced Buddhism and had edicts on ethics and tolerance carved on rocks and pillars across his realm. Ashoka's lion capital is India's national emblem today.",
        mapState: { year: -300, lat: 23, lng: 80, zoom: 4, regionId: "Q62943" },
      },
      {
        title: "The Gupta Classical Age",
        text: "From the 4th to 6th centuries CE, the Gupta Empire presided over a golden age of Sanskrit literature, art and science. The poet Kalidasa wrote his plays, and the mathematician Aryabhata calculated the value of pi and explained eclipses. The decimal place-value system with a zero, later carried west by Arab scholars, took shape in India in this era.",
        mapState: { year: 400, lat: 25, lng: 82, zoom: 4.5, regionId: "Q11774" },
      },
      {
        title: "The Cholas Rule the Seas",
        text: "In the far south, the Chola dynasty built a maritime power. Rajaraja I raised the great Brihadisvara temple at Thanjavur (completed 1010), and his son Rajendra I sent a naval expedition across the Bay of Bengal against Srivijaya around 1025 — one of the few overseas military campaigns by any Indian state.",
        mapState: { year: 1000, lat: 11, lng: 79, zoom: 5, regionId: "Q151148" },
      },
      {
        title: "The Delhi Sultanate",
        text: "In 1206 a dynasty of Turkic former slave-soldiers founded the Delhi Sultanate, bringing Islamic rule to northern India. Its armies repeatedly turned back Mongol invasions that devastated much of Asia, and under Alauddin Khalji it pushed deep into the south. Indo-Islamic architecture such as the Qutb Minar dates from this period.",
        mapState: { year: 1300, lat: 27, lng: 78, zoom: 4.5, regionId: "Q229411" },
      },
      {
        title: "The Mughals",
        text: "In 1526 Babur, a descendant of both Timur and Genghis Khan, won the Battle of Panipat and founded the Mughal Empire. His grandson Akbar governed through religious tolerance and an efficient administration; Shah Jahan built the Taj Mahal (completed around 1653). At its height the empire ruled some 150 million people and was among the world's richest states.",
        mapState: { year: 1650, lat: 25, lng: 78, zoom: 4, regionId: "Q33296" },
      },
      {
        title: "The Raj and Independence",
        text: "The British East India Company expanded from trading posts to territorial rule; after the uprising of 1857 the British Crown governed India directly as the Raj. A mass independence movement led by Gandhi and the Indian National Congress won freedom in 1947 — but the subcontinent was partitioned into India and Pakistan, uprooting some 15 million people.",
        mapState: { year: 1930, lat: 23, lng: 80, zoom: 4, regionId: "Q129286" },
      },
    ],
  },
  {
    slug: "cradle-of-civilization",
    title: "Mesopotamia: Cradle of Civilization",
    description: "The first cities, the first writing, the first empires and the first written laws — all between the Tigris and Euphrates.",
    duration: 5,
    difficulty: "intro",
    steps: [
      {
        title: "The First Cities",
        text: "In southern Mesopotamia — today's Iraq — the Sumerians built the world's first cities. Uruk may have had 40,000 people by 3000 BCE. To keep track of grain, livestock and labor, its temple administrators developed cuneiform, the earliest known writing system, around 3200 BCE.",
        mapState: { year: -3000, lat: 31.5, lng: 46, zoom: 5.5 },
      },
      {
        title: "Sargon's Empire",
        text: "Around 2334 BCE Sargon of Akkad conquered the Sumerian city-states and created what is often called the world's first empire, stretching from the Persian Gulf toward the Mediterranean. It lasted about two centuries; the Sumerian city of Ur then revived to rule the region until around 2004 BCE, when the neighbouring Elamites sacked it.",
        mapState: { year: -2000, lat: 33, lng: 45, zoom: 5, regionId: "Q128904" },
      },
      {
        title: "Hammurabi's Babylon",
        text: "Hammurabi of Babylon (reigned c. 1792–1750 BCE) united Mesopotamia and issued one of the earliest written law codes, carved on a basalt stele now in the Louvre. Its 282 laws covered trade, property, family and crime — with punishments that depended on the social rank of victim and offender.",
        mapState: { year: -1500, lat: 32.5, lng: 44.4, zoom: 5, regionId: "Q47690" },
      },
      {
        title: "Hittites and the Bronze Age World",
        text: "In the Late Bronze Age, great powers — Egypt, the Hittites of Anatolia, Babylon, Assyria and Mitanni — exchanged letters, princesses and gifts as an early 'international system'. The Hittites fought Egypt at Kadesh in 1274 BCE and later made one of history's earliest surviving peace treaties. Around 1200 BCE this world collapsed in the Late Bronze Age collapse.",
        mapState: { year: -1500, lat: 39, lng: 35, zoom: 4.5, regionId: "Q5406" },
      },
      {
        title: "The Assyrian Empire",
        text: "From its heartland on the upper Tigris, Assyria built the largest empire the world had yet seen, reaching from Egypt to Iran by the 7th century BCE. Its kings deported conquered peoples and built grand palaces at Nineveh; Ashurbanipal assembled a vast library of clay tablets. In 612 BCE an alliance of Babylonians and Medes destroyed Nineveh.",
        mapState: { year: -700, lat: 35, lng: 42, zoom: 4.5, regionId: "Q41137" },
      },
      {
        title: "Babylon's Last Glory",
        text: "Under Nebuchadnezzar II (reigned 605–562 BCE) Babylon became the largest city in the world, with the Ishtar Gate and a great ziggurat. But in 539 BCE Cyrus the Great of Persia took the city, and Mesopotamia became part of the Achaemenid Empire — the end of three thousand years of native Mesopotamian kingdoms.",
        mapState: { year: -500, lat: 32.5, lng: 50, zoom: 4, regionId: "Q389688" },
      },
    ],
  },
  {
    slug: "cold-war",
    title: "The Cold War",
    description: "Two superpowers, a divided Europe, proxy wars, a nuclear standoff and a race to the Moon — until the Soviet Union dissolved in 1991.",
    duration: 6,
    difficulty: "standard",
    steps: [
      {
        title: "An Iron Curtain Descends",
        text: "After 1945 the wartime allies split. The Soviet Union installed communist governments across Eastern Europe, while the United States backed Western Europe with the Marshall Plan. Germany itself was divided into occupation zones. In 1946 Winston Churchill warned that an 'iron curtain' had descended across the continent.",
        mapState: { year: 1945, lat: 52, lng: 25, zoom: 3.5, regionId: "Q15180" },
      },
      {
        title: "Blocs and Bombs",
        text: "In 1949 the Western allies formed NATO, the Soviet Union tested its first atomic bomb, and Mao Zedong's Communists won the Chinese Civil War. The next year North Korea invaded the South; the Korean War (1950–1953) pulled in the United States and China and ended in a stalemate along roughly the old border.",
        mapState: { year: 1960, lat: 38, lng: 120, zoom: 3.5, regionId: "Q148" },
      },
      {
        title: "The End of Empires",
        text: "Europe's colonial empires dissolved in the same years. In 1960 alone, seventeen African countries became independent. Both superpowers competed for influence in the new states, while leaders such as India's Nehru and Egypt's Nasser founded the Non-Aligned Movement to stay out of either bloc.",
        mapState: { year: 1960, lat: 5, lng: 20, zoom: 3 },
      },
      {
        title: "Thirteen Days",
        text: "In October 1962 American spy planes found Soviet nuclear missiles being installed in Cuba, 150 km from Florida. For thirteen days the world stood closer to nuclear war than ever before or since, until Khrushchev agreed to remove the missiles in exchange for a US pledge not to invade Cuba — and the quiet removal of US missiles from Turkey.",
        mapState: { year: 1960, lat: 23, lng: -80, zoom: 5 },
      },
      {
        title: "Proxy Wars and the Space Race",
        text: "The superpowers avoided fighting each other directly, but backed opposing sides in wars around the world — most devastatingly in Vietnam, where the United States fought from 1965 until its withdrawal in 1973; the North took Saigon in 1975. The rivalry also drove the Space Race, from Sputnik in 1957 to the Apollo 11 Moon landing in 1969.",
        mapState: { year: 1960, lat: 16, lng: 106, zoom: 4.5, regionId: "Q881" },
      },
      {
        title: "1989–1991: The Wall Comes Down",
        text: "In 1989 peaceful revolutions swept Eastern Europe, and on 9 November crowds breached the Berlin Wall. Germany reunified in 1990. On 26 December 1991 the Soviet Union formally dissolved into fifteen independent countries, ending the Cold War and redrawing the map of Europe and Asia.",
        mapState: { year: 1994, lat: 55, lng: 45, zoom: 3, regionId: "Q159" },
      },
    ],
  },
  {
    slug: "world-religions",
    title: "How the World's Religions Began",
    description: "Where Hinduism, Judaism, Zoroastrianism, Buddhism, Confucianism, Christianity and Islam took shape — and how they spread across the map.",
    duration: 6,
    difficulty: "intro",
    steps: [
      {
        title: "The Vedas of Ancient India",
        text: "The oldest Hindu scriptures, the Vedas, were composed in Sanskrit in northern India from roughly 1500 BCE and passed down orally for centuries before being written. Hinduism has no single founder; it grew from Vedic ritual into a family of traditions centred on ideas such as dharma, karma and rebirth.",
        mapState: { year: -1000, lat: 28, lng: 77, zoom: 4.5 },
      },
      {
        title: "Israel and the Hebrew Bible",
        text: "In the hill country of Canaan, the Israelites came to worship a single god, Yahweh. After the Babylonians destroyed Jerusalem's temple in 587 BCE and deported much of its elite, exiled scribes gathered and edited the texts that became the Hebrew Bible — the foundation of Judaism, and later of Christianity and Islam.",
        mapState: { year: -700, lat: 31.8, lng: 35.2, zoom: 5.5 },
      },
      {
        title: "Zoroaster and Persia",
        text: "The Persian prophet Zoroaster (dates uncertain, perhaps before 1000 BCE) taught of a cosmic struggle between truth and falsehood, judgement after death, and a single wise god, Ahura Mazda. Zoroastrianism became the religion of the Achaemenid kings and later of the Sasanian Empire, and its ideas may have influenced Judaism and Christianity.",
        mapState: { year: -500, lat: 31, lng: 53, zoom: 4, regionId: "Q389688" },
      },
      {
        title: "The Buddha and Confucius",
        text: "Around 500 BCE, two teachers transformed Asian thought. In the Ganges valley, Siddhartha Gautama — the Buddha — taught a path out of suffering through ethics, meditation and insight. In the Chinese state of Lu, Confucius taught that good government and a good life rested on virtue, ritual and respect within the family. Neither saw his ideas written down in his lifetime.",
        mapState: { year: -500, lat: 30, lng: 105, zoom: 3.5, regionId: "Q35216" },
      },
      {
        title: "Christianity Conquers Rome",
        text: "Jesus of Nazareth was crucified in Roman Judaea around 30 CE; his followers spread the faith through the cities of the empire despite periodic persecution. The emperor Constantine legalised Christianity in 313, and by 380 it was the Roman Empire's official religion.",
        mapState: { year: 300, lat: 40, lng: 22, zoom: 3.5, regionId: "Q2277" },
      },
      {
        title: "Islam Across Three Continents",
        text: "In 610 CE, Muhammad began preaching in Mecca the revelations collected as the Qur'an. Within a century of his death in 632, the Umayyad Caliphate ruled from Spain to the Indus, and Islam spread with Arabic language, law and learning across the Middle East and North Africa.",
        mapState: { year: 700, lat: 30, lng: 30, zoom: 2.5, regionId: "Q8575586" },
      },
      {
        title: "Faiths on the Move",
        text: "Traders, monks and missionaries carried religions far from home. Buddhism travelled the Silk Road to China, Korea and Japan; Islam crossed the Sahara with caravans to kingdoms like Mali and sailed with merchants to Southeast Asia; Christianity spread north through Europe. By 1300 the world's religious map looked broadly as it would for centuries.",
        mapState: { year: 1300, lat: 25, lng: 40, zoom: 2 },
      },
    ],
  },
  {
    slug: "age-of-revolutions",
    title: "The Age of Revolutions",
    description: "From England's Glorious Revolution to the unification of Germany — two centuries in which kings lost power and nations were born.",
    duration: 6,
    difficulty: "standard",
    steps: [
      {
        title: "The Glorious Revolution",
        text: "In 1688 English Parliament leaders invited the Dutch prince William of Orange to replace the Catholic King James II, who fled. The Bill of Rights of 1689 limited the monarch's power and guaranteed regular parliaments — a model of constitutional government that inspired later revolutionaries.",
        mapState: { year: 1650, lat: 53, lng: -2, zoom: 5, regionId: "Q179876" },
      },
      {
        title: "American Independence",
        text: "Thirteen British colonies, objecting to taxation without representation, declared independence in 1776. With French help they won the war in 1783, and in 1787 wrote a constitution founded on popular sovereignty and the separation of powers — though it left slavery in place.",
        mapState: { year: 1783, lat: 39, lng: -78, zoom: 4, regionId: "Q30" },
      },
      {
        title: "Revolution in France",
        text: "Bankrupt and paralysed, the French monarchy summoned the Estates-General in 1789. Within weeks the Bastille fell and the Declaration of the Rights of Man was proclaimed. The revolution abolished feudal privileges, executed King Louis XVI in 1793, passed through the Terror, and ended with Napoleon's seizure of power in 1799.",
        mapState: { year: 1783, lat: 47, lng: 2.5, zoom: 5, regionId: "Q70972" },
      },
      {
        title: "Haiti: Freedom by Force",
        text: "In 1791 enslaved people in Saint-Domingue, France's richest colony, rose in revolt. Led by Toussaint Louverture and then Jean-Jacques Dessalines, they defeated French, Spanish and British armies, and in 1804 founded Haiti — the first independent Black republic and the first nation to permanently abolish slavery.",
        mapState: { year: 1815, lat: 19, lng: -72.5, zoom: 6, regionId: "Q790" },
      },
      {
        title: "Latin America Breaks Free",
        text: "When Napoleon occupied Spain in 1808, its American colonies began to govern themselves. Over the next two decades leaders such as Simón Bolívar and José de San Martín won independence for most of Spanish America, and Brazil declared independence from Portugal in 1822 as an empire under its own emperor, Pedro I.",
        mapState: { year: 1815, lat: -10, lng: -65, zoom: 2.5 },
      },
      {
        title: "Nations United: Italy and Germany",
        text: "After the failed revolutions of 1848, nationalism succeeded through war and diplomacy. Piedmont, led by Cavour and with Garibaldi's volunteers, united most of Italy by 1861. Prussia's chancellor Otto von Bismarck won three short wars and proclaimed the German Empire at Versailles in 1871.",
        mapState: { year: 1880, lat: 47, lng: 11, zoom: 4.5, regionId: "Q43287" },
      },
    ],
  },
];

/** Look up a tour by slug. */
export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find(t => t.slug === slug);
}
