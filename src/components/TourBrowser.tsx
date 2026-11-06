"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { commonsSrcSet } from "@/lib/commonsImage";

export interface TourCardData {
  slug: string;
  title: string;
  description: string;
  meta: string;
  from: number;
  to: number;
  span: string;
  image?: { src: string; alt: string };
}

export interface TourShelf {
  id: string;
  title: string;
  blurb: string;
  tours: TourCardData[];
}

type View = "theme" | "date";

// The ruler the date view draws every tour's span on.
const AXIS_START = -3000;
const AXIS_END = 2025;
const TICKS = [-3000, -2000, -1000, 1, 1000, 2000];
const pct = (y: number) => ((Math.min(Math.max(y, AXIS_START), AXIS_END) - AXIS_START) / (AXIS_END - AXIS_START)) * 100;

/** A tour's picture, or a plain graticule panel when it has none. */
function Picture({ image, sizes }: { image?: TourCardData["image"]; sizes: string }) {
  if (!image) return <span className="block aspect-square sm:aspect-[16/9] bg-night graticule-night" aria-hidden="true" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      srcSet={commonsSrcSet(image.src)}
      sizes={sizes}
      alt=""
      loading="lazy"
      decoding="async"
      className="block w-full aspect-square sm:aspect-[16/9] object-cover bg-surface"
    />
  );
}

function TourCard({ tour }: { tour: TourCardData }) {
  return (
    <li>
      <Link href={`/tour/${tour.slug}`} className="group grid grid-cols-[6.5rem_1fr] sm:flex sm:h-full sm:flex-col gap-x-4">
        <span className="block overflow-hidden rounded-md self-start">
          <Picture image={tour.image} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 104px" />
        </span>
        <span className="min-w-0">
          <span className="sm:mt-4 block font-display text-lg sm:text-[22px] leading-snug tracking-tight text-ink group-hover:text-accent transition-colors">
            {tour.title}
          </span>
          <span className="mt-2 hidden sm:block text-[15px] leading-relaxed text-ink/70 line-clamp-3">{tour.description}</span>
          <span className="mt-1.5 sm:mt-3 block font-mono text-[11px] tracking-wide text-ink/64 tabular-nums">
            {tour.span}
            <span className="block mt-0.5">{tour.meta}</span>
          </span>
        </span>
      </Link>
    </li>
  );
}

function DateRow({ tour }: { tour: TourCardData }) {
  return (
    <li className="border-b border-ink/10">
      <Link
        href={`/tour/${tour.slug}`}
        className="group grid grid-cols-[1fr_1.5rem] md:grid-cols-[1fr_minmax(0,22rem)_2rem] items-center gap-x-6 py-4"
      >
        <span className="min-w-0">
          <span className="block font-display text-xl leading-snug tracking-tight text-ink group-hover:text-accent transition-colors">
            {tour.title}
          </span>
          <span className="mt-1 block font-mono text-[11px] tracking-wide text-ink/64 tabular-nums">
            {tour.span} · {tour.meta}
          </span>
        </span>
        <span className="hidden md:block relative h-5" aria-hidden="true">
          <span className="absolute inset-x-0 top-1/2 h-px bg-ink/15" />
          {TICKS.map((t) => (
            <span key={t} className="absolute top-1/2 -translate-y-1/2 h-2 w-px bg-ink/20" style={{ left: `${pct(t)}%` }} />
          ))}
          <span
            className="absolute top-1/2 -translate-y-1/2 h-[3px] bg-ink group-hover:bg-accent transition-colors"
            style={{ left: `${pct(tour.from)}%`, width: `max(3px, ${pct(tour.to) - pct(tour.from)}%)` }}
          />
        </span>
        <ArrowUpRight
          size={18}
          className="text-ink/25 group-hover:text-accent transition-colors justify-self-end"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

/** Every tour, shelved by theme or laid out by date, with a search box. */
export default function TourBrowser({ shelves }: { shelves: TourShelf[] }) {
  const [view, setView] = useState<View>("theme");
  const [query, setQuery] = useState("");

  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (t: TourCardData) => {
    const text = `${t.title} ${t.description}`.toLowerCase();
    return words.every((w) => text.includes(w));
  };

  const filtered = shelves.map((s) => ({ ...s, tours: s.tours.filter(matches) })).filter((s) => s.tours.length > 0);
  const total = useMemo(() => shelves.reduce((n, s) => n + s.tours.length, 0), [shelves]);
  const shown = filtered.reduce((n, s) => n + s.tours.length, 0);
  const byDate = filtered.flatMap((s) => s.tours).sort((a, b) => a.from - b.from || a.to - b.to);

  const viewButton = (value: View, label: string) => (
    <button
      type="button"
      onClick={() => setView(value)}
      aria-pressed={view === value}
      className={`pb-1 border-b-2 text-[15px] transition-colors ${
        view === value ? "border-accent text-ink" : "border-transparent text-ink/64 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="lg:sticky lg:top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-parchment/95 backdrop-blur border-y border-ink/10">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <label className="relative flex-1 min-w-[14rem] max-w-md">
            <span className="sr-only">Search the tours</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the tours"
              className="w-full rounded-md border border-ink/20 bg-card py-2 pl-9 pr-3 text-[15px] text-ink placeholder:text-ink/50 focus:border-accent focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-5">
            {viewButton("theme", "By theme")}
            {viewButton("date", "By date")}
          </div>
          <span className="font-mono text-[11px] tracking-wide text-ink/64 tabular-nums" aria-live="polite">
            {shown === total ? `${total} tours` : `${shown} of ${total} tours`}
          </span>
        </div>
        {view === "theme" && words.length === 0 && (
          <nav aria-label="Jump to a theme" className="mt-3 hidden lg:flex flex-wrap gap-x-5 gap-y-1">
            {shelves.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-[14px] text-ink/70 hover:text-accent transition-colors">
                {s.title}
              </a>
            ))}
          </nav>
        )}
      </div>

      {shown === 0 && (
        <p className="py-16 text-lg text-ink/70">
          No tour matches that search.{" "}
          <button type="button" onClick={() => setQuery("")} className="text-accent underline underline-offset-4">
            Show them all
          </button>
        </p>
      )}

      {view === "theme" &&
        filtered.map((shelf) => (
          <section key={shelf.id} id={shelf.id} className="pt-14 scroll-mt-40">
            <div className="flex items-baseline justify-between gap-4 border-b border-ink/80 pb-3 mb-8">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-ink">{shelf.title}</h2>
                <p className="mt-1 text-[15px] text-ink/70">{shelf.blurb}</p>
              </div>
              <span className="font-mono text-[11px] tracking-wider text-ink/66 tabular-nums">{shelf.tours.length}</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 sm:gap-y-10">
              {shelf.tours.map((t) => (
                <TourCard key={t.slug} tour={t} />
              ))}
            </ul>
          </section>
        ))}

      {view === "date" && shown > 0 && (
        <ol className="mt-10 border-t border-ink/80">
          {byDate.map((t) => (
            <DateRow key={t.slug} tour={t} />
          ))}
        </ol>
      )}
    </div>
  );
}
