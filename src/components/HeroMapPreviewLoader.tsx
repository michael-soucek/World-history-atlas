"use client";

// This wrapper exists so that `next/dynamic` with `ssr: false` lives inside
// a Client Component, where it is permitted. Server Components cannot use
// `ssr: false` directly.  page.tsx imports THIS file, not HeroMapPreview.

import dynamic from "next/dynamic";

const HeroMapPreview = dynamic(() => import("./HeroMapPreview"), {
  ssr: false,
  // Placeholder while the JS bundle loads — same ocean colour as the map
  loading: () => (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 50% 50%, #d8c8a0 0%, #c4d9ed 100%)",
      }}
    />
  ),
});

export default function HeroMapPreviewLoader() {
  return <HeroMapPreview />;
}
