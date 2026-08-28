import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import EntityPage from "@/components/EntityPage";
import type { CrosswalkEntry, EntityType } from "@/types";
import { CULTURES_CROSSWALK } from "@/data/entityCrosswalk";
import { buildEntityContent } from "@/lib/wikidata";
import { resolveEntityBySlugOrQid } from "@/lib/entityResolver";
import { fetchWikipediaSearchSummary } from "@/lib/wikipedia";

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 31536000;

export async function generateStaticParams() {
  return Object.values(CULTURES_CROSSWALK).map((e) => ({ slug: e.slug }));
}

function humaniseSlug(slug: string): string {
  return slug.replace(/[-_]+/g, " ").split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Always returns an object — never throws, never returns null.
const resolve = cache(async (slug: string) => {
  try {
    const resolution = await resolveEntityBySlugOrQid(slug, "culture");
    const resolved = resolution.resolved;
    if (!resolved) {
      const fallbackName = humaniseSlug(slug);
      const fallbackSummary = await fetchWikipediaSearchSummary(fallbackName).catch(() => null);
      return { entry: null, content: null, fallbackName, fallbackSummary };
    }

    const entry: CrosswalkEntry & { entityType: EntityType } = {
      wikidataId: resolved.wikidataId,
      slug: resolved.slug,
      entityType: "culture",
    };

    const content = await buildEntityContent(resolved.wikidataId, "culture", resolved.canonicalName).catch(() => null);
    if (content) return { entry, content, fallbackName: resolved.canonicalName, fallbackSummary: null };
    const fallbackSummary = await fetchWikipediaSearchSummary(resolved.canonicalName).catch(() => null);
    return { entry: null, content: null, fallbackName: resolved.canonicalName, fallbackSummary };
  } catch {
    const fallbackName = humaniseSlug(slug);
    const fallbackSummary = await fetchWikipediaSearchSummary(fallbackName).catch(() => null);
    return { entry: null, content: null, fallbackName, fallbackSummary };
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r.content) return { title: "Culture not found — Borders of Time" };
  return {
    alternates: { canonical: `/culture/${slug}` },
    title: `${r.content.name} — Borders of Time`,
    description: r.content.summary?.slice(0, 160),
    openGraph: {
      title: r.content.name,
      description: r.content.summary?.slice(0, 200),
      images: r.content.imageUrl ? [{ url: r.content.imageUrl }] : [],
    },
  };
}

export default async function CulturePage({ params }: Props) {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r.content || !r.entry) {
    const displayName = r.fallbackName ?? slug;
    const summaryText = r.fallbackSummary?.summary?.trim();
    return (
      <>
        <SiteHeader />
        <main className="page-bg min-h-screen">
          <div className="max-w-3xl mx-auto px-6 py-20">
            <nav className="flex items-center gap-2 text-xs text-ink/35 mb-10" aria-label="Breadcrumb">
              <Link href="/browse" className="hover:text-ancient/80 transition-colors">Browse</Link>
              <span className="text-ink/20">/</span>
              <span className="text-ink/55">{displayName}</span>
            </nav>
            <p className="text-ancient/70 text-xs font-semibold uppercase tracking-widest mb-3">Culture / Topic</p>
            <h1 className="font-display text-5xl font-bold text-ink italic leading-tight mb-6">{displayName}</h1>
            <p className="text-ink/50 text-base leading-relaxed mb-8 max-w-prose">
              {summaryText ? (
                summaryText
              ) : (
                <>
                  We don&apos;t yet have a verified article for <strong className="text-ink/70">{displayName}</strong> in the atlas.
                </>
              )}
            </p>
            {r.fallbackSummary?.url && (
              <a
                href={r.fallbackSummary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold bg-paper text-ink/80 hover:bg-paper/80 transition-colors mb-3"
              >
                Read best match: {r.fallbackSummary.title} ↗
              </a>
            )}
            <a
              href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(displayName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold bg-ancient text-white hover:bg-ancient/90 transition-colors"
            >
              Search Wikipedia for &ldquo;{displayName}&rdquo; →
            </a>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <EntityPage content={r.content} entry={r.entry} entityType="culture" baseRoute="culture" />
      </main>
      <SiteFooter />
    </>
  );
}
