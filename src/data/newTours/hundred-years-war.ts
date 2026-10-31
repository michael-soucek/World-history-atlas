import type { Tour } from "@/data/tours";

export const TOUR: Tour = {
  slug: "hundred-years-war",
  title: "The Hundred Years' War",
  description:
    "From Edward III's claim to the French crown to Crécy, the Black Death, Agincourt, Joan of Arc and the cannon of Castillon: the long, intermittent struggle between England and France, 1337–1453.",
  duration: 9,
  difficulty: "standard",
  steps: [
    {
      title: "A disputed crown",
      date: "1328–1337",
      text: "When Charles IV of France died in 1328 without a son, the senior male line of the House of Capet came to an end. His closest male relative was his nephew, Edward III of England, whose mother Isabella was Charles's sister. French barons and churchmen ruled that a right passed down through a woman did not count, and crowned Charles's cousin Philip of Valois as Philip VI. Edward, who also held Aquitaine and Gascony as the French king's vassal, did homage in 1329. Quarrels grew, and on 24 May 1337 Philip's Great Council in Paris resolved to take Gascony back. Edward answered by pressing his claim to the French throne by war.",
      mapState: { year: 1337, mapYear: 1300, lat: 47.5, lng: 0.5, zoom: 4.6 },
      highlight: ["English territory"],
      markers: [
        { label: "Paris: Philip's council confiscates Gascony, 1337", at: [2.32, 48.86] },
        { label: "Bordeaux, Gascony", at: [-0.58, 44.84] },
      ],
    },
    {
      title: "Sluys: battle in the harbour",
      date: "24 June 1340",
      text: "In 1340 Edward formally took the title King of France. That June he sailed from the River Orwell with 120 to 150 ships to land an army in Flanders. On 24 June he found a French fleet of more than 200 vessels waiting in the roadstead of Sluys, its ships tied together in three lines to make floating fighting platforms. While the English manoeuvred for wind and tide, the French drifted east and became tangled; as they tried to separate, Edward attacked. Most French ships were captured, and according to the usual estimates 16,000 to 20,000 Frenchmen died. England now commanded the Channel, although French raids on English shipping and coasts barely slowed.",
      mapState: { year: 1340, mapYear: 1300, lat: 51.2, lng: 2, zoom: 6 },
      markers: [{ label: "Sluys, 24 June 1340", at: [3.375, 51.35], kind: "battle" }],
      routes: [
        { label: "Edward III's fleet, June 1340", kind: "voyage", path: [[1.3, 51.95], [1.7, 51.8], [2.3, 51.6], [2.9, 51.45], [3.3, 51.37]] },
      ],
    },
    {
      title: "Crécy",
      date: "July – August 1346",
      text: "On 12 July 1346 Edward landed at Saint-Vaast-la-Hougue in Normandy with about 10,000 men and marched south, burning and looting as he went. Caen was stormed on 26 July; more than 5,000 French soldiers and civilians were killed there. The English ravaged the Seine valley to within a few miles of Paris, then turned north. On 26 August, on a hillside near Crécy-en-Ponthieu, Philip VI's far larger army attacked them. English and Welsh longbowmen drove off the French mercenary crossbowmen, then shot down wave after wave of charging knights. Estimates of French dead range from about 1,500 to 4,000 men-at-arms, King John of Bohemia among them; English losses were in the low hundreds.",
      mapState: { year: 1346, mapYear: 1300, lat: 49.6, lng: 0.8, zoom: 5.8 },
      markers: [
        { label: "Crécy, 26 August 1346", at: [1.8878, 50.2564], kind: "battle" },
        { label: "Paris", at: [2.32, 48.86] },
      ],
      routes: [
        { label: "Edward III's chevauchée, July–August 1346", kind: "raid", path: [[-1.27, 49.59], [-1.1, 49.3], [-0.37, 49.18], [0.23, 49.15], [1.0, 49.3], [2.04, 48.93], [2.08, 49.43], [1.78, 50.1], [1.89, 50.25]] },
      ],
    },
    {
      title: "The siege of Calais",
      date: "September 1346 – August 1347",
      text: "A week after Crécy the English closed in on Calais, a strongly walled port under the command of Jean de Vienne. Attacks from land and sea failed, and all winter French ships slipped supplies into the town, until in late April the English built a fort that sealed the harbour. By late June the garrison wrote to Philip that its food was gone. The French king came north in July with 15,000 to 20,000 men, found over 50,000 English and Flemish troops dug in, and withdrew. Calais surrendered on 3 August 1347. Its French inhabitants were driven out and English settlers moved in. The town remained English until 1558.",
      mapState: { year: 1347, mapYear: 1300, lat: 50.8, lng: 1.6, zoom: 6 },
      highlight: ["English territory"],
      markers: [
        { label: "Siege of Calais, 1346–1347", at: [1.853, 50.958], kind: "battle" },
        { label: "Crécy, 1346", at: [1.8878, 50.2564], kind: "battle" },
      ],
      routes: [
        { label: "The English march on Calais, September 1346", kind: "conquest", path: [[1.89, 50.27], [1.75, 50.45], [1.62, 50.7], [1.75, 50.9], [1.85, 50.95]] },
      ],
    },
    {
      title: "The Black Death",
      date: "1347–1351",
      text: "Then a deadlier enemy struck both kingdoms. Plague came to Sicily aboard Genoese galleys in October 1347 and reached Marseille early in 1348; by June it was in France and England, and it hit Paris that year. Across Europe the Black Death killed up to 50 million people, around 30 to 60 per cent of the population. Estimates for France run from 6 to 12 million dead, and England lost perhaps 2 to 3 million. Terror bred persecution: Jews were accused of poisoning wells, and in Strasbourg about 2,000 were murdered in February 1349. The war dwindled to raids and local fights; only in 1355, once the plague had passed and English finances recovered, did a major campaign begin.",
      mapState: { year: 1348, mapYear: 1300, lat: 46.5, lng: 4, zoom: 4 },
      markers: [
        { label: "Marseille, early 1348", at: [5.37, 43.2964] },
        { label: "Paris, 1348", at: [2.32, 48.86] },
        { label: "Strasbourg: massacre of Jews, 1349", at: [7.7458, 48.5833] },
      ],
      routes: [
        { label: "Plague from Sicily to Marseille and Paris, 1347–1348", kind: "plague", path: [[15.55, 38.19], [12.5, 40.2], [8.9, 42.3], [5.37, 43.3], [4.8, 43.95], [4.83, 45.76], [3.5, 47.4], [2.35, 48.85]] },
        { label: "Across the Channel to England, 1348", kind: "plague", path: [[-1.0, 49.6], [-1.8, 50.1], [-2.45, 50.62], [-1.3, 51.1], [-0.12, 51.5]] },
      ],
    },
    {
      title: "Poitiers: a king taken prisoner",
      date: "19 September 1356",
      text: "In 1355 Edward's eldest son, the Black Prince, led a chevauchée from Gascony that plundered towns as far as Narbonne. The next year he marched north from Bergerac towards the Loire. John II of France pursued him, and on 19 September 1356, south of Poitiers, 14,000 to 16,000 Frenchmen attacked about 6,000 Anglo-Gascons fighting on foot in a strong position. When a small English mounted force appeared behind them, the French broke. John II and his son Philip were captured, and roughly 2,500 French men-at-arms were killed. The Treaty of Brétigny of 1360 gave Edward an enlarged Aquitaine and Calais, free of homage, and set John's ransom at three million écus; Edward dropped his claim to the throne.",
      mapState: { year: 1356, mapYear: 1300, lat: 45.3, lng: 1.2, zoom: 5.2 },
      highlight: ["English territory"],
      markers: [
        { label: "Poitiers, 19 September 1356", at: [0.4033, 46.5222], kind: "battle" },
        { label: "Bordeaux", at: [-0.58, 44.84] },
      ],
      routes: [
        { label: "The Black Prince's raid, 1355", kind: "raid", path: [[-0.58, 44.84], [0.3, 44.2], [1.44, 43.6], [1.95, 43.31], [2.35, 43.21], [3.0, 43.18]] },
        { label: "The Black Prince's march, 1356", kind: "raid", path: [[0.48, 44.85], [0.72, 45.18], [1.26, 45.83], [1.9, 46.6], [2.3, 47.0], [1.5, 47.3], [0.69, 47.39], [0.41, 46.53]] },
      ],
    },
    {
      title: "Agincourt",
      date: "August – October 1415",
      text: "By 1378 France had regained most of the land lost at Brétigny. Henry V of England revived it, exploiting the mental illness of Charles VI and a civil war between the French Armagnac and Burgundian factions. In August 1415 he besieged Harfleur, using gunpowder artillery on a scale no English army had tried against a large town; it surrendered on 22 September, but dysentery had ravaged his troops. Marching for Calais, a far larger French army blocked him near Azincourt. On 25 October 1415 some 6,000 to 8,100 Englishmen, mostly archers, defeated around 14,000 to 15,000 French. About 6,000 French died, many of them nobles, and Henry ordered most of his prisoners killed.",
      mapState: { year: 1415, mapYear: 1400, lat: 50, lng: 1.4, zoom: 5.8 },
      highlight: ["English territory"],
      markers: [
        { label: "Siege of Harfleur, August–September 1415", at: [0.1389, 49.4942], kind: "battle" },
        { label: "Agincourt, 25 October 1415", at: [2.1417, 50.4636], kind: "battle" },
        { label: "Calais (English)", at: [1.853, 50.958] },
      ],
      routes: [
        { label: "Henry V's invasion fleet, August 1415", kind: "voyage", path: [[-1.1, 50.72], [-0.6, 50.3], [-0.1, 49.8], [0.12, 49.5]] },
        { label: "The march towards Calais, October 1415", kind: "conquest", path: [[0.14, 49.5], [0.6, 49.75], [1.1, 49.92], [1.7, 50.0], [2.4, 49.85], [2.95, 49.8], [2.6, 50.2], [2.14, 50.46]] },
        { label: "On to Calais after the battle", kind: "conquest", path: [[2.14, 50.48], [1.98, 50.7], [1.85, 50.94]] },
      ],
    },
    {
      title: "The Treaty of Troyes",
      date: "21 May 1420",
      text: "Henry returned in August 1417 to conquer Normandy, and Rouen fell early in 1419. That September the Dauphin Charles met John the Fearless, Duke of Burgundy, on the bridge at Montereau, where one of the Dauphin's attendants killed the duke. The murder pushed the Burgundians, now led by John's son Philip the Good, into alliance with England. Under the Treaty of Troyes, sealed on 21 May 1420, the ailing Charles VI kept his crown for life, but Henry married his daughter Catherine and became heir to France, while the Dauphin was disinherited. Both kings died in 1422. The infant Henry VI inherited both claims, but the Dauphin proclaimed himself Charles VII, and France stayed divided.",
      mapState: { year: 1420, mapYear: 1400, lat: 48.8, lng: 2.4, zoom: 5.6 },
      markers: [
        { label: "Rouen falls to Henry V, 1419", at: [1.09, 49.44], kind: "battle" },
        { label: "Paris: held by the Burgundians from 1418", at: [2.32, 48.86] },
        { label: "Troyes: treaty sealed, 21 May 1420", at: [4.0792, 48.2997] },
      ],
      routes: [
        { label: "Henry V conquers Normandy, 1417–1419", kind: "conquest", path: [[0.1, 49.35], [-0.37, 49.18], [0.1, 49.05], [0.6, 49.2], [1.09, 49.44]] },
      ],
    },
    {
      title: "Joan of Arc: Orléans and Reims",
      date: "1429–1431",
      text: "In 1428 the English besieged Orléans on the Loire. Joan, a peasant girl from Domrémy who said visions of the archangel Michael and two saints were guiding her, won over Charles, and aged about 17 she rode with a relief army that reached the city on 29 April 1429. Nine days later the siege was lifted. After victory at Patay in June, Joan urged Charles on to Reims, where French kings were crowned; the city opened its gates on 16 July and he was crowned the next morning with Joan beside him. In May 1430 Burgundians captured her at Compiègne and handed her to the English. Tried for heresy, she was burned at Rouen on 30 May 1431, aged about 19.",
      mapState: { year: 1429, mapYear: 1400, lat: 48.3, lng: 2.6, zoom: 5.4 },
      markers: [
        { label: "Domrémy: Joan's birthplace", at: [5.68, 48.44] },
        { label: "Chinon: Joan meets Charles, 1429", at: [0.2361, 47.1681] },
        { label: "Siege of Orléans, 1428–1429", at: [1.9089, 47.9025], kind: "battle" },
        { label: "Patay, 18 June 1429", at: [1.7049, 48.0302], kind: "battle" },
        { label: "Reims: Charles VII crowned, 17 July 1429", at: [4.0342, 49.2539] },
        { label: "Compiègne: Joan captured, 1430", at: [2.82, 49.41] },
        { label: "Rouen: Joan executed, 1431", at: [1.09, 49.44] },
      ],
      routes: [
        { label: "Joan's relief army, April 1429", kind: "conquest", path: [[0.24, 47.17], [0.69, 47.4], [1.33, 47.59], [1.9, 47.89]] },
        { label: "The march to Reims, June–July 1429", kind: "conquest", path: [[2.63, 47.69], [3.57, 47.8], [4.08, 48.3], [4.25, 48.8], [4.03, 49.25]] },
      ],
    },
    {
      title: "Castillon: the end in Gascony",
      date: "17 July 1453",
      text: "After Joan's death the war turned steadily against England. Burgundy abandoned the English alliance, Charles VII built a professional army, and French victories such as Formigny in 1450 followed. Bordeaux fell to the French in 1451, but its citizens, English subjects for three centuries, called the English back, and in October 1452 John Talbot, Earl of Shrewsbury, retook the city. On 17 July 1453 at Castillon on the Dordogne, Talbot attacked a fortified French camp armed with some 300 guns. The artillery tore his army apart, and he and his son were killed. Bordeaux surrendered on 19 October. Of all its French lands, England kept only Calais, which it held until 1558.",
      mapState: { year: 1453, mapYear: 1492, lat: 47, lng: 0.5, zoom: 4.6 },
      highlight: ["France"],
      markers: [
        { label: "Castillon, 17 July 1453", at: [-0.0189, 44.8517], kind: "battle" },
        { label: "Bordeaux: surrenders, 19 October 1453", at: [-0.58, 44.84] },
        { label: "Calais: English until 1558", at: [1.853, 50.958] },
      ],
      routes: [
        { label: "Talbot marches to Castillon, July 1453", kind: "conquest", path: [[-0.58, 44.84], [-0.4, 44.83], [-0.2, 44.86], [-0.03, 44.85]] },
      ],
    },
  ],
};
