/**
 * Shared entity page layout — used by /place, /person, /event, /culture.
 * Renders the title block, lead picture, key-facts strip, article and the
 * map sidebar.
 */
import Link from "next/link";
import { JsonLd, breadcrumbLd } from "@/lib/jsonLd";
import { citiesHeldBy, toursFeaturing, toursOfEvent } from "@/lib/relatedLinks";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import RelatedResources from "@/components/RelatedResources";
import AdSlot from "@/components/AdSlot";
import SupportNudge from "@/components/SupportNudge";
import ArticleBody, { splitHero } from "@/components/ArticleBody";
import ArticleImage from "@/components/ArticleImage";
import PlaceOnOurMaps from "@/components/PlaceOnOurMaps";
import EntityInTime from "@/components/EntityInTime";
import { contextDescription, entityContext } from "@/lib/entityContext";
import { placeDescription } from "@/lib/placeMaps";
import { getEntityImages } from "@/lib/entityImages";
import type { PlaceContent, EntityType } from "@/types";
import type { CrosswalkEntry } from "@/types";
import { ENTITY_PLACE_OVERRIDE, ENTITY_YEAR_OVERRIDE } from "@/data/entityPlaceLinks";

interface EntityPageProps {
  content: PlaceContent;
  entry: CrosswalkEntry;
  entityType: EntityType;
  baseRoute: string; // e.g. "person", "place"
  /** Overrides the computed map link (places use their curated crosswalk view). */
  map?: { href: string; year?: number };
}

const TYPE_LABELS: Record<EntityType, string> = {
  place:   "Place",
  person:  "Person",
  event:   "Event",
  culture: "Culture",
};

const TYPE_PLURAL: Record<EntityType, string> = {
  place:   "Places",
  person:  "People",
  event:   "Events",
  culture: "Cultures",
};

function fmtYear(y: number) {
  return y > 0 ? `${y} CE` : `${Math.abs(y)} BCE`;
}

/**
 * A year as an ISO 8601 date for structured data: "1066", or for BCE the
 * astronomical year ("500 BCE" → "-0499"). Accepts a key-fact string like
 * "1066 CE" / "500 BCE" or a signed number (negative = BCE).
 */
function isoYear(y: string | number | undefined): string | undefined {
  if (y === undefined) return undefined;
  let year: number;
  if (typeof y === "number") year = y;
  else {
    const m = y.match(/^(\d+)\s*(BCE|CE)?$/);
    if (!m) return undefined;
    year = m[2] === "BCE" ? -Number(m[1]) : Number(m[1]);
  }
  if (!Number.isFinite(year) || year === 0) return undefined;
  const astronomical = year < 0 ? year + 1 : year;
  const digits = String(Math.abs(astronomical)).padStart(4, "0");
  return astronomical < 0 ? `-${digits}` : digits;
}

