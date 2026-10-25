import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import { LinkRow } from "@/components/Gazetteer";
import OurArticle from "@/components/OurArticle";
import { JsonLd, articleLd, breadcrumbLd } from "@/lib/jsonLd";
import { buildPageMetadata, metaDescription } from "@/lib/seo";
import { articleIntro, articleWordCount, getOurArticle } from "@/lib/ourArticles";
import { backlinksTo, type Backlink } from "@/lib/backlinks";
import type { RulerSpan } from "@/lib/cityHistory";
import {
  CONTINENTS, COUNTRY_LIST, citiesIn, countryRulers, countryView, countryWithArticle, getCountry, statesOver,
  type Country, type StateOverCountry,
} from "@/lib/countries";

interface Props { params: Promise<{ slug: string }> }

/** Only countries whose article has been written get a page. */
export function generateStaticParams() {
  return COUNTRY_LIST.filter((c) => getOurArticle("country", c.slug)).map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);
  const article = country && getOurArticle("country", slug);
  if (!country || !article) return { title: "Country — Borders of Time" };
  return buildPageMetadata({
    title: `History of ${countryWithArticle(country)}: Timeline, Empires & Maps — Borders of Time`,
    description: metaDescription(articleIntro(article)) ?? `The history of ${countryWithArticle(country)}, from its first peoples to today.`,
    path: `/country/${slug}`,
  });
}

const fmtYear = (y: number) => (y < 0 ? `${Math.abs(y) >= 10000 ? Math.abs(y).toLocaleString("en-US") : -y} BCE` : `${y} CE`);
/** Timeline years from the article: "~-3000" → "c. 3000 BCE", "1291" → "1291". */
function fmtKeyYear(raw: string): string {
  const approx = raw.startsWith("~");
  const n = Number(raw.replace("~", ""));
  const y = n < 0 ? `${-n} BCE` : n < 1000 ? `${n} CE` : String(n);
  return approx ? `c. ${y}` : y;
}

