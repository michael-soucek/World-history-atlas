import { ReadAloudButton } from "@/components/ReadAloudButton";
import ArticleImage, { type ArticleImageData } from "@/components/ArticleImage";
import type { EntityImage } from "@/lib/entityImages";
import type { PlaceContent } from "@/types";

const clean = (s?: string) => s?.replace(/\[(?:citation needed|\d+|[a-z])\]/gi, "").replace(/\s{2,}/g, " ").trim();
/** "Map_of_the_Mali_Empire.png" → "Map of the Mali Empire", for images the article didn't caption. */
const titleFromFile = (file: string) =>
  file.replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ").replace(/\s*\((?:cropped|\d+)\)/gi, "").trim();

export function toArticleImage(img: EntityImage): ArticleImageData {
  return { ...img, caption: clean(img.caption) || titleFromFile(img.file) };
}

/**
 * The page's lead picture — the entity's own Wikidata image if it has one,
 * else the article's first image — and the images left for the body.
 */
export function splitHero(content: PlaceContent, images: EntityImage[]): { hero?: ArticleImageData; rest: ArticleImageData[] } {
  const pool = images.map(toArticleImage);
  const hero: ArticleImageData | undefined = content.imageUrl
    ? {
        thumb: content.imageUrl,
        author: content.imageAuthor,
        license: content.imageLicense,
        sourceUrl: content.imageSourceUrl,
      }
    : pool.shift();
  return { hero, rest: pool };
}

/** Sections shorter than this don't get an image — it would dwarf the text. */
const MIN_SECTION_CHARS_FOR_IMAGE = 700;

/**
 * The reading column of a topic page: the summary with an image set into it,
 * each article section opening with its own image (alternating sides, text
 * wrapping round it), and any remaining images in a strip at the end.
 * Collapsed sections preview their image beside the heading. The lead image
 * is rendered by the page itself (see splitHero).
 */
export default function ArticleBody({
  content,
  images,
}: {
  content: PlaceContent;
  /** Body images, after the hero has been taken out. */
  images: ArticleImageData[];
}) {
  const pool = [...images];
  const summaryParas = (content.summary ?? "").split(/\n+/).filter(Boolean);
  const summaryImage = summaryParas.length > 0 ? pool.shift() : undefined;
  const sections = content.sections ?? [];
  const sectionImages = sections.map((sec) =>
    sec.content.length >= MIN_SECTION_CHARS_FOR_IMAGE ? pool.shift() : undefined,
  );
  const remaining = pool;

  return (
    <>
      {summaryParas.length > 0 && (
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-ink/10">
          <ReadAloudButton text={[content.summary, ...sections.map((s) => s.content)].join(" ")} />
          <span className="text-xs text-ink/64">Hear the whole article read aloud</span>
        </div>
      )}

      {summaryParas.length > 0 ? (
        <div className="mb-6 flow-root">
          {summaryImage && <ArticleImage img={summaryImage} alt={summaryImage.caption ?? content.name} variant="float" side="right" />}
          <div className="space-y-5">
            {summaryParas.map((para, i) => (
              <div key={i} className="group relative">
                <ReadAloudButton
                  text={para}
                  variant="minimal"
                  className="absolute -left-14 top-0 max-xl:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <p className={`font-text text-ink/85 text-[18px] sm:text-[19px] leading-[1.72] ${i === 0 ? "dropcap" : ""}`}>{para}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="font-text text-ink/68 text-lg italic mb-4">
          No summary available.{" "}
          {content.wikipediaUrl && (
            <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ink underline underline-offset-2 transition-colors not-italic">
              Read the full article on Wikipedia →
            </a>
          )}
        </p>
      )}

      {content.wikipediaUrl && summaryParas.length > 0 && (
        <p className="text-xs text-ink/64 mb-14">
          Summary from{" "}
          <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent transition-colors">
            Wikipedia
          </a>{" "}
          (CC BY-SA 4.0)
        </p>
      )}

      {sections.length > 0 && (
        <div className="border-t border-ink/15">
          {sections.map((sec, i) => {
            const img = sectionImages[i];
            const paras = sec.content.split(/\n+/).filter(Boolean);
            return (
              <details key={sec.heading || `sec-${i}`} className="group border-b border-ink/10" open={i === 0}>
                <summary className="flex items-center gap-4 cursor-pointer list-none select-none py-5 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-[11px] text-accent/80 tabular-nums w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="font-display text-2xl sm:text-[28px] leading-tight tracking-tight text-ink/80 group-open:text-ink group-hover:text-ink transition-colors">
                    {sec.heading}
                  </h2>
                  {img && (
                    // Preview of the section's picture while it's collapsed.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.thumb.replace(/\/\d+px-([^/]+)$/, "/120px-$1")}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="ml-auto h-10 w-14 object-cover grayscale-[0.4] group-open:hidden max-sm:hidden"
                    />
                  )}
                  <span
                    className={`${img ? "sm:ml-3 max-sm:ml-auto" : "ml-auto"} group-open:ml-auto shrink-0 w-7 h-7 grid place-items-center rounded-full border border-ink/15 text-ink/66 transition-transform group-open:rotate-45`}
                    aria-hidden="true"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  </span>
                </summary>
                <div className="pb-10 sm:pl-10 flow-root">
                  {img && <ArticleImage img={img} alt={img.caption ?? sec.heading} variant="float" side={i % 2 === 0 ? "right" : "left"} />}
                  <div className="space-y-5">
                    {paras.map((p, k) => (
                      <p key={k} className="font-text text-ink/80 text-[17px] sm:text-[18px] leading-[1.75]">
                        {p}
                      </p>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-4 text-sm">
                    <ReadAloudButton text={sec.content} variant="minimal" className="-ml-3" />
                    {sec.content.length >= 1190 && content.wikipediaUrl && (
                      <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ink underline underline-offset-4 decoration-accent/30 transition-colors">
                        Continue on Wikipedia →
                      </a>
                    )}
                  </div>
                </div>
              </details>
            );
          })}
          {content.wikipediaUrl && (
            <p className="text-xs text-ink/64 pt-4">
              Article sections from{" "}
              <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent transition-colors">
                Wikipedia
              </a>{" "}
              (CC BY-SA 4.0). Excerpted for readability.
            </p>
          )}
        </div>
      )}

      {remaining.length > 0 && <ImageStrip images={remaining} name={content.name} />}
    </>
  );
}

/** Leftover images: a horizontally scrolling strip; credits are in each image's full-screen view. */
export function ImageStrip({ images, name, title = "In pictures" }: { images: ArticleImageData[]; name: string; title?: string }) {
  return (
    <section className="mt-16" aria-label={title}>
      <div className="flex items-baseline justify-between mb-5 border-b border-ink/15 pb-3">
        <h2 className="font-display text-2xl tracking-tight text-ink">{title}</h2>
        <span className="font-mono text-[11px] text-ink/64 tabular-nums">{images.length} images · scroll →</span>
      </div>
      <div className="-mx-1 flex gap-5 overflow-x-auto px-1 pb-3 snap-x">
        {images.map((img) => (
          <ArticleImage key={img.thumb} img={img} alt={img.caption ?? `Image related to ${name}`} variant="strip" />
        ))}
      </div>
    </section>
  );
}
