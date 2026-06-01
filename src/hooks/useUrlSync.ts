"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAtlasStore } from "@/store/atlasStore";

/**
 * Keeps ?year=&lat=&lng=&z=&region= in sync with the Zustand store.
 * Uses replaceState so the back button isn't polluted every frame.
 */
export function useUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { year, lat, lng, zoom, selectedWikidataId } = useAtlasStore();
  const lastParams = useRef("");

  useEffect(() => {
    const params = new URLSearchParams({
      year: String(year),
      lat: lat.toFixed(4),
      lng: lng.toFixed(4),
      z: zoom.toFixed(2),
      ...(selectedWikidataId ? { region: selectedWikidataId } : {}),
    });
    const paramStr = params.toString();
    if (paramStr === lastParams.current) return;
    lastParams.current = paramStr;
    // Replace without pushing to history stack (smooth UX while scrubbing)
    router.replace(`${pathname}?${paramStr}`, { scroll: false });
  }, [year, lat, lng, zoom, selectedWikidataId, router, pathname, searchParams]);
}
