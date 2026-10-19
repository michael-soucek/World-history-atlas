import type { Tour, TourSide, TourZone } from "@/data/tours";

/**
 * The two world wars, stage by stage: arrows for the offensives, battle
 * markers, and who held what at each stop (see TourZone in tours.ts).
 *
 * Territory is sketched with front lines drawn as [longitude, latitude]
 * points and cut to real coastlines and borders by
 * scripts/build-war-zones.mts, which writes public/data/war-zones/. Re-run it
 * after editing any zone here:
 *
 *   npx tsx scripts/build-war-zones.mts
 *
 * Front lines are simplified: they follow the main line of the fighting at
 * the date the stop names, not every salient and pocket.
 *
 * Country names must match the tour's `zoneYear` snapshot (1914 or 1938);
 * the build script stops on a name it can't find.
 */

type Pt = [number, number];

// ── Shapes for zones ──
// A front line runs from its first point to its last; these close it into an
// area by running on to the poles and round the far side of the world.

/** Everything west of a line drawn roughly north to south. */
const westOf = (line: Pt[]): Pt[] => [[line[0][0], 85], ...line, [line[line.length - 1][0], -85], [-179, -85], [-179, 85]];
/** Everything east of a line drawn roughly north to south. */
const eastOf = (line: Pt[]): Pt[] => [[line[0][0], 85], ...line, [line[line.length - 1][0], -85], [179.9, -85], [179.9, 85]];
/** Everything north of a line drawn roughly west to east. */
const northOf = (line: Pt[]): Pt[] => [...line, [line[line.length - 1][0], 85], [line[0][0], 85]];
/** Everything south of a line drawn roughly west to east. */
const southOf = (line: Pt[]): Pt[] => [...line, [line[line.length - 1][0], -85], [line[0][0], -85]];
const box = (west: number, south: number, east: number, north: number): Pt[] => [
  [west, south], [east, south], [east, north], [west, north],
];

const zone = (side: string, countries: string[], extra: Partial<TourZone> = {}): TourZone => ({ side, countries, ...extra });
const held = (side: string, area: Pt[], within: string[], extra: Partial<TourZone> = {}): TourZone => ({ side, area, within, ...extra });

// ═══════════════════════════════════════════════ The First World War

const WW1_SIDES: TourSide[] = [
  { key: "central", name: "Central Powers", color: "#2f2b28" },
  { key: "entente", name: "The Allies (Entente)", color: "#2346a0" },
];

const CENTRAL = ["German Empire", "Austro-Hungarian Empire"];
const ENTENTE_EUROPE = ["France", "United Kingdom of Great Britain and Ireland", "Russian Empire", "Finland", "Serbia", "Montenegro", "Belgium"];
/** British, French and Belgian colonies, and Japan, which joined in August 1914. */
const ENTENTE_EMPIRES = [
  "Algeria", "Tunisia", "Morocco", "French West Africa", "French Equatorial Africa", "Djibouti", "Madagascar (France)",
  "French Indochina", "Egypt", "Anglo-Egyptian Sudan", "British East Africa", "Uganda", "Nigeria", "Gold Coast",
  "Sierra Leone", "Gambia, The", "Rhodesia", "South Africa", "Botswana", "Malawi", "British Somaliland", "Lesotho",
  "Swaziland", "British Raj", "Ceylon", "Malaya", "Hong Kong", "Australia", "Belgian Congo", "Empire of Japan",
];
const ITALIAN_EMPIRE = ["Kingdom of Italy", "Libya", "Eritrea", "Italian Somaliland"];
const PORTUGUESE_EMPIRE = ["Portugal", "Angola", "Mozambique", "Portuguese Guinea"];

// Western Front
/** Mid-September 1914, after the Marne: Belgium mostly overrun, Antwerp still holding. */
const WEST_SEPT_1914: Pt[] = [
  [4.9, 51.4], [4.6, 51.05], [4.1, 50.85], [3.6, 50.4], [3.24, 50.17], [2.93, 49.93], [3.0, 49.58], [3.3, 49.4],
  [4.0, 49.3], [4.9, 49.2], [5.2, 49.3], [5.55, 49.2], [5.6, 49.07], [5.5, 48.88], [5.75, 48.85], [6.05, 48.92],
  [6.6, 48.65], [7.0, 48.2], [7.15, 47.5],
];
/** The trench line from late 1914 to early 1917, North Sea to Switzerland. */
const WEST_TRENCHES: Pt[] = [
  [2.75, 51.2], [2.85, 50.95], [2.97, 50.85], [2.88, 50.69], [2.86, 50.33], [2.75, 50.1], [2.75, 49.9], [2.85, 49.6],
  [3.0, 49.5], [3.32, 49.4], [3.8, 49.42], [3.98, 49.33], [4.6, 49.25], [4.9, 49.2], [5.2, 49.3], [5.55, 49.2],
  [5.6, 49.07], [5.5, 48.88], [5.75, 48.85], [6.05, 48.92], [6.6, 48.65], [7.0, 48.2], [7.15, 47.5],
];
/** End of 1917: behind the Hindenburg Line, and the ridge at Passchendaele lost. */
const WEST_1917: Pt[] = [
  [2.75, 51.2], [2.95, 50.95], [3.05, 50.88], [2.95, 50.75], [2.88, 50.69], [2.86, 50.33], [3.0, 50.2], [3.1, 50.05],
  [3.2, 49.85], [3.36, 49.66], [3.43, 49.45], [3.75, 49.42], [3.98, 49.33], [4.6, 49.25], [4.9, 49.2], [5.2, 49.3],
  [5.55, 49.2], [5.6, 49.07], [5.5, 48.88], [5.75, 48.85], [6.05, 48.92], [6.6, 48.65], [7.0, 48.2], [7.15, 47.5],
];
/** Mid-July 1918: the bulges of the Spring Offensive, on the Lys, the Somme and the Marne. */
const WEST_JULY_1918: Pt[] = [
  [2.75, 51.2], [2.9, 50.9], [2.78, 50.78], [2.6, 50.65], [2.68, 50.5], [2.86, 50.33], [2.65, 50.0], [2.5, 49.88],
  [2.57, 49.65], [2.85, 49.47], [3.1, 49.35], [3.4, 49.05], [3.7, 49.08], [3.95, 49.2], [3.98, 49.3], [4.1, 49.32],
  [4.6, 49.25], [4.9, 49.2], [5.2, 49.3], [5.55, 49.2], [5.6, 49.07], [5.5, 48.88], [5.75, 48.85], [6.05, 48.92],
  [6.6, 48.65], [7.0, 48.2], [7.15, 47.5],
];
/** 11 November 1918: the armistice line, from Ghent through Mons to Sedan. */
const WEST_ARMISTICE: Pt[] = [
  [3.8, 51.35], [3.8, 51.0], [3.9, 50.6], [4.0, 50.4], [4.3, 50.0], [4.9, 49.7], [5.3, 49.4], [5.9, 49.0],
  [6.6, 48.65], [7.0, 48.2], [7.15, 47.5],
];
const westFront = (line: Pt[]): TourZone => held("central", eastOf(line), ["France", "Belgium", "Luxembourg"], { occupied: true });

// Eastern Front
/** December 1914: Germany holds western Russian Poland; Russia holds eastern Galicia. */
const EAST_DEC_1914: Pt[] = [
  [20.0, 55.0], [21.3, 55.3], [22.6, 54.6], [22.8, 54.2], [22.4, 53.6], [21.0, 53.3], [20.4, 53.1], [20.2, 52.6],
  [20.0, 52.3], [20.2, 51.95], [20.0, 51.5], [20.2, 51.0], [20.4, 50.5], [20.8, 50.05], [21.15, 49.65], [21.5, 49.4],
  [22.8, 49.0], [24.0, 48.6], [25.0, 47.9], [26.2, 47.9],
];
/** September 1915, after the Great Retreat: from the Gulf of Riga to Romania. */
const EAST_SEPT_1915: Pt[] = [
  [23.5, 57.1], [23.7, 56.85], [24.3, 56.75], [25.2, 56.55], [26.4, 55.9], [26.8, 54.85], [26.4, 54.4], [26.0, 53.3],
  [26.3, 52.1], [25.6, 51.5], [25.6, 50.7], [26.0, 50.4], [25.3, 49.5], [25.6, 48.75], [26.3, 48.4], [26.6, 48.1],
];
/** Autumn 1916, after the Brusilov Offensive retook Lutsk and Bukovina. */
const EAST_1916_SOUTH: Pt[] = [
  [26.3, 52.1], [25.6, 51.5], [25.0, 51.2], [24.9, 50.8], [24.6, 50.2], [24.7, 49.5], [24.4, 48.9], [24.0, 48.4],
  [24.5, 47.9], [25.3, 47.75], [26.0, 47.7],
];
const EAST_1916: Pt[] = [...EAST_SEPT_1915.slice(0, 8), ...EAST_1916_SOUTH];
/** End of 1917: Riga and the Baltic islands taken. */
const EAST_1917: Pt[] = [[23.5, 59.0], [23.6, 58.0], [24.4, 57.3], [24.8, 57.0], [25.3, 56.6], ...EAST_1916.slice(4)];
/** Spring 1918, after Brest-Litovsk: the Baltic lands, Belarus and Ukraine under German and Austro-Hungarian occupation. */
const EAST_1918: Pt[] = [
  [28.4, 59.7], [28.4, 59.3], [28.5, 58.6], [28.6, 57.8], [29.0, 57.0], [30.0, 56.0], [30.8, 55.0], [31.0, 54.0],
  [31.6, 53.0], [32.5, 52.4], [33.5, 52.3], [35.0, 51.4], [36.5, 51.0], [38.5, 50.2], [39.8, 49.3], [40.0, 48.0],
  [39.8, 47.2], [39.4, 46.9], [38.5, 46.5], [36.6, 45.4], [36.4, 44.4],
];
const eastFront = (line: Pt[]): TourZone[] => [
  held("central", westOf(line), ["Russian Empire"], { occupied: true }),
  held("entente", eastOf(line), ["Austro-Hungarian Empire"], { occupied: true }),
];
/** January 1917: Romania's Moldavian remnant behind the Siret, the rest occupied. */
const ROMANIA_1917: Pt[] = [
  [22.0, 46.5], [26.2, 46.5], [26.4, 46.1], [27.0, 45.9], [27.6, 45.5], [28.0, 45.35], [28.8, 45.25], [29.7, 45.15],
];
const occupiedRomania = held("central", southOf(ROMANIA_1917), ["Romania"], { occupied: true });
const SALONIKA = held("entente", box(21.0, 40.0, 24.2, 41.3), ["Greece"], { occupied: true, label: "Salonika front" });
/** The Veneto beyond the Piave, held by Austria-Hungary and Germany after Caporetto. */
const PIAVE = held("central", [[11.4, 47.2], [11.4, 46.0], [11.75, 45.9], [12.2, 45.85], [12.6, 45.5], [12.9, 45.3], [14.5, 45.3], [14.5, 47.2]], ["Kingdom of Italy"], { occupied: true });
/** October 1918: the Ottoman lines north of Aleppo and in northern Iraq. */
const OTTOMAN_FRONT_1918: Pt[] = [
  [33.5, 36.3], [36.4, 36.5], [37.5, 36.45], [40.0, 36.0], [42.0, 35.6], [43.3, 35.5], [44.4, 35.6], [46.0, 35.5], [49.0, 35.5],
];

/** The two alliances at home, shared by most stops. */
const ww1Base = ({ italy = false, ottoman = false, bulgaria = false, romania = false, portugal = false } = {}): TourZone[] => [
  zone("central", [...CENTRAL, ...(ottoman ? ["Ottoman Empire"] : []), ...(bulgaria ? ["Bulgaria"] : [])]),
  zone("entente", [
    ...ENTENTE_EUROPE,
    ...ENTENTE_EMPIRES,
    ...(italy ? ITALIAN_EMPIRE : []),
    ...(romania ? ["Romania"] : []),
    ...(portugal ? PORTUGUESE_EMPIRE : []),
  ]),
];

