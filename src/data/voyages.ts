/**
 * Voyage & explorer data for the "Age of Exploration" section.
 *
 * The Cook gazetteers below are compiled in chronological order from Wikipedia's
 * "First / Second / Third voyage of James Cook" articles (CC BY-SA), cross-checked
 * against the Captain Cook Society voyage narratives and Cook's own Endeavour
 * journal (digitised by the National Library of Australia). Route paths trace a
 * plausible ship's track between those stops — hugging coastlines Cook charted and
 * crossing open ocean only where he actually did.
 *
 * Coordinates are approximate port/bay/landfall locations, not survey-grade ship
 * positions, and should be verified against primary charts and logs before being
 * treated as authoritative, per the site's accuracy-first policy. Note that Cook's
 * first voyage carried no marine chronometer (see `accuracyNote`).
 */

export interface VoyageWaypoint {
  /** Place name shown in the popup. */
  name: string;
  /** Human-readable date or date range. */
  date: string;
  lat: number;
  lng: number;
  /** Optional short note shown in the popup. */
  note?: string;
  /** Marks a pivotal / fatal waypoint for emphasis. */
  pivotal?: boolean;
}

export interface Voyage {
  /** Stable id, unique within an explorer (used for layer ids + toggles). */
  id: string;
  /** Short label, e.g. "Voyage 1". */
  label: string;
  /** Ship(s) used. */
  ship: string;
  /** Date range label, e.g. "1768–1771". */
  years: string;
  /** Distinct route colour (hex). */
  color: string;
  /** One-line purpose. */
  purpose: string;
  /** 2–3 sentence written summary (purpose, outcome, fate). */
  summary: string;
  /** Optional note on the accuracy ceiling of this voyage's positions. */
  accuracyNote?: string;
  /**
   * Dense route polyline as [lng, lat] pairs, hand-compiled to follow a
   * plausible ship's track — hugging coastlines where Cook charted new coast
   * and crossing open ocean only where he actually did. If omitted, the route
   * is drawn straight through the labelled waypoints instead.
   */
  path?: [number, number][];
  /** Chronological gazetteer of stops (markers + popups). */
  waypoints: VoyageWaypoint[];
}

export interface Explorer {
  slug: string;
  name: string;
  /** Wikidata Q-ID — entity key for the Wikipedia-sourced bio. */
  wikidataId: string;
  /** Life dates label, e.g. "1728–1779". */
  lifespan: string;
  /** One-line descriptor for cards. */
  tagline: string;
  /** "full" pages have route data + map; "stub" are coming-soon cards. */
  status: "full" | "stub";
  /** Era/region hints for the card. */
  period: string;
  voyages?: Voyage[];
}

// ── James Cook ──────────────────────────────────────────────────────────────

