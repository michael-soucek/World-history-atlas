import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import Gazetteer, { LinkRow } from "@/components/Gazetteer";
import { TIMELINE_ILLUSTRATIONS } from "@/data/timelineIllustrations";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { ERA_LIST, eraFromSlug, eraSlug } from "@/data/eras";
import { SNAPSHOT_YEARS, formatYear } from "@/data/snapshotYears";
import { CROSSWALK } from "@/data/crosswalk";
import { getEntityLifespan, overlapsEra } from "@/lib/entityTimeline";
import { buildPageMetadata, metaDescription } from "@/lib/seo";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return ERA_LIST.filter(e => isFinite(e.start)).map(era => ({ slug: eraSlug(era.label) }));
}

const fmtEraYear = (y: number) => (y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`);
/** "500–1400 CE", "3000–500 BCE", "1800 CE–today". */
function eraSpan(era: { start: number; end: number }): string {
  if (!isFinite(era.end)) return `${fmtEraYear(era.start)}–today`;
  if (era.start < 0 && era.end <= 0) return `${Math.abs(era.start)}–${Math.abs(era.end)} BCE`;
  if (era.start >= 0) return `${era.start}–${era.end} CE`;
  return `${fmtEraYear(era.start)}–${fmtEraYear(era.end)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const era = eraFromSlug(slug);
  if (!era) return { title: "Era — Borders of Time" };
  return buildPageMetadata({
    title: `The ${era.label} Era${isFinite(era.start) ? ` (${eraSpan(era)})` : ""}: Empires, Maps & People — Borders of Time`,
    description: metaDescription(era.blurb)!,
    path: `/era/${slug}`,
  });
}

export default async function EraPage({ params }: Props) {
  const { slug } = await params;
  const era = eraFromSlug(slug);
  if (!era) notFound();

  const eraYears = SNAPSHOT_YEARS.filter(y => y >= era.start && y < era.end);

  // Deduplicate by slug so alias entries (e.g. "Eastern Roman Empire" / "Byzantine Empire")
  // don't produce duplicate React keys.
  const placesRaw = Object.entries(CROSSWALK)
    .map(([name, entry]) => ({ name, ...entry }));
  const seenSlugs = new Set<string>();
  const uniquePlaces = placesRaw.filter(p => {
    if (seenSlugs.has(p.slug)) return false;
    seenSlugs.add(p.slug);
    return true;
  });

  const placesWithLifespan = await Promise.all(
    uniquePlaces.map(async (place) => {
      const lifespan = await getEntityLifespan(place.wikidataId);
      return { ...place, lifespan };
    }),
  );

  const places = placesWithLifespan
    .filter((place) => place.lifespan && overlapsEra(place.lifespan, era.start, era.end))
    .slice(0, 20);

  const ERA_ACCENT: Record<string, { accent: string; dot: string; cardBorder: string; cardHover: string; hex: string }> = {
    Prehistoric:   { accent: "text-prehistoric",  dot: "bg-prehistoric",   cardBorder: "border-prehistoric/25",  cardHover: "hover:border-prehistoric/50", hex: "#6d6457" },
    Ancient:       { accent: "text-ancient",       dot: "bg-ancient",       cardBorder: "border-ancient/25",       cardHover: "hover:border-ancient/50",       hex: "#a66a12" },
    Classical:     { accent: "text-classical",     dot: "bg-classical",     cardBorder: "border-classical/25",     cardHover: "hover:border-classical/50",     hex: "#b4492b" },
    Medieval:      { accent: "text-medieval",      dot: "bg-medieval",      cardBorder: "border-medieval/25",      cardHover: "hover:border-medieval/50",      hex: "#2f6b4f" },
    "Early Modern":{ accent: "text-early-modern",  dot: "bg-early-modern",  cardBorder: "border-early-modern/25",  cardHover: "hover:border-early-modern/50",  hex: "#1f7272" },
    Modern:        { accent: "text-modern",        dot: "bg-modern",        cardBorder: "border-modern/25",        cardHover: "hover:border-modern/50",        hex: "#6a4aa0" },
  };
  const meta = ERA_ACCENT[era.label] ?? { accent: "text-ancient", dot: "bg-ancient", cardBorder: "border-ancient/25", cardHover: "hover:border-ancient/50", hex: "#a66a12" };

  const art = TIMELINE_ILLUSTRATIONS[era.label];
  const range = `${era.start < 0 ? `${Math.abs(era.start)} BCE` : `${era.start} CE`} – ${isFinite(era.end) ? (era.end < 0 ? `${Math.abs(era.end)} BCE` : `${era.end} CE`) : "today"}`;
  const eraIndex = ERA_LIST.findIndex(e => e.label === era.label);

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            collectionLd(`The ${era.label} era`, era.blurb ?? "", `/era/${slug}`, places.map((p) => ({ name: p.name, path: `/place/${p.slug}` }))),
            breadcrumbLd([["Browse", "/browse"], [`${era.label} era`, `/era/${slug}`]]),
          ]}
        />
        <PageIntro
          crumbs={[{ href: "/browse", label: "Browse" }, { href: "/browse#eras", label: "Ages" }]}
          label={`Age ${["I", "II", "III", "IV", "V", "VI"][eraIndex] ?? ""} · ${range}`}
          accent={meta.accent}
          title={era.label}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
            {art && (
              <figure className="lg:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={art.src} alt={art.alt} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: art.objectPosition }} />
                </div>
                <figcaption className="mt-3 font-text italic text-[14px] text-ink/60">
                  {art.caption}
                  <span className="block not-italic font-sans text-[11px] text-ink/35 mt-1">{art.credit}</span>
                </figcaption>
              </figure>
            )}
            <div className={art ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-8"}>
              {"blurb" in era && era.blurb && (
                <>
                  <p className="font-text text-[22px] sm:text-[26px] leading-[1.5] text-ink/85 dropcap">{era.blurb}</p>
                  <div className="mt-6"><ReadAloudButton text={era.blurb} /></div>
                </>
              )}

              {eraYears.length > 0 && (
                <section className="mt-16">
                  <SectionRule count={`${eraYears.length} maps`}>Maps of this age</SectionRule>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 border-l border-t border-ink/10">
                    {eraYears.map(year => (
                      <li key={year} className="border-r border-b border-ink/10">
                        <Link href={`/map?year=${year}`} className="group block px-4 py-5 hover:bg-card transition-colors">
                          <span className={`font-display font-light text-4xl tracking-tight tabular-nums text-ink group-hover:text-accent transition-colors`}>
                            {Math.abs(year)}
                          </span>
                          <span className="ml-1 font-mono text-[10px] text-ink/45">{year < 0 ? "BCE" : "CE"}</span>
                          <span className="block mt-1 text-[12px] text-ink/40 group-hover:text-accent transition-colors">Open map →</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          {places.length > 0 && (
            <section className="mt-20 sm:mt-28">
              <SectionRule count={`${places.length} places`}>Empires &amp; states of the {era.label.toLowerCase()} age</SectionRule>
              <Gazetteer
                items={places.map(place => ({
                  href: `/place/${place.slug}`,
                  name: place.name,
                  meta: place.lifespan && isFinite(place.lifespan.validFrom) && isFinite(place.lifespan.validTo)
                    ? `${fmtShort(place.lifespan.validFrom)}–${fmtShort(place.lifespan.validTo)}`
                    : undefined,
                }))}
              />
            </section>
          )}

          <div className="mt-20 sm:mt-28 space-y-12">
            {era.label === "Early Modern" && (
              <LinkRow title="Related theme" links={[{ href: "/theme/age-of-exploration", label: "The Age of Exploration" }]} />
            )}
            <LinkRow
              title="Other ages"
              links={ERA_LIST.filter(e => e.label !== era.label && isFinite(e.start)).map(e => ({ href: `/era/${eraSlug(e.label)}`, label: e.label }))}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function fmtShort(y: number) {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y}`;
}
