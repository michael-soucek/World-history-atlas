import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HistoricalMap from "@/components/HistoricalMap";
import TimelineClient from "@/components/TimelineClient";

export const metadata: Metadata = {
  title: "Timeline — Borders of Time",
  description: "Browse 53 historical snapshots from 123,000 BCE to 2010 CE. Click any year to open the map.",
};

export default function TimelinePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <section className="bg-parchment py-10 border-b border-paper">
          <div className="max-w-6xl mx-auto px-6">
            <HistoricalMap />
          </div>
        </section>
        <TimelineClient />
      </main>
      <SiteFooter />
    </>
  );
}