const COOK_VOYAGES: Voyage[] = [
  {
    id: "voyage-1",
    label: "Voyage 1",
    ship: "HMS Endeavour",
    years: "1768–1771",
    color: "#B45309", // amber
    purpose: "Observe the transit of Venus from Tahiti and search for the hypothesised Great Southern Continent.",
    summary:
      "Cook's first voyage carried astronomers to Tahiti to observe the 1769 transit of Venus, then opened sealed orders to hunt for the fabled Southern Continent. He charted the whole coast of New Zealand and became the first European to map the eastern coast of Australia, landing at Botany Bay. The Endeavour survived grounding on the Great Barrier Reef before limping home via Batavia.",
    accuracyNote:
      "The Endeavour carried no marine chronometer. Cook fixed longitude by lunar-distance observations and dead reckoning, so Voyage 1's positions are less precise — sometimes by a degree or more — than the chronometer-aided second and third voyages.",
    path: [
      [-4.14, 50.37], [-7, 47.5], [-10.5, 43], [-14, 37],
      [-16.91, 32.65], [-20, 22], [-24, 10], [-29, -2], [-34, -12], [-39, -19],
      [-43.17, -22.9], [-50, -33], [-58, -43], [-64, -51],
      [-65.28, -54.82], [-67.28, -55.98], [-73, -57], [-82, -55], [-93, -49], [-107, -41], [-122, -32], [-137, -24],
      [-149.51, -17.53], [-151.02, -16.72], [-151.45, -16.82],
      [-153, -20], [-158, -27], [-166, -33], [-173, -37], [178.5, -38],
      [178.02, -38.68], [177.09, -39.65], [178.31, -38.27], [178.30, -38.37],
      [177.9, -37.5], [176.9, -37.2], [175.78, -36.83], [175.3, -36.2], [174.7, -35.6],
      [174.12, -35.22], [173.4, -34.7], [173.05, -34.42],
      [172.6, -34.9], [173.2, -35.9], [174.2, -37.0], [173.9, -38.6], [174.5, -40.3],
      [174.28, -41.09], [175.2, -41.5], [176.2, -41.0], [176.62, -40.48],
      [176.0, -41.7], [174.4, -42.7], [172.9, -43.6], [171.0, -44.7], [168.8, -46.4], [167.8, -46.9],
      [167.5, -47.2], [166.7, -45.9], [168.3, -44.0], [170.8, -42.9], [172.6, -41.0],
      [173.9, -40.92], [171, -41], [165, -40], [156, -38.5], [151, -38],
      [149.3, -37.8], [150.2, -36.2], [150.9, -35.0],
      [151.2, -34.0], [151.28, -33.85], [152.1, -32.6], [153.0, -31.3], [153.5, -29.4], [153.6, -27.5], [153.0, -25.5],
      [151.87, -24.16], [150.5, -22.5], [149.2, -21.0], [147.7, -19.3], [146.4, -18.4],
      [145.25, -15.47], [145.2, -14.6], [144.5, -13.2], [143.5, -11.8],
      [142.53, -10.7], [142.4, -10.73], [141.3, -10.2], [138, -9.5], [134, -9.4], [130, -9.6], [126, -10.5],
      [121.85, -10.5], [118, -9.5], [114, -8.0], [112, -7.0], [110, -6.4], [108, -6.1],
      [106.81, -6.13], [103, -8], [95, -15], [80, -24], [62, -31], [45, -34], [30, -35], [22, -35],
      [18.47, -34.36], [10, -30], [2, -22], [-3, -16],
      [-5.72, -15.96], [-9, -8], [-16, 4], [-22, 16], [-26, 28], [-22, 38], [-13, 46], [-6, 49.5],
      [1.4, 51.22],
    ],
    waypoints: [
      { name: "Plymouth, England", date: "26 Aug 1768", lat: 50.37, lng: -4.14, note: "Departure" },
      { name: "Funchal, Madeira", date: "Sep 1768", lat: 32.65, lng: -16.91, note: "Watering and provisions" },
      { name: "Rio de Janeiro, Brazil", date: "Nov 1768", lat: -22.9, lng: -43.17, note: "Resupply under a suspicious Viceroy" },
      { name: "Bay of Good Success, Tierra del Fuego", date: "Jan 1769", lat: -54.82, lng: -65.28, note: "Landed; two of Banks's party died in the cold" },
      { name: "Cape Horn", date: "Jan 1769", lat: -55.98, lng: -67.28, note: "Rounded into the Pacific" },
      { name: "Matavai Bay, Tahiti", date: "13 Apr 1769", lat: -17.53, lng: -149.51, note: "Transit of Venus observed 3 Jun 1769", pivotal: true },
      { name: "Huahine", date: "16 Jul 1769", lat: -16.72, lng: -151.02, note: "Society Islands" },
      { name: "Raiatea", date: "20 Jul 1769", lat: -16.82, lng: -151.45, note: "Claimed the Society Islands for Britain" },
      { name: "Poverty Bay, New Zealand", date: "7 Oct 1769", lat: -38.68, lng: 178.02, note: "First New Zealand landfall", pivotal: true },
      { name: "Cape Kidnappers", date: "15 Oct 1769", lat: -39.65, lng: 177.09 },
      { name: "Anaura Bay", date: "20 Oct 1769", lat: -38.27, lng: 178.31, note: "Peaceful trade with Māori" },
      { name: "Tolaga Bay", date: "23 Oct 1769", lat: -38.37, lng: 178.30 },
      { name: "Mercury Bay", date: "9 Nov 1769", lat: -36.83, lng: 175.78, note: "Observed the transit of Mercury" },
      { name: "Bay of Islands", date: "29 Nov 1769", lat: -35.22, lng: 174.12 },
      { name: "North Cape", date: "Dec 1769", lat: -34.42, lng: 173.05, note: "Rounded in gales" },
      { name: "Queen Charlotte Sound (Ship Cove)", date: "15 Jan 1770", lat: -41.09, lng: 174.28, note: "Careened; sighted Cook Strait", pivotal: true },
      { name: "Cape Turnagain", date: "Feb 1770", lat: -40.48, lng: 176.62, note: "Completed the North Island circuit" },
      { name: "South Cape", date: "10 Mar 1770", lat: -47.2, lng: 167.5, note: "Rounded the south of the South Island" },
      { name: "Admiralty Bay", date: "27 Mar 1770", lat: -40.92, lng: 173.9, note: "New Zealand circumnavigation completed" },
      { name: "Point Hicks", date: "19 Apr 1770", lat: -37.8, lng: 149.3, note: "First sight of eastern Australia" },
      { name: "Botany Bay", date: "29 Apr 1770", lat: -34.0, lng: 151.2, note: "First landing on the east coast", pivotal: true },
      { name: "Port Jackson", date: "6 May 1770", lat: -33.85, lng: 151.28, note: "Named but not entered — today's Sydney Harbour" },
      { name: "Bustard Bay (Seventeen Seventy)", date: "23 May 1770", lat: -24.16, lng: 151.87 },
      { name: "Endeavour River (Cooktown)", date: "17 Jun 1770", lat: -15.47, lng: 145.25, note: "Beached seven weeks to repair reef damage", pivotal: true },
      { name: "Cape York", date: "22 Aug 1770", lat: -10.7, lng: 142.53, note: "Northern tip of the coast" },
      { name: "Possession Island", date: "22 Aug 1770", lat: -10.73, lng: 142.4, note: "Claimed the entire east coast for Britain", pivotal: true },
      { name: "Savu", date: "Sep 1770", lat: -10.5, lng: 121.85, note: "Three-day stop for provisions" },
      { name: "Batavia (Jakarta)", date: "Oct 1770", lat: -6.13, lng: 106.81, note: "Dockyard repairs; malaria and dysentery struck the crew", pivotal: true },
      { name: "Cape of Good Hope", date: "Mar 1771", lat: -34.36, lng: 18.47 },
      { name: "Saint Helena", date: "May 1771", lat: -15.96, lng: -5.72 },
      { name: "The Downs (Deal), England", date: "12 Jul 1771", lat: 51.22, lng: 1.4, note: "Return after almost three years" },
    ],
  },
  {
    id: "voyage-2",
    label: "Voyage 2",
    ship: "HMS Resolution & Adventure",
    years: "1772–1775",
    color: "#0F766E", // teal
    purpose: "Settle the Great Southern Continent question by circumnavigating at high southern latitude.",
    summary:
      "On his second voyage Cook circled the globe at extreme southern latitudes, becoming the first to cross the Antarctic Circle and reaching farther south than anyone before him. His sweep of the empty Southern Ocean effectively disproved the existence of a habitable Great Southern Continent. Along the way he charted Pacific islands from Easter Island to New Caledonia and, aided by the K1 chronometer, made charts of remarkable accuracy.",
    path: [
      [-4.14, 50.37], [-8, 46], [-12, 40],
      [-16.91, 32.65], [-19, 27], [-22, 20],
      [-23.51, 14.92], [-22, 6], [-16, -6], [-6, -20], [6, -30],
      [18.42, -33.92], [24, -42], [32, -52], [38, -61],
      [39.59, -66.6], [45, -62], [70, -61], [100, -60], [130, -58], [158, -52], [165, -48],
      [166.5, -45.75], [168, -44.5], [171, -43.2], [173.5, -42],
      [174.28, -41.09], [176, -40], [-178, -35], [-170, -28], [-160, -22], [-151, -18.5],
      [-149.15, -17.75], [-149.51, -17.53], [-151.02, -16.72], [-151.45, -16.82],
      [-158, -18], [-168, -20], [-174.93, -21.38], [-175.2, -21.13],
      [-178, -30], [178, -37], [175.5, -40.5], [174.28, -41.09],
      [174.6, -41.6], [176, -44], [-179, -50], [-150, -46], [-125, -59], [-110, -67],
      [-106.9, -71.17], [-108, -58], [-108, -42], [-109, -33],
      [-109.35, -27.11], [-119, -22], [-129, -16], [-139.11, -9.94],
      [-145, -13], [-149.51, -17.53], [-155, -19], [-168, -20], [-174.8, -20.26],
      [-178, -18], [178, -17], [172, -16.5], [167.4, -16.3], [168.2, -17.6],
      [169.1, -18.8], [169.27, -19.5], [167, -20.2], [165.6, -20.9],
      [167, -24], [168, -27], [167.95, -29.03], [171, -33], [173, -38],
      [174.28, -41.09], [176, -44], [-178, -50], [-160, -56], [-120, -58], [-90, -57], [-72, -57],
      [-67.28, -55.98], [-55, -55], [-45, -55], [-36.59, -54.43], [-30, -56], [-26.4, -57.78],
      [-20, -50], [-8, -42], [5, -38], [15, -35], [18.42, -33.92],
      [10, -25], [2, -16], [-5.72, -15.96], [-10, -12], [-14.36, -7.95],
      [-20, 4], [-25, 18], [-24, 30], [-16, 40], [-6, 48], [-1.09, 50.8],
    ],
    waypoints: [
      { name: "Plymouth, England", date: "13 Jul 1772", lat: 50.37, lng: -4.14, note: "Departure" },
      { name: "Funchal, Madeira", date: "1 Aug 1772", lat: 32.65, lng: -16.91 },
      { name: "Porto Praya, Cape Verde", date: "12 Aug 1772", lat: 14.92, lng: -23.51 },
      { name: "Cape Town (Table Bay)", date: "30 Oct 1772", lat: -33.92, lng: 18.42, note: "Last resupply before the ice" },
      { name: "First Antarctic Circle crossing", date: "17 Jan 1773", lat: -66.6, lng: 39.59, note: "First ship ever to cross it", pivotal: true },
      { name: "Dusky Sound, New Zealand", date: "26 Mar 1773", lat: -45.75, lng: 166.5, note: "Rest after 117 days at sea" },
      { name: "Ship Cove, Queen Charlotte Sound", date: "18 May 1773", lat: -41.09, lng: 174.28, note: "Reunited with the Adventure" },
      { name: "Vaitepiha Bay (Tautira), Tahiti", date: "15 Aug 1773", lat: -17.75, lng: -149.15 },
      { name: "Matavai Bay, Tahiti", date: "26 Aug 1773", lat: -17.53, lng: -149.51 },
      { name: "Huahine", date: "3 Sep 1773", lat: -16.72, lng: -151.02 },
      { name: "Raiatea", date: "Sep 1773", lat: -16.82, lng: -151.45, note: "Omai joined the Adventure" },
      { name: "'Eua, Tonga", date: "2 Oct 1773", lat: -21.38, lng: -174.93 },
      { name: "Tongatapu", date: "Oct 1773", lat: -21.13, lng: -175.2, note: "The 'Friendly Islands'" },
      { name: "Ship Cove (2nd visit)", date: "3 Nov 1773", lat: -41.09, lng: 174.28, note: "Storm parted the ships for good" },
      { name: "Farthest South (71°10′S)", date: "30 Jan 1774", lat: -71.17, lng: -106.9, note: "Southernmost point of the age", pivotal: true },
      { name: "Easter Island (Rapa Nui)", date: "11 Mar 1774", lat: -27.11, lng: -109.35 },
      { name: "Vaitahu, Marquesas", date: "Apr 1774", lat: -9.94, lng: -139.11 },
      { name: "Matavai Bay, Tahiti", date: "22 Apr 1774", lat: -17.53, lng: -149.51, note: "Second stop of the voyage" },
      { name: "Nomuka, Tonga", date: "Jun 1774", lat: -20.26, lng: -174.8 },
      { name: "Malekula, New Hebrides", date: "Jul 1774", lat: -16.3, lng: 167.4 },
      { name: "Erromango", date: "Aug 1774", lat: -18.8, lng: 169.1 },
      { name: "Tanna", date: "Aug 1774", lat: -19.5, lng: 169.27, note: "Charted its active volcano" },
      { name: "New Caledonia", date: "Sep 1774", lat: -20.9, lng: 165.6, note: "Discovered and named", pivotal: true },
      { name: "Norfolk Island", date: "Oct 1774", lat: -29.03, lng: 167.95, note: "Discovered; prized for timber" },
      { name: "Ship Cove (3rd visit)", date: "18 Oct 1774", lat: -41.09, lng: 174.28 },
      { name: "Cape Horn", date: "Dec 1774", lat: -55.98, lng: -67.28, note: "Rounded homeward" },
      { name: "South Georgia", date: "17 Jan 1775", lat: -54.43, lng: -36.59, note: "Discovered and claimed", pivotal: true },
      { name: "South Sandwich Islands", date: "Jan 1775", lat: -57.78, lng: -26.4, note: "Discovered" },
      { name: "Cape Town (return)", date: "22 Mar 1775", lat: -33.92, lng: 18.42 },
      { name: "Saint Helena", date: "May 1775", lat: -15.96, lng: -5.72 },
      { name: "Ascension Island", date: "1775", lat: -7.95, lng: -14.36 },
      { name: "Spithead, England", date: "30 Jul 1775", lat: 50.8, lng: -1.09, note: "Return; Terra Australis myth laid to rest" },
    ],
  },
  {
    id: "voyage-3",
    label: "Voyage 3",
    ship: "HMS Resolution & Discovery",
    years: "1776–1780",
    color: "#B91C1C", // crimson
    purpose: "Search for a Northwest Passage from the Pacific side and return Omai to the Society Islands.",
    summary:
      "Cook's final voyage sought a Northwest Passage linking the Pacific and Atlantic from the west. He made the first recorded European contact with the Hawaiian Islands and charted the northwest coast of America up to the Bering Strait before pack ice forced him back. Returning to Hawaii, Cook was killed in a confrontation at Kealakekua Bay in February 1779; his crews continued the search before turning home under Clerke and Gore.",
    path: [
      [-4.14, 50.37], [-8, 44], [-13, 36],
      [-16.25, 28.47], [-19, 20], [-22, 8], [-20, -5], [-10, -20], [3, -30],
      [18.42, -33.92], [26, -40], [37.8, -46.6], [52, -48],
      [69.35, -49.35], [90, -47], [115, -45], [138, -44],
      [147.35, -43.35], [150, -44], [158, -43], [168, -42],
      [174.28, -41.09], [176, -38], [-179, -32], [-172, -27],
      [-157.92, -21.93], [-158.12, -19.99], [-162, -20], [-170, -21],
      [-175.2, -21.13], [-176, -23], [-171, -23.3], [-160, -23.4],
      [-149.48, -23.36], [-149.51, -17.53], [-149.83, -17.53], [-151.02, -16.72], [-151.45, -16.82], [-151.74, -16.5],
      [-153, -12], [-156, -4], [-157, -1], [-157.4, 1.87],
      [-158, 8], [-159.67, 15], [-159.67, 21.95], [-160.2, 21.9],
      [-158, 27], [-150, 35], [-135, 42], [-124.1, 44.77],
      [-125.5, 47], [-126.6, 49.6], [-132, 53], [-138, 56], [-143, 58.5], [-147.0, 60.6],
      [-151.4, 60.7], [-154, 59], [-159, 56], [-164, 54.5], [-166.54, 53.87],
      [-165, 56], [-163, 58], [-162.1, 58.65], [-164, 61], [-166, 63.5], [-168, 65], [-168.09, 65.6],
      [-166, 67], [-163, 69], [-161.8, 70.73],
      [-166, 68], [-169, 63], [-167, 58], [-166.54, 53.87],
      [-165, 45], [-162, 34], [-159, 26], [-156.3, 20.8], [-156, 20], [-155.92, 19.48],
      [-160, 25], [-170, 35], [-180, 42], [170, 48], [158.65, 53.02],
      [156, 48], [150, 42], [145, 36], [138, 31], [130, 27], [122, 24], [116, 22],
      [113.55, 22.2], [113.26, 23.13], [112, 16], [108, 7], [106, -2],
      [105.28, -6.58], [95, -13], [75, -24], [50, -33], [30, -35],
      [18.43, -34.19], [8, -24], [-2, -8], [-14, 8], [-20, 24], [-16, 40], [-10, 50], [-6, 56],
      [-3.3, 58.96], [-1.5, 56], [0.75, 51.45],
    ],
    waypoints: [
      { name: "Plymouth, England", date: "12 Jul 1776", lat: 50.37, lng: -4.14, note: "Departure" },
      { name: "Santa Cruz, Tenerife", date: "1 Aug 1776", lat: 28.47, lng: -16.25, note: "Feed for the livestock" },
      { name: "Cape Town (Table Bay)", date: "18 Oct 1776", lat: -33.92, lng: 18.42 },
      { name: "Prince Edward Islands", date: "13 Dec 1776", lat: -46.6, lng: 37.8, note: "Located and named" },
      { name: "Kerguelen Islands", date: "25 Dec 1776", lat: -49.35, lng: 69.35, note: "Found at last, missed on Voyage 2" },
      { name: "Adventure Bay, Tasmania", date: "26 Jan 1777", lat: -43.35, lng: 147.35, note: "Wood and water" },
      { name: "Ship Cove, Queen Charlotte Sound", date: "12 Feb 1777", lat: -41.09, lng: 174.28, note: "No revenge taken for the Grass Cove killings" },
      { name: "Mangaia, Cook Islands", date: "29 Mar 1777", lat: -21.93, lng: -157.92, note: "Reefs kept the ships offshore" },
      { name: "Atiu, Cook Islands", date: "Apr 1777", lat: -19.99, lng: -158.12 },
      { name: "Tongatapu, Friendly Islands", date: "Apr–Jul 1777", lat: -21.13, lng: -175.2, note: "Eleven weeks in Tonga" },
      { name: "Tubuai", date: "Aug 1777", lat: -23.36, lng: -149.48 },
      { name: "Matavai Bay, Tahiti", date: "12 Aug 1777", lat: -17.53, lng: -149.51 },
      { name: "Moorea", date: "Sep 1777", lat: -17.53, lng: -149.83 },
      { name: "Huahine", date: "Oct 1777", lat: -16.72, lng: -151.02, note: "Omai settled here" },
      { name: "Raiatea", date: "3 Nov 1777", lat: -16.82, lng: -151.45 },
      { name: "Bora Bora", date: "Dec 1777", lat: -16.5, lng: -151.74 },
      { name: "Christmas Island (Kiritimati)", date: "24 Dec 1777", lat: 1.87, lng: -157.4, note: "Observed a solar eclipse", pivotal: true },
      { name: "Waimea, Kauai", date: "20 Jan 1778", lat: 21.95, lng: -159.67, note: "First recorded European contact with Hawaii", pivotal: true },
      { name: "Niihau", date: "Feb 1778", lat: 21.9, lng: -160.2 },
      { name: "Cape Foulweather, Oregon", date: "7 Mar 1778", lat: 44.77, lng: -124.1, note: "First sight of the American coast" },
      { name: "Nootka Sound, Vancouver Island", date: "29 Mar 1778", lat: 49.6, lng: -126.6, note: "Month of repairs and fur trade" },
      { name: "Prince William Sound, Alaska", date: "May 1778", lat: 60.6, lng: -147.0 },
      { name: "Cook Inlet, Alaska", date: "Jun 1778", lat: 60.7, lng: -151.4, note: "A dead-end, not the Passage" },
      { name: "Unalaska, Aleutian Islands", date: "Jun 1778", lat: 53.87, lng: -166.54 },
      { name: "Cape Newenham", date: "16 Jul 1778", lat: 58.65, lng: -162.1 },
      { name: "Cape Prince of Wales", date: "9 Aug 1778", lat: 65.6, lng: -168.09, note: "Westernmost point of North America" },
      { name: "Icy Cape (70°44′N)", date: "18 Aug 1778", lat: 70.73, lng: -161.8, note: "Turned back by pack ice", pivotal: true },
      { name: "Unalaska (return)", date: "Oct 1778", lat: 53.87, lng: -166.54, note: "Repairs; met Russian fur traders" },
      { name: "Maui, Hawaii", date: "26 Nov 1778", lat: 20.8, lng: -156.3 },
      { name: "Kealakekua Bay, Hawaii", date: "17 Jan 1779", lat: 19.48, lng: -155.92, note: "Cook killed here on 14 Feb 1779", pivotal: true },
      { name: "Awatska Bay (Petropavlovsk), Kamchatka", date: "29 Apr 1779", lat: 53.02, lng: 158.65, note: "Under Clerke; a second Arctic attempt followed" },
      { name: "Macao", date: "1 Dec 1779", lat: 22.2, lng: 113.55, note: "Crews sold sea-otter furs" },
      { name: "Canton (Guangzhou)", date: "Dec 1779", lat: 23.13, lng: 113.26 },
      { name: "Prince's Island, Sunda Strait", date: "Jan 1780", lat: -6.58, lng: 105.28, note: "Watering on the way home" },
      { name: "Simon's Bay, Cape of Good Hope", date: "11 Apr 1780", lat: -34.19, lng: 18.43 },
      { name: "Stromness, Orkney", date: "Aug 1780", lat: 58.96, lng: -3.3 },
      { name: "The Nore, England", date: "4 Oct 1780", lat: 51.45, lng: 0.75, note: "Home after four years and three months" },
    ],
  },
];


