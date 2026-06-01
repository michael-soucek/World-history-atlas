import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import type { CrosswalkEntry } from "@/types";
import { CROSSWALK } from "@/data/crosswalk";
import { buildPlaceContent } from "@/lib/wikidata";
import { resolveEntityBySlugOrQid } from "@/lib/entityResolver";
import { fetchWikipediaSearchSummary } from "@/lib/wikipedia";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 31536000;

export async function generateStaticParams() {
  return Object.values(CROSSWALK).map((e) => ({ slug: e.slug }));
}

function humaniseSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Always returns an object — never throws, never returns null.
const resolvePage = cache(async (slug: string): Promise<{
  entry: CrosswalkEntry | null;
  content: Awaited<ReturnType<typeof buildPlaceContent>> | null;
  canonicalName: string;
  fallbackSummary: Awaited<ReturnType<typeof fetchWikipediaSearchSummary>>;
}> => {
  try {
    const resolution = await resolveEntityBySlugOrQid(slug, "place");
    const resolved = resolution.resolved;
    if (!resolved) {
      const canonicalName = humaniseSlug(slug);
      const fallbackSummary = await fetchWikipediaSearchSummary(canonicalName).catch(() => null);
      return { entry: null, content: null, canonicalName, fallbackSummary };
    }

    const entry: CrosswalkEntry = {
      wikidataId: resolved.wikidataId,
      slug: resolved.slug,
    };

    const canonicalName = resolved.canonicalName;
    const content = await buildPlaceContent(resolved.wikidataId, canonicalName).catch(() => null);
    const fallbackSummary = !content || content.labelMismatch
      ? await fetchWikipediaSearchSummary(canonicalName).catch(() => null)
      : null;
    return { entry, content, canonicalName, fallbackSummary };
  } catch {
    const canonicalName = humaniseSlug(slug);
    const fallbackSummary = await fetchWikipediaSearchSummary(canonicalName).catch(() => null);
    return { entry: null, content: null, canonicalName, fallbackSummary };
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await resolvePage(slug);
  if (!result?.content) {
    return { title: "Place not found — World History Atlas" };
  }
  const { content } = result;
  return {
    title: `${content.name} — World History Atlas`,
    description: content.summary
      ? content.summary.slice(0, 160)
      : `Learn about ${content.name} on the World History Atlas.`,
    openGraph: {
      title: content.name,
      description: content.summary?.slice(0, 200),
      images: content.imageUrl ? [{ url: content.imageUrl }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: content.name,
      description: content.summary?.slice(0, 200),
    },
  };
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params;
  const result = await resolvePage(slug);

  const { entry, content } = result;

  // Graceful fallback: no content loaded, or label guard fired
  const displayName = content?.labelMismatch ? (result.canonicalName ?? slug) : (content?.name ?? slug);
  const searchName = encodeURIComponent(displayName);

  if (!content || content.labelMismatch || !entry) {
    const summaryText = result.fallbackSummary?.summary?.trim();
    return (
      <>
        <SiteHeader />
        <main className="page-bg min-h-screen">
          <div className="max-w-3xl mx-auto px-6 py-20">
            <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
              <Link href="/browse" className="hover:text-ancient/80 transition-colors">Browse</Link>
              <span className="text-ink/20">/</span>
              <span className="text-ink/55">{displayName}</span>
            </nav>
            <div className="h-0.5 w-12 rounded-full bg-ancient mb-4" aria-hidden="true" />
            <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Place</p>
            <HandwrittenTitle className="font-display text-5xl font-bold text-ink italic leading-tight mb-6">{displayName}</HandwrittenTitle>
            <p className="text-ink/50 text-base leading-relaxed mb-8 max-w-prose">
              {summaryText ? (
                summaryText
              ) : (
                <>
                  We don&apos;t yet have a verified article for <strong className="text-ink/70">{displayName}</strong> in the atlas.
                  You can search Wikipedia directly for more information.
                </>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {result.fallbackSummary?.url && (
                <a
                  href={result.fallbackSummary.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold bg-paper text-ink/80 hover:bg-paper/80 transition-colors"
                >
                  Read best match: {result.fallbackSummary.title} ↗
                </a>
              )}
              <a
                href={`https://en.wikipedia.org/wiki/Special:Search?search=${searchName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
              >
                Search Wikipedia for &ldquo;{displayName}&rdquo; →
              </a>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-medium border border-paper text-ink/60 hover:text-ink hover:border-ancient/40 hover:bg-ancient-wash transition-all"
              >
                ← Back to the map
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: content.name,
    description: content.summary ?? undefined,
    image: content.imageUrl ?? undefined,
    sameAs: [
      content.wikipediaUrl,
      `https://www.wikidata.org/wiki/${entry.wikidataId}`,
    ].filter(Boolean),
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <SiteHeader />
    <main className="page-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
          <Link href="/browse" className="hover:text-ancient/80 transition-colors">Browse</Link>
          <span className="text-ink/20">/</span>
          <span className="text-ink/55">{content.name}</span>
        </nav>

        {/* Title block */}
        <div className="mb-10">
          <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Place</p>
          <HandwrittenTitle className="font-display text-5xl sm:text-6xl font-bold text-ink italic leading-tight mb-2">{content.name}</HandwrittenTitle>
          {content.tagline && (
            <p className="text-ancient/60 text-base mt-3 leading-relaxed">{content.tagline}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main column */}
          <div className="lg:col-span-2">
            {/* Hero image */}
            {content.imageUrl && (
              <figure className="mb-8">
                <div className="relative w-full rounded-2xl overflow-hidden border border-paper" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={content.imageUrl}
                    alt={`Image related to ${content.name}`}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                </div>
                <figcaption className="mt-2.5 text-xs text-ink/40 leading-snug flex flex-wrap gap-x-1.5">
                  {content.imageAuthor && <span>{content.imageAuthor}</span>}
                  {content.imageAuthor && content.imageLicense && <span>·</span>}
                  {content.imageLicense && <span>{content.imageLicense}</span>}
                  {content.imageSourceUrl && (
                    <><span>·</span><a href={content.imageSourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink/70 transition-colors">Wikimedia Commons</a></>
                  )}
                </figcaption>
              </figure>
            )}

            {/* Lead summary */}
            {content.summary && (
              <p className="text-ink/75 text-base leading-[1.85] mb-4">
                {content.summary}
              </p>
            )}
            {content.wikipediaUrl && (
              <p className="text-xs text-ink/25 mb-10">
                Summary from{" "}
                <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/50 hover:text-ancient underline underline-offset-2 transition-colors">Wikipedia</a>
                {" "}(CC BY-SA 4.0)
              </p>
            )}

            {/* Article sections (Origins, History, Legacy…) */}
            {content.sections && content.sections.length > 0 && (
              <div className="space-y-8 border-t border-paper pt-8">
                {content.sections.map((sec, i) => (
                  <details key={sec.heading || `sec-${i}`} className="group" open={i === 0}>
                    <summary className="flex items-center gap-3 cursor-pointer list-none select-none mb-3">
                      <div className="w-1 h-5 rounded-full bg-ancient/40 group-open:bg-ancient transition-colors" aria-hidden="true" />
                      <h2 className="font-display text-xl font-semibold text-ink/80 italic group-open:text-ink transition-colors">
                        {sec.heading}
                      </h2>
                      <svg className="ml-auto w-4 h-4 text-ink/25 transition-transform group-open:rotate-180" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </summary>
                    <p className="text-ink/70 text-[15px] leading-[1.9] pl-4 border-l border-paper">
                      {sec.content}
                      {sec.content.length >= 1190 && (
                        <>{" "}<a href={content.wikipediaUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="text-ancient/60 hover:text-ancient underline underline-offset-2 transition-colors text-xs">Read more on Wikipedia →</a></>
                      )}
                    </p>
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
            {/* CTA */}
            <div className="rounded-2xl border border-paper bg-white/60 p-5 space-y-3">
              <p className="text-ink/35 text-xs font-semibold uppercase tracking-wider">Explore on the map</p>
              <Link
                href={content.representativeYear
                  ? `/map?year=${content.representativeYear}&region=${entry.wikidataId}`
                  : `/map?region=${entry.wikidataId}`}
                className="block w-full text-center rounded-xl px-4 py-3 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
              >
                {content.representativeYear
                  ? `View map at ${content.representativeYear > 0 ? content.representativeYear + " CE" : Math.abs(content.representativeYear) + " BCE"}`
                  : "View on map"}
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
                      <dd className="text-ink/75 text-sm leading-snug">
                        {fact.url
                          ? <a href={fact.url} className="hover:text-ancient underline underline-offset-2 transition-colors">{fact.value}</a>
                          : fact.value}
                      </dd>
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
    </main>
    <SiteFooter />
    </>
  );
}
