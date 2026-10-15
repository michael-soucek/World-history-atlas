/**
 * Shared entity page layout — used by /place, /person, /event, /culture.
 * Renders the title block, lead picture, key-facts strip, article and the
 * map sidebar.
 */
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import RelatedResources from "@/components/RelatedResources";
import AdSlot from "@/components/AdSlot";
import SupportNudge from "@/components/SupportNudge";
import ArticleBody, { splitHero } from "@/components/ArticleBody";
import ArticleImage from "@/components/ArticleImage";
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

export default async function EntityPage({ content, entry, entityType, baseRoute, map }: EntityPageProps) {
  const images = await getEntityImages(entry.wikidataId, content.imageUrl);
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

  const schemaType =
    entityType === "person" ? "Person" :
    entityType === "event"  ? "Event"  :
    entityType === "culture"? "Thing"  : "Place";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: content.name,
    description: content.summary ?? undefined,
    image: content.imageUrl ?? undefined,
    url: `https://www.bordersoftime.com/${baseRoute}/${entry.slug}`,
    sameAs: [
      content.wikipediaUrl,
      `https://www.wikidata.org/wiki/${entry.wikidataId}`,
    ].filter(Boolean),
  };

  const browsePath = entityType === "place" ? "/browse?type=place" : `/browse?type=${entityType}`;
  // Wikidata sometimes hands back category pages ("Category:Ancient Egypt").
  const facts = (content.keyFacts ?? []).map(f => ({ ...f, value: f.value.replace(/^Category:/, "") }));

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
