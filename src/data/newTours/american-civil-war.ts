import type { Tour, TourSide, TourZone } from "@/data/tours";

/*
 * Who held what, stop by stop. The zones are cut from the 1880 snapshot, where
 * the whole country is one shape, "United States of America", by
 * scripts/build-war-zones.mts (re-run it after editing: npx tsx
 * scripts/build-war-zones.mts). Each stop lists, in order:
 *   1. the land the Confederacy held at that date;
 *   2. the rest of the eleven seceded states, held by Union forces (hatched);
 *   3. everything else: the free states, the border slave states and the
 *      territories, all Union. Indian Territory, split by the war, is left to
 *      this base zone.
 * The Confederacy is drawn as the seceded states with Union-held ground cut
 * out of it (`minus`). Fronts are simplified to the main lines of control at
 * each stop's date; raids that passed through and left are not shown.
 */

type Pt = [number, number];

const USA = ["United States of America"];
const box = (west: number, south: number, east: number, north: number): Pt[] => [
  [west, south], [east, south], [east, north], [west, north],
];
const held = (side: string, area: Pt[], within: string[], extra: Partial<TourZone> = {}): TourZone => ({ side, area, within, ...extra });
/** A band about `half` degrees either side of a river running roughly north to south. */
const riverBand = (river: Pt[], half: number): Pt[] => [
  ...river.map(([x, y]): Pt => [x - half, y]),
  ...[...river].reverse().map(([x, y]): Pt => [x + half, y]),
];

const SIDES: TourSide[] = [
  { key: "confederacy", name: "Confederate States", color: "#7a6a58" },
  { key: "union", name: "United States (Union)", color: "#2346a0" },
];

/**
 * The eleven seceded states as of mid-1861, from the state borders: the
 * Potomac, the Virginia line (West Virginia left out: its Unionist counties
 * set up the Restored Government of Virginia and Union troops held them from
 * July 1861), the Kentucky line at about 36°36′N and 36°30′N, the Arkansas–
 * Missouri line at 36°30′N and the Bootheel, the Indian Territory line and the
 * Red River, the Texas Panhandle, 32°N and the Rio Grande. Out to sea on the
 * Gulf and Atlantic sides, so coasts come from the snapshot.
 */
const CSA: Pt[] = [
  [-106.64, 31.9], [-106.38, 31.73], [-106.21, 31.47], [-105.95, 31.36], [-105.39, 30.86], [-105.01, 30.69], [-104.9, 30.57], [-104.86, 30.39],
  [-104.69, 30.18], [-104.68, 29.92], [-104.51, 29.64], [-104.15, 29.38], [-103.28, 28.98], [-103.12, 28.99], [-102.92, 29.19], [-102.81, 29.52],
  [-102.63, 29.73], [-102.39, 29.77], [-102.34, 29.87], [-102.11, 29.79], [-101.41, 29.75], [-101.26, 29.54], [-101.06, 29.46], [-100.8, 29.24],
  [-100.67, 29.1], [-100.5, 28.66], [-100.4, 28.58], [-100.3, 28.28], [-99.93, 27.98], [-99.88, 27.8], [-99.61, 27.64], [-99.48, 27.48],
  [-99.45, 27.02], [-99.27, 26.84], [-99.17, 26.54], [-98.67, 26.24], [-98.47, 26.22], [-98.2, 26.06], [-98, 26.06], [-98, 23],
  [-74, 23], [-74, 38], [-75.24, 38.03], [-75.89, 37.91], [-75.88, 38], [-76.47, 38], [-76.61, 38.15], [-76.96, 38.22],
  [-77.01, 38.37], [-77.28, 38.34], [-77.33, 38.45], [-77.04, 38.79], [-77.25, 39.03], [-77.46, 39.08], [-77.46, 39.22], [-77.57, 39.31],
  [-77.72, 39.32], [-77.83, 39.13], [-78.35, 39.46], [-78.4, 39.17], [-78.87, 38.76], [-79, 38.85], [-79.31, 38.41], [-79.65, 38.59],
  [-79.72, 38.36], [-80.29, 37.69], [-80.3, 37.51], [-80.47, 37.42], [-80.51, 37.48], [-81.23, 37.24], [-81.36, 37.34], [-81.55, 37.21],
  [-81.68, 37.2], [-81.85, 37.29], [-81.99, 37.45], [-81.97, 37.54], [-82.35, 37.27], [-82.72, 37.12], [-82.72, 37.04], [-82.87, 36.98],
  [-82.88, 36.89], [-83.07, 36.85], [-83.14, 36.74], [-83.69, 36.58], [-88.07, 36.68], [-88.05, 36.5], [-89.54, 36.5], [-89.53, 36.25],
  [-89.73, 36], [-90.38, 36], [-90.06, 36.3], [-90.15, 36.5], [-94.62, 36.5], [-94.43, 35.4], [-94.48, 33.64], [-94.87, 33.75],
  [-94.97, 33.86], [-95.22, 33.96], [-95.29, 33.87], [-95.55, 33.88], [-95.6, 33.93], [-95.84, 33.83], [-95.94, 33.89], [-96.15, 33.84],
  [-96.35, 33.69], [-96.63, 33.85], [-96.85, 33.85], [-96.92, 33.96], [-97.17, 33.74], [-97.26, 33.86], [-97.37, 33.82], [-97.69, 33.98],
  [-97.87, 33.85], [-97.95, 33.99], [-98.09, 34], [-98.17, 34.11], [-98.36, 34.16], [-98.49, 34.06], [-98.57, 34.15], [-99.19, 34.21],
  [-99.26, 34.4], [-99.7, 34.38], [-99.92, 34.57], [-100, 34.56], [-100, 36.5], [-103.04, 36.5], [-103.07, 32], [-106.62, 32],
];

// ── Union-held ground inside the seceded states (cut out of the Confederacy) ──

