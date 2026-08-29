/**
 * Central image manifest.
 *
 * Every hero photo is referenced by key from here, never hard-coded in a page.
 * To swap in your own photography later: drop a file in /public/images/ and
 * change the `src` (and `credit`) below — no page edits needed.
 *
 * Current photos are free stock from Unsplash (Unsplash License: free to use,
 * no attribution required; credit kept here as good practice).
 */
export interface HeroImage {
  src: string;
  alt: string;
  credit?: string;
}

export const images = {
  portugalRoad: {
    src: '/images/portugal-road.jpg',
    alt: 'A car on a winding road through green hills in Portugal',
    credit: 'Photo: Martin Katler / Unsplash',
  },
  lisbonStreet: {
    src: '/images/lisbon-street.jpg',
    alt: 'A yellow tram on a cobblestone street in central Lisbon',
    credit: 'Photo: Sarah Markstaller / Unsplash',
  },
  lisbonTram: {
    src: '/images/lisbon-tram.jpg',
    alt: 'A yellow and white tram on a Lisbon street',
    credit: 'Photo: André Lergier / Unsplash',
  },
  portoDouro: {
    src: '/images/porto-douro.jpg',
    alt: 'The Dom Luís I bridge over the Douro river in Porto',
    credit: 'Photo: Dorian Mongel / Unsplash',
  },
  algarveCoast: {
    src: '/images/algarve-coast.jpg',
    alt: 'Ocean at sunset from a grassy clifftop on the Algarve coast',
    credit: 'Photo: Elisa Kerschbaumer / Unsplash',
  },
} as const satisfies Record<string, HeroImage>;
