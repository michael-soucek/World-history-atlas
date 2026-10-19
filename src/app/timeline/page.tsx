import type { Metadata } from "next";
import { JsonLd, collectionLd } from "@/lib/jsonLd";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import { buildPageMetadata } from "@/lib/seo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TimelineClient from "@/components/TimelineClient";

export const metadata: Metadata = buildPageMetadata({
  title: "Timeline of World History in Maps: 54 Maps, 123,000 BCE to 2010 — Borders of Time",
  description: "Every historical world map in the atlas, in order, from the Ice Age to 2010. Pick a year to see the borders of the world's empires and nations at that moment.",
  path: "/timeline",
});

export default function TimelinePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <JsonLd
          data={collectionLd("Timeline of world history in maps", "Every historical world map in the atlas, in order.", "/timeline", SNAPSHOT_YEARS.map((y) => ({ name: y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`, path: `/map?year=${y}` })))}
        />
        <TimelineClient />
      </main>
      <SiteFooter />
    </>
  );
}