const FIRST_WORLD_WAR: Tour = {
  slug: "first-world-war",
  title: "World War I: The Great War on the Map",
  description:
    "The First World War stage by stage, from Sarajevo to the Armistice: the Marne and the trenches, Tannenberg and the Great Retreat, Gallipoli, Verdun and the Somme, revolution in Russia and the collapse of four empires.",
  duration: 16,
  difficulty: "deep-dive",
  sides: WW1_SIDES,
  zoneYear: 1914,
  steps: [
    {
      title: "Two Armed Camps",
      date: "June–August 1914",
      text: "By 1914 Europe was split into two alliances: Germany and Austria-Hungary on one side, France, Russia and Britain on the other. On 28 June a Bosnian Serb student, Gavrilo Princip, shot the heir to the Austro-Hungarian throne, Archduke Franz Ferdinand, in Sarajevo. Austria-Hungary, backed by Germany, declared war on Serbia on 28 July. Within a week the alliances had pulled in Russia, Germany and France, and when Germany invaded neutral Belgium, Britain declared war on 4 August.",
      mapState: { year: 1914, lat: 48, lng: 16, zoom: 3.7 },
      markers: [
        { label: "Sarajevo: Franz Ferdinand shot, 28 June 1914", at: [18.41, 43.86] },
        { label: "Belgrade shelled, 29 July", at: [20.46, 44.82], kind: "battle" },
        { label: "Battle of Cer, August: Serbia's first victory", at: [19.5, 44.6], kind: "battle" },
      ],
      routes: [
        { label: "Austria-Hungary invades Serbia", kind: "conquest", path: [[18.9, 44.5], [19.3, 44.65], [19.7, 44.6]] },
        { label: "Germany invades Belgium", kind: "conquest", path: [[6.6, 50.8], [5.57, 50.63], [4.35, 50.85]] },
      ],
      zones: ww1Base(),
    },
    {
      title: "The Race for Paris: the Marne",
      date: "August–September 1914",
      text: "Germany's war plan, drawn up by Alfred von Schlieffen, was to knock France out quickly by sweeping through Belgium, then turn on Russia. The forts of Liège held the Germans up for eleven days. In the Battles of the Frontiers in August, French attacks into Lorraine failed with terrible losses, and the small British army fell back from Mons. By early September the Germans were about 40 km from Paris. Then the French and British counter-attacked on the Marne (5–12 September), and the Germans retreated to the Aisne river and dug in. The quick victory both sides expected was gone.",
      mapState: { year: 1914, lat: 49.6, lng: 4.2, zoom: 5.6 },
      markers: [
        { label: "Liège, 5–16 August", at: [5.57, 50.63], kind: "battle" },
        { label: "Mons, 23 August", at: [3.95, 50.45], kind: "battle" },
        { label: "Battles of the Frontiers, August", at: [6.6, 48.7], kind: "battle" },
        { label: "First Battle of the Marne, 5–12 September", at: [3.3, 48.95], kind: "battle" },
        { label: "Paris", at: [2.35, 48.86] },
      ],
      routes: [
        { label: "The German right wing sweeps through Belgium", kind: "conquest", path: [[6.1, 50.75], [5.57, 50.63], [4.35, 50.85], [3.95, 50.45], [3.2, 49.9], [2.8, 49.3], [3.0, 49.0]] },
        { label: "The German centre through the Ardennes", kind: "conquest", path: [[6.2, 49.9], [5.0, 49.75], [4.2, 49.35], [3.9, 49.0]] },
        { label: "French offensive into Lorraine", kind: "conquest", path: [[6.2, 48.6], [6.7, 48.8], [7.0, 48.95]] },
        { label: "German retreat to the Aisne", kind: "retreat", path: [[3.3, 48.98], [3.35, 49.25], [3.45, 49.45]] },
      ],
      zones: [westFront(WEST_SEPT_1914), ...ww1Base()],
    },
    {
      title: "Tannenberg and Galicia: the Eastern Front",
      date: "August–December 1914",
      text: "Russia mobilized faster than Germany expected and invaded East Prussia in August. At Tannenberg (26–30 August) the Germans under Hindenburg and Ludendorff surrounded one Russian army and took about 90,000 prisoners, then drove the other out at the Masurian Lakes. Further south, Russia did far better against Austria-Hungary: it took Lemberg (Lviv) in September, overran Galicia and besieged the fortress of Przemyśl. In Serbia, the Austro-Hungarian invasion was thrown back in December. In November the Ottoman Empire entered the war on Germany's side.",
      mapState: { year: 1914, lat: 51.5, lng: 22.5, zoom: 4.4 },
      markers: [
        { label: "Tannenberg, 26–30 August", at: [20.1, 53.5], kind: "battle" },
        { label: "Masurian Lakes, September", at: [21.8, 54.0], kind: "battle" },
        { label: "Lemberg taken, 3 September", at: [24.03, 49.84], kind: "battle" },
        { label: "Przemyśl besieged", at: [22.77, 49.78], kind: "battle" },
        { label: "Kolubara: Serbia drives Austria-Hungary out, December", at: [20.1, 44.3], kind: "battle" },
      ],
      routes: [
        { label: "Rennenkampf's army into East Prussia", kind: "conquest", path: [[23.4, 54.6], [22.4, 54.55], [21.6, 54.45]] },
        { label: "Samsonov's army, destroyed at Tannenberg", kind: "conquest", path: [[20.8, 52.6], [20.4, 53.1], [20.15, 53.45]] },
        { label: "Russia overruns Galicia", kind: "conquest", path: [[25.8, 50.2], [24.6, 49.9], [23.0, 49.8], [21.4, 50.0]] },
        { label: "German drive on Warsaw and Łódź", kind: "conquest", path: [[18.4, 50.9], [19.2, 51.4], [19.8, 51.9]] },
      ],
      zones: [...eastFront(EAST_DEC_1914), westFront(WEST_TRENCHES), ...ww1Base({ ottoman: true })],
    },
    {
      title: "The Trenches",
      date: "October 1914 – 1915",
      text: "After the Marne, each side tried to get round the other's northern flank, a 'race to the sea' that ended on the Belgian coast. At Ypres in October and November 1914, the British, French and Belgians stopped the last German attempt to break through. By Christmas a line of trenches ran some 700 km from the North Sea to Switzerland. Through 1915 French and British attacks gained little ground at enormous cost, and at Ypres in April 1915 the Germans used poison gas on a large scale for the first time.",
      mapState: { year: 1915, mapYear: 1914, lat: 49.9, lng: 3.8, zoom: 5.5 },
      markers: [
        { label: "Nieuport: the line reaches the sea", at: [2.75, 51.13] },
        { label: "Ypres: battles in 1914, 1915 and 1917", at: [2.88, 50.85], kind: "battle" },
        { label: "Loos, September 1915", at: [2.85, 50.46], kind: "battle" },
        { label: "Champagne, 1915", at: [4.5, 49.15], kind: "battle" },
      ],
      routes: [
        { label: "German moves north", kind: "conquest", path: [[3.7, 49.6], [3.3, 50.2], [3.15, 50.7], [3.0, 51.05]] },
        { label: "Allied moves north", kind: "conquest", path: [[2.4, 49.4], [2.5, 50.0], [2.55, 50.6], [2.65, 51.0]] },
      ],
      zones: [...eastFront(EAST_DEC_1914), westFront(WEST_TRENCHES), ...ww1Base({ ottoman: true })],
    },
    {
      title: "The Great Retreat",
      date: "May–September 1915",
      text: "In May 1915 German and Austro-Hungarian armies broke through the Russian line between Gorlice and Tarnów after a massive bombardment. The Russians, short of shells and even rifles, fell back all summer. Przemyśl and Lemberg were retaken, Warsaw fell on 5 August, and by September the Central Powers held all of Russian Poland, Lithuania and part of Latvia. Russia lost close to a million men as prisoners that year, but it did not make peace. In May, Italy joined the Allies.",
      mapState: { year: 1915, mapYear: 1914, lat: 52, lng: 24, zoom: 4.1 },
      markers: [
        { label: "Gorlice–Tarnów breakthrough, 2 May 1915", at: [21.15, 49.65], kind: "battle" },
        { label: "Lemberg retaken, June", at: [24.03, 49.84], kind: "battle" },
        { label: "Warsaw falls, 5 August", at: [21.01, 52.23] },
        { label: "Kovno fortress falls, August", at: [23.9, 54.9], kind: "battle" },
      ],
      routes: [
        { label: "The Gorlice–Tarnów breakthrough", kind: "conquest", path: [[21.1, 49.7], [22.5, 49.85], [24.0, 49.85]] },
        { label: "Through Poland", kind: "conquest", path: [[20.0, 52.3], [21.0, 52.25], [23.0, 52.4], [25.2, 52.6]] },
        { label: "Into Lithuania", kind: "conquest", path: [[22.0, 55.0], [23.9, 54.9], [25.4, 54.8]] },
        { label: "The Russian retreat", kind: "retreat", path: [[23.6, 52.3], [25.0, 52.8], [26.6, 53.3]] },
      ],
      zones: [...eastFront(EAST_SEPT_1915), westFront(WEST_TRENCHES), ...ww1Base({ ottoman: true, italy: true })],
    },
    {
      title: "Gallipoli and the Isonzo",
      date: "February 1915 – January 1916",
      text: "To knock the Ottoman Empire out of the war and open a sea route to Russia, Britain and France tried to force the Dardanelles. A naval attack failed on 18 March 1915, and on 25 April British, French, Australian and New Zealand troops landed on the Gallipoli peninsula. The Ottoman defenders, among them Mustafa Kemal, later Atatürk, kept them pinned near the beaches for eight months, and the Allies evacuated in January 1916. Italy, which joined the Allies in May 1915, attacked Austria-Hungary along the Isonzo river: eleven battles there in two years gained little.",
      mapState: { year: 1915, mapYear: 1914, lat: 42.3, lng: 20, zoom: 4.3 },
      markers: [
        { label: "The Narrows: naval attack fails, 18 March", at: [26.4, 40.13], kind: "battle" },
        { label: "Anzac Cove, 25 April 1915", at: [26.29, 40.24], kind: "battle" },
        { label: "Cape Helles", at: [26.18, 40.05], kind: "battle" },
        { label: "The Isonzo front, 1915–1917", at: [13.6, 45.9], kind: "battle" },
      ],
      routes: [
        { label: "Allied fleet from Mudros", kind: "voyage", path: [[25.25, 39.87], [25.8, 39.95], [26.15, 40.03]] },
        { label: "Landings at Anzac Cove", kind: "voyage", path: [[25.4, 40.0], [25.9, 40.2], [26.26, 40.24]] },
        { label: "Italy attacks on the Isonzo", kind: "conquest", path: [[12.9, 46.05], [13.3, 45.95], [13.6, 45.9]] },
      ],
      zones: [...eastFront(EAST_SEPT_1915), westFront(WEST_TRENCHES), ...ww1Base({ ottoman: true, italy: true })],
    },
    {
      title: "The Fall of Serbia",
      date: "October 1915 – January 1916",
      text: "In October 1915 Bulgaria joined the Central Powers, and German, Austro-Hungarian and Bulgarian armies invaded Serbia from three sides. The Serbian army, with its king and tens of thousands of civilians, retreated over the snowbound mountains of Montenegro and Albania to the Adriatic; many thousands died on the way. Allied ships carried the survivors to the Greek island of Corfu. A British and French force landed at Salonika in neutral Greece, too late to help, and stayed there behind a new front for the rest of the war.",
      mapState: { year: 1915, mapYear: 1914, lat: 42.5, lng: 21, zoom: 5.3 },
      markers: [
        { label: "Belgrade falls, 9 October 1915", at: [20.46, 44.82], kind: "battle" },
        { label: "Salonika: Allied landing, October 1915", at: [22.94, 40.64] },
        { label: "Corfu: the Serbian army evacuated, January 1916", at: [19.92, 39.62] },
      ],
      routes: [
        { label: "Austro-German attack from the north", kind: "conquest", path: [[20.4, 45.25], [20.5, 44.8], [20.9, 44.0]] },
        { label: "Bulgarian attack from the east", kind: "conquest", path: [[23.2, 43.4], [22.2, 43.3], [21.5, 43.0]] },
        { label: "The Serbian retreat to the Adriatic", kind: "retreat", path: [[20.9, 43.6], [20.3, 42.9], [19.8, 42.4], [19.5, 41.8]] },
        { label: "Evacuation to Corfu", kind: "voyage", path: [[19.4, 41.3], [19.3, 40.5], [19.85, 39.7]] },
      ],
      zones: [
        zone("central", ["Serbia", "Montenegro"], { occupied: true }),
        held("central", box(19.0, 40.75, 21.2, 42.8), ["Albania"], { occupied: true }),
        held("entente", box(19.0, 39.5, 21.2, 40.75), ["Albania"], { occupied: true }),
        SALONIKA,
        ...eastFront(EAST_SEPT_1915), westFront(WEST_TRENCHES), ...ww1Base({ ottoman: true, italy: true, bulgaria: true }),
      ],
    },
    {
      title: "Verdun and the Somme",
      date: "February–November 1916",
      text: "In February 1916 Germany attacked the French fortress city of Verdun, aiming, its commander later claimed, to 'bleed France white'. The battle lasted ten months and cost each side over 300,000 casualties for almost no change in the line. To take the pressure off Verdun, the British and French attacked on the Somme on 1 July: the British army suffered about 57,000 casualties on the first day alone, the worst in its history. By November they had advanced about 10 km. At sea, the British and German fleets met off Jutland in May, the only great clash of battleships in the war. Britain lost more ships but kept control of the North Sea.",
      mapState: { year: 1916, mapYear: 1914, lat: 51.6, lng: 4.8, zoom: 4.5 },
      markers: [
        { label: "Verdun, February–December 1916", at: [5.39, 49.16], kind: "battle" },
        { label: "The Somme, July–November 1916", at: [2.7, 50.0], kind: "battle" },
        { label: "Jutland, 31 May 1916", at: [6.0, 56.7], kind: "battle" },
      ],
      routes: [
        { label: "German attack on Verdun", kind: "conquest", path: [[5.65, 49.45], [5.5, 49.28], [5.4, 49.19]] },
        { label: "Anglo-French attack on the Somme", kind: "conquest", path: [[2.5, 49.98], [2.75, 50.0], [2.95, 50.05]] },
        { label: "The German High Seas Fleet sails", kind: "voyage", path: [[8.1, 53.6], [7.5, 55.0], [6.3, 56.5]] },
        { label: "The British Grand Fleet from Scapa Flow", kind: "voyage", path: [[-3.1, 58.9], [0.5, 58.0], [4.0, 57.2], [5.7, 56.8]] },
      ],
      zones: [
        zone("central", ["Serbia", "Montenegro"], { occupied: true }),
        held("central", box(19.0, 40.75, 21.2, 42.8), ["Albania"], { occupied: true }),
        held("entente", box(19.0, 39.5, 21.2, 40.75), ["Albania"], { occupied: true }),
        SALONIKA,
        ...eastFront(EAST_SEPT_1915), westFront(WEST_TRENCHES), ...ww1Base({ ottoman: true, italy: true, bulgaria: true, portugal: true }),
      ],
    },
    {
      title: "The Brusilov Offensive and Romania",
      date: "June 1916 – January 1917",
      text: "In June 1916 the Russian general Aleksei Brusilov attacked Austria-Hungary along a wide front, without the long bombardment that usually warned the enemy. It was one of the most successful Allied offensives of the war: the Russians retook Lutsk and Bukovina and captured hundreds of thousands of prisoners, and Germany had to rush troops to save its ally. Encouraged, Romania joined the Allies in August and invaded Transylvania. But German, Austro-Hungarian and Bulgarian forces struck back from two sides and took Bucharest on 6 December; by January 1917 they held most of Romania.",
      mapState: { year: 1916, mapYear: 1914, lat: 47.5, lng: 26, zoom: 4.7 },
      markers: [
        { label: "Lutsk retaken, June 1916", at: [25.33, 50.75], kind: "battle" },
        { label: "Czernowitz taken by the Russians, June", at: [25.94, 48.29], kind: "battle" },
        { label: "Bucharest falls, 6 December 1916", at: [26.1, 44.43], kind: "battle" },
      ],
      routes: [
        { label: "The Brusilov Offensive", kind: "conquest", path: [[26.6, 50.5], [25.6, 50.7], [24.9, 50.6]] },
        { label: "Into Bukovina", kind: "conquest", path: [[26.8, 48.6], [26.0, 48.3], [25.2, 47.9]] },
        { label: "Romania invades Transylvania", kind: "conquest", path: [[25.6, 45.5], [24.9, 45.85], [24.2, 46.1]] },
        { label: "Falkenhayn from the north", kind: "conquest", path: [[23.4, 45.6], [24.0, 44.9], [25.4, 44.5], [26.0, 44.45]] },
        { label: "Mackensen across the Danube", kind: "conquest", path: [[25.35, 43.6], [25.75, 44.0], [26.05, 44.38]] },
      ],
      zones: [
        occupiedRomania,
        zone("central", ["Serbia", "Montenegro"], { occupied: true }),
        held("central", box(19.0, 40.75, 21.2, 42.8), ["Albania"], { occupied: true }),
        held("entente", box(19.0, 39.5, 21.2, 40.75), ["Albania"], { occupied: true }),
        SALONIKA,
        ...eastFront(EAST_1916), westFront(WEST_TRENCHES),
        ...ww1Base({ ottoman: true, italy: true, bulgaria: true, portugal: true, romania: true }),
      ],
    },
    {
      title: "A World War: Africa and Asia",
      date: "1914–1918",
      text: "The war was fought far beyond Europe. Japan joined the Allies and took Germany's base at Tsingtao in China in November 1914, while Allied forces seized Germany's Pacific islands. In Africa, Togoland fell in weeks, South African forces conquered German South-West Africa in 1915, and Kamerun fell in 1916. In German East Africa, Paul von Lettow-Vorbeck led a guerrilla campaign that tied down far larger British, Indian, African, Belgian and Portuguese forces for the whole war; he surrendered only on 25 November 1918, two weeks after the armistice. Hundreds of thousands of Africans died, many of them porters carrying supplies.",
      mapState: { year: 1916, mapYear: 1914, lat: -2, lng: 22, zoom: 2.5 },
      markers: [
        { label: "Togoland falls, August 1914", at: [1.2, 8.5], kind: "battle" },
        { label: "Kamerun, 1914–1916", at: [11.5, 4.0], kind: "battle" },
        { label: "Tanga, November 1914", at: [39.1, -5.07], kind: "battle" },
        { label: "German South-West Africa, 1915", at: [17.08, -22.56], kind: "battle" },
        { label: "Lettow-Vorbeck surrenders, 25 November 1918", at: [31.4, -8.8] },
      ],
      routes: [
        { label: "South Africa invades German South-West Africa", kind: "conquest", path: [[18.5, -29.0], [17.8, -26.0], [17.1, -22.7]] },
        { label: "Lettow-Vorbeck's guerrilla campaign", kind: "raid", path: [[37.3, -3.4], [36.7, -7.8], [38.0, -11.5], [38.5, -15.0], [35.5, -13.5], [33.0, -10.5], [31.45, -8.9]] },
      ],
      zones: [
        zone("entente", ["Togoland", "Kamerun", "German South-West Africa"], { occupied: true }),
        zone("central", ["German E. Africa (Tanganyika)"]),
        ...ww1Base({ ottoman: true, italy: true, bulgaria: true, portugal: true }),
      ],
    },
    {
      title: "1917: Revolution, and America Joins",
      date: "1917",
      text: "In February 1917 Germany resumed unrestricted submarine warfare, sinking ships without warning to starve Britain. That, and a German offer of an alliance to Mexico (the Zimmermann Telegram), brought the United States into the war in April. In Russia, revolution overthrew the tsar in March, and in November the Bolsheviks seized power promising peace. In the west, a failed French offensive led to mutinies, and the British offensive at Passchendaele sank into mud. In October, German and Austro-Hungarian troops broke through at Caporetto and drove the Italians back to the Piave river. The map shows the lines at the end of 1917.",
      mapState: { year: 1917, mapYear: 1914, lat: 50, lng: 12, zoom: 3.3 },
      markers: [
        { label: "Passchendaele, July–November 1917", at: [3.02, 50.9], kind: "battle" },
        { label: "Cambrai: the first mass tank attack, November", at: [3.24, 50.17], kind: "battle" },
        { label: "Caporetto, October 1917", at: [13.56, 46.25], kind: "battle" },
        { label: "Riga falls, September 1917", at: [24.1, 56.95], kind: "battle" },
        { label: "Petrograd: revolutions of March and November 1917", at: [30.31, 59.94] },
      ],
      routes: [
        { label: "U-boats round Scotland into the Atlantic", kind: "raid", path: [[8.2, 53.8], [4.0, 56.5], [-1.0, 59.5], [-8.0, 57.0], [-11.0, 52.0]] },
        { label: "American troops cross to France", kind: "voyage", path: [[-24.0, 45.0], [-12.0, 47.0], [-4.7, 48.3]] },
        { label: "The breakthrough at Caporetto", kind: "conquest", path: [[13.6, 46.25], [13.1, 46.05], [12.5, 45.85]] },
      ],
      zones: [
        PIAVE,
        occupiedRomania,
        zone("central", ["Serbia", "Montenegro"], { occupied: true }),
        held("central", box(19.0, 40.75, 21.2, 42.8), ["Albania"], { occupied: true }),
        held("entente", box(19.0, 39.5, 21.2, 40.75), ["Albania"], { occupied: true }),
        zone("entente", ["Greece"]),
        ...eastFront(EAST_1917), westFront(WEST_1917),
        ...ww1Base({ ottoman: true, italy: true, bulgaria: true, portugal: true, romania: true }),
      ],
    },
    {
      title: "Brest-Litovsk: Russia Leaves the War",
      date: "March–May 1918",
      text: "Lenin's Bolshevik government asked for peace. When it balked at Germany's terms, German troops simply advanced, almost unopposed. By the Treaty of Brest-Litovsk, signed on 3 March 1918, Russia gave up Poland, the Baltic lands, Finland and Ukraine, with about a third of its population. German and Austro-Hungarian troops occupied Ukraine for its grain. Romania, now alone, made peace in May. Germany's new eastern empire was vast, but it kept around a million German soldiers in the east who were badly needed in France. Russia, out of the war, is left unshaded here.",
      mapState: { year: 1918, mapYear: 1914, lat: 51, lng: 31, zoom: 3.6 },
      markers: [
        { label: "Brest-Litovsk: treaty signed, 3 March 1918", at: [23.7, 52.1] },
        { label: "Kyiv occupied, March 1918", at: [30.52, 50.45] },
        { label: "Moscow: the Soviet capital from March 1918", at: [37.62, 55.75] },
      ],
      routes: [
        { label: "The German advance, February 1918", kind: "conquest", path: [[26.5, 56.0], [27.5, 57.3], [28.3, 57.75]] },
        { label: "Into Belarus", kind: "conquest", path: [[25.5, 53.2], [27.5, 53.9], [30.3, 53.9]] },
        { label: "Into Ukraine", kind: "conquest", path: [[25.4, 50.6], [28.4, 50.4], [30.4, 50.45], [34.0, 49.8], [36.2, 50.0]] },
        { label: "To the Crimea", kind: "conquest", path: [[30.7, 46.5], [33.0, 46.6], [34.1, 45.0]] },
      ],
      zones: [
        PIAVE,
        occupiedRomania,
        zone("central", ["Serbia", "Montenegro"], { occupied: true }),
        held("central", box(19.0, 40.75, 21.2, 42.8), ["Albania"], { occupied: true }),
        held("entente", box(19.0, 39.5, 21.2, 40.75), ["Albania"], { occupied: true }),
        zone("entente", ["Greece"]),
        held("central", westOf(EAST_1918), ["Russian Empire"], { occupied: true, label: "Occupied by the Central Powers" }),
        westFront(WEST_1917),
        zone("central", [...CENTRAL, "Ottoman Empire", "Bulgaria"]),
        zone("entente", ["France", "United Kingdom of Great Britain and Ireland", "Belgium", ...ENTENTE_EMPIRES, ...ITALIAN_EMPIRE, ...PORTUGUESE_EMPIRE]),
      ],
    },
    {
      title: "The Spring Offensive",
      date: "March–July 1918",
      text: "With Russia out, Germany moved dozens of divisions west and gambled on winning before the Americans arrived in strength. On 21 March 1918, Operation Michael smashed into the British line on the Somme, with short, intense bombardments and fast-moving 'stormtroopers'. More offensives followed in Flanders, on the Aisne and in Champagne, and by June the Germans were back on the Marne, less than 100 km from Paris, which they shelled with long-range guns. But they gained ground, not victory, and lost hundreds of thousands of their best soldiers. In July the French and Americans stopped the last attack in the Second Battle of the Marne.",
      mapState: { year: 1918, mapYear: 1914, lat: 49.8, lng: 3.4, zoom: 5.7 },
      markers: [
        { label: "Operation Michael, 21 March 1918", at: [3.29, 49.85], kind: "battle" },
        { label: "The Lys, April 1918", at: [2.75, 50.65], kind: "battle" },
        { label: "Château-Thierry and Belleau Wood, June", at: [3.4, 49.05], kind: "battle" },
        { label: "Second Battle of the Marne, July", at: [3.95, 49.12], kind: "battle" },
        { label: "Paris: shelled by long-range guns", at: [2.35, 48.86] },
      ],
      routes: [
        { label: "Operation Michael", kind: "conquest", path: [[3.3, 49.85], [2.95, 49.85], [2.6, 49.85]] },
        { label: "The Lys offensive", kind: "conquest", path: [[3.05, 50.62], [2.85, 50.64], [2.68, 50.64]] },
        { label: "From the Aisne to the Marne", kind: "conquest", path: [[3.55, 49.45], [3.48, 49.25], [3.42, 49.08]] },
      ],
      zones: [
        PIAVE,
        occupiedRomania,
        zone("central", ["Serbia", "Montenegro"], { occupied: true }),
        held("central", box(19.0, 40.75, 21.2, 42.8), ["Albania"], { occupied: true }),
        held("entente", box(19.0, 39.5, 21.2, 40.75), ["Albania"], { occupied: true }),
        zone("entente", ["Greece"]),
        held("central", westOf(EAST_1918), ["Russian Empire"], { occupied: true }),
        westFront(WEST_JULY_1918),
        zone("central", [...CENTRAL, "Ottoman Empire", "Bulgaria"]),
        zone("entente", ["France", "United Kingdom of Great Britain and Ireland", "Belgium", ...ENTENTE_EMPIRES, ...ITALIAN_EMPIRE, ...PORTUGUESE_EMPIRE]),
      ],
    },
    {
      title: "The Middle East",
      date: "1915–1918",
      text: "Against the Ottoman Empire the war ranged across the Middle East. A British and Indian army advancing up the Tigris was besieged and forced to surrender at Kut in April 1916, but Baghdad fell in March 1917. In June 1916 the Sharif of Mecca, Hussein, launched the Arab Revolt with British backing; Arab forces took Aqaba in 1917. From Egypt, General Allenby broke through at Gaza and took Jerusalem in December 1917, and at Megiddo in September 1918 he routed the Ottoman armies; Damascus fell on 1 October. In 1915 the Ottoman government began the Armenian Genocide, in which around a million Armenians or more were killed. The Ottomans signed an armistice on 30 October 1918; the map shows the lines then.",
      mapState: { year: 1917, mapYear: 1914, lat: 31, lng: 40, zoom: 3.9 },
      markers: [
        { label: "Sarıkamış, winter 1914–15", at: [42.57, 40.33], kind: "battle" },
        { label: "Kut: British surrender, April 1916", at: [45.82, 32.5], kind: "battle" },
        { label: "Baghdad taken, March 1917", at: [44.4, 33.3], kind: "battle" },
        { label: "Aqaba, July 1917", at: [35.0, 29.53], kind: "battle" },
        { label: "Gaza, 1917", at: [34.47, 31.5], kind: "battle" },
        { label: "Jerusalem taken, December 1917", at: [35.22, 31.78] },
        { label: "Megiddo, September 1918", at: [35.18, 32.58], kind: "battle" },
      ],
      routes: [
        { label: "Up the Tigris to Baghdad", kind: "conquest", path: [[47.8, 30.5], [46.8, 31.0], [45.8, 32.5], [44.45, 33.25]] },
        { label: "The Arab Revolt", kind: "conquest", path: [[39.8, 21.5], [38.2, 24.0], [36.5, 26.2], [35.05, 29.5], [36.0, 31.5], [36.25, 33.4]] },
        { label: "Allenby from Egypt", kind: "conquest", path: [[32.3, 30.6], [33.8, 31.1], [34.5, 31.5], [35.2, 31.8], [35.3, 32.6], [36.2, 33.45]] },
      ],
      zones: [
        // Yemen's Ottoman garrison held out until 1919.
        held("central", box(42.5, 12.5, 46.0, 17.5), ["Ottoman Empire"]),
        held("entente", southOf(OTTOMAN_FRONT_1918), ["Ottoman Empire"], { occupied: true }),
        zone("central", [...CENTRAL, "Ottoman Empire", "Bulgaria"]),
        zone("entente", ["France", "United Kingdom of Great Britain and Ireland", "Belgium", "Greece", ...ENTENTE_EMPIRES, ...ITALIAN_EMPIRE]),
      ],
    },
    {
      title: "The Hundred Days and the Armistice",
      date: "August–November 1918",
      text: "On 8 August 1918, at Amiens, British, Australian, Canadian and French troops, with hundreds of tanks, broke the German line; Ludendorff called it 'the black day of the German army'. In the Hundred Days that followed, the Allies, now with American armies fighting in strength, pushed the Germans back across France and broke the Hindenburg Line. Germany's allies collapsed one by one: Bulgaria after a breakthrough on the Salonika front in September, the Ottoman Empire in October, and Austria-Hungary after the Italian victory at Vittorio Veneto in early November. With mutiny in its navy and revolution at home, Germany's Kaiser abdicated, and the armistice took effect at 11 a.m. on 11 November 1918.",
      mapState: { year: 1918, mapYear: 1914, lat: 47.5, lng: 12.5, zoom: 3.9 },
      markers: [
        { label: "Amiens, 8 August 1918", at: [2.6, 49.85], kind: "battle" },
        { label: "Meuse–Argonne, September–November", at: [5.0, 49.3], kind: "battle" },
        { label: "Dobro Pole: the Salonika front breaks, September", at: [21.9, 41.15], kind: "battle" },
        { label: "Vittorio Veneto, October–November", at: [12.3, 45.99], kind: "battle" },
        { label: "Compiègne: the armistice signed, 11 November", at: [2.9, 49.43] },
      ],
      routes: [
        { label: "The Allied advance", kind: "conquest", path: [[2.5, 49.85], [3.2, 50.0], [3.6, 50.3], [3.95, 50.43]] },
        { label: "Meuse–Argonne", kind: "conquest", path: [[5.0, 49.1], [5.0, 49.45], [4.95, 49.68]] },
        { label: "Up from Salonika to Belgrade", kind: "conquest", path: [[21.9, 41.1], [21.6, 41.8], [21.9, 43.3], [20.5, 44.78]] },
        { label: "Vittorio Veneto", kind: "conquest", path: [[12.2, 45.75], [12.3, 46.0], [12.8, 46.3]] },
      ],
      zones: [
        held("central", westOf(EAST_1918), ["Russian Empire"], { occupied: true }),
        westFront(WEST_ARMISTICE),
        zone("central", [...CENTRAL, "Ottoman Empire", "Bulgaria"]),
        zone("entente", [
          "France", "United Kingdom of Great Britain and Ireland", "Belgium", "Greece", "Serbia", "Montenegro", "Romania", "Albania",
          ...ENTENTE_EMPIRES, ...ITALIAN_EMPIRE, ...PORTUGUESE_EMPIRE,
        ]),
      ],
    },
    {
      title: "A New Map of Europe",
      date: "1919–1920",
      text: "The peace treaties signed in Paris in 1919 and 1920 redrew Europe. Four empires were gone: the German, Austro-Hungarian, Russian and Ottoman. Poland was reborn, and new states appeared: Czechoslovakia, Yugoslavia, Finland, Estonia, Latvia and Lithuania, along with a small Austria and Hungary. By the Treaty of Versailles, Germany lost land and all its colonies, was limited to a small army, and had to accept blame for the war and pay reparations, terms that many Germans bitterly resented. About nine million soldiers and millions of civilians had died, and a flu pandemic was killing tens of millions more around the world.",
      mapState: { year: 1920, lat: 50, lng: 20, zoom: 3.7 },
      highlight: ["Poland", "Czechoslovakia", "Yugoslavia", "Austria", "Hungary", "Finland", "Estonia", "Latvia", "Lithuania"],
      markers: [{ label: "Versailles: treaty signed, 28 June 1919", at: [2.12, 48.8] }],
    },
  ],
};

