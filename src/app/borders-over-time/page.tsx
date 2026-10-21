import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageIntro from "@/components/PageIntro";
import { TIMELAPSES, formatYear, type TimelapseFacts } from "@/data/timelapses";
import FACTS from "@/data/timelapseFacts.json";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd, collectionLd } from "@/lib/jsonLd";

export const metadata: Metadata = buildPageMetadata({
  title: "Borders Over Time: Animated History Maps of Every Region",
  description:
    "Watch borders change on animated maps of Europe, the Middle East, East Asia, South Asia, Africa, the Americas and the whole world, year by year from 2000 BCE to today.",
  path: "/borders-over-time",
  imageUrl: "/timelapse/europe-wide.webp",
});

export default function BordersOverTimeHub() {
  const facts = FACTS as Record<string, TimelapseFacts>;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen page-bg">
        <JsonLd
          data={[
            collectionLd(
              "Borders over time",
              "Animated maps of how the borders of each region changed, year by year from 2000 BCE to today.",
              "/borders-over-time",
              TIMELAPSES.map((t) => ({ name: `${t.possessive} borders over time`, path: `/borders-over-time/${t.slug}` })),
            ),
            breadcrumbLd([["Borders over time", "/borders-over-time"]]),
          ]}
        />
        <PageIntro
          label="Borders over time"
          title={<>Watch the borders <span className="italic">move</span></>}
          lede="Every year from 2000 BCE to today, drawn on its own map. Pick a region and watch empires grow, split and vanish, from the first kingdoms to the present day."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {TIMELAPSES.map((t) => {
              const f = facts[t.slug];
              return (
                <li key={t.slug}>
                  <Link href={`/borders-over-time/${t.slug}`} className="group block">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-ink/10 bg-[#cdd9e5]">
                      <Image
                        src={`/timelapse/${t.slug}-wide.webp`}
                        alt={`Map of ${t.label} in ${formatYear(t.cover)}`}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        unoptimized
                      />
                    </div>
                    <p className="mt-4 font-display text-2xl tracking-tight text-ink group-hover:text-accent transition-colors">
                      {cap(t.label)}
                    </p>
                    <p className="mt-1 font-mono text-[11px] tracking-wide text-ink/45">
                      {formatYear(f.from)} to {f.to} · every year · borders change in {f.changes.length}
                    </p>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{t.intro}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
