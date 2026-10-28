import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SearchClient from "@/components/SearchClient";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { EXPLORERS } from "@/data/voyages";
import type { SearchItem } from "@/lib/searchIndex";
import { COUNTRY_LIST } from "@/lib/countries";
import { getOurArticle } from "@/lib/ourArticles";
import { PHILOSOPHY_ERAS } from "@/data/philosophy";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Search — Borders of Time",
    description: "Search across empires, people, events, and cultures in the Borders of Time.",
  }),
  // A search box isn't a page worth ranking; results pages (?q=…) even less so.
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  // Build the static index at render time (server component — fast)
  const items: SearchItem[] = [];

  // Places from the main crosswalk
  for (const [name, entry] of Object.entries(CROSSWALK)) {
    items.push({
      slug: entry.slug,
      name,
      entityType: "place",
      wikidataId: entry.wikidataId,
      route: "place",
    });
  }

  // People
  for (const entry of Object.values(PEOPLE_CROSSWALK)) {
    items.push({
      slug: entry.slug,
      name: entry.name ?? entry.slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
      entityType: "person",
      wikidataId: entry.wikidataId,
      route: "person",
    });
  }

  // Events
  for (const entry of Object.values(EVENTS_CROSSWALK)) {
    items.push({
      slug: entry.slug,
      name: entry.name ?? entry.slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
      entityType: "event",
      wikidataId: entry.wikidataId,
      route: "event",
    });
  }

  // Cultures
  for (const entry of Object.values(CULTURES_CROSSWALK)) {
    items.push({
      slug: entry.slug,
      name: entry.name ?? entry.slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
      entityType: "culture",
      wikidataId: entry.wikidataId,
      route: "culture",
    });
  }

  // Explorers (people, with their own voyage pages)
  for (const e of EXPLORERS) {
    if (items.some((i) => i.route === "person" && i.slug === e.slug)) continue;
    items.push({ slug: e.slug, name: e.name, entityType: "person", wikidataId: e.wikidataId ?? e.slug, route: "explorer", label: "Explorer" });
  }

  // Country histories and philosophy eras with a written article
  for (const c of COUNTRY_LIST) {
    if (!getOurArticle("country", c.slug)) continue;
    items.push({ slug: c.slug, name: `${c.name}: history`, entityType: "place", wikidataId: c.wikidataId, route: "country", label: "Country" });
  }
  items.push({ slug: "", name: "History of philosophy", entityType: "culture", wikidataId: "Q5891", route: "philosophy", label: "Philosophy" });
  for (const e of PHILOSOPHY_ERAS) {
    if (!getOurArticle("philosophy", e.slug)) continue;
    items.push({ slug: e.slug, name: e.title, entityType: "culture", wikidataId: `philosophy-${e.slug}`, route: "philosophy", label: "Philosophy" });
  }

  // Sort alphabetically
  items.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <SearchClient items={items} />
      </main>
      <SiteFooter />
    </>
  );
}
