/**
 * "Further reading" suggestions shown alongside people, places, events,
 * cultures, countries, philosophy eras, tours and explorers, built from the
 * book list in src/data/books.ts. Only books that scripts/verify-books.mts
 * confirmed against Open Library (and so have an ISBN in bookIsbns.json) are
 * shown.
 *
 * Each book links to Amazon (our Associates tag) and, where it stocks the
 * book, Bookshop.org (bookshop.org/a/{id}/{isbn}). Both are affiliate links,
 * disclosed in the box, in the footer and on /terms. The IDs are public —
 * they appear in every link — so they live here; set
 * NEXT_PUBLIC_AMAZON_TAG or NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID to override
 * one, or to "" for plain links.
 *
 * Keys are `"<entityType>:<slug>"` for person/place/event/culture pages
 * (matching EntityPage's `entityType`/`entry.slug`), `"country:<slug>"`,
 * `"philosophy:<slug>"`, or `"tour:<slug>"` / `"explorer:<slug>"`. A key with
 * no books simply shows nothing.
 */
import { AMAZON_ASIN, AMAZON_BY_SEARCH, BOOKS, BOOKS_FOR, BOOKSHOP_EDITION, NOT_STOCKED } from "@/data/books";
import isbns from "@/data/bookIsbns.json";

export type ResourceType = "book" | "documentary" | "museum" | "course";

export interface ResourceLink {
  label: string;
  url: string;
}

export interface Resource {
  type: ResourceType;
  title: string;
  /** Author, director, or institution. */
  creator?: string;
  blurb: string;
  /** Where to get it, main shop first. */
  links: ResourceLink[];
  /** True when the links earn a commission, so they're marked rel="sponsored". */
  affiliate?: boolean;
}

/** Our Amazon Associates tag (account opened 2026-10-27). */
const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? "bordersoftime-20";
/** Our Bookshop.org affiliate ID (approved 2026-10-20). */
const BOOKSHOP_ID = process.env.NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID ?? "130156";
const ISBNS: Record<string, { isbn: string }> = isbns;

/** 978-prefixed ISBN-13 to ISBN-10, which is the book's Amazon product ID. */
function toIsbn10(isbn13: string): string | undefined {
  if (!isbn13.startsWith("978")) return undefined;
  const core = isbn13.slice(3, 12);
  const sum = [...core].reduce((n, d, i) => n + Number(d) * (10 - i), 0);
  const check = (11 - (sum % 11)) % 11;
  return core + (check === 10 ? "X" : String(check));
}

/** The book's own product page, or a books search where Amazon has no page for our ISBN. */
function amazonUrl(isbn: string, search?: string, productId?: string) {
  const asin = search ? undefined : productId ?? toIsbn10(isbn);
  const url = new URL(asin ? `https://www.amazon.com/dp/${asin}` : "https://www.amazon.com/s");
  if (!asin) {
    url.searchParams.set("k", search ?? isbn);
    url.searchParams.set("i", "stripbooks");
  }
  if (AMAZON_TAG) url.searchParams.set("tag", AMAZON_TAG);
  return url.toString();
}

const bookshopUrl = (isbn: string) =>
  BOOKSHOP_ID ? `https://bookshop.org/a/${BOOKSHOP_ID}/${isbn}` : `https://bookshop.org/book/${isbn}`;

/** All suggestions for a given key, or an empty array if there are none. */
export function getResources(key: string): Resource[] {
  return (BOOKS_FOR[key] ?? []).flatMap((id) => {
    const book = BOOKS[id];
    // Only books confirmed against Open Library.
    if (!book || !ISBNS[id]) return [];
    const links: ResourceLink[] = [{ label: "Amazon", url: amazonUrl(ISBNS[id].isbn, AMAZON_BY_SEARCH.has(id) ? `${book.title} ${book.author}` : undefined, AMAZON_ASIN[id]) }];
    if (!NOT_STOCKED.has(id)) links.push({ label: "Bookshop.org", url: bookshopUrl(BOOKSHOP_EDITION[id] ?? ISBNS[id].isbn) });
    return [{ type: "book" as const, title: book.title, creator: book.author, blurb: book.blurb, links, affiliate: Boolean(AMAZON_TAG || BOOKSHOP_ID) }];
  });
}
