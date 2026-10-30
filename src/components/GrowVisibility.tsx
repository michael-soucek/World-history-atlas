"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The full-screen map views keep their controls in the bottom-right corner,
 * where Grow's floating widget sits (the timeline's newest years on /map, the
 * narration panel on tours). Hide the widget there; globals.css does the hiding.
 */
const FULL_SCREEN = /^\/(map|tour\/[^/]+)\/?$/;

export default function GrowVisibility() {
  const pathname = usePathname() ?? "/";
  const hide = FULL_SCREEN.test(pathname);
  useEffect(() => {
    document.documentElement.toggleAttribute("data-no-grow", hide);
  }, [hide]);
  return null;
}
