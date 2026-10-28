import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHistory from "@/components/PageHistory";
import PageIntro from "@/components/PageIntro";
import { LinkRow } from "@/components/Gazetteer";
import { ERA_LIST, eraFromSlug, eraSlug } from "@/data/eras";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import { buildPageMetadata, metaDescription, brandTitle } from "@/lib/seo";

const fmt = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y} CE`);

interface Props { params: Promise<{ scope: string }> }

export async function generateStaticParams() {
  return ERA_LIST.map(era => ({ scope: eraSlug(era.label) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scope } = await params;
  const era = eraFromSlug(scope);
  if (!era) return { title: "Timeline — Borders of Time" };
  const years = SNAPSHOT_YEARS.filter(y => y >= era.start && y < era.end);
  const span = isFinite(era.start) ? `${fmt(era.start)} to ${isFinite(era.end) ? fmt(era.end) : "today"}` : `before ${fmt(era.end)}`;
  return buildPageMetadata({
    title: brandTitle(`${era.label} World Maps: ${years.length} Historical Maps, ${span}`),
    description: metaDescription(`The world's borders in the ${era.label} era, ${span}, map by map: ${years.map(fmt).join(", ")}. Open any year on the interactive map.`)!,
    path: `/timeline/${scope}`,
  });
}

export default async function ScopedTimelinePage({ params }: Props) {
  const { scope } = await params;
  const era = eraFromSlug(scope);
  if (!era) notFound();

  const eraYears = SNAPSHOT_YEARS.filter(y => y >= era.start && y < era.end);

  const ERA_ACCENT: Record<string, { accent: string; border: string; dot: string; hex: string }> = {
    Prehistoric:   { accent: "text-prehistoric",  border: "border-prehistoric/40",  dot: "bg-prehistoric", hex: "#6d6457" },
    Ancient:       { accent: "text-ancient",       border: "border-ancient/40",       dot: "bg-ancient",      hex: "#a66a12" },
    Classical:     { accent: "text-classical",     border: "border-classical/40",     dot: "bg-classical",    hex: "#b4492b" },
    Medieval:      { accent: "text-medieval",      border: "border-medieval/40",      dot: "bg-medieval",     hex: "#2f6b4f" },
    "Early Modern":{ accent: "text-early-modern",  border: "border-early-modern/40",  dot: "bg-early-modern", hex: "#1f7272" },
    Modern:        { accent: "text-modern",        border: "border-modern/40",        dot: "bg-modern",       hex: "#6a4aa0" },
  };
  const accentMeta = ERA_ACCENT[era.label] ?? { accent: "text-ancient", border: "border-ancient/40", dot: "bg-ancient", hex: "#a66a12" };

  const range = `${era.start < 0 ? `${Math.abs(era.start)} BCE` : `${era.start} CE`} – ${isFinite(era.end) ? (era.end < 0 ? `${Math.abs(era.end)} BCE` : `${era.end} CE`) : "today"}`;

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <PageIntro
          crumbs={[{ href: "/timeline", label: "Timeline" }]}
          label={isFinite(era.start) ? range : "Before 3000 BCE"}
          accent={accentMeta.accent}
          title={era.label}
          lede={"blurb" in era ? era.blurb : undefined}
          aside={<p className="font-mono text-[12px] tracking-wide text-ink/50">{eraYears.length} map{eraYears.length !== 1 ? "s" : ""}</p>}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <PageHistory kind="timeline" slug={scope} name={era.label} heading="How the map changed" />
          {eraYears.length === 0 ? (
            <p className="text-ink/50">No maps in this period.</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-l border-t border-ink/10">
              {eraYears.map(year => (
                <li key={year} className="border-r border-b border-ink/10">
                  <Link href={`/map?year=${year}`} className="group block px-5 py-6 hover:bg-card transition-colors">
                    <span className="font-display font-light text-4xl sm:text-5xl tracking-[-0.03em] tabular-nums text-ink group-hover:text-accent transition-colors">
                      {Math.abs(year).toLocaleString("en-US")}
                    </span>
                    <span className="ml-1.5 font-mono text-[10px] text-ink/45">{year < 0 ? "BCE" : "CE"}</span>
                    <span className="block mt-1 text-[12px] text-ink/40 group-hover:text-accent transition-colors">Open map →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-20 sm:mt-28">
            <LinkRow
              title="Other ages"
              links={ERA_LIST.filter(e => e.label !== era.label).map(e => ({ href: `/timeline/${eraSlug(e.label)}`, label: e.label }))}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
