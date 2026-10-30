import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import { TOURS } from "@/data/tours";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `${TOURS.length} Guided History Tours on an Animated Map — Borders of Time`,
  description: `Narrated map tours of history's biggest events, with animated arrows and battles: the Mongols, the Crusades, Alexander, Napoleon, World War II and ${TOURS.length - 5} more.`,
  path: "/tour",
});

const DIFFICULTY_LABEL = {
  "intro":     "Introductory",
  "standard":  "Standard",
  "deep-dive": "Deep dive",
};

// The ruler every tour's span is drawn on.
const AXIS_START = -3000;
const AXIS_END = 2025;
const TICKS = [-3000, -2000, -1000, 1, 1000, 2000];
const pct = (y: number) => ((Math.min(Math.max(y, AXIS_START), AXIS_END) - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
const fmt = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y} CE`);
const startYear = (tour: (typeof TOURS)[number]) => Math.min(...tour.steps.map(s => s.mapState.year));

// Listed in the order history happened, earliest start first.
const TOURS_BY_DATE = [...TOURS].sort((a, b) => startYear(a) - startYear(b));

export default function TourListPage() {
  const totalMinutes = TOURS.reduce((n, t) => n + t.duration, 0);
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <JsonLd
          data={[
            collectionLd("Guided history tours", "Narrated map tours of history's biggest events.", "/tour", TOURS_BY_DATE.map((t) => ({ name: t.title, path: `/tour/${t.slug}` }))),
            breadcrumbLd([["Guided tours", "/tour"]]),
          ]}
        />
        <PageIntro
          label="Guided tours"
          title={<>Let the map <span className="italic">tell the story</span></>}
          lede="Each tour moves the atlas for you — the year, the place, the zoom — while a short narration explains what changed and why. Each step is data-authored, not generated."
          aside={
            <p className="font-mono text-[12px] tracking-wide text-ink/68 leading-relaxed">
              {TOURS.length} tours<br />about {totalMinutes} minutes in all
            </p>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Axis legend */}
          <div className="hidden md:grid grid-cols-[4rem_1fr_minmax(0,22rem)_2rem] gap-x-6 mb-3">
            <span />
            <span className="label text-ink/64">Tour</span>
            <div className="relative h-4">
              {TICKS.map(t => (
                <span key={t} className="absolute top-0 -translate-x-1/2 font-mono text-[10px] text-ink/64 tabular-nums" style={{ left: `${pct(t)}%` }}>
                  {t === 1 ? "1 CE" : t < 0 ? `${-t / 1000}k BCE` : `${t}`}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/world-wars"
            className="group mb-10 flex items-center justify-between gap-4 border border-ink/15 rounded-md px-5 py-4 hover:border-accent transition-colors"
          >
            <span>
              <span className="block font-display text-xl tracking-tight text-ink group-hover:text-accent transition-colors">The world wars, stage by stage</span>
              <span className="block mt-1 text-[14px] text-ink/70">Front lines, occupied territory and every major battle of World War I and World War II.</span>
            </span>
            <ArrowUpRight size={20} className="shrink-0 text-ink/30 group-hover:text-accent transition-colors" aria-hidden="true" />
          </Link>

          <ol className="border-t border-ink/80">
            {TOURS_BY_DATE.map((tour, i) => {
              const years = tour.steps.map(s => s.mapState.year);
              const from = Math.min(...years);
              const to = Math.max(...years);
              return (
                <li key={tour.slug} className="border-b border-ink/10">
                  <Link
                    href={`/tour/${tour.slug}`}
                    className="group grid grid-cols-[2.5rem_1fr_1.5rem] md:grid-cols-[4rem_1fr_minmax(0,22rem)_2rem] items-center gap-x-4 md:gap-x-6 py-7 sm:py-8"
                  >
                    <span className="self-start pt-2 font-mono text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0">
                      <span className="block font-display text-2xl sm:text-[32px] leading-tight tracking-tight text-ink group-hover:text-accent transition-colors">
                        {tour.title}
                      </span>
                      <span className="block mt-2 text-[15px] text-ink/70 leading-relaxed max-w-2xl">{tour.description}</span>
                      <span className="block mt-3 font-mono text-[11px] tracking-wide text-ink/64">
                        {DIFFICULTY_LABEL[tour.difficulty]} · {tour.steps.length} stops · {tour.duration} min
                        <span className="md:hidden"> · {fmt(from)} → {fmt(to)}</span>
                      </span>
                    </span>

                    {/* Where in time the tour runs */}
                    <span className="hidden md:block relative h-10" aria-label={`${fmt(from)} to ${fmt(to)}`}>
                      <span className="absolute inset-x-0 top-1/2 h-px bg-ink/15" />
                      {TICKS.map(t => (
                        <span key={t} className="absolute top-1/2 -translate-y-1/2 h-2 w-px bg-ink/20" style={{ left: `${pct(t)}%` }} />
                      ))}
                      <span
                        className="absolute top-1/2 -translate-y-1/2 h-[3px] bg-ink group-hover:bg-accent transition-colors"
                        style={{ left: `${pct(from)}%`, width: `max(3px, ${pct(to) - pct(from)}%)` }}
                      />
                      {years.map((y, k) => (
                        <span
                          key={k}
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-parchment border border-ink group-hover:border-accent transition-colors"
                          style={{ left: `${pct(y)}%` }}
                        />
                      ))}
                      <span className="absolute left-0 right-0 bottom-0 font-mono text-[10px] text-ink/66 tabular-nums text-center translate-y-1">
                        {fmt(from)} → {fmt(to)}
                      </span>
                    </span>

                    <ArrowUpRight size={20} className="text-ink/25 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all justify-self-end" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ol>

          <p className="mt-10 text-xs text-ink/64 leading-relaxed">
            Tours are built from the atlas&apos;s map data and cited sources.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
