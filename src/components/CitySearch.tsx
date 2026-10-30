"use client";

import { useState } from "react";
import Gazetteer from "@/components/Gazetteer";

interface CityItem {
  slug: string;
  name: string;
  country: string;
  formerly?: string;
  rulers: number;
}

/** Strip accents and case so "krakow" finds "Kraków". */
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** The /history-of city list, filtered as you type (name, country or former name). */
export default function CitySearch({ cities }: { cities: CityItem[] }) {
  const [query, setQuery] = useState("");
  const q = fold(query.trim());
  const shown = q ? cities.filter((c) => fold(`${c.name} ${c.country} ${c.formerly ?? ""}`).includes(q)) : cities;

  return (
    <>
      <label className="block max-w-md mb-10">
        <span className="label text-ink/66 block mb-2">Find a city</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Budapest, Constantinople, Peru…"
          className="w-full h-12 px-4 rounded-md border border-ink/20 bg-parchment text-[15px] text-ink placeholder:text-ink/35 focus:outline-none focus:border-accent"
        />
      </label>
      {shown.length ? (
        <Gazetteer
          grouped={!q}
          items={shown.map((c) => ({ href: `/history-of/${c.slug}`, name: c.name, meta: `${c.rulers} rulers` }))}
        />
      ) : (
        <p className="text-ink/68">No city matches “{query}”.</p>
      )}
    </>
  );
}
