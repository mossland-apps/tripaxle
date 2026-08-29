/**
 * Site-wide settings. One place to change cross-cutting things.
 */
export const site = {
  name: 'TripAxle',
  domain: 'https://tripaxle.com',
  tagline: 'Independent Portugal car rental guidance for smarter trips.',

  /**
   * Master switch for the "Ready to compare cars?" commercial box.
   * Stays off until an affiliate partner is chosen; flip to true and set
   * `partner` below to turn it on across every page at once.
   */
  showCommercialCTA: false,
  partner: {
    name: '',
    url: '',
  },

  /** Default "Updated ..." date for guides that don't set their own. */
  defaultUpdated: '2026-08-01',

  /** Plain-English trust copy, reused in the footer and About page. */
  trust: {
    whyTrust:
      'TripAxle is an independent guide. We are not a rental company or a booking site, and we do not rank companies or publish paid reviews. Our aim is simply to help English-speaking travelers understand how renting and driving a car in Portugal actually works.',
    howWeResearch:
      'Guidance is based on airport and rental-company information, published rental terms, and patterns travelers report again and again. Details like desk locations, shuttle points, and fees change, so we always tell you what to confirm on your own booking before you travel.',
  },
} as const;

/** Primary navigation, shared by the header. */
export const nav = [
  { label: 'Portugal Guide', href: '/portugal-guide' },
  { label: 'Airport Rental Guides', href: '/airport-rental-guides' },
  { label: 'Booking Basics', href: '/booking-basics' },
  { label: 'Practical Guides', href: '/practical-guides' },
] as const;
