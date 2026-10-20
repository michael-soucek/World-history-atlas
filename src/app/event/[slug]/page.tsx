import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import EntityPage from "@/components/EntityPage";
import type { CrosswalkEntry, EntityType } from "@/types";
import { EVENTS_CROSSWALK } from "@/data/entityCrosswalk";
import { buildEntityContent } from "@/lib/wikidata";
import { resolveEntityBySlugOrQid } from "@/lib/entityResolver";
import { entityMetadata } from "@/lib/seo";

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 31536000;

export async function generateStaticParams() {
  return Object.values(EVENTS_CROSSWALK).map((e) => ({ slug: e.slug }));
}

// Always returns an object — never throws, never returns null. No content means a 404.
const resolve = cache(async (slug: string) => {
  try {
    const resolved = (await resolveEntityBySlugOrQid(slug, "event")).resolved;
    if (!resolved) return { entry: null, content: null };
    const entry: CrosswalkEntry & { entityType: EntityType } = {
      wikidataId: resolved.wikidataId,
      slug: resolved.slug,
      entityType: "event",
    };
    const content = await buildEntityContent(resolved.wikidataId, "event", resolved.canonicalName).catch(() => null);
    return content ? { entry, content } : { entry: null, content: null };
  } catch {
    return { entry: null, content: null };
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r.content) return { title: "Event not found — Borders of Time" };
  return entityMetadata("event", slug, r.content);
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const r = await resolve(slug);
  // Unknown or unresolvable: a real 404, not a thin "not found" page served as a success.
  if (!r.content || !r.entry) notFound();
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <EntityPage content={r.content} entry={r.entry} entityType="event" baseRoute="event" />
      </main>
      <SiteFooter />
    </>
  );
}
