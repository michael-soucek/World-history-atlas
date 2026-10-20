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
import EntityPage from "@/components/EntityPage";
import { entityMetadata } from "@/lib/seo";

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
  return entityMetadata("place", slug, result.content);
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
              <Link href="/browse" className="hover:text-accent/80 transition-colors">Browse</Link>
              <span className="text-ink/20">/</span>
              <span className="text-ink/55">{displayName}</span>
            </nav>
            <div className="h-0.5 w-12 rounded-full bg-accent mb-4" aria-hidden="true" />
            <p className="label text-accent mb-5">Place</p>
            <HandwrittenTitle className="font-display text-5xl sm:text-6xl font-light tracking-tight text-ink leading-tight mb-6">{displayName}</HandwrittenTitle>
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
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold bg-ink text-parchment hover:bg-accent transition-colors"
              >
                Search Wikipedia for &ldquo;{displayName}&rdquo; →
              </a>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-medium border border-paper text-ink/60 hover:text-ink hover:border-accent/40 hover:bg-accent-wash transition-all"
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

  // Curated crosswalk data wins: Wikidata's inception date is usually the
  // founding moment, before the polity shows up on any border snapshot.
  const link = mapLinkFor(entry);
  const year = link.year ?? content.representativeYear;
  const mapParams = new URLSearchParams();
  if (year !== undefined) mapParams.set("year", String(year));
  if (link.view) {
    mapParams.set("lat", String(link.view.lat));
    mapParams.set("lng", String(link.view.lng));
    mapParams.set("z", String(link.view.zoom));
  }
  if (link.regionId) mapParams.set("region", link.regionId);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <EntityPage
          content={content}
          entry={entry}
          entityType="place"
          baseRoute="place"
          map={{ href: `/map?${mapParams.toString()}`, year }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
