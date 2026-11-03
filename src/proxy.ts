import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { lookupByQid } from "@/data/crosswalk";
import { lookupCultureByQid, lookupEventByQid, lookupPersonByQid } from "@/data/entityCrosswalk";

const BY_QID = { place: lookupByQid, person: lookupPersonByQid, event: lookupEventByQid, culture: lookupCultureByQid };

/**
 * "/place/Q12548" duplicates "/place/holy-roman-empire". Redirect Wikidata-ID
 * URLs with a curated page before rendering: the pages stream, so a redirect
 * from inside one arrives as a 200 with a meta refresh, not a real 308.
 */
export function proxy(request: NextRequest) {
  const [, kind, id] = request.nextUrl.pathname.split("/") as [string, keyof typeof BY_QID, string];
  const slug = BY_QID[kind]?.(id.toUpperCase())?.slug;
  if (!slug || slug === id) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/${kind}/${slug}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/place/:id(Q\\d+)", "/person/:id(Q\\d+)", "/event/:id(Q\\d+)", "/culture/:id(Q\\d+)"],
};
