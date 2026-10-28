/**
 * "Visit it today" links to GetYourGuide tours and tickets, shown on city
 * and country pages. Each link is a GetYourGuide search for the place with
 * our partner ID, which earns a commission on bookings (disclosed in the box,
 * in the footer and on /terms). The ID is public — it appears in every link —
 * so it lives here; set NEXT_PUBLIC_GYG_PARTNER_ID to override it, or to ""
 * for plain links.
 *
 * Places at war, under sanctions, closed to most visitors, or with next to no
 * tours get no box, so we never point readers at a trip they can't take.
 */
import { countrySlugFor } from "@/lib/countries";
import type { City } from "@/lib/cityHistory";

/** Our GetYourGuide partner ID (account opened 2026-10-27). */
const PARTNER_ID = process.env.NEXT_PUBLIC_GYG_PARTNER_ID ?? "LQ2GYR6";

const NO_VISIT_COUNTRIES = new Set([
  // War, sanctions or advice against all travel
  "afghanistan", "belarus", "burkina-faso", "central-african-republic", "chad", "haiti", "iran", "iraq", "libya", "mali",
  "myanmar", "niger", "north-korea", "palestine", "russia", "somalia", "south-sudan", "sudan", "syria", "ukraine",
  "venezuela", "yemen", "democratic-republic-of-the-congo", "eritrea",
  // Next to no bookable tours
  "comoros", "equatorial-guinea", "guinea-bissau", "kiribati", "marshall-islands", "micronesia", "nauru", "sao-tome-and-principe",
  "solomon-islands", "tuvalu",
]);

/** Cities closed to most visitors even where the country is open. */
const NO_VISIT_CITIES = new Set(["mecca", "medina"]);

export function gygSearchUrl(query: string): string {
  const params = new URLSearchParams({ q: query });
  if (PARTNER_ID) {
    params.set("partner_id", PARTNER_ID);
    params.set("utm_medium", "online_publisher");
  }
  return `https://www.getyourguide.com/s/?${params}`;
}

export function canVisitCountry(slug: string): boolean {
  return !NO_VISIT_COUNTRIES.has(slug);
}

export function canVisitCity(city: City): boolean {
  if (NO_VISIT_CITIES.has(city.slug)) return false;
  const country = countrySlugFor(city.country.replace(/ \(.*\)$/, ""));
  return !country || canVisitCountry(country);
}