// ── Ferdinand Magellan ───────────────────────────────────────────────────────
// Sources: Pigafetta journal (Hakluyt Society, 1874); Wikipedia "Magellan
// expedition"; Bergreen "Over the Edge of the World".
// PACIFIC CROSSING FIX: after the Strait exit at ~-75°W, longitude decreases
// (goes more negative = westward) so VoyageMap's unwrapSequence() draws the
// correct westward arc across the Pacific, not the short eastward path.
const MAGELLAN_VOYAGES: Voyage[] = [
  {
    id: "magellan-circumnavigation",
    label: "First Circumnavigation",
    ship: "Trinidad, Victoria (San Antonio, Concepción, Santiago lost/deserted)",
    years: "1519–1522",
    color: "#1F2937",
    purpose: "Discover a westward sea route to the Spice Islands (Moluccas) and complete the first circumnavigation of Earth.",
    summary: "Magellan's expedition left Spain in September 1519 with five ships and ~270 men. They crossed the Atlantic, navigated the Strait of Magellan into the Pacific (which Magellan named for its calm waters), and crossed the Pacific in 99 days to Guam. Magellan died in battle at Mactan (27 Apr 1521); Juan Sebastián Elcano assumed command. Under Elcano the expedition reached the Moluccas, loaded spice cargo, returned via the Indian Ocean and Cape of Good Hope, and arrived back in Spain in September 1522. Of ~270 who departed, only 18 returned aboard the sole surviving ship Victoria.",
    accuracyNote: "Pacific crossing route estimated — no daily positions survive for the open-ocean leg. Patagonian coast and Pacific island coordinates approximate. Pigafetta's journal cross-checked against Wikipedia timelines and modern scholarship.",
    path: [
      // Spain → Canary Islands
      [-6.41, 36.77], [-12, 32], [-16.31, 28.27],
      // Atlantic crossing SW
      [-22, 20], [-28, 10], [-35, 0], [-40, -12],
      [-43.18, -22.91], // Rio de Janeiro
      // South American coast south
      [-50, -33], [-58.43, -34.81], // Río de la Plata
      [-62, -42], [-65, -47], [-67.51, -49.29], // Port St. Julian
      [-68.5, -50.2], [-68.9, -52.3], // Cape Virgenes
      // Strait of Magellan
      [-70, -52.5], [-71.5, -53], [-73, -54], [-74.5, -53.5], [-75.5, -51], [-75.5, -49.5],
      // PACIFIC CROSSING: longitude DECREASES (going west)
      [-82, -46], [-95, -38], [-108, -28], [-120, -20], [-130, -15],
      [-138.9, -14.9], // near Puka-Puka (San Pablo)
      [-150.2, -9.77], // near Caroline Island (Tiburones)
      [-157, -5], [-165, 0], [-173, 6], [-178, 10],
      [167, 13],    // unwraps → ~-193° (Micronesia)
      [155, 13],    // unwraps → ~-205°
      [144.8, 13.6], // Guam → unwraps → ~-215°
      // Philippines
      [130, 11],
      [125.89, 9.71], [126.16, 9.69], [123.9, 10.3], [124.0, 10.32], // Cebu/Mactan
      [118.75, 9.25], [114.9, 4.9], // Palawan, Brunei
      [127.4, -0.3], // Tidore, Moluccas (eastward jog — correct geographically)
      // Return via Indian Ocean
      [112, -8], [95, -16], [75, -25], [50, -32], [30, -33],
      [18.42, -33.92], // Cape of Good Hope
      [8, -26], [-5, -12], [-12, 2], [-20, 12],
      [-23.64, 14.97], // Cape Verde
      [-20, 20], [-15, 26], [-10, 31], [-6.41, 36.77], // return Spain
    ],
    waypoints: [
      { name: "Sanlúcar de Barrameda, Spain", date: "20 Sep 1519", lat: 36.77, lng: -6.41, note: "Departure; fleet of 5 ships, ~270 men" },
      { name: "Tenerife, Canary Islands", date: "3 Oct 1519", lat: 28.27, lng: -16.31, note: "Resupply; Magellan receives warning of Portuguese pursuit" },
      { name: "Rio de Janeiro, Brazil", date: "13 Dec 1519", lat: -22.91, lng: -43.18, note: "13 days; traded for food with locals" },
      { name: "Río de la Plata", date: "11 Jan 1520", lat: -34.81, lng: -58.43, note: "Mistaken for a strait; proved to be a river mouth" },
      { name: "Port St. Julian, Patagonia", date: "31 Mar 1520", lat: -49.29, lng: -67.51, note: "Winter harbor (5 months); Easter mutiny quelled; Santiago lost in storm" },
      { name: "Cape Virgenes — Strait entrance", date: "21 Oct 1520", lat: -52.3, lng: -68.9, note: "Strait discovered; San Antonio deserts and returns to Spain" },
      { name: "Strait of Magellan", date: "1 Nov 1520", lat: -52.5, lng: -71.0, note: "All Saints' Channel; 373-mile navigation through the strait" },
      { name: "Exit to Pacific", date: "28 Nov 1520", lat: -50.5, lng: -75.3, note: "Magellan names the ocean Mar Pacífico for its calm", pivotal: true },
      { name: "San Pablo Island (Puka-Puka area)", date: "24 Jan 1521", lat: -14.9, lng: -138.9, note: "Uninhabited; could not land; crew beginning to starve" },
      { name: "Tiburones Island (Caroline Island area)", date: "21 Feb 1521", lat: -9.77, lng: -150.2, note: "Uninhabited; crew starving and scurvy-ridden; first landfall since Strait" },
      { name: "Guam, Mariana Islands", date: "6 Mar 1521", lat: 13.6, lng: 144.8, note: "First land in 99 days at sea; Chamorro seized a boat; Magellan retaliated by burning 40 houses" },
      { name: "Homonhon, Philippines", date: "16 Mar 1521", lat: 9.71, lng: 125.89, note: "Rested 10 days; gathered fresh water and food" },
      { name: "Limasawa, Philippines", date: "28 Mar 1521", lat: 9.69, lng: 126.16, note: "First contact with Rajahs Kolambu and Siawi; blood compact; Enrique spoke their language — proof of circumnavigation" },
      { name: "Cebu, Philippines", date: "7 Apr 1521", lat: 10.3, lng: 123.9, note: "Rajah Humabon baptised; ~2,200 converts; Magellan intervenes in dispute on Mactan" },
      { name: "Battle of Mactan — Magellan killed", date: "27 Apr 1521", lat: 10.32, lng: 124.0, note: "Magellan killed by Lapu-Lapu's forces; ~60 Spaniards vs. 1,500 warriors; Elcano assumes command", pivotal: true },
      { name: "Palawan, Philippines", date: "May 1521", lat: 9.25, lng: 118.75, note: "Continued to Moluccas; fleet reduced to 2 ships after Concepción burned" },
      { name: "Brunei", date: "Sep 1521", lat: 4.9, lng: 114.9, note: "Spectacular sultan's court; briefly attacked by Bruneian fleet" },
      { name: "Tidore, Moluccas", date: "8 Nov 1521", lat: -0.3, lng: 127.4, note: "Goal reached — the Spice Islands! Loaded 26 tons of cloves; Trinidad stayed for repairs (later captured by Portuguese)", pivotal: true },
      { name: "Cape of Good Hope", date: "6 May 1522", lat: -33.92, lng: 18.42, note: "Rounded homeward; crew on rice rations only" },
      { name: "Cape Verde Islands", date: "9 Jul 1522", lat: 14.97, lng: -23.64, note: "Portuguese captured 13 crew; crew discovered they had lost a day — confirmed westward circumnavigation" },
      { name: "Sanlúcar de Barrameda — return", date: "6 Sep 1522", lat: 36.77, lng: -6.41, note: "18 survivors return aboard Victoria; first circumnavigation of Earth complete", pivotal: true },
    ],
  },
];

