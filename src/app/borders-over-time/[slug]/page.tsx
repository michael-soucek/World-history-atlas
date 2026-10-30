import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import TimelapsePlayer from "@/components/TimelapsePlayer";
import { TIMELAPSES, TIMELAPSE_BY_SLUG, formatYear, type TimelapseFacts } from "@/data/timelapses";
import FACTS from "@/data/timelapseFacts.json";
import { buildPageMetadata, metaDescription } from "@/lib/seo";
import { JsonLd, breadcrumbLd } from "@/lib/jsonLd";

interface Props { params: Promise<{ slug: string }> }

const factsFor = (slug: string) => (FACTS as Record<string, TimelapseFacts>)[slug];

export function generateStaticParams() {
  return TIMELAPSES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = TIMELAPSE_BY_SLUG[slug];
  if (!t) return {};
  const f = factsFor(slug);
  const span = `${formatYear(f.from)}–${f.to}`;
  return buildPageMetadata({
    title: `${titleCase(t.possessive)} Borders Over Time: Animated Map, Every Year ${span}`,
    description: metaDescription(`Watch ${t.label}’s borders change year by year on an animated map, ${span}: every year drawn, the borders changing in ${f.changes.length} of them, with the largest states and what appeared or vanished.`)!,
    path: `/borders-over-time/${slug}`,
    imageUrl: `/timelapse/${slug}-wide.webp`,
  });
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const titleCase = (s: string) => s.replace(/(^|\s)(\p{Ll})/gu, (_, sp, c) => sp + c.toUpperCase());

function NameList({ items, max }: { items: { name: string; slug?: string }[]; max?: number }) {
  const shown = max ? items.slice(0, max) : items;
  return (
    <>
      {shown.map((it, i) => (
        <span key={it.name}>
          {i > 0 && ", "}
          {it.slug ? <Link href={`/place/${it.slug}`} className="hover:text-accent underline decoration-ink/15 underline-offset-4">{it.name}</Link> : it.name}
        </span>
      ))}
      {max && items.length > max && <span className="text-ink/64"> and {items.length - max} more</span>}
    </>
  );
}

export default async function TimelapsePage({ params }: Props) {
  const { slug } = await params;
  const t = TIMELAPSE_BY_SLUG[slug];
  if (!t) notFound();
  const facts = factsFor(slug);
  const years = facts.to - facts.from;
  const others = TIMELAPSES.filter((o) => o.slug !== slug);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <JsonLd data={breadcrumbLd([["Borders over time", "/borders-over-time"], [cap(t.label), `/borders-over-time/${slug}`]])} />
        <PageIntro
          label="Borders over time"
          crumbs={[{ href: "/borders-over-time", label: "Borders over time" }]}
          title={<>{t.possessive} borders, <span className="italic">{formatYear(facts.from)} to {facts.to}</span></>}
          lede={t.intro}
          aside={
            <p className="font-mono text-[12px] tracking-wide text-ink/68 leading-relaxed">
              every year drawn: {years.toLocaleString("en")} years<br />the borders change in {facts.changes.length} of them
            </p>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
          <section aria-label="Animated map">
            <TimelapsePlayer
              slug={slug}
              label={t.label}
              bbox={t.bbox}
              tallBbox={t.tallBbox}
              from={facts.from}
              to={facts.to}
              changes={facts.changes}
              events={facts.events}
              leaders={facts.leaders}
            />
          </section>

          <section aria-labelledby="by-year">
            <SectionRule count={`${facts.events.length} changes`}>
              <span id="by-year">The big changes, year by year</span>
            </SectionRule>
            <p className="max-w-3xl text-[16px] leading-relaxed text-ink/65 mb-8">
              Every year in which a large state — over 100,000 km² inside this view — appears on the map or
              vanishes from it. Smaller shifts happen in many more years; press play above to see them all.
            </p>
            <ol className="border-t border-ink/10">
              {facts.events.map((e) => (
                <li key={e.year} className="grid sm:grid-cols-[7rem_1fr] gap-x-6 gap-y-1 border-b border-ink/10 py-3">
                  <Link href={`/map?year=${e.year}`} className="font-display text-xl tabular-nums text-ink hover:text-accent">
                    {formatYear(e.year)}
                  </Link>
                  <div className="text-[15px] leading-relaxed text-ink/70 space-y-1">
                    {e.appeared.length > 0 && <p><span className="text-ink/64">New: </span><NameList items={e.appeared} max={8} /></p>}
                    {e.gone.length > 0 && <p><span className="text-ink/64">Gone: </span><NameList items={e.gone} max={8} /></p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="more">
            <SectionRule><span id="more">More time-lapses</span></SectionRule>
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 text-[16px]">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/borders-over-time/${o.slug}`} className="text-accent hover:underline underline-offset-4">
                    {o.possessive} borders over time →
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-col gap-1.5 text-[15px]">
              {t.region && (
                <li><Link href={`/region/${t.region}`} className="text-ink/70 hover:text-accent">The states and empires of {t.label} →</Link></li>
              )}
              <li><Link href="/compare" className="text-ink/70 hover:text-accent">Compare any two years side by side →</Link></li>
            </ul>
          </section>

          <p className="text-xs text-ink/66 leading-relaxed max-w-3xl">
            Borders from{" "}
            <a href="https://github.com/Seshat-Global-History-Databank/cliopatria" className="underline underline-offset-2" rel="noopener">Cliopatria</a>{" "}
            by the Seshat Global History Databank, licensed{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" className="underline underline-offset-2" rel="noopener">CC BY 4.0</a>;
            simplified, clipped to this view and coloured by empire here. Each shape records the years it applies to,
            so every year has its own map; pre-modern borders are approximate. Areas are measured on the sphere.
            The full atlas uses a different source and may differ in places.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
