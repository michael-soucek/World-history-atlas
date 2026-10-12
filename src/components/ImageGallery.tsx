import type { EntityImage } from "@/lib/entityImages";

/**
 * "In pictures" — freely licensed images from the page's Wikipedia article.
 * Every image carries its author, license (linked) and Commons source, as the
 * CC BY / BY-SA licenses require; public-domain images still credit the source.
 */
/** "Map_of_the_Mali_Empire.png" → "Map of the Mali Empire" — used when the article gives no caption. */
function titleFromFile(file: string): string {
  return file.replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

const clean = (s?: string) => s?.replace(/\[(?:citation needed|\d+|[a-z])\]/gi, "").replace(/\s{2,}/g, " ").trim();

export default function ImageGallery({ images, name }: { images: EntityImage[]; name: string }) {
  if (images.length === 0) return null;
  return (
    <section className="mb-10" aria-labelledby="in-pictures">
      <h2 id="in-pictures" className="font-display text-xl font-semibold text-ink/80 italic mb-4">
        In pictures
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {images.map((img) => (
          <figure key={img.file} className="group">
            <a
              href={img.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-paper bg-surface"
              style={{ aspectRatio: "4 / 3" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Commons thumbnails, already sized */}
              <img
                src={img.thumb}
                alt={clean(img.caption) || titleFromFile(img.file) || `Image related to ${name}`}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
              />
            </a>
            <figcaption className="mt-2 text-[13px] text-ink/65 leading-snug">
              {clean(img.caption) || titleFromFile(img.file)}
              <span className="block mt-1 text-[11px] text-ink/35">
                {img.author && <>{img.author} · </>}
                {img.licenseUrl ? (
                  <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-ink/60">
                    {img.license}
                  </a>
                ) : (
                  img.license
                )}
                {" · "}
                <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink/60">
                  Wikimedia Commons
                </a>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
