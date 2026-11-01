import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHistory from "@/components/PageHistory";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import VisitBox from "@/components/VisitBox";
import { LinkRow } from "@/components/Gazetteer";
import { SpanRow, formatYear, mapHref } from "@/components/RulerTimeline";
import { canVisitCity } from "@/data/visit";
import { getCanonicalNameByQid, lookupBySlug } from "@/data/crosswalk";
import { SITE_LIST, builtLabel, citiesNear, getSite, nearbySites, siteRulersOf, type Site } from "@/lib/siteHistory";
import type { RulerSpan } from "@/lib/cityHistory";
import { getOurArticle } from "@/lib/ourArticles";
import { buildPageMetadata, metaDescription, fitTitle } from "@/lib/seo";
import { JsonLd, SITE_URL, breadcrumbLd } from "@/lib/jsonLd";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import { countryHref, countrySlugFor, getCountry } from "@/lib/countries";
import { publishedCountries } from "@/lib/countryPages";

interface Props { params: Promise<{ slug: string }> }

/** Sites we don't point readers to for tours and tickets. */
const NO_VISIT_SITES = new Set(["auschwitz", "dome-of-the-rock"]);

export function generateStaticParams() {
  return SITE_LIST.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) return { title: "Historic site — Borders of Time" };
  return buildPageMetadata({
    title: fitTitle(`${site.name}: History, Map and Who Ruled It`, `${site.name}: History and Map`, `${site.name}: History`),
    description: siteDescription(site, siteRulersOf(site)),
    path: `/site/${slug}`,
  });
}

/** The atlas name of a ruler's page ("Roman Empire", not the map's "Rome (Galerius)"). */
const atlasName = (href: string) => {
  const entry = lookupBySlug(href.replace("/place/", ""));
  return entry ? getCanonicalNameByQid(entry.wikidataId) : undefined;
};

/** The distinct linked rulers, in order, by their atlas names. */
function rulerNames(spans: RulerSpan[]): string[] {
  return [...new Map(spans.filter((s) => s.href && s.name).map((s) => [s.href, atlasName(s.href!) ?? s.name!])).values()];
}

function siteDescription(site: Site, spans: RulerSpan[]): string {
  const opening = getOurArticle("site", site.slug)?.blocks.find((b) => b.kind === "p")?.text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  const names = rulerNames(spans).slice(-4);
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
  const held = list ? ` Held by ${list}: see each on historical maps.` : " See it on historical maps.";
  const first = opening?.split(/(?<=\.)\s/)[0] ?? `${site.name}, in ${site.country}, dates from ${builtLabel(site.built)}.`;
  return metaDescription(`${first}${held}`)!;
}

/** The map snapshot in force when the site was made: the latest one at or before its build year. */
function snapshotAt(year: number): number {
  return [...SNAPSHOT_YEARS].reverse().find((y) => y <= year) ?? SNAPSHOT_YEARS[0];
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  const spans = siteRulersOf(site);
  const names = rulerNames(spans);
  const builtYear = snapshotAt(site.built);
  const countryLink = countryHref(site.country, publishedCountries());
  const countryName = getCountry(countrySlugFor(site.country) ?? "")?.name ?? site.country;
  const textLink = "underline underline-offset-4 decoration-ink/25 hover:text-accent transition-colors";

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            {
              "@type": "LandmarksOrHistoricalBuildings",
              name: site.name,
              containedInPlace: { "@type": "Country", name: site.country },
              geo: { "@type": "GeoCoordinates", latitude: site.lat, longitude: site.lng },
              sameAs: `https://www.wikidata.org/wiki/${site.wikidataId}`,
              url: `${SITE_URL}/site/${site.slug}`,
            },
            breadcrumbLd([["Historic sites", "/sites"], [site.name, `/site/${site.slug}`]]),
          ]}
        />
        <PageIntro
          crumbs={[{ href: "/sites", label: "Historic sites" }]}
          label={site.country}
          title={<span className="italic">{site.name}</span>}
          lede={
            <>
              Dates from {builtLabel(site.built)}.
              {names.length > 0 ? (
                <> Since then, our maps have drawn the ground it stands on inside {names.length} different {names.length === 1 ? "state" : "states, empires and peoples"}.</>
              ) : null}
              {countryLink ? <> Read the <Link href={countryLink} className={textLink}>history of {countryName}</Link>.</> : null}
            </>
          }
          aside={
            <Link
              href={mapHref(site, builtYear)}
              className="group inline-flex items-center gap-3 h-12 pl-6 pr-5 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors"
            >
              See it on the map
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <PageHistory kind="site" slug={site.slug} name={site.name} heading={`The history of ${site.name}`} />
          {spans.length > 0 && (
            <section>
              <SectionRule count={`${spans.length} periods`}>Who held it</SectionRule>
              <ol className="max-w-3xl">
                {spans.map((s, i) => <SpanRow key={s.from} point={site} span={s} mapYear={i === 0 ? builtYear : undefined} />)}
              </ol>
              <p className="mt-10 max-w-3xl text-sm text-ink/68 leading-relaxed">
                The first row starts at the site’s approximate date, {formatYear(site.built)}; later dates are the years of our map
                snapshots, which are decades or centuries apart, so a change shown between two years happened at some point in that
                gap. The borders come from the historical-basemaps project and are approximate, especially for the ancient world and
                for peoples without fixed frontiers.
              </p>
            </section>
          )}

          {canVisitCity(site) && !NO_VISIT_SITES.has(site.slug) && (
            <div className="mt-20 sm:mt-28">
              <VisitBox
                place={site.name}
                query={site.name}
                what={`Tickets, guided tours and day trips to ${site.name}.`}
              />
            </div>
          )}

          <div className="mt-20 sm:mt-28 space-y-12">
            <LinkRow title="Nearby historic sites" links={nearbySites(site).map((s) => ({ href: `/site/${s.slug}`, label: s.name }))} />
            <LinkRow title="Nearby cities" links={citiesNear(site).map((c) => ({ href: `/history-of/${c.slug}`, label: c.name }))} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
