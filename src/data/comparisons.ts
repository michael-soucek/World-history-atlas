import type { CompareView } from "@/components/CompareMap";

/** Ready-made "then vs. then" pairs for the /compare page, each with a camera. */
export interface Comparison {
  slug: string;
  label: string;
  left: number;
  right: number;
  view: CompareView;
}

export const COMPARISONS: Comparison[] = [
  { slug: "alexander", label: "Alexander's empire splits", left: -323, right: -300, view: { lat: 33, lng: 45, zoom: 3 } },
  { slug: "rome-falls", label: "Rome, before and after the fall", left: 100, right: 500, view: { lat: 42, lng: 15, zoom: 3.3 } },
  { slug: "rome-today", label: "The Roman Empire vs. today", left: 100, right: 2010, view: { lat: 42, lng: 15, zoom: 3.3 } },
  { slug: "mongols", label: "The Mongol conquests", left: 1200, right: 1279, view: { lat: 42, lng: 80, zoom: 2.3 } },
  { slug: "americas", label: "Europe reaches the Americas", left: 1492, right: 1600, view: { lat: 10, lng: -75, zoom: 2.3 } },
  { slug: "napoleon", label: "Europe before and after Napoleon", left: 1783, right: 1815, view: { lat: 50, lng: 12, zoom: 3.6 } },
  { slug: "scramble-for-africa", label: "The Scramble for Africa", left: 1880, right: 1914, view: { lat: 3, lng: 18, zoom: 2.8 } },
  { slug: "world-war-one", label: "Europe before and after World War I", left: 1914, right: 1920, view: { lat: 50, lng: 18, zoom: 3.6 } },
  { slug: "world-war-two", label: "Europe before and after World War II", left: 1938, right: 1945, view: { lat: 50, lng: 18, zoom: 3.6 } },
  { slug: "decolonisation", label: "Decolonisation, 1938 to 1994", left: 1938, right: 1994, view: { lat: 10, lng: 40, zoom: 1.8 } },
  { slug: "ussr", label: "The fall of the Soviet Union", left: 1985, right: 1994, view: { lat: 52, lng: 50, zoom: 2.6 } },
];

export const DEFAULT_COMPARISON = COMPARISONS.find((c) => c.slug === "world-war-one")!;
