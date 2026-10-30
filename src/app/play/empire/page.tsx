import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, webAppLd } from "@/lib/jsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import PlayTabs from "@/components/PlayTabs";
import EmpireGame from "@/components/EmpireGame";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Name the Empire: Daily Historical Map Quiz — Borders of Time",
  description: "One empire lit up on a historical map, four names to choose from. Five rounds a day from 500 BCE to today, plus unlimited practice. How well do you know the world's old borders?",
  path: "/play/empire",
});

export default function EmpireGamePage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            webAppLd("Name the Empire", "A daily history quiz: one territory lit up on a historical map, four names to choose from.", "/play/empire", "GameApplication"),
            breadcrumbLd([["Games", "/play"], ["Name the Empire", "/play/empire"]]),
          ]}
        />
        <PageIntro
          label="Daily game"
          title={<>Name the <span className="italic">empire</span></>}
          lede="One state lit up on a map of the past, four names to choose from. Five rounds a day, from the ancient world to today."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <PlayTabs current="/play/empire" />
          <EmpireGame />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
