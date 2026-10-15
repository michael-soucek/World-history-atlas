import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ERA_LIST, eraSlug } from "@/data/eras";
import { SNAPSHOT_YEARS } from "@/data/snapshotYears";
import { TIMELINE_ILLUSTRATIONS } from "@/data/timelineIllustrations";
import PageIntro from "@/components/PageIntro";
import { ERA_HEX } from "@/lib/palette";


const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function fmtRange(start: number, end: number) {
  const f = (y: number) => (y < 0 ? `${Math.abs(y).toLocaleString("en-US")} BCE` : `${y} CE`);
  return `${isFinite(start) ? f(start) : "123,000 BCE"} – ${isFinite(end) ? f(end) : "today"}`;
}

/**
 * The chronology: every map in the atlas, grouped by age. Each age has a
 * sticky title plate on the left and its maps listed on the right.
 */
export default function TimelineClient() {
  return (
    <div className="page-bg min-h-screen">
      <PageIntro
        label="Chronology"
        title={<>Five thousand years, <span className="italic">map by map</span></>}
        lede="Every border map in the atlas, in order. Pick a year to open the map at that moment, or drag the slider on the map to move between them."
        aside={
          <Link
            href="/map"
            className="group inline-flex items-center gap-3 h-12 pl-6 pr-5 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors"
          >
            Open the atlas
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {ERA_LIST.map((era, index) => {
          const years = SNAPSHOT_YEARS.filter(y => y >= era.start && y < era.end);
          if (years.length === 0) return null;
          const art = TIMELINE_ILLUSTRATIONS[era.label];
          const hex = ERA_HEX[era.label];
          return (
            <section
              key={era.label}
              aria-label={`${era.label}: ${fmtRange(era.start, era.end)}`}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 py-14 sm:py-20 border-b border-ink/10 last:border-b-0"
            >
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-24">
                  <p className="font-display italic text-2xl" style={{ color: hex }}>{ROMAN[index]}</p>
                  <h2 className="mt-2 font-display font-light text-5xl sm:text-6xl tracking-[-0.03em] text-ink">{era.label}</h2>
                  <p className="mt-3 font-mono text-[12px] tracking-wide text-ink/50 tabular-nums">{fmtRange(era.start, era.end)}</p>
                  <p className="mt-5 text-[15px] text-ink/65 leading-relaxed max-w-md">{era.blurb}</p>
                  {art && (
                    <figure className="mt-8 max-w-md">
                      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.src}
                          alt={art.alt}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{ objectPosition: art.objectPosition }}
                        />
                      </div>
                      <figcaption className="mt-2 text-[11px] text-ink/40">
                        <span className="font-text italic text-[13px] text-ink/60">{art.caption}</span> · {art.credit}
                      </figcaption>
                    </figure>
                  )}
                  {isFinite(era.start) && (
                    <Link href={`/era/${eraSlug(era.label)}`} className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-ink transition-colors">
                      <span className="link-draw pb-0.5">Empires and people of this age</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>

              <ol className="lg:col-span-7 border-t-2" style={{ borderColor: hex }}>
                {years.map(year => (
                  <li key={year} className="border-b border-ink/10">
                    <Link href={`/map?year=${year}`} className="group flex items-baseline gap-4 py-4 sm:py-5">
                      <span className="font-display font-light text-4xl sm:text-5xl tracking-[-0.03em] tabular-nums text-ink group-hover:text-accent transition-colors">
                        {Math.abs(year).toLocaleString("en-US")}
                      </span>
                      <span className="font-mono text-[11px] tracking-wider text-ink/45">{year < 0 ? "BCE" : "CE"}</span>
                      <span className="ml-auto inline-flex items-center gap-2 text-[13px] text-ink/35 group-hover:text-accent transition-colors">
                        <span className="max-sm:hidden">Open map</span>
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
