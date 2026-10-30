import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, webAppLd } from "@/lib/jsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import GuessGame from "@/components/GuessGame";
import PlayTabs from "@/components/PlayTabs";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Guess the Year: Daily History Map Game (Like Wordle for History) — Borders of Time",
  description: "Five historical maps a day, names hidden. Can you tell the year from the borders alone? A new game every day, plus unlimited practice rounds.",
  path: "/play",
});

export default function PlayPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            webAppLd("Guess the Year", "A daily history game: five maps of the world's borders, names hidden. Guess the year of each.", "/play", "GameApplication"),
            breadcrumbLd([["Guess the Year", "/play"]]),
          ]}
        />
        <PageIntro
          label="Daily game"
          title={<>Guess the <span className="italic">year</span></>}
          lede="Five maps of the world's borders, names hidden. Guess when each was drawn; the closer you get, the more points you score."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <PlayTabs current="/play" />
          <GuessGame />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