/** Key West and Fort Jefferson: never given up. */
const KEYS: Pt[] = [[-82.2, 24.4], [-80.0, 24.4], [-80.0, 25.18], [-80.45, 25.18], [-81.0, 24.8], [-82.2, 24.8]];
/** Fort Monroe, with Hampton and Newport News, occupied in May 1861. */
const FORT_MONROE: Pt[] = [[-76.5, 36.97], [-76.42, 37.12], [-76.25, 37.12], [-76.25, 36.97]];
/** Arlington and Alexandria, occupied 24 May 1861 and held after Bull Run. */
const ARLINGTON: Pt[] = [[-77.03, 38.74], [-77.13, 38.75], [-77.17, 38.86], [-77.12, 38.95], [-77.05, 38.9]];
/** Virginia's Eastern Shore, occupied November 1861. */
const EASTERN_SHORE: Pt[] = box(-76.1, 37.02, -74.9, 38.05);
/** Pensacola, from May 1862, when the Confederates pulled out. */
const PENSACOLA: Pt[] = box(-87.45, 30.25, -86.95, 30.55);
/** Fernandina and Amelia Island, and St Augustine, taken in March 1862. */
const FERNANDINA: Pt[] = box(-81.6, 30.5, -81.3, 30.75);
const ST_AUGUSTINE: Pt[] = box(-81.42, 29.78, -81.18, 30.0);
/** St Simons Island, Georgia, held from March to late 1862. */
const ST_SIMONS: Pt[] = box(-81.45, 31.05, -81.25, 31.25);
/** Port Royal Sound and the Sea Islands (Hilton Head, Beaufort, St Helena), taken November 1861, with Fort Pulaski from April 1862. */
const PORT_ROYAL: Pt[] = [[-81.0, 31.95], [-80.98, 32.15], [-80.85, 32.35], [-80.75, 32.55], [-80.45, 32.55], [-80.2, 32.6], [-80.1, 32.45], [-80.6, 32.0]];
/** Folly and Morris Islands, below Charleston: Union from April and September 1863. */
const CHARLESTON_ISLANDS: Pt[] = [[-80.12, 32.55], [-79.88, 32.6], [-79.86, 32.7], [-79.98, 32.68], [-80.15, 32.6]];
/**
 * North Carolina's sounds: Hatteras (August 1861), Roanoke Island and New Bern
 * (February–March 1862), Beaufort and Fort Macon, Washington and Plymouth.
 * Sources: "Burnside's North Carolina Expedition", "Union blockade".
 */
const NC_SOUNDS_1862: Pt[] = [
  [-76.9, 34.62], [-77.1, 34.95], [-77.18, 35.15], [-77.12, 35.6], [-76.8, 35.9], [-76.3, 36.05], [-75.75, 36.55],
  [-75.5, 36.55], [-75.4, 35.6], [-75.45, 35.15], [-76.0, 34.85], [-76.6, 34.55],
];
/** The same in 1864: Washington given up in April, Plymouth retaken on 31 October. */
const NC_SOUNDS_1864: Pt[] = [
  [-76.9, 34.62], [-77.1, 34.95], [-77.18, 35.15], [-76.9, 35.35], [-76.65, 35.6], [-76.85, 35.85], [-76.3, 36.05],
  [-75.75, 36.55], [-75.5, 36.55], [-75.4, 35.6], [-75.45, 35.15], [-76.0, 34.85], [-76.6, 34.55],
];
/**
 * End of May 1862: McClellan's army up the Peninsula to the Chickahominy, a
 * few miles from Richmond (Seven Pines, 31 May), White House on the Pamunkey,
 * Gloucester Point, and Norfolk and Suffolk, taken in May. Source: "Peninsula campaign".
 */
const PENINSULA_MAY_1862: Pt[] = [
  [-75.9, 36.55], [-76.45, 36.55], [-76.65, 36.73], [-76.62, 36.9], [-76.6, 37.08], [-76.85, 37.2], [-77.05, 37.28],
  [-77.2, 37.36], [-77.3, 37.5], [-77.36, 37.62], [-77.25, 37.72], [-77.0, 37.68], [-76.75, 37.55], [-76.55, 37.4],
  [-76.25, 37.35], [-75.9, 36.9],
];
/** After the Peninsula was given up (August 1862): Fort Monroe to Williamsburg, Yorktown and Gloucester Point, Norfolk and Suffolk. */
const HAMPTON_ROADS_1862: Pt[] = [
  [-75.9, 36.55], [-76.45, 36.55], [-76.65, 36.73], [-76.62, 36.9], [-76.6, 37.08], [-76.8, 37.22], [-76.75, 37.33],
  [-76.55, 37.4], [-76.25, 37.35], [-75.9, 36.9],
];
/** Spring 1862: northern Virginia east of the Blue Ridge, after the Confederates left Manassas in March, to Fredericksburg (taken in April) on the Rappahannock. */
const NORTHERN_VA_1862: Pt[] = [
  [-77.55, 39.3], [-77.83, 39.1], [-78.0, 38.75], [-77.9, 38.55], [-77.62, 38.36], [-77.45, 38.28], [-77.15, 38.15],
  [-76.85, 38.15], [-76.85, 38.3], [-77.0, 38.6], [-77.03, 38.75],
];
/** Winter 1862–63: Burnside's army at Falmouth, across the Rappahannock from Fredericksburg, and Milroy at Winchester from 24 December. */
const NORTHERN_VA_1863: Pt[] = [
  [-77.72, 39.35], [-77.85, 39.05], [-78.3, 39.05], [-78.42, 39.5], [-77.6, 39.5], [-77.55, 39.1], [-77.65, 38.75],
  [-77.65, 38.5], [-77.48, 38.32], [-77.15, 38.15], [-76.85, 38.15], [-76.85, 38.3], [-77.0, 38.6], [-77.03, 38.75],
];
/** Summer 1863 onwards: the defences of Washington, from Alexandria to Fairfax and Centreville. */
const FAIRFAX: Pt[] = [[-77.03, 38.72], [-77.1, 38.65], [-77.35, 38.66], [-77.5, 38.85], [-77.42, 39.07], [-77.25, 39.03], [-77.05, 38.9]];
/** Late 1864: the lower Shenandoah Valley, Sheridan's after Cedar Creek (19 October), and Harpers Ferry. */
const LOWER_VALLEY_1864: Pt[] = [[-77.72, 39.35], [-77.83, 39.0], [-78.2, 38.92], [-78.55, 38.95], [-78.5, 39.5], [-77.75, 39.5]];
/**
 * December 1864: the Richmond–Petersburg siege lines, from Fort Harrison north
 * of the James to the Union left past the Weldon Railroad, with Bermuda
 * Hundred and City Point behind them, joined to the lower Peninsula and
 * Norfolk. Sources: "Siege of Petersburg", "Battle of Chaffin's Farm".
 */
