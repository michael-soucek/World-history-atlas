"use client";

/**
 * HandwrittenTitle — renders an <h1> with a reveal animation.
 *
 * Architecture:
 *  - A real <h1> is always SSR'd in the DOM: selectable, crawlable, accessible.
 *  - Uses the provided font (e.g. Playfair Display) but applies a 
 *    reveal animation using clip-path.
 */

import { useEffect, useState } from "react";

interface Props {
  children: string;
  className?: string;
  inkColor?: string;
}

export default function HandwrittenTitle({
  children,
  className = "",
  inkColor = "#1a120a",
}: Props) {
  const [phase, setPhase] = useState<"idle" | "animating" | "reduced">("idle");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("reduced");
      return;
    }
    setPhase("animating");
  }, []);

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
          clipPath: phase === "reduced" ? "none" : "inset(0 100% 0 0)",
          animation: phase === "animating"
            ? "calligraphy-reveal 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            : "none",
        }}
      >
        {children}
      </h1>
    </div>
  );
}
