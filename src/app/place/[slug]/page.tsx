import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import type { CrosswalkEntry } from "@/types";
import { CROSSWALK, getCanonicalNameByQid, lookupByQid, lookupBySlug, mapLinkFor } from "@/data/crosswalk";
import { buildPlaceContent } from "@/lib/wikidata";
import { readableNameFromSlug, resolveEntityBySlugOrQid } from "@/lib/entityResolver";
import { fetchWikipediaSearchSummary } from "@/lib/wikipedia";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RelatedResources from "@/components/RelatedResources";
import AdSlot from "@/components/AdSlot";
import ArticleBody from "@/components/ArticleBody";
import { getEntityImages } from "@/lib/entityImages";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 31536000;

export async function generateStaticParams() {
  return Object.values(CROSSWALK).map((e) => ({ slug: e.slug }));
}

// Always returns an object — never throws, never returns null.
const resolvePage = cache(async (slug: string): Promise<{
  entry: CrosswalkEntry | null;
  content: Awaited<ReturnType<typeof buildPlaceContent>> | null;
  canonicalName: string;
  fallbackSummary: Awaited<ReturnType<typeof fetchWikipediaSearchSummary>>;
}> => {
  try {
    const slugHint = lookupBySlug(slug.toLowerCase());
    const sourceNameHint = slugHint?.wikidataId
      ? getCanonicalNameByQid(slugHint.wikidataId)
      : undefined;

    const resolution = await resolveEntityBySlugOrQid(slug, "place", {
      sourceName: sourceNameHint,
    });
    const resolved = resolution.resolved;
    if (!resolved) {
      const canonicalName = readableNameFromSlug(slug);
      const fallbackSummary = await fetchWikipediaSearchSummary(canonicalName).catch(() => null);
      return { entry: null, content: null, canonicalName, fallbackSummary };
    }

    const curated = lookupByQid(resolved.wikidataId) ?? slugHint;
    const entry: CrosswalkEntry = {
      ...curated,
      wikidataId: resolved.wikidataId,
      slug: resolved.slug,
    };

    const canonicalName = resolved.canonicalName;
    const content = await buildPlaceContent(resolved.wikidataId, canonicalName).catch(() => null);
    const fallbackSummary = !content || content.labelMismatch || !content.summary?.trim()
      ? await fetchWikipediaSearchSummary(canonicalName).catch(() => null)
      : null;
    return { entry, content, canonicalName, fallbackSummary };
  } catch {
    const canonicalName = readableNameFromSlug(slug);
    const fallbackSummary = await fetchWikipediaSearchSummary(canonicalName).catch(() => null);
    return { entry: null, content: null, canonicalName, fallbackSummary };
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await resolvePage(slug);
  if (!result?.content) {
    return { title: "Place not found — Borders of Time" };
  }
  const { content } = result;
  return {
    title: `${content.name} — Borders of Time`,
    description: content.summary
      ? content.summary.slice(0, 160)
      : `Learn about ${content.name} on the Borders of Time.`,
    alternates: { canonical: `/place/${slug}` },
    openGraph: {
      title: content.name,
      description: content.summary?.slice(0, 200),
      images: [{ url: content.imageUrl || DEFAULT_SOCIAL_IMAGE }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: content.name,
      description: content.summary?.slice(0, 200),
      images: [content.imageUrl || DEFAULT_SOCIAL_IMAGE],
    },
  };
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params;
  const result = await resolvePage(slug);

  const { entry, content } = result;

  // Graceful fallback: no content loaded, or label guard fired
  const readableSlugName = readableNameFromSlug(slug);
  const displayName = content?.labelMismatch
    ? (result.canonicalName || readableSlugName)
    : (content?.name || result.canonicalName || readableSlugName);
  const searchName = encodeURIComponent(displayName);

  if (!content || content.labelMismatch || !entry || !content.summary?.trim()) {
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
            <ArticleBody content={content} images={await getEntityImages(entry.wikidataId, content.imageUrl)} readLabel="Read Article" />
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* CTA */}
            <div className="rounded-2xl border border-paper bg-white/60 p-5 space-y-3">
              <p className="text-ink/35 text-xs font-semibold uppercase tracking-wider">Explore on the map</p>
              {(() => {
                // Curated crosswalk data wins: Wikidata's inception date is
                // usually the founding moment, before the polity shows up on
                // any border snapshot.
                const link = mapLinkFor(entry);
                const year = link.year ?? content.representativeYear;
                const params = new URLSearchParams();
                if (year !== undefined) params.set("year", String(year));
                if (link.view) {
                  params.set("lat", String(link.view.lat));
                  params.set("lng", String(link.view.lng));
                  params.set("z", String(link.view.zoom));
                }
                if (link.regionId) params.set("region", link.regionId);
                return (
                  <Link
                    href={`/map?${params.toString()}`}
                    className="block w-full text-center rounded-xl px-4 py-3 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
                  >
                    {year !== undefined
                      ? `View map at ${year > 0 ? year + " CE" : Math.abs(year) + " BCE"}`
                      : "View on map"}
                  </Link>
                );
              })()}
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

            {/* Further reading / viewing — hidden entirely when none are curated yet */}
            <RelatedResources resourceKey={`place:${entry.slug}`} />

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
    </main>
    <SiteFooter />
    </>
  );
}
