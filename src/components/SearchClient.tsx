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
  place:   "text-accent",
  person:  "text-early-modern",
  event:   "text-classical",
  culture: "text-medieval",
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

  // "1453", "500 BCE", "-500", "323 bc" → a year to open on the map.
  const yearMatch = query.trim().match(/^(-)?(\d{1,6})\s*(bce|bc|ce|ad)?$/i);
  const jumpYear = yearMatch
    ? (yearMatch[1] || /^b/i.test(yearMatch[3] ?? "") ? -1 : 1) * Number(yearMatch[2])
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-24">
      <h1 className="sr-only">Search Borders of Time</h1>
      <p className="label text-accent mb-6 flex items-center gap-3">
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        <span>Search {items.length.toLocaleString("en-US")} empires, people, events &amp; cultures — or a year</span>
      </p>

      <div className="relative border-b-2 border-ink focus-within:border-accent transition-colors">
        <label htmlFor="q" className="sr-only">Search</label>
        <input
          id="q"
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search history…"
          className="w-full bg-transparent pr-12 pb-3 font-display font-light text-[40px] sm:text-6xl tracking-[-0.03em] text-ink placeholder:text-ink/25 no-focus-ring focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          autoFocus
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full text-ink/40 hover:text-ink hover:bg-ink/6"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex gap-x-7 mt-6 mb-10 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]" role="tablist" aria-label="Filter by type">
        {["all", "place", "person", "event", "culture"].map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={typeFilter === t}
            onClick={() => setTypeFilter(t)}
            className={`relative shrink-0 whitespace-nowrap pb-1 text-[14px] transition-colors ${
              typeFilter === t ? "text-ink font-medium" : "text-ink/45 hover:text-ink"
            }`}
          >
            {t === "all" ? "Everything" : TYPE_LABELS[t]}
            {typeFilter === t && <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-accent" aria-hidden="true" />}
          </button>
        ))}
      </div>

      {/* Year jump */}
      {jumpYear !== null && jumpYear !== 0 && (
        <Link
          href={`/map?year=${jumpYear}`}
          className="group mb-10 flex items-center justify-between gap-6 bg-night text-parchment px-6 py-5"
        >
          <span>
            <span className="label text-glow/80 block">Open the map in</span>
            <span className="font-display font-light text-4xl tracking-tight tabular-nums">
              {Math.abs(jumpYear)} <span className="italic text-glow text-2xl">{jumpYear < 0 ? "BCE" : "CE"}</span>
            </span>
          </span>
          <span className="text-2xl text-glow transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>
      )}

      {/* Results */}
      {query === "" && typeFilter === "all" ? (
        <p className="text-ink/45 text-[15px]">
          Try <button className="underline underline-offset-4 decoration-ink/25 hover:text-accent" onClick={() => setQuery("Rome")}>Rome</button>,{" "}
          <button className="underline underline-offset-4 decoration-ink/25 hover:text-accent" onClick={() => setQuery("Khan")}>Khan</button>,{" "}
          <button className="underline underline-offset-4 decoration-ink/25 hover:text-accent" onClick={() => setQuery("revolution")}>revolution</button> or{" "}
          <button className="underline underline-offset-4 decoration-ink/25 hover:text-accent" onClick={() => setQuery("1453")}>1453</button>.
        </p>
      ) : results.length === 0 ? (
        jumpYear === null && <p className="text-ink/50 text-[15px]">Nothing in the atlas matches &ldquo;{query}&rdquo;.</p>
      ) : (
        <>
          <p className="font-mono text-[11px] tracking-wider text-ink/45 mb-3">
            {results.length === 50 ? "First 50 results" : `${results.length} result${results.length !== 1 ? "s" : ""}`}
          </p>
          <ul className="border-t border-ink/80">
            {results.map(item => (
              <li key={`${item.entityType}-${item.slug}`} className="border-b border-ink/10">
                <Link
                  href={`/${item.route}/${item.slug}`}
                  className="group grid grid-cols-[1fr_auto] sm:grid-cols-[9rem_1fr_auto] items-baseline gap-x-4 py-4"
                >
                  <span className={`label !text-[10px] max-sm:hidden ${TYPE_COLORS[item.entityType] ?? "text-ink/45"}`}>
                    {item.label ?? TYPE_LABELS[item.entityType]}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl tracking-tight text-ink group-hover:text-accent transition-colors truncate">
                      {item.name}
                    </span>
                    {item.tagline && <span className="block text-ink/45 text-sm mt-0.5 truncate">{item.tagline}</span>}
                    <span className={`sm:hidden label !text-[10px] ${TYPE_COLORS[item.entityType] ?? "text-ink/45"}`}>{item.label ?? TYPE_LABELS[item.entityType]}</span>
                  </span>
                  <span className="text-ink/25 group-hover:text-accent group-hover:translate-x-1 transition-all" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
