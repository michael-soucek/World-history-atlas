import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro, { SectionRule } from "@/components/PageIntro";
import OurArticle from "@/components/OurArticle";
import { JsonLd, articleLd, breadcrumbLd } from "@/lib/jsonLd";
import { buildPageMetadata, metaDescription } from "@/lib/seo";
import { articleIntro, articleWordCount, getOurArticle } from "@/lib/ourArticles";
import { philosophersOf } from "@/lib/backlinks";
import { PHILOSOPHY_ERAS, getPhilosophyEra } from "@/data/philosophy";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return PHILOSOPHY_ERAS.filter((e) => getOurArticle("philosophy", e.slug)).map((e) => ({ slug: e.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const era = getPhilosophyEra(slug);
  const article = era && getOurArticle("philosophy", slug);
  if (!era || !article) return { title: "Philosophy — Borders of Time" };
  return buildPageMetadata({
    title: `${era.title}: History, Thinkers & Key Ideas — Borders of Time`,
    description: metaDescription(articleIntro(article)) ?? era.blurb,
    path: `/philosophy/${slug}`,
  });
}

/** "-399" → "399 BCE"; "~-570" → "c. 570 BCE". */
function fmtYear(raw: string | number): string {
  const s = String(raw);
  const approx = s.startsWith("~");
  const n = Number(s.replace("~", ""));
  const y = n < 0 ? `${-n} BCE` : n < 1000 ? `${n} CE` : String(n);
  return approx ? `c. ${y}` : y;
}

export default async function PhilosophyEraPage({ params }: Props) {
  const { slug } = await params;
  const era = getPhilosophyEra(slug);
  const article = era && getOurArticle("philosophy", slug);
  if (!era || !article) notFound();

  const thinkers = philosophersOf(`/philosophy/${slug}`);
  const i = PHILOSOPHY_ERAS.indexOf(era);
  const published = (e?: (typeof PHILOSOPHY_ERAS)[number]) => (e && getOurArticle("philosophy", e.slug) ? e : undefined);
  const prev = published(PHILOSOPHY_ERAS[i - 1]);
  const next = published(PHILOSOPHY_ERAS[i + 1]);

  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-screen">
        <JsonLd
          data={[
            articleLd({
              headline: era.title,
              path: `/philosophy/${slug}`,
              description: articleIntro(article),
              written: article.written,
              wordCount: articleWordCount(article),
              citations: article.sources.map((s) => s.href),
              about: { "@type": "Thing", name: era.title },
            }),
            breadcrumbLd([["History of philosophy", "/philosophy"], [era.title, `/philosophy/${slug}`]]),
          ]}
        />
        <PageIntro
          crumbs={[{ href: "/philosophy", label: "History of philosophy" }]}
          label={era.period}
          title={era.title}
          lede={era.blurb}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-12 lg:gap-16">
          <div className="min-w-0 max-w-3xl">
            <OurArticle article={article} name={era.title} />
          </div>
          <aside className="space-y-12">
            {thinkers.length > 0 && (
              <section aria-labelledby="thinkers">
                <h2 id="thinkers" className="label text-ink/45 mb-4">Philosophers of this era</h2>
                <ol className="divide-y divide-ink/10 border-y border-ink/10">
                  {thinkers.map((t) => (
                    <li key={t.href} className="py-2.5 flex items-baseline justify-between gap-3">
                      <Link href={t.href} className="text-[16px] text-ink hover:text-accent transition-colors">{t.name}</Link>
                      {t.born !== undefined && <span className="font-mono text-[11px] text-ink/40 tabular-nums whitespace-nowrap">b. {fmtYear(t.born)}</span>}
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {article.timeline.length > 0 && (
              <section aria-labelledby="key-dates" className="lg:sticky lg:top-24">
                <h2 id="key-dates" className="label text-ink/45 mb-4">Key dates</h2>
                <ol className="border-l border-ink/15">
                  {article.timeline.map((d, k) => (
                    <li key={k} className="relative pl-5 pb-4 last:pb-0">
                      <span className="absolute -left-[4px] top-[7px] w-[7px] h-[7px] rounded-full bg-accent" aria-hidden="true" />
                      <span className="block font-mono text-[12px] tracking-wide text-ink/55 tabular-nums">{fmtYear(d.year)}</span>
                      <span className="block text-[14px] leading-snug text-ink/80">{d.text}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </aside>
        </div>

        {(prev || next) && (
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-label="Other eras">
            <SectionRule>Continue the history</SectionRule>
            <div className="grid sm:grid-cols-2 gap-6">
              {prev ? (
                <Link href={`/philosophy/${prev.slug}`} className="group block border border-ink/15 rounded-md p-5 hover:border-accent transition-colors">
                  <span className="label text-ink/40">← Before</span>
                  <span className="block mt-1 font-display text-2xl text-ink group-hover:text-accent">{prev.title}</span>
                  <span className="block text-sm text-ink/50">{prev.period}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link href={`/philosophy/${next.slug}`} className="group block border border-ink/15 rounded-md p-5 hover:border-accent transition-colors sm:text-right">
                  <span className="label text-ink/40">After →</span>
                  <span className="block mt-1 font-display text-2xl text-ink group-hover:text-accent">{next.title}</span>
                  <span className="block text-sm text-ink/50">{next.period}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
