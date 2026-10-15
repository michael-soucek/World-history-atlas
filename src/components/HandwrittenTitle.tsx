"use client";

/**
 * HandwrittenTitle — renders an <h1> with a reveal animation.
 *
 * Architecture:
 *  - A real <h1> is always SSR'd in the DOM: selectable, crawlable, accessible.
 *  - Uses the provided font (e.g. Playfair Display) but applies a 
 *    reveal animation using clip-path.
 */

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Props {
  children: string;
  className?: string;
  inkColor?: string;
}

export default function HandwrittenTitle({
  children,
  className = "",
  inkColor = "#0f1726",
}: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const phase = reducedMotion ? "reduced" : "animating";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "fit-content",
        overflow: "visible",
      }}
    >
      <h1
        className={className}
        style={{
          color: inkColor,
          animation: phase === "animating"
            ? "year-in 0.8s cubic-bezier(.2,.7,.2,1) both"
            : "none",
        }}
      >
        {children}
      </h1>
    </div>
  );
}
