import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TimelineClient from "@/components/TimelineClient";

export const metadata: Metadata = {
  title: "Timeline — World History Atlas",
  description: "Browse 53 historical snapshots from 123,000 BCE to 2010 CE. Click any year to open the map.",
};

export default function TimelinePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <TimelineClient />
      </main>
      <SiteFooter />
    </>
  );
}
