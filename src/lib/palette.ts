/**
 * Colours used outside CSS — map styles and inline era colours. The page
 * palette itself lives in globals.css; keep the two in step.
 */

/** One colour per age, tuned to sit beside the lapis brand colour. */
export const ERA_HEX: Record<string, string> = {
  Prehistoric: "#6d6457",
  Ancient: "#a66a12",
  Classical: "#b4492b",
  Medieval: "#2f6b4f",
  "Early Modern": "#1f7272",
  Modern: "#6a4aa0",
};

export const MAP = {
  sea: "#cdd9e5",
  land: "#f3f1ea",
  coast: "#8796a8",
  label: "#0f1726",
  labelHalo: "rgba(238,240,242,0.92)",
  border: "#2a3346",
  highlight: "#d2462a", // vermilion
} as const;

export const NIGHT_MAP = {
  sea: "#0b1424",
  land: "#14203a",
  coast: "#2a3a5e",
  border: "#9fb7ff",
} as const;
