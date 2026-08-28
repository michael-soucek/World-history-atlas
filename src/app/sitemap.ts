import type { MetadataRoute } from "next";
import { CROSSWALK } from "@/data/crosswalk";
import { PEOPLE_CROSSWALK, EVENTS_CROSSWALK, CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { ERA_LIST, eraSlug } from "@/data/eras";
import { TOURS } from "@/data/tours";
import { EXPLORERS } from "@/data/voyages";

const BASE = "https://www.bordersoftime.com";

const REGION_SLUGS = [
  "europe", "east-asia", "south-asia", "middle-east",
  "africa", "americas", "central-asia", "southeast-asia",
];
const THEME_SLUGS = [
  "empires", "religions", "trade-routes", "conflicts",
  "science", "art-culture", "age-of-exploration",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/map`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/timeline`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/browse`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tour`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/search`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
  ];

  const placeRoutes: MetadataRoute.Sitemap = Object.values(CROSSWALK).map(e => ({
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
    ...explorerRoutes,
    ...timelineRoutes,
  ];
}
