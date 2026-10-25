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
import { connectedTo, fmtSpan, type TimedEntry } from "@/lib/entityContext";
import { TOURS } from "@/data/tours";
import { withArticle } from "@/lib/placeMaps";
import { countryHref, countrySlugFor, getCountry } from "@/lib/countries";
import { publishedCountries } from "@/lib/countryPages";

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
const formatYear = (y: number) => (y < 0 ? `${Math.abs(y) >= 10000 ? Math.abs(y).toLocaleString("en-US") : -y} BCE` : `${y} CE`);

/** Link to the atlas at this snapshot year, centred on the city. */
const mapHref = (city: City, year: number) => `/map?year=${year}&lat=${city.lat}&lng=${city.lng}&z=5`;

export default async function CityHistoryPage({ params }: Props) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const spans = rulersOf(slug);
  const rulers = distinctRulers(spans);
  const current = spans.at(-1);
  const names = [city.name, ...(city.formerly?.split(", ") ?? [])];
  const connected = await connectedTo(names);
  const tours = toursThrough(names);
  const countryLink = countryHref(city.country, publishedCountries());
  const countryName = getCountry(countrySlugFor(city.country) ?? "")?.name ?? city.country;

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
              {countryLink ? <> Read the <Link href={countryLink} className="underline underline-offset-4 decoration-ink/25 hover:text-accent transition-colors">history of {countryName}</Link>.</> : null}
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
            <CityAnswers city={city} spans={spans} />
            <p className="mt-10 max-w-3xl text-sm text-ink/50 leading-relaxed">
              Dates are the years of our map snapshots, which are decades or centuries apart, so a change
              shown between two years happened at some point in that gap. The borders come from the
              historical-basemaps project and are approximate, especially for the ancient world and for
              peoples without fixed frontiers.
            </p>
          </section>

          <Connections city={city} connected={connected} tours={tours} />

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

/** Tours whose narration names the city, under any of its names (case-sensitive: "Nice", not "nice"). */
function toursThrough(names: string[]) {
  const re = new RegExp(`\\b(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`);
  return TOURS.flatMap((t) => {
    const stop = t.steps.findIndex((s) => re.test(`${s.title} ${s.text}`) || (s.markers ?? []).some((m) => re.test(m.label)));
    return stop === -1 ? [] : [{ slug: t.slug, title: t.title, stop: stop + 1 }];
  });
}

const textLink = "underline underline-offset-4 decoration-ink/25 hover:text-accent transition-colors";

/** A ruler's name, linked to its atlas page when it has one. */
function Name({ s }: { s: RulerSpan }) {
  return s.href ? <Link href={s.href} className={textLink}>{s.name}</Link> : <>{s.name ?? "no state on the map"}</>;
}