const PETERSBURG_1864: Pt[] = [
  [-75.9, 36.55], [-76.45, 36.55], [-76.6, 36.8], [-76.65, 36.95], [-76.8, 37.2], [-77.0, 37.2], [-77.2, 37.05],
  [-77.45, 37.05], [-77.48, 37.15], [-77.38, 37.18], [-77.35, 37.23], [-77.37, 37.27], [-77.37, 37.36], [-77.35, 37.43],
  [-77.37, 37.48], [-77.2, 37.45], [-76.95, 37.4], [-76.6, 37.4], [-76.25, 37.35], [-75.9, 36.9],
];
/**
 * 9 April 1865: Richmond and Petersburg fallen (2–3 April), the Union armies
 * strung out to Appomattox, the Shenandoah Valley cleared at Waynesboro
 * (2 March). Lynchburg, Danville and the south-west still Confederate.
 * Source: "Appomattox campaign".
 */
const VIRGINIA_APRIL_1865: Pt[] = [
  [-80.5, 38.3], [-79.95, 38.0], [-79.2, 37.8], [-78.85, 37.45], [-78.7, 37.25], [-78.2, 37.05], [-77.8, 36.85],
  [-77.5, 36.55], [-75.5, 36.55], [-75.5, 39.6], [-80.5, 39.6],
];
/**
 * 9 April 1865 in the Carolinas: Wilmington (22 February), Charleston
 * (18 February), and the ground behind Sherman's march through Columbia,
 * Cheraw, Fayetteville and Bentonville to Goldsboro (23 March). Johnston's army
 * still held Raleigh and the Piedmont. Sources: "Carolinas campaign",
 * "Battle of Wilmington".
 */
const CAROLINAS_APRIL_1865: Pt[] = [
  [-76.95, 36.55], [-77.2, 36.1], [-77.6, 35.6], [-78.0, 35.45], [-78.35, 35.35], [-78.85, 35.1], [-79.5, 34.85],
  [-79.95, 34.85], [-80.8, 34.6], [-81.3, 34.4], [-81.4, 33.9], [-81.5, 33.3], [-81.65, 32.6], [-81.3, 32.0],
  [-80.0, 31.5], [-75.0, 33.0], [-75.0, 36.55],
];
/**
 * The march from Chattanooga to Atlanta (May–September 1864) and on to the sea
 * (15 November – 21 December), a band about 60 miles wide. Sherman cut loose
 * from his supply lines, so this is ground his armies took and crossed rather
 * than ground they garrisoned. Sources: "Atlanta campaign", "Sherman's March
 * to the Sea".
 */
const SHERMAN_1864: Pt[] = [
  [-85.0, 35.05], [-84.75, 34.6], [-84.6, 34.2], [-84.3, 33.95], [-84.0, 33.85], [-83.4, 33.75], [-82.9, 33.4],
  [-82.3, 33.2], [-81.7, 32.95], [-81.35, 32.6], [-81.0, 32.3], [-80.8, 32.0], [-81.15, 31.85], [-81.5, 32.3],
  [-82.0, 32.6], [-82.5, 32.75], [-83.1, 32.8], [-83.55, 32.85], [-83.9, 33.2], [-84.4, 33.55], [-84.7, 33.8],
  [-84.95, 34.15], [-85.15, 34.6], [-85.5, 35.05],
];
/**
 * End of May 1862 in the West: Forts Henry and Donelson (February), Nashville
 * and Middle Tennessee to the Alabama line, Island No. 10 (7 April), Shiloh,
 * Corinth (30 May), and Mitchel's hold on the Tennessee Valley of north
 * Alabama from Huntsville to Bridgeport (April). Fort Pillow and Memphis still
 * Confederate (they fell in June); East Tennessee, beyond the Cumberland
 * Plateau, stays Confederate. Sources: "Western theater of the American Civil
 * War", "Battle of Fort Donelson", "Siege of Corinth".
 */
