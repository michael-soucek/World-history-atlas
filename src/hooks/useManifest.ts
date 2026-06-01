"use client";

import { useEffect } from "react";
import { useAtlasStore } from "@/store/atlasStore";

interface ManifestData {
  snapshotYears?: number[];
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
        if (data.snapshotYears && data.snapshotYears.length > 0) {
          setSnapshotYears(data.snapshotYears);
        }
      })
      .catch((err) =>
        console.warn("[useManifest] failed to load manifest:", err)
      );
  }, [manifestLoaded, setSnapshotYears]);
}
