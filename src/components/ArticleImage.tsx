"use client";

import { useRef } from "react";
import { Expand, X } from "lucide-react";
import { commonsSrcSet } from "@/lib/commonsImage";

/** One image as shown in an article — from the vetted gallery or the page's hero. */
export interface ArticleImageData {
  thumb: string;
  width?: number;
  height?: number;
  caption?: string;
  author?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
}

/** A sharper rendition for the full-screen view (Commons thumbnails take any bucket width). */
function largeUrl(thumb: string): string {
  return thumb.replace(/\/(\d+)px-([^/]+)$/, (m, w, rest) => (Number(w) < 1280 ? `/1280px-${rest}` : m));
}

/** Commons author strings can carry wiki chrome ("talk · contribs") and doubled names. */
function cleanAuthor(a?: string): string | undefined {
  if (!a) return undefined;
  const t = a.replace(/\(\s*talk[^)]*\)/gi, "").replace(/\s+/g, " ").trim();
  const half = t.slice(0, t.length / 2).trim();
  return t === `${half} ${half}` ? half : t;
}

function Credit({ img: raw, className = "" }: { img: ArticleImageData; className?: string }) {
  const img = { ...raw, author: cleanAuthor(raw.author) };
  if (!img.license && !img.author) return null;
  return (
    <span className={`block text-[11px] leading-snug text-ink/64 ${className}`}>
      {img.author && <>{img.author} · </>}
      {img.license &&
        (img.licenseUrl ? (
          <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-ink/72">
            {img.license}
          </a>
        ) : (
          img.license
        ))}
      {img.sourceUrl && (
        <>
          {" · "}
          <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink/72">
            Wikimedia Commons
          </a>
        </>
      )}
    </span>
  );
}

/**
 * A captioned, credited figure that opens full-screen on click.
 * - "hero": wide banner at the top of the article
 * - "float": beside the text on wide screens (alternating sides), full-width on phones
 * - "strip": compact card in the end-of-article image strip
 * Every variant shows the image's credit (author, license, source).
 */
export default function ArticleImage({
  img,
  alt,
  variant,
  side = "right",
  priority = false,
}: {
  img: ArticleImageData;
  alt: string;
  variant: "hero" | "float" | "strip";
  side?: "left" | "right";
  priority?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = () => dialog.current?.showModal();

  const frame =
    variant === "hero"
      ? "w-full aspect-[4/3] sm:aspect-[2/1]"
      : variant === "float"
        ? "w-full aspect-[4/3]"
        : "h-44 w-64";
  const figureClass =
    variant === "hero"
      ? ""
      : variant === "float"
        ? `mb-6 sm:mb-4 sm:w-[44%] ${side === "right" ? "sm:float-right sm:ml-8" : "sm:float-left sm:mr-8"} mt-1.5`
        : "shrink-0 w-64 snap-start";

  return (
    <figure className={figureClass}>
      <button
        type="button"
        onClick={open}
        className={`group relative block overflow-hidden bg-surface ${variant === "hero" ? "bg-night" : ""} ${frame} cursor-zoom-in`}
        aria-label={`Enlarge image: ${alt}`}
      >
        {variant === "hero" && (
          // Blurred copy behind the image fills the banner for any aspect ratio
          // without cropping portraits or maps.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={commonsSrcSet(img.thumb) ? img.thumb.replace(/\/\d+px-([^/]+)$/, "/120px-$1") : img.thumb} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element -- Wikimedia thumbnails are already sized */}
        <img
          src={img.thumb}
          srcSet={commonsSrcSet(img.thumb)}
          sizes={variant === "hero" ? "(min-width: 1280px) 1216px, 100vw" : variant === "float" ? "(min-width: 640px) 330px, 100vw" : "256px"}
          alt={alt}
          width={img.width}
          height={img.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-full bg-black/45 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand size={14} aria-hidden="true" />
        </span>
        {variant === "hero" && img.caption && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 sm:px-6 pb-4 pt-12 text-left font-text italic text-[15px] text-white/90 leading-snug">
            {img.caption}
          </span>
        )}
      </button>

      {variant !== "hero" && img.caption && (
        <figcaption className={`mt-2 font-text italic text-ink/65 leading-snug ${variant === "strip" ? "text-xs line-clamp-2" : "text-[13px]"}`}>
          {img.caption}
        </figcaption>
      )}
      <Credit img={img} className={variant === "strip" ? "mt-1 line-clamp-2 !text-[10px]" : "mt-1"} />

      <dialog
        ref={dialog}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="lightbox m-auto max-h-[94vh] max-w-[min(94vw,1100px)] bg-parchment p-0 shadow-2xl"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="absolute right-3 top-3 z-10 rounded-full bg-black/55 p-2 text-white hover:bg-black/75"
            aria-label="Close"
          >
            <X size={18} aria-hidden="true" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- full-size Wikimedia rendition */}
          <img src={largeUrl(img.thumb)} alt={alt} loading="lazy" className="block max-h-[78vh] w-auto max-w-full mx-auto bg-surface object-contain" />
          <div className="px-5 py-4">
            {img.caption && <p className="font-text italic text-ink/75 text-[15px] leading-snug">{img.caption}</p>}
            <Credit img={img} className="mt-1.5" />
          </div>
        </div>
      </dialog>
    </figure>
  );
}
