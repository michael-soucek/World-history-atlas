"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  // No motion preference is knowable on the server — assume motion is fine
  // and let the client snapshot correct it after hydration, same as any
  // other client-only capability check.
  return false;
}

/**
 * SSR-safe `(prefers-reduced-motion: reduce)` check, shared by
 * `HandwrittenTitle` and `TimelineEraArt` (previously duplicated in both as
 * a `useEffect` + `setState`, which reads correctly but is exactly the
 * "you don't need an effect" case react-hooks/set-state-in-effect flags —
 * `useSyncExternalStore` is the primitive actually meant for subscribing to
 * external state like this).
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
