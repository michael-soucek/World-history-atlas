import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import ComparePageClient from "@/components/ComparePageClient";
import { COMPARISONS, DEFAULT_COMPARISON, type Comparison } from "@/data/comparisons";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Then vs. Then: Compare Two Years of History — Borders of Time",
  description: "Drag a divider across the world map to compare borders in any two years: Rome against today, Europe before and after World War I, the fall of the USSR and more.",
  path: "/compare",
});

interface Props { searchParams: Promise<{ pair?: string; a?: string; b?: string }> }

/** ?pair=slug picks a preset; ?a=&b= any two snapshot years (camera from the default). */
function pick(sp: { pair?: string; a?: string; b?: string }): Comparison {
  const preset = COMPARISONS.find((c) => c.slug === sp.pair);
  if (preset) return preset;
  const a = Number(sp.a);
  const b = Number(sp.b);
  if (SNAPSHOT_YEARS.includes(a) && SNAPSHOT_YEARS.includes(b)) {
    return { ...DEFAULT_COMPARISON, slug: "", label: "", left: a, right: b };
  }
  return DEFAULT_COMPARISON;
}

export default async function ComparePage({ searchParams }: Props) {
  const initial = pick(await searchParams);
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <PageIntro
          label="Compare"
          title={<>Then <span className="italic">vs.</span> then</>}
          lede="Two years of history on one map. Drag the divider to wipe between them, and pan or zoom to look closer."
        />
        <div className="pt-10" />
        <ComparePageClient initial={initial} />
      </main>
      <SiteFooter />
    </>
  );
}