// ═══════════════════════════════════════════════ The Second World War in Europe

const WW2_SIDES: TourSide[] = [
  { key: "axis", name: "Germany, Italy and their allies", color: "#2f2b28" },
  { key: "vichy", name: "Vichy France (collaborating)", color: "#8f7a52" },
  { key: "allies", name: "Britain and the Western Allies", color: "#2346a0" },
  { key: "soviet", name: "Soviet Union", color: "#b3312b" },
];

/** Bohemia and Moravia, occupied in March 1939; the rest of Czechoslovakia became Slovakia (and a strip went to Hungary). */
const BOHEMIA = held("axis", westOf([[18.85, 49.55], [18.3, 49.3], [17.6, 48.85], [17.0, 48.6]]), ["Czechoslovakia"], { occupied: true });
const SLOVAKIA = held("axis", box(16.5, 47.5, 22.2, 50.0), ["Czechoslovakia"]);
/** The German–Soviet line through Poland, 28 September 1939. */
const MOLOTOV_RIBBENTROP: Pt[] = [
  [23.5, 54.3], [22.7, 53.9], [22.0, 53.45], [21.85, 53.1], [22.3, 52.75], [22.66, 52.4], [23.6, 52.1], [23.6, 51.8],
  [24.0, 51.1], [24.1, 50.6], [23.5, 50.4], [22.8, 50.25], [22.8, 49.8], [22.6, 49.4], [22.7, 49.0],
];
const POLAND_1939 = [
  held("axis", westOf(MOLOTOV_RIBBENTROP), ["Poland"], { occupied: true, label: "German-occupied Poland" }),
  zone("soviet", ["Poland"], { occupied: true }),
];
/** Karelia, ceded by Finland in March 1940. */
const KARELIA = held("soviet", [[27.6, 60.4], [28.5, 61.0], [29.7, 61.6], [30.9, 62.1], [31.6, 62.9], [33, 62.9], [33, 60], [27.6, 60]], ["Finland"], { occupied: true });
/** Bessarabia and northern Bukovina, taken from Romania in June 1940. */
const BESSARABIA = held("soviet", eastOf([[25.2, 48.4], [26.2, 47.95], [27.2, 47.6], [28.1, 46.8], [28.2, 45.45]]), ["Romania"], { occupied: true });
const BALTICS = ["Estonia", "Latvia", "Lithuania"];
/** The armistice line of June 1940: Germany takes the north and the Atlantic coast. */
const OCCUPIED_FRANCE = held("axis", [
  [6.05, 46.15], [5.5, 47.1], [4.85, 46.8], [3.33, 46.57], [2.07, 47.22], [1.0, 47.13], [0.15, 45.65], [-0.5, 43.9],
  [-1.24, 43.16], [-6, 43], [-6, 52], [9, 52], [8.2, 47.6],
], ["France"], { occupied: true, label: "Occupied France" });
const VICHY = [zone("vichy", ["France"], { label: "Vichy France" }), zone("vichy", ["Algeria (France)", "Morocco (France)", "Tunisia", "Syria (France)"])];
const WEST_OCCUPIED_1940 = zone("axis", ["Denmark", "Norway", "Netherlands", "Belgium", "Luxembourg"], { occupied: true });
const ITALIAN_EAST_AFRICA = ["Eritrea (Italy)", "Ethiopia (Italy)", "Italian Somaliland"];
const BRITISH_MIDEAST = ["Egypt", "Israel", "Jordan"];
/** Iran, occupied by Britain and the Soviet Union in August 1941. */
const IRAN_1941 = [
  held("soviet", box(44.0, 35.6, 62.0, 40.0), ["Iran"], { occupied: true }),
  zone("allies", ["Iran"], { occupied: true }),
];
/** Leningrad: under siege from September 1941, a land corridor from January 1943. */
const LENINGRAD_1941: Pt[] = [[29.0, 59.8], [29.0, 60.3], [31.2, 60.3], [31.2, 59.95], [30.6, 59.75], [30.0, 59.7]];
const LENINGRAD_1943: Pt[] = [[29.0, 59.75], [29.0, 60.25], [32.6, 60.25], [32.6, 59.9], [31.2, 59.88], [30.9, 59.75], [30.0, 59.7]];
const SEVASTOPOL = box(33.4, 44.4, 33.9, 44.75);

