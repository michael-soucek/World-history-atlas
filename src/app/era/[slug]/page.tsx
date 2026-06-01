import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import { ERA_LIST, eraFromSlug, eraSlug } from "@/data/eras";
import { SNAPSHOT_YEARS, formatYear } from "@/data/snapshotYears";
import { CROSSWALK } from "@/data/crosswalk";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return ERA_LIST.filter(e => isFinite(e.start)).map(era => ({ slug: eraSlug(era.label) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const era = eraFromSlug(slug);
  if (!era) return { title: "Era — World History Atlas" };
  return {
    title: `${era.label} Era — World History Atlas`,
    description: `Explore empires, events, and people from the ${era.label} era.`,
  };
}

export default async function EraPage({ params }: Props) {
  const { slug } = await params;
  const era = eraFromSlug(slug);
  if (!era) notFound();

  const eraYears = SNAPSHOT_YEARS.filter(y => y >= era.start && y < era.end);

  // Places that have entries in this era range (heuristic: include all places for now)
  // Deduplicate by slug so alias entries (e.g. "Eastern Roman Empire" / "Byzantine Empire")
  // don't produce duplicate React keys.
  const placesRaw = Object.entries(CROSSWALK)
    .map(([name, entry]) => ({ name, ...entry }));
  const seenSlugs = new Set<string>();
  const places = placesRaw.filter(p => {
    if (seenSlugs.has(p.slug)) return false;
    seenSlugs.add(p.slug);
    return true;
  }).slice(0, 20);

  const ERA_ACCENT: Record<string, { accent: string; dot: string; cardBorder: string; cardHover: string; hex: string }> = {
    Prehistoric:   { accent: "text-prehistoric",  dot: "bg-prehistoric",   cardBorder: "border-prehistoric/25",  cardHover: "hover:border-prehistoric/50", hex: "#6b5c50" },
    Ancient:       { accent: "text-ancient",       dot: "bg-ancient",       cardBorder: "border-ancient/25",       cardHover: "hover:border-ancient/50",       hex: "#b87008" },
    Classical:     { accent: "text-classical",     dot: "bg-classical",     cardBorder: "border-classical/25",     cardHover: "hover:border-classical/50",     hex: "#c05008" },
    Medieval:      { accent: "text-medieval",      dot: "bg-medieval",      cardBorder: "border-medieval/25",      cardHover: "hover:border-medieval/50",      hex: "#2a6b3f" },
    "Early Modern":{ accent: "text-early-modern",  dot: "bg-early-modern",  cardBorder: "border-early-modern/25",  cardHover: "hover:border-early-modern/50",  hex: "#1565a0" },
    Modern:        { accent: "text-modern",        dot: "bg-modern",        cardBorder: "border-modern/25",        cardHover: "hover:border-modern/50",        hex: "#6040a0" },
  };
  const meta = ERA_ACCENT[era.label] ?? { accent: "text-ancient", dot: "bg-ancient", cardBorder: "border-ancient/25", cardHover: "hover:border-ancient/50", hex: "#b87008" };

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
            <Link href="/browse" className="hover:text-ancient/80 transition-colors">Browse</Link>
            <span className="text-ink/20">/</span>
            <Link href="/browse#eras" className="hover:text-ancient/80 transition-colors">Eras</Link>
            <span className="text-ink/20">/</span>
            <span className={meta.accent}>{era.label}</span>
          </nav>

          {/* Title block */}
          <div className={`h-0.5 w-12 rounded-full ${meta.dot} mb-4`} aria-hidden="true" />
          <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Era</p>

          <HandwrittenTitle className={`font-display text-5xl font-bold italic ${meta.accent} mb-2`} inkColor={meta.hex}>{era.label}</HandwrittenTitle>
          <p className="text-ink/30 text-sm font-mono mb-3">
            {era.start < 0 ? `${Math.abs(era.start)} BCE` : `${era.start} CE`}
            {" – "}
            {isFinite(era.end) ? (era.end < 0 ? `${Math.abs(era.end)} BCE` : `${era.end} CE`) : "present"}
          </p>

          {/* Lead blurb for this era */}
          {"blurb" in era && era.blurb && (
            <p className="text-ink/55 text-lg leading-relaxed max-w-3xl mb-10" style={{ maxWidth: '65ch' }}>
              {era.blurb}
            </p>
          )}

          {/* Snapshot years in this era */}
          {eraYears.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display text-xl font-semibold text-ink/70 italic">Snapshot years</h2>
                <div className="flex-1 h-px bg-paper" />
                <span className="text-ink/25 text-xs font-mono">{eraYears.length}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {eraYears.map(year => (
                  <Link
                    key={year}
                    href={`/map?year=${year}&lat=20&lng=10&z=2`}
                    className={`rounded-xl border ${meta.cardBorder} ${meta.cardHover} bg-white/60 hover:bg-surface px-4 py-3 text-sm font-mono text-ink/55 hover:text-ink transition-all duration-200`}
                  >
                    {formatYear(year)}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Featured places */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-xl font-semibold text-ink/70 italic">Featured places &amp; empires</h2>
              <div className="flex-1 h-px bg-paper" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {places.map(place => (
                <Link
                  key={place.slug}
                  href={`/place/${place.slug}`}
                  className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-3 text-sm text-ink/60 hover:text-ink transition-all duration-200 truncate"
                >
                  {place.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Browse other eras */}
          <div className="border-t border-paper pt-8">
            <p className="text-ink/25 text-xs uppercase tracking-widest mb-4">Other eras</p>
            <div className="flex flex-wrap gap-2.5">
              {ERA_LIST.filter(e => e.label !== era.label && isFinite(e.start)).map(e => (
                <Link
                  key={e.label}
                  href={`/era/${eraSlug(e.label)}`}
                  className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-ancient/30 px-4 py-2.5 text-sm text-ink/50 hover:text-ink transition-all duration-200"
                >
                  {e.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
