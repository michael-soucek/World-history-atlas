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
 * Not on the encyclopedia pages (empires, people, events, cultures): they
 * show the Wikipedia article, and AdSense doesn't allow its ads on screens
 * whose main text comes from elsewhere. Ads run on the site's original pages.
 */
const NO_ADS = /^\/(place|person|event|culture)\//;

export default function AdsenseLoader() {
  const pathname = usePathname() ?? "/";
  const blocked = NO_ADS.test(pathname);
  useEffect(() => {
    if (blocked) return;
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
