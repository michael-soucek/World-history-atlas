import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import { ERA_LIST, eraFromSlug, eraSlug } from "@/data/eras";
import { SNAPSHOT_YEARS, formatYear } from "@/data/snapshotYears";
import { CROSSWALK } from "@/data/crosswalk";

interface Props { params: Promise<{ scope: string }> }

export async function generateStaticParams() {
  return ERA_LIST.map(era => ({ scope: eraSlug(era.label) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scope } = await params;
  const era = eraFromSlug(scope);
  if (!era) return { title: "Timeline — Borders of Time" };
  return {
    title: `${era.label} Timeline — Borders of Time`,
    description: `Historical snapshots from the ${era.label} period. Explore empires and events on the interactive map.`,
  };
}

export default async function ScopedTimelinePage({ params }: Props) {
  const { scope } = await params;
  const era = eraFromSlug(scope);
  if (!era) notFound();

  const eraYears = SNAPSHOT_YEARS.filter(y => y >= era.start && y < era.end);

  // Find place entries relevant to this era (those with representative years in range)
  const relatedPlaces = Object.entries(CROSSWALK)
    .map(([name, entry]) => ({ name, ...entry }))
    .slice(0, 12); // just show first 12 for now

  const ERA_ACCENT: Record<string, { accent: string; border: string; dot: string; hex: string }> = {
    Prehistoric:   { accent: "text-prehistoric",  border: "border-prehistoric/40",  dot: "bg-prehistoric", hex: "#6b5c50" },
    Ancient:       { accent: "text-ancient",       border: "border-ancient/40",       dot: "bg-ancient",      hex: "#b87008" },
    Classical:     { accent: "text-classical",     border: "border-classical/40",     dot: "bg-classical",    hex: "#c05008" },
    Medieval:      { accent: "text-medieval",      border: "border-medieval/40",      dot: "bg-medieval",     hex: "#2a6b3f" },
    "Early Modern":{ accent: "text-early-modern",  border: "border-early-modern/40",  dot: "bg-early-modern", hex: "#1565a0" },
    Modern:        { accent: "text-modern",        border: "border-modern/40",        dot: "bg-modern",       hex: "#6040a0" },
  };
  const accentMeta = ERA_ACCENT[era.label] ?? { accent: "text-ancient", border: "border-ancient/40", dot: "bg-ancient", hex: "#b87008" };

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ink/40 mb-10" aria-label="Breadcrumb">
            <Link href="/timeline" className="hover:text-ancient/80 transition-colors">Timeline</Link>
            <span className="text-ink/20">/</span>
            <span className={accentMeta.accent}>{era.label}</span>
          </nav>

          {/* Accent rule + heading */}
          <div className={`h-0.5 w-12 rounded-full ${accentMeta.dot} mb-4`} aria-hidden="true" />
          <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Era</p>
          <HandwrittenTitle className={`font-display text-5xl font-bold italic ${accentMeta.accent} mb-2`} inkColor={accentMeta.hex}>{era.label}</HandwrittenTitle>
          <p className="text-ink/30 text-sm font-mono mb-3">
            {era.start < 0 ? `${Math.abs(era.start)} BCE` : `${era.start} CE`}
            {" – "}
            {isFinite(era.end) ? (era.end < 0 ? `${Math.abs(era.end)} BCE` : `${era.end} CE`) : "present"}
          </p>
          <p className="text-ink/40 text-base mb-12 max-w-lg">
            {eraYears.length} snapshot{eraYears.length !== 1 ? "s" : ""} from the {era.label} period.
          </p>

          {eraYears.length === 0 ? (
            <p className="text-ink/40">No snapshots in this period.</p>
          ) : (
            <div className="flex flex-wrap gap-2.5 mb-16">
              {eraYears.map(year => (
                <Link
                  key={year}
                  href={`/map?year=${year}`}
                  className={`rounded-xl border ${accentMeta.border} bg-white/60 hover:bg-surface px-4 py-3 text-sm font-mono text-ink/55 hover:text-ink transition-all duration-200 hover:translate-x-0.5`}
                >
                  {formatYear(year)}
                </Link>
              ))}
            </div>
          )}

          {/* Era navigation */}
          <div className="border-t border-paper pt-8">
            <p className="text-ink/30 text-xs uppercase tracking-widest mb-4">Other eras</p>
            <div className="flex flex-wrap gap-2.5">
              {ERA_LIST.filter(e => e.label !== era.label).map(e => (
                <Link
                  key={e.label}
                  href={`/timeline/${eraSlug(e.label)}`}
                  className="rounded-xl border border-paper bg-white/60 hover:bg-surface hover:border-paper/60 px-4 py-2.5 text-sm text-ink/50 hover:text-ink transition-all duration-200"
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
