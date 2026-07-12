"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import type { SearchItem } from "@/lib/searchIndex";

interface SearchClientProps {
  items: SearchItem[];
}

const TYPE_LABELS: Record<string, string> = {
  place:   "Empire / Place",
  person:  "Person",
  event:   "Event",
  culture: "Culture",
};

const TYPE_COLORS: Record<string, string> = {
  place:   "text-ancient     bg-ancient-wash      border-ancient/30",
  person:  "text-early-modern bg-early-modern-wash border-early-modern/30",
  event:   "text-classical   bg-classical-wash    border-classical/30",
  culture: "text-medieval    bg-medieval-wash     border-medieval/30",
};

export default function SearchClient({ items }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter(item => typeFilter === "all" || item.entityType === typeFilter)
      .filter(item =>
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.tagline?.toLowerCase().includes(q) ||
        item.slug.includes(q)
      )
      .slice(0, 50);
  }, [query, typeFilter, items]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Find</p>
      <h1 className="font-display text-5xl font-bold text-ink mb-3 italic">Search</h1>
      <p className="text-ink/40 text-base mb-8">
        Search across {items.length.toLocaleString()} historical entities — empires, people, events, and cultures.
      </p>

      {/* Search input */}
      <div className="relative mb-5">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search empires, people, events…"
          className="w-full bg-surface border border-paper rounded-xl pl-11 pr-4 py-3.5 text-ink placeholder-ink/25 focus:outline-none focus:border-ancient/50 focus:bg-surface text-base transition-all"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {["all", "place", "person", "event", "culture"].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
              typeFilter === t
                ? "bg-ancient text-white border-ancient"
                : "bg-surface text-ink/60 border-paper hover:text-ink hover:bg-ink/[0.06]"
            }`}
          >
            {t === "all" ? "All" : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Results */}
      {query === "" && typeFilter === "all" ? (
        <p className="text-ink/30 text-sm">Start typing to search…</p>
      ) : results.length === 0 ? (
        <p className="text-ink/30 text-sm">No results for &ldquo;{query}&rdquo;.</p>
      ) : (
        <ul className="space-y-2">
          {results.map(item => (
            <li key={`${item.entityType}-${item.slug}`}>
              <Link
                href={`/${item.route}/${item.slug}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-paper bg-white/60 hover:bg-ancient-wash hover:border-ancient/20 px-5 py-4 transition-all duration-150 group"
              >
                <div className="min-w-0">
                  <p className="text-ink font-medium group-hover:text-ancient transition-colors truncate">
                    {item.name}
                  </p>
                  {item.tagline && (
                    <p className="text-ink/40 text-xs mt-0.5 truncate">{item.tagline}</p>
                  )}
                </div>
                <span className={`shrink-0 text-xs font-medium rounded-full border px-2.5 py-0.5 ${TYPE_COLORS[item.entityType] ?? ""}`}>
                  {TYPE_LABELS[item.entityType]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Also allow jumping to a map year */}
      {query && /^\d{1,6}$/.test(query.trim()) && (
        <div className="mt-6 rounded-xl border border-ancient/20 bg-ancient-wash p-4 flex items-center justify-between gap-4">
          <p className="text-ink/70 text-sm">
            Jump to <span className="font-mono text-ancient">{query} CE</span> on the map
          </p>
          <Link
            href={`/map?year=${query}`}
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium bg-ancient text-white hover:bg-ancient/90 transition-colors"
          >
            View map →
          </Link>
        </div>
      )}
    </div>
  );
}
