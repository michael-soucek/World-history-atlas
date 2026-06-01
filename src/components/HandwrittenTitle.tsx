"use client";

/**
 * HandwrittenTitle — renders an <h1> with a calligraphy pen-reveal animation.
 *
 * Architecture:
 *  - A real <h1> is always SSR'd in the DOM: selectable, crawlable, accessible.
 *  - The heading stays invisible until the calligraphy overlay is ready, so there
 *    is no flash of fallback text before the animation starts.
 *  - The overlay uses Pinyon Script, a genuine calligraphy face with thick/thin
 *    strokes, and sweeps in from left to right.
 *  - prefers-reduced-motion: no animation; the real h1 stays visible.
 *  - If Google Fonts fails to load, the real h1 remains visible as a fallback.
 */

import { useEffect, useState } from "react";

const GFONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap";

function injectFont(): void {
  if (document.getElementById("pinyon-script-font")) return;
  const link = document.createElement("link");
  link.id = "pinyon-script-font";
  link.rel = "stylesheet";
  link.href = GFONTS_HREF;
  document.head.appendChild(link);
}

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
  const [phase, setPhase] = useState<"idle" | "animating" | "failed">(
    "idle"
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    injectFont();

    document.fonts
      .load("48px 'Pinyon Script'")
      .then(() => {
        if (!cancelled) setPhase("animating");
      })
      .catch(() => {
        if (!cancelled) setPhase("failed");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const showOverlay = phase === "animating";
  const showFallback = phase === "failed";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "fit-content",
        overflow: "visible",
        paddingBottom: "0.2em",
      }}
    >
      {/*
        Real h1 — always in the DOM and layout flow.
        Invisible until the overlay is ready, so there is no flash of fallback
        text before the animation starts.
      */}
      <h1
        className={className}
        style={{
          opacity: showFallback ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {children}
      </h1>

      {/*
        Calligraphy overlay — Pinyon Script sweeping left-to-right.
        Uses the same className for matching size/spacing, then overrides only
        the font family and motion. No boldness override.
      */}
      {showOverlay && (
        <div
          aria-hidden="true"
          className={className}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            fontFamily: "'Pinyon Script', cursive",
            fontStyle: "normal",
            lineHeight: 1.15,
            display: "block",
            color: inkColor,
            whiteSpace: "nowrap",
            overflow: "visible",
            pointerEvents: "none",
            paddingBottom: "0.15em",
            animation:
              "calligraphy-reveal 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
