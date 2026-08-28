/**
 * Shared entity page layout — used by /place, /person, /event, /culture.
 * Renders hero image, key-facts sidebar, summary, and map CTA.
 */
import Image from "next/image";
import Link from "next/link";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import type { PlaceContent, EntityType } from "@/types";
import type { CrosswalkEntry } from "@/types";

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

export default function EntityPage({ content, entry, entityType, baseRoute }: EntityPageProps) {
  const mapHref = content.representativeYear
    ? `/map?year=${content.representativeYear}&region=${entry.wikidataId}`
    : `/map?region=${entry.wikidataId}`;

  const mapLabel = content.representativeYear
    ? `See on map at ${content.representativeYear > 0
        ? content.representativeYear + " CE"
        : Math.abs(content.representativeYear) + " BCE"}`
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
          {content.imageUrl && (
            <figure className="mb-8">
              <div className="relative w-full rounded-2xl overflow-hidden border border-paper" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={content.imageUrl}
                  alt={`Image related to ${content.name}`}
                  fill
                  className="object-contain bg-surface"
                  unoptimized
                  priority
                />
              </div>
              <figcaption className="mt-2.5 text-xs text-ink/40 leading-snug flex flex-wrap gap-x-1.5">
                {content.imageAuthor && <span>{content.imageAuthor}</span>}
                {content.imageAuthor && content.imageLicense && <span>·</span>}
                {content.imageLicense && <span>{content.imageLicense}</span>}
                {content.imageSourceUrl && (
                  <><span>·</span><a href={content.imageSourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink/70">Wikimedia Commons</a></>
                )}
              </figcaption>
            </figure>
          )}

          {content.summary && (
            <div className="flex items-center gap-3 mb-6">
              <ReadAloudButton text={[content.summary, ...(content.sections?.map(s => s.content) || [])].join(" ")} />
              <span className="text-ink/25 text-[10px] uppercase tracking-widest font-semibold">Read Full Article</span>
            </div>
          )}

          {content.summary ? (
            <div className="mb-4 space-y-6">
              {content.summary.split(/\n+/).filter(Boolean).map((para, i) => (
                <div key={i} className="group relative flex gap-4">
                  <ReadAloudButton 
                    text={para} 
                    variant="minimal" 
                    className="shrink-0 mt-1 opacity-20 group-hover:opacity-100 transition-opacity" 
                  />
                  <p className="text-ink/75 text-base leading-[1.85]">{para}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink/40 text-base italic mb-4">
              No summary available.{" "}
              {content.wikipediaUrl && (
                <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/60 hover:text-ancient underline underline-offset-2 transition-colors not-italic">
                  Read the full article on Wikipedia →
                </a>
              )}
            </p>
          )}

          {content.wikipediaUrl && content.summary && (
            <p className="text-xs text-ink/25 mb-10">
              Summary from{" "}
              <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/50 hover:text-ancient underline underline-offset-2 transition-colors">
                Wikipedia
              </a>
              {" "}(CC BY-SA 4.0)
            </p>
          )}

          {/* Article sections (History, Origins, Legacy…) */}
          {content.sections && content.sections.length > 0 && (
            <div className="space-y-8 border-t border-paper pt-8">
              {content.sections.map((sec, i) => (
                <details key={sec.heading || `sec-${i}`} className="group" open={i === 0}>
                  <summary className="flex items-center gap-3 cursor-pointer list-none select-none mb-3">
                    <div className="w-1 h-5 rounded-full bg-ancient/40 group-open:bg-ancient transition-colors" aria-hidden="true" />
                    <h2 className="font-display text-xl font-semibold text-ink/80 italic group-open:text-ink transition-colors">
                      {sec.heading}
                    </h2>
                    <ReadAloudButton 
                      text={sec.content} 
                      variant="minimal" 
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                    <svg className="ml-auto w-4 h-4 text-ink/25 transition-transform group-open:rotate-180" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </summary>
                  <div className="pl-4 border-l border-paper">
                    <p className="text-ink/70 text-[15px] leading-[1.9]">
                      {sec.content}
                    </p>
                    {sec.content.length >= 1190 && content.wikipediaUrl && (
                      <p className="mt-4">
                        <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/60 hover:text-ancient underline underline-offset-2 transition-colors text-xs">Read more on Wikipedia →</a>
                      </p>
                    )}
                  </div>
                </details>
              ))}
              {content.wikipediaUrl && (
                <p className="text-xs text-ink/25 pt-2 border-t border-paper">
                  Article sections from{" "}
                  <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/50 hover:text-ancient underline underline-offset-2 transition-colors">Wikipedia</a>
                  {" "}(CC BY-SA 4.0). Excerpted for readability.
                </p>
              )}
            </div>
          )}
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
