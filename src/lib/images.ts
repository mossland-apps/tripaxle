/**
 * Central image manifest.
 *
 * Every hero photo is referenced by key from here, never hard-coded in a page.
 * To swap a photo later: drop a file in /public/images/ and change the `src`
 * (and `credit`) below — no page edits needed.
 */
export interface HeroImage {
  src: string;
  alt: string;
  credit?: string;
}

export const images = {
  /** Aerial of the Douro, Dom Luís I bridge and Porto's red rooftops. */
  portoSkyline: {
    src: '/images/porto-skyline.jpg',
    alt: "Aerial view of Porto: the Douro river, the Dom Luís I bridge and the city's red rooftops",
    credit: 'Photo: Mo Eid / Pexels',
  },
  /** Lone cork oak beside a misty country track — the road-trip image. */
  corkRoad: {
    src: '/images/portugal-cork-road.jpg',
    alt: 'A lone cork oak beside a misty gravel road in the Portuguese countryside',
    credit: 'Photo: Luís Alvoeiro Quaresma / Unsplash',
  },
  /** The lake and stone tower folly in the Park of Pena, Sintra. */
  sintraPark: {
    src: '/images/sintra-park.jpg',
    alt: 'A small stone tower on a lake in the wooded Park of Pena, Sintra',
    credit: 'Photo: Alberto Frias / Unsplash',
  },
  /** Whitewashed lane with terracotta flowerpots in an Alentejo hill village. */
  alentejoVillage: {
    src: '/images/alentejo-village.jpg',
    alt: 'A cobbled lane of whitewashed houses hung with terracotta flowerpots in an Alentejo hilltop village',
    credit: 'Photo: Carlos Machado / Pexels',
  },
  /** Two number 28 trams on a wet cobbled street in central Lisbon. */
  lisbonTrams: {
    src: '/images/lisbon-trams.jpg',
    alt: 'Two yellow number 28 trams and cars on a wet cobbled street in central Lisbon',
    credit: 'Photo: Lisa Fotios / Pexels',
  },
  /** Alfama rooftops and the Tagus from a Lisbon viewpoint. */
  lisbonAlfama: {
    src: '/images/lisbon-alfama.jpg',
    alt: "Terracotta rooftops of Lisbon's Alfama district with the Tagus estuary beyond",
    credit: 'Photo: Skitterphoto / Pexels',
  },
  /** Terraced vineyards and a bend of the Douro river. */
  douroValley: {
    src: '/images/douro-valley.jpg',
    alt: 'Terraced vineyards on steep hillsides above a bend in the Douro river',
    credit: 'Photo: Andrew McLeod / Pexels',
  },
  /** Aerial of the red-and-yellow Pena Palace above the Sintra hills. */
  penaPalace: {
    src: '/images/pena-palace.jpg',
    alt: 'Aerial view of the red and yellow Pena Palace on a wooded hilltop above Sintra',
    credit: 'Photo: Mylo Kaye / Pexels',
  },
  /** Coimbra hillside and the Jardim da Manga fountain at golden hour. */
  coimbra: {
    src: '/images/coimbra.jpg',
    alt: 'The hillside old town of Coimbra behind a domed garden fountain at golden hour',
    credit: 'Photo: Egor Kunovsky / Pexels',
  },
  /** Leaf-strewn forest track in the northern interior. */
  autumnForest: {
    src: '/images/autumn-forest.jpg',
    alt: 'A leaf-strewn forest track running through autumn woodland in northern Portugal',
    credit: 'Photo: Luís Cardoso / Unsplash',
  },
  /** Old stone arch bridge and a waterfall in Peneda-Gerês. */
  geresBridge: {
    src: '/images/geres-bridge.jpg',
    alt: 'An old stone arch bridge beside a waterfall in the Peneda-Gerês mountains',
    credit: 'Photo: Natanael Vieira / Unsplash',
  },
  /** Colourful festival lane in Porto's Ribeira (portrait). */
  portoRibeira: {
    src: '/images/porto-ribeira.jpg',
    alt: "A stepped lane of colourful houses strung with festival bunting in Porto's Ribeira",
    credit: 'Photo: Petra Nesti / Pexels',
  },
  /** Satellite map showing the Portugal–Spain border. */
  portugalSpainMap: {
    src: '/images/portugal-spain-map.jpg',
    alt: 'Satellite map of the Iberian Peninsula with the Portugal–Spain border marked in yellow',
    credit: 'Imagery: Google Earth · Landsat / Copernicus, Data SIO, NOAA, U.S. Navy, NGA, GEBCO',
  },
  /** Algarve clifftop and Atlantic at sunset. */
  algarveCoast: {
    src: '/images/algarve-coast.jpg',
    alt: 'The Atlantic at sunset from a grassy clifftop on the Algarve coast',
    credit: 'Photo: Elisa Kerschbaumer / Unsplash',
  },
} as const satisfies Record<string, HeroImage>;
