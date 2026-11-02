import type { Tour } from "@/data/tours";

export const TOUR: Tour = {
  slug: "out-of-africa",
  title: "Out of Africa: How Humans Spread Across the World",
  description:
    "How our species, born in Africa, walked and paddled to every continent but Antarctica: into Asia, across the sea to Australia, into Neanderthal Europe, and over the land bridge to the Americas.",
  duration: 9,
  difficulty: "intro",
  trail: true,
  steps: [
    {
      title: "Born in Africa",
      date: "c. 300,000 years ago",
      text: "Homo sapiens evolved in Africa. The oldest known fossils with features of our species come from Jebel Irhoud in Morocco, a cave found in 1961 by baryte miners, where heated flints beside the bones have been dated to about 315,000 years ago. Others come from Florisbad in South Africa, about 259,000 years old, and the Omo valley in Ethiopia, at least 230,000. One study of skull shapes suggests that our species arose from a merging of populations in eastern and southern Africa. Other human species lived at the same time: Neanderthals in Europe and western Asia, Denisovans in Asia, and late forms of Homo erectus, among others.",
      mapState: { year: -300000, lat: 10, lng: 20, zoom: 2.2 },
      markers: [
        { label: "Jebel Irhoud, c. 300,000 years ago", at: [-8.87, 31.86] },
        { label: "Omo Kibish, c. 230,000 years ago", at: [35.967, 4.8] },
        { label: "Florisbad, c. 259,000 years ago", at: [26.083, -28.766] },
      ],
      fact: "The first Jebel Irhoud skull was found in the cave wall by a miner, who handed it to an engineer. He kept it as a souvenir for a while before it reached scientists.",
      readMore: ["/country/morocco", "/country/ethiopia", "/country/south-africa"],
    },
    {
      title: "The First Signs of Symbolic Thought",
      date: "c. 100,000–73,000 years ago",
      text: "Long before they left Africa, people were thinking in symbols. At Blombos Cave, on the southern coast of South Africa about 300 kilometres east of Cape Town, people camped on and off between about 100,000 and 70,000 years ago. In the oldest layers they left a workshop where ochre, bone and charcoal were ground into a red paste and stored in abalone shells, the first known case of a pigment mix being made and kept in a container. Later layers hold pieces of ochre engraved with cross-hatched lines, more than 70 pierced sea-snail shells worn as beads, finely made stone spear points and polished bone tools. Their diet included fish, shellfish, seals and eland.",
      mapState: { year: -75000, lat: -30, lng: 24, zoom: 4.2 },
      markers: [
        { label: "Blombos Cave, c. 100,000–70,000 years ago", at: [21.223, -34.414] },
        { label: "Klasies River Caves", at: [24.39, -34.108] },
      ],
      fact: "A flake of stone from Blombos bears nine red lines drawn with an ochre crayon about 73,000 years ago. It is thought to be the oldest known drawing made by a human.",
      readMore: ["/country/south-africa", "/history-of/cape-town", "/site/lascaux"],
    },
    {
      title: "Early Forays and the Great Dispersal",
      date: "c. 185,000–50,000 years ago",
      text: "Small groups of Homo sapiens left Africa early. A jawbone from Misliya Cave in Israel is about 185,000 years old, and people reached the Levant around 90,000–120,000 years ago, at caves such as Skhul and Qafzeh, where some of the dead may have been buried and sea shells were perhaps worn as beads. Stone tools hint that others reached Arabia by 125,000 years ago. But these early forays left few or no descendants. Nearly everyone living outside Africa today descends from a later dispersal, roughly 50,000 to 70,000 years ago, probably across the Sinai or the narrow Bab-el-Mandeb strait at the mouth of the Red Sea, perhaps by as few as 150 to 1,000 people.",
      mapState: { year: -60000, lat: 22, lng: 42, zoom: 3 },
      markers: [
        { label: "Skhul and Qafzeh, c. 90,000–120,000 years ago", at: [34.97, 32.67] },
        { label: "Bab-el-Mandeb", at: [43.4, 12.6] },
        { label: "Misliya Cave, c. 185,000 years ago", at: [34.972, 32.741] },
        { label: "Jebel Faya: stone tools, c. 125,000 years ago", at: [55.847, 25.119] },
      ],
      routes: [
        { label: "Out of Africa, c. 50,000–70,000 years ago", kind: "migration", path: [[37, 9], [42, 12], [43.4, 12.6], [47, 15], [55, 19], [58.5, 23.5]] },
        { label: "The northern route, via Sinai", kind: "migration", path: [[33, 22], [33.5, 28], [34.5, 31], [36, 34]] },
      ],
      fact: "Skhul 5, one of the skeletons claimed as a deliberate burial, was found with the jawbone of a wild boar lying on its chest.",
      readMore: ["/country/ethiopia", "/country/kenya", "/country/morocco"],
    },
    {
      title: "Along the Coasts of Asia",
      date: "c. 70,000–55,000 years ago",
      text: "Moving along the coasts of Arabia, Persia and India, where shellfish, fish and seaweed could be gathered at low tide, people reached South Asia before about 55,000 years ago and went on to Southeast Asia. Sea levels were much lower in the Ice Age, joining many of today's islands to the mainland in a landmass called Sunda. On the way the newcomers met, and had children with, other kinds of human. Neanderthal DNA survives in nearly everyone whose ancestry lies outside sub-Saharan Africa, and DNA from the Denisovans, a people known mostly from their genes, makes up about 4–6% of the genome of Melanesians today and smaller shares among Aboriginal Australians, Asians and Native Americans.",
      mapState: { year: -55000, lat: 15, lng: 85, zoom: 2.7 },
      markers: [
        { label: "Jwalapuram: stone tools, c. 75,000 years ago", at: [78.03, 15.81] },
        { label: "Denisova Cave", at: [84.676, 51.398] },
      ],
      routes: [
        { label: "The southern coastal route", kind: "migration", path: [[58.5, 23.5], [64, 25], [70, 21], [76, 10], [80, 15], [90, 21], [97, 16], [100, 6], [105, 0]] },
      ],
      fact: "The Denisovans were first identified in 2010 from the DNA of a single juvenile finger bone found in Denisova Cave, in Siberia's Altai Mountains.",
      readMore: ["/country/india", "/country/indonesia", "/culture/aboriginal-australians"],
    },
    {
      title: "Across the Sea to Australia",
      date: "c. 65,000–50,000 years ago",
      text: "Even at its lowest, the sea between Sunda and Sahul, the landmass that joined Australia and New Guinea, had gaps up to about 90 kilometres wide, and Homo erectus had never crossed it. Modern humans did, by raft or boat, at least 50,000 years ago and possibly earlier: excavations at Madjedbebe, a rock shelter in Arnhem Land, have been dated to about 65,000 years ago, though that date is disputed. It is among the earliest evidence of deliberate sea crossings. Lake Mungo in New South Wales holds the oldest human remains on the continent, about 40,000 years old. Aboriginal Australian culture may be among the longest-unbroken cultural traditions anywhere.",
      mapState: { year: -50000, lat: -15, lng: 125, zoom: 2.8 },
      markers: [
        { label: "Madjedbebe: one of the oldest Australian sites", at: [132.9, -12.5] },
        { label: "Lake Mungo, c. 40,000+ years ago", at: [143, -33.7] },
      ],
      routes: [
        { label: "From Sunda to Sahul by sea", kind: "voyage", path: [[105, 0], [115, -5], [121, -9], [127, -11], [132, -12.5]] },
        { label: "Across Australia", kind: "migration", path: [[132.9, -12.5], [136, -20], [140, -28], [143, -33.7]] },
      ],
      fact: "Mungo Lady, found at Lake Mungo in 1968, is one of the oldest known cremations in the world. Her remains were returned to Aboriginal custodians in 1992.",
      readMore: ["/culture/aboriginal-australians", "/country/australia", "/place/papuans", "/place/australia"],
    },
    {
      title: "Into Neanderthal Europe",
      date: "c. 47,000–40,000 years ago",
      text: "Modern humans entered Europe around 45,000 years ago, through the Balkans and along the Danube. At Bacho Kiro cave in Bulgaria, remains about 46,000 years old lie with tools of a new style, and bones at Ranis in Germany are 45,000–47,000 years old. Europe already had people: the Neanderthals, who had lived there for hundreds of thousands of years and were built for the cold. The two met and interbred; people of non-African descent carry about 1.5–2% Neanderthal DNA. Within a few thousand years the Neanderthals had disappeared, by about 40,000 years ago across most of Europe, probably outcompeted by the newcomers.",
      mapState: { year: -45000, lat: 46, lng: 18, zoom: 3.6 },
      highlight: ["Neanderthal"],
      markers: [
        { label: "Bacho Kiro cave, c. 45,000 years ago", at: [25.43, 42.95] },
        { label: "Ranis, c. 45,000–47,000 years ago", at: [11.568, 50.664] },
      ],
      routes: [
        { label: "Into Europe along the Danube", kind: "migration", path: [[36, 34], [32, 39], [27, 41.5], [25.4, 43], [21, 45], [16.5, 48], [10, 48.5], [3, 47]] },
      ],
      fact: "DNA from three Bacho Kiro individuals suggests each had a Neanderthal ancestor perhaps only six or seven generations back: the mixing was recent family history.",
      readMore: ["/country/germany", "/country/france"],
    },
    {
      title: "The First Artists",
      date: "c. 42,000–17,000 years ago",
      text: "In the caves of the Swabian Alb in south-western Germany, Ice Age people carved mammoth ivory. A small female figure from Hohle Fels, 42,000 to 40,000 years old, is the oldest undisputed image of a human being, and a flute from nearby Geissenklösterle is about 42,000 years old. The lion-headed Lion Man figure of Hohlenstein-Stadel is around 40,000. In southern France, the walls of Chauvet Cave were painted with lions, horses and rhinoceroses, most of the black drawings between 37,000 and 33,500 years ago. Much later, perhaps 17,000 to 22,000 years ago, many generations covered Lascaux in the Dordogne with more than 600 paintings.",
      mapState: { year: -40000, lat: 46.5, lng: 6, zoom: 5 },
      markers: [
        { label: "Hohle Fels: ivory figure, c. 40,000 years ago", at: [9.756, 48.379] },
        { label: "Geissenklösterle: flute, c. 42,000 years ago", at: [9.772, 48.398] },
        { label: "Chauvet Cave, c. 37,000–33,500 years ago", at: [4.414, 44.388] },
        { label: "Lascaux, c. 17,000–22,000 years ago", at: [1.17, 45.054] },
      ],
      fact: "Lascaux was found on 12 September 1940 when 18-year-old Marcel Ravidat followed his dog, Robot, to a hole left by an uprooted tree.",
      readMore: ["/site/lascaux", "/country/france", "/country/germany"],
    },
    {
      title: "Siberia and the Arctic",
      date: "c. 45,000–32,000 years ago",
      text: "People also moved north and east across Asia. A thigh bone from Ust'-Ishim in western Siberia, about 45,000 years old, carries some of the oldest modern human DNA ever read; its Neanderthal DNA still comes in long stretches, showing that the mixing had happened not long before. By about 40,000 years ago people had reached Mamontovaya Kurya in Arctic Russia. By about 32,000 years ago hunters were living at Yana, far inside the Arctic Circle. They hunted reindeer, snared hares for their warm pelts, and shaped mammoth ivory and woolly rhinoceros horn into tools. Their culture had vanished by the coldest point of the Ice Age.",
      mapState: { year: -32000, lat: 58, lng: 100, zoom: 2.6 },
      markers: [
        { label: "Ust'-Ishim, c. 45,000 years ago", at: [71.2, 57.7] },
        { label: "Yana, c. 32,000 years ago", at: [135.4, 70.7] },
        { label: "Mamontovaya Kurya, c. 40,000 years ago", at: [62.417, 66.567] },
      ],
      routes: [
        { label: "North across Asia", kind: "migration", path: [[60, 38], [65, 48], [71.2, 57.7], [95, 60], [120, 66], [135.4, 70.7]] },
      ],
      fact: "The Ust'-Ishim thigh bone was spotted in 2008 sticking out of the bank of the Irtysh River by Nikolai Peristov, a sculptor who carves mammoth ivory.",
      readMore: ["/place/russia", "/history-of/novosibirsk", "/place/paleo-inuit"],
    },
    {
      title: "Across Beringia to the Americas",
      date: "c. 23,000–14,500 years ago",
      text: "During the last Ice Age, a land bridge, Beringia, up to about 1,000 kilometres wide, joined Siberia and Alaska. People crossed it into the Americas, though exactly when is still debated; one theory holds that their ancestors paused in Beringia, forming distinct lineages, before spreading swiftly south. Human footprints at White Sands in New Mexico have been dated to about 21,000–23,000 years ago, though some scientists argue they are younger. Monte Verde in southern Chile, a camp of wooden huts later sealed under peat, is generally dated to about 14,500 years ago, more than a thousand years before the Clovis culture, although that too has been challenged. By the end of the Ice Age, people lived throughout the Americas.",
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
      fact: "At White Sands, one trackway shows a woman or teenager walking over a mile with a toddler, sometimes carrying it. Between the outward and return walks, a mammoth crossed their path.",
      readMore: ["/country/united-states", "/country/chile", "/history-of/anchorage", "/place/paleo-inuit"],
    },
  ],
};
