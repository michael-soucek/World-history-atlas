import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import HandwrittenTitle from "@/components/HandwrittenTitle";
import VoyageMap from "@/components/VoyageMap";
import RelatedResources from "@/components/RelatedResources";
import ArticleImage, { type ArticleImageData } from "@/components/ArticleImage";
import { ImageStrip, toArticleImage } from "@/components/ArticleBody";
import { getEntityImages } from "@/lib/entityImages";
import { EXPLORERS, getExplorerBySlug } from "@/data/voyages";
import { buildEntityContent } from "@/lib/wikidata";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 31536000;

export async function generateStaticParams() {
  return EXPLORERS.map((e) => ({ slug: e.slug }));
}

const loadBio = cache(async (slug: string) => {
  const explorer = getExplorerBySlug(slug);
  if (!explorer) return null;
  const content = await buildEntityContent(explorer.wikidataId, "person", explorer.name).catch(() => null);
  return { explorer, content };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadBio(slug);
  if (!data) return { title: "Explorer not found — Borders of Time" };
  const { explorer, content } = data;
  const description = content?.summary?.slice(0, 160) ?? explorer.tagline;
  const imageUrl = content?.imageUrl || DEFAULT_SOCIAL_IMAGE;
  return {
    title: `${explorer.name} — Age of Exploration — Borders of Time`,
    description,
    alternates: { canonical: `/explorer/${slug}` },
    openGraph: {
      title: explorer.name,
      description,
      images: [{ url: imageUrl }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: explorer.name,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ExplorerPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadBio(slug);
  if (!data) notFound();
  const { explorer, content } = data;

  const summaryParas = (content?.summary ?? "").split(/\n+/).filter(Boolean);
  const images = (await getEntityImages(explorer.wikidataId, content?.imageUrl)).map(toArticleImage);
  // Hero: the explorer's own Wikidata image if any, else the article's first image.
  const hero: ArticleImageData | undefined = content?.imageUrl
    ? { thumb: content.imageUrl, caption: explorer.imageCaption, author: content.imageAuthor, license: content.imageLicense, sourceUrl: content.imageSourceUrl }
    : images.shift();
  const summaryImage = summaryParas.length > 0 ? images.shift() : undefined;
  const stripImages = images;
  const voyages = explorer.voyages ?? [];
  const hasVoyages = explorer.status === "full" && voyages.length > 0;

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
            <Link href="/browse" className="hover:text-ancient/80 transition-colors">Browse</Link>
            <span className="text-ink/20">/</span>
            <Link href="/theme/age-of-exploration" className="hover:text-ancient/80 transition-colors">Age of Exploration</Link>
            <span className="text-ink/20">/</span>
            <span className="text-ink/55">{explorer.name}</span>
          </nav>

          {/* Title block */}
          <div className="mb-8">
            <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">
              Explorer · {explorer.lifespan}
            </p>
            <HandwrittenTitle className="font-display text-5xl sm:text-6xl font-bold text-ink italic leading-tight mb-2">
              {explorer.name}
            </HandwrittenTitle>
            <p className="text-ancient/60 text-base mt-3 leading-relaxed max-w-2xl">{explorer.tagline}</p>
          </div>

          {/* Bio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
            <div className="lg:col-span-2">
              {hero && <ArticleImage img={hero} alt={hero.caption || `Depiction of ${explorer.name}`} variant="hero" priority />}

              {content?.summary && (
                <div className="flex items-center gap-3 mb-6">
                  <ReadAloudButton text={[content.summary, ...(content.sections?.map(s => s.content) || [])].join(" ")} />
                  <span className="text-ink/25 text-[10px] uppercase tracking-widest font-semibold">Read Biography</span>
                </div>
              )}

              {summaryParas.length > 0 ? (
                <div className="mb-8 flow-root">
                  {summaryImage && <ArticleImage img={summaryImage} alt={summaryImage.caption ?? explorer.name} variant="float" side="right" />}
                  <div className="space-y-6">
                  {summaryParas.map((para, i) => (
                    <div key={i} className="group relative flex gap-4">
                      <ReadAloudButton 
                        text={para} 
                        variant="minimal" 
                        className="shrink-0 mt-1 opacity-20 group-hover:opacity-100 pointer-coarse:opacity-100 transition-opacity" 
                      />
                      <p className="text-ink/75 text-base leading-[1.85]">{para}</p>
                    </div>
                  ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <ReadAloudButton text={explorer.tagline} variant="minimal" className="shrink-0" />
                  <p className="text-ink/50 text-base leading-relaxed">{explorer.tagline}</p>
                </div>
              )}

              {content?.wikipediaUrl && (
                <p className="text-xs text-ink/25 mt-4">
                  Summary from{" "}
                  <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/50 hover:text-ancient underline underline-offset-2 transition-colors">Wikipedia</a>
                  {" "}(CC BY-SA 4.0)
                </p>
              )}

              {stripImages.length > 0 && <ImageStrip images={stripImages} name={explorer.name} />}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="rounded-2xl border border-paper bg-white/60 p-5 space-y-3">
                <p className="text-ink/35 text-xs font-semibold uppercase tracking-wider">Explore further</p>
                {content?.wikipediaUrl && (
                  <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center rounded-xl px-4 py-2.5 text-sm font-medium border border-paper bg-white/60 text-ink/70 hover:bg-surface hover:text-ink transition-all duration-200">
                    Read on Wikipedia →
                  </a>
                )}
                <Link href="/tour/age-of-discovery" className="block w-full text-center rounded-xl px-4 py-2.5 text-sm font-medium border border-paper bg-white/60 text-ink/70 hover:bg-surface hover:text-ink transition-all duration-200">
                  Take the Age of Discovery tour →
                </Link>
              </div>
              <p className="text-xs text-ink/25 leading-relaxed px-1">
                Structured data:{" "}
                <a href={`https://www.wikidata.org/wiki/${explorer.wikidataId}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink/45 transition-colors">
                  Wikidata {explorer.wikidataId}
                </a>{" "}(CC0)
              </p>
            </aside>
          </div>

          {/* Voyages */}
          {hasVoyages ? (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display text-2xl font-semibold text-ink/80 italic">The Voyages</h2>
                <div className="flex-1 h-px bg-paper" />
              </div>

              <VoyageMap voyages={voyages} className="h-[26rem] sm:h-[34rem] w-full mb-3 rounded-2xl border border-paper" />

              <p className="text-xs text-ink/30 mb-10">
                Route data is compiled in chronological order from Wikipedia&apos;s voyage articles (CC BY-SA),
                cross-checked against primary source narratives and historical records. Waypoints mark approximate
                port, bay, and landfall locations — not survey-grade ship positions — and should be verified
                against detailed historical charts and logs before being treated as authoritative. Coordinates
                for remote stops and open-ocean legs are estimated and approximate.
              </p>

              <div className="space-y-6">
                {voyages.map((v) => (
                  <article key={v.id} className="rounded-2xl border border-paper bg-white/60 p-6">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: v.color }} aria-hidden="true" />
                      <h3 className="font-display text-lg font-semibold text-ink">{v.label}</h3>
                      <span className="text-ink/40 text-xs font-mono">{v.years}</span>
                      <span className="text-ink/40 text-xs">· {v.ship}</span>
                      <ReadAloudButton
                        text={`${v.label}. ${v.purpose} ${v.summary}`}
                        variant="minimal"
                        className="ml-auto self-center"
                      />
                    </div>
                    <p className="text-ancient/70 text-sm mb-2 italic">{v.purpose}</p>
                    <p className="text-ink/70 text-[15px] leading-[1.8]">{v.summary}</p>
                    {v.accuracyNote && (
                      <p className="mt-3 flex gap-2 text-xs text-ink/45 leading-relaxed rounded-lg border border-paper bg-parchment/60 px-3 py-2">
                        <span aria-hidden="true">⚠</span>
                        <span><span className="font-semibold text-ink/60">Accuracy:</span> {v.accuracyNote}</span>
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-paper bg-white/60 p-8 text-center">
              <p className="text-ink/50 text-sm max-w-md mx-auto leading-relaxed">
                A full mapped profile of {explorer.name}&apos;s journeys is coming soon. In the meantime, read
                the Wikipedia-sourced summary above or explore the{" "}
                <Link href="/theme/age-of-exploration" className="text-ancient/70 hover:text-ancient underline underline-offset-2">Age of Exploration</Link> hub.
              </p>
            </section>
          )}

          <div className="mt-10 max-w-md">
            <RelatedResources resourceKey={`explorer:${explorer.slug}`} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