const textLink = "underline underline-offset-4 decoration-ink/25 hover:text-accent transition-colors";

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const country = getCountry(slug);
  const article = country && getOurArticle("country", slug);
  if (!country || !article) notFound();

  const view = countryView(slug);
  const mapHref = (year: number) => `/map?year=${year}&lat=${view?.lat ?? country.lat}&lng=${view?.lng ?? country.lng}&z=${view?.zoom ?? 5}`;
  const rulers = countryRulers(slug);
  const states = statesOver(country);
  const cities = citiesIn(country);
  const backlinks = backlinksTo(`/country/${slug}`);
  const continent = CONTINENTS.find((c) => c.slug === country.continent)!;
  const neighbours = nearestCountries(country);
  const title = countryWithArticle(country);

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            articleLd({
              headline: `History of ${title}`,
              path: `/country/${slug}`,
              description: articleIntro(article),
              written: article.written,
              wordCount: articleWordCount(article),
              citations: article.sources.map((s) => s.href),
              about: { "@type": "Country", name: country.name, sameAs: `https://www.wikidata.org/wiki/${country.wikidataId}` },
            }),
            breadcrumbLd([["Countries", "/countries"], [country.name, `/country/${slug}`]]),
          ]}
        />
        <PageIntro
          crumbs={[{ href: "/countries", label: "Countries" }, { href: `/countries#${continent.slug}`, label: continent.label }]}
          label={continent.label}
          title={<>The history of <span className="italic">{title}</span></>}
          lede={<>The whole story, from the first peoples to today, with every state that has held {country.capital} on our historical maps.</>}
          aside={
            <Link
              href={mapHref(2010)}
              className="group inline-flex items-center gap-3 h-12 pl-6 pr-5 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors"
            >
              See it on the map
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-12 lg:gap-16">
          <div className="min-w-0 max-w-3xl">
            {article.timeline.length > 0 && (
              <details className="lg:hidden mb-10 border-y border-ink/10 py-4 group">
                <summary className="cursor-pointer list-none flex items-center justify-between label text-ink/55 [&::-webkit-details-marker]:hidden">
                  Key dates ({article.timeline.length})
                  <span className="text-ink/40 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <KeyDates items={article.timeline} className="mt-5" hideTitle />
              </details>
            )}
            <OurArticle article={article} name={country.name} />
          </div>
          <aside className="hidden lg:block">
            {article.timeline.length > 0 && <KeyDates items={article.timeline} className="sticky top-24" />}
          </aside>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-20 sm:space-y-24">
          {rulers.length > 1 && (
            <section>
              <SectionRule count={`${rulers.length} periods`}>Who held {country.capital}?</SectionRule>
              <p className="max-w-3xl -mt-2 mb-6 text-[15px] text-ink/60 leading-relaxed">
                The state drawn at the site of today&rsquo;s capital on each of our maps. Open any year to see the borders of the time.
              </p>
              <ol className="max-w-3xl">
                {rulers.map((s) => <RulerRow key={s.from} span={s} href={mapHref(s.from)} />)}
              </ol>
            </section>
          )}

          {states.length > 0 && <StatesOver country={country} states={states} />}

          <MentionedIn country={country} backlinks={backlinks} />

          <div className="space-y-12">
            {cities.length > 0 && (
              <LinkRow title={`Who ruled its cities?`} links={cities.map((c) => ({ href: `/history-of/${c.slug}`, label: c.name }))} />
            )}
            <LinkRow title="Nearby countries" links={neighbours.map((c) => ({ href: `/country/${c.slug}`, label: c.name }))} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function KeyDates({ items, className = "", hideTitle = false }: { items: { year: string; text: string }[]; className?: string; hideTitle?: boolean }) {
  return (
    <section className={className} aria-label="Key dates">
      {!hideTitle && <h2 className="label text-ink/45 mb-4">Key dates</h2>}
      <ol className="border-l border-ink/15">
        {items.map((d, i) => (
          <li key={i} className="relative pl-5 pb-4 last:pb-0">
            <span className="absolute -left-[4px] top-[7px] w-[7px] h-[7px] rounded-full bg-accent" aria-hidden="true" />
            <span className="block font-mono text-[12px] tracking-wide text-ink/55 tabular-nums">{fmtKeyYear(d.year)}</span>
            <span className="block text-[14px] leading-snug text-ink/80">{d.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function RulerRow({ span, href }: { span: RulerSpan; href: string }) {
  const years = `${fmtYear(span.from)} – ${span.to === null ? "today" : fmtYear(span.to)}`;
  return (
    <li className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[11rem_1fr_auto] gap-x-6 items-baseline py-3.5 border-b border-ink/10">
      <span className="font-mono text-[12px] tracking-wide text-ink/50 tabular-nums">{years}</span>
      <span className="min-w-0">
        {span.name ? (
          span.href ? (
            <Link href={span.href} className="font-display text-xl tracking-tight text-ink hover:text-accent transition-colors">{span.name}</Link>
          ) : (
            <span className="font-display text-xl tracking-tight text-ink">{span.name}</span>
          )
        ) : (
          <span className="text-[15px] italic text-ink/40">No state drawn here on the map</span>
        )}
        {span.sovereign && <span className="block text-[13px] text-ink/50 mt-0.5">under {span.sovereign}</span>}
      </span>
      <Link href={href} className="col-start-2 sm:col-start-auto mt-1 sm:mt-0 font-mono text-[11px] tracking-wide text-ink/40 hover:text-accent transition-colors">
        Map of {fmtYear(span.from)} →
      </Link>
    </li>
  );
}

function StatesOver({ country, states }: { country: Country; states: StateOverCountry[] }) {
  return (
    <section>
      <SectionRule count={`${states.length}`}>Empires and states on this land</SectionRule>
      <p className="max-w-3xl -mt-2 mb-6 text-[15px] text-ink/60 leading-relaxed">
        Every state in the atlas whose territory, at its height, reached into today&rsquo;s {countryWithArticle(country)}.
      </p>
      <ul className="columns-1 sm:columns-2 lg:columns-3 gap-x-10">
        {states.map((s) => (
          <li key={s.slug} className="break-inside-avoid border-b border-ink/10 py-2.5 flex items-baseline justify-between gap-4">
            <Link href={`/place/${s.slug}`} className="text-[16px] text-ink hover:text-accent transition-colors">{s.name}</Link>
            <span className="font-mono text-[11px] text-ink/40 tabular-nums whitespace-nowrap">
              {s.from === s.to ? fmtYear(s.from) : `${fmtYear(s.from)}–${s.to >= 2010 ? "" : fmtYear(s.to)}`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const GROUPS: [Backlink["kind"], string][] = [
  ["person", "People"],
  ["place", "Empires and states"],
  ["event", "Events"],
  ["culture", "Cultures"],
  ["philosophy", "Philosophy"],
  ["country", "Other countries"],
];

function MentionedIn({ country, backlinks }: { country: Country; backlinks: Backlink[] }) {
  const groups = GROUPS.map(([kind, label]) => [label, backlinks.filter((b) => b.kind === kind).sort((a, b) => a.name.localeCompare(b.name))] as const).filter(
    ([, items]) => items.length,
  );
  if (!groups.length) return null;
  return (
    <section className="max-w-4xl">
      <SectionRule>{country.name} elsewhere on the site</SectionRule>
      <dl className="space-y-5">
        {groups.map(([label, items]) => (
          <div key={label}>
            <dt className="label text-ink/40">{label}</dt>
            <dd className="mt-1.5 text-[16px] leading-relaxed text-ink/75">
              {items.map((b, i) => (
                <span key={b.href}>{i > 0 && ", "}<Link href={b.href} className={textLink}>{b.name}</Link></span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** The six countries with the closest capitals that have pages. */
function nearestCountries(country: Country): Country[] {
  const rad = Math.PI / 180;
  const dist = (a: Country, b: Country) => {
    const h = Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lng - a.lng) * rad) / 2) ** 2;
    return Math.asin(Math.sqrt(h));
  };
  return COUNTRY_LIST.filter((c) => c.slug !== country.slug && getOurArticle("country", c.slug))
    .map((c) => ({ c, d: dist(country, c) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 6)
    .map((x) => x.c);
}

