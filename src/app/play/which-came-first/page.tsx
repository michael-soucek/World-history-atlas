import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, webAppLd } from "@/lib/jsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import PlayTabs from "@/components/PlayTabs";
import WhichFirstGame from "@/components/WhichFirstGame";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Which Came First? History Timeline Game — Borders of Time",
  description: "Two moments from history, side by side. Pick the one that happened first and see how long a streak you can build as the pairs get closer in time.",
  path: "/play/which-came-first",
});

export default function WhichFirstPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            webAppLd("Which Came First?", "A history timeline game: two events, pick the earlier one, build a streak.", "/play/which-came-first", "GameApplication"),
            breadcrumbLd([["Games", "/play"], ["Which Came First?", "/play/which-came-first"]]),
          ]}
        />
        <PageIntro
          label="Streak game"
          title={<>Which came <span className="italic">first?</span></>}
          lede="Two moments from history. Pick the earlier one. Every right answer brings the next pair closer together in time, and one miss ends the run."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <PlayTabs current="/play/which-came-first" />
          <WhichFirstGame />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