// ── Christopher Columbus ─────────────────────────────────────────────────────
// Sources: Las Casas abstract of the Diario (first voyage log); Ferdinand
// Columbus's "Life of the Admiral"; Wikipedia per-voyage articles.
const COLUMBUS_VOYAGES: Voyage[] = [
  {
    id: "columbus-1",
    label: "First Voyage — Discovery",
    ship: "Niña, Pinta, Santa María",
    years: "1492–1493",
    color: "#1e3a8a",
    purpose: "Reach Asia (the Indies) by sailing west across the Atlantic from Europe.",
    summary: "Departing Palos de la Frontera on 3 August 1492, Columbus sailed southwest via the Canary Islands then due west across the Atlantic. On 12 October 1492 he made landfall on San Salvador (Guanahaní) in the Bahamas — the first European contact with the Americas since the Norse. He explored Cuba and Hispaniola, where the Santa María ran aground on Christmas Day. Columbus returned via the Azores, arriving at Palos on 15 March 1493 to enormous acclaim.",
    accuracyNote: "Route based on the Las Casas abstract of Columbus's lost Diario. San Salvador identification (Watlings Island) accepted by most modern scholars. Return via Azores confirmed.",
    path: [
      [-6.9, 37.23], [-12, 34], [-17.11, 28.09], // Palos → Canary Islands
      [-22, 28], [-30, 27], [-40, 26], [-52, 25], [-62, 24], [-74.5, 24.05], // Atlantic crossing
      [-75.0, 21.5], [-72.3, 19.9], // Cuba, Hispaniola
      [-65, 22], [-50, 28], [-35, 34], [-25.52, 37.02], // return via Azores
      [-15, 38], [-9.14, 38.72], [-6.9, 37.23], // Lisbon, Palos
    ],
    waypoints: [
      { name: "Palos de la Frontera, Spain", date: "3 Aug 1492", lat: 37.23, lng: -6.9, note: "Departure of 3 ships, ~90 men" },
      { name: "San Sebastián de la Gomera, Canary Islands", date: "6 Sep 1492", lat: 28.09, lng: -17.11, note: "Final resupply; repaired Pinta's rudder" },
      { name: "San Salvador (Guanahaní), Bahamas", date: "12 Oct 1492", lat: 24.05, lng: -74.5, note: "First landfall; claimed for Spain; Taíno people", pivotal: true },
      { name: "Cuba (northeastern coast)", date: "28 Oct 1492", lat: 21.5, lng: -75.0, note: "Columbus believed this was the Asian mainland" },
      { name: "La Navidad, Hispaniola — Santa María wrecked", date: "25 Dec 1492", lat: 19.8, lng: -72.7, note: "Santa María ran aground; 39 men left in fort — all later killed", pivotal: true },
      { name: "Santa María, Azores", date: "18 Feb 1493", lat: 37.02, lng: -25.52, note: "Severe storm on return; first European landfall" },
      { name: "Lisbon, Portugal", date: "4 Mar 1493", lat: 38.72, lng: -9.14, note: "Met King João II" },
      { name: "Palos de la Frontera — return", date: "15 Mar 1493", lat: 37.23, lng: -6.9, note: "Triumphant return; news spread across Europe within weeks", pivotal: true },
    ],
  },
  {
    id: "columbus-2",
    label: "Second Voyage — Colonisation",
    ship: "17 ships, ~1,200 men",
    years: "1493–1496",
    color: "#1d4ed8",
    purpose: "Establish a permanent Spanish colony in Hispaniola and continue exploring the Caribbean.",
    summary: "The largest Columbus fleet departed Cádiz in September 1493 taking a more southerly route, discovering Dominica, Guadaloupe, Antigua, Puerto Rico, and Jamaica. Columbus established La Isabela — the first permanent European town in the Americas — on Hispaniola. He surveyed Cuba's south coast and charted Jamaica before returning to Cádiz in June 1496.",
    accuracyNote: "Route sources are Ferdinand Columbus's biography and Peter Martyr's letters. Lesser Antilles landfalls well-documented.",
    path: [
      [-6.3, 36.53], [-14, 30], [-18.0, 27.7], // Cádiz → Canary Islands
      [-30, 22], [-45, 18], [-58, 16],
      [-61.4, 15.3], [-61.6, 16.2], [-62, 17], [-66.5, 18.25], // Dominica, Guadaloupe, Puerto Rico
      [-72.3, 18.5], [-77.9, 20.4], [-77.3, 18.1], // Hispaniola, Cuba, Jamaica
      [-72.3, 18.5], [-60, 17], [-40, 22], [-20, 30], [-6.3, 36.53],
    ],
    waypoints: [
      { name: "Cádiz, Spain", date: "25 Sep 1493", lat: 36.53, lng: -6.3, note: "17 ships, ~1,200 men" },
      { name: "Dominica", date: "3 Nov 1493", lat: 15.3, lng: -61.4, note: "First island sighted on the southerly crossing" },
      { name: "Guadaloupe", date: "4 Nov 1493", lat: 16.2, lng: -61.6, note: "Evidence of Carib practices; found captured Taíno women" },
      { name: "Puerto Rico (San Juan Bautista)", date: "19 Nov 1493", lat: 18.25, lng: -66.5, note: "First European sighting of Puerto Rico" },
      { name: "La Isabela, Hispaniola", date: "2 Jan 1494", lat: 19.88, lng: -71.07, note: "Founded first permanent European town in the Americas", pivotal: true },
      { name: "Cuba south coast survey", date: "Apr–May 1494", lat: 19.9, lng: -77.9, note: "Columbus forced crew to swear Cuba was the Asian mainland, not an island" },
      { name: "Jamaica", date: "May 1494", lat: 18.1, lng: -77.3, note: "First European visit; friendly contact with Taíno" },
      { name: "Cádiz — return", date: "11 Jun 1496", lat: 36.53, lng: -6.3, note: "Columbus returned ill; colony troubled", pivotal: true },
    ],
  },
  {
    id: "columbus-3",
    label: "Third Voyage — South American Mainland",
    ship: "6 ships",
    years: "1498–1500",
    color: "#2563eb",
    purpose: "Resupply Hispaniola and explore further south for a possible continent.",
    summary: "Columbus crossed south of the Canaries via Cape Verde and sailed farther south than any prior voyage before turning west. On 31 July 1498 he sighted Trinidad and the Orinoco delta — the first European to see the South American mainland. He deduced from the Orinoco's massive outflow that this was a large landmass. He was later arrested in Hispaniola by royal envoy Francisco de Bobadilla and returned to Spain in chains in late 1500.",
    accuracyNote: "Trinidad and Paria Peninsula coordinates well-established. Return under arrest; exact return route not well documented.",
    path: [
      [-6.4, 36.77], [-14, 32], [-23.51, 14.93], // Sanlúcar → Cape Verde
      [-28, 8], [-35, 3], [-45, 6], [-55, 9],
      [-61.4, 10.5], [-62.55, 10.65], // Trinidad, Paria/Venezuela — mainland!
      [-64, 11], [-69.9, 18.47], // Hispaniola
      [-55, 22], [-35, 32], [-15, 37], [-6.3, 36.53],
    ],
    waypoints: [
      { name: "Sanlúcar de Barrameda, Spain", date: "30 May 1498", lat: 36.77, lng: -6.4, note: "Third departure; 6 ships" },
      { name: "São Tiago, Cape Verde Islands", date: "5 Jul 1498", lat: 14.93, lng: -23.51, note: "Cross-equatorial route to avoid Portuguese ships" },
      { name: "Trinidad", date: "31 Jul 1498", lat: 10.45, lng: -61.4, note: "First sighting of the South American continent (Orinoco coast visible)", pivotal: true },
      { name: "Paria Peninsula, Venezuela", date: "1–13 Aug 1498", lat: 10.65, lng: -62.55, note: "Columbus recognised the massive Orinoco outflow as a continental river — called it the 'Terrestrial Paradise'; first European on the South American mainland" },
      { name: "Hispaniola — arrest", date: "Aug 1500", lat: 18.47, lng: -69.9, note: "Bobadilla arrested Columbus; sent back to Spain in chains", pivotal: true },
      { name: "Cádiz — return in chains", date: "25 Nov 1500", lat: 36.53, lng: -6.3, note: "Columbus stripped of titles; eventually pardoned and partially restored" },
    ],
  },
  {
    id: "columbus-4",
    label: "Fourth Voyage — High Voyage",
    ship: "4 ships",
    years: "1502–1504",
    color: "#3b82f6",
    purpose: "Find a western passage through the Caribbean to the Indian Ocean.",
    summary: "Columbus's final voyage was his fastest Atlantic crossing (21 days). Refused entry to Hispaniola, he explored the Central American coast from Honduras to Panama for months, searching for a strait to the Indian Ocean. No passage was found; two ships were abandoned. He was stranded in Jamaica for over a year before rescue. Columbus died in Spain on 20 May 1506, still believing he had reached Asia.",
    accuracyNote: "Central American coastal survey documented from Columbus's Lettera Rarissima to the Spanish monarchs. Jamaican stranding confirmed by multiple sources.",
    path: [
      [-6.3, 36.53], [-14, 30], [-14.5, 28.0], // Cádiz → Canary Islands
      [-35, 22], [-50, 18], [-57, 16],
      [-61.02, 14.64], // Martinique
      [-69.9, 18.47], // Hispaniola (refused)
      [-74, 20], [-85.8, 16.44], // Cuba, Honduras
      [-83.2, 15.0], [-83.0, 10.0], [-79.9, 9.3], // Nicaragua, Costa Rica, Panama
      [-77.1, 18.47], // Jamaica — stranded 1 year
      [-69.9, 18.47], [-55, 22], [-35, 32], [-15, 37], [-6.4, 36.77],
    ],
    waypoints: [
      { name: "Cádiz, Spain", date: "11 May 1502", lat: 36.53, lng: -6.3, note: "4 ships, 150 men; fastest Atlantic crossing ahead (21 days)" },
      { name: "Martinique", date: "15 Jun 1502", lat: 14.64, lng: -61.02, note: "Made landfall after 21-day crossing — a record at the time" },
      { name: "Hispaniola — entry refused", date: "29 Jun 1502", lat: 18.47, lng: -69.9, note: "Governor Ovando refused Columbus entry; Columbus correctly predicted a hurricane (ignored; 20 Spanish ships lost)" },
      { name: "Guanaja Island, Honduras", date: "30 Jul 1502", lat: 16.44, lng: -85.8, note: "Encountered large Maya trading canoe — first Central American contact" },
      { name: "Veragua / Belén, Panama", date: "6 Jan 1503", lat: 9.3, lng: -79.9, note: "Attempted gold-mining settlement; abandoned after indigenous attacks", pivotal: true },
      { name: "Jamaica — stranded", date: "25 Jun 1503", lat: 18.47, lng: -77.1, note: "Two ships beached; marooned over a year; Columbus used predicted lunar eclipse to bluff food from the Taíno", pivotal: true },
      { name: "Sanlúcar de Barrameda — return", date: "7 Nov 1504", lat: 36.77, lng: -6.4, note: "Columbus arrived ill; died 20 May 1506, still believing he had reached Asia" },
    ],
  },
];

