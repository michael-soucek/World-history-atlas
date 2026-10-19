import type { Tour } from "@/data/tours";

/**
 * Tours of history's biggest events: great migrations, conquests, wars and
 * voyages, each drawn with arrows and battle markers (see TourRoute and
 * TourMarker in tours.ts). Paths are [longitude, latitude] waypoints.
 *
 * Across the Pacific, longitudes run past 180 (e.g. Tahiti at 210.6 instead
 * of -149.4) so lines stay continuous across the date line.
 *
 * `highlight` names must match the map snapshot the stop draws;
 * `node scripts/validate-tour-highlights.mjs` checks them.
 */
export const EVENT_TOURS: Tour[] = [
  // ──────────────────────────────────────────────────────── Out of Africa
  {
    slug: "out-of-africa",
    title: "Out of Africa: How Humans Spread Across the World",
    description:
      "How our species, born in Africa, walked and paddled to every continent but Antarctica: into Asia, across the sea to Australia, into Neanderthal Europe, and over the land bridge to the Americas.",
    duration: 7,
    difficulty: "intro",
    trail: true,
    steps: [
      {
        title: "Born in Africa",
        text: "Homo sapiens evolved in Africa. The oldest known fossils with features of our species come from Jebel Irhoud in Morocco, about 300,000 years old, and the Omo valley in Ethiopia, about 230,000. Other human species lived at the same time: Neanderthals in Europe and western Asia, Denisovans in Asia, and Homo erectus, among others.",
        mapState: { year: -300000, lat: 10, lng: 20, zoom: 2.2 },
        markers: [
          { label: "Jebel Irhoud, c. 300,000 years ago", at: [-8.87, 31.86] },
          { label: "Omo Kibish, c. 230,000 years ago", at: [35.95, 5.45] },
        ],
      },
      {
        title: "Early Forays and the Great Dispersal",
        text: "Small groups of Homo sapiens reached the Levant around 90,000–120,000 years ago, at caves such as Skhul and Qafzeh, but these early forays left few or no descendants. Nearly everyone living outside Africa today descends from a later dispersal, roughly 50,000 to 70,000 years ago, probably across the Sinai or the narrow Bab-el-Mandeb strait at the mouth of the Red Sea.",
        mapState: { year: -60000, lat: 22, lng: 42, zoom: 3 },
        markers: [
          { label: "Skhul and Qafzeh, c. 90,000–120,000 years ago", at: [34.97, 32.67] },
          { label: "Bab-el-Mandeb", at: [43.4, 12.6] },
        ],
        routes: [
          { label: "Out of Africa, c. 50,000–70,000 years ago", kind: "migration", path: [[37, 9], [42, 12], [43.4, 12.6], [47, 15], [55, 19], [58.5, 23.5]] },
          { label: "The northern route, via Sinai", kind: "migration", path: [[33, 22], [33.5, 28], [34.5, 31], [36, 34]] },
        ],
      },
      {
        title: "Along the Coasts of Asia",
        text: "Moving along the coasts of Arabia and India, where shellfish and fish were plentiful, people reached Southeast Asia. Sea levels were much lower in the Ice Age, joining many of today's islands to the mainland in a landmass called Sunda.",
        mapState: { year: -55000, lat: 15, lng: 85, zoom: 2.7 },
        routes: [
          { label: "The southern coastal route", kind: "migration", path: [[58.5, 23.5], [64, 25], [70, 21], [76, 10], [80, 15], [90, 21], [97, 16], [100, 6], [105, 0]] },
        ],
      },
      {
        title: "Across the Sea to Australia",
        text: "Even at its lowest, the sea between Sunda and Sahul, the landmass that joined Australia and New Guinea, was dozens of kilometres wide. People crossed it, by raft or boat, at least 50,000 years ago and possibly earlier. It is among the earliest evidence of deliberate sea crossings. Aboriginal Australians and Papuans are among the oldest continuous cultures on Earth.",
        mapState: { year: -50000, lat: -15, lng: 125, zoom: 2.8 },
        markers: [
          { label: "Madjedbebe: one of the oldest Australian sites", at: [132.9, -12.5] },
          { label: "Lake Mungo, c. 40,000+ years ago", at: [143, -33.7] },
        ],
        routes: [
          { label: "From Sunda to Sahul by sea", kind: "voyage", path: [[105, 0], [115, -5], [121, -9], [127, -11], [132, -12.5]] },
          { label: "Across Australia", kind: "migration", path: [[132.9, -12.5], [136, -20], [140, -28], [143, -33.7]] },
        ],
      },
      {
        title: "Into Neanderthal Europe",
        text: "Modern humans entered Europe around 45,000 years ago, through the Balkans and along the Danube. Europe already had people: the Neanderthals, who had lived there for hundreds of thousands of years. The two met and interbred; most people of non-African descent carry about 2% Neanderthal DNA. Within a few thousand years, the Neanderthals had disappeared.",
        mapState: { year: -45000, lat: 46, lng: 18, zoom: 3.6 },
        highlight: ["Neanderthal"],
        markers: [{ label: "Bacho Kiro cave, c. 45,000 years ago", at: [25.43, 42.95] }],
        routes: [
          { label: "Into Europe along the Danube", kind: "migration", path: [[36, 34], [32, 39], [27, 41.5], [25.4, 43], [21, 45], [16.5, 48], [10, 48.5], [3, 47]] },
        ],
      },
      {
        title: "Siberia and the Arctic",
        text: "People also moved north and east across Asia. A thigh bone from Ust'-Ishim in western Siberia, about 45,000 years old, carries some of the oldest modern human DNA ever read. By about 32,000 years ago hunters were living at Yana, far inside the Arctic Circle, hunting mammoth.",
        mapState: { year: -32000, lat: 58, lng: 100, zoom: 2.6 },
        markers: [
          { label: "Ust'-Ishim, c. 45,000 years ago", at: [71.2, 57.7] },
          { label: "Yana, c. 32,000 years ago", at: [135.4, 70.7] },
        ],
        routes: [
          { label: "North across Asia", kind: "migration", path: [[60, 38], [65, 48], [71.2, 57.7], [95, 60], [120, 66], [135.4, 70.7]] },
        ],
      },
      {
        title: "Across Beringia to the Americas",
        text: "During the last Ice Age, a land bridge, Beringia, joined Siberia and Alaska. People crossed it into the Americas, though exactly when is still debated. Human footprints at White Sands in New Mexico have been dated to about 21,000–23,000 years ago, and the site of Monte Verde in southern Chile was occupied about 14,500 years ago. Within a few thousand years, people had reached the tip of South America.",
        mapState: { year: -20000, lat: 30, lng: -120, zoom: 1.6 },
        markers: [
          { label: "White Sands footprints, c. 21,000–23,000 years ago", at: [-106.3, 32.8] },
          { label: "Monte Verde, c. 14,500 years ago", at: [-73.2, -41.5] },
        ],
        routes: [
          { label: "Across the Bering land bridge", kind: "migration", path: [[-200, 65], [-190, 65.5], [-180, 66], [-168, 65.5], [-160, 63]] },
          { label: "Down the Pacific coast and inland", kind: "migration", path: [[-160, 61], [-140, 58], [-128, 50], [-120, 40], [-106.3, 32.8]] },
          { label: "To South America", kind: "migration", path: [[-106, 30], [-95, 17], [-80, 8], [-78, -5], [-72, -25], [-73.2, -41.5]] },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────── Polynesian voyagers
  {
    slug: "polynesian-voyagers",
    title: "The Polynesian Voyagers",
    description:
      "How seafarers from Taiwan and the islands of Southeast Asia, sailing without instruments, settled the vast Pacific, from Tonga to Hawai'i, Rapa Nui and New Zealand, and even reached South America.",
    duration: 7,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Out of Taiwan",
        text: "The Polynesians' story begins with the Austronesians, rice-farming peoples who lived on Taiwan more than 5,000 years ago. From around 2200 BCE they spread south by canoe into the Philippines and Indonesia. Today Austronesian languages, from Malagasy to Hawaiian, are spoken across more than half the globe's longitude.",
        mapState: { year: -2000, lat: 10, lng: 125, zoom: 3.2 },
        highlight: ["Austronesians"],
        markers: [{ label: "Taiwan: Austronesian homeland", at: [121, 23.7] }],
        routes: [
          { label: "South into the Philippines and Indonesia, from c. 2200 BCE", kind: "voyage", path: [[121, 23], [121.5, 18], [122, 12], [124, 7], [125, 2], [121, -3]] },
        ],
      },
      {
        title: "The Lapita People",
        text: "Around 1500–1300 BCE, a culture known for its finely stamped pottery, Lapita, appeared in the Bismarck Archipelago off New Guinea. Its people were expert sailors. In just a few centuries they sailed out into the open Pacific, beyond sight of land, settling Vanuatu, New Caledonia and Fiji, and reaching Tonga and Samoa by around 850–800 BCE.",
        mapState: { year: -1000, lat: -12, lng: 165, zoom: 3.4 },
        highlight: ["Austronesians"],
        markers: [
          { label: "Bismarck Archipelago: Lapita begins", at: [150.5, -3.5] },
          { label: "Tonga, c. 850 BCE", at: [184.8, -21.1] },
          { label: "Samoa", at: [187.7, -13.8] },
        ],
        routes: [
          { label: "Lapita voyagers, c. 1300–800 BCE", kind: "voyage", path: [[150.5, -3.5], [158, -9], [166, -15], [167, -20], [178, -17.5], [184.8, -21.1]] },
          { label: "On to Samoa", kind: "voyage", path: [[178, -17], [183, -15], [187.7, -13.8]] },
        ],
      },
      {
        title: "The Long Pause",
        text: "Then the voyaging stopped. For well over a thousand years, the settlers of Tonga and Samoa stayed in what is now West Polynesia, and there the distinctive Polynesian culture and languages developed. Why they waited so long before going further east is still debated: the islands beyond were much more widely scattered, and the prevailing winds blew against them.",
        mapState: { year: 400, lat: -17, lng: 185, zoom: 4 },
        markers: [
          { label: "Tonga", at: [184.8, -21.1] },
          { label: "Samoa", at: [187.7, -13.8] },
        ],
      },
      {
        title: "The Great Expansion East",
        text: "Around 1000 CE, Polynesians set out again, in large double-hulled canoes carrying people, plants and animals. Radiocarbon dating suggests the islands of East Polynesia, the Society Islands around Tahiti, the Cook Islands and the Marquesas, were settled within a century or two, from about 1000–1100. Navigators read the stars, the swells, the clouds and the flight of birds.",
        mapState: { year: 1000, lat: -15, lng: 200, zoom: 3.3 },
        highlight: ["Polynesians"],
        markers: [
          { label: "Tahiti, Society Islands", at: [210.6, -17.6] },
          { label: "Marquesas", at: [220, -9] },
        ],
        routes: [
          { label: "Samoa to the Society Islands", kind: "voyage", path: [[187.7, -13.8], [195, -16], [202, -18.5], [210.6, -17.6]] },
          { label: "To the Marquesas", kind: "voyage", path: [[210.6, -17.6], [215, -13], [220, -9]] },
        ],
      },
      {
        title: "Hawai'i, Rapa Nui and Aotearoa",
        text: "From central East Polynesia, voyagers reached the corners of the 'Polynesian triangle': Hawai'i in the north, by around 1200; Rapa Nui (Easter Island) in the east, around 1200; and Aotearoa New Zealand in the southwest, around 1250–1300, the last major land mass on Earth to be settled. Its settlers became the Māori.",
        mapState: { year: 1300, lat: -12, lng: 205, zoom: 2.4 },
        highlight: ["Polynesians", "Maori"],
        markers: [
          { label: "Hawai'i", at: [204.5, 19.6] },
          { label: "Rapa Nui (Easter Island)", at: [250.6, -27.1] },
          { label: "Aotearoa New Zealand", at: [174.8, -39.5] },
        ],
        routes: [
          { label: "North to Hawai'i", kind: "voyage", path: [[220, -9], [215, 2], [208, 12], [204.5, 19.6]] },
          { label: "East to Rapa Nui", kind: "voyage", path: [[220, -9], [228, -16], [236, -22], [250.6, -27.1]] },
          { label: "Southwest to Aotearoa", kind: "voyage", path: [[210.6, -17.6], [200, -25], [188, -33], [176, -37]] },
        ],
      },
      {
        title: "Reaching the Americas",
        text: "Did Polynesians reach the Americas? The sweet potato, a South American plant, was being grown across Polynesia long before Europeans arrived. In 2020, a genetic study found Native American ancestry in people from several eastern Polynesian islands, from a contact around 1200 CE, most likely with people from the coast of what is now Colombia or Ecuador.",
        mapState: { year: 1300, lat: -12, lng: 245, zoom: 2.4 },
        markers: [{ label: "Pacific coast of South America", at: [282, 3] }],
        routes: [{ label: "Contact with South America, c. 1200", kind: "voyage", path: [[220, -9], [240, -6], [260, -2], [281, 2]] }],
      },
      {
        title: "Westward to Madagascar",
        text: "Austronesians also sailed west, across the Indian Ocean. The language of Madagascar, Malagasy, is most closely related to languages of southern Borneo, and genetic studies show that Madagascar's people descend from both Austronesian and East African ancestors. The island was settled from about the middle of the first millennium CE.",
        mapState: { year: 600, lat: -8, lng: 80, zoom: 2.3 },
        markers: [
          { label: "Southern Borneo", at: [114.5, -2.5] },
          { label: "Madagascar", at: [46.9, -19] },
        ],
        routes: [{ label: "Across the Indian Ocean to Madagascar", kind: "voyage", path: [[114.5, -3], [105, -7], [90, -9], [70, -11], [55, -14], [48.5, -16]] }],
      },
    ],
  },

  // ──────────────────────────────────────────────────── Bantu expansion
  {
    slug: "bantu-expansion",
    title: "The Bantu Expansion",
    description:
      "How farming peoples from what is now the Cameroon–Nigeria borderland spread across half a continent over three thousand years, carrying their languages, crops and later iron-working to East and Southern Africa.",
    duration: 6,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "A Homeland in West-Central Africa",
        text: "About 500 languages spoken across central, eastern and southern Africa, from Swahili and Lingala to Shona and Zulu, belong to one family: Bantu. Linguists trace them to the grasslands of today's Cameroon–Nigeria border region, where farming communities lived more than 4,000 years ago, growing yams and using oil palms.",
        mapState: { year: -2000, lat: 2, lng: 15, zoom: 3.4 },
        markers: [{ label: "The Bantu homeland: the Cameroon Grassfields", at: [10.5, 6] }],
      },
      {
        title: "Into and Around the Rainforest",
        text: "From about 4,000 years ago, Bantu-speaking farmers moved south and east, along rivers and coasts, into and around the great Central African rainforest. Their spread was slow: generations of farmers clearing new land a short distance from their parents. Many hunter-gatherer peoples of the forest, such as the ancestors of the Baka and Mbuti, already lived there.",
        mapState: { year: -1000, lat: -2, lng: 18, zoom: 3.4 },
        markers: [{ label: "Congo rainforest", at: [21, 0] }],
        routes: [
          { label: "South along the Atlantic coast and rivers", kind: "migration", path: [[10.5, 6], [10, 3], [11, 0], [12.5, -3], [13.5, -6]] },
          { label: "East along the forest's northern edge", kind: "migration", path: [[11, 5.5], [16, 4.5], [22, 3.5], [27, 2.5], [30, 1]] },
        ],
      },
      {
        title: "Iron and the Great Lakes",
        text: "By about 500 BCE, Bantu speakers had reached the Great Lakes region of East Africa. There, the Urewe culture was smelting iron, which made better tools for clearing land and farming. Herding peoples already lived in East Africa, and contact with them brought cattle into Bantu life, along with new crops like sorghum.",
        mapState: { year: -500, lat: -3, lng: 25, zoom: 3.4 },
        markers: [{ label: "Lake Victoria: Urewe iron culture", at: [33, -1] }],
        routes: [{ label: "To the Great Lakes", kind: "migration", path: [[27, 2], [29.5, 0.5], [31.5, -0.5], [33, -1]] }],
      },
      {
        title: "Down the East of Africa",
        text: "From the Great Lakes, an eastern stream of Bantu speakers spread quickly south, through what are now Tanzania, Malawi, Zambia, Zimbabwe and Mozambique. By around 300–500 CE, iron-using farmers had reached KwaZulu-Natal in South Africa. Khoisan hunter-gatherers and herders, who had lived there for millennia, were absorbed or pushed into drier lands; Zulu and Xhosa still use click sounds borrowed from them.",
        mapState: { year: 400, lat: -15, lng: 28, zoom: 3.2 },
        markers: [{ label: "KwaZulu-Natal, by c. 300–500 CE", at: [30.5, -29] }],
        routes: [
          { label: "The eastern stream south", kind: "migration", path: [[33, -2], [35, -7], [34, -13], [32, -18], [31, -23], [30.5, -29]] },
          { label: "The western stream into Angola", kind: "migration", path: [[13.5, -6], [15, -10], [17, -14], [19, -17]] },
        ],
      },
      {
        title: "Kingdoms of the Bantu World",
        text: "Over the next thousand years, Bantu-speaking peoples built kingdoms and trading cities. Great Zimbabwe, whose stone walls still stand, controlled gold trade from the 1100s to the 1400s. On the coast, Swahili city-states such as Kilwa traded gold, ivory and slaves across the Indian Ocean. Today, some 350 million people speak Bantu languages.",
        mapState: { year: 1300, lat: -12, lng: 32, zoom: 3.4 },
        highlight: ["Great Zimbabwe"],
        markers: [
          { label: "Great Zimbabwe", at: [30.93, -20.27] },
          { label: "Kilwa", at: [39.51, -8.96] },
        ],
        routes: [{ label: "Gold to the Swahili coast and the Indian Ocean", kind: "spread", path: [[30.93, -20.27], [34, -20], [35.5, -19.8], [39.5, -9], [45, -2], [55, 10]] }],
      },
    ],
  },

  // ──────────────────────────────────────────────────── Alexander
  {
    slug: "alexander-the-great",
    title: "Alexander the Great",
    description:
      "In eleven years, a young king of Macedon marched from Greece to India, defeated the Persian Empire in three great battles, and founded cities from Egypt to Afghanistan, then died in Babylon at 32.",
    duration: 8,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Macedon and the Persian Giant",
        text: "In 336 BCE, Philip II of Macedon, who had made his kingdom the master of Greece, was assassinated. His son Alexander, aged 20, took the throne and his father's plan: to invade the Achaemenid Persian Empire, the largest empire the world had yet seen, stretching from Egypt and Anatolia to India.",
        mapState: { year: -336, lat: 33, lng: 40, zoom: 2.9 },
        highlight: ["Achaemenid Empire"],
        markers: [{ label: "Pella, capital of Macedon", at: [22.52, 40.76] }],
      },
      {
        title: "The Granicus: 334 BCE",
        text: "In spring 334 BCE, Alexander crossed the Hellespont into Asia with about 40,000 men. At the Granicus River he defeated the Persian satraps' army, nearly losing his life in the fighting. He went on to free, or take, the Greek cities of the Anatolian coast.",
        mapState: { year: -334, lat: 39.5, lng: 28, zoom: 5 },
        markers: [{ label: "Granicus, 334 BCE", at: [27.25, 40.2], kind: "battle" }],
        routes: [{ label: "Across the Hellespont", kind: "conquest", path: [[22.5, 40.8], [24.5, 40.9], [26.4, 40.3], [27.2, 40.2]] }],
      },
      {
        title: "Issus: 333 BCE",
        text: "King Darius III himself led a huge army to meet Alexander, at Issus, where Anatolia meets Syria. Alexander's cavalry charge broke the Persian line; Darius fled, leaving behind his mother, wife and daughters, whom Alexander treated with respect.",
        mapState: { year: -333, lat: 37.5, lng: 32, zoom: 5 },
        markers: [{ label: "Issus, 333 BCE", at: [36.2, 36.85], kind: "battle" }],
        routes: [{ label: "Through Anatolia", kind: "conquest", path: [[27.2, 40.2], [29, 38.3], [31, 37.5], [32.9, 39.9], [34.7, 37.3], [36.2, 36.85]] }],
      },
      {
        title: "Tyre and Egypt",
        text: "Rather than chase Darius, Alexander took the Mediterranean coast, so the Persian fleet would have no ports. The island city of Tyre held out for seven months; Alexander built a causeway to it and took it in 332. Egypt welcomed him as a liberator from Persian rule. There he founded Alexandria, which became one of the great cities of the ancient world.",
        mapState: { year: -331, lat: 31, lng: 32, zoom: 4.6 },
        markers: [
          { label: "Tyre: seven-month siege, 332 BCE", at: [35.2, 33.27], kind: "battle" },
          { label: "Alexandria, founded 331 BCE", at: [29.92, 31.2] },
          { label: "Siwa: the oracle of Ammon", at: [25.52, 29.2] },
        ],
        routes: [{ label: "Down the coast to Egypt", kind: "conquest", path: [[36.2, 36.85], [35.9, 35], [35.2, 33.3], [34.5, 31.5], [32.3, 31.1], [29.9, 31.2]] }],
      },
      {
        title: "Gaugamela: 331 BCE",
        text: "In 331 BCE Alexander marched into Mesopotamia. At Gaugamela, near today's Mosul, Darius had gathered his last great army, perhaps 50,000 to 100,000 or more. Alexander charged straight at the king, and Darius fled again. Babylon opened its gates. In 330 Alexander burned the palace at Persepolis, and Darius was murdered by one of his own nobles.",
        mapState: { year: -331, lat: 33, lng: 46, zoom: 4.4 },
        markers: [
          { label: "Gaugamela, 331 BCE", at: [43.45, 36.55], kind: "battle" },
          { label: "Babylon", at: [44.42, 32.54] },
          { label: "Persepolis, burned 330 BCE", at: [52.89, 29.93] },
        ],
        routes: [{ label: "Into the heart of Persia", kind: "conquest", path: [[29.9, 31.2], [34, 32], [36.5, 34.5], [38.5, 36], [43.45, 36.55], [44.4, 32.5], [48.3, 32.2], [52.9, 29.9]] }],
      },
      {
        title: "Bactria and Sogdiana",
        text: "The east of the empire, today's Afghanistan, Uzbekistan and Tajikistan, resisted for three hard years of guerrilla war. Alexander founded cities, among them Alexandria Eschate, 'the furthest', on the Jaxartes River, and married Roxana, the daughter of a Bactrian noble.",
        mapState: { year: -328, lat: 37, lng: 66, zoom: 4 },
        markers: [
          { label: "Maracanda (Samarkand)", at: [66.97, 39.65] },
          { label: "Alexandria Eschate (Khujand)", at: [69.6, 40.28] },
        ],
        routes: [{ label: "East through Persia and Bactria", kind: "conquest", path: [[52.9, 29.9], [54, 35], [59.5, 36], [62, 34.3], [65.7, 31.6], [69.2, 34.5], [67, 36.8], [66.97, 39.65], [69.6, 40.3]] }],
      },
      {
        title: "India and the Mutiny",
        text: "In 326 BCE Alexander crossed into the Punjab. At the Hydaspes River he defeated King Porus, whose army included war elephants, and then let him keep his kingdom. But at the Hyphasis River (the Beas), his exhausted soldiers, eight years from home, refused to go further. Alexander had to turn back.",
        mapState: { year: -326, lat: 32, lng: 70, zoom: 4.6 },
        markers: [
          { label: "Hydaspes: battle with Porus, 326 BCE", at: [73.7, 32.95], kind: "battle" },
          { label: "Hyphasis: the army refuses to go on", at: [75.2, 31.5] },
        ],
        routes: [{ label: "Over the Hindu Kush into India", kind: "conquest", path: [[69.2, 34.5], [71.5, 34], [73.7, 33], [75.2, 31.5]] }],
      },
      {
        title: "Death in Babylon: 323 BCE",
        text: "Alexander sailed down the Indus, then led part of his army back through the Gedrosian desert in southern Iran, a march in which thousands died. His admiral Nearchus brought the fleet along the coast. In June 323 BCE, in Babylon, Alexander fell ill and died, aged 32. His generals fought over his empire for decades and carved it into kingdoms, among them the Seleucids in Asia and the Ptolemies in Egypt.",
        mapState: { year: -323, lat: 31, lng: 55, zoom: 3.6 },
        highlight: ["Empire of Alexander"],
        markers: [{ label: "Babylon: Alexander dies, June 323 BCE", at: [44.42, 32.54] }],
        routes: [
          { label: "Through the Gedrosian desert, 325 BCE", kind: "retreat", path: [[75, 31.5], [71.5, 29], [68.3, 25.4], [64, 25.8], [60, 27], [56.5, 27.5], [52.9, 29.9], [48.3, 32.2], [44.4, 32.5]] },
          { label: "Nearchus' fleet along the coast", kind: "voyage", path: [[67.5, 24.5], [62, 25], [57, 25.6], [56.2, 26.6], [52, 27.5], [48.5, 29.8]] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────── Hannibal
  {
    slug: "hannibal-and-the-punic-wars",
    title: "Hannibal and the Punic Wars",
    description:
      "Rome against Carthage for control of the Mediterranean: Hannibal's march over the Alps with elephants, his crushing victory at Cannae, and how Rome fought back, won at Zama and finally destroyed Carthage.",
    duration: 7,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Two Powers, One Sea",
        text: "By the 260s BCE, Rome ruled most of Italy, and Carthage, a city founded by Phoenicians in what is now Tunisia, ruled a trading empire across the western Mediterranean. They first fought over Sicily, in the First Punic War (264–241 BCE). Rome built its first real navy and won. Carthage then built a new power base in Spain, rich in silver.",
        mapState: { year: -264, lat: 39, lng: 8, zoom: 4 },
        highlight: ["Carthaginian Empire", "Roman Republic"],
        markers: [
          { label: "Carthage", at: [10.32, 36.85] },
          { label: "Rome", at: [12.5, 41.9] },
          { label: "Carthago Nova (Cartagena), founded c. 227 BCE", at: [-0.99, 37.6] },
        ],
      },
      {
        title: "Over the Alps: 218 BCE",
        text: "In 218 BCE Hannibal, Carthage's general in Spain, did what no one expected. He led an army of perhaps 50,000 men, with cavalry and 37 war elephants, from Spain over the Pyrenees, across the Rhône, and over the Alps in autumn snow. Which pass he used is still debated. He reached northern Italy with only about 26,000 men left, but with Gaulish allies ready to join him.",
        mapState: { year: -218, lat: 43, lng: 4, zoom: 4.6 },
        markers: [{ label: "Saguntum: the siege that started the war, 219 BCE", at: [-0.27, 39.68], kind: "battle" }],
        routes: [{ label: "Hannibal's march, 218 BCE", kind: "conquest", path: [[-0.99, 37.6], [-0.3, 39.7], [0.8, 41.1], [2.5, 42.4], [3.3, 43.3], [4.6, 43.9], [5.5, 45], [6.8, 45.2], [7.7, 45.1], [9.6, 45]] }],
      },
      {
        title: "Trebia, Trasimene, Cannae",
        text: "In three battles Hannibal destroyed three Roman armies: at the Trebia in December 218, at Lake Trasimene in 217, where he ambushed the Romans in the morning mist, and at Cannae in 216. At Cannae his outnumbered army let the Roman centre push forward, then closed around it from both sides. Some 50,000 or more Romans were killed in a single day.",
        mapState: { year: -216, lat: 43, lng: 12.5, zoom: 5 },
        markers: [
          { label: "Trebia, 218 BCE", at: [9.6, 45], kind: "battle" },
          { label: "Lake Trasimene, 217 BCE", at: [12.1, 43.18], kind: "battle" },
          { label: "Cannae, 216 BCE", at: [16.13, 41.3], kind: "battle" },
        ],
        routes: [{ label: "Hannibal in Italy, 218–216 BCE", kind: "conquest", path: [[9.6, 45], [10.5, 44.3], [11.3, 43.8], [12.1, 43.2], [13.8, 42.4], [15.5, 41.6], [16.13, 41.3]] }],
      },
      {
        title: "Rome Refuses to Lose",
        text: "Rome would not make peace. It avoided pitched battles with Hannibal, who stayed in Italy for fifteen years without the siege equipment or reinforcements to take Rome. Instead, the young Publius Cornelius Scipio struck at Spain, taking Carthago Nova in 209 BCE. When Hannibal's brother Hasdrubal crossed the Alps with a relief army, the Romans destroyed it at the Metaurus River in 207.",
        mapState: { year: -207, lat: 41, lng: 5, zoom: 4.2 },
        markers: [
          { label: "Carthago Nova taken by Scipio, 209 BCE", at: [-0.99, 37.6], kind: "battle" },
          { label: "Metaurus, 207 BCE", at: [12.98, 43.7], kind: "battle" },
        ],
        routes: [
          { label: "Scipio's invasion of Spain", kind: "conquest", path: [[12.3, 41.7], [8.5, 43.2], [3.2, 42.5], [0.8, 41.1], [-1, 37.7]] },
          { label: "Hasdrubal's relief army, 207 BCE", kind: "conquest", path: [[-1, 40], [2.5, 42.4], [4.8, 44.5], [7, 45.4], [10, 45], [12.98, 43.7]] },
        ],
      },
      {
        title: "Zama: 202 BCE",
        text: "In 204 BCE Scipio invaded Africa. Carthage recalled Hannibal to defend the city. At Zama in 202 BCE, Scipio's infantry opened lanes to let Hannibal's elephants charge harmlessly through, and his Numidian cavalry, now Rome's allies, won the day. Carthage surrendered its fleet and its empire outside Africa. Scipio took the name Africanus.",
        mapState: { year: -202, lat: 38.5, lng: 12, zoom: 4.6 },
        markers: [{ label: "Zama, 202 BCE", at: [9.3, 36.1], kind: "battle" }],
        routes: [
          { label: "Scipio invades Africa, 204 BCE", kind: "conquest", path: [[15.1, 37.1], [12.5, 37.3], [11, 37], [10.1, 37]] },
          { label: "Hannibal recalled from Italy, 203 BCE", kind: "retreat", path: [[16.5, 39], [15, 37.5], [12.5, 36.5], [10.6, 35.8]] },
        ],
      },
      {
        title: "Carthage Must Be Destroyed",
        text: "Carthage recovered its wealth, and in Rome the senator Cato ended his speeches with 'Carthage must be destroyed'. In the Third Punic War, Rome besieged the city for three years and in 146 BCE razed it, enslaving its survivors. The same year Rome destroyed Corinth in Greece. The Mediterranean was becoming a Roman lake.",
        mapState: { year: -146, lat: 38, lng: 14, zoom: 3.6 },
        highlight: ["Rome"],
        markers: [
          { label: "Carthage destroyed, 146 BCE", at: [10.32, 36.85], kind: "battle" },
          { label: "Corinth destroyed, 146 BCE", at: [22.93, 37.94], kind: "battle" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────── Huns and migrations
  {
    slug: "huns-and-the-great-migrations",
    title: "The Huns and the Great Migrations",
    description:
      "How the arrival of the Huns set Goths, Vandals and other peoples moving into the Roman Empire, and how in a century of invasions, sacks and new kingdoms, the Western Roman Empire came to an end.",
    duration: 8,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "The Huns Arrive: c. 370",
        text: "Around 370 CE, the Huns, nomadic horse-archers from the steppe of Central Asia, crossed the Volga. Their origins are uncertain. They defeated the Alans and then the Gothic kingdoms north of the Black Sea. Terrified refugees fled west towards the Roman frontier on the Danube.",
        mapState: { year: 375, mapYear: 400, lat: 47, lng: 38, zoom: 3.6 },
        highlight: ["Hunnic Empire"],
        routes: [{ label: "The Huns move west, c. 370", kind: "conquest", path: [[60, 48], [52, 48.5], [46, 48], [40, 47.5], [34, 47]] }],
      },
      {
        title: "Adrianople: 378",
        text: "In 376, the Roman emperor Valens allowed tens of thousands of Goths, the Tervingi, to cross the Danube and settle in the empire. Roman officials mistreated and starved them, and they rebelled. In 378, at Adrianople, the Goths destroyed the eastern Roman field army. Valens himself was killed. It was the worst Roman defeat in centuries.",
        mapState: { year: 378, mapYear: 400, lat: 43.5, lng: 27, zoom: 5 },
        markers: [{ label: "Adrianople, 378", at: [26.56, 41.68], kind: "battle" }],
        routes: [{ label: "The Goths cross the Danube, 376", kind: "migration", path: [[30, 47], [29, 46], [28.2, 44.7], [27.5, 43], [26.6, 41.7]] }],
      },
      {
        title: "Across the Rhine: 406",
        text: "On the last day of 406, a great mass of Vandals, Alans and Suebi crossed the Rhine, probably near Mainz, into Roman Gaul. They plundered their way across it and in 409 crossed into Spain. In 429, the Vandals crossed again, into North Africa, and in 439 took Carthage, Rome's richest province.",
        mapState: { year: 429, mapYear: 500, lat: 42, lng: 3, zoom: 3.8 },
        highlight: ["Vandals"],
        markers: [
          { label: "Mainz: across the Rhine, 406", at: [8.27, 50] },
          { label: "Carthage, taken 439", at: [10.32, 36.85] },
        ],
        routes: [{ label: "Vandals, Alans and Suebi: Rhine to Africa, 406–439", kind: "migration", path: [[8.3, 50], [4.5, 49], [1, 46.5], [-1, 43.5], [-3.5, 40.5], [-5.4, 36.2], [-2, 35.3], [3, 36.7], [10.3, 36.85]] }],
      },
      {
        title: "Rome Sacked: 410",
        text: "The Visigoths, led by Alaric, marched into Italy. In 410 they sacked Rome itself, the first time in 800 years that a foreign enemy had taken the city. The shock echoed across the Roman world. The Visigoths moved on to southern Gaul and Spain, where they built a kingdom with its capital at Toulouse, and later Toledo.",
        mapState: { year: 410, mapYear: 500, lat: 43, lng: 8, zoom: 4.2 },
        highlight: ["Visigoths"],
        markers: [{ label: "Rome, sacked 410", at: [12.5, 41.9], kind: "battle" }],
        routes: [
          { label: "Alaric's Visigoths to Rome, 401–410", kind: "migration", path: [[21, 42], [17, 44.5], [13.5, 45.7], [11.3, 44.5], [12.5, 41.9]] },
          { label: "To Gaul and Spain, 412–418", kind: "migration", path: [[12.3, 42.5], [9.5, 44.2], [6, 43.5], [1.44, 43.6], [-1, 41.5]] },
        ],
      },
      {
        title: "Attila: 451–452",
        text: "Under Attila, from 434 to 453, the Huns ruled a vast empire from the Rhine to the steppe and extorted huge tributes from Constantinople. In 451 Attila invaded Gaul. At the Catalaunian Plains, a Roman and Visigothic army under the general Aëtius fought him to a standstill. The next year Attila ravaged northern Italy instead. He died in 453, and his empire fell apart within a few years.",
        mapState: { year: 451, mapYear: 400, lat: 47.5, lng: 10, zoom: 4.2 },
        highlight: ["Hunnic Empire"],
        markers: [
          { label: "Catalaunian Plains, 451", at: [4.3, 48.9], kind: "battle" },
          { label: "Aquileia, destroyed 452", at: [13.37, 45.77], kind: "battle" },
        ],
        routes: [
          { label: "Attila invades Gaul, 451", kind: "conquest", path: [[19, 47.5], [14, 48.2], [9, 49], [6, 49.1], [4.3, 48.9]] },
          { label: "Attila invades Italy, 452", kind: "conquest", path: [[19, 47], [16, 46.4], [13.4, 45.8], [11.9, 45.4], [9.2, 45.5]] },
        ],
      },
      {
        title: "The Last Emperor in the West: 476",
        text: "The Vandals sacked Rome again in 455. In 476 Odoacer, a Germanic commander in the Roman army, deposed the boy emperor Romulus Augustulus and did not bother to name a successor. Historians traditionally mark this as the end of the Western Roman Empire. The Eastern empire, ruled from Constantinople, carried on for nearly a thousand years.",
        mapState: { year: 476, mapYear: 500, lat: 44, lng: 12, zoom: 3.8 },
        markers: [{ label: "Ravenna: Romulus Augustulus deposed, 476", at: [12.2, 44.42] }],
        routes: [{ label: "The Vandal fleet sacks Rome, 455", kind: "raid", path: [[10.3, 36.9], [10.8, 39], [11.6, 41], [12.5, 41.9]] }],
      },
      {
        title: "New Kingdoms",
        text: "In Rome's place rose new kingdoms. The Ostrogoths under Theodoric took Italy in 493. The Franks, under Clovis, conquered most of Gaul, beating the Visigoths at Vouillé in 507; their kingdom would become France. Angles, Saxons and Jutes settled in Britain after the Roman legions left. In 568, the Lombards entered Italy, the last great movement of the migration age.",
        mapState: { year: 568, mapYear: 600, lat: 47, lng: 6, zoom: 3.6 },
        highlight: ["Frankish Kingdom", "Visigothic Kingdom", "Lombard principalities"],
        markers: [{ label: "Vouillé, 507", at: [0.17, 46.64], kind: "battle" }],
        routes: [
          { label: "Angles, Saxons and Jutes to Britain, 5th century", kind: "migration", path: [[9, 55.5], [6, 54.2], [2.5, 53], [0.5, 52.6]] },
          { label: "The Lombards enter Italy, 568", kind: "migration", path: [[18, 47.5], [15.5, 46.4], [13.4, 45.8], [11, 45.4]] },
          { label: "The Ostrogoths take Italy, 489–493", kind: "migration", path: [[22, 45.5], [17, 46], [13.5, 45.8], [12.2, 44.4]] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────── Crusades
  {
    slug: "the-crusades",
    title: "The Crusades",
    description:
      "Two centuries of holy wars: from the Pope's call at Clermont and the bloody capture of Jerusalem in 1099, through Saladin and Richard the Lionheart, to the sack of Constantinople by fellow Christians and the fall of Acre in 1291.",
    duration: 8,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "The Call at Clermont: 1095",
        text: "In 1095 the Byzantine emperor Alexios I asked the West for help against the Seljuk Turks, who had taken most of Anatolia. At Clermont, in France, Pope Urban II answered with a call to free Jerusalem, promising those who went that their sins would be forgiven. The response was overwhelming, from knights and from ordinary people.",
        mapState: { year: 1095, mapYear: 1100, lat: 42, lng: 18, zoom: 3.3 },
        highlight: ["Seljuk Empire"],
        markers: [
          { label: "Clermont: Urban II's sermon, 1095", at: [3.08, 45.78] },
          { label: "Jerusalem", at: [35.23, 31.78] },
        ],
      },
      {
        title: "The People's Crusade: 1096",
        text: "Before the knights were ready, tens of thousands of poor pilgrims set out behind the preacher Peter the Hermit. On the way, crusading bands massacred Jewish communities in the Rhineland cities. The pilgrims crossed into Anatolia, where the Turks destroyed them near Civetot in October 1096.",
        mapState: { year: 1096, mapYear: 1100, lat: 45, lng: 18, zoom: 3.8 },
        markers: [
          { label: "Rhineland: massacres of Jews, 1096", at: [7.5, 50] },
          { label: "Civetot: the People's Crusade destroyed", at: [29.3, 40.6], kind: "battle" },
        ],
        routes: [{ label: "Peter the Hermit's march, 1096", kind: "conquest", path: [[6.96, 50.94], [11, 49.5], [16.4, 48.2], [19, 47.5], [20.5, 44.8], [23.3, 42.7], [26.6, 41.7], [29, 41], [29.3, 40.6]] }],
      },
      {
        title: "The First Crusade: 1096–1099",
        text: "The armies of the princes, perhaps 60,000–100,000 people in all, gathered at Constantinople in 1097. They took Nicaea, beat the Turks at Dorylaeum, and after a long, starving siege took Antioch in 1098. On 15 July 1099 they stormed Jerusalem and massacred much of its Muslim and Jewish population. They founded four crusader states along the eastern Mediterranean.",
        mapState: { year: 1099, mapYear: 1100, lat: 37, lng: 30, zoom: 3.8 },
        markers: [
          { label: "Nicaea, 1097", at: [29.72, 40.43], kind: "battle" },
          { label: "Dorylaeum, 1097", at: [30.52, 39.78], kind: "battle" },
          { label: "Antioch, 1098", at: [36.16, 36.2], kind: "battle" },
          { label: "Jerusalem, 15 July 1099", at: [35.23, 31.78], kind: "battle" },
        ],
        routes: [
          { label: "Godfrey of Bouillon overland through Hungary", kind: "conquest", path: [[5.5, 50], [11, 49.4], [16.4, 48.2], [20.5, 44.8], [23.3, 42.7], [26.6, 41.7], [28.9, 41.05]] },
          { label: "Bohemond's Normans from southern Italy", kind: "conquest", path: [[16.9, 41.1], [19.4, 41.3], [22.9, 40.6], [26, 40.9], [28.9, 41]] },
          { label: "The march to Jerusalem, 1097–1099", kind: "conquest", path: [[29, 41], [29.7, 40.4], [30.5, 39.8], [32.5, 37.9], [34.5, 37.4], [36.2, 36.2], [35.8, 34.4], [35.5, 33.3], [35.2, 31.8]] },
        ],
      },
      {
        title: "Saladin and Hattin: 1187",
        text: "The crusader states survived by playing their Muslim neighbours against each other. That ended when Saladin united Egypt and Syria. On 4 July 1187, at the Horns of Hattin near the Sea of Galilee, he destroyed the army of the Kingdom of Jerusalem, and in October he took Jerusalem itself, this time letting most of its inhabitants buy their freedom.",
        mapState: { year: 1187, mapYear: 1200, lat: 32.5, lng: 35, zoom: 5.6 },
        markers: [
          { label: "Hattin, 4 July 1187", at: [35.45, 32.8], kind: "battle" },
          { label: "Jerusalem retaken, October 1187", at: [35.23, 31.78] },
        ],
        routes: [{ label: "Saladin's armies from Egypt and Syria", kind: "conquest", path: [[36.3, 33.5], [35.8, 33], [35.45, 32.8]] }],
      },
      {
        title: "The Third Crusade: Kings Against Saladin",
        text: "Europe's three greatest rulers set out to retake Jerusalem. The German emperor Frederick Barbarossa drowned crossing a river in Anatolia in 1190, and most of his army went home. Richard the Lionheart of England and Philip II of France came by sea. Together they took Acre in 1191, and Richard beat Saladin at Arsuf, but never retook Jerusalem. A truce in 1192 let Christian pilgrims visit it.",
        mapState: { year: 1191, mapYear: 1200, lat: 38, lng: 22, zoom: 3.4 },
        markers: [
          { label: "Barbarossa drowns in the Saleph, 1190", at: [33.9, 36.35] },
          { label: "Acre, 1191", at: [35.07, 32.93], kind: "battle" },
          { label: "Arsuf, 1191", at: [34.82, 32.2], kind: "battle" },
        ],
        routes: [
          { label: "Barbarossa overland, 1189–1190", kind: "conquest", path: [[11, 49], [16.4, 48.2], [20.5, 44.8], [23.3, 42.7], [26.6, 41.7], [28, 40], [30, 38.5], [32.5, 37.9], [33.9, 36.4]] },
          { label: "Richard by sea, via Sicily and Cyprus, 1190–1191", kind: "voyage", path: [[5.37, 43.3], [8, 41.5], [12, 39.5], [15.55, 38.2], [21, 36.5], [27, 35.5], [33.4, 35], [35.07, 32.93]] },
        ],
      },
      {
        title: "The Fourth Crusade Sacks Constantinople: 1204",
        text: "The Fourth Crusade never reached the Holy Land. Owing Venice money for its fleet, it first attacked the Christian city of Zara on the Adriatic, then sailed to Constantinople to install a claimant to the Byzantine throne. When he could not pay, in April 1204, the crusaders stormed and sacked the greatest Christian city in the world. The Byzantine Empire never fully recovered.",
        mapState: { year: 1204, mapYear: 1200, lat: 40, lng: 21, zoom: 4.3 },
        highlight: ["Byzantine Empire"],
        markers: [
          { label: "Zara, 1202", at: [15.23, 44.12], kind: "battle" },
          { label: "Constantinople sacked, April 1204", at: [28.97, 41.01], kind: "battle" },
        ],
        routes: [{ label: "The Venetian fleet, 1202–1204", kind: "voyage", path: [[12.34, 45.44], [13.5, 44.6], [15.2, 44.1], [17.5, 42.5], [19.5, 40], [21, 37.5], [23.5, 36.5], [25.5, 39], [26.4, 40.2], [28.97, 41.01]] }],
      },
      {
        title: "The Fall of Acre: 1291",
        text: "More crusades followed, to Egypt and Tunis, with little success; Emperor Frederick II briefly regained Jerusalem by treaty in 1229. In Egypt, the Mamluks, a dynasty of former slave soldiers, took power and steadily took the remaining crusader cities. In 1291 they captured Acre, the last major crusader stronghold. The crusades to the Holy Land were over.",
        mapState: { year: 1291, mapYear: 1279, lat: 32, lng: 33, zoom: 4.3 },
        highlight: ["Mamluke Sultanate"],
        markers: [{ label: "Acre falls, 1291", at: [35.07, 32.93], kind: "battle" }],
      },
    ],
  },

  // ──────────────────────────────────────────────────────── Ottomans
  {
    slug: "ottoman-advance",
    title: "The Ottoman Advance: From Anatolia to the Gates of Vienna",
    description:
      "How a small Turkish emirate in Anatolia took Constantinople, conquered the Balkans, Hungary, Egypt and Arabia, besieged Vienna twice, and was finally pushed back after 1683.",
    duration: 8,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Osman's Emirate",
        text: "Around 1300, Anatolia was divided among small Turkish emirates. One of them, led by Osman, lay on the frontier with the Byzantine Empire, close to Constantinople. His followers took the Byzantine city of Bursa in 1326 and made it their capital. The dynasty took his name: the Osmanlı, or Ottomans.",
        mapState: { year: 1326, lat: 40, lng: 30, zoom: 5.4 },
        highlight: ["Byzantine Empire"],
        markers: [{ label: "Bursa, taken 1326", at: [29.06, 40.19] }],
      },
      {
        title: "Into Europe",
        text: "In 1354 the Ottomans took Gallipoli, their first foothold in Europe. Within a few decades they held much of Thrace and moved their capital to Edirne (Adrianople). At Kosovo in 1389 they defeated a Serbian-led coalition, though Sultan Murad I was killed. In 1396 they crushed a crusade of French and Hungarian knights at Nicopolis.",
        mapState: { year: 1396, mapYear: 1400, lat: 42, lng: 25, zoom: 5 },
        highlight: ["Ottoman Empire"],
        markers: [
          { label: "Gallipoli, 1354", at: [26.67, 40.41] },
          { label: "Kosovo, 1389", at: [21.1, 42.73], kind: "battle" },
          { label: "Nicopolis, 1396", at: [24.9, 43.7], kind: "battle" },
        ],
        routes: [
          { label: "Across the Dardanelles, 1354", kind: "conquest", path: [[29.06, 40.19], [27.5, 40.3], [26.67, 40.41], [26.56, 41.68]] },
          { label: "Into the Balkans", kind: "conquest", path: [[26.56, 41.68], [24.75, 42.15], [23.3, 42.7], [21.1, 42.73]] },
        ],
      },
      {
        title: "Timur, and the Fall of Constantinople: 1453",
        text: "Disaster struck in 1402, when the Central Asian conqueror Timur crushed the Ottomans at Ankara and captured Sultan Bayezid I. The state nearly collapsed but recovered. In 1453 the 21-year-old Sultan Mehmed II besieged Constantinople with giant cannons. On 29 May the walls were breached, and the last Byzantine emperor died in the fighting. Constantinople, Istanbul, became the Ottoman capital.",
        mapState: { year: 1453, lat: 40, lng: 30, zoom: 4.8 },
        highlight: ["Ottoman Empire"],
        markers: [
          { label: "Ankara: Timur defeats Bayezid, 1402", at: [32.85, 39.93], kind: "battle" },
          { label: "Constantinople falls, 29 May 1453", at: [28.97, 41.01], kind: "battle" },
        ],
        routes: [{ label: "Mehmed II's army, 1453", kind: "conquest", path: [[26.56, 41.68], [27.5, 41.3], [28.6, 41.05], [28.95, 41.02]] }],
      },
      {
        title: "Egypt and Arabia: 1516–1517",
        text: "Selim I turned south. In 1516 he defeated the Mamluk sultan at Marj Dabiq in Syria, and in 1517 took Cairo. Syria, Egypt and the holy cities of Mecca and Medina came under Ottoman rule, and the sultans became the leading rulers of the Islamic world.",
        mapState: { year: 1517, mapYear: 1530, lat: 30, lng: 36, zoom: 3.8 },
        highlight: ["Ottoman Empire"],
        markers: [
          { label: "Marj Dabiq, 1516", at: [37.4, 36.5], kind: "battle" },
          { label: "Cairo, 1517", at: [31.24, 30.04], kind: "battle" },
          { label: "Mecca", at: [39.83, 21.42] },
        ],
        routes: [{ label: "Selim I against the Mamluks", kind: "conquest", path: [[32.9, 39.9], [36, 37.5], [37.4, 36.5], [36.3, 33.5], [34.5, 31.5], [32.3, 30.6], [31.24, 30.04]] }],
      },
      {
        title: "Mohács and Vienna: 1526–1529",
        text: "Suleiman the Magnificent took Belgrade in 1521 and Rhodes in 1522. In 1526, at Mohács, his army destroyed the Hungarian army; King Louis II drowned while fleeing. Hungary was split, and Buda later became an Ottoman city for 145 years. In 1529 Suleiman besieged Vienna, but cold, rain and long supply lines forced him to turn back.",
        mapState: { year: 1529, mapYear: 1500, lat: 46, lng: 19, zoom: 4.8 },
        highlight: ["Ottoman Empire"],
        markers: [
          { label: "Belgrade, 1521", at: [20.46, 44.8], kind: "battle" },
          { label: "Mohács, 1526", at: [18.67, 45.99], kind: "battle" },
          { label: "Vienna besieged, 1529", at: [16.37, 48.21], kind: "battle" },
        ],
        routes: [{ label: "Suleiman's campaigns, 1521–1529", kind: "conquest", path: [[26.56, 41.68], [23.3, 42.7], [20.46, 44.8], [19, 45.5], [18.67, 46], [19.05, 47.5], [17.5, 47.9], [16.4, 48.2]] }],
      },
      {
        title: "Lepanto: 1571",
        text: "At sea, Ottoman fleets dominated the eastern Mediterranean. In 1571 a Holy League of Spain, Venice and the Papacy destroyed most of the Ottoman fleet at Lepanto, off western Greece, the largest naval battle in Europe for centuries. The Ottomans rebuilt their fleet within a year, but their expansion at sea had reached its limit.",
        mapState: { year: 1571, mapYear: 1600, lat: 38, lng: 20, zoom: 4.6 },
        highlight: ["Ottoman Empire"],
        markers: [{ label: "Lepanto, 1571", at: [21.3, 38.25], kind: "battle" }],
        routes: [{ label: "The Holy League fleet from Messina", kind: "voyage", path: [[15.55, 38.2], [17, 38.5], [19.5, 39.3], [20.6, 38.5], [21.1, 38.3]] }],
      },
      {
        title: "Vienna Again: 1683",
        text: "In 1683 Grand Vizier Kara Mustafa besieged Vienna with a huge army. On 12 September, a relief army of Austrian, German and Polish troops, led by King Jan III Sobieski of Poland, attacked from the Kahlenberg hills. Polish winged hussars led one of the largest cavalry charges in history, and the Ottomans broke and fled.",
        mapState: { year: 1683, mapYear: 1650, lat: 47.5, lng: 18, zoom: 5 },
        highlight: ["Ottoman Empire", "Austrian Empire"],
        markers: [{ label: "Vienna, 12 September 1683", at: [16.37, 48.21], kind: "battle" }],
        routes: [
          { label: "Kara Mustafa's army, 1683", kind: "conquest", path: [[20.46, 44.8], [19.05, 47.5], [17.7, 47.7], [16.5, 48.15]] },
          { label: "Sobieski's relief army from Poland", kind: "conquest", path: [[19.94, 50.06], [18.3, 49.8], [17, 49], [16.3, 48.28]] },
        ],
      },
      {
        title: "The Long Retreat",
        text: "The defeat at Vienna began a long war in which the Habsburgs drove the Ottomans out of Hungary; Buda fell in 1686. At the Treaty of Karlowitz in 1699, the Ottomans gave up Hungary and Transylvania. It was the first major loss of territory in the empire's history. Over the next two centuries, the 'sick man of Europe' slowly retreated from the Balkans.",
        mapState: { year: 1699, mapYear: 1700, lat: 45, lng: 22, zoom: 4.2 },
        highlight: ["Ottoman Empire", "Austrian Empire"],
        markers: [
          { label: "Buda retaken, 1686", at: [19.04, 47.5], kind: "battle" },
          { label: "Karlowitz, 1699", at: [19.93, 45.2] },
        ],
        routes: [{ label: "The Habsburgs drive south", kind: "retreat", path: [[16.4, 48.2], [17.6, 47.7], [19.04, 47.5], [19.6, 46], [20.46, 44.8]] }],
      },
    ],
  },

  // ─────────────────────────────────────────────────── Conquistadors
  {
    slug: "conquest-of-the-aztec-and-inca",
    title: "The Fall of the Aztec and Inca Empires",
    description:
      "How a few hundred Spanish soldiers, thousands of Indigenous allies and, above all, epidemic disease brought down the two greatest empires of the Americas, between 1519 and 1533.",
    duration: 7,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Two Great Empires",
        text: "In 1500 the Americas held two great empires. The Aztec Triple Alliance, ruled from the island city of Tenochtitlan, dominated central Mexico; its capital may have held 200,000 people, more than any city in Spain. In the Andes, the Inca Empire, Tawantinsuyu, ran for some 4,000 kilometres, linked by roads and runners, ruled from Cusco.",
        mapState: { year: 1500, lat: 0, lng: -85, zoom: 2.3 },
        highlight: ["Aztec Empire", "Inca Empire"],
        markers: [
          { label: "Tenochtitlan", at: [-99.13, 19.43] },
          { label: "Cusco", at: [-71.97, -13.53] },
        ],
      },
      {
        title: "Cortés Lands: 1519",
        text: "In 1519 Hernán Cortés sailed from Cuba with about 500 men. He landed on the Gulf coast of Mexico, founded Veracruz and scuttled his ships so no one could turn back. On his way inland he made allies of the Tlaxcalans, bitter enemies of the Aztecs, who supplied thousands of warriors. In November 1519 the emperor Moctezuma welcomed the Spanish into Tenochtitlan.",
        mapState: { year: 1519, mapYear: 1500, lat: 20, lng: -92, zoom: 4.6 },
        highlight: ["Aztec Empire"],
        markers: [
          { label: "Veracruz, 1519", at: [-96.4, 19.6] },
          { label: "Tlaxcala: allies against the Aztecs", at: [-98.24, 19.32] },
          { label: "Tenochtitlan, November 1519", at: [-99.13, 19.43] },
        ],
        routes: [{ label: "Cortés from Cuba to Tenochtitlan", kind: "conquest", path: [[-82.4, 23.1], [-85.5, 21.5], [-87, 20.5], [-91, 19], [-96.4, 19.6], [-97.5, 19.4], [-98.24, 19.32], [-98.3, 19.06], [-99.13, 19.43]] }],
      },
      {
        title: "Smallpox and the Fall of Tenochtitlan: 1521",
        text: "Cortés took Moctezuma hostage, but in 1520 the city rose, Moctezuma was killed, and the Spanish fled with heavy losses on the 'Noche Triste'. Then smallpox, brought by the Spanish, swept the Aztec world, killing a huge share of the population, including the new emperor. In 1521 Cortés and tens of thousands of allies besieged Tenochtitlan. It fell on 13 August 1521, its people starving and sick.",
        mapState: { year: 1521, mapYear: 1500, lat: 19.4, lng: -98.8, zoom: 7 },
        markers: [{ label: "Tenochtitlan falls, 13 August 1521", at: [-99.13, 19.43], kind: "battle" }],
        routes: [
          { label: "The retreat of the Noche Triste, 1520", kind: "retreat", path: [[-99.13, 19.43], [-99.2, 19.6], [-98.9, 19.75], [-98.5, 19.6], [-98.24, 19.32]] },
          { label: "Return to besiege the city, 1521", kind: "conquest", path: [[-98.24, 19.32], [-98.6, 19.5], [-98.9, 19.5], [-99.1, 19.44]] },
        ],
      },
      {
        title: "Pizarro and the Inca: 1532",
        text: "In the Andes, smallpox arrived ahead of the Spanish, probably killing the Inca emperor Huayna Capac and setting off a civil war between his sons Huáscar and Atahualpa. Atahualpa had just won when Francisco Pizarro landed in 1532 with fewer than 200 men. At Cajamarca, on 16 November 1532, the Spanish ambushed and captured Atahualpa in the middle of his army.",
        mapState: { year: 1532, mapYear: 1530, lat: -6, lng: -79, zoom: 4.6 },
        highlight: ["Inca Empire"],
        markers: [
          { label: "Tumbes", at: [-80.45, -3.57] },
          { label: "Cajamarca: Atahualpa captured, 16 November 1532", at: [-78.5, -7.16], kind: "battle" },
        ],
        routes: [{ label: "Pizarro from Panama, 1531–1532", kind: "conquest", path: [[-79.52, 8.98], [-80, 5], [-80.4, 1], [-81, -2.2], [-80.45, -3.57], [-80.6, -5.2], [-79.5, -6.6], [-78.5, -7.16]] }],
      },
      {
        title: "A Room of Gold, and Cusco: 1533",
        text: "Atahualpa offered a ransom: a room filled once with gold and twice with silver. The Spanish took it and executed him anyway, in 1533. They marched on Cusco and entered it in November 1533, with Inca allies opposed to Atahualpa's faction. Inca resistance continued for decades from the mountain stronghold of Vilcabamba, until 1572.",
        mapState: { year: 1533, mapYear: 1530, lat: -11, lng: -75, zoom: 4.8 },
        markers: [
          { label: "Cusco, November 1533", at: [-71.97, -13.53], kind: "battle" },
          { label: "Vilcabamba: Inca resistance until 1572", at: [-73.2, -13.1] },
        ],
        routes: [{ label: "The march on Cusco, 1533", kind: "conquest", path: [[-78.5, -7.16], [-77.5, -9.5], [-75.2, -12], [-74.2, -13.2], [-71.97, -13.53]] }],
      },
      {
        title: "Silver and Catastrophe",
        text: "The conquest created a Spanish empire from California to Chile. In 1545 a mountain of silver was found at Potosí, and American silver flowed to Spain and, across the Pacific on the Manila galleons, to China. For the Indigenous peoples, the cost was catastrophic: smallpox, measles and other diseases, with war and forced labour, killed a large majority of the population within a century.",
        mapState: { year: 1600, lat: 5, lng: -60, zoom: 1.7 },
        highlight: ["Viceroyalty of New Spain"],
        markers: [
          { label: "Potosí: silver from 1545", at: [-65.75, -19.58] },
          { label: "Seville", at: [-5.98, 37.39] },
          { label: "Manila", at: [120.98, 14.6] },
        ],
        routes: [
          { label: "Silver to Spain", kind: "spread", path: [[-65.75, -19.58], [-70, -15], [-77, -10], [-79.5, 9], [-75.5, 10.4], [-82.4, 23.1], [-60, 32], [-25, 37], [-6, 37.4]] },
          { label: "Silver to China on the Manila galleons, from 1565", kind: "voyage", path: [[-99.9, 16.85], [-120, 14], [-150, 13], [-180, 13], [-210, 14], [-239, 14.6]] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────── Atlantic slave trade
  {
    slug: "atlantic-slave-trade",
    title: "The Atlantic Slave Trade",
    description:
      "The largest forced migration in history: how some 12.5 million Africans were shipped across the Atlantic between the 1500s and the 1860s, where they were taken from and to, how they resisted, and how the trade was ended.",
    duration: 7,
    difficulty: "standard",
    steps: [
      {
        title: "Beginnings",
        text: "In the 1440s Portuguese ships trading down the West African coast began buying and capturing people to sell in Portugal and on the new sugar plantations of Madeira and São Tomé. Slavery already existed in Africa, Europe and the Islamic world, but what followed was new in scale and brutality: a trade in human beings across an ocean, for profit, defined by race.",
        mapState: { year: 1492, lat: 15, lng: -10, zoom: 3 },
        highlight: ["Portugal"],
        markers: [
          { label: "Elmina, Portuguese fort, 1482", at: [-1.35, 5.08] },
          { label: "São Tomé: sugar plantations", at: [6.6, 0.3] },
          { label: "Lisbon", at: [-9.14, 38.72] },
        ],
        routes: [{ label: "Portuguese voyages down the African coast", kind: "voyage", path: [[-9.14, 38.72], [-12, 32], [-17, 25], [-18, 15], [-15, 10], [-10, 6], [-1.35, 4.9], [6.6, 0.3]] }],
      },
      {
        title: "Across the Atlantic",
        text: "As Spanish and Portuguese colonists took over the Americas, and Indigenous populations collapsed from disease and forced labour, they turned to enslaved Africans. The first direct voyages from Africa to the Americas sailed in the 1520s. Portuguese Brazil's sugar plantations, and later the Caribbean's, became the trade's main destinations.",
        mapState: { year: 1600, lat: 5, lng: -30, zoom: 2.2 },
        highlight: ["Portugal", "Spain"],
        routes: [
          { label: "West Central Africa to Brazil", kind: "forced", path: [[13.23, -8.84], [0, -9], [-15, -10], [-30, -10], [-38.5, -12.97]] },
          { label: "To the Spanish Caribbean", kind: "forced", path: [[-1.35, 5], [-15, 8], [-35, 12], [-55, 15], [-70, 18.5]] },
        ],
      },
      {
        title: "The Height of the Trade",
        text: "The trade peaked in the 1700s, when British, Portuguese and French ships carried around 6 million people. Most came from West Central Africa (Kongo and Angola), the Bight of Benin around Ouidah, the Bight of Biafra and the Gold Coast. They were captured in wars and raids, often by African states that sold them to European traders on the coast in exchange for textiles, guns and other goods.",
        mapState: { year: 1783, lat: 2, lng: 5, zoom: 3.4 },
        highlight: ["Dahomey", "Asante", "Oyo"],
        markers: [
          { label: "Ouidah, Bight of Benin", at: [2.08, 6.36] },
          { label: "Bonny, Bight of Biafra", at: [7.17, 4.45] },
          { label: "Cape Coast, Gold Coast", at: [-1.24, 5.1] },
          { label: "Luanda, Angola", at: [13.23, -8.84] },
        ],
      },
      {
        title: "The Middle Passage",
        text: "The voyage across the Atlantic, the 'Middle Passage', lasted one to three months. Captives were chained below deck in crowded, airless holds. Of about 12.5 million people embarked, roughly 10.7 million survived the crossing; well over a million died at sea. The largest share, nearly half, were taken to Brazil; most of the rest went to the Caribbean; about 400,000 to mainland North America.",
        mapState: { year: 1783, lat: 5, lng: -35, zoom: 2.1 },
        highlight: ["Viceroyalty of Brazil"],
        markers: [
          { label: "Salvador da Bahia, Brazil", at: [-38.5, -12.97] },
          { label: "Jamaica", at: [-77.3, 18.1] },
          { label: "Saint-Domingue", at: [-72.3, 18.9] },
          { label: "Charleston", at: [-79.93, 32.78] },
        ],
        routes: [
          { label: "To Brazil: about 4.9 million people", kind: "forced", path: [[13.23, -8.84], [0, -10], [-20, -12], [-38.5, -12.97]] },
          { label: "To the Caribbean", kind: "forced", path: [[2.08, 6.36], [-15, 9], [-40, 13], [-60, 15], [-72.3, 18.9]] },
          { label: "To North America", kind: "forced", path: [[-1.24, 5.1], [-20, 12], [-45, 22], [-65, 29], [-79.9, 32.8]] },
        ],
      },
      {
        title: "The Triangle",
        text: "The trade was one side of a triangle. Ships carried manufactured goods from Europe to Africa, people from Africa to the Americas, and sugar, tobacco, coffee and cotton grown by enslaved people from the Americas to Europe. Port cities such as Liverpool, Bristol, Nantes, Lisbon and Amsterdam grew rich on it.",
        mapState: { year: 1783, lat: 25, lng: -30, zoom: 2.1 },
        markers: [
          { label: "Liverpool", at: [-2.98, 53.41] },
          { label: "Nantes", at: [-1.55, 47.22] },
        ],
        routes: [
          { label: "Goods: Europe to Africa", kind: "voyage", path: [[-2.98, 53.41], [-10, 45], [-15, 30], [-17, 15], [-1.24, 5.1]] },
          { label: "People: Africa to the Americas", kind: "forced", path: [[-1.24, 5.1], [-25, 10], [-50, 15], [-72, 18.5]] },
          { label: "Sugar, tobacco and cotton: the Americas to Europe", kind: "voyage", path: [[-72, 19.5], [-65, 30], [-45, 40], [-20, 47], [-2.98, 53.41]] },
        ],
      },
      {
        title: "Resistance",
        text: "Enslaved Africans resisted at every stage: by revolts on ships, by escaping to form free 'maroon' communities, such as Palmares in Brazil, which held out for most of the 1600s, and by uprisings. The greatest, in the French colony of Saint-Domingue in 1791, became the Haitian Revolution. In 1804 Haiti became the first nation founded by formerly enslaved people.",
        mapState: { year: 1800, lat: 5, lng: -60, zoom: 2.4 },
        markers: [
          { label: "Saint-Domingue: revolution of 1791", at: [-72.3, 18.9] },
          { label: "Palmares, Brazil", at: [-36, -9.4] },
        ],
      },
      {
        title: "Abolition",
        text: "In Britain, a mass movement of abolitionists, many of them formerly enslaved writers and speakers such as Olaudah Equiano, campaigned against the trade. Britain banned it in 1807 and the United States in 1808, and the Royal Navy began intercepting slave ships. Slavery itself lasted longer: it was abolished in the British Empire in 1833, the United States in 1865, and Brazil, the last in the Americas, in 1888.",
        mapState: { year: 1815, lat: 25, lng: -40, zoom: 2.1 },
        markers: [
          { label: "London: trade banned, 1807", at: [-0.13, 51.51] },
          { label: "Washington: slavery ended, 1865", at: [-77.04, 38.9] },
          { label: "Rio de Janeiro: slavery ended, 1888", at: [-43.2, -22.9] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────── Napoleon
  {
    slug: "napoleonic-wars",
    title: "Napoleon's Wars",
    description:
      "From the young general's Italian campaign to Austerlitz, the invasion of Russia and Waterloo: twenty years of war that redrew the map of Europe.",
    duration: 8,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "The General of the Revolution: Italy, 1796–1797",
        text: "Revolutionary France was at war with most of Europe's monarchies. In 1796, Napoleon Bonaparte, a 26-year-old Corsican general, took command of a ragged army on the Italian frontier. In a year of rapid marches and victories, at Lodi, Arcole and Rivoli, he drove the Austrians out of northern Italy and made his name.",
        mapState: { year: 1796, mapYear: 1800, lat: 45, lng: 9, zoom: 5.3 },
        highlight: ["France"],
        markers: [
          { label: "Lodi, 1796", at: [9.5, 45.31], kind: "battle" },
          { label: "Arcole, 1796", at: [11.28, 45.36], kind: "battle" },
          { label: "Rivoli, 1797", at: [10.8, 45.57], kind: "battle" },
        ],
        routes: [{ label: "The Italian campaign, 1796–1797", kind: "conquest", path: [[7.27, 43.7], [8.2, 44.4], [9.2, 45.46], [9.5, 45.31], [10.9, 45.15], [11.28, 45.36], [10.8, 45.57]] }],
      },
      {
        title: "Egypt: 1798–1799",
        text: "In 1798 Napoleon invaded Egypt, hoping to threaten Britain's route to India. He won the Battle of the Pyramids, but weeks later the British admiral Nelson destroyed his fleet in Aboukir Bay, trapping the army. Scholars he brought along studied Egypt; one of his soldiers' finds was the Rosetta Stone. In 1799 he slipped back to France and seized power in a coup.",
        mapState: { year: 1798, mapYear: 1800, lat: 34, lng: 22, zoom: 3.7 },
        markers: [
          { label: "Battle of the Pyramids, 1798", at: [31.2, 30.07], kind: "battle" },
          { label: "Battle of the Nile, Aboukir Bay, 1798", at: [30.1, 31.35], kind: "battle" },
          { label: "Acre: siege fails, 1799", at: [35.07, 32.93], kind: "battle" },
        ],
        routes: [
          { label: "The invasion fleet, via Malta", kind: "voyage", path: [[5.93, 43.12], [8, 41.5], [12, 38.5], [14.5, 35.9], [22, 33.5], [29.9, 31.3]] },
          { label: "Napoleon returns to France, 1799", kind: "retreat", path: [[29.9, 31.6], [22, 34.5], [14, 37], [9.5, 41], [6.4, 43.4]] },
        ],
      },
      {
        title: "Emperor: Austerlitz, 1805",
        text: "Napoleon crowned himself Emperor of the French in 1804. In 1805 Britain, Austria and Russia allied against him. He marched his Grande Armée from the Channel coast to the Danube, captured an Austrian army at Ulm, and on 2 December 1805 crushed the Austrians and Russians at Austerlitz, his greatest victory. At sea, though, Nelson destroyed the French and Spanish fleets at Trafalgar in October.",
        mapState: { year: 1805, mapYear: 1800, lat: 47.5, lng: 6, zoom: 4.2 },
        markers: [
          { label: "Ulm, October 1805", at: [9.99, 48.4], kind: "battle" },
          { label: "Austerlitz, 2 December 1805", at: [16.76, 49.13], kind: "battle" },
          { label: "Trafalgar, 21 October 1805", at: [-6.04, 36.18], kind: "battle" },
        ],
        routes: [{ label: "The Grande Armée marches to the Danube", kind: "conquest", path: [[1.6, 50.7], [4.5, 49.6], [7.8, 48.6], [9.99, 48.4], [12.5, 48.3], [16.37, 48.2], [16.76, 49.13]] }],
      },
      {
        title: "Master of Europe: 1806–1807",
        text: "In 1806 Napoleon destroyed the Prussian army at Jena and Auerstedt and entered Berlin. In 1807, after beating the Russians at Friedland, he made peace with Tsar Alexander I at Tilsit. He dissolved the Holy Roman Empire and redrew the map, making his brothers kings. His Continental System tried to ruin Britain by banning its trade with Europe.",
        mapState: { year: 1807, mapYear: 1815, lat: 51, lng: 15, zoom: 4.2 },
        markers: [
          { label: "Jena, 1806", at: [11.59, 50.93], kind: "battle" },
          { label: "Friedland, 1807", at: [21.0, 54.45], kind: "battle" },
          { label: "Tilsit: peace with Russia, 1807", at: [21.87, 55.08] },
        ],
        routes: [{ label: "Through Prussia to the Niemen, 1806–1807", kind: "conquest", path: [[9.5, 50.3], [11.59, 50.93], [13.4, 52.52], [17, 53], [21, 54.45], [21.87, 55.08]] }],
      },
      {
        title: "The Spanish Ulcer: 1808–1814",
        text: "In 1808 Napoleon put his brother Joseph on the Spanish throne. Spain rose in revolt; the word 'guerrilla', 'little war', comes from this conflict. A British army under the future Duke of Wellington, landing in Portugal, fought its way across the peninsula over six years. The war tied down hundreds of thousands of French soldiers. Napoleon called it his 'Spanish ulcer'.",
        mapState: { year: 1810, mapYear: 1815, lat: 40.5, lng: -4, zoom: 5 },
        highlight: ["Spain", "Portugal"],
        markers: [
          { label: "Salamanca, 1812", at: [-5.66, 40.97], kind: "battle" },
          { label: "Vitoria, 1813", at: [-2.67, 42.85], kind: "battle" },
        ],
        routes: [{ label: "Wellington's advance, 1809–1814", kind: "conquest", path: [[-9.14, 38.72], [-8.4, 40.2], [-6.5, 40.6], [-5.66, 40.97], [-4, 42], [-2.67, 42.85], [-1.5, 43.4]] }],
      },
      {
        title: "Russia: 1812",
        text: "In June 1812 Napoleon invaded Russia with the largest army Europe had ever seen, around 600,000 men. The Russians retreated, burning what they left. At Borodino, in September, both sides suffered terrible losses. Napoleon entered Moscow, but the city burned and the Tsar would not negotiate. The retreat, through the Russian winter, destroyed his army: only a small fraction ever came home.",
        mapState: { year: 1812, mapYear: 1815, lat: 54.5, lng: 30, zoom: 4.6 },
        highlight: ["Russian Empire"],
        markers: [
          { label: "Crossing the Niemen, June 1812", at: [23.9, 54.9] },
          { label: "Borodino, 7 September 1812", at: [35.82, 55.52], kind: "battle" },
          { label: "Moscow", at: [37.62, 55.75] },
          { label: "Berezina, November 1812", at: [28.5, 54.3], kind: "battle" },
        ],
        routes: [
          { label: "The invasion, June–September 1812", kind: "conquest", path: [[23.9, 54.9], [25.3, 54.7], [30.2, 55.2], [32, 54.8], [35.82, 55.52], [37.6, 55.75]] },
          { label: "The retreat, October–December 1812", kind: "retreat", path: [[37.6, 55.6], [35, 55.2], [32, 54.6], [28.5, 54.3], [25.3, 54.6], [23.9, 54.8]] },
        ],
      },
      {
        title: "Leipzig and Elba: 1813–1814",
        text: "All of Europe now turned against Napoleon. In October 1813, at Leipzig, the 'Battle of the Nations', the armies of Russia, Prussia, Austria and Sweden defeated him; it was the largest battle in Europe before the First World War. The allies invaded France and took Paris in 1814. Napoleon abdicated and was exiled to the island of Elba.",
        mapState: { year: 1813, mapYear: 1815, lat: 48, lng: 8, zoom: 4.3 },
        markers: [
          { label: "Leipzig, October 1813", at: [12.37, 51.34], kind: "battle" },
          { label: "Elba: exile, 1814", at: [10.3, 42.78] },
        ],
        routes: [
          { label: "The allies invade France, 1814", kind: "conquest", path: [[12.37, 51.34], [9, 50.5], [6.2, 49.6], [4, 49], [2.35, 48.86]] },
          { label: "Napoleon to Elba", kind: "retreat", path: [[2.4, 48.7], [4.8, 45.8], [7, 43.7], [10.3, 42.78]] },
        ],
      },
      {
        title: "The Hundred Days and Waterloo: 1815",
        text: "In March 1815 Napoleon escaped from Elba, landed in France and marched on Paris; the army sent to stop him joined him. For a hundred days he ruled again. On 18 June 1815, at Waterloo, south of Brussels, he was defeated by Wellington's British-allied army and the Prussians under Blücher. He was exiled to the remote Atlantic island of Saint Helena, where he died in 1821.",
        mapState: { year: 1815, lat: 47.5, lng: 4, zoom: 4.6 },
        highlight: ["France"],
        markers: [{ label: "Waterloo, 18 June 1815", at: [4.41, 50.68], kind: "battle" }],
        routes: [
          { label: "From Elba to Paris, March 1815", kind: "conquest", path: [[10.3, 42.78], [7.5, 43.4], [7, 43.55], [6.3, 44.5], [5.7, 45.2], [4.8, 45.8], [3.5, 47.5], [2.35, 48.86]] },
          { label: "North to Waterloo", kind: "conquest", path: [[2.4, 48.95], [3.2, 49.8], [4.2, 50.4], [4.41, 50.68]] },
        ],
      },
    ],
  },
  // The world wars live in warTours.ts, with territory shading.
];
