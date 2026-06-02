export type ChangePointSourceType =
  | "wikidata-p571"
  | "wikidata-p576"
  | "openhistoricalmap"
  | "documented-event";

export interface DatedChangePoint {
  year: number;
  label: string;
  sourceType: ChangePointSourceType;
  sourceRef: string;
}

// These are additional globally-relevant dated change points used to split
// coarse snapshot ranges into finer, sourced state intervals.
// They do not invent intermediate geometry; geometry is still fetched from the
// latest available basemap snapshot <= selected year.
export const DATED_CHANGE_POINTS: DatedChangePoint[] = [
  {
    year: 1648,
    label: "Peace of Westphalia",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Peace_of_Westphalia",
  },
  {
    year: 1713,
    label: "Treaty of Utrecht",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Treaty_of_Utrecht",
  },
  {
    year: 1776,
    label: "United States Declaration of Independence",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/United_States_Declaration_of_Independence",
  },
  {
    year: 1789,
    label: "French Revolution begins",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/French_Revolution",
  },
  {
    year: 1830,
    label: "Belgian Revolution",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Belgian_Revolution",
  },
  {
    year: 1848,
    label: "Revolutions of 1848",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Revolutions_of_1848",
  },
  {
    year: 1861,
    label: "Kingdom of Italy proclaimed",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Kingdom_of_Italy",
  },
  {
    year: 1867,
    label: "Confederation in Canada",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Canadian_Confederation",
  },
  {
    year: 1871,
    label: "German Empire proclaimed",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/German_Empire",
  },
  {
    year: 1917,
    label: "Russian Revolution",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Russian_Revolution",
  },
  {
    year: 1918,
    label: "World War I armistice",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Armistice_of_11_November_1918",
  },
  {
    year: 1919,
    label: "Treaty of Versailles",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Treaty_of_Versailles",
  },
  {
    year: 1947,
    label: "Partition of India",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Partition_of_India",
  },
  {
    year: 1948,
    label: "Independence of Burma and Ceylon",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/1948",
  },
  {
    year: 1949,
    label: "Founding of the PRC",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/History_of_the_People%27s_Republic_of_China",
  },
  {
    year: 1954,
    label: "Geneva Accords",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/1954_Geneva_Conference",
  },
  {
    year: 1956,
    label: "Sudan, Morocco, and Tunisia independence year",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/1956",
  },
  {
    year: 1965,
    label: "Independence year across parts of Africa",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/1965",
  },
  {
    year: 1971,
    label: "Bangladesh Liberation",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Bangladesh_Liberation_War",
  },
  {
    year: 1989,
    label: "Eastern Bloc revolutions",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Revolutions_of_1989",
  },
  {
    year: 1991,
    label: "Dissolution of the Soviet Union",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Dissolution_of_the_Soviet_Union",
  },
  {
    year: 1993,
    label: "Velvet Divorce",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/Dissolution_of_Czechoslovakia",
  },
  {
    year: 2008,
    label: "Kosovo declaration of independence",
    sourceType: "documented-event",
    sourceRef: "https://en.wikipedia.org/wiki/2008_Kosovo_declaration_of_independence",
  },
];
