import type { Metadata } from "next";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import CitySearch from "@/components/CitySearch";
import { CITY_LIST, distinctRulers, rulersOf } from "@/lib/cityHistory";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Who Ruled It? The History of ${CITY_LIST.length} World Cities on the Map — Borders of Time`,
  description: "Who ruled Istanbul, Jerusalem or Budapest? Pick a city to see every empire, kingdom and people that held it, from the ancient world to today, on old maps.",
  path: "/history-of",
});

export default function CityIndexPage() {
  // How many rulers each city has had: shown beside its name.
  const cities = CITY_LIST.map((c) => ({ ...c, rulers: distinctRulers(rulersOf(c.slug)).length }));
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            collectionLd("Who ruled it? City histories", "Every state that has held each city, on historical maps.", "/history-of", CITY_LIST.map((c) => ({ name: c.name, path: `/history-of/${c.slug}` }))),
            breadcrumbLd([["Who ruled it?", "/history-of"]]),
          ]}
        />
        <PageIntro
          label="Who ruled it?"
          title={<>Every city has <span className="italic">many masters</span></>}
          lede="Pick a city to see every state, empire and people that held it, traced through each of our historical maps."
          aside={
            <p className="font-mono text-[12px] tracking-wide text-ink/68 leading-relaxed">
              {cities.length} cities
            </p>
          }
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <CitySearch cities={cities.map(({ slug, name, country, formerly, rulers }) => ({ slug, name, country, formerly, rulers }))} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
