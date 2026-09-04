/**
 * Central image manifest.
 *
 * Every hero photo is referenced by key from here, never hard-coded in a page.
 * Sources live in `src/assets/images/` so Astro's build-time image pipeline can
 * emit responsive AVIF/WebP variants with intrinsic dimensions; to swap a photo
 * later, drop a file in that folder and change the import below.
 */
import type { ImageMetadata } from 'astro';

import portoSkylineImg from '../assets/images/porto-skyline.jpg';
import corkRoadImg from '../assets/images/portugal-cork-road.jpg';
import sintraParkImg from '../assets/images/sintra-park.jpg';
import alentejoVillageImg from '../assets/images/alentejo-village.jpg';
import lisbonTramsImg from '../assets/images/lisbon-trams.jpg';
import lisbonAlfamaImg from '../assets/images/lisbon-alfama.jpg';
import douroValleyImg from '../assets/images/douro-valley.jpg';
import penaPalaceImg from '../assets/images/pena-palace.jpg';
import coimbraImg from '../assets/images/coimbra.jpg';
import autumnForestImg from '../assets/images/autumn-forest.jpg';
import geresBridgeImg from '../assets/images/geres-bridge.jpg';
import portoRibeiraImg from '../assets/images/porto-ribeira.jpg';
import portugalSpainMapImg from '../assets/images/portugal-spain-map.jpg';
import algarveCoastImg from '../assets/images/algarve-coast.jpg';
import algarveCliffsAerialImg from '../assets/images/algarve-cliffs-aerial.jpg';
import algarveBeachDuskImg from '../assets/images/algarve-beach-dusk.jpg';

export interface HeroImage {
  src: ImageMetadata;
  alt: string;
  credit?: string;
}

export const images = {
  /** Aerial of the Douro, Dom Luís I bridge and Porto's red rooftops. */
  portoSkyline: {
    src: portoSkylineImg,
    alt: "Aerial view of Porto: the Douro river, the Dom Luís I bridge and the city's red rooftops",
    credit: 'Photo: Mo Eid / Pexels',
  },
  /** Lone cork oak beside a misty country track — the road-trip image. */
  corkRoad: {
    src: corkRoadImg,
    alt: 'A lone cork oak beside a misty gravel road in the Portuguese countryside',
    credit: 'Photo: Luís Alvoeiro Quaresma / Unsplash',
  },
  /** The lake and stone tower folly in the Park of Pena, Sintra. */
  sintraPark: {
    src: sintraParkImg,
    alt: 'A small stone tower on a lake in the wooded Park of Pena, Sintra',
    credit: 'Photo: Alberto Frias / Unsplash',
  },
  /** Whitewashed lane with terracotta flowerpots in an Alentejo hill village. */
  alentejoVillage: {
    src: alentejoVillageImg,
    alt: 'A cobbled lane of whitewashed houses hung with terracotta flowerpots in an Alentejo hilltop village',
    credit: 'Photo: Carlos Machado / Pexels',
  },
  /** Two number 28 trams on a wet cobbled street in central Lisbon. */
  lisbonTrams: {
    src: lisbonTramsImg,
    alt: 'Two yellow number 28 trams and cars on a wet cobbled street in central Lisbon',
    credit: 'Photo: Lisa Fotios / Pexels',
  },
  /** Alfama rooftops and the Tagus from a Lisbon viewpoint. */
  lisbonAlfama: {
    src: lisbonAlfamaImg,
    alt: "Terracotta rooftops of Lisbon's Alfama district with the Tagus estuary beyond",
    credit: 'Photo: Skitterphoto / Pexels',
  },
  /** Terraced vineyards and a bend of the Douro river. */
  douroValley: {
    src: douroValleyImg,
    alt: 'Terraced vineyards on steep hillsides above a bend in the Douro river',
    credit: 'Photo: Andrew McLeod / Pexels',
  },
  /** Aerial of the red-and-yellow Pena Palace above the Sintra hills. */
  penaPalace: {
    src: penaPalaceImg,
    alt: 'Aerial view of the red and yellow Pena Palace on a wooded hilltop above Sintra',
    credit: 'Photo: Mylo Kaye / Pexels',
  },
  /** Coimbra hillside and the Jardim da Manga fountain at golden hour. */
  coimbra: {
    src: coimbraImg,
    alt: 'The hillside old town of Coimbra behind a domed garden fountain at golden hour',
    credit: 'Photo: Egor Kunovsky / Pexels',
  },
  /** Leaf-strewn forest track in the northern interior. */
  autumnForest: {
    src: autumnForestImg,
    alt: 'A leaf-strewn forest track running through autumn woodland in northern Portugal',
    credit: 'Photo: Luís Cardoso / Unsplash',
  },
  /** Old stone arch bridge and a waterfall in Peneda-Gerês. */
  geresBridge: {
    src: geresBridgeImg,
    alt: 'An old stone arch bridge beside a waterfall in the Peneda-Gerês mountains',
    credit: 'Photo: Natanael Vieira / Unsplash',
  },
  /** Colourful festival lane in Porto's Ribeira (portrait). */
  portoRibeira: {
    src: portoRibeiraImg,
    alt: "A stepped lane of colourful houses strung with festival bunting in Porto's Ribeira",
    credit: 'Photo: Petra Nesti / Pexels',
  },
  /** Satellite map showing the Portugal–Spain border. */
  portugalSpainMap: {
    src: portugalSpainMapImg,
    alt: 'Satellite map of the Iberian Peninsula with the Portugal–Spain border marked in yellow',
    credit: 'Imagery: Google Earth · Landsat / Copernicus, Data SIO, NOAA, U.S. Navy, NGA, GEBCO',
  },
  /** Golden Algarve cliffs, a cove and turquoise water near Lagos. */
  algarveCoast: {
    src: algarveCoastImg,
    alt: 'Golden sandstone cliffs, a small cove beach and turquoise water on the Algarve coast',
    credit: 'Photo: myersmc16 / Pexels',
  },
  /** Aerial of the Algarve cliff coast with clifftop villas and a track. */
  algarveCliffsAerial: {
    src: algarveCliffsAerialImg,
    alt: 'Aerial view of the Algarve cliff coast with sea stacks, boats and clifftop houses reached by a winding track',
    credit: 'Photo: Mo Eid / Pexels',
  },
  /** Algarve beach and sea stacks under a dusk sky. */
  algarveBeachDusk: {
    src: algarveBeachDuskImg,
    alt: 'Waves washing a sandy Algarve beach below ochre cliffs and sea stacks at dusk',
    credit: 'Photo: Ray Bilcliff / Pexels',
  },
} as const satisfies Record<string, HeroImage>;
