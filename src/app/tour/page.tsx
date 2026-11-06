import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import TourBrowser, { type TourCardData, type TourShelf } from "@/components/TourBrowser";
import { TOURS, type Tour } from "@/data/tours";
import { COVER_STOP, FEATURED_TOURS, TOUR_GROUPS } from "@/data/tourGroups";
import { cleanAuthor, commonsSrcSet } from "@/lib/commonsImage";
import { tourExtras } from "@/lib/tourExtras";
import type { ArticleImageData } from "@/components/ArticleImage";
import { buildPageMetadata, fitTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: fitTitle(`${TOURS.length} Guided History Tours on an Animated Map`),
  description: `Narrated map tours of history's biggest events, with animated arrows and battles: the Mongols, the Crusades, Alexander, Napoleon, World War II and ${TOURS.length - 5} more.`,
  path: "/tour",
});

const DIFFICULTY_LABEL = {
  "intro":     "Introductory",
  "standard":  "Standard",
  "deep-dive": "Deep dive",
};

const fmt = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y} CE`);

/** A tour's chosen cover, or else the first picture any of its stops uses. */
const tourPicture = async (tour: Tour): Promise<ArticleImageData | undefined> => {
  const stops = await tourExtras(tour);
  return stops[COVER_STOP[tour.slug]]?.image ?? stops.find((stop) => stop.image)?.image;
};

const toCard = (tour: Tour, picture?: ArticleImageData): TourCardData => {
  const years = tour.steps.map((s) => s.mapState.year);
  const from = Math.min(...years);
  const to = Math.max(...years);
  return {
    slug: tour.slug,
    title: tour.title,
    description: tour.description,
    meta: `${DIFFICULTY_LABEL[tour.difficulty]} · ${tour.steps.length} stops · ${tour.duration} min`,
    from,
    to,
    span: `${fmt(from)} → ${fmt(to)}`,
    image: picture ? { src: picture.thumb, alt: picture.caption ?? "" } : undefined,
  };
};

export default async function TourListPage() {
  const totalMinutes = TOURS.reduce((n, t) => n + t.duration, 0);
  const pictures = new Map(await Promise.all(TOURS.map(async (t) => [t.slug, await tourPicture(t)] as const)));
  const card = (tour: Tour) => toCard(tour, pictures.get(tour.slug));

  const bySlug = new Map(TOURS.map((t) => [t.slug, t]));
  const grouped = new Set(TOUR_GROUPS.flatMap((g) => g.slugs));
  const leftOver = TOURS.filter((t) => !grouped.has(t.slug));
  const shelves: TourShelf[] = [
    ...TOUR_GROUPS.map(({ id, title, blurb, slugs }) => ({
      id,
      title,
      blurb,
      tours: slugs.flatMap((slug) => {
        const tour = bySlug.get(slug);
        return tour ? [card(tour)] : [];
      }),
    })),
    ...(leftOver.length ? [{ id: "more", title: "More tours", blurb: "The latest additions.", tours: leftOver.map(card) }] : []),
  ];
  const featured = FEATURED_TOURS.flatMap((slug) => {
    const tour = bySlug.get(slug);
    return tour ? [card(tour)] : [];
  });
  const credits = TOURS.flatMap((t) => {
    const img = pictures.get(t.slug);
    return img && (img.author || img.license) ? [{ title: t.title, img }] : [];
  });

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <JsonLd
          data={[
            collectionLd("Guided history tours", "Narrated map tours of history's biggest events.", "/tour", TOURS.map((t) => ({ name: t.title, path: `/tour/${t.slug}` }))),
            breadcrumbLd([["Guided tours", "/tour"]]),
          ]}
        />
        <PageIntro
          label="Guided tours"
          title={<>Let the map <span className="italic">tell the story</span></>}
          lede="Each tour moves the atlas for you — the year, the place, the zoom — while a short narration explains what changed and why."
          aside={
            <p className="font-mono text-[12px] tracking-wide text-ink/68 leading-relaxed">
              {TOURS.length} tours<br />about {totalMinutes} minutes in all
            </p>
          }
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          {/* Start here */}
          <h2 className="label text-ink/64 mb-5">Start here</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((t) => (
              <li key={t.slug}>
                <Link href={`/tour/${t.slug}`} className="group block">
                  <span className="block overflow-hidden rounded-md">
                    {t.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.image.src}
                        srcSet={commonsSrcSet(t.image.src)}
                        sizes="(min-width: 768px) 30vw, 100vw"
                        alt=""
                        className="block w-full aspect-[4/3] object-cover bg-surface"
                      />
                    ) : (
                      <span className="block aspect-[4/3] bg-night graticule-night" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-4 block font-display text-[28px] leading-tight tracking-tight text-ink group-hover:text-accent transition-colors">
                    {t.title}
                  </span>
                  <span className="mt-2 block text-[15px] text-ink/70 leading-relaxed line-clamp-3">{t.description}</span>
                  <span className="mt-3 block font-mono text-[11px] tracking-wide text-ink/64 tabular-nums">{t.meta}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/world-wars"
            className="group mt-12 mb-12 flex items-center justify-between gap-4 border border-ink/15 rounded-md px-5 py-4 hover:border-accent transition-colors"
          >
            <span>
              <span className="block font-display text-xl tracking-tight text-ink group-hover:text-accent transition-colors">The world wars, stage by stage</span>
              <span className="block mt-1 text-[14px] text-ink/70">Front lines, occupied territory and every major battle of World War I and World War II.</span>
            </span>
            <ArrowUpRight size={20} className="shrink-0 text-ink/30 group-hover:text-accent transition-colors" aria-hidden="true" />
          </Link>

          <TourBrowser shelves={shelves} />

          <p className="mt-14 text-xs text-ink/64 leading-relaxed">
            Tours are built from the atlas&apos;s map data and published sources.
          </p>
          <details className="mt-3 text-xs text-ink/64 leading-relaxed">
            <summary className="cursor-pointer hover:text-ink">Picture credits</summary>
            <ul className="mt-3 sm:columns-2 gap-8">
              {credits.map(({ title, img }) => (
                <li key={title} className="mb-1.5 break-inside-avoid">
                  {title}:{" "}
                  {img.sourceUrl ? (
                    <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                      {cleanAuthor(img.author) || "Wikimedia Commons"}
                    </a>
                  ) : (
                    cleanAuthor(img.author)
                  )}
                  {img.license && (
                    <>
                      {", "}
                      {img.licenseUrl ? (
                        <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-ink">
                          {img.license}
                        </a>
                      ) : (
                        img.license
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