/** Early December 1941, the furthest German advance: Leningrad cut off, Tikhvin taken, the outskirts of Moscow. */
const FRONT_DEC_1941: Pt[] = [
  [31.2, 69.6], [30.6, 67.0], [32.0, 65.9], [32.6, 63.8], [34.4, 63.1], [34.6, 62.8], [35.6, 61.2], [33.6, 60.75],
  [33.0, 60.3], [33.7, 59.65], [32.5, 59.2], [31.5, 58.6], [31.4, 58.2], [32.0, 57.9], [33.0, 57.4], [34.3, 56.95],
  [35.95, 56.95], [36.9, 56.4], [37.45, 56.25], [37.35, 55.98], [37.0, 55.7], [36.8, 55.4], [36.9, 54.9], [37.2, 54.45],
  [37.45, 54.25], [37.6, 54.05], [38.3, 54.45], [38.9, 54.2], [38.6, 53.6], [38.5, 52.6], [37.6, 51.6], [37.0, 50.9],
  [37.3, 50.4], [37.6, 49.2], [38.3, 48.4], [38.9, 47.6], [38.95, 47.2], [38.4, 46.7], [36.55, 45.35], [36.3, 44.3],
];
/** Autumn 1942, the high tide: the Don, Stalingrad and the Caucasus. */
const FRONT_NOV_1942: Pt[] = [
  [31.2, 69.6], [30.6, 67.0], [32.0, 65.9], [32.6, 63.8], [34.4, 63.1], [34.6, 62.8], [35.6, 61.2], [33.6, 60.75],
  [32.9, 60.45], [32.2, 60.0], [31.9, 59.3], [31.4, 58.6], [31.6, 58.0], [32.8, 57.75], [32.6, 57.3], [31.7, 57.1],
  [31.2, 56.6], [31.0, 56.1], [31.6, 55.7], [32.9, 55.85], [34.6, 56.3], [35.0, 55.55], [35.25, 54.75], [34.6, 54.3],
  [35.0, 53.9], [36.0, 53.45], [36.6, 53.25], [37.0, 52.9], [37.6, 52.4], [39.1, 51.7], [40.0, 50.2], [41.0, 49.6],
  [42.7, 49.6], [43.1, 49.3], [44.4, 49.0], [44.6, 48.72], [44.4, 48.5], [44.0, 48.0], [44.3, 46.3], [44.2, 45.2],
  [44.65, 43.75], [43.6, 43.45], [42.4, 43.35], [40.5, 43.9], [39.4, 44.3], [38.0, 44.65], [37.6, 44.2],
];
/** Spring 1943, after Stalingrad: the Kursk bulge, the Orel and Kuban salients. */
const FRONT_SPRING_1943: Pt[] = [
  [31.2, 69.6], [30.6, 67.0], [32.0, 65.9], [32.6, 63.8], [34.4, 63.1], [34.6, 62.8], [35.6, 61.2], [33.6, 60.75],
  [32.9, 60.45], [32.3, 59.85], [31.9, 59.3], [31.4, 58.6], [31.35, 58.0], [31.0, 57.4], [30.4, 56.8], [30.3, 56.2],
  [30.8, 55.8], [31.4, 55.5], [32.4, 55.3], [33.4, 55.0], [34.1, 54.4], [35.0, 53.9], [35.8, 53.4], [36.6, 53.3],
  [37.2, 52.8], [36.4, 52.35], [35.6, 52.4], [34.6, 52.15], [34.7, 51.5], [35.3, 51.0], [36.0, 50.9], [36.6, 50.7],
  [36.8, 50.3], [37.3, 49.7], [37.7, 49.2], [38.2, 48.9], [38.9, 48.3], [39.0, 47.3], [38.9, 47.1], [38.4, 46.6],
  [37.9, 45.9], [38.05, 45.3], [38.0, 44.95], [37.8, 44.7], [37.6, 44.4],
];
/** December 1943: across the Dnieper, Kyiv freed, the Crimea cut off. */
const FRONT_DEC_1943: Pt[] = [
  [31.2, 69.6], [30.6, 67.0], [32.0, 65.9], [32.6, 63.8], [34.4, 63.1], [34.6, 62.8], [35.6, 61.2], [33.6, 60.75],
  [32.9, 60.45], [32.3, 59.85], [31.9, 59.3], [31.4, 58.6], [31.2, 58.0], [30.6, 57.2], [30.0, 56.6], [29.6, 56.1],
  [30.1, 55.5], [30.8, 55.0], [31.0, 54.4], [30.9, 53.8], [30.5, 53.1], [30.0, 52.3], [29.6, 51.6], [29.3, 50.9],
  [28.8, 50.25], [29.9, 49.8], [30.8, 49.55], [31.6, 49.3], [32.6, 48.6], [33.5, 48.2], [34.4, 47.6], [33.6, 47.0],
  [33.0, 46.7], [32.2, 46.2],
];
const CRIMEA_1943 = held("axis", [[32.4, 46.25], [33.8, 46.25], [34.5, 45.95], [35.5, 45.6], [36.7, 45.6], [36.7, 44.3], [32.4, 44.3]], ["USSR"], { occupied: true });
/** Late August 1944, after Bagration: Narva, the Gulf of Riga, the Vistula; Romania has changed sides. */
const FRONT_AUG_1944: Pt[] = [
  [28.2, 59.45], [27.8, 59.0], [27.7, 57.8], [27.0, 57.4], [26.0, 57.0], [25.3, 56.6], [24.0, 56.4], [23.1, 56.1],
  [22.5, 55.4], [22.8, 54.6], [22.3, 53.9], [22.0, 53.4], [21.6, 52.7], [21.15, 52.3], [21.5, 51.75], [21.2, 51.3],
  [21.4, 50.75], [21.8, 50.4], [22.0, 49.9], [22.5, 49.3], [22.7, 49.0],
];
/** Mid-December 1944, from Memel to the Adriatic: the Vistula, besieged Budapest, the Syrmian front. */
const FRONT_DEC_1944: Pt[] = [
  [21.05, 55.8], [21.4, 55.5], [22.4, 55.0], [22.5, 54.4], [21.9, 53.6], [21.6, 52.8], [21.1, 52.3], [21.5, 51.75],
  [21.2, 51.3], [21.4, 50.75], [21.6, 50.3], [21.7, 49.4], [22.0, 48.9], [21.2, 48.4], [20.0, 47.9], [19.3, 47.65],
  [18.8, 47.3], [17.8, 46.9], [17.3, 46.0], [18.5, 45.5], [19.3, 45.1], [19.4, 44.3], [19.8, 43.5], [19.4, 42.5], [19.3, 41.9],
];
/** Early February 1945, after the Vistula–Oder Offensive: on the Oder, Budapest taken. */
const FRONT_FEB_1945: Pt[] = [
  [19.4, 54.6], [19.4, 54.2], [18.8, 53.6], [17.5, 53.2], [16.0, 53.0], [14.65, 52.6], [14.6, 52.0], [15.2, 51.4],
  [16.0, 51.0], [17.5, 50.4], [18.5, 49.9], [19.0, 49.3], [20.0, 48.7], [18.6, 48.2], [18.4, 47.6], [17.8, 47.0],
  [17.3, 46.6], [17.4, 46.0], [18.8, 45.2], [19.3, 45.1], [19.4, 44.3], [19.8, 43.5], [19.0, 42.6], [18.9, 42.3],
];
const COURLAND = held("axis", [[20.9, 56.2], [20.9, 57.9], [22.7, 57.8], [23.2, 57.0], [22.6, 56.45], [21.5, 56.2]], ["Latvia"], { occupied: true, label: "Courland pocket" });
/** Where the Western Allies and the Red Army met, May 1945: the Elbe, the Mulde, Pilsen, the Enns. */
const MEETING_LINE_1945: Pt[] = [
  [11.0, 54.4], [11.45, 53.9], [11.3, 53.4], [11.8, 53.0], [11.7, 52.6], [11.8, 52.1], [12.2, 51.85], [12.7, 51.5],
  [12.8, 51.2], [12.9, 50.8], [13.0, 50.4], [13.6, 49.9], [14.3, 49.2], [14.45, 48.95], [14.5, 48.25], [14.45, 47.6],
  [15.0, 47.2], [15.4, 46.7], [15.6, 46.4],
];
/** Western Front, late August 1944: the Seine, Paris, up the Rhône. */
const WEST_AUG_1944: Pt[] = [[0.1, 49.5], [1.1, 49.4], [2.6, 48.95], [4.1, 48.3], [4.8, 47.3], [5.4, 46.2], [6.2, 45.4], [7.0, 44.2]];
/** Western Front, mid-December 1944: the Maas, Aachen, Metz, Strasbourg, the Colmar pocket. */
const WEST_DEC_1944: Pt[] = [
  [3.9, 51.75], [5.0, 51.75], [5.9, 51.85], [6.1, 51.6], [6.0, 51.1], [6.2, 50.8], [6.35, 50.6], [6.15, 50.3],
  [6.4, 49.9], [6.6, 49.5], [6.9, 49.2], [7.5, 49.0], [7.8, 48.6], [7.2, 48.3], [7.15, 47.9], [7.45, 47.7], [7.55, 47.55],
];
/** Italy: the Gustav Line (winter 1943–44), the Arno (August 1944), the Gothic Line (winter 1944–45). */
const GUSTAV_LINE: Pt[] = [[7.5, 41.4], [12.0, 41.3], [13.75, 41.22], [13.82, 41.5], [14.1, 41.9], [14.4, 42.35], [15.5, 42.4]];
const ARNO_LINE: Pt[] = [[6.0, 43.4], [9.6, 43.9], [10.3, 43.75], [11.25, 43.85], [12.5, 43.7], [13.6, 43.6], [14.5, 43.4]];
const GOTHIC_LINE: Pt[] = [[6.0, 43.4], [9.6, 43.95], [10.2, 44.0], [11.3, 44.25], [12.3, 44.35], [12.5, 44.5], [13.5, 44.5]];

const AXIS_HOME = ["Germany", "Italy"];
const AXIS_ALLIES = ["Hungary", "Romania", "Bulgaria", "Finland"];
/** Germany and Italy's conquests in 1941, held until 1944. */
const OCCUPIED_1941 = ["Poland", "Denmark", "Norway", "Netherlands", "Belgium", "Luxembourg", "Yugoslavia", "Greece", "Albania", ...BALTICS];

/** Autumn 1942, the Axis at its largest (shared by the Holocaust and Case Blue stops). */
const AXIS_PEAK_1942: TourZone[] = [
  held("axis", westOf(FRONT_NOV_1942), ["USSR", ...BALTICS], { occupied: true, minus: [LENINGRAD_1941], label: "Occupied Soviet Union" }),
  held("axis", box(24.5, 29.0, 28.95, 32.0), ["Egypt"], { occupied: true }),
  OCCUPIED_FRANCE, BOHEMIA, SLOVAKIA,
  zone("axis", OCCUPIED_1941, { occupied: true }),
  zone("axis", [...AXIS_HOME, ...AXIS_ALLIES, "Libya"]),
  zone("vichy", ["France"], { label: "Vichy France" }), zone("vichy", ["Algeria (France)", "Morocco (France)", "Tunisia"]),
  ...IRAN_1941,
  zone("allies", [...ITALIAN_EAST_AFRICA, "British Somaliland"], { occupied: true }),
  zone("allies", ["United Kingdom", "Syria (France)", "Mesopotamia (GB)", ...BRITISH_MIDEAST]),
  zone("soviet", ["USSR"]),
];
/** Spring 1943, after Stalingrad and Torch (shared by the El Alamein and Atlantic stops). */
const SPRING_1943: TourZone[] = [
  held("axis", westOf(FRONT_SPRING_1943), ["USSR", ...BALTICS], { occupied: true, minus: [LENINGRAD_1943], label: "Occupied Soviet Union" }),
  zone("axis", ["France"], { occupied: true, label: "Occupied France" }),
  zone("axis", ["Tunisia"], { occupied: true }),
  BOHEMIA, SLOVAKIA,
  zone("axis", OCCUPIED_1941, { occupied: true }),
  zone("axis", [...AXIS_HOME, ...AXIS_ALLIES]),
  ...IRAN_1941,
  zone("allies", ["Libya", ...ITALIAN_EAST_AFRICA, "British Somaliland"], { occupied: true }),
  zone("allies", ["United Kingdom", "Algeria (France)", "Morocco (France)", "Syria (France)", "Mesopotamia (GB)", ...BRITISH_MIDEAST]),
  zone("soviet", ["USSR"]),
];

