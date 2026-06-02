"use client";

import { create } from "zustand";
import type { AtlasViewState } from "@/types";
import { clampYear, DEFAULT_YEAR, SNAPSHOT_YEARS, MIN_YEAR } from "@/data/snapshotYears";

/** Find the latest snapshot year that is <= the requested year. */
function resolveSnapshotYear(year: number, years: number[]): number {
  const firstUsable = years.find((y) => y >= MIN_YEAR) ?? years[0] ?? MIN_YEAR;
  let result = firstUsable;
  for (const sy of years) {
    if (sy < firstUsable) continue;
    if (sy <= year) result = sy;
    else break;
  }
  return result;
}

interface AtlasStore extends AtlasViewState {
  // Derived
  snapshotYear: number;
  stateYear: number;
  // Live snapshot year list (starts as hardcoded fallback, updated from manifest)
  snapshotYears: number[];
  // Densified change-point years that define state boundaries
  stateChangeYears: number[];
  manifestLoaded: boolean;

  // Actions
  setYear: (year: number) => void;
  setView: (lat: number, lng: number, zoom: number) => void;
  selectRegion: (opts: {
    wikidataId?: string;
    name?: string;
    sovereign?: string;
  }) => void;
  clearSelection: () => void;
  syncFromUrl: (params: Partial<AtlasViewState>) => void;
  setSnapshotYears: (years: number[], stateChangeYears?: number[]) => void;
}

export const useAtlasStore = create<AtlasStore>((set, get) => ({
  // Initial state
  year: DEFAULT_YEAR,
  snapshotYear: resolveSnapshotYear(DEFAULT_YEAR, SNAPSHOT_YEARS),
  stateYear: resolveSnapshotYear(DEFAULT_YEAR, SNAPSHOT_YEARS),
  snapshotYears: SNAPSHOT_YEARS,
  stateChangeYears: SNAPSHOT_YEARS,
  manifestLoaded: false,
  lat: 20,
  lng: 10,
  zoom: 2,
  selectedWikidataId: undefined,
  selectedName: undefined,
  selectedSovereign: undefined,

  setYear: (year) =>
    set((state) => ({
      year: clampYear(year),
      snapshotYear: resolveSnapshotYear(clampYear(year), state.snapshotYears),
      stateYear: resolveSnapshotYear(clampYear(year), state.stateChangeYears),
    })),

  setView: (lat, lng, zoom) => set({ lat, lng, zoom }),

  selectRegion: ({ wikidataId, name, sovereign }) =>
    set({
      selectedWikidataId: wikidataId,
      selectedName: name,
      selectedSovereign: sovereign,
    }),

  clearSelection: () =>
    set({
      selectedWikidataId: undefined,
      selectedName: undefined,
      selectedSovereign: undefined,
    }),

  syncFromUrl: (params) => {
    const year = clampYear(params.year ?? DEFAULT_YEAR);
    const { snapshotYears, stateChangeYears } = get();
    set({
      year,
      snapshotYear: resolveSnapshotYear(year, snapshotYears),
      stateYear: resolveSnapshotYear(year, stateChangeYears),
      lat: params.lat ?? 20,
      lng: params.lng ?? 10,
      zoom: params.zoom ?? 2,
      selectedWikidataId: params.selectedWikidataId,
    });
  },

  setSnapshotYears: (years, stateChangeYears) => {
    const sorted = [...years].sort((a, b) => a - b);
    const sortedStateYears = (stateChangeYears && stateChangeYears.length > 0
      ? [...stateChangeYears]
      : [...sorted]
    ).sort((a, b) => a - b);

    set((state) => ({
      snapshotYears: sorted,
      stateChangeYears: sortedStateYears,
      manifestLoaded: true,
      year: clampYear(state.year),
      snapshotYear: resolveSnapshotYear(clampYear(state.year), sorted),
      stateYear: resolveSnapshotYear(clampYear(state.year), sortedStateYears),
    }));
  },
}));