// ── Vasco da Gama ─────────────────────────────────────────────────────────────
// Sources: anonymous Roteiro (eyewitness journal, first voyage); Gaspar Corrêa's
// Lendas da India; Wikipedia "Vasco da Gama" and per-voyage articles.
const DA_GAMA_VOYAGES: Voyage[] = [
  {
    id: "da-gama-1",
    label: "First Voyage to India",
    ship: "São Gabriel, São Rafael, Berrio, supply caravel",
    years: "1497–1499",
    color: "#14532d",
    purpose: "Find a direct sea route from Portugal to India by sailing around Africa.",
    summary: "Da Gama departed Lisbon on 8 July 1497. He executed a bold 'volta do mar' — a sweeping westward arc far into the South Atlantic to catch the trade winds — before rounding the Cape of Good Hope. Up the East African coast he secured the Arab navigator Aḥmad ibn Mājid at Malindi, who guided him across the Indian Ocean. Calicut (Kozhikode) was reached on 20 May 1498 — opening the permanent sea route between Europe and Asia. The Zamorin was unimpressed by da Gama's trade goods. On the return, scurvy killed a third of the crew and the São Rafael was burned for lack of men. Da Gama arrived back at Lisbon in September 1499.",
    accuracyNote: "Outbound route via Atlantic loop from the anonymous Roteiro. East Africa and India waypoints well-confirmed. Return dates approximate.",
    path: [
      [-9.14, 38.7], [-15, 30], [-23.51, 14.93], // Lisbon → Cape Verde
      [-28, 8], [-32, 0], [-35, -14], [-30, -28],
      [-20, -35], [-5, -35], [10, -34], [18.4, -34.36], // Cape of Good Hope
      [22.1, -34.2], [31.0, -29.6], [35.5, -20], [40.73, -15.04], // Mozambique
      [39.67, -4.05], [40.13, -3.22], // Mombasa, Malindi
      [50, 5], [65, 8], [75.78, 11.25], // Indian Ocean → Calicut
      [65, 8], [58.6, 23.6], // return via Oman
      [40.13, -3.22], [40.73, -15.04], [18.4, -34.36], // East Africa back
      [0, -30], [-27.2, 38.5], [-9.14, 38.7], // Azores, Lisbon
    ],
    waypoints: [
      { name: "Lisbon (Restelo), Portugal", date: "8 Jul 1497", lat: 38.7, lng: -9.14, note: "Departure; celebrated mass at the Jerónimos; the crew were not expected to return", pivotal: true },
      { name: "São Tiago, Cape Verde Islands", date: "26 Jul 1497", lat: 14.93, lng: -23.51, note: "Resupply; Berrio fitted with a new mast" },
      { name: "South Atlantic volta do mar", date: "Aug–Oct 1497", lat: -25.0, lng: -32.0, note: "Bold westward loop far into the South Atlantic to catch the trade winds — no land for ~3 months" },
      { name: "St. Helena Bay, South Africa", date: "4 Nov 1497", lat: -32.7, lng: 18.0, note: "First Africa landfall after 3 months at sea; clashed with local San people" },
      { name: "Cape of Good Hope", date: "22 Nov 1497", lat: -34.36, lng: 18.47, note: "Rounded the Cape; Dias had turned back here 10 years earlier", pivotal: true },
      { name: "Mozambique Island", date: "Mar 1498", lat: -15.04, lng: 40.73, note: "Arab trading city; bombarded on departure after hostilities" },
      { name: "Mombasa, Kenya", date: "7 Apr 1498", lat: -4.05, lng: 39.67, note: "Hostile reception; foiled a plot to sabotage their rudders" },
      { name: "Malindi, Kenya", date: "14 Apr 1498", lat: -3.22, lng: 40.13, note: "Friendly Sultan; secured Arab navigator Aḥmad ibn Mājid to guide them to India" },
      { name: "Calicut (Kozhikode), India", date: "20 May 1498", lat: 11.25, lng: 75.78, note: "First direct sea link between Europe and India; Zamorin unimpressed by trade goods; hostile Portuguese–Muslim merchant rivalry", pivotal: true },
      { name: "Malindi (return)", date: "7 Jan 1499", lat: -3.22, lng: 40.13, note: "Scurvy killed 30 men on return crossing; São Rafael burned — too few crew to sail 3 ships" },
      { name: "Lisbon — return", date: "9 Sep 1499", lat: 38.7, lng: -9.14, note: "Da Gama returned via Azores (brother Paulo died there); only 55 of ~170 men survived", pivotal: true },
    ],
  },
  {
    id: "da-gama-2",
    label: "Second Voyage — Armada of Retribution",
    ship: "20 ships, ~800 men",
    years: "1502–1503",
    color: "#15803d",
    purpose: "Establish Portuguese dominance over the Indian Ocean trade and punish Calicut.",
    summary: "A heavily armed military expedition. Da Gama set up the first permanent Portuguese trading posts on the East African coast. At sea he intercepted the pilgrim ship Miri (~400 passengers) and burned it with all aboard. At Calicut he bombarded the city and mutilated captured fishermen. He supported the friendly ruler of Cochin against Calicut. The voyage returned a profit of 800%, cementing Portugal's Indian Ocean dominance.",
    accuracyNote: "Massacre of the Miri attested in multiple Portuguese chronicles. East Africa and India waypoints from Gaspar Corrêa and João de Barros.",
    path: [
      [-9.14, 38.7], [-23.51, 14.93], // Lisbon → Cape Verde
      [-28, 5], [-28, -22], [18.4, -34.36], // Atlantic loop → Cape
      [35.1, -20.17], [39.5, -8.9], [39.67, -4.05], // Sofala, Kilwa, Mombasa
      [60.0, 12.0], // Arabian Sea (Miri massacre location)
      [75.78, 11.25], [76.26, 9.93], [75.37, 11.87], // Calicut, Cochin, Cannanore
      [39.67, -4.05], [18.4, -34.36], [-27.2, 38.5], [-9.14, 38.7],
    ],
    waypoints: [
      { name: "Lisbon, Portugal", date: "12 Feb 1502", lat: 38.7, lng: -9.14, note: "20 ships — the largest Portuguese fleet yet sent to India" },
      { name: "Sofala, Mozambique", date: "May 1502", lat: -20.17, lng: 35.1, note: "Established the first permanent Portuguese factory on the East African coast" },
      { name: "Kilwa, Tanzania", date: "Jul 1502", lat: -8.9, lng: 39.5, note: "Forced the Sultan to pay tribute to Portugal on pain of bombardment" },
      { name: "Miri massacre (Arabian Sea)", date: "Oct 1502", lat: 12.0, lng: 60.0, note: "Intercepted the pilgrim ship Miri (~400 passengers) and burned it with all aboard — condemned even by some contemporaries", pivotal: true },
      { name: "Calicut, India", date: "Oct 1502", lat: 11.25, lng: 75.78, note: "Bombarded the city; hanged captured fishermen; sent severed hands and heads ashore to the Zamorin" },
      { name: "Cochin (Kochi), India", date: "Nov 1502–Feb 1503", lat: 9.93, lng: 76.26, note: "Loaded massive spice cargo; defended the pro-Portuguese ruler against the Zamorin's fleet" },
      { name: "Lisbon — return", date: "Oct 1503", lat: 38.7, lng: -9.14, note: "Voyage profit ~800%; da Gama's reputation at its height", pivotal: true },
    ],
  },
  {
    id: "da-gama-3",
    label: "Third Voyage — Final Voyage, Viceroy of India",
    ship: "15 ships",
    years: "1524",
    color: "#166534",
    purpose: "Serve as first Viceroy of India and reform the corruption-riddled Portuguese colonial administration.",
    summary: "After a 21-year absence, da Gama was appointed Viceroy and departed in April 1524. He arrived in Goa in September, dismissing corrupt officials, then proceeded to Cochin. His health collapsed; he died at Cochin on Christmas Eve, 1524. His body was returned to Portugal in 1539 and interred at the Jerónimos Monastery — where his fleet had received its blessing 27 years before.",
    accuracyNote: "Waypoints confirmed from Gaspar Corrêa's Lendas da India. Da Gama's death at Cochin on 24 December 1524 confirmed by multiple contemporaries.",
    path: [
      [-9.14, 38.7], [-23.51, 14.93],
      [-28, 5], [-28, -25], [18.4, -34.36],
      [40.73, -15.04], [39.67, -4.05],
      [55, 8], [73.83, 15.5], [76.26, 9.93],
    ],
    waypoints: [
      { name: "Lisbon, Portugal", date: "9 Apr 1524", lat: 38.7, lng: -9.14, note: "Appointed Viceroy of India; aged ~60 and in poor health" },
      { name: "Cape of Good Hope", date: "Jun 1524", lat: -34.36, lng: 18.47, note: "Rounded the Cape for the third and final time" },
      { name: "Goa, India", date: "Sep 1524", lat: 15.5, lng: 73.83, note: "Arrived as Viceroy; immediately dismissed officials accused of corruption" },
      { name: "Cochin (Kochi), India — death", date: "24 Dec 1524", lat: 9.93, lng: 76.26, note: "Da Gama died on Christmas Eve, 1524; body returned to Portugal in 1539; interred at the Jerónimos Monastery", pivotal: true },
    ],
  },
];

