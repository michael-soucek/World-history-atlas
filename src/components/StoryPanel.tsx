"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
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

  // Fetch content whenever selection changes
  useEffect(() => {
    if (!isOpen) {
      setContent(null);
      setError(false);
      return;
    }

    if (!selectedWikidataId) {
      // No crosswalk entry — show name-only fallback
      setContent(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
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

  const displayName = content?.name ?? selectedName ?? "Unknown Territory";
  const searchQuery = encodeURIComponent(displayName);
  const wikiSearchUrl = `https://en.wikipedia.org/w/index.php?search=${searchQuery}`;

  return (
    <aside
      className="absolute top-0 right-0 bottom-0 z-20 w-[360px] max-w-full
        bg-neutral-950/95 backdrop-blur-md border-l border-white/10
        flex flex-col overflow-hidden
        animate-in slide-in-from-right duration-300"
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
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
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
            {/* Image */}
            {content?.imageUrl && (
              <div className="relative">
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={content.imageUrl}
                    alt={`Image related to ${displayName}`}
                    fill
                    className="object-cover"
                    unoptimized // Wikimedia images vary wildly; skip Next.js optimisation
                  />
                </div>
                {/* Attribution — required */}
                <div className="px-3 py-1.5 bg-black/60 text-[10px] text-white/50 leading-snug">
                  {content.imageAuthor && (
                    <span>{content.imageAuthor} · </span>
                  )}
                  {content.imageLicense && (
                    <span>{content.imageLicense} · </span>
                  )}
                  {content.imageSourceUrl && (
                    <a
                      href={content.imageSourceUrl}
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
              {content?.summary ? (
                <p className="text-white/80 text-sm leading-relaxed">
                  {content.summary}
                </p>
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
        {content?.wikidataId && (
          <a
            href={`/place/${content.wikidataId}`}
            className="flex-1 text-center rounded-lg px-3 py-2 text-sm font-medium
              bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            Full place page
          </a>
        )}
        {content?.wikipediaUrl && (
          <a
            href={content.wikipediaUrl}
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
