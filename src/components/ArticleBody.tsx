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

/**
 * The opening of the encyclopedia article, cut to about `maxWords` at a
 * sentence boundary. Pages quote only this much: the rest of each page is the
 * site's own material, and the full article is a link away. (Republishing
 * whole Wikipedia articles is copied content under Google's publisher
 * policies, whatever the licence allows.)
 */
export function wikiExcerpt(summary: string | undefined, maxWords = 110): string {
  const text = clean(summary?.split(/\n+/).filter(Boolean).join(" ")) ?? "";
  const sentences = text.match(/[^.!?]+[.!?]+(?:["”’)\]]+)?(?=\s|$)/g) ?? (text ? [text] : []);
  let out = "";
  for (const sentence of sentences) {
    const next = `${out} ${sentence.trim()}`.trim();
    if (out && next.split(/\s+/).length > maxWords) break;
    out = next;
  }
  return out;
}

/** A short, credited quotation from the Wikipedia article, with a link to the rest. */
export function WikipediaExcerpt({
  name,
  summary,
  wikipediaUrl,
  image,
}: {
  name: string;
  summary?: string;
  wikipediaUrl?: string;
  image?: ArticleImageData;
}) {
  const excerpt = wikiExcerpt(summary);
  if (!excerpt) return null;
  return (
    <section className="mb-14 flow-root" aria-label={`From Wikipedia: ${name}`}>
      {image && <ArticleImage img={image} alt={image.caption ?? name} variant="float" side="right" />}
      <p className="label text-ink/45 mb-3">In brief, from Wikipedia</p>
      <blockquote className="border-l-2 border-ink/15 pl-5">
        <p className="font-text text-ink/80 text-[18px] leading-[1.7]">{excerpt}</p>
      </blockquote>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <ReadAloudButton text={excerpt} variant="minimal" className="-ml-3" />
        {wikipediaUrl && (
          <a href={wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ink underline underline-offset-4 decoration-accent/30 transition-colors">
            Read the full article on Wikipedia →
          </a>
        )}
        <span className="text-xs text-ink/35">Wikipedia, CC BY-SA 4.0</span>
      </div>
    </section>
  );
}

/** Leftover images: a horizontally scrolling strip; credits are in each image's full-screen view. */
export function ImageStrip({ images, name, title = "In pictures" }: { images: ArticleImageData[]; name: string; title?: string }) {
  return (
    <section className="mt-16" aria-label={title}>
      <div className="flex items-baseline justify-between mb-5 border-b border-ink/15 pb-3">
        <h2 className="font-display text-2xl tracking-tight text-ink">{title}</h2>
        <span className="font-mono text-[11px] text-ink/40 tabular-nums">{images.length} images · scroll →</span>
      </div>
      <div className="-mx-1 flex gap-5 overflow-x-auto px-1 pb-3 snap-x">
        {images.map((img) => (
          <ArticleImage key={img.thumb} img={img} alt={img.caption ?? `Image related to ${name}`} variant="strip" />
        ))}
      </div>
    </section>
  );
}
