/**
 * Structured data (schema.org JSON-LD) for search engines. Google uses it for
 * breadcrumb trails under results, the site name, and to understand what a
 * page is about. Each page renders <JsonLd data={…} /> with what fits it.
 */
export const SITE_URL = "https://www.bordersoftime.com";
const SITE_NAME = "Borders of Time";

type Ld = Record<string, unknown>;

export function JsonLd({ data }: { data: Ld | Ld[] }) {
  const graph = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // JSON.stringify can't produce "</script>", but "<" is escaped anyway
      // so text from Wikipedia can never break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** "Home › Tours › The Crusades": pass the trail after Home as [name, path] pairs. */
export function breadcrumbLd(trail: [string, string][]): Ld {
  const items: [string, string][] = [[SITE_NAME, "/"], ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: SITE_URL + path,
    })),
  };
}

/**
 * One of the site's own articles (content/articles): who wrote it, when, and
 * what it cites. `about` is the page's main entity (a Place, Person, Event…).
 */
export function articleLd(a: {
  headline: string; path: string; description?: string; image?: string;
  written?: string; wordCount: number; citations: string[]; about: Ld;
}): Ld {
  const site = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };
  return {
    "@type": "Article",
    headline: a.headline,
    url: SITE_URL + a.path,
    mainEntityOfPage: SITE_URL + a.path,
    ...(a.description ? { description: a.description } : {}),
    ...(a.image ? { image: a.image } : {}),
    ...(a.written ? { datePublished: a.written, dateModified: a.written } : {}),
    author: site,
    publisher: site,
    inLanguage: "en",
    wordCount: a.wordCount,
    citation: a.citations,
    about: a.about,
  };
}

/** An index page and the pages it lists, e.g. all tours or every city. */
export function collectionLd(name: string, description: string, path: string, items: { name: string; path: string }[]): Ld {
  return {
    "@type": "CollectionPage",
    name,
    description,
    url: SITE_URL + path,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: SITE_URL + it.path })),
    },
  };
}

/** The interactive tools (map, compare, game): free web apps that run in the browser. */
export function webAppLd(name: string, description: string, path: string, category = "EducationalApplication"): Ld {
  return {
    "@type": "WebApplication",
    name,
    description,
    url: SITE_URL + path,
    applicationCategory: category,
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export const websiteLd: Ld = {
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "bordersoftime.com",
  url: SITE_URL,
  description: "An interactive world history atlas: borders, empires, tours and maps across 5,000 years.",
  inLanguage: "en",
};

export const organizationLd: Ld = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
};
