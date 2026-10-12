/**
 * Shared entity page layout — used by /place, /person, /event, /culture.
 * Renders hero image, key-facts sidebar, summary, and map CTA.
 */
import Link from "next/link";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import RelatedResources from "@/components/RelatedResources";
import AdSlot from "@/components/AdSlot";
import SupportNudge from "@/components/SupportNudge";
import ArticleBody from "@/components/ArticleBody";
import { getEntityImages } from "@/lib/entityImages";
import type { PlaceContent, EntityType } from "@/types";
import type { CrosswalkEntry } from "@/types";
import { ENTITY_PLACE_OVERRIDE, ENTITY_YEAR_OVERRIDE } from "@/data/entityPlaceLinks";

interface EntityPageProps {
  content: PlaceContent;
  entry: CrosswalkEntry;
  entityType: EntityType;
  baseRoute: string; // e.g. "person", "place"
}

const TYPE_LABELS: Record<EntityType, string> = {
  place:   "Place",
  person:  "Person",
  event:   "Event",
  culture: "Culture",
};

export default async function EntityPage({ content, entry, entityType, baseRoute }: EntityPageProps) {
  const images = await getEntityImages(entry.wikidataId, content.imageUrl);
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
  const mapYear = ENTITY_YEAR_OVERRIDE[entry.slug] ?? content.representativeYear;

  const mapParams = new URLSearchParams();
  if (mapYear) mapParams.set("year", String(mapYear));
  if (mapRegionId) mapParams.set("region", mapRegionId);
  const mapHref = mapParams.size ? `/map?${mapParams.toString()}` : "/map";

  const mapLabel = mapYear
    ? `See on map at ${mapYear > 0
        ? mapYear + " CE"
        : Math.abs(mapYear) + " BCE"}`
    : "See on map";

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

  const browsePath = entityType === "place"
    ? "/browse"
    : entityType === "person"
    ? "/browse?type=person"
    : entityType === "event"
    ? "/browse?type=event"
    : "/browse?type=culture";

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="page-bg min-h-full">
    <div className="max-w-5xl mx-auto px-6 py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
        <Link href={browsePath} className="hover:text-ancient/80 transition-colors capitalize">
          {entityType === "place" ? "Places" : entityType === "person" ? "People" : entityType === "event" ? "Events" : "Cultures"}
        </Link>
        <span className="text-ink/20">/</span>
        <span className="text-ink/55">{content.name}</span>
      </nav>

      {/* Page title block */}
      <div className="mb-10">
        <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">
          {TYPE_LABELS[entityType]}
        </p>
        <HandwrittenTitle className="font-display text-5xl sm:text-6xl font-bold text-ink italic leading-tight mb-2">
          {content.name}
        </HandwrittenTitle>
        {content.tagline && (
          <p className="text-ancient/60 text-base mt-3 leading-relaxed">{content.tagline}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2">
          <ArticleBody content={content} images={images} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Map CTA */}
          <div className="rounded-2xl border border-paper bg-white/60 p-5 space-y-3">
            <p className="text-ink/50 text-xs font-semibold uppercase tracking-wider">Explore on the map</p>
            <Link
              href={mapHref}
              className="block w-full text-center rounded-xl px-4 py-3 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
            >
              {mapLabel}
            </Link>
            {content.wikipediaUrl && (
              <a
                href={content.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-xl px-4 py-2.5 text-sm font-medium border border-paper bg-white/60 text-ink/70 hover:bg-surface hover:text-ink transition-all duration-200"
              >
                Read on Wikipedia →
              </a>
            )}
          </div>

          {/* Key facts */}
          {content.keyFacts && content.keyFacts.length > 0 && (
            <div className="rounded-2xl border border-paper bg-white/60 p-5">
              <p className="text-ink/35 text-xs font-semibold uppercase tracking-wider mb-4">Key facts</p>
              <dl className="space-y-4">
                {content.keyFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-ink/35 text-xs mb-0.5">{fact.label}</dt>
                    <dd className="text-ink/75 text-sm leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Further reading / viewing — hidden entirely when none are curated yet */}
          <RelatedResources resourceKey={`${entityType}:${entry.slug}`} />

          <SupportNudge where={`${entityType}:${entry.slug}`} trigger="page" />

          <AdSlot id="entity-sidebar" format="rectangle" />

          {/* Attribution */}
          <p className="text-xs text-ink/25 leading-relaxed px-1">
            Structured data:{" "}
            <a href={`https://www.wikidata.org/wiki/${entry.wikidataId}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink/45 transition-colors">
              Wikidata {entry.wikidataId}
            </a>{" "}(CC0)
          </p>
        </aside>
      </div>
    </div>
    </div>
    </>
  );
}