// ── Zheng He ──────────────────────────────────────────────────────────────────
// Sources: Ma Huan's Yingya Shenglan (1433); Fei Xin's Xingcha Shenglan;
// Wikipedia "Voyages of Zheng He". Original Ming logbooks were destroyed;
// all routes are reconstructed from these secondary accounts.
const ZHENG_HE_VOYAGES: Voyage[] = [
  {
    id: "zheng-he-1",
    label: "First Treasure Voyage",
    ship: "62 treasure ships; ~225 support vessels; ~27,800 crew",
    years: "1405–1407",
    color: "#92400e",
    purpose: "Demonstrate Ming imperial prestige, extract tribute from Southeast Asian kingdoms, and open trade relations to India.",
    summary: "Zheng He's first voyage was the largest fleet the world had ever seen. Departing from Liujiagang near Suzhou in summer 1405, it called at Champa (Vietnam), Java, Palembang (defeating pirate Chen Zuyi), Malacca, Ceylon, and Calicut. At Calicut the admiral presented gifts and received tribute. On Ceylon, the king Alagonakkara attacked the Chinese and was captured — the first time a distant monarch had been deposed by a Chinese expedition.",
    accuracyNote: "Ports of call from Ma Huan's Yingya Shenglan and the Yongle Emperor's edicts. Exact routes between ports estimated; open-ocean paths approximate.",
    path: [
      [120.1, 31.9], [118.6, 24.9], // Liujiagang → Quanzhou
      [108.2, 16.1], // Champa (Vietnam)
      [112.7, -7.2], // Java
      [104.7, -2.9], [102.2, 2.2], [95.3, 5.5], // Palembang, Malacca, Sumatra
      [80.2, 6.0], [76.6, 8.88], [75.78, 11.25], // Ceylon, Quilon, Calicut
      [80.2, 6.0], [95.3, 5.5], [102.2, 2.2], [108.2, 16.1],
      [118.6, 24.9], [120.1, 31.9],
    ],
    waypoints: [
      { name: "Liujiagang (near Suzhou), China", date: "Summer 1405", lat: 31.9, lng: 120.1, note: "Departure of the largest fleet the pre-industrial world had seen; 62 'treasure ships' each reportedly up to 120m long", pivotal: true },
      { name: "Champa (Da Nang area), Vietnam", date: "1405", lat: 16.1, lng: 108.2, note: "First tributary call; Cham ruler submitted gifts to the Yongle Emperor" },
      { name: "Java", date: "1405–06", lat: -7.2, lng: 112.7, note: "Intervened in civil war; Ming authority asserted" },
      { name: "Palembang, Sumatra", date: "1406", lat: -2.9, lng: 104.7, note: "Defeated and captured Chinese pirate Chen Zuyi; executed in Nanjing" },
      { name: "Malacca", date: "1406", lat: 2.2, lng: 102.2, note: "Established Malacca as key entrepôt under Chinese protection" },
      { name: "Calicut (Kozhikode), India", date: "1406–07", lat: 11.25, lng: 75.78, note: "Furthest point of Voyage 1; gifts of silk and porcelain; received spices", pivotal: true },
      { name: "Ceylon (Sri Lanka)", date: "1407", lat: 6.0, lng: 80.2, note: "King Alagonakkara attacked the Chinese; Zheng He defeated his army and captured him; brought to Nanjing" },
      { name: "Nanjing, China — return", date: "Oct 1407", lat: 32.06, lng: 118.78, note: "Triumphant return; captive Ceylonese king released after symbolic tribute", pivotal: true },
    ],
  },
  {
    id: "zheng-he-2",
    label: "Second Treasure Voyage",
    ship: "~50 ships",
    years: "1407–1409",
    color: "#a16207",
    purpose: "Escort foreign envoys home and consolidate the tributary network from the first voyage.",
    summary: "The second voyage primarily escorted home the many foreign envoys who had accompanied Zheng He back to Nanjing. It returned to the ports established on the first voyage — Champa, Java, Siam, Malacca, Calicut — consolidating the Ming tributary network. Cochin was visited for the first time.",
    accuracyNote: "Limited records survive; ports approximated from imperial edicts and Ma Huan's later compilation.",
    path: [
      [120.1, 31.9], [118.6, 24.9], [108.2, 16.1],
      [100.5, 14.0], [102.2, 2.2], [80.2, 6.0], [75.78, 11.25], [76.26, 9.93],
      [75.78, 11.25], [80.2, 6.0], [102.2, 2.2], [108.2, 16.1], [120.1, 31.9],
    ],
    waypoints: [
      { name: "Liujiagang, China", date: "1407", lat: 31.9, lng: 120.1, note: "Second departure; escorting many foreign dignitaries home" },
      { name: "Siam (Bangkok area)", date: "1407–08", lat: 14.0, lng: 100.5, note: "New port of call; Siamese king submitted to Ming tributary relations" },
      { name: "Malacca", date: "1408", lat: 2.2, lng: 102.2, note: "Malaccan ruler formally invested by the Emperor" },
      { name: "Cochin (Kochi), India", date: "1408–09", lat: 9.93, lng: 76.26, note: "First visit; established trade" },
      { name: "Nanjing, China — return", date: "1409", lat: 32.06, lng: 118.78, note: "Foreign envoys presented at the imperial court" },
    ],
  },
  {
    id: "zheng-he-3",
    label: "Third Treasure Voyage",
    ship: "~48 ships",
    years: "1409–1411",
    color: "#b45309",
    purpose: "Assert Ming authority in Ceylon; extend Indian contacts.",
    summary: "The third voyage extended the Indian Ocean network. A secondary squadron under Yin Qing visited Hormuz for the first time, marking the first Chinese contact with the Persian Gulf. Zheng He defeated King Alagonakkara of Ceylon again, bringing him and his court to Nanjing as tribute payers.",
    accuracyNote: "Hormuz contact via secondary squadron only. Ceylon campaign details from Ma Huan.",
    path: [
      [120.1, 31.9], [118.6, 24.9], [108.2, 16.1],
      [102.2, 2.2], [80.2, 6.0], [75.78, 11.25],
      [56.5, 27.1], // Hormuz (secondary squadron)
      [75.78, 11.25], [80.2, 6.0], [102.2, 2.2], [118.6, 24.9], [120.1, 31.9],
    ],
    waypoints: [
      { name: "Liujiagang, China", date: "1409", lat: 31.9, lng: 120.1, note: "Third departure" },
      { name: "Malacca", date: "1409–10", lat: 2.2, lng: 102.2, note: "Protectorate formalised; sultan officially invested" },
      { name: "Ceylon (Sri Lanka)", date: "1410–11", lat: 6.0, lng: 80.2, note: "Second battle; Alagonakkara captured with his family and brought to Nanjing", pivotal: true },
      { name: "Hormuz (secondary squadron)", date: "1410–11", lat: 27.1, lng: 56.5, note: "First Chinese contact with the Persian Gulf" },
      { name: "Nanjing, China — return", date: "Jul 1411", lat: 32.06, lng: 118.78, note: "Ceylonese king released; later installed as tributary ruler by China" },
    ],
  },
  {
    id: "zheng-he-4",
    label: "Fourth Treasure Voyage",
    ship: "63 ships",
    years: "1413–1415",
    color: "#c2410c",
    purpose: "Reach the Persian Gulf and Arabian Peninsula; first Chinese contact with East Africa.",
    summary: "The fourth voyage was Zheng He's first personal visit to Hormuz and the Arabian Peninsula. He called at Aden (Yemen) and Mogadishu and Malindi (Somalia/Kenya) — the first Chinese fleet to reach East Africa. The Sultan of Malindi sent a giraffe to Nanjing, identified with the mythological qilin and celebrated as a sign of Heaven's approval.",
    accuracyNote: "East African landfalls confirmed by the giraffe tribute and diplomatic letters in the Ming Shilu. Mogadishu and Malindi from Fei Xin.",
    path: [
      [120.1, 31.9], [118.6, 24.9], [108.2, 16.1],
      [102.2, 2.2], [80.2, 6.0], [75.78, 11.25],
      [56.5, 27.1], [45.0, 12.8],
      [45.34, 2.05], [40.13, -3.22],
      [45.0, 12.8], [56.5, 27.1], [75.78, 11.25],
      [102.2, 2.2], [118.6, 24.9], [120.1, 31.9],
    ],
    waypoints: [
      { name: "Liujiagang, China", date: "Dec 1413", lat: 31.9, lng: 120.1, note: "Fourth departure; Ma Huan joined as Arabic interpreter" },
      { name: "Hormuz", date: "1414", lat: 27.1, lng: 56.5, note: "Main fleet's first visit to the Persian Gulf" },
      { name: "Aden, Yemen", date: "1414", lat: 12.8, lng: 45.0, note: "First Chinese fleet to reach Arabia" },
      { name: "Mogadishu, Somalia", date: "1414–15", lat: 2.05, lng: 45.34, note: "First Chinese contact with East Africa south of the Horn; giraffes and zebras obtained", pivotal: true },
      { name: "Malindi, Kenya", date: "1415", lat: -3.22, lng: 40.13, note: "Sultan sent a giraffe to the Yongle Emperor, celebrated as the mythological qilin" },
      { name: "Nanjing, China — return", date: "Aug 1415", lat: 32.06, lng: 118.78, note: "Giraffe arrival caused public sensation; Emperor celebrated Heaven's favour", pivotal: true },
    ],
  },
  {
    id: "zheng-he-5",
    label: "Fifth Treasure Voyage",
    ship: "~50 ships",
    years: "1417–1419",
    color: "#d97706",
    purpose: "Escort home the foreign ambassadors who had come to Nanjing; extend East Africa contacts.",
    summary: "The fifth voyage again escorted foreign delegations home, this time from as far as East Africa and Arabia. Zheng He returned to all established ports, consolidating China's maritime sphere which now stretched 12,000 km from China to the Swahili ports of East Africa.",
    accuracyNote: "Route follows the established pattern; specific waypoints from the Ming Shilu and Fei Xin's Xingcha Shenglan.",
    path: [
      [120.1, 31.9], [118.6, 24.9], [108.2, 16.1],
      [102.2, 2.2], [75.78, 11.25], [56.5, 27.1], [45.0, 12.8],
      [45.34, 2.05], [40.13, -3.22], [39.5, -8.9],
      [40.13, -3.22], [45.0, 12.8], [56.5, 27.1],
      [75.78, 11.25], [102.2, 2.2], [118.6, 24.9], [120.1, 31.9],
    ],
    waypoints: [
      { name: "Liujiagang, China", date: "1417", lat: 31.9, lng: 120.1, note: "Fifth departure; escorting 18 foreign rulers and envoys home" },
      { name: "Hormuz", date: "1417–18", lat: 27.1, lng: 56.5, note: "Tribute exchange with Persian Gulf rulers" },
      { name: "Aden, Yemen", date: "1418", lat: 12.8, lng: 45.0, note: "Arab envoys escorted home" },
      { name: "Kilwa, Tanzania", date: "1418–19", lat: -8.9, lng: 39.5, note: "Southernmost East African reach; tributary relationship formalised" },
      { name: "Nanjing, China — return", date: "Aug 1419", lat: 32.06, lng: 118.78, note: "Chinese sphere of influence covered most of the Indian Ocean" },
    ],
  },
  {
    id: "zheng-he-6",
    label: "Sixth Treasure Voyage",
    ship: "~40 ships",
    years: "1421–1422",
    color: "#f59e0b",
    purpose: "Escort remaining foreign envoys home; reinforce the tributary network.",
    summary: "The sixth voyage escorted back envoys collected on the fifth voyage. The Yongle Emperor — Zheng He's greatest patron — died in 1424 while the fleet was at sea. His successor Hongxi immediately suspended the voyages and ordered Zheng He to remain in Nanjing as garrison commander. The great voyages were over — for now.",
    accuracyNote: "Sixth voyage poorly documented in the Ming Shilu; exact ports uncertain. Yongle's death and suspension of voyages historically confirmed.",
    path: [
      [120.1, 31.9], [118.6, 24.9], [108.2, 16.1],
      [102.2, 2.2], [75.78, 11.25], [56.5, 27.1], [45.0, 12.8],
      [45.0, 12.8], [56.5, 27.1], [75.78, 11.25],
      [102.2, 2.2], [118.6, 24.9], [120.1, 31.9],
    ],
    waypoints: [
      { name: "Liujiagang, China", date: "1421", lat: 31.9, lng: 120.1, note: "Sixth departure" },
      { name: "Aden and Hormuz", date: "1421–22", lat: 12.8, lng: 45.0, note: "Returning envoys from Arabia and Persia" },
      { name: "Calicut, India", date: "1422", lat: 11.25, lng: 75.78, note: "Tribute exchange" },
      { name: "Nanjing, China — return; voyages suspended", date: "Sep 1422", lat: 32.06, lng: 118.78, note: "Yongle Emperor died Aug 1424; his successor immediately banned further voyages; Zheng He ordered to Nanjing", pivotal: true },
    ],
  },
  {
    id: "zheng-he-7",
    label: "Seventh Treasure Voyage — The Last",
    ship: "100+ ships; ~27,500 crew",
    years: "1431–1433",
    color: "#b45309",
    purpose: "Restore the tributary network after a 10-year hiatus; reach Hormuz and East Africa for the final time.",
    summary: "The seventh and final voyage was launched after a decade-long ban. It visited all established ports and pushed further — a sub-squadron reached Jeddah, 90 km from Mecca. Zheng He died during the return, probably at Calicut, in 1433. After his death, conservative Confucian officials dismantled the treasure fleet programme and destroyed the logbooks; China turned decisively inward.",
    accuracyNote: "Best-documented voyage due to the Liujiagong stele (1431) and Changle stele (1432) left by Zheng He himself. His death during the return is widely accepted; exact location uncertain.",
    path: [
      [120.1, 31.9], [121.5, 28.0], [118.6, 24.9],
      [108.2, 16.1], [112.7, -7.2], [102.2, 2.2],
      [95.3, 5.5], [80.2, 6.0], [75.78, 11.25],
      [56.5, 27.1], [45.0, 12.8], [43.6, 21.6], // Hormuz, Aden, Jeddah sub-fleet
      [45.34, 2.05], [40.13, -3.22], [39.5, -8.9],
      [40.13, -3.22], [45.0, 12.8], [56.5, 27.1],
      [75.78, 11.25], [102.2, 2.2], [118.6, 24.9], [120.1, 31.9],
    ],
    waypoints: [
      { name: "Liujiagang (Changle), China", date: "19 Jan 1431", lat: 31.9, lng: 120.1, note: "Seventh departure; Zheng He erected the Changle Stele — our best surviving primary source on the voyages", pivotal: true },
      { name: "Java", date: "1431", lat: -7.2, lng: 112.7, note: "Renewed tribute after a decade's absence" },
      { name: "Malacca", date: "1432", lat: 2.2, lng: 102.2, note: "Now the dominant entrepôt of Asia under Chinese protection" },
      { name: "Calicut, India", date: "1432", lat: 11.25, lng: 75.78, note: "Major tributary exchange; Zheng He likely died here on the return (1433)" },
      { name: "Hormuz", date: "1432", lat: 27.1, lng: 56.5, note: "Final visit to the Persian Gulf" },
      { name: "Aden / Jeddah sub-squadron", date: "1432", lat: 12.8, lng: 45.0, note: "Sub-fleet continued to Jeddah — 90 km from Mecca, closest any Chinese fleet approached Islam's holiest city" },
      { name: "Mogadishu, Somalia", date: "1432–33", lat: 2.05, lng: 45.34, note: "Last East Africa visit; giraffes, elephants, and leopards loaded for the Emperor" },
      { name: "Malindi, Kenya", date: "1433", lat: -3.22, lng: 40.13, note: "Southernmost point of the final voyage" },
      { name: "Nanjing, China — fleet returns without Zheng He", date: "Jul 1433", lat: 32.06, lng: 118.78, note: "Zheng He died en route (1433); the Confucian court dismantled the fleet programme and burned the logbooks — China never launched another deep-water treasure fleet", pivotal: true },
    ],
  },
];

