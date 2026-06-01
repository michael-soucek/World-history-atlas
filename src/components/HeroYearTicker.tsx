"use client";

import { useEffect, useState, useRef } from "react";

const YEARS = [
  -3000, -2000, -1200, -500, 1, 500, 800, 1200, 1453, 1600, 1750, 1815, 1900, 1945, 2000,
];

export default function HeroYearTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const prefersReduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced.current = mq.matches;
    if (mq.matches) return;

    const tick = () => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % YEARS.length);
        setVisible(true);
      }, 300);
    };

    const id = setInterval(tick, 2200);
    return () => clearInterval(id);
  }, []);

  const y = YEARS[index];
  const label = y < 0 ? `${Math.abs(y)} BCE` : y === 0 ? "1 CE" : `${y} CE`;

  return (
    <span
      className="font-mono text-xs tabular-nums transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-live="off"
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
