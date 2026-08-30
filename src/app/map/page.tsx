import { Suspense } from "react";
import type { Metadata } from "next";
import AtlasPageClient from "@/components/AtlasPageClient";
import { formatYear } from "@/data/snapshotYears";

interface Props {
  searchParams: Promise<{
    year?: string;
    lat?: string;
    lng?: string;
    z?: string;
    region?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const year = sp.year ? parseInt(sp.year, 10) : 1700;
  const yearLabel = formatYear(year);

  return {
    title: `${yearLabel} — Borders of Time`,
    description: `Explore the historical world map in ${yearLabel}. Watch empires rise and fall across time.`,
    // Year/region/viewport live in the query string as app state, not as distinct
    // pages — collapse every variant to the clean URL.
    alternates: { canonical: "/map" },
    openGraph: {
      title: `Borders of Time — ${yearLabel}`,
      description: `Explore the world map as it looked in ${yearLabel}.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Borders of Time — ${yearLabel}`,
    },
  };
}

export default async function MapPage({ searchParams }: Props) {
  const sp = await searchParams;

  const year = sp.year ? parseInt(sp.year, 10) : 1700;
  const lat = sp.lat ? parseFloat(sp.lat) : 20;
  const lng = sp.lng ? parseFloat(sp.lng) : 10;
  const zoom = sp.z ? parseFloat(sp.z) : 2;
  const regionId = sp.region;

  return (
    <Suspense
      fallback={
        <div className="w-full h-screen bg-neutral-900 flex items-center justify-center">
          <span className="text-white/40 text-sm animate-pulse">Loading atlas…</span>
        </div>
      }
    >
      <AtlasPageClient
        initialYear={year}
        initialLat={lat}
        initialLng={lng}
        initialZoom={zoom}
        initialRegionId={regionId}
      />
    </Suspense>
  );
}
