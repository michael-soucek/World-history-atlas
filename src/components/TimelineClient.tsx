"use client";

import Link from "next/link";
import { ERA_LIST } from "@/data/eras";
import { SNAPSHOT_YEARS, formatYear } from "@/data/snapshotYears";
import { TIMELINE_ILLUSTRATIONS } from "@/data/timelineIllustrations";
import TimelineEraArt from "@/components/TimelineEraArt";

/** Rich per-era metadata: accent colour, dot style, card tint, short description. */
const ERA_META: Record<
  string,
  {
    accent: string;
    accentBg: string;
    dotBorder: string;
    spineTint: string;
    cardFrom: string;
    cardBorder: string;
    cardHover: string;
    description: string;
    range: string;
    span: number;
  }
> = {
  Prehistoric: {
    accent: "text-prehistoric",
    accentBg: "bg-prehistoric",
    dotBorder: "border-prehistoric/60",
    spineTint: "#6b5c50",
    cardFrom: "from-prehistoric-wash",
    cardBorder: "border-prehistoric/20",
    cardHover: "hover:border-prehistoric/40",
    description: "Hunter-gatherers, ice ages, and the slow first flowering of human culture.",
    range: "123,000 BCE – 3,000 BCE",
    span: 120000,
  },
  Ancient: {
    accent: "text-ancient",
    accentBg: "bg-ancient",
    dotBorder: "border-ancient/60",
    spineTint: "#b87008",
    cardFrom: "from-ancient-wash",
    cardBorder: "border-ancient/20",
    cardHover: "hover:border-ancient/40",
    description: "River civilisations, the Bronze Age, and the world's earliest written records.",
    range: "3,000 BCE – 500 BCE",
    span: 2500,
  },
  Classical: {
    accent: "text-classical",
    accentBg: "bg-classical",
    dotBorder: "border-classical/60",
    spineTint: "#c05008",
    cardFrom: "from-classical-wash",
    cardBorder: "border-classical/20",
    cardHover: "hover:border-classical/40",
    description: "The Axial Age, Greek philosophy, Rome's rise, and the birth of the world religions.",
    range: "500 BCE – 500 CE",
    span: 1000,
  },
  Medieval: {
    accent: "text-medieval",
    accentBg: "bg-medieval",
    dotBorder: "border-medieval/60",
    spineTint: "#2a6b3f",
    cardFrom: "from-medieval-wash",
    cardBorder: "border-medieval/20",
    cardHover: "hover:border-medieval/40",
    description: "Feudal kingdoms, the Islamic golden age, the Crusades, and the Mongol conquests.",
    range: "500 CE – 1400 CE",
    span: 900,
  },
  "Early Modern": {
    accent: "text-early-modern",
    accentBg: "bg-early-modern",
    dotBorder: "border-early-modern/60",
    spineTint: "#1565a0",
    cardFrom: "from-early-modern-wash",
    cardBorder: "border-early-modern/20",
    cardHover: "hover:border-early-modern/40",
    description: "European expansion, the Scientific Revolution, and the Age of Sail.",
    range: "1400 CE – 1800 CE",
    span: 400,
  },
  Modern: {
    accent: "text-modern",
    accentBg: "bg-modern",
    dotBorder: "border-modern/60",
    spineTint: "#6040a0",
    cardFrom: "from-modern-wash",
    cardBorder: "border-modern/20",
    cardHover: "hover:border-modern/40",
    description: "Industrialisation, world wars, decolonisation, and the connected world.",
    range: "1800 CE – 2010 CE",
    span: 210,
  },
};

/** Return a pixel gap between adjacent year cards, log-scaled by time span. */
function logGap(prev: number, cur: number): number {
  const diff = Math.abs(cur - prev);
  if (diff <= 1) return 8;
  return Math.round(Math.min(72, Math.max(8, Math.log10(diff) * 18)));
}

