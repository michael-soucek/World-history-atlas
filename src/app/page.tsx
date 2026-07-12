import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroMapPreviewLoader from "@/components/HeroMapPreviewLoader";
import { CROSSWALK } from "@/data/crosswalk";
import { ERA_LIST, eraSlug } from "@/data/eras";
import { SNAPSHOT_YEARS, formatYear } from "@/data/snapshotYears";
import { EXPLORERS } from "@/data/voyages";

export const metadata: Metadata = {
  title: "World History Atlas — Watch borders change through time",
  description:
    "An interactive atlas of world history. Watch empires rise and fall. Explore places, people, events, and cultures across 5,000 years of recorded history.",
  openGraph: {
    title: "World History Atlas",
    description: "Watch the world's empires rise and fall — year by year.",
    siteName: "World History Atlas",
    type: "website",
  },
};

const FEATURED_PLACES = [
  "Mongol Empire",
  "Roman Empire",
  "Ottoman Empire",
  "British Empire",
  "Achaemenid Empire",
  "Mughal Empire",
];

const ERA_COLORS: Record<string, string> = {
  Ancient:       "from-ancient-wash to-parchment border-ancient/25 hover:border-ancient/50",
  Classical:     "from-classical-wash to-parchment border-classical/25 hover:border-classical/50",
  Medieval:      "from-medieval-wash to-parchment border-medieval/25 hover:border-medieval/50",
  "Early Modern":"from-early-modern-wash to-parchment border-early-modern/25 hover:border-early-modern/50",
  Modern:        "from-modern-wash to-parchment border-modern/25 hover:border-modern/50",
};

const FEATURED_ERAS = ERA_LIST.filter(e => isFinite(e.start)).slice(1);

