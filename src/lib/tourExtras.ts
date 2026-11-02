import "server-only";
import type { Tour } from "@/data/tours";
import type { ArticleImageData } from "@/components/ArticleImage";
import { toArticleImage, heroFirst } from "@/components/ArticleBody";
import { getEntityImages } from "@/lib/entityImages";
import { resolvePath } from "@/lib/sitePaths";

export interface StopLink { href: string; label: string }

/** A tour stop's people, further reading and picture, resolved to names and files. */
export interface StopExtras { people: StopLink[]; readMore: StopLink[]; image?: ArticleImageData }

/** Page kinds a stop's picture may come from, best first. */
const PICTURE_ORDER = ["event", "site", "person", "culture", "place"];

/**
 * Pictures a tour stop never uses: maps, charts, timelines and diagrams (the
 * tour is already a map; most PNGs on Commons are drawings), and photos that suit their own page but mislead beside a
 * stop (corn for the silver trade, a Czech fence for Korea's front line).
 */
const NOT_FOR_A_STOP = /\.png$|map|territor|extent|timeline|Kalandozasok|Unsplash|VegCorn|Čížov|2017-03-25_and_views_of_Rome|Shona_witch_doctor|Hut_Eastern_Arrernte|Fleckvieh|Mouwahidoune|Willem_Vrelant|Carlo_Buonaparte|Brazilwood|Leopard_africa|^thumbnail\.|Strategic_Situation|Graecia_tempore|Asia_minor_1140|К_ВОПРОСУ|Theodoric_I_by|Battle_of_Franklin|Confederate_Ram|Fortepan/i;
const fitForStop = (img: { file: string; caption?: string }) => !NOT_FOR_A_STOP.test(img.file) && !/\bmap\b|territory|extent/i.test(img.caption ?? "");

/** Stops in order, so a picture one stop has used isn't shown again further on. */
export async function tourExtras(tour: Tour): Promise<StopExtras[]> {
  const used = new Set<string>();
  const out: StopExtras[] = [];
  for (const step of tour.steps) out.push(await stopExtras(step, used));
  return out;
}

async function stopExtras(step: Tour["steps"][number], used: Set<string>): Promise<StopExtras> {
  const resolve = (paths: string[]) =>
    paths.flatMap((href) => {
      const r = resolvePath(href);
      return r ? [{ href, label: r.label, imageKey: r.imageKey }] : [];
    });
  const people = resolve((step.people ?? []).map((s) => `/person/${s}`));
  const readMore = resolve(step.readMore ?? []);
  const strip = ({ href, label }: StopLink) => ({ href, label });
  if (step.image === false) return { people: people.map(strip), readMore: readMore.map(strip) };
  let image: ArticleImageData | undefined;
  // City pages lead with today's skyline, so a stop's picture comes from what
  // happened there first: the event, a historic site, the people, then the state.
  const rank = (href: string) => PICTURE_ORDER.indexOf(href.split("/")[1]);
  // Only the stop's own pages: the first two to read next, and its people.
  // Broad pages further down the list (the Cold War, the Columbian Exchange)
  // have pictures that rarely fit one stop.
  const candidates = [...readMore.slice(0, 2), ...people].filter((r) => rank(r.href) >= 0).sort((a, b) => rank(a.href) - rank(b.href));
  for (const r of candidates) {
    const first = r.imageKey ? heroFirst(await getEntityImages(r.imageKey)).find((img) => fitForStop(img) && !used.has(img.thumb)) : undefined;
    if (first) { used.add(first.thumb); image = toArticleImage(first); break; }
  }
  return { people: people.map(strip), readMore: readMore.map(strip), image };
}
