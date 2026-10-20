/**
 * Checks every book in src/data/books.ts against Open Library: the title and
 * author must match a real catalogue record. For each match it records the
 * ISBN-13 of a current English print edition (what Bookshop.org links use) in
 * src/data/bookIsbns.json. Books it can't confirm are left out of that file,
 * and the site only shows books that are in it.
 *
 *   npx tsx scripts/verify-books.mts
 */
import { writeFileSync } from "node:fs";
import { BOOKS } from "../src/data/books";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, "") // "(Ancient Peoples and Places)"
    .replace(/,? \d{3,4} ?[-\u2013] ?\d{3,4}\.?$/, "") // "The Scramble for Africa, 1876-1912"
    .replace(/&/g, " and ").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim()
    .replace(/^(.*) the$/, "the $1") // "Second World War, The"
    .replace(/^(the|a) /, "");
const mainTitle = (t: string) => t.split(/:| - /)[0];
const surname = (a: string) => norm(a).split(" ").pop()!;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get<T>(path: string): Promise<T | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`https://openlibrary.org${path}`, { headers: { "User-Agent": "BordersOfTime book check (bordersoftime.com)" } });
    if (res.status === 404) return null;
    if (res.ok) return (await res.json()) as T;
    await sleep(3000);
  }
  throw new Error(`Open Library failed: ${path}`);
}

interface Doc { key: string; title: string; author_name?: string[]; first_publish_year?: number; edition_count?: number }
interface Edition { title: string; isbn_13?: string[]; isbn_10?: string[]; languages?: { key: string }[]; physical_format?: string; number_of_pages?: number; publish_date?: string; works?: { key: string }[] }

/** ISBN-10 to ISBN-13: prefix 978 and recompute the check digit. */
function toIsbn13(isbn10: string) {
  const core = "978" + isbn10.replace(/[^0-9X]/gi, "").slice(0, 9);
  const sum = [...core].reduce((n, d, i) => n + Number(d) * (i % 2 ? 3 : 1), 0);
  return core + ((10 - (sum % 10)) % 10);
}
const englishIsbn = (e: Edition) =>
  [...(e.isbn_13 ?? []), ...(e.isbn_10 ?? []).map(toIsbn13)].find((i) => /^978[01]\d{9}$/.test(i));
const isPrint = (e: Edition) =>
  !/audio|cd|mp3|cassette|kindle|e-?book|electronic|online|large print/i.test(e.physical_format ?? "") &&
  (!e.languages || e.languages.some((l) => l.key === "/languages/eng"));
const year = (e: Edition) => Number(e.publish_date?.match(/\d{4}/)?.[0] ?? 0);
// Prefer editions listed as paperback or hardcover, then ones with a page count (an unlisted format is often an ebook), newest first.
const rank = (e: Edition) => (/paperback|hardcover|hardback|trade/i.test(e.physical_format ?? "") ? 2 : e.number_of_pages ? 1 : 0);

const out: Record<string, { isbn: string; openLibrary: string; firstPublished?: number }> = {};
const failed: string[] = [];
for (const [id, book] of Object.entries(BOOKS)) {
  const want = norm(mainTitle(book.title));
  // Same main title, and when both give a subtitle, it starts the same way
  // (so "Gandhi: Before India" isn't taken for "Gandhi: The Years That Changed the World").
  const sub = (t: string) => norm(t.slice(mainTitle(t).length)).split(" ").slice(0, 2).join(" ");
  const titleOk = (t: string) =>
    norm(t) === norm(book.title) || (norm(mainTitle(t)) === want && (!sub(t) || !sub(book.title) || sub(t) === sub(book.title)));

  if (book.isbn) {
    // A pinned edition: it must exist and carry this title.
    const e = await get<Edition>(`/isbn/${book.isbn}.json`);
    if (e && titleOk(e.title)) {
      out[id] = { isbn: book.isbn, openLibrary: `https://openlibrary.org${e.works?.[0]?.key ?? `/isbn/${book.isbn}`}` };
      console.log(`✓ ${id} ${book.isbn} (pinned)`);
    } else failed.push(`${id}: pinned ISBN ${book.isbn} ${e ? `is "${e.title}"` : "not found"}`);
    await sleep(350);
    continue;
  }

  const q = `/search.json?title=${encodeURIComponent(mainTitle(book.title).replace(/^The /, ""))}&author=${encodeURIComponent(surname(book.author))}&limit=10&fields=key,title,author_name,first_publish_year,edition_count`;
  const docs = (await get<{ docs: Doc[] }>(q))?.docs ?? [];
  const work = docs
    .filter((d) => titleOk(d.title) && d.author_name?.some((a) => surname(a) === surname(book.author)))
    .sort((a, b) => (b.edition_count ?? 0) - (a.edition_count ?? 0))[0];
  if (!work) {
    failed.push(`${id}: no match (${book.title} / ${book.author})`);
    await sleep(350);
    continue;
  }
  const editions = (await get<{ entries: Edition[] }>(`${work.key}/editions.json?limit=100`))?.entries ?? [];
  // The edition's own title must match too: Open Library sometimes files other books under a work.
  const best = editions.filter((e) => englishIsbn(e) && isPrint(e) && titleOk(e.title)).sort((a, b) => rank(b) - rank(a) || year(b) - year(a))[0];
  if (!best) failed.push(`${id}: no English print edition (${book.title})`);
  else {
    out[id] = { isbn: englishIsbn(best)!, openLibrary: `https://openlibrary.org${work.key}`, firstPublished: work.first_publish_year };
    console.log(`✓ ${id} ${englishIsbn(best)} (${work.first_publish_year ?? "?"}; edition ${best.publish_date ?? "?"}, ${best.physical_format ?? (best.number_of_pages ? best.number_of_pages + "pp" : "format unknown")})`);
  }
  await sleep(350);
}
writeFileSync("src/data/bookIsbns.json", JSON.stringify(out, null, 1) + "\n");
console.log(`\n${Object.keys(out).length} verified, ${failed.length} not:`);
for (const f of failed) console.log("✗ " + f);
