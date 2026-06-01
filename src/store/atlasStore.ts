"use client";

import { create } from "zustand";
import type { AtlasViewState } from "@/types";
import { DEFAULT_YEAR, SNAPSHOT_YEARS, MIN_YEAR } from "@/data/snapshotYears";

/** Find the latest snapshot year that is <= the requested year. */
function resolveSnapshotYear(year: number, years: number[]): number {
  let result = years[0] ?? MIN_YEAR;
  for (const sy of years) {
    if (sy <= year) result = sy;
    else break;
  }
  return result;
}

interface AtlasStore extends AtlasViewState {
  // Derived
  snapshotYear: number;
  // Live snapshot year list (starts as hardcoded fallback, updated from manifest)
  snapshotYears: number[];
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
  setSnapshotYears: (years: number[]) => void;
}

export const useAtlasStore = create<AtlasStore>((set, get) => ({
  // Initial state
  year: DEFAULT_YEAR,
  snapshotYear: resolveSnapshotYear(DEFAULT_YEAR, SNAPSHOT_YEARS),
  snapshotYears: SNAPSHOT_YEARS,
  manifestLoaded: false,
  lat: 20,
  lng: 10,
  zoom: 2,
  selectedWikidataId: undefined,
  selectedName: undefined,
  selectedSovereign: undefined,

  setYear: (year) =>
    set((state) => ({
      year,
      snapshotYear: resolveSnapshotYear(year, state.snapshotYears),
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
    const year = params.year ?? DEFAULT_YEAR;
    const { snapshotYears } = get();
    set({
      year,
      snapshotYear: resolveSnapshotYear(year, snapshotYears),
      lat: params.lat ?? 20,
      lng: params.lng ?? 10,
      zoom: params.zoom ?? 2,
      selectedWikidataId: params.selectedWikidataId,
    });
  },

  setSnapshotYears: (years) => {
    const sorted = [...years].sort((a, b) => a - b);
    set((state) => ({
      snapshotYears: sorted,
      manifestLoaded: true,
      snapshotYear: resolveSnapshotYear(state.year, sorted),
    }));
  },
}));