// ── Ibn Battuta ───────────────────────────────────────────────────────────────
// Sources: Rihla (A Gift to Those Who Contemplate the Wonders of Cities and
// the Marvels of Travelling), dictated to Ibn Juzayy c. 1355; public-domain
// Samuel Lee translation (1829); Wikipedia "Ibn Battuta".
// His journey (1325–1354) covered ~75,000 km. Represented as 8 stages.
// Historians dispute some segments (especially China) as he may have dictated
// from memory decades later.
const IBN_BATTUTA_VOYAGES: Voyage[] = [
  {
    id: "battuta-1",
    label: "Stage 1 — The Great Pilgrimage",
    ship: "Overland caravans and coastal dhows",
    years: "1325–1326",
    color: "#7c2d12",
    purpose: "Perform the Hajj; Ibn Battuta was 21 years old and had no plan to travel further.",
    summary: "On 14 June 1325, the 21-year-old Ibn Battuta left Tangier alone, joining caravans across North Africa. He crossed the Maghreb, Egypt, and the Levant — visiting Cairo, Jerusalem, and Damascus — before reaching Mecca. He performed the Hajj and resolved to keep travelling. He would not return home for 29 years.",
    accuracyNote: "North African and Levantine stages well-documented in the Rihla. Some scholars question the Syria detour chronology.",
    path: [
      [-5.8, 35.78], [-1.3, 34.9], [10.18, 36.82],
      [13.2, 32.9], [29.92, 31.2], [31.25, 30.06],
      [35.22, 31.77], [36.29, 33.51],
      [39.61, 24.47], [39.83, 21.43],
    ],
    waypoints: [
      { name: "Tangier, Morocco", date: "14 Jun 1325", lat: 35.78, lng: -5.8, note: "Departed alone at age 21; 'I set out alone, having neither fellow-traveller in whose companionship I might find cheer, nor caravan whose party I might join'", pivotal: true },
      { name: "Tlemcen, Algeria", date: "Jul 1325", lat: 34.88, lng: -1.32, note: "Joined a caravan" },
      { name: "Tunis, Tunisia", date: "Oct 1325", lat: 36.82, lng: 10.18, note: "Impressed by the city's learning; stayed several weeks" },
      { name: "Alexandria, Egypt", date: "Apr 1326", lat: 31.2, lng: 29.92, note: "Visited the Pharos lighthouse; met holy men who prophesied his future travels" },
      { name: "Cairo, Egypt", date: "Apr 1326", lat: 30.05, lng: 31.25, note: "Described Cairo as 'the mother of all cities and mistress of broad provinces'" },
      { name: "Jerusalem", date: "Oct 1326", lat: 31.77, lng: 35.22, note: "Visited the Dome of the Rock and Al-Aqsa Mosque" },
      { name: "Damascus, Syria", date: "Nov 1326", lat: 33.51, lng: 36.29, note: "Spent Ramadan; joined the Syria Hajj caravan south" },
      { name: "Medina, Arabia", date: "Apr 1326", lat: 24.47, lng: 39.61, note: "Tomb of the Prophet; 'an indescribable sweetness seized my heart'" },
      { name: "Mecca, Arabia", date: "Jun 1326", lat: 21.43, lng: 39.83, note: "First Hajj; resolved never to travel the same road twice — beginning 29 years of continuous travel", pivotal: true },
    ],
  },
  {
    id: "battuta-2",
    label: "Stage 2 — Iraq, Persia & East Africa",
    ship: "Overland caravan; Red Sea and Indian Ocean dhows",
    years: "1326–1330",
    color: "#9a3412",
    purpose: "Explore Iraq, Persia, and East Africa; return for multiple subsequent Hajj pilgrimages.",
    summary: "After his first Hajj, Ibn Battuta turned north to Iraq and Persia — visiting Basra, Baghdad (still recovering from the Mongol sack of 1258), Tabriz, and Shiraz — before returning to Mecca. He then sailed down the Red Sea and East African coast as far as Kilwa (Tanzania), the southernmost Swahili port, before returning for a second Hajj. He spent three years in Mecca studying Islamic law.",
    accuracyNote: "Iraq and Persia well-documented. East African Kilwa identification confirmed archaeologically.",
    path: [
      [39.83, 21.43], [47.78, 30.51], [44.4, 33.34],
      [46.29, 38.08], [52.58, 29.59], [56.47, 27.1],
      [39.83, 21.43],
      [43.48, 11.36], [45.34, 2.05], [39.67, -4.05], [39.5, -8.9],
      [45.34, 2.05], [45.0, 12.8], [39.83, 21.43],
    ],
    waypoints: [
      { name: "Basra, Iraq", date: "1326", lat: 30.51, lng: 47.78, note: "City partly ruined from flooding; Ibn Battuta noted many canals" },
      { name: "Baghdad, Iraq", date: "1327", lat: 33.34, lng: 44.4, note: "Still recovering 70 years after the Mongol sack of 1258" },
      { name: "Tabriz, Azerbaijan (then Ilkhanate)", date: "1327", lat: 38.08, lng: 46.29, note: "Capital of the Mongol Ilkhanate; attended Friday sermon with the sultan" },
      { name: "Hormuz (Strait)", date: "1327", lat: 27.1, lng: 56.47, note: "Busy trading emporium; turned back rather than sailing to India (not yet ready)" },
      { name: "Zeila (near Djibouti)", date: "1329", lat: 11.36, lng: 43.48, note: "First landfall in East Africa; a Somali port in the Islamic sultanate" },
      { name: "Mogadishu, Somalia", date: "1330", lat: 2.05, lng: 45.34, note: "Wealthy Swahili city; feasted by the Sultan" },
      { name: "Mombasa, Kenya", date: "1330", lat: -4.05, lng: 39.67, note: "Visited the Swahili city" },
      { name: "Kilwa, Tanzania", date: "1330", lat: -8.9, lng: 39.5, note: "Southernmost African travels; praised as 'one of the finest and most substantially built towns'", pivotal: true },
      { name: "Mecca — second and third Hajj", date: "1330–32", lat: 21.43, lng: 39.83, note: "Returned to Mecca; remained three years studying Islamic jurisprudence" },
    ],
  },
  {
    id: "battuta-3",
    label: "Stage 3 — Anatolia, Golden Horde & India",
    ship: "Overland caravans; Black Sea and Caspian crossings by ship",
    years: "1330–1341",
    color: "#b45309",
    purpose: "Travel through Anatolia, the Byzantine Empire, Mongol steppes, Central Asia, and reach India.",
    summary: "Leaving Mecca in 1330, Ibn Battuta crossed Anatolia, visited Constantinople, sailed across the Black Sea into the Mongol Golden Horde steppes, traversed Central Asia through Bukhara and Samarkand, crossed the Hindu Kush, and arrived in Delhi in 1334. Sultan Muhammad ibn Tughluq appointed him as a judge and ambassador. He served in Delhi for nine years under an erratic but brilliant sultan.",
    accuracyNote: "Anatolia and Constantinople visit well-documented. Central Asia relies on dictated memory; some scholars question Constantinople timeline. Delhi service confirmed by independent historical sources.",
    path: [
      [39.83, 21.43], [36.29, 33.51], [32.49, 37.87], // Mecca → Damascus → Anatolia
      [28.98, 41.01], [34.1, 44.94], [44.5, 48.5], // Constantinople, Crimea, Golden Horde
      [64.42, 39.77], [66.98, 39.65], [69.17, 34.53], [77.21, 28.61], // Central Asia → Delhi
    ],
    waypoints: [
      { name: "Anatolia — Konya, Turkey", date: "1330–31", lat: 37.87, lng: 32.49, note: "Toured dozens of Anatolian towns; warmly welcomed at each by the Ahis guilds" },
      { name: "Constantinople (Istanbul)", date: "1332", lat: 41.01, lng: 28.98, note: "Visited the Byzantine capital as a guest; described the Hagia Sophia as 'a church of marvellous construction'", pivotal: true },
      { name: "Crimea (Kaffa/Feodosia)", date: "1332–33", lat: 44.94, lng: 34.1, note: "Crossed the Black Sea; entered the Golden Horde's Mongol empire" },
      { name: "Golden Horde (near Sarai/Volga)", date: "1332–33", lat: 48.5, lng: 44.5, note: "Met Öz Beg Khan, the most powerful Mongol ruler of the era" },
      { name: "Bukhara, Uzbekistan", date: "1333", lat: 39.77, lng: 64.42, note: "Great Islamic centre of learning; 'still bearing traces of the Mongol devastation'" },
      { name: "Samarkand, Uzbekistan", date: "1333", lat: 39.65, lng: 66.98, note: "Visited the tomb of Qutham ibn Abbas" },
      { name: "Hindu Kush / Kabul area", date: "1333", lat: 34.53, lng: 69.17, note: "Crossed through the mountains; described the intense cold" },
      { name: "Delhi, India", date: "1334–1341", lat: 28.61, lng: 77.21, note: "Appointed qadi (judge) and ambassador by Sultan Muhammad ibn Tughluq; served 8 years — the sultan was brilliant but cruel", pivotal: true },
    ],
  },
  {
    id: "battuta-4",
    label: "Stage 4 — Maldives, Sri Lanka & Southeast Asia",
    ship: "Indian Ocean dhows",
    years: "1341–1345",
    color: "#c2410c",
    purpose: "Diplomatic mission to China; detoured through Maldives, Sri Lanka, Bengal, and Sumatra after shipwreck.",
    summary: "Dispatched by the Sultan of Delhi to China, Ibn Battuta's fleet was wrecked off Calicut — he barely escaped with his life. Stranded, he detoured through the Maldives (serving as a judge for 18 months), Sri Lanka, Bengal, and Sumatra before finally departing for China in 1345.",
    accuracyNote: "Maldives stay detailed in the Rihla. Bengal and Sumatra material thinner. Sri Lanka pilgrimage to Adam's Peak confirmed.",
    path: [
      [77.21, 28.61], [75.78, 11.25], // Delhi → Calicut (shipwreck)
      [73.51, 4.17], [80.68, 6.91], // Maldives, Sri Lanka
      [75.78, 11.25], [90.4, 23.7], [91.87, 24.9], // Calicut, Bengal, Sylhet
      [95.3, 5.19], [108.2, 16.1], // Sumatra, Champa
    ],
    waypoints: [
      { name: "Malabar Coast / Calicut — shipwreck", date: "1341", lat: 11.25, lng: 75.78, note: "Ibn Battuta's fleet destroyed in a storm; diplomatic gifts lost; companions drowned; mission failed before it began", pivotal: true },
      { name: "Maldive Islands", date: "1343–44", lat: 4.17, lng: 73.51, note: "Became a judge for 18 months; reformed local laws; asked to leave after controversies" },
      { name: "Sri Lanka — Adam's Peak", date: "1344", lat: 6.91, lng: 80.68, note: "Climbed Adam's Peak (Sri Pada), sacred to Buddhists, Hindus, and Muslims" },
      { name: "Sylhet, Bengal", date: "1345", lat: 24.9, lng: 91.87, note: "Visited the Sufi saint Shah Jalal; population converting to Islam from Buddhism" },
      { name: "Sumatra (Samudera-Pasai)", date: "1345", lat: 5.19, lng: 97.15, note: "First Muslim kingdom in Southeast Asia; en route to China" },
      { name: "Champa (Vietnam coast)", date: "1345", lat: 16.1, lng: 108.2, note: "En route to China; noted the Buddhist population" },
    ],
  },
  {
    id: "battuta-5",
    label: "Stage 5 — China",
    ship: "Chinese junks",
    years: "1345–1346",
    color: "#d97706",
    purpose: "Reach the court of the Emperor of China.",
    summary: "Ibn Battuta arrived in China via Quanzhou (Zayton) — the world's greatest port. He travelled north through Guangzhou, Hangzhou ('the city of Heaven'), and reached Beijing (Khanbaliq), capital of the Yuan dynasty. He was impressed by Chinese craftsmanship but disturbed by the widespread consumption of pork and wine. Historians debate how much of the China narrative is accurate vs. compiled from other travellers' accounts.",
    accuracyNote: "China section most disputed by modern scholars; some passages appear derived from other travellers. The broad outline (Quanzhou → Hangzhou → Beijing) is accepted but Ibn Battuta's presence is not independently confirmed.",
    path: [
      [108.2, 16.1], [113.27, 23.13], // Champa → Guangzhou
      [118.6, 24.9], [120.15, 30.27], // Quanzhou, Hangzhou
      [116.39, 39.91], // Beijing
      [120.15, 30.27], [118.6, 24.9], [113.27, 23.13],
    ],
    waypoints: [
      { name: "Quanzhou (Zayton), China", date: "1345–46", lat: 24.9, lng: 118.6, note: "Called 'the greatest port in the world' by Ibn Battuta — larger than Alexandria; hundreds of junks", pivotal: true },
      { name: "Guangzhou (Canton), China", date: "1346", lat: 23.13, lng: 113.27, note: "Large Muslim quarter; mosques of earlier Arab traders" },
      { name: "Hangzhou (Khansa), China", date: "1346", lat: 30.27, lng: 120.15, note: "Described as 'the city of Heaven'; vast lakes and markets" },
      { name: "Khanbaliq (Beijing), China", date: "1346", lat: 39.91, lng: 116.39, note: "Capital of the Yuan dynasty; attended banquets with the Mongol Emperor", pivotal: true },
    ],
  },
  {
    id: "battuta-6",
    label: "Stage 6 — Return to the Islamic World",
    ship: "Chinese junks and Indian Ocean dhows",
    years: "1346–1349",
    color: "#b45309",
    purpose: "Return home to Morocco via the Indian Ocean and Middle Eastern routes.",
    summary: "Departing China in 1346, Ibn Battuta retraced his path through Sumatra, Calicut, and the Persian Gulf. He arrived at Mecca for a third Hajj in 1348 — just as the Black Death was sweeping the Islamic world. He experienced the plague firsthand in Syria and Egypt. He returned to Morocco briefly in 1349 — home for the first time in 24 years. His mother had recently died.",
    accuracyNote: "Return route follows established Indian Ocean paths. Black Death observation in Syria and Egypt confirmed historically; Ibn Battuta's account is a primary source on the epidemic.",
    path: [
      [116.39, 39.91], [118.6, 24.9], [108.2, 16.1],
      [95.3, 5.5], [75.78, 11.25], [56.47, 27.1],
      [39.83, 21.43], [36.29, 33.51], [31.25, 30.06],
      [29.92, 31.2], [10.18, 36.82], [-5.8, 35.78],
    ],
    waypoints: [
      { name: "Calicut, India (return)", date: "1347", lat: 11.25, lng: 75.78, note: "Rejoined the familiar Malabar trade route" },
      { name: "Hormuz (return)", date: "1347", lat: 27.1, lng: 56.47, note: "Heard reports of the plague spreading in the west" },
      { name: "Mecca — third Hajj", date: "1348", lat: 21.43, lng: 39.83, note: "Third pilgrimage to Mecca" },
      { name: "Damascus & Syria — Black Death", date: "1348", lat: 33.51, lng: 36.29, note: "Witnessed the Black Death in full force; 'described 2,000 deaths per day in Damascus' — one of the most vivid eyewitness accounts of the pandemic", pivotal: true },
      { name: "Tangier, Morocco — first return home", date: "1349", lat: 35.78, lng: -5.8, note: "Home after 24 years; his mother had died shortly before his arrival", pivotal: true },
    ],
  },
  {
    id: "battuta-7",
    label: "Stage 7 — Al-Andalus (Islamic Spain)",
    ship: "Overland and coastal vessels",
    years: "1349–1350",
    color: "#c2410c",
    purpose: "Visit al-Andalus and fight in a jihad against the Castilian Reconquista.",
    summary: "Barely home, Ibn Battuta set off to al-Andalus, under pressure from the Christian Reconquista. He crossed the Strait of Gibraltar, visited Ronda, and reached Granada — the last remaining Muslim emirate in Iberia. He returned to Morocco via Ceuta.",
    accuracyNote: "Andalusia itinerary brief in the Rihla; exact sequence of towns uncertain. Granada and Gibraltar confirmed stops.",
    path: [
      [-5.0, 34.05], [-5.35, 35.89], [-5.35, 36.14],
      [-5.17, 36.74], [-3.6, 37.18],
      [-5.35, 35.89], [-5.0, 34.05],
    ],
    waypoints: [
      { name: "Ceuta", date: "1350", lat: 35.89, lng: -5.35, note: "Crossed from Morocco into al-Andalus via Ceuta" },
      { name: "Gibraltar (Jabal al-Tariq)", date: "1350", lat: 36.14, lng: -5.35, note: "The famous rock fortress; still under Muslim control" },
      { name: "Ronda, Andalusia", date: "1350", lat: 36.74, lng: -5.17, note: "Frontier city; joined a military expedition against Castile" },
      { name: "Granada, Andalusia", date: "1350", lat: 37.18, lng: -3.6, note: "Visited the Nasrid emirate — the last Islamic state in Iberia; admired the Alhambra", pivotal: true },
      { name: "Fez, Morocco — return", date: "1350", lat: 34.05, lng: -5.0, note: "Returned to the Marinid capital" },
    ],
  },
  {
    id: "battuta-8",
    label: "Stage 8 — Sahara & Mali",
    ship: "Camel caravans across the Sahara",
    years: "1351–1354",
    color: "#d97706",
    purpose: "Cross the Sahara to the Mali Empire — the wealthiest kingdom in Africa and a major Muslim realm.",
    summary: "At the Sultan's request, Ibn Battuta crossed the Sahara to the Mali Empire. He traveled via the salt mines of Taghaza to the Mali capital, met Mansa Suleyman, and proceeded to Timbuktu and the Niger River. He returned to Morocco in 1354 and dictated his entire 29 years of travels to the scholar Ibn Juzayy in 1355. He never travelled again.",
    accuracyNote: "Saharan and Mali stages best-documented in the Rihla — Ibn Battuta was critical of Malian customs, suggesting genuine firsthand experience. Mansa Suleyman independently attested in Arabic chronicles.",
    path: [
      [-5.0, 34.05], [-4.2, 31.7], // Fez → Sijilmasa
      [-5.5, 23.5], [-7.27, 15.18], // Taghaza, Walata
      [-8.7, 11.4], [-3.0, 16.77], [0.04, 16.27], // Mali capital, Timbuktu, Gao
      [-5.5, 15.0], [-4.2, 31.7], [-5.0, 34.05],
    ],
    waypoints: [
      { name: "Sijilmasa, Morocco", date: "Feb 1352", lat: 31.7, lng: -4.2, note: "Departure into the Sahara; joined a large salt-trading caravan" },
      { name: "Taghaza salt mines", date: "Mar 1352", lat: 23.5, lng: -5.5, note: "Mines built entirely of rock salt (even the houses); described as 'a village with no attractions'" },
      { name: "Walata (Oualata), Mauritania", date: "1352", lat: 15.18, lng: -7.27, note: "First major sub-Saharan city; frontier of the Mali Empire" },
      { name: "Mali capital (Niani area)", date: "1352–53", lat: 11.4, lng: -8.7, note: "Met Sultan Mansa Suleyman; offended by the simple court gifts — considered them unworthy of Mali's wealth", pivotal: true },
      { name: "Timbuktu", date: "1353", lat: 16.77, lng: -3.0, note: "A prosperous trading town on the Niger; not yet the great intellectual centre it would become" },
      { name: "Gao (on the Niger River)", date: "1353", lat: 16.27, lng: 0.04, note: "Major trading city; sailed the Niger by canoe — 'a river as big as the Nile'" },
      { name: "Morocco — final return; Rihla dictated", date: "Jan 1354", lat: 34.0, lng: -5.0, note: "Returned to Fez; dictated his entire 29 years of travels to Ibn Juzayy; the Rihla completed 1355. He never travelled again.", pivotal: true },
    ],
  },
];

