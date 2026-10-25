import "server-only";
import { cache } from "react";
import { getOurArticle } from "@/lib/ourArticles";
import { COUNTRY_LIST } from "@/lib/countries";

/** Slugs of the countries whose history article has been written. */
export const publishedCountries = cache((): ReadonlySet<string> => new Set(COUNTRY_LIST.filter((c) => getOurArticle("country", c.slug)).map((c) => c.slug)));
