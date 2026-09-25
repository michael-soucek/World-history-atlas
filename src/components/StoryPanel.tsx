"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ReadAloudButton } from "./ReadAloudButton";
import { useAtlasStore } from "@/store/atlasStore";
import { formatYear } from "@/data/snapshotYears";
import type { PlaceContent } from "@/types";

// ── Story panel component ──────────────────────────────────────────────────

export default function StoryPanel() {
  const { selectedWikidataId, selectedName, selectedSovereign, year, clearSelection } =
    useAtlasStore();

  const [content, setContent] = useState<PlaceContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const isOpen = Boolean(selectedWikidataId || selectedName);

  const close = useCallback(() => {
    clearSelection();
    setContent(null);
  }, [clearSelection]);

  // Fetch content whenever selection changes. While closed the component
  // returns null below, so there's nothing to reset here — the next real
  // selection's branch below replaces `content`/`error` itself.
  useEffect(() => {
    if (!isOpen) return;

    if (!selectedWikidataId) {
      // No crosswalk entry — name-only fallback. `content` doesn't need
      // resetting: `effectiveContent` below already nulls it out whenever
      // there's no wikidataId, so a stale previous selection's content never
      // renders. `loading` does need correcting if a previous selection's
      // fetch was still in flight — deferred one tick (a real callback, not
      // a synchronous effect-body setState) rather than left stuck on.
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    let cancelled = false;
    // Kicking off a fetch's loading state is the canonical case this effect
    // exists for — there's no callback to defer into before the fetch itself
    // starts, and delaying it would just show stale content a tick longer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(false);

    fetch(`/api/place/${selectedWikidataId}`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json() as Promise<PlaceContent>;
      })
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedWikidataId, isOpen]);

  if (!isOpen) return null;

  // Null out a stale previous selection's content once there's no crosswalk
  // entry for the current one, instead of resetting `content` state itself.
  const effectiveContent = selectedWikidataId ? content : null;

  const displayName = effectiveContent?.name ?? selectedName ?? "Unknown Territory";
  const searchQuery = encodeURIComponent(displayName);
  const wikiSearchUrl = `https://en.wikipedia.org/w/index.php?search=${searchQuery}`;

  return (
    <aside
      className="
        absolute bottom-0 left-0 right-0 z-20
        max-h-[60vh] sm:max-h-full
        sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:w-90
        bg-neutral-950/95 backdrop-blur-md
        border-t sm:border-t-0 sm:border-l border-white/10
        flex flex-col overflow-hidden
        animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
      aria-label="Region information panel"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 border-b border-white/10">
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-xl font-bold leading-tight truncate">
            {displayName}
          </h2>
          <p className="text-white/50 text-sm mt-0.5">
            {formatYear(year)}
            {selectedSovereign && selectedSovereign !== displayName && (
              <> · <span className="text-white/40">{selectedSovereign}</span></>
            )}
          </p>
        </div>
        <button
          onClick={close}
          aria-label="Close panel"
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            text-white/50 hover:text-white hover:bg-white/10 transition-colors text-lg"
        >
          ×
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {loading && <PanelSkeleton />}

        {!loading && error && (
          <div className="p-5 text-white/50 text-sm">
            <p>Could not load content for this region.</p>
            <a
              href={wikiSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-amber-400 hover:text-amber-300 underline"
            >
              Search Wikipedia for &ldquo;{displayName}&rdquo; →
            </a>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Year discrepancy warning */}
            {effectiveContent?.representativeYear && Math.abs(effectiveContent.representativeYear - year) > 50 && (
              <div className="mx-5 mt-4 p-3 bg-ancient-wash border border-ancient/20 rounded-lg">
                <p className="text-ink-2 text-xs leading-relaxed">
                  This entity is best viewed around <span className="font-bold">{formatYear(effectiveContent.representativeYear)}</span>.
                </p>
                <button
                  onClick={() => useAtlasStore.getState().setYear(effectiveContent.representativeYear!)}
                  className="mt-2 text-ancient font-semibold text-xs hover:underline decoration-ancient/30"
                >
                  Jump to {formatYear(effectiveContent.representativeYear)} →
                </button>
              </div>
            )}

            {/* Image */}
            {effectiveContent?.imageUrl && (
              <div className="relative">
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={effectiveContent.imageUrl}
                    alt={`Image related to ${displayName}`}
                    fill
                    className="object-contain bg-surface"
                    unoptimized // Wikimedia images vary wildly; skip Next.js optimisation
                  />
                </div>
                {/* Attribution — required */}
                <div className="px-3 py-1.5 bg-black/60 text-[10px] text-white/50 leading-snug">
                  {effectiveContent.imageAuthor && (
                    <span>{effectiveContent.imageAuthor} · </span>
                  )}
                  {effectiveContent.imageLicense && (
                    <span>{effectiveContent.imageLicense} · </span>
                  )}
                  {effectiveContent.imageSourceUrl && (
                    <a
                      href={effectiveContent.imageSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white/80"
                    >
                      Wikimedia Commons
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="p-5">
              {effectiveContent?.summary ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <ReadAloudButton text={effectiveContent.summary} />
                    <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Listen</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {effectiveContent.summary}
                  </p>
                </>
              ) : (
                <p className="text-white/40 text-sm italic">
                  No summary available.
                </p>
              )}

              {/* No crosswalk — show graceful fallback search link */}
              {!selectedWikidataId && (
                <a
                  href={wikiSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
                >
                  Search Wikipedia for &ldquo;{displayName}&rdquo; →
                </a>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer links */}
      <div className="border-t border-white/10 p-4 flex flex-wrap gap-2">
        {effectiveContent?.wikidataId && (
          <a
            href={`/place/${effectiveContent.wikidataId}`}
            className="flex-1 text-center rounded-lg px-3 py-2 text-sm font-medium
              bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            Full place page
          </a>
        )}
        {effectiveContent?.wikipediaUrl && (
          <a
            href={effectiveContent.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-lg px-3 py-2 text-sm font-medium
              bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            Wikipedia →
          </a>
        )}
        {!selectedWikidataId && (
          <a
            href={wikiSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-lg px-3 py-2 text-sm font-medium
              bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
          >
            Search Wikipedia →
          </a>
        )}
      </div>
    </aside>
  );
}

// ── Skeleton loading state ─────────────────────────────────────────────────

function PanelSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full bg-white/10" style={{ aspectRatio: "16/9" }} />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-5/6" />
        <div className="h-3 bg-white/10 rounded w-4/6" />
      </div>
    </div>
  );
}