const TENNESSEE_MAY_1862: Pt[] = [
  [-89.8, 36.8], [-89.5, 36.5], [-89.6, 36.1], [-89.75, 35.85], [-89.0, 35.85], [-88.55, 35.65], [-88.45, 35.3],
  [-88.75, 35.0], [-88.65, 34.82], [-88.2, 34.72], [-87.7, 34.68], [-87.0, 34.55], [-86.6, 34.62], [-86.1, 34.58],
  [-85.75, 34.85], [-85.62, 35.02], [-85.85, 35.2], [-85.8, 35.6], [-85.5, 36.0], [-85.3, 36.5], [-85.2, 36.8],
];
/** North-central Arkansas: Curtis's Army of the Southwest after Pea Ridge (March 1862), from the Missouri line to Batesville on the White River. Source: "Battle of Pea Ridge". */
const ARKANSAS_MAY_1862: Pt[] = [
  [-94.62, 36.6], [-94.62, 36.25], [-93.6, 36.15], [-92.6, 35.95], [-91.95, 35.6], [-91.3, 35.65], [-91.0, 36.0], [-90.9, 36.6],
];
/** New Orleans (taken 1 May 1862) and the river up to Baton Rouge (12 May), with the forts below the city. Source: "Capture of New Orleans". */
const LOWER_LOUISIANA_MAY_1862: Pt[] = [
  [-91.3, 30.55], [-91.05, 30.58], [-90.75, 30.25], [-90.2, 30.12], [-89.6, 30.12], [-89.2, 29.85], [-88.8, 29.0],
  [-89.4, 29.0], [-89.75, 29.4], [-90.2, 29.6], [-90.55, 29.85], [-90.9, 30.05], [-91.35, 30.4],
];
/** Winter 1862–63: New Orleans, Baton Rouge (re-occupied in December), and the Lafourche country to Berwick Bay, taken in October 1862. */
const LOWER_LOUISIANA_1863: Pt[] = [
  [-91.3, 30.6], [-91.05, 30.62], [-90.85, 30.35], [-90.45, 30.27], [-89.75, 30.2], [-89.4, 30.05], [-89.2, 29.8],
  [-88.8, 29.0], [-90.0, 28.9], [-90.8, 29.0], [-91.35, 29.3], [-91.25, 29.7], [-91.25, 30.0], [-91.4, 30.3],
];
/** Early July 1863: Taylor's raid has retaken Brashear City and the Lafourche country west of the river; Banks holds New Orleans, Donaldsonville, Baton Rouge and the lines round Port Hudson. Source: "Siege of Port Hudson". */
const LOWER_LOUISIANA_JULY_1863: Pt[] = [
  [-91.42, 30.8], [-91.1, 30.82], [-90.95, 30.55], [-90.75, 30.3], [-90.45, 30.27], [-89.75, 30.2], [-89.4, 30.05],
  [-89.2, 29.8], [-88.8, 29.0], [-89.5, 28.95], [-89.95, 29.4], [-90.45, 29.75], [-90.9, 30.0], [-91.2, 30.3],
  [-91.45, 30.5],
];
/** Port Hudson inside its siege lines, holding out until 9 July 1863. */
const PORT_HUDSON_POCKET: Pt[] = box(-91.34, 30.65, -91.22, 30.75);
/** Vicksburg inside its siege lines, holding out until 4 July 1863. Source: "Siege of Vicksburg". */
const VICKSBURG_POCKET: Pt[] = [[-90.93, 32.41], [-90.84, 32.41], [-90.8, 32.35], [-90.83, 32.28], [-90.93, 32.28]];
/** Grant's ground round Vicksburg in June–July 1863: the Louisiana shore from Lake Providence down, and the land between the Yazoo, the Big Black and the river. */
const VICKSBURG_1863: Pt[] = [
  [-91.4, 32.85], [-90.9, 32.75], [-90.6, 32.5], [-90.6, 32.25], [-90.75, 32.05], [-91.1, 31.95], [-91.45, 32.0],
];
/**
 * Winter 1862–63 in the West: all of West Tennessee with Memphis (June 1862)
 * and Corinth, and Middle Tennessee as far as Franklin and Murfreesboro after
 * Stones River (31 December – 2 January). North Alabama was given up in the
 * autumn. Sources: "Battle of Stones River", "Second Battle of Corinth".
 */
const TENNESSEE_JAN_1863: Pt[] = [
  [-89.8, 36.8], [-89.5, 36.5], [-89.7, 35.9], [-90.1, 35.15], [-90.32, 34.97], [-88.75, 34.97], [-88.7, 34.8],
  [-88.3, 34.8], [-88.15, 35.0], [-87.9, 35.45], [-87.3, 35.8], [-86.9, 35.86], [-86.4, 35.78], [-86.0, 35.95],
  [-85.8, 36.2], [-85.5, 36.4], [-85.3, 36.8],
];
/** Early July 1863, after the Tullahoma campaign (24 June – 3 July): Bragg driven out of Middle Tennessee to Chattanooga. Source: "Tullahoma campaign". */
const TENNESSEE_JULY_1863: Pt[] = [
  [-89.8, 36.8], [-89.5, 36.5], [-89.7, 35.9], [-90.1, 35.15], [-90.32, 34.97], [-88.75, 34.97], [-88.7, 34.8],
  [-88.3, 34.8], [-88.15, 35.0], [-85.95, 35.0], [-86.0, 35.2], [-85.8, 35.6], [-85.5, 36.0], [-85.3, 36.8],
];
/**
 * Late 1864: all Tennessee but its north-east corner beyond Bull's Gap
 * (Knoxville and Chattanooga fell in autumn 1863; Hood's invasion broke at
 * Franklin and Nashville, 30 November – 16 December), and north Alabama's
 * Tennessee Valley from Decatur to Bridgeport. Corinth was given up in January
 * 1864. Sources: "Knoxville campaign", "Franklin–Nashville campaign".
 */