export default function HomePage() {
  const featured = FEATURED_PLACES
    .map(name => ({ name, entry: CROSSWALK[name] }))
    .filter(p => p.entry != null);

  const today = new Date();
  const dayIndex = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const onThisDayYear = SNAPSHOT_YEARS[dayIndex % SNAPSHOT_YEARS.length];

  return (
    <>
      <SiteHeader />
      <main>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-parchment topo-bg">
          {/* Faint graticule lines (lat/long grid) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal parallels — very faint, don't cut the layout */}
            {[20, 40, 60, 80].map(y => (
              <line key={`h${y}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#b87008" strokeWidth="0.5" strokeOpacity="0.07" />
            ))}
            {/* Vertical meridians */}
            {[14, 28, 42, 56, 70, 84].map(x => (
              <line key={`v${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#b87008" strokeWidth="0.5" strokeOpacity="0.06" />
            ))}
          </svg>

          <div className="relative max-w-6xl mx-auto px-6 py-14 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-center">

              {/* ── Left: editorial text ── */}
              <div>
                {/* Cartouche label */}
                <div className="inline-flex items-center gap-2 border border-ancient/30 rounded-sm px-3 py-1.5 mb-8 bg-ancient-wash/60">
                  <span className="text-ancient/80 text-[10px] font-semibold tracking-[0.18em] uppercase">World History Atlas</span>
                </div>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.04] tracking-tight mb-6">
                  Watch borders<br />
                  {/* Single amber brushstroke underline — no gradient */}
                  <span className="relative inline-block italic">
                    shift
                    <svg
                      className="absolute -bottom-1 left-0 w-full pointer-events-none"
                      height="8" viewBox="0 0 100 8" preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path d="M0 6 Q25 2 50 5 Q75 3 100 6" stroke="#b87008" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
                    </svg>
                  </span>{" "}
                  through time
                </h1>

                <p className="text-ink/55 text-lg max-w-lg mb-8 leading-relaxed">
                  An interactive atlas of 5,000 years of history. Drag through empires, conquests, and collapse — from the first cities to the modern world.
                </p>

                {/* CTAs: one bold primary, one quiet text link */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href="/map?year=1700"
                    className="rounded-sm px-7 py-3.5 text-base font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors shadow-md shadow-ancient/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ancient"
                  >
                    Open the map
                  </Link>
                  <Link
                    href="/tour"
                    className="text-sm text-ink/50 hover:text-ancient underline underline-offset-4 decoration-ancient/30 hover:decoration-ancient/70 transition-colors"
                  >
                    Take a guided tour →
                  </Link>
                </div>

                {/* Timeline scale bar */}
                <div className="mt-10 flex items-center gap-0 select-none" aria-hidden="true">
                  <span className="text-ink/30 text-[10px] font-mono mr-2">3000 BCE</span>
                  <div className="flex items-end gap-px h-4">
                    {[1,2,1,3,2,1,4,2,3,1,2,3,4,2,1,2,3,1,2,4].map((h, i) => (
                      <div key={i} className="w-0.5 bg-ink/15 rounded-full" style={{ height: `${h * 4}px` }} />
                    ))}
                  </div>
                  <div className="flex-1 h-px bg-ink/15 mx-1" />
                  <div className="flex items-end gap-px h-4">
                    {[2,1,3,2,4,1,2,3,1,2,4,3,2,1,3,2,1,4,2,3].map((h, i) => (
                      <div key={i} className="w-0.5 bg-ink/20 rounded-full" style={{ height: `${h * 4}px` }} />
                    ))}
                  </div>
                  <span className="text-ink/30 text-[10px] font-mono ml-2">today</span>
                </div>
              </div>

              {/* ── Right: antique map plate ── */}
              <Link href="/map?year=1700" className="relative block group transition-opacity duration-200 hover:opacity-90 cursor-pointer">
                {/* Cartouche frame */}
                <div className="relative rounded-sm border border-ancient/30 bg-ancient-wash/50 p-1 shadow-[inset_0_0_0_1px_rgba(184,112,8,0.12),0_8px_40px_rgba(184,112,8,0.10)] group-hover:shadow-[inset_0_0_0_1px_rgba(184,112,8,0.20),0_12px_48px_rgba(184,112,8,0.18)] transition-shadow duration-200">
                  {/* Corner ornaments */}
                  {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
                    <svg key={i} className={`absolute ${pos} w-5 h-5 text-ancient/40`} viewBox="0 0 20 20" fill="none">
                      <path d="M2 2 L8 2 L2 8 Z" fill="currentColor" />
                      <path d="M2 2 L2 6" stroke="currentColor" strokeWidth="1" />
                      <path d="M2 2 L6 2" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  ))}

                  {/* Real MapLibre map plate — shows actual product, read-only */}
                  <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4/3" }}>
                    {/* Live map underneath — fills the plate absolutely */}
                    <HeroMapPreviewLoader />

                    {/* Antique decorative overlays — graticule, equator, compass, label */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 420 315"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid slice"
                      aria-hidden="true"
                    >
                      {/* Graticule — very faint amber, decorative only */}
                      {[70, 140, 210, 280, 350].map(x => (
                        <line key={x} x1={x} y1="0" x2={x} y2="315" stroke="#b87008" strokeWidth="0.4" strokeOpacity="0.12" />
                      ))}
                      {[63, 126, 189, 252].map(y => (
                        <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="#b87008" strokeWidth="0.4" strokeOpacity="0.12" />
                      ))}

                      {/* Equator dashed */}
                      <line x1="0" y1="158" x2="420" y2="158" stroke="#b87008" strokeWidth="0.7" strokeOpacity="0.28" strokeDasharray="5 5" />

                      {/* Compass rose — bottom right */}
                      <g transform="translate(385, 280)" stroke="#b87008" strokeOpacity="0.55" fill="none">
                        <circle cx="0" cy="0" r="12" strokeWidth="0.5" />
                        <line x1="0" y1="-14" x2="0" y2="14" strokeWidth="0.8" />
                        <line x1="-14" y1="0" x2="14" y2="0" strokeWidth="0.8" />
                        <line x1="-9" y1="-9" x2="9" y2="9" strokeWidth="0.4" />
                        <line x1="9" y1="-9" x2="-9" y2="9" strokeWidth="0.4" />
                        <polygon points="0,-14 -4,-4 4,-4" fill="#b87008" fillOpacity="0.55" stroke="none" />
                        <text x="0" y="-17" textAnchor="middle" fontSize="5" fill="#b87008" fillOpacity="0.75" fontFamily="serif">N</text>
                      </g>

                      {/* Scale label */}
                      <text x="10" y="308" fontSize="5.5" fill="#b87008" fillOpacity="0.50" fontFamily="serif" fontStyle="italic">
                        3000 BCE — today
                      </text>
                    </svg>
                  </div>

                  {/* Cartouche title band */}
                  <div className="px-4 py-2.5 text-center border-t border-ancient/15">
                    <span className="text-ancient/60 text-[10px] font-semibold tracking-[0.15em] uppercase font-mono">
                      Tabula Historiae Mundi
                    </span>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* ── On this day ── */}
        <section className="bg-ocean">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="border border-ancient/20 rounded-2xl bg-parchment/70 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 80% at 0% 50%, rgba(184,112,8,0.05), transparent)" }} />
              <div className="flex-1 min-w-0">
                <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-1">On this day in history</p>
                <p className="text-ink text-lg font-medium">What did the world look like in {formatYear(onThisDayYear)}?</p>
              </div>
              <Link
                href={`/map?year=${onThisDayYear}`}
                className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium border border-paper text-ink/70 hover:text-ink hover:border-ancient/40 hover:bg-ancient-wash transition-all duration-200"
              >
                View {formatYear(onThisDayYear)} →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Featured empires ── */}
        <section className="bg-parchment py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="font-display text-3xl font-bold text-ink">Featured empires</h2>
              <Link href="/browse" className="text-sm text-ancient/70 hover:text-ancient transition-colors">
                Browse all →
              </Link>
            </div>
            <p className="text-ink/40 text-sm mb-8">Six of the most influential empires in the atlas.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {featured.map(({ name, entry }) => (
                <Link
                  key={entry!.slug}
                  href={`/place/${entry!.slug}`}
                  className="group relative rounded-xl border border-paper bg-white/60 hover:bg-ancient-wash hover:border-ancient/30 p-5 transition-all duration-200"
                >
                  {/* Amber top accent on hover */}
                  <div className="absolute top-0 inset-x-0 h-px rounded-t-xl bg-ancient/0 group-hover:bg-ancient/40 transition-all duration-200" />
                  <p className="text-ink/85 font-medium group-hover:text-ink transition-colors">{name}</p>
                  <p className="text-ink/35 text-xs mt-1">Empire · Place</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Explorers ── */}
        <section className="bg-surface py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="font-display text-3xl font-bold text-ink">Age of Exploration</h2>
              <Link href="/theme/age-of-exploration" className="text-sm text-ancient/70 hover:text-ancient transition-colors">
                Explore all →
              </Link>
            </div>
            <p className="text-ink/40 text-sm mb-8">Explorers whose voyages connected the world's oceans.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXPLORERS.slice(0, 3).map((explorer) => (
                <Link
                  key={explorer.slug}
                  href={`/explorer/${explorer.slug}`}
                  className="group relative rounded-xl border border-paper bg-white/60 hover:bg-early-modern-wash hover:border-early-modern/30 p-5 transition-all duration-200"
                >
                  {/* Accent on hover */}
                  <div className="absolute top-0 inset-x-0 h-px rounded-t-xl bg-early-modern/0 group-hover:bg-early-modern/40 transition-all duration-200" />
                  <p className="text-ink/85 font-medium group-hover:text-ink transition-colors">{explorer.name}</p>
                  <p className="text-ink/35 text-xs mt-1">Explorer · {explorer.lifespan}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Browse by era ── */}
        <section className="border-t border-paper bg-surface py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="font-display text-3xl font-bold text-ink">Browse by era</h2>
              <Link href="/timeline" className="text-sm text-ancient/70 hover:text-ancient transition-colors">
                Full timeline →
              </Link>
            </div>
            <p className="text-ink/40 text-sm mb-8">Jump to a historical period and explore what the world looked like.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {FEATURED_ERAS.map(era => {
                const colors = ERA_COLORS[era.label] ?? "from-surface to-parchment border-paper hover:border-paper/60";
                const eraTextColor: Record<string, string> = {
                  Ancient: "text-ancient", Classical: "text-classical",
                  Medieval: "text-medieval", "Early Modern": "text-early-modern", Modern: "text-modern",
                };
                return (
                  <Link
                    key={era.label}
                    href={`/era/${eraSlug(era.label)}`}
                    className={`group rounded-xl border bg-linear-to-br ${colors} px-5 py-5 transition-all duration-200 hover:shadow-sm`}
                  >
                    <p className={`text-sm font-semibold transition-colors ${eraTextColor[era.label] ?? "text-ink"}`}>{era.label}</p>
                    <p className="text-ink/35 text-xs mt-1.5">
                      {era.start < 0 ? `${Math.abs(era.start)} BCE` : `${era.start} CE`}
                      {" – "}
                      {isFinite(era.end) ? (era.end < 0 ? `${Math.abs(era.end)} BCE` : `${era.end} CE`) : "now"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Surprise me / CTA ── */}
        <section className="border-t border-paper bg-ocean py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-2xl border border-ancient/25 bg-linear-to-br from-ancient-wash to-parchment overflow-hidden p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="absolute inset-0 pointer-events-none topo-bg opacity-60" />
              <div className="relative flex-1 min-w-0">
                <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Surprise me</p>
                <h3 className="font-display text-3xl font-bold text-ink mb-2">Pick a random year and explore</h3>
                <p className="text-ink/50 text-sm leading-relaxed">History is full of surprises. Let the atlas take you somewhere unexpected.</p>
              </div>
              <Link
                href={`/map?year=${SNAPSHOT_YEARS[Math.floor(SNAPSHOT_YEARS.length / 2)]}`}
                className="relative shrink-0 rounded-xl px-7 py-3.5 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors shadow-lg shadow-ancient/20"
              >
                Explore →
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
