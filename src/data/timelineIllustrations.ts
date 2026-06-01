export interface TimelineIllustration {
  era: string;
  title: string;
  src: string;
  alt: string;
  author: string;
  source: string;
  license: string;
  credit: string;
  caption: string;
  objectPosition?: string;
}

export const TIMELINE_ILLUSTRATIONS: Record<string, TimelineIllustration> = {
  Prehistoric: {
    era: "Prehistoric",
    title: "Lascaux cave art",
    src: "/timeline-art/prehistoric-lascaux.jpg",
    alt: "Prehistoric cave painting from Lascaux, showing animals in ochre and black pigment",
    author: "Prof saxx",
    source: "Wikimedia Commons",
    license: "Public domain",
    credit: "Prof saxx · Public domain · Wikimedia Commons",
    caption: "Lascaux cave painting",
    objectPosition: "center center",
  },
  Ancient: {
    era: "Ancient",
    title: "Narmer Palette",
    src: "/timeline-art/ancient-narmer.jpg",
    alt: "The Narmer Palette, an ancient Egyptian ceremonial palette carved in greywacke",
    author: "Unknown ancient Egyptian maker",
    source: "Wikimedia Commons",
    license: "Public domain",
    credit: "Unknown ancient Egyptian maker · Public domain · Wikimedia Commons",
    caption: "Narmer Palette",
    objectPosition: "center center",
  },
  Classical: {
    era: "Classical",
    title: "Greek vase drawing",
    src: "/timeline-art/classical-rhodes-vase.jpg",
    alt: "A geometric vase from ancient Rhodes, reproduced in an early encyclopaedia illustration",
    author: "Unknown maker from ancient Rhodes",
    source: "Encyclopaedia Britannica (1911), via Wikimedia Commons",
    license: "Public domain",
    credit: "Unknown maker from ancient Rhodes · Public domain · Wikimedia Commons",
    caption: "Geometric vase from Rhodes",
    objectPosition: "center center",
  },
  Medieval: {
    era: "Medieval",
    title: "Book of Kells Chi Rho page",
    src: "/timeline-art/medieval-book-of-kells.jpg",
    alt: "The Chi Rho page of the Book of Kells, densely ornamented with medieval manuscript decoration",
    author: "Unknown Irish or Scottish monks",
    source: "Book of Kells CD-ROM / Wikimedia Commons",
    license: "Public domain",
    credit: "Unknown Irish or Scottish monks · Public domain · Wikimedia Commons",
    caption: "Book of Kells, folio 34r",
    objectPosition: "center center",
  },
  "Early Modern": {
    era: "Early Modern",
    title: "Ortelius world map",
    src: "/timeline-art/early-modern-ortelius.jpg",
    alt: "Abraham Ortelius's 1572 world map, dense with coastlines, labels, and cartographic ornament",
    author: "Abraham Ortelius",
    source: "Wikimedia Commons",
    license: "Public domain",
    credit: "Abraham Ortelius · Public domain · Wikimedia Commons",
    caption: "Ortelius, Theatrum Orbis Terrarum",
    objectPosition: "center center",
  },
  Modern: {
    era: "Modern",
    title: "Industrial worker",
    src: "/timeline-art/modern-industrial-worker.jpg",
    alt: "A modern industrial worker photographed in a workshop, with tools and machinery around him",
    author: "Carol M. Highsmith",
    source: "Library of Congress / Wikimedia Commons",
    license: "Public domain",
    credit: "Carol M. Highsmith · Public domain · Wikimedia Commons",
    caption: "Industrial worker",
    objectPosition: "center center",
  },
};
