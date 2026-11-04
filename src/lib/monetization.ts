/**
 * Central switches for the monetization foundation. Everything here defaults
 * to "off" so the site behaves exactly as it does today until you deliberately
 * turn a piece on — no code changes needed later, just env vars.
 */

/** The tip-jar page. Set here, not in an env var, so a rename only needs this line changed. */
export const SUPPORT_URL = "https://ko-fi.com/independentguides";

/**
 * Whether ad/sponsorship slots should render anything at all. Leave unset in
 * production until you've chosen a network — AdSlot renders nothing when this
 * is false, so there is never a placeholder box on the live site by accident.
 * Set NEXT_PUBLIC_ADS_ENABLED=true locally only to check slot placement.
 */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
