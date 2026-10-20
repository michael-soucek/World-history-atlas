"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1772060773365341";

/**
 * Loads the AdSense script once the visitor starts using the page (scroll,
 * tap, key) or after a few seconds — it is ~300 KB of script and used to
 * delay the first paint. Site verification uses the account meta tag in
 * layout.tsx, so it doesn't depend on this script being in the HTML.
 *
 * Not on utility screens with little content of their own (search results,
 * the per-year place stubs, the contact form): ads there would sit on
 * low-value screens, which AdSense policy forbids. Nor on the full-screen
 * map tools (see NO_ADS).
 */
const NO_ADS = [
  /^\/search/, /^\/place\/[^/]+\/-?\d+/, /^\/contact/, /^\/privacy/, /^\/terms/,
  // Full-screen tools: an auto-placed ad beside the time slider or the
  // compare divider invites accidental clicks.
  /^\/map/, /^\/compare/,
];

export default function AdsenseLoader() {
  const pathname = usePathname() ?? "/";
  const blocked = NO_ADS.some((re) => re.test(pathname));
  useEffect(() => {
    // Nor on pages kept out of search (thin fallbacks, previews).
    const noindex = /noindex/i.test(document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "");
    // Nor where a page has flagged itself (entity pages with little of the site's own content).
    const flagged = !!document.querySelector("[data-no-ads]");
    if (blocked || noindex || flagged) return;
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      cleanup();
      const s = document.createElement("script");
      s.async = true;
      s.src = SRC;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    };
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    const timer = window.setTimeout(load, 7000);
    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    }
    return cleanup;
  }, [blocked]);
  return null;
}
