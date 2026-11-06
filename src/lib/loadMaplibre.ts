/**
 * Load MapLibre with its worker URL set. Version 6 finds the worker relative to
 * its own file, which the bundler moves, so every map must load through here.
 */
export async function loadMaplibre() {
  const maplibre = await import("maplibre-gl");
  maplibre.setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).toString());
  return maplibre;
}
