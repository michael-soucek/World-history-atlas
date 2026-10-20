/**
 * "Further reading" suggestions shown alongside people, places, events,
 * cultures, tours and explorers, built from the book list in
 * src/data/books.ts. Only books that scripts/verify-books.mts confirmed
 * against Open Library (and so have an ISBN in bookIsbns.json) are shown.
 *
 * Each book links to its Bookshop.org page through our affiliate ID
 * (bookshop.org/a/{id}/{isbn}), disclosed in the box and on /terms. The ID
 * is public — it appears in every link — so it lives here; set
 * NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID to override it, or to "" for plain links.
 *
 * Keys are `"<entityType>:<slug>"` for person/place/event/culture pages
 * (matching EntityPage's `entityType`/`entry.slug`), or `"tour:<slug>"` /
 * `"explorer:<slug>"`. A key with no books simply shows nothing.
 */
import { BOOKS, BOOKS_FOR, BOOKSHOP_EDITION, NOT_STOCKED } from "@/data/books";
import isbns from "@/data/bookIsbns.json";

export type ResourceType = "book" | "documentary" | "museum" | "course";

export interface Resource {
  type: ResourceType;
  title: string;
  /** Author, director, or institution. */
  creator?: string;
  blurb: string;
  url?: string;
  /** True when `url` earns a commission, so it's marked rel="sponsored". */
  affiliate?: boolean;
}

/** Our Bookshop.org affiliate ID (approved 2026-10-20). */
const AFFILIATE_ID = process.env.NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID ?? "130156";
const ISBNS: Record<string, { isbn: string }> = isbns;

const bookshopUrl = (isbn: string) =>
  AFFILIATE_ID ? `https://bookshop.org/a/${AFFILIATE_ID}/${isbn}` : `https://bookshop.org/book/${isbn}`;

/** All suggestions for a given key, or an empty array if there are none. */
export function getResources(key: string): Resource[] {
  return (BOOKS_FOR[key] ?? []).flatMap((id) => {
    const book = BOOKS[id];
    const isbn = BOOKSHOP_EDITION[id] ?? ISBNS[id]?.isbn;
    // Only books confirmed against Open Library, and that Bookshop.org stocks.
    if (!book || !ISBNS[id] || NOT_STOCKED.has(id)) return [];
    return [{ type: "book" as const, title: book.title, creator: book.author, blurb: book.blurb, url: bookshopUrl(isbn), affiliate: Boolean(AFFILIATE_ID) }];
  });
}
