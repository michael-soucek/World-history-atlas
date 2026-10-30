import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import Gazetteer from "@/components/Gazetteer";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { getOurArticle } from "@/lib/ourArticles";
import { CONTINENTS, COUNTRY_LIST } from "@/lib/countries";

const published = COUNTRY_LIST.filter((c) => getOurArticle("country", c.slug));

export const metadata: Metadata = buildPageMetadata({
  title: `The History of Every Country: ${published.length} Country Histories — Borders of Time`,
  description: "The history of every country in the world, from the first peoples to today: key dates, the empires that ruled each land, and its borders on historical maps.",
  path: "/countries",
});

export default function CountriesPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            collectionLd(
              "Country histories",
              "The history of every country in the world.",
              "/countries",
              published.map((c) => ({ name: `History of ${c.name}`, path: `/country/${c.slug}` })),
            ),
            breadcrumbLd([["Countries", "/countries"]]),
          ]}
        />
        <PageIntro
          label="Country histories"
          title={<>The history of <span className="italic">every country</span></>}
          lede="Each country's whole story, from its first peoples to today, with key dates, the empires that held its land, and links to its borders on our maps."
          aside={
            <nav aria-label="Continents" className="flex flex-wrap lg:justify-end gap-x-5 gap-y-2 font-mono text-[12px] tracking-wide text-ink/68">
              {CONTINENTS.map((c) => (
                <a key={c.slug} href={`#${c.slug}`} className="hover:text-accent transition-colors">{c.label}</a>
              ))}
            </nav>
          }
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
          {CONTINENTS.map((continent) => {
            const list = COUNTRY_LIST.filter((c) => c.continent === continent.slug);
            return (
              <section key={continent.slug} id={continent.slug} className="scroll-mt-24">
                <SectionRule count={`${list.length}`}>{continent.label}</SectionRule>
                <Gazetteer
                  items={list.map((c) => ({
                    href: `/country/${c.slug}`,
                    name: c.name,
                    meta: c.capital,
                    pending: !getOurArticle("country", c.slug),
                  }))}
                />
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
