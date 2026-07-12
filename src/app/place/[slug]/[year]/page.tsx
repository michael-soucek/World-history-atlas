import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CROSSWALK, lookupBySlug, lookupByQid } from "@/data/crosswalk";
import { buildPlaceContent } from "@/lib/wikidata";
import { formatYear, getSnapshotYearFor } from "@/data/snapshotYears";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

interface Props {
  params: Promise<{ slug: string; year: string }>;
}

async function resolvePage(slug: string, year: number) {
  const isQid = /^Q\d+$/.test(slug);
  const entry = isQid ? lookupByQid(slug) : lookupBySlug(slug);
  if (!entry) return null;
  const canonicalName =
    Object.entries(CROSSWALK).find(([, e]) => e.wikidataId === entry.wikidataId)?.[0] ?? slug;
  const content = await buildPlaceContent(entry.wikidataId, canonicalName).catch(() => null);
  // If label guard fires, treat as no content for this page
  const safeContent = content?.labelMismatch ? null : content;
  return { entry, content: safeContent };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, year: yearStr } = await params;
  const year = parseInt(yearStr, 10);
  const result = await resolvePage(slug, year);
  if (!result?.content) return { title: "Place not found — World History Atlas" };
  const { content } = result;
  const yearLabel = formatYear(year);
  return {
    title: `${content.name} in ${yearLabel} — World History Atlas`,
    description: `${content.name} in ${yearLabel}. ${content.summary?.slice(0, 120) ?? ""}`,
    openGraph: {
      title: `${content.name} — ${yearLabel}`,
      description: content.summary?.slice(0, 200),
      images: content.imageUrl ? [{ url: content.imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.name} — ${yearLabel}`,
    },
  };
}

export default async function PlaceYearPage({ params }: Props) {
  const { slug, year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  if (isNaN(year)) notFound();

  const result = await resolvePage(slug, year);
  if (!result) notFound();

  const { entry, content } = result;
  const snapshotYear = getSnapshotYearFor(year);
  const yearLabel = formatYear(year);

  if (!content) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-4">{slug} — {yearLabel}</h1>
        <p className="text-white/60">Could not load content for this place.</p>
      </main>
    );
  }

  return (
    <>
    <SiteHeader />
    <main className="min-h-screen page-bg">

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-baseline gap-4 mb-2">
          <h1 className="text-4xl font-bold text-white">{content.name}</h1>
          <span className="text-white/50 text-xl font-mono">{yearLabel}</span>
        </div>
        {snapshotYear !== year && (
          <p className="text-amber-400/70 text-sm mb-6">
            Showing data from {formatYear(snapshotYear)} — the nearest sourced snapshot.
          </p>
        )}

        {content.imageUrl && (
          <figure className="mt-8 mb-8">
            <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <Image
                src={content.imageUrl}
                alt={`Image related to ${content.name}`}
                fill
                className="object-contain bg-surface"
                unoptimized
                priority
              />
            </div>
            <figcaption className="mt-2 text-xs text-ink/40 leading-snug">
              {content.imageAuthor && <span>{content.imageAuthor}</span>}
              {content.imageAuthor && content.imageLicense && <span> · </span>}
              {content.imageLicense && <span>{content.imageLicense}</span>}
              {content.imageSourceUrl && (
                <>
                  {" · "}
                  <a href={content.imageSourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink/60">
                    Wikimedia Commons
                  </a>
                </>
              )}
            </figcaption>
          </figure>
        )}

        {content.summary && (
          <p className="text-ink/80 text-lg leading-relaxed mb-8">{content.summary}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/map?year=${year}&region=${entry.wikidataId}`}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-ancient text-white hover:bg-ancient/90 transition-colors"
          >
            View on map in {yearLabel}
          </Link>
          {content.wikipediaUrl && (
            <a
              href={content.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-4 py-2 text-sm font-medium bg-surface text-ink hover:bg-ink/[0.08] transition-colors"
            >
              Read on Wikipedia →
            </a>
          )}
        </div>

        <p className="mt-12 text-xs text-ink/30">
          Content from{" "}
          <a href={`https://www.wikidata.org/wiki/${entry.wikidataId}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink/50">
            Wikidata ({entry.wikidataId})
          </a>{" "}
          and Wikipedia (CC BY-SA 4.0).
        </p>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
