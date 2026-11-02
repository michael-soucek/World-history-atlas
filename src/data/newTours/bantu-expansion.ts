import type { Tour } from "@/data/tours";

export const TOUR: Tour = {
  slug: "bantu-expansion",
  title: "The Bantu Expansion",
  description:
    "How farming peoples from what is now the Cameroon–Nigeria borderland spread across half a continent over three thousand years, carrying their languages, crops and later iron-working to East and Southern Africa.",
  duration: 8,
  difficulty: "standard",
  trail: true,
  steps: [
    {
      title: "A Homeland in West-Central Africa",
      date: "c. 2000 BCE",
      text: "Somewhere between 440 and 680 languages spoken across central, eastern and southern Africa, from Swahili and Lingala to Shona and Zulu, belong to one family: Bantu. Linguists trace them to the highlands where Cameroon meets Nigeria; the Mambilla Plateau on that border has been described as the home of 'the Bantu who stayed home'. More than 4,000 years ago the farming communities there lived in villages, kept goats and guinea fowl, built boats for fishing, used stone tools, and harvested oil palms and possibly yams. At the Shum Laka rock shelter in Cameroon, pottery goes back to about 5000 BCE. A 2023 genetic study of 1,487 Bantu speakers dated the start of the expansion to roughly 4,000 years ago.",
      mapState: { year: -2000, lat: 2, lng: 15, zoom: 3.4 },
      markers: [
        { label: "The Bantu homeland: the Cameroon Grassfields", at: [10.5, 6] },
        { label: "Shum Laka rock shelter: pottery from c. 5000 BCE", at: [10.078, 5.859] },
        { label: "Mambilla Plateau", at: [11.717, 7.333] },
      ],
      fact: "Nobody called themselves 'Bantu'. The German linguist Wilhelm Bleek picked the name in 1857–58 from the shared word for 'people', as in Zulu and Xhosa abantu, plural of umuntu, 'person'.",
      readMore: ["/event/bantu-expansion", "/country/cameroon", "/place/bantu-peoples", "/country/nigeria"],
    },
    {
      title: "Into and Around the Rainforest",
      date: "c. 2000–500 BCE",
      text: "From about 4,000 years ago, Bantu-speaking farmers moved south and east, into and around the Central African rainforest. Linguists see two currents. A Western Stream followed the Atlantic coast and the rivers of the Congo basin and moved slowly: without iron tools to clear the forest, it reached central Cameroon only around 1500 BCE. An Eastern Stream skirted the northern edge of the forest or followed the Ubangi River. A drier climate between about 2000 and 500 BCE thinned the forest and may have helped. By about 500 BCE farmers had reached the southern fringe of the forest and central Angola. Forest foragers, among them ancestors of the Baka and Mbuti, already lived there, and the two peoples often intermarried.",
      mapState: { year: -1000, lat: -2, lng: 18, zoom: 3.4 },
      markers: [
        { label: "Congo rainforest", at: [21, 0] },
        { label: "Central Cameroon, reached c. 1500 BCE", at: [11.517, 3.867] },
      ],
      routes: [
        { label: "South along the Atlantic coast and rivers", kind: "migration", path: [[10.5, 6], [10, 3], [11, 0], [12.5, -3], [13.5, -6]] },
        { label: "East along the forest's northern edge", kind: "migration", path: [[11, 5.5], [16, 4.5], [22, 3.5], [27, 2.5], [30, 1]] },
      ],
      fact: "About 30% of Aka, the Bantu language of a Central African forest people, is not Bantu at all. Much of it covers plants and honey-gathering, possibly the remnant of an older forest language.",
      readMore: ["/country/gabon", "/country/republic-of-the-congo", "/country/democratic-republic-of-the-congo", "/event/bantu-expansion"],
    },
    {
      title: "Iron and the Great Lakes",
      date: "c. 500 BCE",
      text: "By about 500 BCE, Bantu speakers of the Eastern Stream had reached the Great Lakes region, west of Lake Victoria. Their trace is Urewe pottery, with its dimpled bases and concentric incised lines, found from the Kagera region of Tanzania to Kivu in Congo, Rwanda, Burundi, Uganda and western Kenya. The Urewe people smelted iron in clay furnaces with chimney-like shafts, at one of Africa's oldest iron-working centres, and iron made better tools for clearing land and farming. By the 1st century BCE smiths in the region could produce carbon steel. Cushitic- and Nilotic-speaking herders already lived in East Africa, and Bantu speakers may have learned livestock-keeping from them; the Urewe people probably kept cattle and grew sorghum and millet.",
      mapState: { year: -500, lat: -3, lng: 25, zoom: 3.4 },
      markers: [
        { label: "Lake Victoria: Urewe iron culture", at: [33, -1] },
        { label: "Kagera: the earliest Urewe sites", at: [31.3, -1.917] },
      ],
      routes: [{ label: "To the Great Lakes", kind: "migration", path: [[27, 2], [29.5, 0.5], [31.5, -0.5], [33, -1]] }],
      fact: "Urewe smelters lined the base of their furnaces with fresh leafy branches to filter out the slag. Because the wood was always new, the charcoal gives unusually reliable radiocarbon dates.",
      readMore: ["/country/uganda", "/country/rwanda", "/country/tanzania", "/culture/nok-culture"],
    },
    {
      title: "To the Indian Ocean Coast",
      date: "c. 100 BCE – 300 CE",
      text: "From the Great Lakes, farmers carried Urewe-style pottery and iron-working east to the Indian Ocean. Archaeologists have found Bantu-speaking communities at Kwale in Kenya and Misasa in Tanzania between about 100 BCE and 300 CE; Kwale ware pottery is named after the Kenyan site. The newcomers mixed with the peoples already living on the coast and married into their communities. Seaborne trade with Arabia and the Red Sea had reached this shore by the 1st century CE. A Greek merchants' handbook of that century, the Periplus of the Erythraean Sea, called the coast Azania and named Rhapta as its southernmost market. Many historians see these coastal farming villages as the roots of the later Swahili towns.",
      mapState: { year: 100, lat: -4, lng: 37, zoom: 4.4 },
      markers: [
        { label: "Kwale: early Iron Age farmers, c. 100 BCE – 300 CE", at: [39.46, -4.174] },
        { label: "Lake Victoria", at: [33, -1] },
      ],
      routes: [
        { label: "Farmers reach the coast", kind: "migration", path: [[33, -1], [35, -2.4], [37.3, -3.3], [39.46, -4.174]] },
        { label: "Monsoon trade with Arabia and the Red Sea", kind: "voyage", path: [[39.7, -4.2], [42, -1], [46, 3], [50, 10], [45.03, 12.8]] },
      ],
      fact: "The word Swahili comes from the Arabic sawahil, 'coasts': the Swahili are, in name, simply 'the people of the coasts'.",
      readMore: ["/culture/swahili-culture", "/country/kenya", "/country/tanzania"],
    },
    {
      title: "Down the East of Africa",
      date: "c. 300–500 CE",
      text: "From the Great Lakes the expansion divided again. One current turned west to meet the Western Stream in Congo and Angola; another spread south across eastern and southern Africa, through what are now Tanzania, Malawi, Zambia, Zimbabwe and Mozambique. Archaeologists follow two branches: the Kwale branch down the coast and the Nkope branch from southern Tanzania through Malawi and eastern Zambia into Zimbabwe. Pioneers had reached KwaZulu-Natal in South Africa by about 300 CE, and what is now Limpopo Province by about 400 to 500. The Khoisan-speaking hunter-gatherers already living in the south were absorbed or pushed out, and some of their descendants still live around the Kalahari. Zulu and Xhosa clicks are probably a legacy of that contact.",
      mapState: { year: 400, lat: -15, lng: 28, zoom: 3.2 },
      markers: [
        { label: "KwaZulu-Natal, by c. 300 CE", at: [30.5, -29] },
        { label: "Kalahari", at: [22, -23] },
      ],
      routes: [
        { label: "The eastern stream south", kind: "migration", path: [[33, -2], [35, -7], [34, -13], [32, -18], [31, -23], [30.5, -29]] },
        { label: "The western stream into Angola", kind: "migration", path: [[13.5, -6], [15, -10], [17, -14], [19, -17]] },
      ],
      fact: "Clicks spread from borrowed words into native Bantu ones too. In Nguni languages part of the cause was hlonipha, a custom of respect that bans certain words and syllables, so speakers substitute others.",
      readMore: ["/place/khoisan", "/country/mozambique", "/country/malawi", "/country/zambia"],
    },
    {
      title: "Mapungubwe: A Kingdom on a Hill",
      date: "c. 1220",
      text: "By around 900, farmers and herders drawn by the ivory trade had settled near the confluence of the Limpopo and Shashe rivers, displacing many of the San. About 1000 the Leopard's Kopje people, who spoke an early form of Shona, founded a capital at Bambandyanalo, which held about 1,500 people by 1200. They grew sorghum and millets, kept large herds of cattle, and sent ivory and gold to the coast in return for glass beads, cloth and glazed pottery. Around 1220, in a dry spell, the ruling family moved to the top of Mapungubwe Hill, a rainmaking site, with commoners below. By 1250 the capital had about 5,000 people. Around 1300, as trade routes shifted north, it was abandoned.",
      mapState: { year: 1220, mapYear: 1200, lat: -21, lng: 31.5, zoom: 5.2 },
      markers: [
        { label: "Mapungubwe Hill", at: [29.239, -22.193] },
        { label: "Chibuene: coastal trading post", at: [35.324, -22.049] },
      ],
      routes: [{ label: "Ivory and gold to the coast", kind: "spread", path: [[29.239, -22.193], [31, -22.6], [33.2, -22.8], [35.324, -22.049]] }],
      fact: "Nobody knows what the kingdom called itself. Mapungubwe, the archaeologists' name, means 'place of jackals'. Among its royal graves was a rhinoceros of wood covered in gold foil.",
      readMore: ["/place/shona-people", "/country/south-africa", "/country/botswana"],
    },
    {
      title: "Kingdoms of the Bantu World",
      date: "c. 1300–1450",
      text: "Later, Bantu-speaking peoples built kingdoms and trading cities. Great Zimbabwe, raised by ancestors of the Shona, was built up between the 11th and 15th centuries and took over Mapungubwe's role as the region's trade hub around 1300. The mortarless walls of its Great Enclosure, up to 11 metres high, still stand; estimates of its peak population run from under 10,000 to 18,000. Gold and ivory went down the Save and Runde rivers to Sofala, which Kilwa had seized in the late 1100s. Swahili city-states such as Kilwa traded gold, ivory and enslaved people across the Indian Ocean, and Chinese and Persian porcelain reached Great Zimbabwe in return. By the mid-2010s about 350 million people spoke Bantu languages, Swahili most widely.",
      mapState: { year: 1300, lat: -12, lng: 32, zoom: 3.4 },
      highlight: ["Great Zimbabwe"],
      markers: [
        { label: "Great Zimbabwe", at: [30.933, -20.267] },
        { label: "Sofala", at: [34.717, -20.15] },
        { label: "Kilwa", at: [39.513, -8.96] },
      ],
      routes: [{ label: "Gold to the Swahili coast and the Indian Ocean", kind: "spread", path: [[30.93, -20.27], [33, -20.4], [34.72, -20.15], [36.5, -17], [39.5, -9], [45, -2], [55, 10]] }],
      fact: "In 1944 five coins from the Kilwa Sultanate were found on Marchinbar Island in northern Australia; another thought to be Kilwan turned up on nearby Elcho Island in 2018.",
      readMore: ["/site/great-zimbabwe", "/site/kilwa-kisiwani", "/place/kingdom-of-great-zimbabwe", "/country/zimbabwe"],
    },
    {
      title: "The Kingdom of Kongo",
      date: "c. 1390–1491",
      text: "In the west, heirs of the Western Stream also built states. Around 1390 a marriage alliance between two Kikongo-speaking ruling families founded the Kingdom of Kongo, and their son, Lukeni lua Nimi, led its expansion south; by tradition he built his capital at M'banza-Kongo, in northern Angola. Its kings, the Mwene Kongo, ruled provinces through governors and resettled war captives around the capital. By 1483 the Portuguese explorer Diogo Cão had reached the mouth of the Congo, and took Kongo nobles to Portugal. In 1491 King Nzinga a Nkuwu was baptised as João I, and his son Afonso I, who took the throne in 1509, made Catholicism the state religion. By 1600 Kongo had probably over half a million people.",
      mapState: { year: 1491, mapYear: 1492, lat: -6.5, lng: 15, zoom: 5 },
      markers: [
        { label: "M'banza-Kongo, the royal capital", at: [14.248, -6.268] },
        { label: "Soyo: the Portuguese arrive, 1483", at: [12.367, -6.133] },
      ],
      routes: [{ label: "Diogo Cão's voyage, 1482–1483", kind: "voyage", path: [[8.5, 0], [9.5, -3], [11, -5.2], [12.367, -6.133]] }],
      fact: "Early Portuguese visitors compared M'banza-Kongo to their own town of Évora. A Jesuit's baptismal count of 1623 put the capital and its hinterland at about 100,000 people, nearly one in six Kongolese.",
      people: ["afonso-i-of-kongo"],
      readMore: ["/place/kingdom-of-kongo", "/country/angola", "/place/luba-empire"],
    },
  ],
};
