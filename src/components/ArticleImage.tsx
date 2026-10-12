"use client";

import { useRef } from "react";
import { Expand, X } from "lucide-react";

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

function Credit({ img, className = "" }: { img: ArticleImageData; className?: string }) {
  if (!img.license && !img.author) return null;
  return (
    <span className={`block text-[11px] leading-snug text-ink/35 ${className}`}>
      {img.author && <>{img.author} · </>}
      {img.license &&
        (img.licenseUrl ? (
          <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-ink/60">
            {img.license}
          </a>
        ) : (
          img.license
        ))}
      {img.sourceUrl && (
        <>
          {" · "}
          <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink/60">
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
      ? "w-full rounded-2xl"
      : variant === "float"
        ? "w-full rounded-xl"
        : "h-40 w-56 rounded-lg";
  const figureClass =
    variant === "hero"
      ? "mb-10"
      : variant === "float"
        ? `mb-6 sm:mb-3 sm:w-[46%] ${side === "right" ? "sm:float-right sm:ml-6" : "sm:float-left sm:mr-6"} mt-1`
        : "shrink-0 w-56 snap-start";

  return (
    <figure className={figureClass}>
      <button
        type="button"
        onClick={open}
        className={`group relative block overflow-hidden border border-paper bg-surface ${frame} cursor-zoom-in`}
        style={variant === "hero" ? { aspectRatio: "16 / 9" } : variant === "float" ? { aspectRatio: "4 / 3" } : undefined}
        aria-label={`Enlarge image: ${alt}`}
      >
        {variant === "hero" && (
          // Blurred copy behind the image fills the banner for any aspect ratio
          // without cropping portraits or maps.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img.thumb} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-60" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element -- Wikimedia thumbnails are already sized */}
        <img
          src={img.thumb}
          alt={alt}
          width={img.width}
          height={img.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-full bg-black/45 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand size={14} aria-hidden="true" />
        </span>
        {variant === "hero" && img.caption && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-4 pt-12 text-left text-sm text-white/95 leading-snug">
            {img.caption}
          </span>
        )}
      </button>

      {variant !== "hero" && img.caption && (
        <figcaption className={`mt-2 font-serif italic text-ink/60 leading-snug ${variant === "strip" ? "text-xs line-clamp-2" : "text-[13px]"}`}>
          {img.caption}
        </figcaption>
      )}
      <Credit img={img} className={variant === "strip" ? "mt-1 line-clamp-2 !text-[10px]" : "mt-1"} />

      <dialog
        ref={dialog}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="lightbox m-auto max-h-[94vh] max-w-[min(94vw,1100px)] rounded-2xl bg-parchment p-0 shadow-2xl"
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
            {img.caption && <p className="font-serif italic text-ink/75 text-[15px] leading-snug">{img.caption}</p>}
            <Credit img={img} className="mt-1.5" />
          </div>
        </div>
      </dialog>
    </figure>
  );
}
