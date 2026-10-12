import { ReadAloudButton } from "@/components/ReadAloudButton";
import ArticleImage, { type ArticleImageData } from "@/components/ArticleImage";
import type { EntityImage } from "@/lib/entityImages";
import type { PlaceContent } from "@/types";

const clean = (s?: string) => s?.replace(/\[(?:citation needed|\d+|[a-z])\]/gi, "").replace(/\s{2,}/g, " ").trim();
/** "Map_of_the_Mali_Empire.png" → "Map of the Mali Empire", for images the article didn't caption. */
const titleFromFile = (file: string) => file.replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ").trim();

export function toArticleImage(img: EntityImage): ArticleImageData {
  return { ...img, caption: clean(img.caption) || titleFromFile(img.file) };
}

/** Sections shorter than this don't get an image — it would dwarf the text. */
const MIN_SECTION_CHARS_FOR_IMAGE = 700;

/**
 * The reading column of a topic page: a hero image, the summary with an image
 * set into it, each article section opening with its own image (alternating
 * sides, text wrapping round it), and any remaining images in a strip at the
 * end. Collapsed sections preview their image beside the heading.
 */
export default function ArticleBody({
  content,
  images,
  readLabel = "Read Full Article",
}: {
  content: PlaceContent;
  images: EntityImage[];
  readLabel?: string;
}) {
  const pool = images.map(toArticleImage);

  // Hero: the entity's own Wikidata image if it has one, else the article's first image.
  const hero: ArticleImageData | undefined = content.imageUrl
    ? {
        thumb: content.imageUrl,
        author: content.imageAuthor,
        license: content.imageLicense,
        sourceUrl: content.imageSourceUrl,
      }
    : pool.shift();

  const summaryParas = (content.summary ?? "").split(/\n+/).filter(Boolean);
  const summaryImage = summaryParas.length > 0 ? pool.shift() : undefined;
  const sections = content.sections ?? [];
  const sectionImages = sections.map((sec) =>
    sec.content.length >= MIN_SECTION_CHARS_FOR_IMAGE ? pool.shift() : undefined,
  );
  const remaining = pool;

  return (
    <>
      {hero && <ArticleImage img={hero} alt={hero.caption || `Image related to ${content.name}`} variant="hero" priority />}

      {summaryParas.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <ReadAloudButton text={[content.summary, ...sections.map((s) => s.content)].join(" ")} />
          <span className="text-ink/25 text-[10px] uppercase tracking-widest font-semibold">{readLabel}</span>
        </div>
      )}

      {summaryParas.length > 0 ? (
        <div className="mb-4 flow-root">
          {summaryImage && <ArticleImage img={summaryImage} alt={summaryImage.caption ?? content.name} variant="float" side="right" />}
          <div className="space-y-6">
            {summaryParas.map((para, i) => (
              <div key={i} className="group relative flex gap-4">
                <ReadAloudButton
                  text={para}
                  variant="minimal"
                  className="shrink-0 mt-1 opacity-20 group-hover:opacity-100 pointer-coarse:opacity-100 transition-opacity"
                />
                <p className="text-ink/75 text-base leading-[1.85]">{para}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-ink/40 text-base italic mb-4">
          No summary available.{" "}
          {content.wikipediaUrl && (
            <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/60 hover:text-ancient underline underline-offset-2 transition-colors not-italic">
              Read the full article on Wikipedia →
            </a>
          )}
        </p>
      )}

      {content.wikipediaUrl && summaryParas.length > 0 && (
        <p className="text-xs text-ink/25 mb-10">
          Summary from{" "}
          <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/50 hover:text-ancient underline underline-offset-2 transition-colors">
            Wikipedia
          </a>{" "}
          (CC BY-SA 4.0)
        </p>
      )}

      {sections.length > 0 && (
        <div className="space-y-8 border-t border-paper pt-8">
          {sections.map((sec, i) => {
            const img = sectionImages[i];
            const paras = sec.content.split(/\n+/).filter(Boolean);
            return (
              <details key={sec.heading || `sec-${i}`} className="group" open={i === 0}>
                <summary className="flex items-center gap-3 cursor-pointer list-none select-none mb-4">
                  <div className="w-1 h-5 rounded-full bg-ancient/40 group-open:bg-ancient transition-colors" aria-hidden="true" />
                  <h2 className="font-display text-xl font-semibold text-ink/80 italic group-open:text-ink transition-colors">{sec.heading}</h2>
                  <ReadAloudButton
                    text={sec.content}
                    variant="minimal"
                    className="ml-2 opacity-0 group-hover:opacity-100 pointer-coarse:opacity-100 transition-opacity"
                  />
                  {img && (
                    // Preview of the section's picture while it's collapsed.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.thumb}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="ml-auto h-10 w-14 rounded-md border border-paper object-cover group-open:hidden"
                    />
                  )}
                  <svg className={`${img ? "ml-2" : "ml-auto"} w-4 h-4 shrink-0 text-ink/25 transition-transform group-open:rotate-180 group-open:ml-auto`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className="pl-4 border-l border-paper flow-root">
                  {img && <ArticleImage img={img} alt={img.caption ?? sec.heading} variant="float" side={i % 2 === 0 ? "right" : "left"} />}
                  <div className="space-y-4">
                    {paras.map((p, k) => (
                      <p key={k} className="text-ink/70 text-[15px] leading-[1.9]">
                        {p}
                      </p>
                    ))}
                  </div>
                  {sec.content.length >= 1190 && content.wikipediaUrl && (
                    <p className="mt-4">
                      <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/60 hover:text-ancient underline underline-offset-2 transition-colors text-xs">
                        Read more on Wikipedia →
                      </a>
                    </p>
                  )}
                </div>
              </details>
            );
          })}
          {content.wikipediaUrl && (
            <p className="text-xs text-ink/25 pt-2 border-t border-paper">
              Article sections from{" "}
              <a href={content.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-ancient/50 hover:text-ancient underline underline-offset-2 transition-colors">
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
export function ImageStrip({ images, name, title = "More images" }: { images: ArticleImageData[]; name: string; title?: string }) {
  return (
    <section className="mt-12" aria-label={title}>
      <h2 className="text-ink/40 text-xs font-semibold uppercase tracking-widest mb-4">{title}</h2>
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 snap-x">
        {images.map((img) => (
          <ArticleImage key={img.thumb} img={img} alt={img.caption ?? `Image related to ${name}`} variant="strip" />
        ))}
      </div>
    </section>
  );
}
