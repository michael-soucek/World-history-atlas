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
import { TOURS } from "@/data/tours";
import { CITY_LIST } from "@/lib/cityHistory";
import { ERA_LIST, eraSlug } from "@/data/eras";

/** Names people search by that aren't the page's own, keyed by slug. */
const ALIASES: Record<string, string[]> = {
  "james-cook": ["Captain Cook", "Endeavour"],
  "leif-erikson": ["Leif Ericson", "Vikings in America"],
  "lewis-and-clark": ["Corps of Discovery"],
  "charles-darwin": ["HMS Beagle", "Beagle"],
  "ferdinand-magellan": ["Magallanes", "first circumnavigation"],
  "christopher-columbus": ["Cristoforo Colombo", "Cristobal Colon"],
};

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
    items.push({ slug: e.slug, name: e.name, entityType: "person", wikidataId: e.wikidataId ?? e.slug, route: "explorer", label: "Explorer", tagline: e.tagline });
  }

  // Guided tours, city histories, eras and the world wars page
  for (const t of TOURS) {
    items.push({ slug: t.slug, name: t.title, entityType: t.entityType ?? "event", wikidataId: `tour-${t.slug}`, route: "tour", label: "Tour" });
  }
  for (const c of CITY_LIST) {
    items.push({ slug: c.slug, name: `${c.name}: history`, entityType: "place", wikidataId: `city-${c.slug}`, route: "history-of", label: "City", tagline: c.formerly ? `Formerly ${c.formerly}` : undefined });
  }
  for (const e of ERA_LIST) {
    if (!isFinite(e.start)) continue;
    items.push({ slug: eraSlug(e.label), name: `${e.label} era`, entityType: "event", wikidataId: `era-${e.label}`, route: "era", label: "Era" });
  }
  items.push({ slug: "", name: "The world wars", entityType: "event", wikidataId: "world-wars", route: "world-wars", label: "World wars", aliases: ["WW1", "WW2", "WWI", "WWII", "World War I", "World War II", "World War 1", "World War 2", "First World War", "Second World War"] });

  for (const item of items) {
    const extra = ALIASES[item.slug];
    if (extra) item.aliases = [...(item.aliases ?? []), ...extra];
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