const SECOND_WORLD_WAR_EUROPE: Tour = {
  slug: "second-world-war-europe",
  title: "World War II in Europe and North Africa",
  description:
    "The Second World War in Europe stage by stage, with the front lines on the map: Poland, the fall of France, Barbarossa, Stalingrad, El Alamein, Kursk, D-Day and Bagration, the Bulge and the fall of Berlin.",
  duration: 18,
  difficulty: "deep-dive",
  sides: WW2_SIDES,
  zoneYear: 1938,
  steps: [
    {
      title: "Hitler's Expansion",
      date: "March 1938 – April 1939",
      text: "Adolf Hitler, in power in Germany since 1933, set out to overturn the peace settlement of 1919. In March 1938 German troops marched into Austria, which was annexed in the Anschluss. At Munich in September, Britain and France agreed to let Germany take the Sudetenland, the German-speaking border regions of Czechoslovakia. In March 1939 Hitler broke that deal and occupied Prague; Slovakia became a German client state. In April Fascist Italy invaded Albania. Britain and France now promised to defend Poland.",
      mapState: { year: 1938, lat: 48.5, lng: 15, zoom: 4.6 },
      markers: [
        { label: "Vienna: the Anschluss, March 1938", at: [16.37, 48.21] },
        { label: "Munich Agreement, September 1938", at: [11.58, 48.14] },
        { label: "Prague occupied, 15 March 1939", at: [14.42, 50.08] },
      ],
      routes: [
        { label: "Into Austria, March 1938", kind: "conquest", path: [[12.6, 48.0], [14.0, 48.25], [16.3, 48.2]] },
        { label: "Into Prague, March 1939", kind: "conquest", path: [[12.6, 50.4], [13.6, 50.3], [14.4, 50.1]] },
        { label: "Italy invades Albania, April 1939", kind: "voyage", path: [[16.87, 41.12], [18.3, 41.3], [19.45, 41.32]] },
      ],
      zones: [
        BOHEMIA, { ...SLOVAKIA, label: "Slovakia" },
        zone("axis", ["Albania"], { occupied: true }),
        zone("axis", AXIS_HOME),
        zone("allies", ["United Kingdom", "France"]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Invasion of Poland",
      date: "September 1939",
      text: "On 1 September 1939 Germany invaded Poland from the west, north and south. Britain and France declared war on 3 September but could send no real help. The Polish army fought its largest battle on the Bzura river, west of Warsaw. On 17 September the Soviet Union, secretly allied with Germany by the Molotov–Ribbentrop Pact, invaded from the east. Warsaw surrendered on 28 September, and the two dictatorships divided Poland between them along the line shown here.",
      mapState: { year: 1939, mapYear: 1938, lat: 52, lng: 20, zoom: 4.7 },
      markers: [
        { label: "Westerplatte, 1 September", at: [18.67, 54.41], kind: "battle" },
        { label: "Battle of the Bzura, 9–19 September", at: [20.0, 52.2], kind: "battle" },
        { label: "Warsaw surrenders, 28 September", at: [21.01, 52.23], kind: "battle" },
      ],
      routes: [
        { label: "From Pomerania", kind: "conquest", path: [[16.0, 53.3], [18.0, 52.9], [19.6, 52.4], [20.9, 52.25]] },
        { label: "From East Prussia", kind: "conquest", path: [[20.5, 54.0], [20.9, 53.0], [21.05, 52.35]] },
        { label: "From Silesia and Slovakia", kind: "conquest", path: [[18.0, 50.4], [19.9, 50.1], [21.6, 50.4], [23.0, 50.6]] },
        { label: "The Soviet invasion, 17 September", kind: "conquest", path: [[28.5, 52.5], [26.0, 52.6], [24.0, 52.4]] },
      ],
      zones: [
        BOHEMIA, SLOVAKIA, zone("axis", ["Albania"], { occupied: true }), ...POLAND_1939,
        zone("axis", AXIS_HOME),
        zone("allies", ["United Kingdom", "France", "Algeria (France)", "Morocco (France)", "Tunisia", "Syria (France)"]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Winter War, Denmark and Norway",
      date: "November 1939 – June 1940",
      text: "In November 1939 the Soviet Union attacked Finland. The Finns held out through the bitter Winter War and kept their independence, but in March 1940 they had to give up Karelia. In the west, months of 'Phoney War' passed with little fighting. Then, on 9 April 1940, Germany struck north: Denmark surrendered within hours, and German troops landed along the Norwegian coast to secure the iron ore shipped from Narvik. British, French and Polish troops took Narvik back in May but were withdrawn in June as France collapsed, and Norway surrendered.",
      mapState: { year: 1940, mapYear: 1938, lat: 61, lng: 18, zoom: 3.6 },
      markers: [
        { label: "The Winter War on the Karelian Isthmus", at: [29.3, 60.6], kind: "battle" },
        { label: "Oslo taken, 9 April 1940", at: [10.75, 59.91] },
        { label: "Narvik, April–June 1940", at: [17.43, 68.44], kind: "battle" },
      ],
      routes: [
        { label: "The Soviet attack on Finland, November 1939", kind: "conquest", path: [[30.4, 59.95], [29.9, 60.35], [29.0, 60.7]] },
        { label: "Germany invades Denmark", kind: "conquest", path: [[9.5, 54.8], [9.35, 55.6], [9.9, 56.5]] },
        { label: "German landings up the Norwegian coast", kind: "voyage", path: [[8.0, 54.5], [6.5, 57.0], [4.8, 60.0], [5.5, 63.0], [11.0, 66.0], [14.5, 68.0], [17.2, 68.43]] },
        { label: "To Oslo", kind: "voyage", path: [[10.3, 54.6], [10.8, 57.5], [10.7, 59.8]] },
      ],
      zones: [
        KARELIA, BOHEMIA, SLOVAKIA, zone("axis", ["Albania", "Denmark", "Norway"], { occupied: true }), ...POLAND_1939,
        zone("axis", AXIS_HOME),
        zone("allies", ["United Kingdom", "France", "Algeria (France)", "Morocco (France)", "Tunisia", "Syria (France)"]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Fall of France",
      date: "May–June 1940",
      text: "On 10 May 1940 Germany attacked the Netherlands, Belgium and France. Its tanks pushed through the Ardennes forest, which the French thought impassable, crossed the Meuse at Sedan and raced to the Channel, trapping the Allied armies in Belgium. Over 330,000 British and French soldiers were evacuated from Dunkirk. On 10 June Italy declared war on France and Britain. France signed an armistice on 22 June: Germany occupied the north and the Atlantic coast, and a collaborating French government based at Vichy ran the south and France's empire.",
      mapState: { year: 1940, mapYear: 1938, lat: 48.5, lng: 3.5, zoom: 4.7 },
      markers: [
        { label: "Rotterdam bombed, 14 May", at: [4.48, 51.92], kind: "battle" },
        { label: "Sedan: the breakthrough, 13 May", at: [4.94, 49.7], kind: "battle" },
        { label: "Dunkirk evacuation, 26 May – 4 June", at: [2.37, 51.03], kind: "battle" },
        { label: "Paris occupied, 14 June", at: [2.35, 48.86] },
        { label: "Vichy", at: [3.43, 46.13] },
      ],
      routes: [
        { label: "Through the Ardennes to the Channel", kind: "conquest", path: [[6.5, 50.3], [5.5, 49.9], [4.9, 49.7], [3.0, 50.0], [1.65, 50.4]] },
        { label: "Into the Netherlands and Belgium", kind: "conquest", path: [[7.0, 52.0], [5.5, 51.8], [4.5, 51.2], [3.0, 51.0]] },
        { label: "South past Paris", kind: "conquest", path: [[3.5, 49.6], [2.8, 49.2], [2.35, 48.86], [1.2, 47.4], [0.3, 46.6]] },
        { label: "Evacuation from Dunkirk", kind: "retreat", path: [[2.37, 51.06], [1.85, 51.15], [1.35, 51.12]] },
      ],
      zones: [
        KARELIA, OCCUPIED_FRANCE, BOHEMIA, SLOVAKIA, WEST_OCCUPIED_1940, zone("axis", ["Albania"], { occupied: true }), ...POLAND_1939,
        zone("axis", AXIS_HOME), ...VICHY,
        zone("allies", ["United Kingdom"]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Battle of Britain",
      date: "July 1940 – May 1941",
      text: "Britain, led since May by Winston Churchill, fought on alone. To invade, Germany first had to control the skies. From July to October 1940 the Luftwaffe fought the Royal Air Force over southern England; radar, and pilots from Britain, Poland, Czechoslovakia, the Commonwealth and elsewhere, helped the RAF hold on, and the invasion was called off. Germany turned to bombing British cities at night, the Blitz, which killed over 40,000 civilians by May 1941. Meanwhile, in June 1940 the Soviet Union occupied and annexed Estonia, Latvia and Lithuania, and took Bessarabia from Romania.",
      mapState: { year: 1940, mapYear: 1938, lat: 52.5, lng: 2, zoom: 4.9 },
      markers: [
        { label: "London: the Blitz, September 1940 – May 1941", at: [-0.13, 51.51], kind: "battle" },
        { label: "Coventry, 14 November 1940", at: [-1.51, 52.41], kind: "battle" },
        { label: "Liverpool, the most bombed city outside London", at: [-2.98, 53.41], kind: "battle" },
      ],
      routes: [
        { label: "German air raids from northern France", kind: "raid", path: [[3.0, 50.3], [1.5, 50.9], [0.3, 51.3], [-0.1, 51.48]] },
        { label: "Night raids on the Midlands", kind: "raid", path: [[1.8, 49.4], [0.0, 50.6], [-1.0, 51.7], [-1.48, 52.38]] },
        { label: "Raids from Norway", kind: "raid", path: [[5.6, 58.9], [1.0, 57.0], [-1.6, 55.0]] },
      ],
      zones: [
        KARELIA, BESSARABIA, OCCUPIED_FRANCE, BOHEMIA, SLOVAKIA, WEST_OCCUPIED_1940, zone("axis", ["Albania"], { occupied: true }), ...POLAND_1939,
        zone("soviet", BALTICS, { occupied: true }),
        zone("axis", AXIS_HOME), ...VICHY,
        zone("allies", ["United Kingdom"]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Desert and Greece",
      date: "September 1940 – March 1941",
      text: "Mussolini wanted his own empire around the Mediterranean. In September 1940 Italian troops in Libya advanced a short way into Egypt, where Britain guarded the Suez Canal, and in October Italy invaded Greece from Albania, only to be driven back. In December the British struck back in the desert: in two months Operation Compass advanced some 800 km and took around 130,000 Italian prisoners. Germany came to its ally's rescue, and in February 1941 General Erwin Rommel landed in Tripoli with the first units of the Afrika Korps. Hungary, Romania and Slovakia had joined the Axis in November 1940; Bulgaria followed in March 1941.",
      mapState: { year: 1940, mapYear: 1938, lat: 36, lng: 21, zoom: 4.2 },
      markers: [
        { label: "Taranto: British air raid on the Italian fleet, November 1940", at: [17.23, 40.47], kind: "battle" },
        { label: "Sidi Barrani, December 1940", at: [25.9, 31.6], kind: "battle" },
        { label: "Beda Fomm, February 1941", at: [20.3, 31.45], kind: "battle" },
        { label: "Rommel lands at Tripoli, February 1941", at: [13.18, 32.89] },
      ],
      routes: [
        { label: "Italy invades Egypt", kind: "conquest", path: [[24.9, 31.75], [25.4, 31.65], [25.85, 31.6]] },
        { label: "Operation Compass", kind: "conquest", path: [[25.9, 31.6], [25.1, 31.75], [23.95, 32.08], [22.6, 32.75], [21.0, 32.4], [20.35, 31.5]] },
        { label: "Italy invades Greece", kind: "conquest", path: [[20.0, 40.45], [20.5, 40.05], [20.8, 39.7]] },
        { label: "The Greek counter-attack into Albania", kind: "conquest", path: [[21.1, 39.9], [20.6, 40.3], [20.2, 40.65]] },
      ],
      zones: [
        KARELIA, BESSARABIA,
        held("allies", box(19.2, 29.0, 25.5, 33.5), ["Libya"], { occupied: true }),
        OCCUPIED_FRANCE, BOHEMIA, SLOVAKIA, WEST_OCCUPIED_1940, zone("axis", ["Albania"], { occupied: true }), ...POLAND_1939,
        zone("soviet", BALTICS, { occupied: true }),
        zone("axis", [...AXIS_HOME, "Hungary", "Romania", "Bulgaria", "Libya", ...ITALIAN_EAST_AFRICA]),
        zone("axis", ["British Somaliland"], { occupied: true }),
        ...VICHY,
        zone("allies", ["United Kingdom", "Greece", ...BRITISH_MIDEAST]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Balkans and Crete",
      date: "April–May 1941",
      text: "To secure his southern flank before attacking the Soviet Union, Hitler invaded Yugoslavia and Greece on 6 April 1941. Yugoslavia collapsed in eleven days and was carved up; a fascist Ustaše regime ruled a puppet Croatia. British and Commonwealth troops sent to help Greece were driven out. In May German paratroopers took Crete, at such cost that Germany never again tried a large airborne invasion. In North Africa Rommel pushed the British back to the Egyptian border, but Australian and British troops held out in besieged Tobruk. In East Africa, meanwhile, British and Commonwealth forces conquered Italy's empire.",
      mapState: { year: 1941, mapYear: 1938, lat: 38, lng: 22, zoom: 4.6 },
      markers: [
        { label: "Belgrade bombed, 6 April 1941", at: [20.46, 44.82], kind: "battle" },
        { label: "Athens taken, 27 April", at: [23.73, 37.98] },
        { label: "Crete: the airborne invasion, May 1941", at: [23.82, 35.5], kind: "battle" },
        { label: "Siege of Tobruk, April–November 1941", at: [23.96, 32.08], kind: "battle" },
      ],
      routes: [
        { label: "Into Yugoslavia from Austria and Hungary", kind: "conquest", path: [[15.5, 47.0], [16.0, 46.0], [17.5, 45.3], [20.3, 44.85]] },
        { label: "Into Yugoslavia and Greece from Bulgaria", kind: "conquest", path: [[23.2, 42.2], [22.5, 41.5], [22.9, 40.65], [22.4, 39.6], [23.7, 38.0]] },
        { label: "Airborne assault on Crete", kind: "raid", path: [[23.7, 37.9], [23.8, 36.7], [23.82, 35.55]] },
        { label: "Rommel's first offensive", kind: "conquest", path: [[19.5, 30.6], [20.1, 32.1], [22.6, 32.7], [24.0, 31.8], [25.1, 31.6]] },
      ],
      zones: [
        KARELIA, BESSARABIA,
        held("axis", box(19.0, 28.0, 25.2, 33.5), ["Libya"], { minus: [box(23.6, 31.8, 24.3, 32.2)] }),
        OCCUPIED_FRANCE, BOHEMIA, SLOVAKIA, WEST_OCCUPIED_1940,
        zone("axis", ["Albania", "Yugoslavia", "Greece"], { occupied: true }), ...POLAND_1939,
        zone("soviet", BALTICS, { occupied: true }),
        zone("axis", [...AXIS_HOME, "Hungary", "Romania", "Bulgaria"]),
        ...VICHY,
        zone("allies", [...ITALIAN_EAST_AFRICA, "British Somaliland"], { occupied: true }),
        zone("allies", ["United Kingdom", "Libya", ...BRITISH_MIDEAST]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "Operation Barbarossa",
      date: "June–December 1941",
      text: "On 22 June 1941 Germany and its allies invaded the Soviet Union, with some three million German soldiers in three great army groups aimed at Leningrad, Moscow and Kyiv. Vast encirclements at Białystok–Minsk, Smolensk and Kyiv captured millions of Soviet troops, and Finland joined the attack in the north. By September Leningrad was cut off. In August British and Soviet troops occupied Iran to open a supply route. But the Soviet state did not collapse. In early December, with German troops in sight of Moscow, the Red Army counter-attacked in the snow and threw them back. The map shows the furthest German advance.",
      mapState: { year: 1941, mapYear: 1938, lat: 54, lng: 31, zoom: 3.7 },
      markers: [
        { label: "Białystok–Minsk pocket, June–July", at: [27.56, 53.9], kind: "battle" },
        { label: "Smolensk, July–September", at: [32.04, 54.78], kind: "battle" },
        { label: "Kyiv encircled, September", at: [30.52, 50.45], kind: "battle" },
        { label: "Leningrad: the 872-day siege", at: [30.31, 59.94], kind: "battle" },
        { label: "Moscow: the counter-attack, 5 December", at: [37.62, 55.75], kind: "battle" },
      ],
      routes: [
        { label: "Army Group North to Leningrad", kind: "conquest", path: [[21.0, 54.7], [24.0, 56.5], [27.5, 57.8], [30.0, 59.6]] },
        { label: "Army Group Centre to Moscow", kind: "conquest", path: [[22.5, 52.5], [27.5, 53.9], [32.0, 54.8], [35.0, 55.4], [36.9, 55.65]] },
        { label: "Army Group South to Kyiv and Rostov", kind: "conquest", path: [[23.5, 50.5], [26.0, 50.5], [30.0, 50.2], [34.0, 48.5], [38.9, 47.3]] },
        { label: "Finland attacks", kind: "conquest", path: [[30.0, 61.7], [32.0, 61.7], [33.6, 61.0]] },
      ],
      zones: [
        held("axis", westOf(FRONT_DEC_1941), ["USSR", ...BALTICS], { occupied: true, minus: [LENINGRAD_1941, SEVASTOPOL], label: "Occupied Soviet Union" }),
        OCCUPIED_FRANCE, BOHEMIA, SLOVAKIA,
        zone("axis", OCCUPIED_1941, { occupied: true }),
        zone("axis", ["Libya"], { minus: [box(23.6, 31.8, 24.3, 32.2)] }),
        zone("axis", [...AXIS_HOME, ...AXIS_ALLIES]),
        zone("vichy", ["France"], { label: "Vichy France" }), zone("vichy", ["Algeria (France)", "Morocco (France)", "Tunisia"]),
        ...IRAN_1941,
        zone("allies", [...ITALIAN_EAST_AFRICA, "British Somaliland"], { occupied: true }),
        zone("allies", ["United Kingdom", "Syria (France)", "Mesopotamia (GB)", ...BRITISH_MIDEAST]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Holocaust",
      date: "1941–1945",
      text: "Behind the front, Nazi Germany carried out the Holocaust, the systematic murder of Europe's Jews. From the invasion of the Soviet Union, mobile killing units shot hundreds of thousands of Jews in the occupied east; at Babyn Yar, outside Kyiv, more than 33,000 were murdered in two days in September 1941. From 1942 Jews from across Europe were deported by train to death camps in occupied Poland, among them Auschwitz-Birkenau, Treblinka, Sobibor and Bełżec. About six million Jews were murdered, along with millions of others, including Roma, disabled people, Soviet prisoners of war and Poles. The map shows German-ruled Europe at its largest, in late 1942.",
      mapState: { year: 1942, mapYear: 1938, lat: 50, lng: 17, zoom: 4.0 },
      markers: [
        { label: "Auschwitz-Birkenau", at: [19.2, 50.03] },
        { label: "Treblinka", at: [22.05, 52.63] },
        { label: "Sobibor", at: [23.6, 51.45] },
        { label: "Bełżec", at: [23.46, 50.37] },
        { label: "Babyn Yar, Kyiv, September 1941", at: [30.45, 50.47] },
      ],
      routes: [
        { label: "Deportations from western Europe", kind: "forced", path: [[2.35, 48.86], [7.0, 50.0], [12.0, 50.5], [17.0, 50.2], [19.2, 50.03]] },
        { label: "Deportations from Hungary, 1944", kind: "forced", path: [[19.04, 47.5], [20.5, 48.5], [19.8, 49.6], [19.2, 50.03]] },
        { label: "Deportations from Thessaloniki, 1943", kind: "forced", path: [[22.94, 40.64], [21.5, 42.5], [20.5, 45.5], [19.6, 48.5], [19.2, 50.0]] },
        { label: "From the Warsaw Ghetto to Treblinka", kind: "forced", path: [[21.01, 52.23], [21.5, 52.45], [22.05, 52.63]] },
      ],
      zones: AXIS_PEAK_1942,
    },
    {
      title: "Case Blue: the Drive to the Volga and the Nile",
      date: "June–October 1942",
      text: "In the summer of 1942 Germany struck again, this time in the south, towards the oilfields of the Caucasus and the city of Stalingrad on the Volga. German mountain troops raised their flag on Mount Elbrus in August, and the Sixth Army reached the Volga at Stalingrad, where the fighting went on street by street. In North Africa Rommel took Tobruk in June and drove into Egypt, until he was stopped at El Alamein, about 100 km from Alexandria. This was the high tide of the Axis: the map shows its furthest extent, in the autumn of 1942.",
      mapState: { year: 1942, mapYear: 1938, lat: 43, lng: 33, zoom: 3.3 },
      markers: [
        { label: "Sevastopol falls, July 1942", at: [33.52, 44.6], kind: "battle" },
        { label: "Stalingrad: street fighting from September", at: [44.5, 48.7], kind: "battle" },
        { label: "German flag on Mount Elbrus, 21 August", at: [42.44, 43.35] },
        { label: "Tobruk falls, 21 June 1942", at: [23.96, 32.08], kind: "battle" },
        { label: "First Battle of El Alamein, July 1942", at: [28.95, 30.83], kind: "battle" },
      ],
      routes: [
        { label: "Army Group B to Stalingrad", kind: "conquest", path: [[36.6, 50.6], [39.2, 49.6], [42.0, 48.9], [44.3, 48.75]] },
        { label: "Army Group A to the Caucasus", kind: "conquest", path: [[39.7, 47.2], [40.5, 45.6], [42.0, 44.6], [44.0, 43.95]] },
        { label: "Rommel's advance into Egypt", kind: "conquest", path: [[23.96, 32.08], [25.15, 31.6], [27.2, 31.35], [28.9, 30.85]] },
      ],
      zones: AXIS_PEAK_1942,
    },
    {
      title: "Stalingrad and El Alamein: the Tide Turns",
      date: "October 1942 – May 1943",
      text: "At El Alamein in October and November 1942, Montgomery's Eighth Army broke Rommel's line and chased him back across Libya. On 8 November American and British troops landed in Morocco and Algeria, in Operation Torch, and Germany answered by occupying the rest of France. On 19 November the Red Army launched Operation Uranus and encircled the German Sixth Army in Stalingrad; it surrendered on 2 February 1943, and about 91,000 men went into captivity. Squeezed from both sides, the last Axis forces in Africa surrendered in Tunisia in May 1943, with some 250,000 prisoners.",
      mapState: { year: 1943, mapYear: 1938, lat: 41, lng: 25, zoom: 3.0 },
      markers: [
        { label: "Second Battle of El Alamein, October–November 1942", at: [28.95, 30.83], kind: "battle" },
        { label: "Stalingrad: the Sixth Army surrenders, 2 February 1943", at: [44.5, 48.7], kind: "battle" },
        { label: "Kasserine Pass, February 1943", at: [8.8, 35.25], kind: "battle" },
        { label: "Tunis: the Axis surrenders in Africa, May 1943", at: [10.18, 36.8], kind: "battle" },
      ],
      routes: [
        { label: "Operation Uranus, 19 November 1942", kind: "conquest", path: [[42.7, 49.65], [43.3, 49.1], [43.7, 48.75]] },
        { label: "The southern pincer, 20 November", kind: "conquest", path: [[44.6, 47.85], [44.1, 48.25], [43.75, 48.65]] },
        { label: "The Eighth Army's pursuit", kind: "conquest", path: [[28.95, 30.83], [25.1, 31.7], [20.1, 32.1], [15.6, 31.3], [13.2, 32.85], [10.4, 33.7]] },
        { label: "Operation Torch: Casablanca", kind: "voyage", path: [[-11.0, 35.0], [-9.0, 34.0], [-7.65, 33.6]] },
        { label: "Torch: Oran and Algiers", kind: "voyage", path: [[-5.3, 36.0], [-2.0, 36.2], [0.2, 36.4], [2.0, 36.9], [3.05, 36.78]] },
        { label: "The race for Tunis", kind: "conquest", path: [[3.1, 36.75], [6.6, 36.4], [9.6, 36.75]] },
      ],
      zones: SPRING_1943,
    },
    {
      title: "The Battle of the Atlantic",
      date: "1939 – May 1943",
      text: "Britain depended on ships for food, fuel and weapons. German U-boats hunted the convoys crossing from North America, often in 'wolf packs' that attacked together at night, and from 1941 Allied convoys also carried supplies round Norway to the Soviet port of Murmansk. In 1942 U-boats sank more than six million tons of Allied shipping. Then the balance turned: long-range aircraft closed the mid-Atlantic 'air gap', escorts grew stronger, and codebreakers at Bletchley Park read German naval signals. In 'Black May' 1943 the U-boats lost so heavily that they were withdrawn from the North Atlantic.",
      mapState: { year: 1943, mapYear: 1938, lat: 52, lng: -25, zoom: 2.4 },
      markers: [
        { label: "Halifax: convoys assembled here", at: [-63.57, 44.65] },
        { label: "The mid-Atlantic 'air gap'", at: [-35.0, 54.0] },
        { label: "Liverpool: Western Approaches Command", at: [-2.98, 53.41] },
        { label: "Lorient: U-boat base", at: [-3.37, 47.75] },
        { label: "Murmansk", at: [33.08, 68.97] },
      ],
      routes: [
        { label: "Convoys from Halifax to Liverpool", kind: "voyage", path: [[-63.5, 44.6], [-55.0, 47.0], [-40.0, 54.0], [-25.0, 57.0], [-10.0, 56.0], [-5.0, 54.5], [-3.2, 53.5]] },
        { label: "Arctic convoys to Murmansk", kind: "voyage", path: [[-21.9, 64.3], [-12.0, 68.0], [5.0, 72.5], [20.0, 73.5], [33.0, 70.5], [33.1, 69.1]] },
        { label: "U-boats sail from French ports", kind: "raid", path: [[-3.4, 47.6], [-10.0, 47.0], [-25.0, 50.0], [-35.0, 54.0]] },
        { label: "U-boats off the American coast, 1942", kind: "raid", path: [[-10.0, 45.0], [-40.0, 40.0], [-65.0, 36.0], [-74.5, 35.3]] },
      ],
      zones: SPRING_1943,
    },
    {
      title: "Kursk, Sicily and Italy",
      date: "July – December 1943",
      text: "In July 1943 Germany launched its last great offensive in the east, against the Soviet bulge around Kursk. In one of the largest tank battles in history, around Prokhorovka, it was stopped within a week, and the Red Army went over to an offensive that hardly paused: it freed Kharkiv in August, Smolensk in September and Kyiv in November. On 10 July the Western Allies landed in Sicily. Mussolini was overthrown, and on 8 September Italy surrendered; German troops seized the north and centre, and the Allies fought their way up from the south until they were held at the Gustav Line, south of Rome.",
      mapState: { year: 1943, mapYear: 1938, lat: 46.5, lng: 23, zoom: 3.4 },
      markers: [
        { label: "Kursk and Prokhorovka, July 1943", at: [36.47, 51.04], kind: "battle" },
        { label: "Kyiv freed, 6 November 1943", at: [30.52, 50.45] },
        { label: "Sicily landings, 10 July 1943", at: [14.25, 37.07], kind: "battle" },
        { label: "Salerno landings, September", at: [14.77, 40.68], kind: "battle" },
        { label: "The Gustav Line at Monte Cassino", at: [13.81, 41.49], kind: "battle" },
      ],
      routes: [
        { label: "German attack from the north", kind: "conquest", path: [[36.1, 52.75], [36.25, 52.4], [36.3, 52.15]] },
        { label: "German attack from the south", kind: "conquest", path: [[36.6, 50.55], [36.55, 50.85], [36.45, 51.05]] },
        { label: "The Soviet advance to the Dnieper", kind: "conquest", path: [[37.5, 50.6], [35.0, 50.1], [32.5, 49.7], [30.8, 50.3]] },
        { label: "To Smolensk", kind: "conquest", path: [[35.0, 54.4], [33.6, 54.65], [32.2, 54.8]] },
        { label: "Landings in Sicily", kind: "voyage", path: [[11.0, 35.6], [13.0, 36.4], [14.2, 36.95]] },
        { label: "Up the Italian peninsula", kind: "conquest", path: [[15.65, 38.25], [16.2, 39.4], [15.0, 40.6], [14.25, 40.85], [13.9, 41.3]] },
      ],
      zones: [
        held("axis", westOf(FRONT_DEC_1943), ["USSR", ...BALTICS], { occupied: true, minus: [LENINGRAD_1943], label: "Occupied Soviet Union" }),
        CRIMEA_1943,
        held("allies", southOf(GUSTAV_LINE), ["Italy"], { occupied: true }),
        zone("axis", ["Italy"], { occupied: true, label: "German-occupied Italy" }),
        zone("axis", ["France"], { occupied: true }),
        BOHEMIA, SLOVAKIA,
        zone("axis", OCCUPIED_1941, { occupied: true }),
        zone("axis", ["Germany", ...AXIS_ALLIES]),
        ...IRAN_1941,
        zone("allies", ["Libya", "Tunisia", ...ITALIAN_EAST_AFRICA, "British Somaliland"], { occupied: true }),
        zone("allies", ["United Kingdom", "Algeria (France)", "Morocco (France)", "Syria (France)", "Mesopotamia (GB)", ...BRITISH_MIDEAST]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "D-Day and Operation Bagration",
      date: "June – August 1944",
      text: "Rome fell to the Allies on 4 June 1944. Two days later, on D-Day, the largest seaborne invasion in history landed on five beaches in Normandy: American, British and Canadian troops, with Free French, Polish and others. After weeks of hard fighting in the hedgerows they broke out in late July; a second landing in Provence on 15 August swept up the Rhône, and Paris was liberated on 25 August. In the east, on 22 June, the Red Army launched Operation Bagration and destroyed Germany's Army Group Centre in Belarus, advancing about 500 km to the Vistula. In Warsaw the Polish Home Army rose against the Germans on 1 August. On 23 August Romania changed sides.",
      mapState: { year: 1944, mapYear: 1938, lat: 50, lng: 12, zoom: 3.5 },
      markers: [
        { label: "Normandy beaches, 6 June 1944", at: [-0.8, 49.35], kind: "battle" },
        { label: "Falaise pocket, August", at: [-0.2, 48.9], kind: "battle" },
        { label: "Paris liberated, 25 August", at: [2.35, 48.86] },
        { label: "Rome liberated, 4 June", at: [12.5, 41.9] },
        { label: "Minsk liberated, 3 July", at: [27.56, 53.9], kind: "battle" },
        { label: "Warsaw Uprising, August–October", at: [21.01, 52.23], kind: "battle" },
      ],
      routes: [
        { label: "D-Day", kind: "voyage", path: [[-1.1, 50.75], [-0.9, 50.0], [-0.8, 49.42]] },
        { label: "Breakout and the advance to the Seine", kind: "conquest", path: [[-1.1, 49.1], [-0.4, 48.7], [1.0, 48.8], [2.3, 48.9]] },
        { label: "Operation Dragoon, 15 August", kind: "voyage", path: [[6.5, 42.0], [6.6, 42.8], [6.7, 43.3]] },
        { label: "Up the Rhône", kind: "conquest", path: [[6.6, 43.45], [5.4, 44.0], [4.85, 45.7]] },
        { label: "Operation Bagration", kind: "conquest", path: [[31.0, 54.5], [29.5, 54.0], [27.5, 53.9], [24.0, 53.0], [21.4, 52.3]] },
        { label: "Into Romania", kind: "conquest", path: [[28.8, 47.0], [27.6, 46.0], [26.15, 44.5]] },
      ],
      zones: [
        held("axis", westOf(FRONT_AUG_1944), ["USSR", "Poland", ...BALTICS], { occupied: true }),
        held("axis", eastOf(WEST_AUG_1944), ["France"], { occupied: true }),
        held("axis", northOf(ARNO_LINE), ["Italy"], { occupied: true }),
        zone("allies", ["Italy"], { occupied: true }),
        zone("soviet", ["Romania"], { occupied: true }),
        BOHEMIA, SLOVAKIA,
        zone("axis", ["Denmark", "Norway", "Netherlands", "Belgium", "Luxembourg", "Yugoslavia", "Greece", "Albania"], { occupied: true }),
        zone("axis", ["Germany", "Hungary", "Bulgaria", "Finland"]),
        zone("soviet", ["Poland", ...BALTICS], { occupied: true }),
        ...IRAN_1941,
        zone("allies", ["Libya", "Tunisia", ...ITALIAN_EAST_AFRICA, "British Somaliland"], { occupied: true }),
        zone("allies", ["United Kingdom", "France", "Algeria (France)", "Morocco (France)", "Syria (France)", "Mesopotamia (GB)", ...BRITISH_MIDEAST]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "Autumn 1944: Liberation in the West and the Balkans",
      date: "September – December 1944",
      text: "Allied armies swept through France and Belgium; Brussels was freed on 3 September. In mid-September Operation Market Garden tried to leap the Rhine with airborne troops but failed at Arnhem, and in October the Americans took Aachen, the first German city to fall. In the east the Warsaw Uprising was crushed in October while the Red Army stood on the Vistula. Instead the Soviets drove into the Balkans: Bulgaria changed sides in September, Belgrade was freed by Yugoslav Partisans and Soviet troops on 20 October, the Germans left Greece, and by the end of December Budapest was surrounded. Finland made peace with the Soviet Union in September.",
      mapState: { year: 1944, mapYear: 1938, lat: 48.5, lng: 14, zoom: 3.7 },
      markers: [
        { label: "Brussels freed, 3 September", at: [4.35, 50.85] },
        { label: "Arnhem: Market Garden fails, September", at: [5.9, 51.98], kind: "battle" },
        { label: "Aachen falls, 21 October", at: [6.08, 50.78], kind: "battle" },
        { label: "Belgrade freed, 20 October", at: [20.46, 44.82], kind: "battle" },
        { label: "Siege of Budapest, from 26 December", at: [19.04, 47.5], kind: "battle" },
      ],
      routes: [
        { label: "The liberation of Belgium", kind: "conquest", path: [[2.35, 48.9], [3.2, 50.0], [4.3, 50.8], [4.4, 51.2]] },
        { label: "Market Garden, 17–25 September", kind: "raid", path: [[5.3, 51.2], [5.45, 51.45], [5.85, 51.8], [5.9, 51.95]] },
        { label: "The Red Army into Yugoslavia", kind: "conquest", path: [[22.6, 44.6], [21.5, 44.75], [20.5, 44.8]] },
        { label: "The Red Army into Hungary", kind: "conquest", path: [[22.2, 46.4], [21.2, 47.1], [19.6, 47.4]] },
      ],
      zones: [
        COURLAND,
        held("axis", westOf(FRONT_DEC_1944), ["Germany", "Hungary"]),
        held("axis", westOf(FRONT_DEC_1944), ["Poland", "Czechoslovakia", "Yugoslavia", "Lithuania"], { occupied: true }),
        held("axis", eastOf(WEST_DEC_1944), ["Netherlands", "France", "Belgium", "Luxembourg"], { occupied: true }),
        held("axis", northOf(GOTHIC_LINE), ["Italy"], { occupied: true }),
        zone("allies", ["Italy"], { occupied: true }),
        zone("axis", ["Denmark", "Norway"], { occupied: true }),
        zone("soviet", ["Germany", "Poland", "Czechoslovakia", "Hungary", "Romania", "Bulgaria", ...BALTICS], { occupied: true }),
        zone("allies", ["Yugoslavia", "Greece", "Albania"]),
        ...IRAN_1941,
        zone("allies", ["Libya", "Tunisia", ...ITALIAN_EAST_AFRICA, "British Somaliland"], { occupied: true }),
        zone("allies", ["United Kingdom", "France", "Belgium", "Luxembourg", "Netherlands", "Algeria (France)", "Morocco (France)", "Syria (France)", "Mesopotamia (GB)", ...BRITISH_MIDEAST]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Bulge and the Vistula–Oder Offensive",
      date: "December 1944 – February 1945",
      text: "On 16 December 1944 Hitler gambled on a surprise offensive through the snowbound Ardennes, aiming for Antwerp. It drove a deep 'bulge' into the American lines, but the defenders held on at crossroads towns such as Bastogne, and by late January the Germans were back where they had started, having spent reserves they could not replace. On 12 January 1945 the Red Army attacked from the Vistula and in three weeks reached the Oder, about 80 km from Berlin. On 27 January Soviet soldiers entered Auschwitz. Budapest fell on 13 February after a seven-week siege.",
      mapState: { year: 1945, mapYear: 1938, lat: 51, lng: 13, zoom: 4.0 },
      markers: [
        { label: "Bastogne, besieged December 1944", at: [5.72, 50.0], kind: "battle" },
        { label: "Auschwitz liberated, 27 January 1945", at: [19.2, 50.03] },
        { label: "Fortress Breslau, besieged February–May", at: [17.03, 51.11], kind: "battle" },
        { label: "Budapest falls, 13 February", at: [19.04, 47.5], kind: "battle" },
      ],
      routes: [
        { label: "The German Ardennes offensive", kind: "conquest", path: [[6.4, 50.4], [5.9, 50.3], [5.4, 50.25], [5.05, 50.25]] },
        { label: "From the Vistula to the Oder", kind: "conquest", path: [[21.5, 51.7], [19.5, 52.0], [17.0, 52.4], [14.75, 52.6]] },
        { label: "Into Silesia", kind: "conquest", path: [[21.4, 50.6], [19.9, 50.15], [18.0, 50.4], [17.1, 51.0]] },
      ],
      zones: [
        COURLAND,
        held("axis", westOf(FRONT_FEB_1945), ["Germany", "Hungary"]),
        held("axis", westOf(FRONT_FEB_1945), ["Poland", "Czechoslovakia", "Yugoslavia"], { occupied: true }),
        held("axis", box(19.5, 54.3, 21.3, 55.1), ["Germany"], { label: "East Prussia" }),
        held("axis", box(16.8, 50.95, 17.3, 51.25), ["Germany", "Poland"]),
        held("axis", eastOf(WEST_DEC_1944), ["Netherlands", "France", "Belgium", "Luxembourg"], { occupied: true }),
        held("axis", northOf(GOTHIC_LINE), ["Italy"], { occupied: true }),
        zone("allies", ["Italy"], { occupied: true }),
        zone("axis", ["Denmark", "Norway"], { occupied: true }),
        zone("soviet", ["Germany", "Poland", "Czechoslovakia", "Hungary", "Romania", "Bulgaria", ...BALTICS], { occupied: true }),
        zone("allies", ["Yugoslavia", "Greece", "Albania"]),
        zone("allies", ["Libya", "Tunisia", ...ITALIAN_EAST_AFRICA, "British Somaliland"], { occupied: true }),
        zone("allies", ["United Kingdom", "France", "Belgium", "Luxembourg", "Netherlands", "Algeria (France)", "Morocco (France)", "Syria (France)", "Mesopotamia (GB)", ...BRITISH_MIDEAST]),
        zone("soviet", ["USSR"]),
      ],
    },
    {
      title: "The Fall of Berlin",
      date: "March – May 1945",
      text: "In March 1945 the Western Allies crossed the Rhine, surrounded the Ruhr and raced east, while in Italy the German armies surrendered on 2 May. The Red Army broke through on the Seelow Heights and encircled Berlin. American and Soviet troops met on the Elbe at Torgau on 25 April, and Hitler killed himself in his bunker on 30 April. Germany surrendered unconditionally on 8 May 1945, Victory in Europe Day. The map shows where the armies stood at the end, the line that would soon divide Europe. The war in Europe had killed tens of millions of people, more than half of them civilians.",
      mapState: { year: 1945, lat: 51, lng: 14, zoom: 4.4 },
      markers: [
        { label: "Remagen: a Rhine bridge taken, 7 March", at: [7.23, 50.58], kind: "battle" },
        { label: "Seelow Heights, April 1945", at: [14.38, 52.53], kind: "battle" },
        { label: "Torgau: Americans and Soviets meet, 25 April", at: [13.0, 51.56] },
        { label: "Berlin falls, 2 May 1945", at: [13.4, 52.52], kind: "battle" },
      ],
      routes: [
        { label: "Across the Rhine", kind: "conquest", path: [[6.6, 51.0], [7.8, 51.0], [10.0, 51.3], [12.4, 51.55]] },
        { label: "The British to the Baltic", kind: "conquest", path: [[6.5, 51.8], [8.8, 52.6], [10.0, 53.55], [11.0, 53.9]] },
        { label: "The Soviet assault on Berlin", kind: "conquest", path: [[16.5, 52.5], [14.7, 52.6], [13.5, 52.52]] },
        { label: "From the south, round Berlin", kind: "conquest", path: [[15.0, 51.3], [13.9, 51.9], [13.4, 52.4]] },
      ],
      zones: [
        held("allies", westOf(MEETING_LINE_1945), ["Germany", "Czechoslovakia"], { occupied: true }),
        zone("soviet", ["Germany", "Poland", "Czechoslovakia", "Hungary", "Romania", "Bulgaria", ...BALTICS], { occupied: true }),
        zone("allies", ["Italy"], { occupied: true }),
        zone("allies", ["United Kingdom", "France", "Belgium", "Luxembourg", "Netherlands", "Denmark", "Norway", "Yugoslavia", "Greece", "Albania"]),
        zone("soviet", ["USSR"]),
      ],
    },
  ],
};


// ═══════════════════════════════════════════════ The Second World War in Asia and the Pacific

const PACIFIC_SIDES: TourSide[] = [
  { key: "japan", name: "Japan and its allies", color: "#2f2b28" },
  { key: "allies", name: "The Allies, including China", color: "#2346a0" },
  { key: "soviet", name: "Soviet Union", color: "#b3312b" },
];

const JAPAN = ["Empire of Japan", "Saipan"];
const INDOCHINA = ["French Indo-China", "Cambodia", "Cochin China", "Laos"];
const ALLIED_PACIFIC = [
  "British Raj", "Malaysia", "Brunei", "Hong Kong", "Dutch East Indies", "Philippines", "Guam", "Australia", "New Zealand",
  "United States", "Gilbert and Ellice Islands", "Ceylon", "Fiji", "New Caledonia", "New Hebrides",
];
const CHINA = zone("allies", ["Chinese warlords"], { label: "China" });

/** The Japanese-held east of China: end of 1938, 1941, and after the Ichi-Go offensive of 1944. */
const CHINA_1938: Pt[] = [
  [111.5, 41.6], [112.5, 38.0], [111.8, 35.0], [114.3, 34.8], [114.3, 31.5], [113.6, 30.6], [114.5, 29.5], [117.0, 29.6],
  [119.5, 30.0], [121.0, 29.8], [121.9, 30.3],
];
const CHINA_1941: Pt[] = [
  [111.5, 41.6], [112.5, 38.0], [111.8, 35.0], [114.3, 34.8], [113.5, 32.0], [111.3, 30.7], [112.5, 29.6], [113.0, 29.0],
  [114.5, 28.5], [116.2, 28.4], [117.5, 29.3], [119.5, 29.6], [120.5, 28.5], [121.8, 27.8],
];
const CHINA_1944: Pt[] = [
  [111.5, 41.6], [112.5, 38.0], [111.0, 35.0], [111.2, 34.4], [112.3, 32.8], [111.3, 30.7], [112.0, 29.2], [111.8, 27.5],
  [110.8, 25.8], [109.3, 24.5], [107.8, 23.2], [106.7, 22.5],
];
const CANTON = held("japan", box(112.4, 21.5, 114.8, 23.8), ["Chinese warlords"], { occupied: true });
const HAINAN = held("japan", box(108.5, 18.0, 111.2, 20.2), ["Chinese warlords"], { occupied: true });
const occupiedChina = (line: Pt[]): TourZone => held("japan", eastOf(line), ["Chinese warlords"], { occupied: true, label: "Occupied China" });
/** Burma, conquered in 1942; the line follows its border with India. */
const BURMA = held("japan", eastOf([[98.0, 28.5], [96.5, 26.8], [95.2, 26.4], [94.6, 25.5], [93.6, 24.0], [93.0, 22.5], [92.6, 21.0], [92.3, 20.5]]), ["British Raj"], { occupied: true, label: "Burma" });
/** The north coast of New Guinea, New Britain and Bougainville, taken in 1942. */
const NEW_GUINEA_1942 = held("japan", [[140.9, -1.0], [140.9, -4.5], [143.5, -5.5], [146.0, -6.3], [147.2, -7.2], [148.2, -8.5], [149.0, -8.0], [151.0, -6.0], [156.5, -7.0], [156.5, -1.0]], ["Australia"], { occupied: true });
const OKINAWA = held("allies", box(126.6, 25.9, 128.5, 27.0), ["Empire of Japan"], { occupied: true });
const MANCHURIA_1945 = held("soviet", [[115, 54], [135.5, 54], [135.5, 42.5], [130.7, 42.3], [129.5, 38.0], [124.5, 38.0], [121.0, 38.7], [119.5, 39.8], [115, 41]], ["Empire of Japan"], { occupied: true, label: "Manchuria" });
const SAKHALIN_1945 = held("soviet", box(141.5, 45.9, 144.8, 50.2), ["Empire of Japan"], { occupied: true });

const SOUTHEAST_ASIA_1942 = zone("japan", ["Philippines", "Malaysia", "Brunei", "Hong Kong", "Dutch East Indies", "Guam", "Gilbert and Ellice Islands", ...INDOCHINA], { occupied: true });
const PEAK_1942: TourZone[] = [
  BURMA, NEW_GUINEA_1942, occupiedChina(CHINA_1941), CANTON, HAINAN, SOUTHEAST_ASIA_1942,
  zone("japan", [...JAPAN, "Siam"]), CHINA, zone("allies", ALLIED_PACIFIC),
];
const LATE_1944: TourZone[] = [
  zone("allies", ["Saipan", "Guam", "Gilbert and Ellice Islands"], { occupied: true }),
  BURMA, occupiedChina(CHINA_1944),
  held("allies", box(134.0, -10.0, 141.1, 0.0), ["Dutch East Indies"], { occupied: true }),
  zone("japan", ["Philippines", "Malaysia", "Brunei", "Hong Kong", "Dutch East Indies", ...INDOCHINA], { occupied: true }),
  zone("japan", [...JAPAN, "Siam"]), CHINA, zone("allies", ALLIED_PACIFIC),
];
const MID_1945: TourZone[] = [
  OKINAWA,
  zone("allies", ["Saipan", "Guam", "Gilbert and Ellice Islands", "Philippines"], { occupied: true }),
  occupiedChina(CHINA_1944),
  held("allies", box(134.0, -10.0, 141.1, 0.0), ["Dutch East Indies"], { occupied: true }),
  zone("japan", ["Malaysia", "Brunei", "Hong Kong", "Dutch East Indies", ...INDOCHINA], { occupied: true }),
  zone("japan", [...JAPAN, "Siam"]), CHINA, zone("allies", ALLIED_PACIFIC),
];

const SECOND_WORLD_WAR_PACIFIC: Tour = {
  slug: "second-world-war-pacific",
  title: "World War II in Asia and the Pacific",
  description:
    "From Japan's war in China and the attack on Pearl Harbor to Midway, Burma, island-hopping across the Pacific, Hiroshima and Nagasaki, and Japan's surrender in 1945, with the territory each side held.",
  duration: 9,
  difficulty: "standard",
  sides: PACIFIC_SIDES,
  zoneYear: 1938,
  steps: [
    {
      title: "Japan's War in China",
      date: "1931–1938",
      text: "Japan, an industrial and imperial power that already ruled Korea and Taiwan, seized Manchuria in 1931. In 1937 it launched a full-scale war on China, taking Shanghai and the capital, Nanjing, where Japanese troops massacred civilians and prisoners: tens of thousands at the very least, and by many estimates hundreds of thousands. By the end of 1938 Japan held northern China, the lower Yangtze and Canton, but China fought on from the interior, its government moved to Chongqing, and the war bogged down.",
      mapState: { year: 1937, mapYear: 1938, lat: 34, lng: 115, zoom: 3.4 },
      markers: [
        { label: "Manchuria, seized 1931", at: [125.0, 45.0] },
        { label: "Shanghai, August–November 1937", at: [121.47, 31.23], kind: "battle" },
        { label: "Nanjing massacre, December 1937", at: [118.8, 32.06], kind: "battle" },
        { label: "Wuhan falls, October 1938", at: [114.3, 30.59], kind: "battle" },
        { label: "Chongqing: China's wartime capital", at: [106.55, 29.56] },
      ],
      routes: [
        { label: "South from Beijing, 1937", kind: "conquest", path: [[116.4, 39.9], [115.0, 36.0], [114.6, 34.9]] },
        { label: "Up the Yangtze, 1937–1938", kind: "conquest", path: [[121.4, 31.3], [118.8, 32.06], [116.5, 30.5], [114.3, 30.6]] },
      ],
      zones: [occupiedChina(CHINA_1938), CANTON, zone("japan", JAPAN), CHINA],
    },
    {
      title: "Pearl Harbor",
      date: "7 December 1941",
      text: "To secure oil and other resources in Southeast Asia, Japan moved troops into French Indochina in 1940–1941; the United States answered by cutting off its oil. Japan decided to strike first. On 7 December 1941 carrier aircraft attacked the US Pacific Fleet at Pearl Harbor, in Hawai'i, sinking or damaging eight battleships. The United States declared war the next day. Within hours, Japan also attacked the Philippines, Malaya and Hong Kong.",
      mapState: { year: 1941, mapYear: 1938, lat: 28, lng: 170, zoom: 2.6 },
      markers: [{ label: "Pearl Harbor, 7 December 1941", at: [202.05, 21.36], kind: "battle" }],
      routes: [{ label: "The carrier strike force", kind: "voyage", path: [[146.7, 44.6], [160, 43], [175, 42], [190, 35], [200, 25], [202, 21.6]] }],
      zones: [occupiedChina(CHINA_1941), CANTON, HAINAN, zone("japan", INDOCHINA, { occupied: true }), zone("japan", JAPAN), CHINA, zone("allies", ALLIED_PACIFIC)],
    },
    {
      title: "Lightning Conquest",
      date: "December 1941 – May 1942",
      text: "In six months Japan conquered an empire across Southeast Asia and the western Pacific: Hong Kong, the Philippines, Malaya, the Dutch East Indies and Burma, with Thailand as its ally. In February 1942 Singapore, Britain's great Asian fortress, surrendered with some 80,000 British, Indian and Australian troops, the largest surrender in British history. American and Filipino troops held out on Bataan and Corregidor until May. Japan's conquest of Burma cut the Burma Road, China's last land route to its allies.",
      mapState: { year: 1942, mapYear: 1938, lat: 6, lng: 118, zoom: 2.9 },
      markers: [
        { label: "Singapore falls, 15 February 1942", at: [103.82, 1.35], kind: "battle" },
        { label: "Bataan and Corregidor, to May 1942", at: [120.5, 14.5], kind: "battle" },
        { label: "Java Sea, February 1942", at: [112.5, -5.8], kind: "battle" },
        { label: "Rangoon falls, March 1942", at: [96.16, 16.8] },
      ],
      routes: [
        { label: "Down the Malay Peninsula to Singapore", kind: "conquest", path: [[106.7, 10.8], [103.0, 7.0], [101.5, 4.0], [103.75, 1.4]] },
        { label: "Into the Philippines", kind: "conquest", path: [[121.5, 25.0], [121.5, 20.0], [121.0, 14.8]] },
        { label: "Into the Dutch East Indies", kind: "conquest", path: [[110.0, 3.0], [109.0, -2.0], [107.0, -6.1]] },
        { label: "Into Burma", kind: "conquest", path: [[100.5, 13.7], [98.5, 16.5], [96.2, 16.85], [96.1, 21.9]] },
      ],
      zones: PEAK_1942,
    },
    {
      title: "Coral Sea and Midway",
      date: "May–June 1942",
      text: "In May 1942, in the Coral Sea, American and Australian ships turned back a Japanese invasion fleet heading for Port Moresby, in the first naval battle fought entirely by aircraft from carriers out of sight of each other. In June Japan tried to lure the remaining US carriers into a trap near Midway atoll. But American codebreakers had read Japan's plans, and US dive bombers sank four Japanese aircraft carriers in a few minutes, a loss Japan could never replace. From then on, the Americans held the initiative in the Pacific.",
      mapState: { year: 1942, mapYear: 1938, lat: 12, lng: 170, zoom: 2.5 },
      markers: [
        { label: "Coral Sea, 4–8 May 1942", at: [155.0, -15.0], kind: "battle" },
        { label: "Midway, 4–7 June 1942", at: [182.63, 28.21], kind: "battle" },
        { label: "Port Moresby", at: [147.15, -9.45] },
      ],
      routes: [
        { label: "Japanese invasion fleet for Port Moresby", kind: "voyage", path: [[152.2, -4.2], [153.5, -8.0], [154.5, -11.5]] },
        { label: "Japanese carrier force to Midway", kind: "voyage", path: [[135, 33.5], [150, 32], [165, 31], [178, 30], [182, 28.6]] },
        { label: "US carriers from Pearl Harbor", kind: "voyage", path: [[202, 21.4], [195, 25], [188, 29], [183, 28.4]] },
      ],
      zones: PEAK_1942,
    },
    {
      title: "Burma and India",
      date: "1942–1945",
      text: "With the Burma Road cut, Allied supplies for China had to be flown over the Himalayas, 'the Hump', one of the most dangerous air routes of the war. In March 1944 Japan invaded India itself, at Imphal and Kohima. In some of the hardest fighting of the war, British and Indian troops held on, and the Japanese, starving and sick, retreated with enormous losses. General Slim's Fourteenth Army, drawn from across the British Empire, then reconquered Burma, taking Mandalay in March 1945 and Rangoon in May.",
      mapState: { year: 1944, mapYear: 1938, lat: 22, lng: 96, zoom: 4.3 },
      markers: [
        { label: "Imphal, March–July 1944", at: [93.94, 24.82], kind: "battle" },
        { label: "Kohima, April–June 1944", at: [94.11, 25.67], kind: "battle" },
        { label: "Mandalay, March 1945", at: [96.08, 21.97], kind: "battle" },
        { label: "Rangoon retaken, May 1945", at: [96.16, 16.8] },
        { label: "Kunming: the end of the Hump", at: [102.7, 25.04] },
      ],
      routes: [
        { label: "The Hump airlift over the Himalayas", kind: "voyage", path: [[94.9, 27.5], [97.0, 27.0], [100.0, 25.8], [102.6, 25.1]] },
        { label: "The Japanese offensive into India", kind: "conquest", path: [[95.5, 23.0], [94.6, 24.1], [94.05, 24.75]] },
        { label: "Slim's advance to Rangoon", kind: "conquest", path: [[94.0, 24.9], [95.0, 23.2], [96.1, 22.0], [96.2, 19.7], [96.17, 16.9]] },
      ],
      zones: LATE_1944,
    },
    {
      title: "Island Hopping",
      date: "1942–1944",
      text: "The Allies fought back in long, bloody campaigns: on Guadalcanal and New Guinea from 1942, and then by 'island hopping' across the Central Pacific, taking key islands for airfields and bypassing others: Tarawa in 1943, then Saipan and the Marianas in 1944, from where bombers could reach Japan. In China, Japan's Ichi-Go offensive in 1944 overran much of the south. At Leyte Gulf in October 1944, the largest naval battle in history broke the Japanese navy, as the Americans returned to the Philippines.",
      mapState: { year: 1944, mapYear: 1938, lat: 8, lng: 150, zoom: 2.6 },
      markers: [
        { label: "Guadalcanal, 1942–1943", at: [160.0, -9.6], kind: "battle" },
        { label: "Tarawa, November 1943", at: [173.0, 1.4], kind: "battle" },
        { label: "Saipan, June 1944", at: [145.75, 15.18], kind: "battle" },
        { label: "Leyte Gulf, October 1944", at: [125.5, 10.5], kind: "battle" },
      ],
      routes: [
        { label: "The Central Pacific drive", kind: "conquest", path: [[202, 21.4], [185, 10], [173, 1.4], [167, 9], [155, 12], [145.75, 15.18]] },
        { label: "From Australia through New Guinea to the Philippines", kind: "conquest", path: [[151, -33.9], [153, -20], [147, -9.5], [140, -3], [134, 2], [125.5, 10.5]] },
        { label: "Guadalcanal", kind: "conquest", path: [[166.5, -19], [163, -14], [160, -9.6]] },
      ],
      zones: LATE_1944,
    },
    {
      title: "Iwo Jima and Okinawa",
      date: "February–June 1945",
      text: "In 1945 the Americans fought their way to Japan's doorstep. Iwo Jima cost nearly 7,000 American lives; Okinawa, from April to June, killed some 100,000 Japanese soldiers and a huge number of Okinawan civilians, along with more than 12,000 Americans. Japanese kamikaze pilots crashed their planes into Allied ships. The Philippines were retaken, and American bombers burned Japan's cities: a single raid on Tokyo in March killed around 100,000 people.",
      mapState: { year: 1945, lat: 28, lng: 133, zoom: 3.6 },
      markers: [
        { label: "Manila retaken, March 1945", at: [120.98, 14.6], kind: "battle" },
        { label: "Iwo Jima, February–March 1945", at: [141.32, 24.78], kind: "battle" },
        { label: "Okinawa, April–June 1945", at: [127.8, 26.4], kind: "battle" },
        { label: "Tokyo firebombed, March 1945", at: [139.69, 35.69], kind: "battle" },
      ],
      routes: [
        { label: "To Iwo Jima", kind: "conquest", path: [[145.75, 15.2], [143.5, 20], [141.3, 24.78]] },
        { label: "To Okinawa", kind: "conquest", path: [[125.5, 11], [127, 18], [127.8, 26.4]] },
        { label: "Bombers from the Marianas", kind: "raid", path: [[145.7, 15.2], [143, 25], [140.5, 32], [139.7, 35.6]] },
      ],
      zones: MID_1945,
    },
    {
      title: "Hiroshima, Nagasaki and Surrender",
      date: "August–September 1945",
      text: "On 6 August 1945 an American B-29 dropped an atomic bomb on Hiroshima, killing around 70,000–80,000 people at once and many more later. On 8 August the Soviet Union declared war and invaded Manchuria, overrunning it in days. On 9 August a second bomb destroyed Nagasaki. Emperor Hirohito announced Japan's surrender on 15 August, and it was signed in Tokyo Bay on 2 September 1945, ending the Second World War. Korea was divided at the 38th parallel between Soviet and American occupation.",
      mapState: { year: 1945, lat: 40, lng: 130, zoom: 3.5 },
      highlight: ["Japan (USA)"],
      markers: [
        { label: "Hiroshima, 6 August 1945", at: [132.46, 34.39], kind: "battle" },
        { label: "Nagasaki, 9 August 1945", at: [129.87, 32.75], kind: "battle" },
        { label: "Tokyo Bay: surrender signed, 2 September 1945", at: [139.8, 35.4] },
      ],
      routes: [
        { label: "The Soviet invasion of Manchuria, August 1945", kind: "conquest", path: [[117, 49.5], [121, 47], [125, 44.5], [126.6, 45.75]] },
        { label: "From the east", kind: "conquest", path: [[133.0, 44.5], [130.5, 44.6], [127.5, 45.0]] },
      ],
      zones: [MANCHURIA_1945, SAKHALIN_1945, ...MID_1945],
    },
  ],
};

export const WAR_TOURS: Tour[] = [FIRST_WORLD_WAR, SECOND_WORLD_WAR_EUROPE, SECOND_WORLD_WAR_PACIFIC];

/** The world-wars hub groups the tours by war. */
export const WORLD_WARS = [
  { key: "ww1", title: "The First World War", span: "1914–1918", tours: [FIRST_WORLD_WAR] },
  { key: "ww2", title: "The Second World War", span: "1939–1945", tours: [SECOND_WORLD_WAR_EUROPE, SECOND_WORLD_WAR_PACIFIC] },
];
