/**
 * Corrections to src/data/cityRulers.json, which is generated from the map
 * snapshots by scripts/build-city-rulers.mts. The upstream borders are coarse,
 * so a city near a frontier can land in the wrong state, and some snapshot
 * labels are simply wrong (Singapore drawn inside Malaysia after 1985).
 *
 * Each fix replaces whatever the snapshots say for the snapshot years in
 * [from, to) (to: null means up to today). Years must be snapshot years, so
 * every row still links to a map of that year. Only rows that are wrong at the
 * snapshot year itself are fixed here; a change that happened between two
 * snapshots (English New York from 1664, first drawn in 1715) is a matter of
 * the snapshot interval and is explained in the city's own article.
 *
 * Checked against the city articles in content/articles/city, 2026-10-28.
 */
export interface RulerFix {
  from: number;
  to: number | null;
  name: string;
  sovereign?: string;
}

export const CITY_RULER_FIXES: Record<string, RulerFix[]> = {
  // Independent since 1965; British from 1819 (Johor before that), never part of Malaya before 1963.
  singapore: [
    { from: 1650, to: 1878, name: "Johor Sultanate" },
    { from: 1878, to: 1960, name: "Straits Settlements", sovereign: "United Kingdom" },
    { from: 1960, to: 1985, name: "State of Singapore", sovereign: "United Kingdom" },
    { from: 1985, to: null, name: "Singapore" },
  ],
  // French again from 1918; the coarse Rhine border put it in Germany.
  strasbourg: [{ from: 1920, to: null, name: "France" }],
  // Russian only from 1860.
  vladivostok: [{ from: 1815, to: 1878, name: "Qing Empire" }],
  // Spanish from 1571, American 1898 to 1946.
  manila: [
    { from: 1650, to: 1900, name: "Spanish East Indies", sovereign: "Spain" },
    { from: 1900, to: 1945, name: "Philippines", sovereign: "United States" },
  ],
  // French protectorate from 1881.
  tunis: [{ from: 1900, to: 1945, name: "Tunisia", sovereign: "France" }],
  // Founded by the Portuguese in 1565.
  "rio-de-janeiro": [{ from: 1600, to: 1650, name: "Portuguese Brazil", sovereign: "Portugal" }],
  // Fort St George, English from 1639.
  chennai: [{ from: 1650, to: 1783, name: "Madras", sovereign: "British East India Company" }],
  // Portuguese from 1534, English from 1661 (Company rule from 1668).
  mumbai: [
    { from: 1600, to: 1700, name: "Portuguese India", sovereign: "Portugal" },
    { from: 1700, to: 1878, name: "Bombay", sovereign: "British East India Company" },
  ],
  // Croatia joined the Hungarian crown in 1102; Habsburg from 1527. Never in the Holy Roman Empire.
  zagreb: [
    { from: 1000, to: 1100, name: "Croatian kingdom" },
    { from: 1100, to: 1530, name: "Kingdom of Hungary" },
    { from: 1530, to: 1715, name: "Habsburg Monarchy" },
  ],
  // Pressburg was Hungarian, and the Habsburgs' Hungarian capital from 1536.
  bratislava: [
    { from: 1279, to: 1530, name: "Hungary" },
    { from: 1530, to: 1715, name: "Habsburg Monarchy" },
  ],
  // Chola rule about 993 to 1070; Portuguese about 1597 to 1658; British from 1796.
  colombo: [
    { from: 1100, to: 1279, name: "Sinhalese kingdom" },
    { from: 1600, to: 1650, name: "Portuguese Ceylon", sovereign: "Portugal" },
    { from: 1800, to: 1945, name: "Ceylon", sovereign: "United Kingdom" },
  ],
  // Hafsid until Spain took it in 1510, the Knights of St John from 1530, Ottoman from 1551.
  tripoli: [
    { from: 1492, to: 1530, name: "Hafsid Caliphate" },
    { from: 1530, to: 1600, name: "Knights Hospitaller" },
  ],
  // Samarkand belonged to Bukhara, not Khiva.
  samarkand: [{ from: 1530, to: 1783, name: "Khanate of Bukhara" }],
  // Hohenstaufen Kingdom of Sicily; Benevento was a mainland duchy.
  palermo: [{ from: 1200, to: 1279, name: "Sicily" }],
  // Moldavia under Ottoman overlordship, Russian Bessarabia 1812 to 1917, Romanian 1918 to 1940.
  chisinau: [
    { from: 1530, to: 1815, name: "Moldavia", sovereign: "Ottoman Empire" },
    { from: 1815, to: 1920, name: "Russian Empire" },
  ],
  // The Jurchen Jin took Chang'an in the 1120s.
  xian: [{ from: 1200, to: 1279, name: "Jin dynasty" }],
  // The lagoon stayed Byzantine; the Franks never held it.
  venice: [{ from: 800, to: 1000, name: "Byzantine Empire" }],
  // North of the Rhine frontier, never Roman.
  amsterdam: [{ from: -1, to: 100, name: "Frisii" }],
  // Wallachia was an Ottoman vassal, never an Ottoman province.
  bucharest: [{ from: 1492, to: 1878, name: "Principality of Wallachia", sovereign: "Ottoman Empire" }],
  // The Principality of Transylvania kept its own princes under Ottoman overlordship.
  "cluj-napoca": [{ from: 1600, to: 1700, name: "Principality of Transylvania", sovereign: "Ottoman Empire" }],
  // Ottoman only from 1578 to 1603; Safavid either side.
  baku: [
    { from: 1530, to: 1600, name: "Shirvan", sovereign: "Safavid Empire" },
    { from: 1650, to: 1715, name: "Safavid Empire" },
  ],
  // Gold Coast colony until independence as Ghana in 1957.
  accra: [{ from: 1930, to: 1938, name: "Gold Coast", sovereign: "United Kingdom" }],
  // The Merina kingdom only formed in the 1500s.
  antananarivo: [{ from: 1000, to: 1600, name: "Highland Malagasy chiefdoms" }],
  // Jolof, not Mali, held the Cape Verde peninsula.
  dakar: [{ from: 1400, to: 1530, name: "Jolof Empire" }],
};
