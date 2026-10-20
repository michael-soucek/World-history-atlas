import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import PageIntro from "@/components/PageIntro";
import VoyageMap from "@/components/VoyageMap";
import RelatedResources from "@/components/RelatedResources";
import ArticleImage, { type ArticleImageData } from "@/components/ArticleImage";
import { ImageStrip, WikipediaExcerpt, toArticleImage } from "@/components/ArticleBody";
import { getEntityImages } from "@/lib/entityImages";
import { EXPLORERS, getExplorerBySlug } from "@/data/voyages";
import { buildEntityContent } from "@/lib/wikidata";
import { buildPageMetadata, metaDescription } from "@/lib/seo";
import { JsonLd, SITE_URL, breadcrumbLd } from "@/lib/jsonLd";

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
  const isExpedition = explorer.lifespan.startsWith("Expedition");
  const title = `${explorer.name}${isExpedition ? "" : ` (${explorer.lifespan})`}: ${isExpedition ? "Expedition" : "Voyages"}, Route Map & Timeline — Borders of Time`;
  const description = metaDescription(`${explorer.tagline} Every stop dated and mapped.`)!;
  return buildPageMetadata({ title, description, path: `/explorer/${slug}`, type: "article", imageUrl: content?.imageUrl });
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
        <JsonLd
          data={[
            {
              "@type": explorer.lifespan.startsWith("Expedition") ? "Event" : "Person",
              name: explorer.name,
              description: explorer.tagline,
              url: `${SITE_URL}/explorer/${explorer.slug}`,
              image: content?.imageUrl,
              sameAs: [content?.wikipediaUrl, `https://www.wikidata.org/wiki/${explorer.wikidataId}`].filter(Boolean),
            },
            breadcrumbLd([["Age of Exploration", "/theme/age-of-exploration"], [explorer.name, `/explorer/${explorer.slug}`]]),
          ]}
        />
        <PageIntro
          crumbs={[{ href: "/browse", label: "Browse" }, { href: "/theme/age-of-exploration", label: "Age of Exploration" }]}
          label={`Explorer · ${explorer.lifespan}`}
          title={explorer.name}
          lede={explorer.tagline}
          aside={
            hasVoyages ? (
              <p className="font-mono text-[12px] tracking-wide text-ink/50 leading-relaxed">
                {voyages.length} voyage{voyages.length !== 1 ? "s" : ""}<br />
                {voyages.reduce((n, v) => n + v.waypoints.length, 0)} dated stops
              </p>
            ) : undefined
          }
        />

        {/* ── The voyages, first: they are the point of the page ── */}
        {hasVoyages ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
            <VoyageMap voyages={voyages} className="h-[30rem] sm:h-[40rem] w-full" />
            <p className="mt-3 text-[11px] text-ink/40 leading-relaxed max-w-4xl">
              Route data is compiled in chronological order from Wikipedia&apos;s voyage articles (CC BY-SA),
              cross-checked against primary source narratives and historical records. Waypoints mark approximate
              port, bay, and landfall locations — not survey-grade ship positions — and should be verified
              against detailed historical charts and logs before being treated as authoritative. Coordinates
              for remote stops and open-ocean legs are estimated and approximate.
            </p>

            <ol className="mt-14 border-t border-ink/80">
              {voyages.map((v, i) => (
                <li key={v.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 py-8 sm:py-10 border-b border-ink/10">
                  <div className="lg:col-span-4">
                    <p className="flex items-center gap-3 font-mono text-[11px] tracking-wider text-ink/50">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: v.color }} aria-hidden="true" />
                      {String(i + 1).padStart(2, "0")} · {v.years}
                    </p>
                    <h3 className="mt-2 font-display text-3xl tracking-tight text-ink">{v.label}</h3>
                    <p className="mt-1 text-sm text-ink/50">{v.ship} · {v.waypoints.length} stops</p>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="font-display italic text-xl text-accent leading-snug">{v.purpose}</p>
                    <p className="mt-3 font-text text-[17px] sm:text-[18px] leading-[1.7] text-ink/85">{v.summary}</p>
                    <div className="mt-3 flex items-start gap-4">
                      <ReadAloudButton text={`${v.label}. ${v.purpose} ${v.summary}`} variant="minimal" className="-ml-3" />
                      {v.accuracyNote && (
                        <p className="text-xs text-ink/50 leading-relaxed border-l-2 border-accent/40 pl-3 py-1">
                          <span className="font-semibold text-ink/70">On accuracy:</span> {v.accuracyNote}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <p className="border-y border-ink/10 py-6 text-ink/60 text-[15px] leading-relaxed max-w-2xl">
              A full mapped profile of {explorer.name}&apos;s journeys is coming soon. In the meantime, read the
              Wikipedia-sourced summary below or explore the{" "}
              <Link href="/theme/age-of-exploration" className="text-accent hover:text-ink underline underline-offset-2">Age of Exploration</Link> hub.
            </p>
          </section>
        )}

        {/* ── Biography ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8">
          <article className="lg:col-span-7 xl:col-start-2 min-w-0">
            <h2 className="font-display font-light text-4xl sm:text-5xl tracking-[-0.03em] text-ink mb-10">The life</h2>
            {hero && (
              <div className="mb-10">
                <ArticleImage img={hero} alt={hero.caption || `Depiction of ${explorer.name}`} variant="float" side="right" priority />
              </div>
            )}
            {content?.summary ? (
              <WikipediaExcerpt name={explorer.name} summary={content.summary} wikipediaUrl={content.wikipediaUrl} image={summaryImage} />
            ) : (
              <p className="font-text text-ink/70 text-lg leading-relaxed">{explorer.tagline}</p>
            )}
            {stripImages.length > 0 && <ImageStrip images={stripImages} name={explorer.name} />}
          </article>

          <aside className="lg:col-span-4 lg:col-start-9 xl:col-start-10 xl:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-6">
              <Link href="/tour/age-of-discovery" className="group block bg-night text-parchment p-6 relative overflow-hidden">
                <div className="absolute inset-0 graticule-night opacity-80" aria-hidden="true" />
                <div className="relative">
                  <p className="label text-glow/80">Guided tour</p>
                  <p className="mt-2 font-display text-[26px] leading-[1.1] tracking-tight">The Age of Discovery</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-parchment/70 group-hover:text-parchment transition-colors">
                    Start the tour <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
              {content?.wikipediaUrl && (
                <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-y border-ink/15 py-4 text-sm text-ink/70 hover:text-accent transition-colors">
                  Full article on Wikipedia <span aria-hidden="true">↗</span>
                </a>
              )}
              <RelatedResources resourceKey={`explorer:${explorer.slug}`} />
              <p className="text-[11px] text-ink/35 leading-relaxed">
                Structured data:{" "}
                <a href={`https://www.wikidata.org/wiki/${explorer.wikidataId}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent transition-colors">
                  Wikidata {explorer.wikidataId}
                </a>{" "}(CC0)
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
