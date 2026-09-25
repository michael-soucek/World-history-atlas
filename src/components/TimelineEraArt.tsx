"use client";

import { useEffect, useRef, useState } from "react";
import type { TimelineIllustration } from "@/data/timelineIllustrations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Props {
  image: TimelineIllustration;
}

function useNearViewport(rootMargin = "280px") {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [observedNear, setObservedNear] = useState(false);

  useEffect(() => {
    // Reduced motion doesn't need observing — it's folded into `near` below.
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setObservedNear(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, reducedMotion]);

  return { ref, near: reducedMotion || observedNear };
}

export default function TimelineEraArt({ image }: Props) {
  // `loaded` was pure derived state — it only ever mirrored `near` one tick
  // later, so `near` is used directly instead of duplicating it.
  const { ref, near: loaded } = useNearViewport();

  return (
    <figure ref={ref} className="relative lg:sticky lg:top-28 lg:ml-auto lg:w-full max-w-85">
      <div className="relative overflow-hidden rounded-4xl border border-ancient/20 bg-parchment shadow-[0_24px_60px_rgba(37,24,12,0.10)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_60%)]" aria-hidden="true" />
        <div className="absolute inset-2.5 rounded-[1.55rem] border border-ink/10 pointer-events-none" aria-hidden="true" />
        <div className="aspect-4/5 w-full overflow-hidden">
          {loaded ? (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="h-full w-full object-contain bg-surface transition-opacity duration-700"
              style={{
                objectPosition: image.objectPosition ?? "center center",
                filter: "sepia(0.92) saturate(0.72) contrast(1.05) brightness(0.95)",
                opacity: 0.98,
              }}
            />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(135deg,rgba(184,112,8,0.16),rgba(42,107,63,0.10))] animate-pulse" />
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-parchment/85 via-parchment/16 to-transparent" aria-hidden="true" />
      </div>

      <figcaption className="mt-3 px-2 text-[11px] leading-snug text-ink/38">
        <span className="block font-semibold text-ink/50">{image.caption}</span>
        <span className="block">{image.credit}</span>
      </figcaption>
    </figure>
  );
}