export default function TimelineClient() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Page header */}
        <div className="max-w-2xl">
          <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">53 snapshots</p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-ink italic mb-3">Timeline</h1>
          <p className="text-ink/40 text-base mb-16 max-w-lg leading-relaxed">
            From 123,000 BCE to 2010 CE — click any year to open the map at that moment in history.
          </p>
        </div>

        <div className="relative lg:pr-[min(34vw,340px)]">
          {/* Continuous amber rail — runs from first era dot to last */}
          <div
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: 10,
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(184,112,8,0.30) 3%, rgba(184,112,8,0.30) 97%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {ERA_LIST.map((era, index) => {
            const meta = ERA_META[era.label];
            if (!meta) return null;

            const illustration = TIMELINE_ILLUSTRATIONS[era.label];
            const eraYears = SNAPSHOT_YEARS.filter(y => y >= era.start && y < era.end);
            if (eraYears.length === 0) return null;

            const sectionPb = Math.round(Math.min(96, Math.max(40, Math.log10(meta.span) * 18)));

            return (
              <section
                key={era.label}
                style={{ paddingBottom: sectionPb }}
                aria-label={`${era.label} era: ${meta.range}`}
                className="relative"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
                  {/* Main timeline column */}
                  <div className="relative min-w-0">
                    {/* Era chapter heading row */}
                    <div className="relative flex items-start gap-5 mb-6">
                      <div
                        className={`relative z-10 mt-1 shrink-0 w-5 h-5 rounded-full border-2 ${meta.dotBorder} bg-parchment`}
                        style={{ boxShadow: `0 0 8px 1px ${meta.spineTint}40` }}
                        aria-hidden="true"
                      >
                        <div className={`absolute inset-1 rounded-full ${meta.accentBg} opacity-90`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`h-0.5 w-10 rounded-full ${meta.accentBg} mb-2`}
                          aria-hidden="true"
                        />
                        <h2 className={`font-display text-2xl font-bold italic ${meta.accent} leading-tight`}>
                          {era.label}
                        </h2>
                        <p className="text-ink/30 text-xs font-mono mt-0.5 mb-2">{meta.range}</p>
                        <p className="text-ink/55 text-sm leading-relaxed">{meta.description}</p>
                      </div>
                    </div>

                    {/* Year cards — single column, log-spaced */}
                    <div className="pl-10">
                      {eraYears.map((year, i) => {
                        const gap = i === 0 ? 0 : logGap(eraYears[i - 1], year);
                        return (
                          <div
                            key={year}
                            className="relative flex items-center"
                            style={{ marginTop: gap }}
                          >
                            <div className="absolute -left-5 flex items-center gap-1" aria-hidden="true">
                              <div className="w-3 h-px bg-ink/10" />
                              <div className="w-1 h-1 rounded-full bg-ink/20" />
                            </div>

                            <Link
                              href={`/map?year=${year}`}
                              className={`
                                group flex items-center gap-3 rounded-xl border
                                bg-parchment
                                ${meta.cardBorder} ${meta.cardHover}
                                px-4 py-2.5
                                transition-all duration-200
                                hover:translate-x-1
                              `}
                            >
                              <span
                                className="font-mono text-sm text-ink/55 group-hover:text-ink transition-colors"
                                style={{ minWidth: 96 }}
                              >
                                {formatYear(year)}
                              </span>
                              <span
                                className="text-[10px] uppercase tracking-wider text-ink/25 group-hover:text-ink/60 transition-colors"
                                aria-hidden="true"
                              >
                                →
                              </span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Illustrated side plate */}
                  <div className="hidden lg:block">
                    <TimelineEraArt image={illustration} />
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA banner */}
        <div className="topo-bg mt-4 rounded-2xl border border-ancient/25 bg-ocean p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-1">
            <p className="font-display italic text-lg text-ink mb-1">Want the full experience?</p>
            <p className="text-ink/45 text-sm leading-relaxed">
              Drag the time slider on the map to watch borders shift in real time.
            </p>
          </div>
          <Link
            href="/map"
            className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
          >
            Open the map →
          </Link>
        </div>
      </div>
    </div>
  );
}
