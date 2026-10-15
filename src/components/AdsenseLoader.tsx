"use client";

import { useEffect } from "react";

const SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1772060773365341";

/**
 * Loads the AdSense script once the visitor starts using the page (scroll,
 * tap, key) or after a few seconds — it is ~300 KB of script and used to
 * delay the first paint. Site verification uses the account meta tag in
 * layout.tsx, so it doesn't depend on this script being in the HTML.
 */
export default function AdsenseLoader() {
  useEffect(() => {
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
  }, []);
  return null;
}
