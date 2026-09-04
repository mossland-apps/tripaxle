/**
 * The handful of authoritative pages the time-sensitive guides link to.
 *
 * Only tolls and the airport operator listings change often enough to need
 * citing; everything else on the site is durable travel guidance and carries
 * no source list at all.
 */
import type { Source } from '../components/Sources.astro';

export const sources = {
  lei37: {
    publisher: 'Diário da República',
    title: 'Lei n.º 37/2024 — motorway tolls eliminated from 1 January 2025',
    url: 'https://files.diariodarepublica.pt/1s/2024/08/15200/0001300014.pdf',
  },
  ptTolls: {
    publisher: 'Infraestruturas de Portugal',
    title: 'PT Tolls — toll systems and payment methods',
    url: 'https://www.pttolls.com/en/',
  },
  anaLisbon: {
    publisher: 'ANA Aeroportos',
    title: 'Lisbon Airport — rent a car',
    url: 'https://www.ana.pt/en/lis/transport-parking/rent-a-car/rent-a-car',
  },
  anaPorto: {
    publisher: 'ANA Aeroportos',
    title: 'Porto Airport — rent a car',
    url: 'https://www.ana.pt/en/opo/transport-parking/rent-a-car/rent-a-car',
  },
  anaFaro: {
    publisher: 'ANA Aeroportos',
    title: 'Faro Airport — rent a car',
    url: 'https://www.ana.pt/en/fao/transport-parking/rent-a-car/rent-a-car',
  },
} as const satisfies Record<string, Source>;

export function cite(...keys: (keyof typeof sources)[]): Source[] {
  return keys.map((k) => sources[k]);
}
