import { Suspense } from "react";
import { JsonLd, webAppLd } from "@/lib/jsonLd";
import type { Metadata } from "next";
import AtlasPageClient from "@/components/AtlasPageClient";
import { formatYear } from "@/data/snapshotYears";
import { DEFAULT_SOCIAL_IMAGE, brandTitle } from "@/lib/seo";

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

  // Every variant shares the canonical /map, so the default (no ?year) is
  // what search engines index: describe the tool, not one year.
  const title = sp.year
    ? brandTitle(`World Map in ${yearLabel}: Historical Borders`)
    : brandTitle("Interactive Historical World Map: Empires & Borders Through Time");
  const description = sp.year
    ? `The world's empires, kingdoms and borders as they were in ${yearLabel}, on an interactive historical map you can scrub through time.`
    : "Drag through 5,000 years on an interactive world map: see the borders of every empire, kingdom and nation from ancient Egypt and Rome to today.";
  return {
    title,
    description,
    // Year/region/viewport live in the query string as app state, not as distinct
    // pages — collapse every variant to the clean URL.
    alternates: { canonical: "/map" },
    openGraph: { title, description, type: "website", siteName: "Borders of Time", url: "/map", images: [{ url: DEFAULT_SOCIAL_IMAGE }] },
    twitter: { card: "summary_large_image", title, description, images: [DEFAULT_SOCIAL_IMAGE] },
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
    <>
    <JsonLd data={webAppLd("Borders of Time interactive historical map", "An interactive world map of historical borders, from 3000 BCE to today.", "/map")} />
    <Suspense
      fallback={
        <div className="w-full h-svh bg-[#cdd9e5] flex items-center justify-center">
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink/64 animate-pulse">Unrolling the map…</span>
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
    </>
  );
}
