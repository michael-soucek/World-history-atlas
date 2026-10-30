/**
 * Grow site ID from the Grow publisher portal (Mediavine's engagement tool,
 * which Journey uses to measure traffic before approving a site). Site
 * "Borders of Time", added 2026-10-30.
 */
const GROW_SITE_ID = process.env.NEXT_PUBLIC_GROW_SITE_ID ?? "U2l0ZToxNmFmMjhiZC1mNTYyLTQ5MDUtODBhMy05OGVmNDkxM2U2ZjA=";

/**
 * Grow's install snippet as a plain tag, so it is in the HTML exactly as Grow
 * gives it (its install check looks for `data-grow-initializer`). The snippet
 * itself only injects main.js with `defer`, so it doesn't block rendering.
 */
export default function GrowLoader() {
  if (!GROW_SITE_ID) return null;
  return (
    <script
      data-grow-initializer=""
      dangerouslySetInnerHTML={{
        __html: `!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id",${JSON.stringify(GROW_SITE_ID)});var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();`,
      }}
    />
  );
}
