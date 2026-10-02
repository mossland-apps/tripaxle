/**
 * Real last-modified dates per route, used for sitemap `<lastmod>`.
 *
 * Plain `.mjs` so `astro.config.mjs` can import it directly. A date here is the
 * day the page's *content* last changed, never the build time.
 *
 * A guide's visible "Updated ..." line is the human-facing copy of the same
 * fact; `tests/seo.test.ts` fails if the two ever drift apart.
 */
export const pageDates = {
  '/': '2026-08-30',

  // Guides
  '/portugal-guide/': '2026-07-01',
  '/do-you-need-a-car-in-portugal/': '2026-07-01',
  '/where-a-rental-car-is-most-useful-in-portugal/': '2026-07-01',
  '/driving-in-portugal-what-to-expect/': '2026-07-01',
  '/lisbon-airport-car-rental/': '2026-08-15',
  '/porto-airport-car-rental/': '2026-05-01',
  '/faro-airport-car-rental/': '2026-03-16',
  '/portugal-car-rental-insurance/': '2026-05-02',
  '/portugal-car-rental-deposits-and-card-requirements/': '2026-05-02',
  '/portugal-car-rental-with-debit/': '2026-03-16',
  '/how-to-read-portugal-car-rental-terms/': '2026-04-25',
  '/broker-vs-direct-supplier-portugal-car-rental/': '2026-04-25',
  '/common-car-rental-mistakes-portugal/': '2026-04-25',
  '/portugal-toll-roads-for-rental-cars/': '2026-03-14',
  '/manual-vs-automatic-portugal/': '2026-04-01',
  '/what-to-photograph-rental-pickup/': '2026-03-24',
  '/flight-late-for-car-rental-pickup/': '2026-03-24',
  '/after-hours-car-rental-returns-portugal/': '2026-03-24',
  '/gasoleo-vs-gasolina-portugal/': '2026-03-15',
  '/portugal-rental-car-into-spain/': '2026-04-02',
  '/child-seats-and-extras-portugal/': '2026-04-02',

  // Hubs
  '/airport-rental-guides/': '2026-08-30',
  '/booking-basics/': '2026-08-30',
  '/practical-guides/': '2026-08-30',

  // About and policy
  '/about/': '2026-08-30',
  '/contact/': '2026-08-30',
  '/affiliate-disclosure/': '2026-10-02',
  '/privacy/': '2026-10-02',
  '/disclaimer/': '2026-08-30',
};
