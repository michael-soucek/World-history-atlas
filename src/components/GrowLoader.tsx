import Script from "next/script";

/**
 * Grow site ID from the Grow publisher portal (Mediavine's engagement tool,
 * which Journey uses to measure traffic before approving a site). Without it
 * nothing loads.
 */
const GROW_SITE_ID = process.env.NEXT_PUBLIC_GROW_SITE_ID ?? "";

/** Grow's install snippet, loaded after the page is interactive. */
export default function GrowLoader() {
  if (!GROW_SITE_ID) return null;
  return (
    <Script id="grow-initializer" data-grow-initializer="" strategy="afterInteractive">
      {`!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id",${JSON.stringify(GROW_SITE_ID)});var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();`}
    </Script>
  );
}
