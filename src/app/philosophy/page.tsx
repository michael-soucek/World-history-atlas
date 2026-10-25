import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import OurArticle from "@/components/OurArticle";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { getOurArticle } from "@/lib/ourArticles";
import { philosophersOf } from "@/lib/backlinks";
import { PHILOSOPHY_ERAS } from "@/data/philosophy";

export const metadata: Metadata = buildPageMetadata({
  title: "The History of Philosophy: Every Era, Tradition & Great Thinker — Borders of Time",
  description: "The history of philosophy from ancient Greece, India and China to the twentieth century: every era and tradition, its key ideas, and the philosophers who shaped it.",
  path: "/philosophy",
});

export default function PhilosophyHub() {
  const intro = getOurArticle("philosophy", "index");
  const eras = PHILOSOPHY_ERAS.map((e) => ({
    ...e,
    live: !!getOurArticle("philosophy", e.slug),
    thinkers: philosophersOf(`/philosophy/${e.slug}`),
  }));
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            collectionLd("The history of philosophy", "Every era and tradition of philosophy.", "/philosophy", eras.filter((e) => e.live).map((e) => ({ name: e.title, path: `/philosophy/${e.slug}` }))),
            breadcrumbLd([["History of philosophy", "/philosophy"]]),
          ]}
        />
        <PageIntro
          label="History of philosophy"
          title={<>Two and a half thousand years of <span className="italic">thinking</span></>}
          lede="How people in Greece, India, China, the Islamic world, Europe, Africa and beyond have argued about what exists, what we can know and how to live."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <SectionRule count={`${eras.length} eras and traditions`}>The story, era by era</SectionRule>
          <ol className="border-t border-ink/80">
            {eras.map((e, i) => (
              <li key={e.slug} className="grid grid-cols-1 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.2fr)] gap-x-6 gap-y-2 py-6 border-b border-ink/10">
                <span className="font-mono text-[12px] text-accent/80 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  {e.live ? (
                    <Link href={`/philosophy/${e.slug}`} className="font-display text-2xl sm:text-3xl tracking-tight text-ink hover:text-accent transition-colors">{e.title}</Link>
                  ) : (
                    <span className="font-display text-2xl sm:text-3xl tracking-tight text-ink/40">{e.title}</span>
                  )}
                  <p className="mt-1 font-mono text-[12px] tracking-wide text-ink/45">{e.period}</p>
                  <p className="mt-2 text-[15px] text-ink/65 leading-relaxed">{e.blurb}</p>
                </div>
                <p className="text-[15px] leading-relaxed text-ink/70 md:pt-1">
                  {e.thinkers.map((t, k) => (
                    <span key={t.href}>{k > 0 && ", "}<Link href={t.href} className="underline underline-offset-4 decoration-ink/20 hover:text-accent transition-colors">{t.name}</Link></span>
                  ))}
                </p>
              </li>
            ))}
          </ol>
          {intro && (
            <div className="mt-20 max-w-3xl">
              <SectionRule>An introduction</SectionRule>
              <OurArticle article={intro} name="The history of philosophy" />
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
