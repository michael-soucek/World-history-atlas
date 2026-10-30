import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="page-bg min-h-[70vh] relative overflow-hidden">
        <div className="absolute inset-0 graticule pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36">
          <p className="label text-accent mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            404 · Terra incognita
          </p>
          <h1 className="font-display font-light text-6xl sm:text-8xl lg:text-[120px] leading-[0.95] tracking-[-0.04em] text-ink max-w-4xl">
            Here be <span className="italic text-accent">dragons.</span>
          </h1>
          <p className="mt-8 text-lg text-ink/72 max-w-lg leading-relaxed">
            This page isn&rsquo;t on any of our maps. It may have moved, or the border it marked has shifted.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/" className="inline-flex items-center h-12 px-6 rounded-md bg-ink text-parchment text-[15px] font-semibold hover:bg-accent transition-colors">
              Back to the start
            </Link>
            <Link href="/search" className="text-[15px] text-ink/70 hover:text-accent link-draw pb-0.5">Search the atlas</Link>
            <Link href="/map" className="text-[15px] text-ink/70 hover:text-accent link-draw pb-0.5">Open the map</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
