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
        bg-parchment/97 backdrop-blur-md text-ink shadow-[-12px_0_40px_rgba(11,20,36,0.25)]
        border-t sm:border-t-0 sm:border-l border-ink/10
        flex flex-col overflow-hidden
        animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
      aria-label="Region information panel"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-ink/10">
        <div className="flex-1 min-w-0">
          <p className="label text-accent mb-2">On the map</p>
          <h2 className="font-display text-[28px] leading-[1.05] tracking-tight text-ink">
            {displayName}
          </h2>
          <p className="font-mono text-[11px] tracking-wide text-ink/50 mt-2">
            {formatYear(year)}
            {selectedSovereign && selectedSovereign !== displayName && (
              <> · <span className="text-ink/40">{selectedSovereign}</span></>
            )}
          </p>
        </div>
        <button
          onClick={close}
          aria-label="Close panel"
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            text-ink/50 hover:text-ink hover:bg-ink/8 border border-ink/10 transition-colors text-lg"
        >
          ×
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {loading && <PanelSkeleton />}

        {!loading && error && (
          <div className="p-5 text-ink/55 text-sm">
            <p>Could not load content for this region.</p>
            <a
              href={wikiSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-accent hover:text-ink underline"
            >
              Search Wikipedia for &ldquo;{displayName}&rdquo; →
            </a>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Year discrepancy warning */}
            {effectiveContent?.representativeYear && Math.abs(effectiveContent.representativeYear - year) > 50 && (
              <div className="mx-5 mt-4 p-3 bg-accent-wash border border-accent/20 rounded-md">
                <p className="text-ink-2 text-xs leading-relaxed">
                  This entity is best viewed around <span className="font-bold">{formatYear(effectiveContent.representativeYear)}</span>.
                </p>
                <button
                  onClick={() => useAtlasStore.getState().setYear(effectiveContent.representativeYear!)}
                  className="mt-2 text-accent font-semibold text-xs hover:underline decoration-accent/30"
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
                <div className="px-5 sm:px-6 py-2 text-[10px] text-ink/40 leading-snug">
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
                      className="underline hover:text-ink/70"
                    >
                      Wikimedia Commons
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="p-5 sm:p-6">
              {effectiveContent?.summary ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <ReadAloudButton text={effectiveContent.summary} />
                                      </div>
                  <p className="font-text text-ink/85 text-[16px] leading-[1.65]">
                    {effectiveContent.summary}
                  </p>
                </>
              ) : !selectedWikidataId ? (
                <div className="space-y-4">
                  <p className="font-text text-ink/80 text-[16px] leading-[1.65]">
                    {displayName === "Unknown"
                      ? "The source maps have no record of who held this land in this year, so it is left unnamed rather than guessed."
                      : <>The source map names this territory <span className="italic">{displayName}</span> in {formatYear(year)}, but it doesn&rsquo;t have its own page in the atlas yet.</>}
                  </p>
                  {selectedSovereign && selectedSovereign !== displayName && selectedSovereign !== "Unknown" && (
                    <p className="text-sm text-ink/60">Part of: <span className="text-ink">{selectedSovereign}</span></p>
                  )}
                  <p className="text-sm text-ink/55 leading-relaxed">
                    Try another year with the slider, or browse the{" "}
                    <a href="/browse?type=place" className="text-accent underline underline-offset-2 hover:text-ink">places that do have pages</a>.
                  </p>
                </div>
              ) : (
                <p className="text-ink/45 text-sm italic">
                  No summary available.
                </p>
              )}

            </div>
          </>
        )}
      </div>

      {/* Footer links */}
      <div className="border-t border-ink/10 p-4 sm:px-6 flex flex-wrap gap-2 empty:hidden">
        {effectiveContent?.wikidataId && (
          <a
            href={`/place/${effectiveContent.wikidataId}`}
            className="flex-1 text-center rounded-md px-3 py-2.5 text-sm font-semibold
              bg-ink text-parchment hover:bg-accent transition-colors"
          >
            Read the full page
          </a>
        )}
        {effectiveContent?.wikipediaUrl && (
          <a
            href={effectiveContent.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-md px-3 py-2.5 text-sm font-medium
              border border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink transition-colors"
          >
            Wikipedia →
          </a>
        )}
        {!selectedWikidataId && displayName !== "Unknown" && (
          <a
            href={wikiSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-md px-3 py-2 text-sm font-medium
              bg-ink text-parchment hover:bg-accent transition-colors"
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
      <div className="w-full bg-ink/8" style={{ aspectRatio: "16/9" }} />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-ink/8 rounded w-full" />
        <div className="h-3 bg-ink/8 rounded w-5/6" />
        <div className="h-3 bg-ink/8 rounded w-4/6" />
      </div>
    </div>
  );
}
