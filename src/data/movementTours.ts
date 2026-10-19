import type { Tour } from "@/data/tours";

/**
 * Tours about peoples, armies, ideas and diseases on the move. Each stop can
 * draw arrows (see TourRoute in tours.ts): paths are [longitude, latitude]
 * waypoints, smoothed into curves on the map.
 *
 * `highlight` names must match a territory name in the map snapshot for the
 * stop's year; `node scripts/validate-tour-highlights.mjs` checks them.
 */
export const MOVEMENT_TOURS: Tour[] = [
  // ─────────────────────────────────────────────────────────────── Magyars
  {
    slug: "magyar-journey",
    title: "The Magyar Journey: From the Urals to Hungary",
    description:
      "How a people from the forests and steppes east of the Ural Mountains crossed half a continent, absorbed Turkic and Khazar allies, settled the Carpathian Basin in 895, and raided Europe from Spain to Constantinople.",
    duration: 8,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Cousins in the Forest",
        text: "Hungarian is not related to the languages around it. Its closest relatives are Khanty and Mansi, spoken today by small communities along the Ob River in western Siberia. There are no written records from this time, so dates are rough, based on language and archaeology. Sometime in the first millennium BCE, often put at about 1000–500 BCE, the ancestors of the Hungarians separated from their Ob-Ugric relatives. They moved south from the forest into the forest-steppe east of the Ural Mountains, and took up horse-breeding. The open steppe further west came much later.",
        mapState: { year: -500, lat: 56, lng: 64, zoom: 3.6 },
        highlight: ["Finno-Ugric taiga hunter-gatherers"],
        markers: [
          { label: "Ob River: Khanty and Mansi, Hungarian's closest relatives", at: [68.5, 61.5] },
          { label: "Ural Mountains", at: [59.5, 57] },
        ],
        routes: [
          { label: "South into the forest-steppe, c. 1000–500 BCE", kind: "migration", path: [[67, 59], [66, 56.5], [63.5, 54.8]] },
        ],
      },
      {
        title: "Life on the Steppe",
        text: "Over the following centuries the early Magyars crossed the Urals westward. Many historians place them, by the middle of the first millennium CE, on the steppe west of the southern Urals, in what is now Bashkortostan. Medieval writers later called this area Magna Hungaria, 'Greater Hungary'. In 1235 a Hungarian friar, Julian, set out east looking for it, and in 1236 he found people near the Volga who still spoke Hungarian. The Mongols destroyed them a few years later.",
        mapState: { year: 600, lat: 53, lng: 54, zoom: 4 },
        markers: [{ label: "Magna Hungaria: Friar Julian found Hungarian speakers here in 1236", at: [55.5, 54] }],
        routes: [{ label: "West across the Urals onto the steppe", kind: "migration", path: [[63.5, 54.8], [60, 55], [57.5, 54.5], [55.5, 54]] }],
      },
      {
        title: "Turks, Bulgars and Khazars",
        text: "Moving southwest, the Magyars lived among Turkic-speaking peoples for centuries: Onogurs, the Bulgars of the Volga, and the Khazars, whose khaganate ruled the steppe from the Volga to the Dnieper. Hungarian took in hundreds of Turkic words from them, for farming, wine and law, among others. Even the name 'Hungarian' probably comes from 'Onogur', which is what outsiders called them.",
        mapState: { year: 800, lat: 49, lng: 46, zoom: 3.8 },
        highlight: ["Khazars", "Volga Bulgars"],
        markers: [
          { label: "Itil, the Khazar capital", at: [47.6, 46.4] },
          { label: "Bolghar, the Volga Bulgar capital", at: [49.1, 55] },
        ],
        routes: [{ label: "Southwest along the Volga, among Bulgars and Khazars", kind: "migration", path: [[55, 53.5], [51, 52.5], [47, 50], [43, 48.5]] }],
      },
      {
        title: "Levedia and Etelköz",
        text: "By the 800s the Magyars had moved onto the Black Sea steppe, first to an area the Byzantine emperor Constantine VII called Levedia, between the Don and Dnieper, and then to Etelköz, 'the land between the rivers', between the Dnieper and the lower Danube. They were a federation of seven tribes. Three tribes of Kabars, Khazar rebels, joined them as an eighth group, and fought in the front line of their wars.",
        mapState: { year: 850, lat: 47.5, lng: 34, zoom: 4.3 },
        highlight: ["Magyars"],
        markers: [
          { label: "Levedia", at: [38.5, 48] },
          { label: "Etelköz", at: [30, 47.3] },
        ],
        routes: [
          { label: "To Levedia, then Etelköz", kind: "migration", path: [[43, 48.5], [39, 48], [34, 47.6], [30.5, 47.2]] },
          { label: "Kabars, rebels from the Khazar state, join the Magyars", kind: "migration", path: [[46, 46.8], [41, 47.2], [35, 47.3]] },
        ],
      },
      {
        title: "Driven West: 895",
        text: "In 895 the Magyars joined a Byzantine war against the Bulgarians. While their warriors were away, the Pechenegs, another steppe people, attacked their homeland in Etelköz, allied with the Bulgarians. The Magyars could not go back. Under their leader Árpád, they crossed the Carpathian Mountains, by tradition through the Verecke Pass, into the plains of the Carpathian Basin.",
        mapState: { year: 895, lat: 47.5, lng: 26, zoom: 4.6 },
        markers: [{ label: "Verecke Pass", at: [23.3, 48.8] }],
        routes: [
          { label: "Pecheneg attack on Etelköz, 895", kind: "conquest", path: [[40, 48.8], [35, 48.4], [31, 47.6]] },
          { label: "The Magyars cross the Carpathians", kind: "migration", path: [[30, 47.2], [26.5, 48.4], [23.3, 48.8], [21, 47.8]] },
        ],
      },
      {
        title: "The Conquest of the Homeland",
        text: "Hungarians call it the honfoglalás, the 'taking of the homeland'. Over the next few years the Magyars took the Carpathian Basin from the remnants of the Avars, Slavs, the Bulgarians and Great Moravia, which collapsed around 906. They mixed with the people already living there, and the plain became the centre of Hungary, as it still is.",
        mapState: { year: 900, mapYear: 1000, lat: 47, lng: 20, zoom: 5.2 },
        highlight: ["Magyars"],
        markers: [{ label: "Pressburg (Bratislava): Bavarian army destroyed, 907", at: [17.1, 48.15], kind: "battle" }],
        routes: [
          { label: "Spreading across the Carpathian Basin, 895–902", kind: "migration", path: [[21.5, 47.9], [20, 47.4], [18.7, 47.2], [17.5, 47.6]] },
          { label: "South into the Banat", kind: "migration", path: [[21.2, 47.6], [21, 46.6], [20.9, 45.8]] },
        ],
      },
      {
        title: "The Raids Begin",
        text: "From their new home the Magyars raided Europe for half a century. Light cavalry archers moved fast, lived off the land and could not be caught. In 899 they crushed an Italian army on the Brenta River; in 907 they destroyed a Bavarian army at Pressburg; in 910 they beat the East Frankish king near Augsburg. Many towns paid them tribute to be left alone.",
        mapState: { year: 910, mapYear: 1000, lat: 47, lng: 13, zoom: 4.4 },
        highlight: ["Magyars"],
        markers: [
          { label: "Brenta, 899", at: [12, 45.4], kind: "battle" },
          { label: "Augsburg, 910", at: [10.9, 48.37], kind: "battle" },
        ],
        routes: [
          { label: "Into Italy, 899", kind: "raid", path: [[18, 46.8], [15, 46], [12.2, 45.4], [9.2, 45.2]] },
          { label: "Into Bavaria and Saxony, 900s", kind: "raid", path: [[17.5, 47.8], [13.5, 48.3], [10.9, 48.4], [11.5, 51]] },
        ],
      },
      {
        title: "Raids Across the Continent",
        text: "Over the next decades, Magyar raids reached almost everywhere. They burned Bremen in 915 and the monastery of St Gall in 926, crossed the Rhine into Burgundy and southern France in 924, and in 942 rode through northern Italy and southern France as far as Muslim Spain, near Lleida. To the south, they raided the Balkans to the walls of Constantinople, which paid them to stay away.",
        mapState: { year: 935, mapYear: 1000, lat: 46, lng: 12, zoom: 3.6 },
        highlight: ["Magyars"],
        markers: [
          { label: "Bremen, 915", at: [8.8, 53.08] },
          { label: "St Gall, 926", at: [9.37, 47.42] },
          { label: "Lleida, Spain, 942", at: [0.62, 41.62] },
          { label: "Constantinople", at: [28.97, 41.01] },
        ],
        routes: [
          { label: "North to Bremen, 915", kind: "raid", path: [[17.5, 48.2], [13, 50], [10, 52], [8.8, 53]] },
          { label: "Across the Rhine to Burgundy and France, 920s–930s", kind: "raid", path: [[17.5, 47.8], [12, 48], [8, 47.6], [4.5, 47.5], [4, 49.2]] },
          { label: "Through Italy and France into Spain, 942", kind: "raid", path: [[17.8, 46.5], [12, 45.4], [8, 44.6], [4.4, 43.8], [0.6, 41.6]] },
          { label: "Into the Balkans to Constantinople, 934–959", kind: "raid", path: [[21, 46], [22, 44], [25.5, 42.6], [28.9, 41.1]] },
        ],
      },
      {
        title: "Defeat at the Lech: 955",
        text: "The raids began to fail. In 933 King Henry the Fowler beat a Magyar army at Riade in Saxony. In 955, a large Magyar force besieging Augsburg was destroyed on the Lechfeld by Otto I, who soon became Holy Roman Emperor. Their leaders were captured and hanged. After that the western raids stopped, and the Byzantines ended the southern ones at Arcadiopolis in 970.",
        mapState: { year: 955, mapYear: 1000, lat: 47.6, lng: 13, zoom: 5 },
        highlight: ["Magyars"],
        markers: [
          { label: "Riade, 933", at: [11.9, 51.3], kind: "battle" },
          { label: "Lechfeld, 955", at: [10.92, 48.3], kind: "battle" },
        ],
        routes: [
          { label: "The last great raid, 955", kind: "raid", path: [[17.5, 47.8], [14, 48.1], [11, 48.3]] },
          { label: "Survivors flee home", kind: "retreat", path: [[10.8, 48.2], [13, 47.8], [16, 47.6]] },
        ],
      },
      {
        title: "The Kingdom of Hungary",
        text: "The Magyars settled down. Árpád's descendant Géza invited Christian missionaries, and his son Stephen was crowned the first King of Hungary on Christmas Day 1000 (some sources say New Year's Day 1001), with a crown sent with the Pope's blessing. Hungary became a Christian kingdom, a bulwark of Latin Europe on the steppe frontier. Its borders in the Carpathian Basin lasted, with changes, for more than 900 years.",
        mapState: { year: 1100, lat: 47, lng: 20, zoom: 5 },
        highlight: ["Hungary"],
        markers: [{ label: "Esztergom: Stephen crowned, 1000", at: [18.74, 47.79] }],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── Mongols
  {
    slug: "mongol-world-conquest",
    title: "The Mongol Conquests: How Far Did They Get?",
    description:
      "From one steppe confederation in 1206 to an empire from Korea to Hungary in a single lifetime: the campaigns, the invasion of Europe, and the places where the Mongols were finally stopped.",
    duration: 9,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Genghis Khan Unites the Steppe",
        text: "Temüjin was born on the Mongolian steppe around 1162, into a minor clan. Through alliances, war and a rule of rewarding loyalty over birth, he united the Mongol and Turkic tribes. In 1206 an assembly, a kurultai, proclaimed him Genghis Khan. His army was organised in units of ten, hundred and thousand, and could cover huge distances fast, each rider with several horses.",
        mapState: { year: 1206, lat: 47.5, lng: 105, zoom: 3.6 },
        highlight: ["Mongol Empire"],
        markers: [
          { label: "Onon River: kurultai of 1206", at: [111, 48.9] },
          { label: "Karakorum, later the capital", at: [102.8, 47.2] },
        ],
      },
      {
        title: "Northern China",
        text: "Genghis Khan turned first on the Jin dynasty in northern China. The campaigns were long, because the Mongols had to learn siege warfare, recruiting Chinese and Muslim engineers. In 1215 they took and sacked the Jin capital, Zhongdu, today's Beijing. The Jin held out in the south until 1234.",
        mapState: { year: 1215, lat: 42, lng: 112, zoom: 4.2 },
        markers: [{ label: "Zhongdu (Beijing) sacked, 1215", at: [116.4, 39.9] }],
        routes: [{ label: "Invasion of Jin China, 1211–1215", kind: "conquest", path: [[106, 46], [110, 43], [114, 41], [116.4, 39.9]] }],
      },
      {
        title: "The Fall of Khwarazm",
        text: "In 1218 the governor of Otrar, a city of the Khwarazmian Empire in Central Asia, killed a Mongol trade caravan, and the shah then killed or humiliated Genghis Khan's envoys. Genghis answered with one of the most destructive campaigns in history. Bukhara, Samarkand, Urgench, Merv and Nishapur fell in 1219–1221, many with most of their people killed.",
        mapState: { year: 1220, lat: 40, lng: 66, zoom: 4 },
        markers: [
          { label: "Otrar, 1219", at: [68.3, 42.85] },
          { label: "Samarkand, 1220", at: [66.97, 39.65] },
          { label: "Merv, 1221", at: [61.8, 37.66] },
        ],
        routes: [
          { label: "Against Khwarazm, 1219–1221", kind: "conquest", path: [[90, 46], [78, 44], [68.3, 42.8], [66.9, 39.7], [61.8, 37.7]] },
        ],
      },
      {
        title: "A Reconnaissance Around the Caspian",
        text: "Chasing the fleeing shah, the generals Jebe and Subutai rode on in one of history's great cavalry raids. They went round the south of the Caspian Sea, through Georgia and over the Caucasus, onto the steppe north of the Black Sea. In 1223, at the Kalka River, they destroyed an army of Rus' princes and Cumans. Then they rode home. They had seen what lay to the west.",
        mapState: { year: 1223, lat: 44, lng: 48, zoom: 3.8 },
        markers: [{ label: "Kalka River, 1223", at: [37.6, 47.4], kind: "battle" }],
        routes: [
          { label: "Jebe and Subutai's ride, 1220–1223", kind: "raid", path: [[61, 37], [54, 36.5], [48, 38.5], [44.8, 41.7], [45, 44.5], [40, 46.5], [37.6, 47.4]] },
          { label: "Return east along the Volga", kind: "raid", path: [[38, 47.8], [45, 49], [50, 52], [56, 52], [64, 49]] },
        ],
      },
      {
        title: "The Fall of the Rus'",
        text: "Genghis Khan died in 1227. His son Ögedei sent a huge army west under Batu, Genghis's grandson, with Subutai as his general. In the winter of 1237–38 it took Ryazan and Vladimir, using frozen rivers as roads. In 1240 Kyiv fell. For more than two centuries, the Rus' principalities paid tribute to Batu's successors, the Golden Horde.",
        mapState: { year: 1240, lat: 52, lng: 40, zoom: 4 },
        markers: [
          { label: "Ryazan, 1237", at: [39.7, 54.6] },
          { label: "Vladimir, 1238", at: [40.4, 56.13] },
          { label: "Kyiv, 1240", at: [30.5, 50.45] },
        ],
        routes: [
          { label: "Batu's invasion of the Rus', 1237–1240", kind: "conquest", path: [[50, 52], [45, 54], [39.7, 54.6], [40.4, 56.1], [35, 53], [30.5, 50.45]] },
        ],
      },
      {
        title: "Into Europe: 1241",
        text: "In spring 1241 the Mongols struck Central Europe in two prongs. The northern army swept through Poland and on 9 April destroyed a Polish and German army at Legnica. Two days later the main army annihilated the Hungarian army of King Béla IV at Mohi, on the Sajó River. Much of Hungary was devastated; historians estimate it lost a sixth or more of its people.",
        mapState: { year: 1241, lat: 49.5, lng: 20, zoom: 4.6 },
        markers: [
          { label: "Legnica, 9 April 1241", at: [16.16, 51.21], kind: "battle" },
          { label: "Mohi, 11 April 1241", at: [20.95, 47.98], kind: "battle" },
        ],
        routes: [
          { label: "Northern army through Poland", kind: "conquest", path: [[27, 51.5], [22.6, 51.2], [19.9, 50.06], [16.2, 51.2]] },
          { label: "Main army over the Carpathians into Hungary", kind: "conquest", path: [[28, 49], [24.5, 48.6], [23.3, 48.8], [21, 48]] },
        ],
      },
      {
        title: "How Far West They Got",
        text: "Through 1241 the Mongols ravaged Hungary. Patrols reached the outskirts of Wiener Neustadt in Austria. In early 1242 a force led by Kadan chased the fleeing King Béla to the Adriatic coast of Dalmatia, near Split and Trogir, and raided as far south as Kotor. This was as far west as the Mongols ever got: the Adriatic Sea and the edge of Austria.",
        mapState: { year: 1242, lat: 46, lng: 17, zoom: 5 },
        markers: [
          { label: "Wiener Neustadt: the westernmost raids", at: [16.24, 47.81] },
          { label: "Trogir: King Béla takes refuge", at: [16.25, 43.52] },
          { label: "Kotor", at: [18.77, 42.42] },
        ],
        routes: [
          { label: "Patrols to the edge of Austria", kind: "raid", path: [[19, 47.5], [17.5, 47.7], [16.3, 47.8]] },
          { label: "Kadan chases King Béla to the Adriatic, 1242", kind: "raid", path: [[19, 47.3], [17.8, 46], [16.5, 44.5], [16.3, 43.6], [18.7, 42.5]] },
        ],
      },
      {
        title: "The Sudden Retreat",
        text: "In 1242 the Mongols left Europe as suddenly as they had come. News had arrived that Ögedei Khan had died in December 1241, and the princes wanted to be home to choose his successor. Historians also point to Hungary's wet spring, which left too little grass for the horses. Batu settled on the lower Volga and founded the Golden Horde, which dominated the Rus' for 240 years.",
        mapState: { year: 1242, lat: 47, lng: 36, zoom: 3.6 },
        markers: [{ label: "Sarai, Batu's new capital on the Volga", at: [47.1, 47] }],
        routes: [
          { label: "Retreat through Serbia and Bulgaria, 1242", kind: "retreat", path: [[19, 44.5], [22.5, 43.5], [27, 43.5], [30, 45.8], [36, 47.2], [46, 47]] },
        ],
      },
      {
        title: "Baghdad Falls, Egypt Holds",
        text: "In the Middle East, Hulagu, a grandson of Genghis Khan, took Baghdad in 1258, ending the Abbasid Caliphate after 500 years; the caliph was killed and much of the city destroyed. He moved into Syria and took Aleppo and Damascus. But in 1260, at Ain Jalut in Palestine, the Mamluks of Egypt beat a Mongol army. It was one of the first decisive Mongol defeats, and it ended their advance to the southwest. Egypt was never conquered.",
        mapState: { year: 1260, lat: 34, lng: 41, zoom: 4.2 },
        markers: [
          { label: "Baghdad, 1258", at: [44.36, 33.31] },
          { label: "Ain Jalut, 1260: the Mongols stopped", at: [35.35, 32.55], kind: "battle" },
        ],
        routes: [
          { label: "Hulagu's campaign, 1256–1260", kind: "conquest", path: [[53, 36], [48, 34.5], [44.4, 33.3], [40, 36], [37.2, 36.2], [36.3, 33.5], [35.4, 32.6]] },
        ],
      },
      {
        title: "China, Japan and the Limits of the Empire",
        text: "Kublai Khan, another grandson, founded the Yuan dynasty and conquered Song China, taking Hangzhou in 1276. By 1279 the empire, now four khanates, was the largest contiguous land empire in history. But its reach had limits. Invasion fleets sent against Japan in 1274 and 1281 were wrecked by storms, the 'kamikaze' or divine winds. Campaigns in Vietnam and Java also failed.",
        mapState: { year: 1279, lat: 40, lng: 85, zoom: 2.3 },
        highlight: ["Khanate of the Golden Horde", "Ilkhanate", "Chagatai Khanate"],
        markers: [
          { label: "Hangzhou, 1276", at: [120.15, 30.27] },
          { label: "Hakata Bay: invasions of Japan fail, 1274 and 1281", at: [130.4, 33.6], kind: "battle" },
        ],
        routes: [
          { label: "Conquest of Song China, 1268–1279", kind: "conquest", path: [[112, 36], [114, 32], [118, 30.5], [120.1, 30.3]] },
          { label: "Fleets against Japan, 1274 and 1281", kind: "voyage", path: [[126.5, 37], [128.8, 35], [130.3, 33.7]] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── Vikings
  {
    slug: "viking-voyages",
    title: "The Vikings: Raiders, Traders and Explorers",
    description:
      "From the raid on Lindisfarne in 793 to Baghdad's silver, the walls of Constantinople and a camp in Newfoundland: how far the Norse travelled, and how they reached North America five centuries before Columbus.",
    duration: 9,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Ships From the North",
        text: "In the 700s, Scandinavia was a land of farmers, chieftains and small kingdoms. Its people had one great advantage: the longship, light, flexible and shallow enough to sail the open sea and row far up rivers. When population pressure, ambition and the wealth of Europe's undefended monasteries came together, they set out. The people of the time called them Northmen; 'viking' meant going on an expedition.",
        mapState: { year: 790, lat: 60, lng: 12, zoom: 4 },
        highlight: ["Swedes"],
        markers: [
          { label: "Hedeby, Danish trading town", at: [9.57, 54.49] },
          { label: "Birka, Swedish trading town", at: [17.54, 59.33] },
          { label: "Western Norway", at: [6, 61] },
        ],
      },
      {
        title: "Lindisfarne: 793",
        text: "On 8 June 793, Norse raiders sacked the monastery of Lindisfarne, an island off Northumbria. The scholar Alcuin wrote that such terror had never been seen in Britain. It is the traditional start of the Viking Age. Raids on Scotland's islands and on Ireland followed within a few years, and Norwegians settled the Orkneys, Shetland and Hebrides.",
        mapState: { year: 793, lat: 57, lng: -2, zoom: 4.6 },
        markers: [
          { label: "Lindisfarne, 793", at: [-1.8, 55.67] },
          { label: "Iona, raided 795", at: [-6.4, 56.33] },
        ],
        routes: [
          { label: "Norwegian raids on Britain, 793", kind: "raid", path: [[5.3, 60.4], [1, 58.5], [-1.8, 55.7]] },
          { label: "Around Scotland to Iona and Ireland, 795", kind: "raid", path: [[5, 61], [-1, 60.5], [-3.5, 59], [-6.4, 56.4], [-6.3, 54.5]] },
        ],
      },
      {
        title: "England, Ireland and the Frankish Rivers",
        text: "Raids became conquests. Norse founded Dublin in 841. A great Danish army landed in England in 865, took York the next year, and conquered most of the English kingdoms; only Wessex, under Alfred the Great, held out, and the north and east became the Danelaw. In France, fleets rowed up the Seine and sacked Paris in 845, and besieged it again in 885–86.",
        mapState: { year: 866, lat: 52, lng: -2, zoom: 4.3 },
        markers: [
          { label: "Dublin, founded 841", at: [-6.26, 53.35] },
          { label: "York, taken 866", at: [-1.08, 53.96] },
          { label: "Paris, sacked 845", at: [2.35, 48.86] },
        ],
        routes: [
          { label: "The Great Heathen Army, 865–878", kind: "conquest", path: [[9.5, 55], [4, 54], [1.3, 52.7], [-1.1, 53.9], [-1.5, 52.4], [-2, 51.3]] },
          { label: "Up the Seine to Paris, 845", kind: "raid", path: [[8.5, 55], [4, 53], [0, 49.6], [1.1, 49.4], [2.3, 48.85]] },
          { label: "Norwegians in Ireland", kind: "conquest", path: [[-3.5, 59], [-6, 57], [-6.3, 53.4]] },
        ],
      },
      {
        title: "Into the Mediterranean",
        text: "In 844 a Viking fleet sailed round Spain and sacked Seville, before the Emirate of Córdoba defeated it. In 859–861 Björn Ironside and Hastein led about sixty ships through the Strait of Gibraltar, raiding Spain, North Africa, southern France and Italy, where they sacked the town of Luna, by legend mistaking it for Rome.",
        mapState: { year: 860, lat: 41, lng: -2, zoom: 3.8 },
        markers: [
          { label: "Seville, 844", at: [-5.98, 37.39] },
          { label: "Luna, Italy, 860", at: [10.03, 44.06] },
        ],
        routes: [
          { label: "Raid on Seville, 844", kind: "raid", path: [[-1, 47], [-6, 46], [-9.5, 42], [-9, 38], [-6.3, 36.8], [-6, 37.4]] },
          { label: "Björn and Hastein in the Mediterranean, 859–861", kind: "raid", path: [[-9.6, 40], [-7, 36.4], [-5.4, 35.95], [-1, 36.8], [3, 41], [4.6, 43.4], [7.5, 43.6], [10, 44]] },
        ],
      },
      {
        title: "East: The Rus' and the Road to Byzantium",
        text: "Swedish Norse went east, across the Baltic and down the great rivers of eastern Europe, trading furs and slaves for silver. Called Rus' and Varangians, they founded or ruled towns such as Novgorod and Kyiv; by tradition Rurik took Novgorod in 862. Down the Dnieper they reached the Black Sea and attacked Constantinople in 860. Later, Varangians served the Byzantine emperors as their elite guard.",
        mapState: { year: 900, lat: 52, lng: 30, zoom: 3.8 },
        highlight: ["Kyivan Rus"],
        markers: [
          { label: "Novgorod", at: [31.27, 58.52] },
          { label: "Kyiv", at: [30.52, 50.45] },
          { label: "Constantinople, attacked 860", at: [28.97, 41.01] },
        ],
        routes: [
          { label: "Down the Dnieper to Constantinople", kind: "voyage", path: [[18, 59.3], [24, 59.6], [30, 60], [31.3, 58.5], [31, 55], [30.5, 50.5], [32.5, 47], [31, 44.5], [29, 41.1]] },
        ],
      },
      {
        title: "To the Caspian and Baghdad's Silver",
        text: "Another route ran down the Volga, through the lands of the Volga Bulgars and the Khazars, to the Caspian Sea. There Norse traders met merchants from the Abbasid Caliphate, and some went on by camel to Baghdad. Tens of thousands of Arab silver coins, dirhams, have been found in Scandinavia, most of them on the Swedish island of Gotland. Arab writers such as Ibn Fadlan described the Rus' they met on the Volga.",
        mapState: { year: 922, lat: 50, lng: 42, zoom: 3.3 },
        highlight: ["Volga Bulgars", "Khazars"],
        markers: [
          { label: "Bolghar: Ibn Fadlan meets the Rus', 922", at: [49.1, 55] },
          { label: "Baghdad", at: [44.36, 33.31] },
          { label: "Gotland: hoards of Arab silver", at: [18.5, 57.5] },
        ],
        routes: [
          { label: "Down the Volga to the Caspian", kind: "voyage", path: [[31.3, 58.5], [38, 57.5], [44, 56.3], [49, 55], [46.5, 50], [47.6, 46.4], [50, 41], [52, 37.5]] },
          { label: "Silver flows back north", kind: "spread", path: [[44.4, 33.3], [49, 38], [47.5, 46], [45, 52], [38, 57], [25, 58], [18.5, 57.5]] },
        ],
      },
      {
        title: "Normandy and the Normans",
        text: "In 911 the Frankish king Charles the Simple gave a Viking leader, Rollo, land at the mouth of the Seine, on condition that he defend it against other Vikings. It became Normandy, 'land of the Northmen'. Within a few generations the Normans spoke French, and they set off on conquests of their own: England in 1066, and southern Italy and Sicily.",
        mapState: { year: 1066, lat: 47, lng: 2, zoom: 3.9 },
        markers: [
          { label: "Rouen: Rollo's Normandy, 911", at: [1.1, 49.44] },
          { label: "Hastings, 1066", at: [0.49, 50.91], kind: "battle" },
          { label: "Sicily: Norman conquest from 1061", at: [14, 37.6] },
        ],
        routes: [
          { label: "William's invasion of England, 1066", kind: "conquest", path: [[-0.2, 49.3], [0.2, 50], [0.5, 50.9]] },
          { label: "Normans to southern Italy and Sicily", kind: "conquest", path: [[0.5, 49], [4.8, 45.8], [7.5, 44], [12.5, 42], [15, 41], [14, 37.6]] },
        ],
      },
      {
        title: "Across the North Atlantic",
        text: "Norse sailors went west over the open ocean. They settled the Faroe Islands, and from about 874 Iceland, which by 930 had its own assembly, the Althing. In 982 Erik the Red, banished from Iceland for killing, sailed west and explored Greenland. He returned in 985 or 986 with settlers; at their height, the Greenland settlements held perhaps 2,000 to 3,000 people.",
        mapState: { year: 985, lat: 62, lng: -25, zoom: 2.9 },
        markers: [
          { label: "Iceland, settled from c. 874", at: [-21.9, 64.15] },
          { label: "Brattahlíð: Erik the Red's farm", at: [-45.5, 61.15] },
        ],
        routes: [
          { label: "To the Faroes and Iceland, 800s", kind: "voyage", path: [[5.3, 60.4], [-3, 60.5], [-7, 62], [-14, 64], [-21.9, 64.1]] },
          { label: "Erik the Red to Greenland, 985", kind: "voyage", path: [[-22.5, 64.8], [-30, 65], [-38, 63], [-43, 60.6], [-45.5, 61.15]] },
        ],
      },
      {
        title: "Vinland: Norse in North America",
        text: "Around 1000, Erik's son Leif Erikson sailed from Greenland to lands to the west and south. The Icelandic sagas name three: Helluland ('flat-stone land', probably Baffin Island), Markland ('forest land', probably Labrador), and Vinland, where grapes grew. In the 1960s, archaeologists found a Norse camp at L'Anse aux Meadows in Newfoundland. Tree rings in its timber show wood was cut there in 1021. The Norse did not stay; the settlements in North America were short-lived.",
        mapState: { year: 1021, lat: 57, lng: -54, zoom: 3.3 },
        markers: [
          { label: "Helluland (Baffin Island?)", at: [-66, 66] },
          { label: "Markland (Labrador?)", at: [-60, 54.5] },
          { label: "L'Anse aux Meadows: wood cut in 1021", at: [-55.53, 51.6] },
        ],
        routes: [
          { label: "Leif Erikson's voyage, c. 1000", kind: "voyage", path: [[-45.5, 61.1], [-48.5, 60.4], [-53, 63.5], [-58, 66.5], [-63, 65], [-62.5, 59], [-59.5, 55], [-56.5, 52.5], [-55.6, 51.6]] },
        ],
      },
      {
        title: "The End of the Viking Age",
        text: "By the 1000s, the Scandinavian kingdoms were becoming Christian monarchies like the rest of Europe. Harald Hardrada, King of Norway and a former commander of the Byzantine emperor's Varangian Guard, died invading England at Stamford Bridge in 1066. That battle is often taken as the end of the Viking Age. The Greenland settlements survived until the 1400s, then vanished.",
        mapState: { year: 1100, lat: 60, lng: 5, zoom: 3.4 },
        highlight: ["Norway", "Denmark", "Sweden"],
        markers: [{ label: "Stamford Bridge, 1066", at: [-0.91, 53.99], kind: "battle" }],
        routes: [{ label: "Harald Hardrada's invasion, 1066", kind: "conquest", path: [[5.3, 60.4], [0, 58], [-0.5, 54.5], [-0.9, 54]] }],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────── Reconquista
  {
    slug: "reconquista",
    title: "The Reconquista: Seven Centuries in Iberia",
    description:
      "From the Muslim conquest of 711 to the fall of Granada in 1492: how al-Andalus rose and fragmented, and how the Christian kingdoms of the north pushed south, frontier by frontier.",
    duration: 8,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "The Conquest of 711",
        text: "In 711 an army of Arabs and Berbers under Tariq ibn Ziyad crossed from North Africa at the rock that still bears his name, Gibraltar (Jabal Tariq). At the Guadalete River they defeated and killed Roderic, the Visigothic king. Within about seven years almost all of the Iberian Peninsula was under the rule of the Umayyad Caliphate. Muslims called it al-Andalus.",
        mapState: { year: 711, lat: 39.5, lng: -4, zoom: 5 },
        highlight: ["Umayyad Caliphate"],
        markers: [
          { label: "Gibraltar, 711", at: [-5.35, 36.14] },
          { label: "Guadalete: Roderic killed", at: [-5.8, 36.6], kind: "battle" },
          { label: "Toledo, the Visigothic capital", at: [-4.02, 39.86] },
        ],
        routes: [
          { label: "Tariq crosses from Africa, 711", kind: "conquest", path: [[-5.6, 35.7], [-5.4, 36.1], [-5.8, 36.6], [-4.8, 37.9], [-4, 39.8]] },
          { label: "The conquest reaches the north, 711–718", kind: "conquest", path: [[-4, 39.9], [-3, 41.5], [-1, 41.7], [1, 42.8]] },
        ],
      },
      {
        title: "Covadonga and the Kingdom of Asturias",
        text: "One corner held out. In the mountains of Asturias, a Visigothic noble named Pelayo beat a small Muslim force at Covadonga around 722. Later Christian chroniclers made it the start of the Reconquista, the 'reconquest'. Meanwhile, Muslim armies crossed the Pyrenees into France, until Charles Martel's Franks stopped them between Tours and Poitiers in 732.",
        mapState: { year: 732, lat: 42.5, lng: -2, zoom: 4.6 },
        markers: [
          { label: "Covadonga, c. 722", at: [-5.06, 43.31], kind: "battle" },
          { label: "Tours–Poitiers, 732", at: [0.4, 46.75], kind: "battle" },
        ],
        routes: [
          { label: "Raid into France, stopped in 732", kind: "raid", path: [[-1.6, 42.8], [-1.4, 43.6], [-0.5, 44.8], [0.4, 46.6]] },
          { label: "Retreat south of the Pyrenees", kind: "retreat", path: [[0.2, 46.4], [1.5, 44.5], [2.5, 43], [2, 41.6]] },
        ],
      },
      {
        title: "The Caliphate of Córdoba",
        text: "In 756 Abd al-Rahman, a surviving Umayyad prince who escaped the massacre of his family in Syria, made himself emir in Córdoba. In 929 his descendant Abd al-Rahman III declared himself caliph. Córdoba became one of the largest and richest cities in Europe, with its great mosque, libraries and scholars. In the north, Charlemagne's Franks took Barcelona in 801, creating a Spanish March.",
        mapState: { year: 1000, lat: 40, lng: -4, zoom: 5 },
        highlight: ["Caliphate of Córdoba"],
        markers: [
          { label: "Córdoba", at: [-4.78, 37.88] },
          { label: "Barcelona, taken by the Franks, 801", at: [2.17, 41.39] },
        ],
        routes: [
          { label: "Abd al-Rahman flees the Abbasids, 750–756", kind: "migration", path: [[36.3, 33.5], [25, 32], [10, 34], [0, 35.5], [-4.5, 36.8], [-4.8, 37.9]] },
        ],
      },
      {
        title: "Taifas and the Fall of Toledo",
        text: "In 1031 the Caliphate of Córdoba broke apart into more than twenty small kingdoms, the taifas. They fought each other, and paid tribute (parias) to the Christian kings for protection. In 1085 Alfonso VI of León and Castile took Toledo, the old Visigothic capital, in the heart of the peninsula. It was the biggest Christian gain yet, and the frontier moved to the Tagus.",
        mapState: { year: 1085, lat: 40.5, lng: -3.5, zoom: 5 },
        highlight: ["Castilla"],
        markers: [{ label: "Toledo, taken 1085", at: [-4.02, 39.86] }],
        routes: [{ label: "Castile takes Toledo, 1085", kind: "conquest", path: [[-4.2, 42.3], [-3.7, 41], [-4, 39.9]] }],
      },
      {
        title: "Almoravids and Almohads",
        text: "Alarmed, the taifa kings called on the Almoravids, a Berber movement that ruled Morocco. They crossed in 1086 and beat Alfonso VI at Sagrajas, then took over the taifas themselves. In the 1140s they were replaced by another Moroccan movement, the Almohads. The Christian kingdoms kept advancing anyway: Aragon took Zaragoza in 1118, and Portugal, with the help of crusaders, took Lisbon in 1147.",
        mapState: { year: 1147, lat: 38.5, lng: -5, zoom: 4.6 },
        highlight: ["Almoravid dynasty"],
        markers: [
          { label: "Sagrajas, 1086", at: [-6.9, 38.9], kind: "battle" },
          { label: "Zaragoza, taken 1118", at: [-0.88, 41.65] },
          { label: "Lisbon, taken 1147", at: [-9.14, 38.72] },
        ],
        routes: [
          { label: "The Almoravids cross from Morocco, 1086", kind: "conquest", path: [[-8, 31.6], [-6.8, 33.9], [-5.6, 35.8], [-5.4, 36.2], [-6.9, 38.9]] },
          { label: "Portugal and the crusaders take Lisbon, 1147", kind: "conquest", path: [[-8.6, 41.2], [-8.4, 40.2], [-9.1, 38.75]] },
        ],
      },
      {
        title: "Las Navas de Tolosa: 1212",
        text: "In 1212 the kings of Castile, Aragon and Navarre, with crusaders from across Europe, crushed the Almohad army at Las Navas de Tolosa. Almohad power in Iberia collapsed. Within forty years the Christian kingdoms took most of the south: Córdoba in 1236, Valencia in 1238, Seville in 1248, and Portugal reached the Algarve coast in 1249.",
        mapState: { year: 1248, lat: 38.7, lng: -4, zoom: 5 },
        highlight: ["Castilla", "Portugal", "Aragón"],
        markers: [
          { label: "Las Navas de Tolosa, 1212", at: [-3.58, 38.28], kind: "battle" },
          { label: "Córdoba, 1236", at: [-4.78, 37.88] },
          { label: "Valencia, 1238", at: [-0.38, 39.47] },
          { label: "Seville, 1248", at: [-5.98, 37.39] },
        ],
        routes: [
          { label: "Castile takes the Guadalquivir valley", kind: "conquest", path: [[-4, 39.9], [-3.6, 38.3], [-4.8, 37.9], [-6, 37.4]] },
          { label: "Aragon takes Valencia, 1238", kind: "conquest", path: [[-0.9, 41.6], [-0.5, 40.4], [-0.4, 39.5]] },
          { label: "Portugal reaches the Algarve, 1249", kind: "conquest", path: [[-9.1, 38.7], [-8.6, 38.1], [-8.2, 37.6]] },
        ],
      },
      {
        title: "Granada: The Last Emirate",
        text: "Only the Nasrid Emirate of Granada survived, a mountainous kingdom in the south that paid tribute to Castile. For two and a half centuries it lasted, and built the Alhambra. The frontier was a place of raids, truces and trade. In Castile and Aragon, Christians, Muslims and Jews lived side by side, under growing pressure, in what historians call convivencia.",
        mapState: { year: 1400, lat: 37.5, lng: -4, zoom: 5.6 },
        highlight: ["Granada"],
        markers: [{ label: "Granada and the Alhambra", at: [-3.59, 37.18] }],
      },
      {
        title: "1492",
        text: "The marriage of Isabella of Castile and Ferdinand of Aragon in 1469 united the two largest Christian kingdoms. After a ten-year war, Granada surrendered on 2 January 1492. The same year, the Catholic Monarchs expelled Spain's Jews, and Columbus, sponsored by Isabella, sailed west. Muslims were forced to convert in the following years and their descendants, the Moriscos, were expelled in 1609–1614.",
        mapState: { year: 1492, lat: 39.5, lng: -4, zoom: 4.8 },
        highlight: ["Castille", "Aragón"],
        markers: [{ label: "Granada surrenders, 2 January 1492", at: [-3.59, 37.18] }],
        routes: [
          { label: "The Granada War, 1482–1492", kind: "conquest", path: [[-4.8, 37.9], [-4.5, 37.3], [-3.6, 37.2]] },
          { label: "Columbus sails west, August 1492", kind: "voyage", path: [[-6.9, 37.2], [-12, 32], [-16, 28.1], [-25, 26]] },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────── Black Death
  {
    slug: "black-death",
    title: "The Black Death",
    description:
      "How plague travelled from Central Asia along the trade routes of the Mongol world, reached Europe through the Crimea in 1347, and killed perhaps a third to a half of Europe's people in five years.",
    duration: 7,
    difficulty: "standard",
    trail: true,
    steps: [
      {
        title: "Out of Central Asia",
        text: "The Black Death was bubonic plague, caused by the bacterium Yersinia pestis, which lives in wild rodents and is spread by their fleas. DNA from graves near Lake Issyk-Kul, in today's Kyrgyzstan, where gravestones record a 'pestilence' in 1338–1339, shows the strain that caused the pandemic was there then. The Mongol empire's trade routes carried it west.",
        mapState: { year: 1338, lat: 44, lng: 66, zoom: 3.3 },
        highlight: ["Chagatai Khanate", "Khanate of the Golden Horde"],
        markers: [{ label: "Lake Issyk-Kul: plague graves, 1338–39", at: [77, 42.4] }],
        routes: [{ label: "Along the steppe trade routes", kind: "plague", path: [[77, 42.4], [68, 43], [60, 45], [52, 46.5], [47, 47]] }],
      },
      {
        title: "Caffa: 1346",
        text: "In 1346 the army of the Golden Horde was besieging Caffa, a Genoese trading port in the Crimea, when plague broke out among the soldiers. An Italian writer, Gabriele de' Mussi, later claimed they catapulted corpses over the walls. Historians doubt that was how it spread, but Italian ships leaving Caffa and other Black Sea ports carried the disease south.",
        mapState: { year: 1346, lat: 45, lng: 38, zoom: 4.3 },
        markers: [
          { label: "Caffa (Feodosia), 1346", at: [35.38, 45.03] },
          { label: "Sarai", at: [47.1, 47] },
        ],
        routes: [{ label: "To the Black Sea ports", kind: "plague", path: [[47, 47], [42, 46.5], [38, 45.5], [35.4, 45]] }],
      },
      {
        title: "The Mediterranean: 1347",
        text: "In 1347 plague reached Constantinople, then Alexandria. In October, Genoese galleys brought it to Messina in Sicily. By November it was in Marseille, and by early 1348 in Genoa, Venice and the ports of North Africa. Ships were the fastest way for the disease to travel, and every port city on the Mediterranean was within reach.",
        mapState: { year: 1347, lat: 39, lng: 20, zoom: 3.8 },
        markers: [
          { label: "Constantinople", at: [28.97, 41.01] },
          { label: "Messina, October 1347", at: [15.55, 38.19] },
          { label: "Marseille, November 1347", at: [5.37, 43.3] },
          { label: "Alexandria", at: [29.92, 31.2] },
        ],
        routes: [
          { label: "By ship to Constantinople and Sicily", kind: "plague", path: [[35.4, 45], [31, 43.5], [29, 41.1], [25, 38.5], [20, 37.5], [15.6, 38.2]] },
          { label: "On to Genoa and Marseille", kind: "plague", path: [[15.6, 38.2], [12, 40.5], [9.5, 43.5], [8.9, 44.4], [5.4, 43.3]] },
          { label: "To Egypt", kind: "plague", path: [[28.5, 40.5], [27.5, 36], [29.9, 31.2]] },
        ],
      },
      {
        title: "Italy, France and Spain: 1348",
        text: "In 1348 the plague spread inland. Florence lost perhaps half its people; Giovanni Boccaccio set his Decameron among young people fleeing it. Paris, Avignon, where the Pope lived, and Barcelona were struck. People had no idea what caused it. Some blamed bad air, some God's anger; in many German and French towns, Jewish communities were falsely accused of poisoning wells and massacred.",
        mapState: { year: 1348, lat: 45, lng: 6, zoom: 4.3 },
        markers: [
          { label: "Florence", at: [11.25, 43.77] },
          { label: "Avignon", at: [4.8, 43.95] },
          { label: "Paris", at: [2.35, 48.86] },
          { label: "Barcelona", at: [2.17, 41.39] },
        ],
        routes: [
          { label: "North up the Rhône to Paris", kind: "plague", path: [[5.4, 43.3], [4.8, 44], [4.8, 45.8], [3.5, 47.5], [2.35, 48.86]] },
          { label: "Into Tuscany", kind: "plague", path: [[8.9, 44.4], [10.3, 43.7], [11.25, 43.77]] },
          { label: "Along the coast to Spain", kind: "plague", path: [[5.4, 43.3], [3, 43], [2.2, 41.4], [-0.4, 39.5]] },
        ],
      },
      {
        title: "England and the North: 1348–1349",
        text: "Plague reached England in June 1348 at Melcombe, in Dorset, and London that autumn. In 1349 an English ship is said to have brought it to Bergen, in Norway; from there it spread across Scandinavia. It also moved east through the German lands. Iceland, too remote for ships that year, escaped the first wave entirely.",
        mapState: { year: 1349, lat: 54, lng: 5, zoom: 3.8 },
        markers: [
          { label: "Melcombe, June 1348", at: [-2.46, 50.61] },
          { label: "London", at: [-0.13, 51.51] },
          { label: "Bergen, 1349", at: [5.32, 60.39] },
        ],
        routes: [
          { label: "Across the Channel to England, 1348", kind: "plague", path: [[-1.5, 46.5], [-3, 48.6], [-2.5, 50.6]] },
          { label: "By ship to Norway, 1349", kind: "plague", path: [[-0.1, 51.5], [2, 54], [5.3, 60.4]] },
          { label: "Through the German lands", kind: "plague", path: [[7.5, 47.6], [9, 50], [10, 53.5], [13.4, 52.5]] },
        ],
      },
      {
        title: "Russia and the Toll: 1351–1353",
        text: "The pandemic came full circle, reaching Russia from the west by 1352–1353 and killing the Grand Prince of Moscow, Simeon the Proud. In about five years it had killed, by modern estimates, a third to a half of Europe's population, perhaps 25 million people or more, and huge numbers in the Middle East. Plague kept returning every few years for centuries.",
        mapState: { year: 1353, lat: 53, lng: 25, zoom: 3.2 },
        markers: [
          { label: "Novgorod and Pskov, 1352", at: [31.27, 58.52] },
          { label: "Moscow, 1353", at: [37.62, 55.75] },
        ],
        routes: [{ label: "East into Russia", kind: "plague", path: [[13.4, 52.5], [20, 54], [25, 56], [31.3, 58.5], [37.6, 55.75]] }],
      },
      {
        title: "A Changed Europe",
        text: "With so many workers dead, the survivors could demand higher wages and better terms. Rulers tried to freeze wages by law, as in England's Statute of Labourers of 1351, and peasant revolts followed, in France in 1358 and England in 1381. In much of western Europe, serfdom faded. Some historians argue that the shock helped pave the way for the changes of the Renaissance.",
        mapState: { year: 1400, lat: 48, lng: 8, zoom: 3.6 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────── Renaissance
  {
    slug: "renaissance",
    title: "The Renaissance: A Rebirth Spreads From Italy",
    description:
      "How the rediscovery of ancient Greece and Rome began in the city-states of Italy, how the printing press carried new ideas across Europe, and how artists in Flanders, Germany and Hungary took them up.",
    duration: 7,
    difficulty: "standard",
    steps: [
      {
        title: "Why Italy?",
        text: "Around 1400, northern Italy was a patchwork of rich, competing city-states: Florence, Venice, Milan, Genoa, and the Papal States around Rome. Their merchants and bankers had money to spend on art and learning, and ancient Roman ruins were all around them. Scholars called humanists, following the poet Petrarch, hunted for lost Latin texts and wanted to revive the culture of the ancient world.",
        mapState: { year: 1400, lat: 44, lng: 11, zoom: 5.4 },
        highlight: ["Venice"],
        markers: [
          { label: "Florence", at: [11.25, 43.77] },
          { label: "Venice", at: [12.34, 45.44] },
          { label: "Milan", at: [9.19, 45.46] },
          { label: "Rome", at: [12.5, 41.9] },
        ],
      },
      {
        title: "Florence and the Medici",
        text: "Florence led the way. Its banking family, the Medici, paid for buildings, paintings and scholars. Brunelleschi worked out the rules of linear perspective and built the great dome of Florence Cathedral, finished in 1436. Donatello revived classical sculpture, and Masaccio painted figures that seemed to stand in real space.",
        mapState: { year: 1436, lat: 43.77, lng: 11.25, zoom: 6.6 },
        markers: [{ label: "Florence Cathedral dome, 1436", at: [11.256, 43.773] }],
      },
      {
        title: "Greek Scholars Come West",
        text: "Western Europe had largely lost the ability to read ancient Greek. From the 1390s, Byzantine scholars came to Italy to teach it, bringing manuscripts of Plato and other Greek authors. The flow increased as the Ottoman Turks closed in on Constantinople, which fell in 1453. Cardinal Bessarion, a Greek who settled in Italy, left his huge library to Venice.",
        mapState: { year: 1453, lat: 40, lng: 20, zoom: 4.2 },
        highlight: ["Ottoman Empire"],
        markers: [{ label: "Constantinople falls, 1453", at: [28.97, 41.01] }],
        routes: [
          { label: "Greek scholars and manuscripts to Italy", kind: "spread", path: [[29, 41], [24, 39], [19.5, 39.8], [16, 41.3], [12.3, 45.4]] },
          { label: "To Florence", kind: "spread", path: [[19, 40.5], [14.5, 42], [11.3, 43.8]] },
        ],
      },
      {
        title: "The Printing Press",
        text: "Around 1450, in Mainz, Johannes Gutenberg began printing with movable metal type; his Bible was finished around 1455. Printers spread with astonishing speed, many of them Germans: to Italy by 1465, Paris by 1470, Kraków by 1473 and London (Westminster) by 1476. By 1500 there were presses in some 250 towns, and ideas could travel in thousands of identical copies.",
        mapState: { year: 1476, lat: 49, lng: 10, zoom: 4 },
        markers: [{ label: "Mainz: Gutenberg, c. 1450", at: [8.27, 50] }],
        routes: [
          { label: "To Italy: Subiaco and Rome 1465, Venice 1469", kind: "spread", path: [[8.27, 50], [9.5, 47.5], [11, 45.8], [12.3, 45.4]] },
          { label: "To Paris, 1470", kind: "spread", path: [[8.27, 50], [5.5, 49.3], [2.35, 48.86]] },
          { label: "To Kraków, 1473", kind: "spread", path: [[8.27, 50], [13.5, 50.8], [19.94, 50.06]] },
          { label: "To Westminster, 1476", kind: "spread", path: [[8.27, 50], [4.4, 51.2], [-0.13, 51.5]] },
        ],
      },
      {
        title: "The High Renaissance in Rome",
        text: "Around 1500, the popes made Rome the capital of the Renaissance. Leonardo da Vinci, Michelangelo and Raphael all worked there or in Florence and Milan. Michelangelo painted the Sistine Chapel ceiling in 1508–1512; Raphael painted the School of Athens for Pope Julius II; Bramante designed the new St Peter's Basilica.",
        mapState: { year: 1510, lat: 42.5, lng: 12, zoom: 5.6 },
        markers: [
          { label: "Rome: Sistine Chapel ceiling, 1508–12", at: [12.454, 41.903] },
          { label: "Milan: Leonardo's Last Supper, c. 1495–98", at: [9.17, 45.47] },
        ],
      },
      {
        title: "The Northern Renaissance",
        text: "North of the Alps, the Renaissance took its own shape. In Flanders, Jan van Eyck had already perfected oil painting in the 1430s. Albrecht Dürer of Nuremberg travelled to Venice twice and brought Italian ideas home. Erasmus of Rotterdam, the greatest humanist scholar of his age, published the Greek New Testament in 1516. In Hungary, King Matthias Corvinus built one of Europe's finest libraries in Buda.",
        mapState: { year: 1500, lat: 49, lng: 10, zoom: 4.1 },
        markers: [
          { label: "Bruges and Ghent: van Eyck", at: [3.4, 51.1] },
          { label: "Nuremberg: Dürer", at: [11.08, 49.45] },
          { label: "Buda: Matthias Corvinus's library", at: [19.04, 47.5] },
        ],
        routes: [
          { label: "Dürer's journeys to Venice, 1494 and 1505", kind: "spread", path: [[12.34, 45.44], [11.3, 47.3], [11.08, 49.45]] },
          { label: "Italian humanists at the Hungarian court", kind: "spread", path: [[11.25, 43.77], [14, 45.6], [17, 46.7], [19.04, 47.5]] },
          { label: "Renaissance ideas reach Flanders and France", kind: "spread", path: [[9.19, 45.46], [6, 46.5], [3.5, 49], [3.4, 51.1]] },
        ],
      },
      {
        title: "A New Way of Seeing",
        text: "By the mid-1500s Renaissance ideas had spread across Europe, from England to Poland, and the printing press had made them permanent. The Renaissance put the individual and the natural world at the centre of art and learning. It also set the stage for what came next: the Reformation, which used the printing press to split the Church, and the Scientific Revolution.",
        mapState: { year: 1550, lat: 48, lng: 10, zoom: 3.4 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────── Reformation
  {
    slug: "reformation",
    title: "The Reformation: Christendom Divided",
    description:
      "How a monk's protest in Wittenberg in 1517, spread by the printing press, split Western Christianity into Catholic and Protestant Europe, and led to more than a century of religious wars.",
    duration: 7,
    difficulty: "standard",
    steps: [
      {
        title: "Wittenberg: 1517",
        text: "In 1517 Martin Luther, a monk teaching at the small university of Wittenberg in Saxony, wrote his Ninety-five Theses against the sale of indulgences, payments said to reduce punishment for sins. Printers copied them, and within weeks they were being read across Germany. Luther went on to argue that salvation came through faith alone, and that the Bible, not the Pope, was the final authority.",
        mapState: { year: 1517, lat: 51.5, lng: 11.5, zoom: 5.6 },
        highlight: ["Holy Roman Empire"],
        markers: [{ label: "Wittenberg: the Ninety-five Theses, 1517", at: [12.65, 51.87] }],
        routes: [{ label: "Printed copies spread through Germany", kind: "spread", path: [[12.65, 51.87], [11, 50.5], [10.5, 49], [9, 48]] }],
      },
      {
        title: "Here I Stand: Worms, 1521",
        text: "The Pope excommunicated Luther in 1521. That year, at the Diet of Worms, the young Emperor Charles V demanded he take back his writings; Luther refused. He was declared an outlaw, but his prince, Frederick of Saxony, hid him in Wartburg Castle, where he translated the New Testament into German. Many German princes and cities adopted the new faith.",
        mapState: { year: 1521, lat: 50.5, lng: 10, zoom: 5.4 },
        markers: [
          { label: "Worms, 1521", at: [8.36, 49.63] },
          { label: "Wartburg Castle", at: [10.31, 50.97] },
        ],
        routes: [{ label: "Luther's journey to Worms", kind: "migration", path: [[12.65, 51.87], [11, 50.9], [9.5, 50.2], [8.36, 49.63]] }],
      },
      {
        title: "Zurich and Geneva",
        text: "The Reformation was never one movement. In Zurich, Huldrych Zwingli led a more radical reform from 1519. In Geneva, the Frenchman John Calvin built a reformed church and city from 1541; his ideas spread to France (the Huguenots), the Netherlands, Scotland, and Hungary and Transylvania, where Debrecen became known as the 'Calvinist Rome'.",
        mapState: { year: 1560, lat: 48, lng: 10, zoom: 3.8 },
        markers: [
          { label: "Zurich: Zwingli, 1519", at: [8.54, 47.37] },
          { label: "Geneva: Calvin, from 1541", at: [6.14, 46.2] },
          { label: "Debrecen, the 'Calvinist Rome'", at: [21.63, 47.53] },
        ],
        routes: [
          { label: "Calvinism to France", kind: "spread", path: [[6.14, 46.2], [4, 46], [2.35, 48.8]] },
          { label: "To the Netherlands", kind: "spread", path: [[6.14, 46.2], [7.5, 48.5], [5.5, 51], [4.9, 52.37]] },
          { label: "To Scotland: John Knox, 1560", kind: "spread", path: [[6.14, 46.2], [3, 49.5], [0, 53], [-3.19, 55.95]] },
          { label: "To Hungary and Transylvania", kind: "spread", path: [[8.54, 47.37], [13, 48], [17.5, 47.8], [21.63, 47.53]] },
        ],
      },
      {
        title: "Kings Break With Rome",
        text: "Rulers joined in, for faith and for power. In Scandinavia, Gustav Vasa of Sweden and the Danish kings made their kingdoms Lutheran in the 1520s and 1530s. In England, Henry VIII broke with the Pope in 1534, when the Pope would not annul his marriage, and made himself head of the Church of England; the monasteries were closed and their lands sold.",
        mapState: { year: 1536, lat: 55, lng: 5, zoom: 3.6 },
        markers: [
          { label: "London: Act of Supremacy, 1534", at: [-0.13, 51.51] },
          { label: "Stockholm", at: [18.07, 59.33] },
          { label: "Copenhagen", at: [12.57, 55.68] },
        ],
        routes: [
          { label: "Lutheranism spreads to Scandinavia", kind: "spread", path: [[12.65, 51.87], [11, 54], [12.57, 55.68], [15, 57.5], [18.07, 59.33]] },
        ],
      },
      {
        title: "The Catholic Response",
        text: "The Catholic Church reformed itself. The Council of Trent met between 1545 and 1563, fixed Catholic doctrine and tightened discipline. New orders, above all the Jesuits, founded in 1540, ran schools and helped win back much of Poland, Austria and Hungary, and kept Bavaria firmly Catholic. Europe settled into a map that has lasted: a Protestant north and a Catholic south.",
        mapState: { year: 1563, lat: 48, lng: 12, zoom: 3.8 },
        markers: [
          { label: "Trent: the Council, 1545–1563", at: [11.12, 46.07] },
          { label: "Rome", at: [12.5, 41.9] },
        ],
        routes: [
          { label: "Jesuit schools in Bavaria and Austria", kind: "spread", path: [[11.12, 46.07], [11.6, 48.1], [16.37, 48.2]] },
          { label: "And Poland", kind: "spread", path: [[12.5, 41.9], [16.4, 48.2], [19.94, 50.06], [21, 52.2]] },
        ],
      },
      {
        title: "Wars of Religion",
        text: "Religion and politics became inseparable, and war followed. France's Wars of Religion (1562–1598) included the St Bartholomew's Day massacre of Huguenots in 1572. The Dutch revolt against Catholic Spain began in 1568. The worst was the Thirty Years' War (1618–1648), which began in Prague and devastated Germany; some regions lost a third or more of their people.",
        mapState: { year: 1618, lat: 50, lng: 9, zoom: 4.2 },
        markers: [
          { label: "Prague: the Defenestration, 1618", at: [14.42, 50.09] },
          { label: "Paris: St Bartholomew's Day, 1572", at: [2.35, 48.86] },
        ],
      },
      {
        title: "Westphalia: 1648",
        text: "The Peace of Westphalia, signed at Münster and Osnabrück in 1648, ended the Thirty Years' War. It confirmed that each ruler in the Holy Roman Empire could decide his territory's religion, and recognised the independence of the Dutch Republic and Switzerland. Many historians see it as the beginning of a Europe of sovereign states, not one Christendom.",
        mapState: { year: 1650, lat: 51, lng: 9, zoom: 4.6 },
        highlight: ["Holy Roman Empire"],
        markers: [
          { label: "Münster", at: [7.63, 51.96] },
          { label: "Osnabrück", at: [8.05, 52.28] },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────── Enlightenment
  {
    slug: "enlightenment",
    title: "The Enlightenment: The Age of Reason",
    description:
      "From Newton's laws to the Declaration of Independence: how scientists and philosophers in England, France, Scotland and Germany argued that reason could improve the world, and how their ideas crossed the Atlantic.",
    duration: 7,
    difficulty: "standard",
    steps: [
      {
        title: "The Scientific Revolution",
        text: "In 1543 Copernicus, working in Frombork in Poland, published his argument that the Earth goes round the Sun. Galileo, in Italy, turned a telescope on the sky in 1609–1610. In 1687 Isaac Newton, in Cambridge, published the Principia, showing that the same laws of motion and gravity explain a falling apple and the orbits of the planets. If nature followed rational laws, many asked, why not society?",
        mapState: { year: 1687, lat: 49, lng: 10, zoom: 4 },
        markers: [
          { label: "Frombork: Copernicus, 1543", at: [19.68, 54.36] },
          { label: "Padua: Galileo's telescope, 1609–10", at: [11.88, 45.41] },
          { label: "Cambridge: Newton's Principia, 1687", at: [0.12, 52.2] },
        ],
      },
      {
        title: "Locke and the Rights of the Governed",
        text: "In 1689, after England's Glorious Revolution, John Locke published his Two Treatises of Government. He argued that people have natural rights to life, liberty and property, and that a government that violates them can rightly be replaced. The Dutch Republic, where Locke had lived in exile, was the freest place in Europe to print books, and many controversial works appeared there.",
        mapState: { year: 1689, lat: 52, lng: 1, zoom: 5 },
        highlight: ["England and Ireland"],
        markers: [
          { label: "London: Locke's Two Treatises, 1689", at: [-0.13, 51.51] },
          { label: "Amsterdam: Europe's freest presses", at: [4.9, 52.37] },
        ],
      },
      {
        title: "Paris and the Philosophes",
        text: "In the 1700s Paris became the capital of the Enlightenment. Writers called philosophes, among them Voltaire, Montesquieu and Diderot, met in the salons of wealthy hostesses. Montesquieu's Spirit of the Laws (1748) argued for separating government powers. Diderot and d'Alembert's Encyclopédie, from 1751, set out to gather all human knowledge. Voltaire attacked censorship and religious intolerance.",
        mapState: { year: 1751, lat: 48.86, lng: 2.35, zoom: 5.4 },
        highlight: ["France"],
        markers: [
          { label: "Paris: the Encyclopédie, from 1751", at: [2.35, 48.86] },
          { label: "Ferney: Voltaire's home", at: [6.1, 46.26] },
        ],
        routes: [{ label: "English ideas reach France: Voltaire's Letters on the English, 1733", kind: "spread", path: [[-0.13, 51.51], [1.2, 50.3], [2.35, 48.86]] }],
      },
      {
        title: "Edinburgh, Königsberg and Beyond",
        text: "The Enlightenment had many centres. In Edinburgh, David Hume wrote on knowledge and human nature, and Adam Smith published The Wealth of Nations in 1776, founding modern economics. In Königsberg, Immanuel Kant defined Enlightenment in 1784 as humanity's emergence from self-imposed immaturity: 'Dare to know!' Ideas moved through letters, journals, academies and coffeehouses.",
        mapState: { year: 1776, lat: 53, lng: 8, zoom: 3.8 },
        markers: [
          { label: "Edinburgh: Hume and Adam Smith", at: [-3.19, 55.95] },
          { label: "Königsberg: Kant", at: [20.51, 54.71] },
        ],
        routes: [
          { label: "Ideas travel by letter, journal and book", kind: "spread", path: [[2.35, 48.86], [6, 50.5], [10, 52.5], [14, 53.5], [20.5, 54.7]] },
          { label: "Between Paris and Edinburgh", kind: "spread", path: [[2.35, 48.86], [0, 51], [-1.5, 54], [-3.19, 55.95]] },
        ],
      },
      {
        title: "Enlightened Monarchs",
        text: "Some rulers took up Enlightenment ideas, without giving up power. Frederick the Great of Prussia invited Voltaire to his court and allowed religious tolerance. Catherine the Great of Russia corresponded with Voltaire and Diderot. Joseph II of Austria abolished serfdom in his lands and granted religious toleration. Historians call them 'enlightened absolutists'.",
        mapState: { year: 1783, lat: 53, lng: 16, zoom: 3.6 },
        highlight: ["Prussia", "Russian Empire"],
        markers: [
          { label: "Potsdam: Frederick the Great", at: [13.06, 52.4] },
          { label: "St Petersburg: Catherine the Great", at: [30.31, 59.94] },
          { label: "Vienna: Joseph II", at: [16.37, 48.21] },
        ],
        routes: [
          { label: "Voltaire to Frederick's court, 1750", kind: "spread", path: [[2.35, 48.86], [8, 51], [13.06, 52.4]] },
          { label: "Diderot to Catherine, 1773", kind: "spread", path: [[2.35, 48.86], [10, 53], [20, 57], [30.3, 59.9]] },
        ],
      },
      {
        title: "Across the Atlantic: 1776",
        text: "The colonists of British North America read Locke, Montesquieu and the Scottish writers. In 1776 their Declaration of Independence, drafted by Thomas Jefferson, declared that 'all men are created equal' with rights to 'life, liberty and the pursuit of happiness'. The US Constitution of 1787 put Montesquieu's separation of powers into practice.",
        mapState: { year: 1783, lat: 45, lng: -35, zoom: 2.4 },
        highlight: ["United States of America"],
        markers: [{ label: "Philadelphia: the Declaration, 1776", at: [-75.16, 39.95] }],
        routes: [{ label: "Enlightenment ideas cross the Atlantic", kind: "spread", path: [[-0.13, 51.5], [-15, 50], [-40, 46], [-60, 42], [-75.1, 39.95]] }],
      },
      {
        title: "Revolution in France: 1789",
        text: "In 1789 the ideas came home. The French Revolution's Declaration of the Rights of Man and of the Citizen proclaimed liberty, equality and popular sovereignty. Revolutionary ideas spread to Haiti, where enslaved people rose up in 1791 and won independence, and across Europe and Latin America. The story continues in our tour of the Age of Revolutions.",
        mapState: { year: 1800, lat: 40, lng: -30, zoom: 2.3 },
        markers: [
          { label: "Paris, 1789", at: [2.35, 48.86] },
          { label: "Saint-Domingue (Haiti), 1791", at: [-72.3, 18.9] },
        ],
        routes: [
          { label: "From America back to France", kind: "spread", path: [[-75.1, 39.95], [-50, 44], [-20, 47], [2.35, 48.86]] },
          { label: "From France to Haiti", kind: "spread", path: [[2.35, 48.86], [-20, 35], [-50, 22], [-72.3, 18.9]] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────── Industrial Revolution
  {
    slug: "industrial-revolution",
    title: "The Industrial Revolution",
    description:
      "How coal, steam and machines transformed Britain from the 1700s, and how factories and railways spread to Belgium, Germany, the United States, Japan and Russia, changing how most of humanity lived and worked.",
    duration: 6,
    difficulty: "standard",
    steps: [
      {
        title: "Why Britain?",
        text: "In the 1700s Britain had plenty of coal and iron, a large and growing market, colonies and sea trade, a stable banking system, and high wages that made labour-saving machines worth building. In 1709 Abraham Darby began smelting iron with coke, made from coal, at Coalbrookdale. In 1712 Thomas Newcomen's steam engine began pumping water out of mines.",
        mapState: { year: 1783, lat: 53.5, lng: -2, zoom: 5.2 },
        highlight: ["United Kingdom"],
        markers: [{ label: "Coalbrookdale: coke-smelted iron, 1709", at: [-2.48, 52.64] }],
      },
      {
        title: "Cotton, Factories and Steam",
        text: "Cotton led the way. New machines, the spinning jenny, Richard Arkwright's water frame and Samuel Crompton's mule, spun thread far faster than any person. Arkwright's mill at Cromford, from 1771, is often called the first modern factory. James Watt's improved steam engine, built in Birmingham with Matthew Boulton from 1776, could power factories anywhere, not just beside rivers. Manchester became 'Cottonopolis'.",
        mapState: { year: 1800, lat: 53.2, lng: -2, zoom: 6.4 },
        markers: [
          { label: "Cromford mill, 1771", at: [-1.56, 53.11] },
          { label: "Birmingham: Boulton and Watt, 1776", at: [-1.9, 52.48] },
          { label: "Manchester: 'Cottonopolis'", at: [-2.24, 53.48] },
        ],
      },
      {
        title: "The Railway Age",
        text: "In 1825 the Stockton and Darlington Railway opened, the first public railway to use steam locomotives. The Liverpool and Manchester Railway of 1830, with George and Robert Stephenson's Rocket, was the first intercity line. Within twenty years Britain had thousands of miles of track, and railways had become the engine of industrial growth everywhere.",
        mapState: { year: 1830, lat: 54, lng: -2, zoom: 6 },
        markers: [
          { label: "Stockton and Darlington, 1825", at: [-1.4, 54.55] },
          { label: "Liverpool", at: [-2.98, 53.41] },
        ],
        routes: [{ label: "Liverpool and Manchester Railway, 1830", kind: "spread", path: [[-2.98, 53.41], [-2.6, 53.45], [-2.24, 53.48]] }],
      },
      {
        title: "Industry Crosses the Channel",
        text: "Britain tried to keep its machines and skilled workers at home, but both leaked out. Belgium, rich in coal, industrialised first on the continent, around Liège; the Englishman John Cockerill built works at Seraing from 1817. France and the German lands followed. After 1850 the Ruhr, with its coal, became Germany's industrial heartland, and by 1900 Germany rivalled Britain.",
        mapState: { year: 1880, lat: 51, lng: 4, zoom: 4.8 },
        markers: [
          { label: "Liège and Seraing", at: [5.57, 50.63] },
          { label: "The Ruhr", at: [7.2, 51.45] },
        ],
        routes: [
          { label: "To Belgium, from 1800s", kind: "spread", path: [[-1.9, 52.5], [1.5, 51.5], [4, 51], [5.57, 50.63]] },
          { label: "To the Ruhr, from 1850s", kind: "spread", path: [[5.6, 50.65], [6.5, 51], [7.2, 51.45]] },
          { label: "To northern France", kind: "spread", path: [[-1.9, 52.5], [1, 51.2], [3.06, 50.63]] },
        ],
      },
      {
        title: "America and Japan",
        text: "In 1789 Samuel Slater, who had worked in English mills, emigrated to the United States and built a cotton mill in Rhode Island from memory. By the late 1800s the US was the world's largest industrial economy. In Japan, after the Meiji Restoration of 1868, the government brought in Western experts and machines; the Tomioka silk mill opened in 1872, and within a few decades Japan was an industrial power.",
        mapState: { year: 1880, lat: 38, lng: 30, zoom: 1.15 },
        markers: [
          { label: "Pawtucket: Slater's mill, 1793", at: [-71.38, 41.88] },
          { label: "Tomioka silk mill, 1872", at: [138.89, 36.26] },
        ],
        routes: [
          { label: "Mill technology to the United States", kind: "spread", path: [[-2.24, 53.48], [-20, 50], [-45, 45], [-71.4, 41.9]] },
          { label: "Western machines to Japan, after 1868", kind: "spread", path: [[-2.24, 53.48], [-7, 47], [-9.5, 38], [-5.6, 36], [12, 37.5], [32.3, 31], [43, 12.5], [73, 7], [100, 3], [110, 15], [125, 28], [138.9, 36.3]] },
        ],
      },
      {
        title: "A Changed World",
        text: "Industrialisation brought cities, factories, child labour, smoke and slums, and in time higher living standards than any society had known. It created a working class, trade unions and new political ideas, from liberalism to socialism. It also gave industrial nations the steamships, railways and weapons to build empires across Africa and Asia.",
        mapState: { year: 1900, lat: 40, lng: 10, zoom: 1.6 },
      },
    ],
  },
];
