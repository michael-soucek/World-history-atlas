import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TimelineClient from "@/components/TimelineClient";

export const metadata: Metadata = {
  title: "Timeline — Borders of Time",
  description: "Browse 54 historical maps from 123,000 BCE to 2010 CE. Click any year to open the map.",
  alternates: { canonical: "/timeline" },
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
