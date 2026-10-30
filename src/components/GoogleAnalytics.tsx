import Script from "next/script";

/** GA4 measurement ID ("G-…"). Without it nothing loads. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/**
 * Countries where analytics cookies need consent first (EEA, UK, Switzerland).
 * The site has no consent banner yet, so there GA4 runs in consent mode with
 * storage denied: cookieless, anonymous pings only.
 */
const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

/**
 * Google Analytics 4, which Mediavine/Journey requires to review the site's
 * traffic. Page views on client-side navigation come from GA4's enhanced
 * measurement (browser history events), so no per-route code is needed.
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(CONSENT_REGIONS)}});
gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
