import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TourPlayer from "@/components/TourPlayer";
import RelatedResources from "@/components/RelatedResources";
import { TOURS, getTourBySlug } from "@/data/tours";
import { buildPageMetadata } from "@/lib/seo";

interface Props { params: Promise<{ slug: string }> }

// A couple of the full descriptions in tours.ts run past the ~160-char
// meta-description budget — shortened here without touching the source
// copy, which still renders in full on the /tour hub page.
const META_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "silk-road-and-trade":
    "Long before oceans were crossed, overland caravans and monsoon-driven ships linked China, India, the Islamic world, Africa, and Europe in trade and ideas.",
  "chinese-dynasties":
    "For over two thousand years, Chinese history moved through unification, flourishing, decline, and renewal — a succession of dynasties that shaped East Asia.",
};

export async function generateStaticParams() {
  return TOURS.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: "Tour not found — Borders of Time" };
  return buildPageMetadata({
    title: `${tour.title} — Borders of Time`,
    // Two tour descriptions run past Google's ~160-char meta-description
    // display width; shortened here for the meta tag specifically (a blind
    // slice(0, 160) cuts both mid-word). The full description still renders
    // in full on the /tour hub page.
    description: META_DESCRIPTION_OVERRIDES[slug] ?? tour.description,
    path: `/tour/${slug}`,
  });
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <TourPlayer tour={tour} />
        <div className="max-w-5xl mx-auto px-6 pb-14">
          <RelatedResources resourceKey={`tour:${tour.slug}`} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