const TENNESSEE_DEC_1864: Pt[] = [
  [-89.8, 36.8], [-89.5, 36.5], [-89.7, 35.9], [-90.1, 35.15], [-90.32, 34.97], [-87.4, 34.97], [-87.0, 34.6],
  [-86.3, 34.35], [-85.7, 34.65], [-85.45, 35.0], [-84.3, 35.0], [-84.0, 35.25], [-83.5, 35.55], [-83.1, 35.75],
  [-83.1, 36.8],
];
/** April 1865: the rest of Tennessee too (Stoneman rode out of East Tennessee in March) and north Alabama to Florence. */
const TENNESSEE_1865: Pt[] = [
  [-89.8, 36.8], [-89.5, 36.5], [-89.7, 35.9], [-90.1, 35.15], [-90.32, 34.97], [-88.2, 34.97], [-87.7, 34.7],
  [-87.0, 34.6], [-86.3, 34.35], [-85.7, 34.65], [-85.45, 35.0], [-84.3, 35.0], [-84.0, 35.25], [-83.5, 35.55],
  [-82.6, 35.95], [-81.7, 36.2], [-81.6, 36.8],
];
/** The Mississippi from Memphis to the Gulf, all Union after Vicksburg (4 July 1863) and Port Hudson (9 July): Helena, Natchez, Baton Rouge, both banks. */
const MISSISSIPPI_RIVER: Pt[] = riverBand([
  [-90.05, 35.15], [-90.59, 34.53], [-91.05, 33.8], [-91.06, 33.41], [-91.18, 32.8], [-90.9, 32.35],
  [-91.05, 31.98], [-91.42, 31.56], [-91.6, 31.0], [-91.27, 30.69], [-91.19, 30.45], [-90.99, 30.1],
], 0.2);
/** Helena, Arkansas, taken by Curtis on 12 July 1862 and held (Battle of Helena, 4 July 1863). */
const HELENA: Pt[] = box(-90.85, 34.3, -90.5, 34.75);
/** North-west Arkansas after Prairie Grove (7 December 1862). */
const NW_ARKANSAS_1863: Pt[] = [[-94.62, 36.6], [-94.62, 35.75], [-94.1, 35.75], [-93.6, 36.1], [-93.5, 36.6]];
/**
 * From autumn 1863: Arkansas north of the Arkansas River line held after
 * Little Rock (10 September) and Fort Smith (1 September), with Pine Bluff;
 * Steele fell back to it after the Camden expedition of spring 1864.
 * Sources: "Little Rock campaign", "Trans-Mississippi theater of the American Civil War".
 */
const ARKANSAS_1864: Pt[] = [
  [-94.62, 36.6], [-94.62, 35.2], [-93.9, 35.12], [-93.15, 35.08], [-92.4, 34.6], [-92.05, 34.12], [-91.5, 34.0],
  [-91.1, 33.75], [-90.6, 34.2], [-90.0, 35.2], [-89.6, 36.6],
];
/** North-east Florida from 1864: Jacksonville (occupied for the fourth time in February 1864 and held), Fernandina and St Augustine. */
const NE_FLORIDA_1864: Pt[] = [[-81.75, 30.75], [-81.35, 30.75], [-81.15, 29.78], [-81.45, 29.75], [-81.7, 30.15], [-81.85, 30.4]];
/** Fort Myers, held from January 1864. */
const FORT_MYERS: Pt[] = box(-82.0, 26.5, -81.75, 26.75);
/** The mouth of Mobile Bay: Forts Gaines and Morgan, taken in August 1864. Source: "Battle of Mobile Bay". */
const MOBILE_BAY_1864: Pt[] = box(-88.35, 30.15, -87.7, 30.3);
/** 9 April 1865: the eastern shore of Mobile Bay, where Spanish Fort (8 April) and Fort Blakeley (9 April) fell, with Pensacola behind. Mobile itself held out until 12 April. Source: "Battle of Fort Blakeley". */
const MOBILE_BAY_1865: Pt[] = [[-88.35, 30.15], [-86.95, 30.2], [-86.95, 30.55], [-87.6, 30.8], [-87.9, 30.78], [-87.95, 30.4], [-88.1, 30.25]];

/**
 * One stop's zones: the Confederacy (pockets first, then the eleven states
 * less the Union-held ground), the rest of the seceded states as Union-held,
 * and the rest of the country.
 */
const stopZones = (unionHeld: Pt[][], { pockets = [] as Pt[][], label }: { pockets?: Pt[][]; label?: string } = {}): TourZone[] => [
  ...pockets.map((p) => held("confederacy", p, USA)),
  held("confederacy", CSA, USA, { minus: unionHeld, ...(label ? { label } : {}) }),
  held("union", CSA, USA, { occupied: true }),
  held("union", box(-180, 15, -60, 75), USA),
];


