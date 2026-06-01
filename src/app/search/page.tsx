import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SearchClient from "@/components/SearchClient";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import type { SearchItem } from "@/lib/searchIndex";

export const metadata: Metadata = {
  title: "Search — World History Atlas",
  description: "Search across empires, people, events, and cultures in the World History Atlas.",
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
      name: entry.slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
      entityType: "person",
      wikidataId: entry.wikidataId,
      route: "person",
    });
  }

  // Events
  for (const entry of Object.values(EVENTS_CROSSWALK)) {
    items.push({
      slug: entry.slug,
      name: entry.slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
      entityType: "event",
      wikidataId: entry.wikidataId,
      route: "event",
    });
  }

  // Cultures
  for (const entry of Object.values(CULTURES_CROSSWALK)) {
    items.push({
      slug: entry.slug,
      name: entry.slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
      entityType: "culture",
      wikidataId: entry.wikidataId,
      route: "culture",
    });
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
