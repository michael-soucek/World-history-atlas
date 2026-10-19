import type { Metadata } from "next";
import { getCanonicalNameByQid, lookupBySlug } from "@/data/crosswalk";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import { LinkRow } from "@/components/Gazetteer";
import { CITY_LIST, distinctRulers, getCity, nearbyCities, rulersOf, type City, type RulerSpan } from "@/lib/cityHistory";
import { buildPageMetadata, metaDescription } from "@/lib/seo";
import { JsonLd, SITE_URL, breadcrumbLd } from "@/lib/jsonLd";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return CITY_LIST.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "City — Borders of Time" };
  const spans = rulersOf(slug);
  return buildPageMetadata({
    title: `Who Ruled ${city.name}? History of ${city.name} on the Map — Borders of Time`,
    description: cityDescription(city, spans),
    path: `/history-of/${slug}`,
  });
}

/**
 * "Who ruled Budapest? The Avars, Great Moravia, Hungary, the Ottoman Empire
 * and Austria-Hungary: every state that has held the city, on historical maps."
 * Names are the distinct states with atlas pages, most recent kept when there
 * are too many; padded with plain map names for cities with few linked rulers.
 */
const atlasName = (href: string) => {
  const entry = lookupBySlug(href.replace("/place/", ""));
  return entry ? getCanonicalNameByQid(entry.wikidataId) : undefined;
};

function cityDescription(city: City, spans: RulerSpan[]): string {
  // Linked rulers by their atlas name ("Roman Empire", not the map's "Rome (Galerius)").
  const linked = [...new Map(spans.filter((s) => s.href && s.name).map((s) => [s.href, atlasName(s.href!) ?? s.name!])).values()];
  const names = (linked.length >= 3 ? linked : distinctRulers(spans)).slice(-5);
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0] ?? "";
  const formerly = city.formerly ? ` (${city.formerly})` : "";
  return metaDescription(
    `Who ruled ${city.name}${formerly}? ${list}: every state that has held the city, traced through historical maps from ${formatYear(spans[0]?.from ?? 0)} to today.`,
  )!;
}

/** "-123000" → "123,000 BCE": snapshot years reach far into prehistory. */
const formatYear = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y} CE`);

/** Link to the atlas at this snapshot year, centred on the city. */
const mapHref = (city: City, year: number) => `/map?year=${year}&lat=${city.lat}&lng=${city.lng}&z=5`;

export default async function CityHistoryPage({ params }: Props) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const spans = rulersOf(slug);
  const rulers = distinctRulers(spans);
  const current = spans.at(-1);

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            {
              "@type": "City",
              name: city.name,
              alternateName: city.formerly?.split(", "),
              containedInPlace: { "@type": "Country", name: city.country },
              geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng },
              url: `${SITE_URL}/history-of/${city.slug}`,
            },
            breadcrumbLd([["Who ruled it?", "/history-of"], [city.name, `/history-of/${city.slug}`]]),
          ]}
        />
        <PageIntro
          crumbs={[{ href: "/history-of", label: "Who ruled it?" }]}
          label={`${city.country}`}
          title={<>Who ruled <span className="italic">{city.name}</span>?</>}
          lede={
            <>
              On our historical maps, {city.name} has been drawn inside {rulers.length} different states, empires and peoples
              {spans[0] ? <>, from {formatYear(spans[0].from)} to today</> : null}.
              {city.formerly ? <> It has also been known as {city.formerly}.</> : null}
            </>
          }
          aside={
            <Link
              href={mapHref(city, current?.from ?? 2010)}
              className="group inline-flex items-center gap-3 h-12 pl-6 pr-5 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors"
            >
              See it on the map
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <section>
            <SectionRule count={`${spans.length} periods`}>Timeline</SectionRule>
            <ol className="max-w-3xl">
              {spans.map((s) => <SpanRow key={s.from} city={city} span={s} />)}
            </ol>
            <p className="mt-10 max-w-3xl text-sm text-ink/50 leading-relaxed">
              Dates are the years of our map snapshots, which are decades or centuries apart, so a change
              shown between two years happened at some point in that gap. The borders come from the
              historical-basemaps project and are approximate, especially for the ancient world and for
              peoples without fixed frontiers.
            </p>
          </section>

          <div className="mt-20 sm:mt-28 space-y-12">
            <LinkRow title="Nearby cities" links={nearbyCities(city).map((c) => ({ href: `/history-of/${c.slug}`, label: c.name }))} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function SpanRow({ city, span }: { city: City; span: RulerSpan }) {
  const years = `${formatYear(span.from)} – ${span.to === null ? "today" : formatYear(span.to)}`;
  return (
    <li className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[11rem_1fr_auto] gap-x-6 items-baseline py-4 border-b border-ink/10">
      <span className="font-mono text-[12px] tracking-wide text-ink/50 tabular-nums">{years}</span>
      <span className="min-w-0">
        {span.name ? (
          span.href ? (
            <Link href={span.href} className="font-display text-xl sm:text-2xl tracking-tight text-ink hover:text-accent transition-colors">
              {span.name}
            </Link>
          ) : (
            <span className="font-display text-xl sm:text-2xl tracking-tight text-ink">{span.name}</span>
          )
        ) : (
          <span className="text-[15px] italic text-ink/40">No state drawn here on the map</span>
        )}
        {span.sovereign && <span className="block text-[13px] text-ink/50 mt-0.5">under {span.sovereign}</span>}
      </span>
      <Link
        href={mapHref(city, span.from)}
        className="col-start-2 sm:col-start-auto mt-1 sm:mt-0 font-mono text-[11px] tracking-wide text-ink/40 hover:text-accent transition-colors"
      >
        Map of {formatYear(span.from)} →
      </Link>
    </li>
  );
}
