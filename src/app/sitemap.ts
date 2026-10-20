import type { MetadataRoute } from "next";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { ERA_LIST, eraSlug } from "@/data/eras";
import { TOURS } from "@/data/tours";
import { CITY_LIST } from "@/lib/cityHistory";
import { EXPLORERS } from "@/data/voyages";

const BASE = "https://www.bordersoftime.com";

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
    { url: `${BASE}/history-of`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/play`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/search`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/support`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/contact`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  // One URL per Wikidata entity: alias slugs (manchu-empire → qing-dynasty)
  // redirect, and a sitemap should only list final URLs.
  const seenQids = new Set<string>();
  const uniquePlaces = Object.values(CROSSWALK).filter(e => !seenQids.has(e.wikidataId) && seenQids.add(e.wikidataId));
  const placeRoutes: MetadataRoute.Sitemap = uniquePlaces.map(e => ({
    url: `${BASE}/place/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const personRoutes: MetadataRoute.Sitemap = Object.values(PEOPLE_CROSSWALK).map(e => ({
    url: `${BASE}/person/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = Object.values(EVENTS_CROSSWALK).map(e => ({
    url: `${BASE}/event/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cultureRoutes: MetadataRoute.Sitemap = Object.values(CULTURES_CROSSWALK).map(e => ({
    url: `${BASE}/culture/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const eraRoutes: MetadataRoute.Sitemap = ERA_LIST.map(era => ({
    url: `${BASE}/era/${eraSlug(era.label)}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const regionRoutes: MetadataRoute.Sitemap = REGION_SLUGS.map(s => ({
    url: `${BASE}/region/${s}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const themeRoutes: MetadataRoute.Sitemap = THEME_SLUGS.map(s => ({
    url: `${BASE}/theme/${s}`,
    lastModified: now,
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
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const explorerRoutes: MetadataRoute.Sitemap = EXPLORERS.map(e => ({
    url: `${BASE}/explorer/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const timelineRoutes: MetadataRoute.Sitemap = ERA_LIST.map(era => ({
    url: `${BASE}/timeline/${eraSlug(era.label)}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
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