export default async function EntityPage({ content, entry, entityType, baseRoute, map }: EntityPageProps) {
  const images = await getEntityImages(entry.wikidataId, content.imageUrl);
  const ctx = entityType === "place" ? null : await entityContext(entityType, entry.slug);
  const { hero, rest } = splitHero(content, images);

  // A place *is* a territory, so its own QID resolves on the map directly.
  // A person/event/culture's own QID never will — use its curated place
  // override if one exists, otherwise link by year alone rather than send
  // visitors to a map that can't load anything for the region. See
  // src/data/entityPlaceLinks.ts.
  const mapRegionId = entityType === "place" ? entry.wikidataId : ENTITY_PLACE_OVERRIDE[entry.slug];
  // A few entries need a different year than their own computed
  // representativeYear for the map link specifically — see
  // ENTITY_YEAR_OVERRIDE's doc comment. The page's own key-facts year is
  // untouched; only the "See on map" year/label are affected.
  const mapYear = map ? map.year : (ENTITY_YEAR_OVERRIDE[entry.slug] ?? content.representativeYear);

  const mapParams = new URLSearchParams();
  if (mapYear) mapParams.set("year", String(mapYear));
  if (mapRegionId) mapParams.set("region", mapRegionId);
  const mapHref = map?.href ?? (mapParams.size ? `/map?${mapParams.toString()}` : "/map");

  // Wikidata sometimes hands back category pages ("Category:Ancient Egypt").
  const facts = (content.keyFacts ?? []).map(f => ({ ...f, value: f.value.replace(/^Category:/, "") }));

  // Google validates every schema.org Event like a concert listing: it needs
  // a start date and a location. Mark a historical event as an Event only
  // when we have both; otherwise it's a plain Thing.
  const fact = (label: string) => facts.find((f) => f.label === label)?.value;
  const eventStart = isoYear(fact("Start") ?? fact("Date")) ?? isoYear(content.representativeYear);
  const eventEnd = isoYear(fact("End"));
  const eventPlace = fact("Location") ?? fact("Country");
  const eventFields =
    entityType === "event" && eventStart && eventPlace
      ? {
          startDate: eventStart,
          ...(eventEnd ? { endDate: eventEnd } : {}),
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@type": "Place", name: eventPlace, address: fact("Country") ?? eventPlace },
        }
      : null;

  const schemaType =
    entityType === "person" ? "Person" :
    entityType === "event"  ? (eventFields ? "Event" : "Thing") :
    entityType === "culture"? "Thing"  : "Place";

  const jsonLd = {
    "@type": schemaType,
    ...(eventFields ?? {}),
    name: content.name,
    // The site's own description where it has one, not the encyclopedia's opening line.
    description: (ctx ? contextDescription(ctx) : placeDescription(entry.slug, content.name)) ?? content.summary ?? undefined,
    ...(entityType === "person" && ctx?.start !== undefined ? { birthDate: isoYear(ctx.start) } : {}),
    ...(entityType === "person" && ctx?.end !== undefined ? { deathDate: isoYear(ctx.end) } : {}),
    image: content.imageUrl ?? undefined,
    url: `https://www.bordersoftime.com/${baseRoute}/${entry.slug}`,
    sameAs: [
      content.wikipediaUrl,
      `https://www.wikidata.org/wiki/${entry.wikidataId}`,
    ].filter(Boolean),
  };

  const browsePath = entityType === "place" ? "/browse?type=place" : `/browse?type=${entityType}`;

  return (
    <>
    <JsonLd
      data={[
        jsonLd,
        breadcrumbLd([["Browse", "/browse"], [TYPE_PLURAL[entityType], browsePath], [content.name, `/${baseRoute}/${entry.slug}`]]),
      ]}
    />
    <div className="page-bg min-h-full">
      {/* ── Title ── */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-10 sm:pb-12">
        <nav className="label flex items-center gap-2.5 text-ink/40 mb-10 sm:mb-14" aria-label="Breadcrumb">
          <Link href="/browse" className="hover:text-accent transition-colors">Browse</Link>
          <span aria-hidden="true">/</span>
          <Link href={browsePath} className="hover:text-accent transition-colors">{TYPE_PLURAL[entityType]}</Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          <div className="lg:col-span-9">
            <p className="label text-accent mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
              {TYPE_LABELS[entityType]}
            </p>
            <h1 className="font-display font-light text-[44px] sm:text-6xl lg:text-[84px] leading-[1] tracking-[-0.035em] text-ink animate-[year-in_0.8s_cubic-bezier(.2,.7,.2,1)_both] text-balance">
              {content.name}
            </h1>
          </div>
          {content.tagline && content.tagline !== TYPE_LABELS[entityType] && (
            <p className="lg:col-span-3 lg:text-right font-mono text-[12px] tracking-wide text-ink/55 leading-relaxed lg:pb-3">
              {content.tagline}
            </p>
          )}
        </div>
      </header>

      {/* ── Lead picture ── */}
      {hero && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleImage img={hero} alt={hero.caption || `Image related to ${content.name}`} variant="hero" priority />
        </div>
      )}

      {/* ── Key facts strip ── */}
      {facts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-ink/80">
            {facts.slice(0, 6).map((fact) => (
              <div key={fact.label} className="pt-4 pb-5 pr-4 border-b border-ink/10">
                <dt className="label text-ink/40 !text-[10px]">{fact.label}</dt>
                <dd className="mt-2 font-display text-lg leading-snug text-ink first-letter:uppercase">
                  {fact.url
                    ? <a href={fact.url} className="hover:text-accent underline underline-offset-4 decoration-ink/20 transition-colors">{fact.value}</a>
                    : fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* ── Article + sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8">
        <article className="lg:col-span-7 xl:col-start-2 xl:col-span-7 min-w-0">
          {entityType === "place" && (
            <PlaceOnOurMaps slug={entry.slug} name={content.name} regionId={mapRegionId} />
          )}
          {ctx && <EntityInTime ctx={ctx} />}
          <ArticleBody content={content} images={rest} />
        </article>

        <aside className="lg:col-span-4 lg:col-start-9 xl:col-start-10 xl:col-span-3">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Map CTA */}
            <Link
              href={mapHref}
              className="group block bg-night text-parchment p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 graticule-night opacity-80" aria-hidden="true" />
              <div className="relative">
                <MapPin size={18} className="text-glow" aria-hidden="true" />
                <p className="mt-6 label text-glow/80">On the map</p>
                <p className="mt-2 font-display text-[28px] leading-[1.05] tracking-tight">
                  {mapYear ? <>See the world in <span className="italic text-glow">{fmtYear(mapYear)}</span></> : "Open the atlas"}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-parchment/70 group-hover:text-parchment transition-colors">
                  Open map <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>

            {content.wikipediaUrl && (
              <a
                href={content.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-y border-ink/15 py-4 text-sm text-ink/70 hover:text-accent transition-colors"
              >
                Full article on Wikipedia
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            )}

            {facts.length > 6 && (
              <dl className="space-y-4">
                {facts.slice(6).map((fact) => (
                  <div key={fact.label}>
                    <dt className="label text-ink/40 !text-[10px]">{fact.label}</dt>
                    <dd className="mt-1 text-sm text-ink/80 leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {entityType === "place" && <PlaceCrossLinks entry={entry} name={content.name} />}
            {entityType === "event" && <EventTourLinks slug={entry.slug} />}

            {/* Further reading / viewing — hidden entirely when none are curated yet */}
            <RelatedResources resourceKey={`${entityType}:${entry.slug}`} />

            <SupportNudge where={`${entityType}:${entry.slug}`} trigger="page" />

            <AdSlot id="entity-sidebar" format="rectangle" />

            <p className="text-[11px] text-ink/35 leading-relaxed">
              Structured data:{" "}
              <a href={`https://www.wikidata.org/wiki/${entry.wikidataId}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent transition-colors">
                Wikidata {entry.wikidataId}
              </a>{" "}(CC0)
            </p>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}

/** Map tours of this event, with the world-wars hub; hidden for events without one. */
function EventTourLinks({ slug }: { slug: string }) {
  const tours = toursOfEvent(slug);
  if (!tours.length) return null;
  return (
    <div>
      <p className="label text-ink/40 !text-[10px] mb-2">On the map, stage by stage</p>
      <ul className="space-y-1.5">
        {tours.map((t) => (
          <li key={t.slug}>
            <Link href={`/tour/${t.slug}`} className="text-sm text-ink/80 hover:text-accent transition-colors">{t.title}</Link>
          </li>
        ))}
        <li>
          <Link href="/world-wars" className="text-sm text-accent hover:underline underline-offset-4">The world wars: every stage and battle →</Link>
        </li>
      </ul>
    </div>
  );
}

/** "Cities it held" and "Guided tours" links for an empire's sidebar; hidden when empty. */
function PlaceCrossLinks({ entry, name }: { entry: CrosswalkEntry; name: string }) {
  const cities = citiesHeldBy(entry.slug);
  const tours = toursFeaturing(entry);
  if (!cities.length && !tours.length) return null;
  return (
    <div className="space-y-6">
      {tours.length > 0 && (
        <div>
          <p className="label text-ink/40 !text-[10px] mb-2">Guided tours</p>
          <ul className="space-y-1.5">
            {tours.map((t) => (
              <li key={t.slug}>
                <Link href={`/tour/${t.slug}`} className="text-sm text-ink/80 hover:text-accent transition-colors">{t.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cities.length > 0 && (
        <div>
          <p className="label text-ink/40 !text-[10px] mb-2">Cities {name} held</p>
          <p className="text-sm leading-relaxed">
            {cities.map((c, i) => (
              <span key={c.slug}>
                <Link href={`/history-of/${c.slug}`} className="text-ink/80 hover:text-accent transition-colors">{c.name}</Link>
                {i < cities.length - 1 && <span className="text-ink/25"> · </span>}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
