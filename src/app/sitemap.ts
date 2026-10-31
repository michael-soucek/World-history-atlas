import type { MetadataRoute } from "next";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { ERA_LIST, eraSlug } from "@/data/eras";
import { TOURS } from "@/data/tours";
import { CITY_LIST } from "@/lib/cityHistory";
import { EXPLORERS } from "@/data/voyages";
import { TIMELAPSES } from "@/data/timelapses";
import { PHILOSOPHY_ERAS } from "@/data/philosophy";
import { COUNTRY_LIST } from "@/lib/countries";
import { getOurArticle, type ArticleKind } from "@/lib/ourArticles";

/** An article's "written" date, else the given fallback. */
const writtenOn = (kind: ArticleKind, slug: string, fallback: Date) => {
  const w = getOurArticle(kind, slug)?.written;
  return w ? new Date(w) : fallback;
};

const BASE = "https://www.bordersoftime.com";
// Every entity page got its own article (content/articles) on this date.
const ARTICLES_WRITTEN = new Date("2026-10-22");

const REGION_SLUGS = [
  "europe", "east-asia", "south-asia", "middle-east",
  "africa", "americas", "central-asia", "southeast-asia", "oceania",
];
const THEME_SLUGS = [
  "empires", "religions", "trade-routes", "conflicts",
  "science", "art-culture", "revolutions", "age-of-exploration",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // When the site's content last changed. A build-time "now" told Google every
  // page changed on every deploy, which teaches it to ignore lastmod; bump this
  // when pages are actually updated.
  const now = new Date("2026-10-19");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/map`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/timeline`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/browse`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...(["place", "person", "event", "culture"] as const).map((t) => ({
      url: `${BASE}/browse?type=${t}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6,
    })),
    { url: `${BASE}/tour`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/world-wars`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/borders-over-time`, lastModified: new Date("2026-10-21"), changeFrequency: "monthly", priority: 0.8 },
    ...TIMELAPSES.map((t) => ({
      url: `${BASE}/borders-over-time/${t.slug}`, lastModified: new Date("2026-10-21"), changeFrequency: "monthly" as const, priority: 0.8,
    })),
    { url: `${BASE}/history-of`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/countries`, lastModified: new Date("2026-10-25"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/philosophy`, lastModified: new Date("2026-10-25"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/play`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/play/empire`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/play/which-came-first`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/play/order`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/support`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/pro`,      lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/contact`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  // One URL per Wikidata entity: alias slugs (manchu-empire → qing-dynasty)
  // redirect, and a sitemap should only list final URLs.
  const seenQids = new Set<string>();
  // Places that are really culture pages (e.g. the map's "Anasazi") redirect there.
  const cultureQids = new Set(Object.values(CULTURES_CROSSWALK).map(c => c.wikidataId));
  const uniquePlaces = Object.values(CROSSWALK).filter(e => !cultureQids.has(e.wikidataId) && !seenQids.has(e.wikidataId) && seenQids.add(e.wikidataId));
  const placeRoutes: MetadataRoute.Sitemap = uniquePlaces.map(e => ({
    url: `${BASE}/place/${e.slug}`,
    // Place pages: new search titles (2026-10-21), 57 new places and our own articles (2026-10-22).
    lastModified: new Date("2026-10-22"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const personRoutes: MetadataRoute.Sitemap = Object.values(PEOPLE_CROSSWALK).map(e => ({
    url: `${BASE}/person/${e.slug}`,
    lastModified: writtenOn("person", e.slug, ARTICLES_WRITTEN),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = Object.values(EVENTS_CROSSWALK).map(e => ({
    url: `${BASE}/event/${e.slug}`,
    lastModified: ARTICLES_WRITTEN,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cultureRoutes: MetadataRoute.Sitemap = Object.values(CULTURES_CROSSWALK).map(e => ({
    url: `${BASE}/culture/${e.slug}`,
    lastModified: ARTICLES_WRITTEN,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eraRoutes: MetadataRoute.Sitemap = ERA_LIST.map(era => ({
    url: `${BASE}/era/${eraSlug(era.label)}`,
    lastModified: writtenOn("era", eraSlug(era.label), now),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const regionRoutes: MetadataRoute.Sitemap = REGION_SLUGS.map(s => ({
    url: `${BASE}/region/${s}`,
    lastModified: writtenOn("region", s, now),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const themeRoutes: MetadataRoute.Sitemap = THEME_SLUGS.map(s => ({
    url: `${BASE}/theme/${s}`,
    lastModified: writtenOn("theme", s, now),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const tourRoutes: MetadataRoute.Sitemap = TOURS.map(t => ({
    url: `${BASE}/tour/${t.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const cityRoutes: MetadataRoute.Sitemap = CITY_LIST.map(c => ({
    url: `${BASE}/history-of/${c.slug}`,
    lastModified: writtenOn("city", c.slug, now),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const explorerRoutes: MetadataRoute.Sitemap = EXPLORERS.map(e => ({
    url: `${BASE}/explorer/${e.slug}`,
    lastModified: ARTICLES_WRITTEN,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const timelineRoutes: MetadataRoute.Sitemap = ERA_LIST.map(era => ({
    url: `${BASE}/timeline/${eraSlug(era.label)}`,
    lastModified: writtenOn("timeline", eraSlug(era.label), now),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // Country histories and philosophy eras, once their article is written.
  const countryRoutes: MetadataRoute.Sitemap = COUNTRY_LIST.filter((c) => getOurArticle("country", c.slug)).map((c) => ({
    url: `${BASE}/country/${c.slug}`,
    lastModified: writtenOn("country", c.slug, ARTICLES_WRITTEN),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const philosophyRoutes: MetadataRoute.Sitemap = PHILOSOPHY_ERAS.filter((e) => getOurArticle("philosophy", e.slug)).map((e) => ({
    url: `${BASE}/philosophy/${e.slug}`,
    lastModified: writtenOn("philosophy", e.slug, ARTICLES_WRITTEN),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...countryRoutes,
    ...philosophyRoutes,
    ...placeRoutes,
    ...personRoutes,
    ...eventRoutes,
    ...cultureRoutes,
    ...eraRoutes,
    ...regionRoutes,
    ...themeRoutes,
    ...tourRoutes,
    ...cityRoutes,
    ...explorerRoutes,
    ...timelineRoutes,
  ];
}
