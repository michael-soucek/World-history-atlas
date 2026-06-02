"use client";

import { useEffect } from "react";
import { useAtlasStore } from "@/store/atlasStore";

interface ManifestData {
  snapshots?: Array<{ snapshotYear: number }>;
  snapshotYears?: number[];
  stateYears?: number[];
  states?: Array<{ stateYear: number }>;
}

/**
 * Fetches the year manifest from /api/manifest on the client and updates
 * the Zustand store with the live snapshot year list.
 * Call this once in a top-level client component.
 */
export function useManifest(): void {
  const manifestLoaded = useAtlasStore((s) => s.manifestLoaded);
  const setSnapshotYears = useAtlasStore((s) => s.setSnapshotYears);

  useEffect(() => {
    if (manifestLoaded) return;

    fetch("/api/manifest")
      .then((r) => r.json())
      .then((data: ManifestData) => {
        const snapshotYears =
          data.snapshotYears && data.snapshotYears.length > 0
            ? data.snapshotYears
            : (data.snapshots ?? []).map((s) => s.snapshotYear);

        if (snapshotYears.length > 0) {
          const stateYears =
            data.stateYears && data.stateYears.length > 0
              ? data.stateYears
              : (data.states ?? []).map((s) => s.stateYear);
          setSnapshotYears(snapshotYears, stateYears);
        }
      })
      .catch((err) =>
        console.warn("[useManifest] failed to load manifest:", err)
      );
  }, [manifestLoaded, setSnapshotYears]);
}