export const TOUR: Tour = {
  slug: "american-civil-war",
  title: "The American Civil War",
  description:
    "From the secession of the slave states and the guns at Fort Sumter to Gettysburg, Vicksburg, Sherman's march and Appomattox: four years of war that destroyed slavery in the United States and opened the struggle of Reconstruction.",
  duration: 9,
  difficulty: "standard",
  sides: SIDES,
  zoneYear: 1880,
  steps: [
    {
      title: "Secession and Fort Sumter",
      date: "December 1860 – April 1861",
      text: "The war was rooted in slavery. In November 1860 Abraham Lincoln, a Republican who opposed letting slavery spread into new territories, was elected president. Seeing their slave system under threat, South Carolina voted to leave the Union on 20 December, and six cotton states of the Deep South followed by February 1861, forming the Confederate States of America. Before dawn on 12 April 1861, Confederate batteries opened fire on Fort Sumter in Charleston harbour. After 34 hours its commander, Major Robert Anderson, agreed to leave; nobody died in the bombardment itself. Lincoln called for 75,000 volunteers, and four more slave states seceded, making eleven under President Jefferson Davis.",
      mapState: { year: 1861, mapYear: 1880, lat: 35.5, lng: -84, zoom: 3.9 },
      zones: stopZones([KEYS, FORT_MONROE], { label: "Confederate States" }),
      markers: [
        { label: "Fort Sumter, 12–13 April 1861", at: [-79.8747, 32.7522], kind: "battle" },
        { label: "Washington, D.C.", at: [-77.0164, 38.9047] },
        { label: "Richmond: Confederate capital", at: [-77.4367, 37.5408] },
      ],
      fact: "The bombardment itself killed nobody, but during the surrender ceremonies on 14 April a gun exploded, killing two US Army soldiers.",
      people: ["abraham-lincoln", "jefferson-davis"],
      readMore: ["/event/battle-of-fort-sumter", "/place/confederate-states-of-america", "/event/american-civil-war"],
    },
    {
      title: "First Bull Run: the war will be long",
      date: "21 July 1861",
      text: "The Northern public demanded a quick march on the Confederate capital, Richmond. Under that pressure, Brigadier General Irvin McDowell led an untested Union army out of Washington and, on 21 July 1861, attacked across the stream called Bull Run near Manassas Junction, Virginia. Each side committed only about 18,000 men. Confederate reinforcements under Joseph E. Johnston arrived by railroad from the Shenandoah Valley, a Virginian brigade under Thomas J. Jackson held firm and earned him the name 'Stonewall', and the Union withdrawal collapsed into a panicked flight towards Washington. The Union lost about 2,700 men and the Confederates nearly 2,000. Both sides now understood the war would not be short.",
      mapState: { year: 1861, mapYear: 1880, lat: 38.9, lng: -77.6, zoom: 6 },
      zones: stopZones([KEYS, FORT_MONROE, ARLINGTON]),
      markers: [
        { label: "First Bull Run (First Manassas), 21 July 1861", at: [-77.5225, 38.815], kind: "battle" },
        { label: "Washington, D.C.", at: [-77.0164, 38.9047] },
      ],
      routes: [
        { label: "McDowell's advance, July 1861", kind: "conquest", path: [[-77.03, 38.88], [-77.2, 38.85], [-77.31, 38.84], [-77.44, 38.82], [-77.5, 38.815]] },
        { label: "Johnston's troops arrive by rail", kind: "conquest", path: [[-78.16, 39.18], [-77.95, 39.0], [-77.75, 38.85], [-77.47, 38.75]] },
        { label: "The Union rout back to Washington", kind: "retreat", path: [[-77.5, 38.83], [-77.35, 38.86], [-77.2, 38.87], [-77.05, 38.89]] },
      ],
      fact: "Expecting an easy Union win, members of Washington's elite, congressmen and their families among them, came out to picnic and watch. Their carriages then blocked the roads as the beaten army fled.",
      readMore: ["/event/american-civil-war", "/history-of/washington-dc", "/place/confederate-states-of-america"],
    },
    {
      title: "The war in the West: Shiloh and New Orleans",
      date: "February – May 1862",
      text: "While the East stalled, the Union made lasting gains in the West. In February 1862 Ulysses S. Grant captured Forts Henry and Donelson, opening the Tennessee and Cumberland rivers, and Nashville fell. On 6–7 April a Confederate army under Albert Sidney Johnston surprised Grant beside the Tennessee River at Shiloh. Johnston was killed, and reinforced overnight, Grant drove the Confederates back the next morning. Nearly 24,000 men were killed, wounded or missing, making it the costliest battle of the war so far. Weeks later a Union fleet under David Farragut forced its way past the forts below New Orleans and took the largest city in the Confederacy, a heavy blow to its control of the Mississippi.",
      mapState: { year: 1862, mapYear: 1880, lat: 33, lng: -88.5, zoom: 4.8 },
      zones: stopZones([KEYS, ARLINGTON, EASTERN_SHORE, PENINSULA_MAY_1862, NORTHERN_VA_1862, NC_SOUNDS_1862, PORT_ROYAL, ST_SIMONS, FERNANDINA, ST_AUGUSTINE, PENSACOLA, LOWER_LOUISIANA_MAY_1862, TENNESSEE_MAY_1862, ARKANSAS_MAY_1862]),
      markers: [
        { label: "Fort Donelson, February 1862", at: [-87.8561, 36.4931], kind: "battle" },
        { label: "Shiloh, 6–7 April 1862", at: [-88.3422, 35.1386], kind: "battle" },
        { label: "New Orleans falls, April–May 1862", at: [-90.0631, 29.9575] },
      ],
      routes: [
        { label: "Grant's army moves up the Tennessee River", kind: "conquest", path: [[-87.86, 36.49], [-88.0, 36.45], [-88.05, 36.0], [-88.1, 35.6], [-88.25, 35.3], [-88.33, 35.15]] },
        { label: "Farragut's fleet runs past the forts", kind: "voyage", path: [[-88.9, 28.95], [-89.25, 29.2], [-89.45, 29.4], [-89.75, 29.65], [-90.06, 29.95]] },
      ],
      fact: "The battle is named after Shiloh Church, a log meeting house about 3 miles inland from Pittsburg Landing. Shiloh is a Hebrew word meaning 'place of peace'.",
      people: ["ulysses-s-grant"],
      readMore: ["/history-of/new-orleans", "/event/american-civil-war", "/place/united-states"],
    },
    {
      title: "Antietam and the Emancipation Proclamation",
      date: "September 1862 – January 1863",
      text: "In September 1862 Robert E. Lee carried the war north into Maryland. On 17 September George B. McClellan's Army of the Potomac attacked him along Antietam Creek near Sharpsburg. The fighting left 22,726 men dead, wounded or missing, the bloodiest single day in American history. Lee pulled back across the Potomac, and five days later Lincoln announced that emancipation would follow. On 1 January 1863 his Emancipation Proclamation declared free the people enslaved in the rebelling states, over 3.5 million of the country's 4 million, though not those in slave states loyal to the Union. Freedom now advanced with Union armies, and nearly 200,000 Black men, most formerly enslaved, served in the Union Army.",
      mapState: { year: 1862, mapYear: 1880, lat: 39.2, lng: -77.6, zoom: 6 },
      zones: stopZones([KEYS, EASTERN_SHORE, HAMPTON_ROADS_1862, NORTHERN_VA_1863, NC_SOUNDS_1862, PORT_ROYAL, FERNANDINA, ST_AUGUSTINE, PENSACOLA, LOWER_LOUISIANA_1863, TENNESSEE_JAN_1863, HELENA, NW_ARKANSAS_1863]),
      markers: [
        { label: "Antietam, 17 September 1862", at: [-77.7447, 39.4733], kind: "battle" },
        { label: "Washington, D.C.", at: [-77.0164, 38.9047] },
      ],
      routes: [
        { label: "Lee invades Maryland, September 1862", kind: "conquest", path: [[-77.6, 38.75], [-77.52, 39.05], [-77.45, 39.25], [-77.41, 39.41], [-77.6, 39.45], [-77.74, 39.46]] },
        { label: "Lee withdraws across the Potomac", kind: "retreat", path: [[-77.76, 39.46], [-77.8, 39.43], [-77.88, 39.35], [-77.98, 39.25]] },
      ],
      fact: "Four days before Antietam, a Union corporal at Frederick, Maryland, found a lost copy of Lee's campaign plans, Special Order 191, wrapped around three cigars. It revealed that Lee had divided his army.",
      people: ["robert-e-lee", "abraham-lincoln"],
      readMore: ["/event/battle-of-antietam", "/event/emancipation-proclamation", "/event/abolitionism-in-the-united-states"],
    },
    {
      title: "Gettysburg",
      date: "1–3 July 1863",
      text: "After beating the Union at Chancellorsville in May 1863, Lee marched up the Shenandoah Valley into Pennsylvania, his second invasion of the North. On the way his army seized between 40 and nearly 60 free Black civilians and sent them south into slavery. The armies collided at the crossroads town of Gettysburg on 1 July. For three days George Meade's Union army held its ground; on the last afternoon about 12,000 Confederates in Pickett's Charge were cut down attacking Cemetery Ridge. Between 46,000 and 51,000 men were killed, wounded, captured or missing. Lee retreated to Virginia. That November, Lincoln's 271-word Gettysburg Address, given at the new soldiers' cemetery, gave the war a new meaning.",
      mapState: { year: 1863, mapYear: 1880, lat: 39.3, lng: -77.8, zoom: 5.6 },
      zones: stopZones([KEYS, EASTERN_SHORE, HAMPTON_ROADS_1862, FAIRFAX, NC_SOUNDS_1862, PORT_ROYAL, CHARLESTON_ISLANDS, FERNANDINA, ST_AUGUSTINE, PENSACOLA, LOWER_LOUISIANA_JULY_1863, TENNESSEE_JULY_1863, VICKSBURG_1863, HELENA], { pockets: [VICKSBURG_POCKET, PORT_HUDSON_POCKET] }),
      markers: [
        { label: "Gettysburg, 1–3 July 1863", at: [-77.2258, 39.8114], kind: "battle" },
      ],
      routes: [
        { label: "Lee's invasion of the North, June 1863", kind: "conquest", path: [[-77.46, 38.3], [-78.0, 38.47], [-78.16, 39.18], [-77.75, 39.6], [-77.66, 39.94], [-77.23, 39.81]] },
        { label: "Lee's retreat, July 1863", kind: "retreat", path: [[-77.25, 39.82], [-77.45, 39.85], [-77.72, 39.75], [-77.82, 39.6], [-77.95, 39.4]] },
      ],
      fact: "Only one civilian was killed directly by the fighting: Jennie Wade, aged 20, struck by a stray bullet on 3 July while kneading dough for bread in her sister's house.",
      people: ["robert-e-lee", "abraham-lincoln"],
      readMore: ["/event/battle-of-gettysburg", "/event/american-civil-war"],
    },
    {
      title: "Vicksburg: the Mississippi cut",
      date: "May – July 1863",
      text: "In the West, Grant took on the river fortress of Vicksburg, the last great Confederate stronghold on the Mississippi. In spring 1863 he crossed the river south of the city at Bruinsburg, struck inland to win at Port Gibson and Raymond, took Jackson, the state capital, on 14 May, and then turned west, beating John C. Pemberton's army at Champion Hill. Two assaults on Vicksburg's defences failed, so Grant laid siege. With food almost gone, Pemberton surrendered on 4 July, the day after Gettysburg ended, and about 29,500 Confederates gave themselves up. Port Hudson fell five days later. The Union held the whole river, and the Confederacy was split in two.",
      mapState: { year: 1863, mapYear: 1880, lat: 32.2, lng: -90.6, zoom: 6 },
      zones: stopZones([KEYS, EASTERN_SHORE, HAMPTON_ROADS_1862, FAIRFAX, NC_SOUNDS_1862, PORT_ROYAL, CHARLESTON_ISLANDS, FERNANDINA, ST_AUGUSTINE, PENSACOLA, LOWER_LOUISIANA_JULY_1863, TENNESSEE_JULY_1863, VICKSBURG_1863, MISSISSIPPI_RIVER]),
      markers: [
        { label: "Vicksburg surrenders, 4 July 1863", at: [-90.8511, 32.3436], kind: "battle" },
      ],
      routes: [
        { label: "Grant's Vicksburg campaign, April–May 1863", kind: "conquest", path: [[-91.07, 32.45], [-91.2, 32.15], [-91.13, 31.96], [-90.98, 31.96], [-90.42, 32.26], [-90.18, 32.3], [-90.53, 32.32], [-90.83, 32.35]] },
      ],
      fact: "Union gunboats fired over 22,000 shells into Vicksburg during the siege. Residents dug more than 500 caves into the town's yellow clay hills and furnished them with rugs, furniture and pictures.",
      people: ["ulysses-s-grant"],
      readMore: ["/event/american-civil-war", "/place/confederate-states-of-america", "/place/united-states"],
    },
    {
      title: "Atlanta and the March to the Sea",
      date: "May – December 1864",
      text: "Grant, now commanding all Union armies, pressed the Confederacy on several fronts at once. From Chattanooga, William T. Sherman pushed into Georgia in May 1864, and Atlanta fell on 2 September, a boost that helped Lincoln win re-election. On 15 November Sherman left Atlanta with about 62,000 men and cut loose from his supply lines. His columns lived off the land and wrecked railways, factories, farms and homes in a band across Georgia, a 'hard war' aimed at the South's economy and transport. Many enslaved people followed the columns to freedom; hundreds drowned at Ebenezer Creek trying to keep up. Sherman took Savannah on 21 December and offered it to Lincoln as a Christmas gift.",
      mapState: { year: 1864, mapYear: 1880, lat: 33.4, lng: -83.3, zoom: 5.3 },
      zones: stopZones([KEYS, EASTERN_SHORE, PETERSBURG_1864, FAIRFAX, LOWER_VALLEY_1864, NC_SOUNDS_1864, PORT_ROYAL, CHARLESTON_ISLANDS, SHERMAN_1864, NE_FLORIDA_1864, FORT_MYERS, PENSACOLA, MOBILE_BAY_1864, LOWER_LOUISIANA_1863, MISSISSIPPI_RIVER, VICKSBURG_1863, TENNESSEE_DEC_1864, ARKANSAS_1864]),
      markers: [
        { label: "Chattanooga", at: [-85.2484, 35.066] },
        { label: "Atlanta falls, 2 September 1864", at: [-84.388, 33.749], kind: "battle" },
        { label: "Savannah taken, 21 December 1864", at: [-81.0911, 32.0811] },
      ],
      routes: [
        { label: "The Atlanta campaign, May–September 1864", kind: "conquest", path: [[-85.25, 35.05], [-84.97, 34.77], [-84.94, 34.58], [-84.75, 34.2], [-84.58, 33.98], [-84.39, 33.76]] },
        { label: "The March to the Sea, November–December 1864", kind: "conquest", path: [[-84.36, 33.73], [-83.7, 33.4], [-83.23, 33.08], [-82.5, 32.9], [-81.95, 32.8], [-81.4, 32.4], [-81.1, 32.09]] },
      ],
      fact: "Sherman's troops heated railway rails over fires and twisted them around tree trunks so they could not be relaid. The ruined rails became known as 'Sherman's neckties'.",
      people: ["ulysses-s-grant", "abraham-lincoln"],
      readMore: ["/event/shermans-march-to-the-sea", "/event/american-civil-war"],
    },
    {
      title: "Appomattox",
      date: "April 1865",
      text: "Around Petersburg and Richmond, Grant had kept Lee's army in trenches for nine and a half months. When his last supply railways were cut, Lee abandoned both cities on the night of 2–3 April 1865 and fled west, hoping to join Confederate forces in North Carolina. Union cavalry under Philip Sheridan raced ahead; at Sailor's Creek on 6 April nearly a quarter of Lee's army was cut off. On 9 April, blocked at Appomattox Court House, Lee surrendered to Grant in the parlour of Wilmer McLean's house. About 28,000 Confederates were paroled and sent home. Other Confederate forces gave up over the following weeks; the last military department disbanded on 26 May.",
      mapState: { year: 1865, mapYear: 1880, lat: 37.35, lng: -78, zoom: 6 },
      zones: stopZones([KEYS, VIRGINIA_APRIL_1865, CAROLINAS_APRIL_1865, PORT_ROYAL, SHERMAN_1864, NE_FLORIDA_1864, FORT_MYERS, PENSACOLA, MOBILE_BAY_1865, LOWER_LOUISIANA_1863, MISSISSIPPI_RIVER, VICKSBURG_1863, TENNESSEE_1865, ARKANSAS_1864]),
      markers: [
        { label: "Siege of Petersburg, 1864–1865", at: [-77.3778, 37.2183], kind: "battle" },
        { label: "Richmond abandoned, 2–3 April 1865", at: [-77.4367, 37.5408] },
        { label: "Appomattox Court House: Lee surrenders, 9 April 1865", at: [-78.7961, 37.3775], kind: "battle" },
      ],
      routes: [
        { label: "Lee's retreat, April 1865", kind: "retreat", path: [[-77.42, 37.4], [-77.75, 37.36], [-77.98, 37.34], [-78.2, 37.3], [-78.39, 37.3], [-78.79, 37.38]] },
        { label: "Union pursuit and the cut-off", kind: "conquest", path: [[-77.4, 37.2], [-77.8, 37.2], [-78.2, 37.19], [-78.5, 37.28], [-78.83, 37.36]] },
      ],
      fact: "Wilmer McLean had moved to Appomattox to get away from the war. The first clash of First Bull Run in 1861 had been fought on his farm near Manassas.",
      people: ["robert-e-lee", "ulysses-s-grant"],
      readMore: ["/event/american-civil-war", "/place/confederate-states-of-america", "/country/united-states"],
    },
    {
      title: "Lincoln's death and the start of Reconstruction",
      date: "April – December 1865",
      text: "On 14 April 1865 the actor and Confederate sympathiser John Wilkes Booth shot Lincoln at Ford's Theatre in Washington; he died the next morning. The war's dead are usually put at about 620,000 soldiers, but a 2011 study of census data estimated around 750,000, and possibly 850,000, before counting civilians and the many freed people who died of disease. The Thirteenth Amendment, ratified in December 1865, ended slavery except as punishment for crime, freeing four million people. The Freedmen's Bureau gave food and shelter to freed people, but President Andrew Johnson let Southern states pass Black Codes restricting their rights. The fight over equal citizenship, and the violence of groups like the Ku Klux Klan, had only begun.",
      mapState: { year: 1865, mapYear: 1880, lat: 35.5, lng: -84, zoom: 3.9 },
      zones: [held("union", CSA, USA, { occupied: true }), held("union", box(-180, 15, -60, 75), USA)],
      markers: [{ label: "Ford's Theatre: Lincoln shot, 14 April 1865", at: [-77.0258, 38.8967] }],
      fact: "In late 1863 or early 1864, the assassin's brother Edwin Booth, a celebrated Shakespearean actor, saved Lincoln's son Robert from serious injury on a railway platform in Jersey City.",
      people: ["abraham-lincoln"],
      readMore: ["/event/assassination-of-abraham-lincoln", "/event/reconstruction-era", "/history-of/washington-dc"],
    },
  ],
};