// ── Explorer roster ─────────────────────────────────────────────────────────

export const EXPLORERS: Explorer[] = [
  {
    slug: "james-cook",
    name: "James Cook",
    wikidataId: "Q7324",
    lifespan: "1728–1779",
    tagline: "Three Pacific voyages that charted New Zealand, eastern Australia, and Hawaii.",
    status: "full",
    period: "Early Modern · Pacific",
    voyages: COOK_VOYAGES,
  },
  {
    slug: "ferdinand-magellan",
    name: "Ferdinand Magellan",
    wikidataId: "Q1496",
    lifespan: "c. 1480–1521",
    tagline: "First expedition to circumnavigate the globe; died in the Philippines, but the voyage continued under Elcano.",
    status: "full",
    period: "Early Modern · Pacific & Atlantic",
    voyages: MAGELLAN_VOYAGES,
  },
  {
    slug: "christopher-columbus",
    name: "Christopher Columbus",
    wikidataId: "Q7322",
    lifespan: "1451–1506",
    tagline: "Four transatlantic voyages that opened sustained European contact with the Americas.",
    status: "full",
    period: "Early Modern · Atlantic",
    voyages: COLUMBUS_VOYAGES,
  },
  {
    slug: "vasco-da-gama",
    name: "Vasco da Gama",
    wikidataId: "Q7328",
    lifespan: "c. 1469–1524",
    tagline: "Opened the permanent sea route from Europe to India around Africa; changed world trade forever.",
    status: "full",
    period: "Early Modern · Indian Ocean",
    voyages: DA_GAMA_VOYAGES,
  },
  {
    slug: "zheng-he",
    name: "Zheng He",
    wikidataId: "Q7333",
    lifespan: "1371–1433",
    tagline: "Commanded seven Ming treasure-fleet voyages across the Indian Ocean, reaching Arabia and East Africa.",
    status: "full",
    period: "Medieval · Indian Ocean",
    voyages: ZHENG_HE_VOYAGES,
  },
  {
    slug: "ibn-battuta",
    name: "Ibn Battuta",
    wikidataId: "Q7331",
    lifespan: "1304–1368/69",
    tagline: "Travelled ~75,000 km across the Islamic world, East Africa, Central Asia, India, Southeast Asia, and China over 29 years.",
    status: "full",
    period: "Medieval · Global",
    voyages: IBN_BATTUTA_VOYAGES,
  },
];

export function getExplorerBySlug(slug: string): Explorer | undefined {
  return EXPLORERS.find((e) => e.slug === slug);
}
