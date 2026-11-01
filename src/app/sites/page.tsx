import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import { formatYear } from "@/components/RulerTimeline";
import { SITE_LIST } from "@/lib/siteHistory";
import { buildPageMetadata, fitTitle } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: fitTitle(`${SITE_LIST.length} Historic Sites and Monuments: History and Maps`, "Historic Sites and Monuments: History and Maps"),
  description: "From Göbekli Tepe and Stonehenge to Machu Picchu and the Taj Mahal: the story of each great historic site, and every empire that held it, on historical maps.",
  path: "/sites",
});

/** Ages to group the sites by, oldest first. */
const AGES: { label: string; until: number }[] = [
  { label: "Before 3000 BCE", until: -3000 },
  { label: "3000–1000 BCE", until: -1000 },
  { label: "1000 BCE–1 CE", until: 1 },
  { label: "1–1000 CE", until: 1000 },
  { label: "1000–1500", until: 1500 },
  { label: "1500 to today", until: Infinity },
];

export default function SitesIndexPage() {
  const byDate = [...SITE_LIST].sort((a, b) => a.built - b.built);
  const groups = AGES.map((age, i) => ({
    ...age,
    sites: byDate.filter((s) => s.built < age.until && (i === 0 || s.built >= AGES[i - 1].until)),
  })).filter((g) => g.sites.length);
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            collectionLd("Historic sites", "The great monuments and archaeological sites, and every state that held them.", "/sites", SITE_LIST.map((s) => ({ name: s.name, path: `/site/${s.slug}` }))),
            breadcrumbLd([["Historic sites", "/sites"]]),
          ]}
        />
        <PageIntro
          label="Historic sites"
          title={<>Monuments that <span className="italic">outlived empires</span></>}
          lede="The great monuments and ruins of the world, oldest first. Each page tells the site’s story and traces every state that held the ground it stands on."
          aside={<p className="font-mono text-[12px] tracking-wide text-ink/68 leading-relaxed">{SITE_LIST.length} sites</p>}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
          {groups.map((g) => (
            <section key={g.label}>
              <h2 className="label text-ink/66 border-t border-ink/80 pt-5 mb-5">{g.label}</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
                {g.sites.map((s) => (
                  <li key={s.slug} className="border-b border-ink/10 py-3">
                    <Link href={`/site/${s.slug}`} className="group block">
                      <span className="font-display text-xl tracking-tight text-ink group-hover:text-accent transition-colors">{s.name}</span>
                      <span className="block font-mono text-[11px] tracking-wide text-ink/66 mt-0.5">
                        {s.country} · c. {formatYear(s.built)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