/** Who ruled the city at a few landmark dates, the longest rule, and how often it changed hands. */
function CityAnswers({ city, spans }: { city: City; spans: RulerSpan[] }) {
  const named = spans.filter((s) => s.name);
  if (named.length < 2) return null;
  const end = (s: RulerSpan) => s.to ?? 2010;
  // The early maps are centuries apart, so a span there looks far longer than
  // it was: measure "longest" from 500 BCE and count changes from 1 CE.
  const FROM = -500;
  const historic = named.filter((s) => s.from >= FROM);
  const longest = historic.length ? historic.reduce((a, b) => (end(b) - b.from > end(a) - a.from ? b : a)) : undefined;
  const since = [...named].reverse().find((s) => s.from <= 1) ?? named[0];
  const recent = named.slice(named.indexOf(since));
  const changes = recent.slice(1).filter((s, i) => (s.href ?? s.name) !== (recent[i].href ?? recent[i].name)).length;
  const current = spans.at(-1)!;
  const at = (year: number) => [...spans].reverse().find((s) => s.from <= year);
  const checkpoints = [1, 1000, 1500, 1900]
    .filter((y) => y >= named[0].from)
    .map((y) => ({ y, s: at(y) }))
    .filter((c): c is { y: number; s: RulerSpan } => !!c.s);
  const items: { q: string; a: React.ReactNode }[] = [];
  if (current.name) items.push({ q: `Who rules ${city.name} today?`, a: <>On the latest map, {city.name} is in <Name s={current} />.</> });
  if (longest) {
    const years = end(longest) - longest.from;
    items.push({
      q: `Who ruled ${city.name} the longest?`,
      a: <>On our maps, {longest.name ? withArticle(longest.name).slice(0, -longest.name.length) : ""}<Name s={longest} />, for about {years.toLocaleString("en-US")} years ({formatYear(longest.from)} to {longest.to === null ? "today" : formatYear(longest.to)}).</>,
    });
  }
  items.push({ q: `How many times has ${city.name} changed hands?`, a: <>Our maps show it passing to a new ruler {changes} {changes === 1 ? "time" : "times"} since {since.from <= 1 ? "1 CE" : formatYear(since.from)}.</> });
  if (checkpoints.length >= 2) {
    items.push({
      q: `Who ruled ${city.name} in ${checkpoints.map((c) => (c.y === 1 ? "1 CE" : c.y)).join(", ").replace(/, ([^,]*)$/, " and $1")}?`,
      a: (
        <>
          {checkpoints.map(({ y, s }, i) => (
            <span key={y}>{i > 0 && " "}In {y === 1 ? "1 CE" : y}: <Name s={s} />.</span>
          ))}
        </>
      ),
    });
  }
  return (
    <section className="mt-14 max-w-3xl" aria-labelledby="city-answers">
      <h2 id="city-answers" className="label text-ink/45 mb-4">Quick answers</h2>
      <dl className="divide-y divide-ink/10 border-y border-ink/10">
        {items.map(({ q, a }) => (
          <div key={q} className="py-4">
            <dt className="font-display text-[19px] leading-snug tracking-tight text-ink">{q}</dt>
            <dd className="mt-1.5 text-[16px] leading-relaxed text-ink/75">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** People born or died in the city, events there, and tours that pass through. */
function Connections({
  city,
  connected,
  tours,
}: {
  city: City;
  connected: { born: TimedEntry[]; died: TimedEntry[]; events: TimedEntry[] };
  tours: { slug: string; title: string; stop: number }[];
}) {
  const groups: [string, React.ReactNode[]][] = [
    [`Born in ${city.name}`, connected.born.map((e) => <EntryLink key={e.slug} e={e} />)],
    [`Died in ${city.name}`, connected.died.map((e) => <EntryLink key={e.slug} e={e} />)],
    [`Events in ${city.name}`, connected.events.map((e) => <EntryLink key={e.slug} e={e} />)],
    [
      `${city.name} in the guided tours`,
      tours.map((t) => (
        <Link key={t.slug} href={`/tour/${t.slug}${t.stop > 1 ? `?stop=${t.stop}` : ""}`} className={textLink}>{t.title}</Link>
      )),
    ],
  ];
  const shown = groups.filter(([, items]) => items.length);
  if (!shown.length) return null;
  return (
    <section className="mt-20 sm:mt-28 max-w-3xl">
      <SectionRule>{city.name} on this site</SectionRule>
      <dl className="space-y-5">
        {shown.map(([title, items]) => (
          <div key={title}>
            <dt className="label text-ink/40">{title}</dt>
            <dd className="mt-1.5 text-[16px] leading-relaxed text-ink/75">
              {items.map((item, i) => (
                <span key={i}>{i > 0 && (i === items.length - 1 ? " and " : ", ")}{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function EntryLink({ e }: { e: TimedEntry }) {
  return (
    <>
      <Link href={`/${e.kind}/${e.slug}`} className={textLink}>{e.name}</Link>
      {e.start !== undefined && e.end !== undefined ? <span className="text-ink/45"> ({fmtSpan(e.start, e.end)})</span> : null}
    </>
  );
}
