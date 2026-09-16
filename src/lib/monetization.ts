/**
 * Central switches for the monetization foundation. Everything here defaults
 * to "off" so the site behaves exactly as it does today until you deliberately
 * turn a piece on — no code changes needed later, just env vars.
 */

/**
 * Ko-fi / Buy Me a Coffee (or any other tip-jar) page URL. Set
 * NEXT_PUBLIC_SUPPORT_URL once you've created one; until then, SupportButton
 * falls back to the on-site /support page.
 */
export const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL || null;

/**
 * Whether ad/sponsorship slots should render anything at all. Leave unset in
 * production until you've chosen a network — AdSlot renders nothing when this
 * is false, so there is never a placeholder box on the live site by accident.
 * Set NEXT_PUBLIC_ADS_ENABLED=true locally only to check slot placement.
 */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
