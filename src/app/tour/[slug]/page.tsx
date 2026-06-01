import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TourPlayer from "@/components/TourPlayer";
import { TOURS, getTourBySlug } from "@/data/tours";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return TOURS.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: "Tour not found — World History Atlas" };
  return {
    title: `${tour.title} — World History Atlas`,
    description: tour.description,
  };
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
      </main>
      <SiteFooter />
    </>
  );
}
