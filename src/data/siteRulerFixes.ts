/**
 * Corrections to src/data/siteRulers.json, the "who held it" timelines of the
 * historic sites, generated from the map snapshots by
 * scripts/build-city-rulers.mts. Same rules as src/data/cityRulerFixes.ts:
 * each fix replaces whatever the snapshots say for the snapshot years in
 * [from, to), and `from` must be a snapshot year. A fix may start at the
 * snapshot before the site was built: the page clips the first row to the
 * build year, so it is the ruler at that date that matters.
 *
 * Checked against each site's history, 2026-11-01.
 */
import type { RulerFix } from "@/data/cityRulerFixes";

export const SITE_RULER_FIXES: Record<string, RulerFix[]> = {
  // New Kingdom Egypt held Lower Nubia when Ramesses II built the temples.
  "abu-simbel": [{ from: -1500, to: -1000, name: "Egypt" }],
  // Under the Seuna (Yadava) kings of Devagiri until the 1310s, not Rajput states.
  "ajanta-caves": [{ from: 1200, to: 1400, name: "Seuna (Yadava) dynasty" }],
  "ellora-caves": [{ from: 1200, to: 1400, name: "Seuna (Yadava) dynasty" }],
  // Annexed to Nazi Germany in 1939; the camp opened in 1940.
  auschwitz: [{ from: 1938, to: 1945, name: "Germany" }],
  // The Kingdom of Pagan held Bagan until the late 13th century.
  bagan: [{ from: 1100, to: 1279, name: "Kingdom of Pagan" }],
  // Inscribed for Darius I, Persepolis and Pasargadae built by the Achaemenids.
  "behistun-inscription": [{ from: -700, to: -500, name: "Achaemenid Empire" }],
  persepolis: [{ from: -700, to: -500, name: "Achaemenid Empire" }],
  pasargadae: [{ from: -700, to: -500, name: "Achaemenid Empire" }],
  // Cahokia was the great Mississippian city, abandoned by about 1400.
  cahokia: [{ from: 1000, to: 1400, name: "Mississippian culture" }],
  // Neolithic settlements, not Mesolithic foragers.
  catalhoyuk: [
    { from: -8000, to: -5000, name: "Neolithic farming communities" },
    { from: 1920, to: 1930, name: "Ottoman Empire" },
  ],
  "gobekli-tepe": [{ from: -10000, to: -5000, name: "Pre-Pottery Neolithic communities" }],
  // Chaco's great houses flourished c. 850–1150; Mesa Verde's cliff dwellings c. 1190–1280.
  "chaco-canyon": [{ from: 1000, to: 1200, name: "Anasazi" }],
  "mesa-verde": [{ from: 1100, to: 1300, name: "Anasazi" }],
  // Umayyad from 691; East Jerusalem was held by Jordan 1948–67 and by Israel since 1967.
  "dome-of-the-rock": [
    { from: 600, to: 700, name: "Umayyad Caliphate" },
    { from: 1960, to: 1985, name: "Jordan" },
    { from: 1985, to: null, name: "Israeli-occupied East Jerusalem" },
  ],
  // Portuguese from 1482, Dutch from 1637, British from 1872.
  "elmina-castle": [
    { from: 1400, to: 1650, name: "Portuguese Gold Coast", sovereign: "Portugal" },
    { from: 1650, to: 1878, name: "Dutch Gold Coast", sovereign: "Netherlands" },
    { from: 1878, to: 1960, name: "Gold Coast", sovereign: "United Kingdom" },
  ],
  // The state of Yan, one of the Zhou states, held the Beijing area.
  "great-wall-of-china": [{ from: -500, to: -323, name: "Zhou states" }],
  // Built for the Joseon kings, who took power in 1392.
  gyeongbokgung: [{ from: 1300, to: 1400, name: "Joseon" }],
  // Roman Britain until about 410; Bernicia and Northumbria; England from the 10th century.
  "hadrians-wall": [
    { from: 100, to: 400, name: "Roman Empire" },
    { from: 400, to: 500, name: "Western Roman Empire" },
    { from: 600, to: 1000, name: "Northumbria" },
    { from: 1000, to: 1279, name: "England" },
  ],
  // Istanbul and the Dardanelles were Ottoman (under Allied occupation) in 1920.
  "hagia-sophia": [{ from: 1920, to: 1930, name: "Ottoman Empire" }],
  "topkapi-palace": [
    { from: 1400, to: 1492, name: "Ottoman Empire" },
    { from: 1920, to: 1930, name: "Ottoman Empire" },
  ],
  troy: [{ from: 1920, to: 1930, name: "Ottoman Empire" }],
  // Venetian Crete (1211–1669), Ottoman, the autonomous Cretan State (1898–1913), then Greece.
  knossos: [
    { from: 1300, to: 1650, name: "Venice" },
    { from: 1878, to: 1900, name: "Ottoman Empire" },
    { from: 1900, to: 1914, name: "Cretan State", sovereign: "Ottoman Empire" },
    { from: 1914, to: 1920, name: "Greece" },
  ],
  // Built by the Eastern Ganga kings; Gajapati rule from 1434; Mughal from the 1590s.
  "konark-sun-temple": [
    { from: 1200, to: 1492, name: "Eastern Ganga dynasty" },
    { from: 1492, to: 1600, name: "Gajapati Empire" },
    { from: 1600, to: 1700, name: "Mughal Empire" },
  ],
  // Carved under the Zagwe dynasty, which the Solomonic dynasty replaced in 1270.
  "churches-of-lalibela": [{ from: 1200, to: 1279, name: "Zagwe dynasty" }],
  // Newfoundland was a British colony, separate from Canada until 1949.
  "lanse-aux-meadows": [{ from: 1783, to: 1920, name: "Newfoundland", sovereign: "United Kingdom" }],
  // The cave was painted by Upper Palaeolithic people, not Neanderthals.
  lascaux: [{ from: -123000, to: -10000, name: "Upper Palaeolithic hunter-gatherers" }],
  // Carthage held the Emporia until Numidia took them in the 160s BCE.
  "leptis-magna": [{ from: -200, to: -100, name: "Carthage" }],
  // Sichuan stayed Tang (Tibet raided but did not hold it); Wang Jian governed for the Tang until 907.
  "leshan-giant-buddha": [{ from: 800, to: 1000, name: "Tang Empire" }],
  // Herod's Judea.
  masada: [{ from: -100, to: -1, name: "Judea" }],
  // Dunhuang under the Northern Wei, Sui and Tang.
  "mogao-caves": [
    { from: 500, to: 600, name: "Toba Wei" },
    { from: 600, to: 700, name: "Sui Empire" },
    { from: 700, to: 800, name: "Tang Empire" },
  ],
  // Annexed by Chile in 1888.
  "moai-of-easter-island": [{ from: 1900, to: null, name: "Rapa Nui", sovereign: "Chile" }],
  // Transjordan under British mandate, not Mesopotamia.
  petra: [{ from: 1920, to: 1945, name: "Transjordan", sovereign: "United Kingdom" }],
  // Nîmes stayed in Visigothic Septimania until the Umayyad conquest of the 720s.
  "pont-du-gard": [{ from: 500, to: 800, name: "Visigoths" }],
  // Founded by Oscan-speaking people in the 7th or 6th century BCE.
  pompeii: [{ from: -700, to: -500, name: "Oscans" }],
  // Begun by Qutb ud-Din Aibak, the Ghurid governor of Delhi.
  "qutb-minar": [{ from: 1100, to: 1200, name: "Ghurid dynasty" }],
  // Regal Rome.
  "roman-forum": [{ from: -700, to: -500, name: "Kingdom of Rome" }],
  // Vidisha and Sanchi lay in the Malwa Sultanate.
  "sanchi-stupa": [{ from: 1492, to: 1530, name: "Malwa Sultanate" }],
  // The Cholas were driven out of Sri Lanka by 1070.
  sigiriya: [{ from: 1100, to: 1279, name: "Kingdom of Polonnaruwa" }],
  // Orkney: Norwegian until pledged to Scotland in 1468.
  "skara-brae": [
    { from: 1000, to: 1400, name: "Norway" },
    { from: 1492, to: 1715, name: "Scotland" },
    { from: 1715, to: null, name: "United Kingdom" },
  ],
  // Wiltshire was West Saxon, Suffolk East Anglian; neither was Kent.
  stonehenge: [{ from: 600, to: 800, name: "Wessex" }],
  "sutton-hoo": [{ from: 600, to: 800, name: "East Anglia" }],
  // Agra was held by the Maratha Scindias until the British took it in 1803.
  "taj-mahal": [{ from: 1800, to: 1815, name: "Maratha Confederacy" }],
  "fatehpur-sikri": [{ from: 1800, to: 1815, name: "Maratha Confederacy" }],
  // Spanish Texas.
  "the-alamo": [{ from: 1715, to: 1783, name: "Viceroyalty of New Spain" }],
};
