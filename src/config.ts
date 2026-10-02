/**
 * Site-wide settings. One place to change cross-cutting things.
 */
export const site = {
  name: 'TripAxle',
  domain: 'https://tripaxle.com',
  tagline: 'Independent Portugal car rental guidance for smarter trips.',

  /**
   * Master switch for every commercial unit: the banner ads, the end-of-guide
   * "Ready to compare cars?" box, and the footer's advertising disclosure.
   * Turn it off and all of them disappear together.
   */
  showCommercialCTA: true,

  /** The live affiliate partner (Discover Cars, via Post Affiliate Pro). */
  partner: {
    name: 'Discover Cars',
    /** The merchant site; every tracked link starts here. */
    origin: 'https://www.discovercars.com',
    /** Our affiliate id on the partner's programme. */
    affiliateId: 'TripAxle',
    /** The panel's "general affiliate link", used for plain text buttons. */
    url: 'https://www.discovercars.com/?a_aid=TripAxle',
    /**
     * Serve banner artwork from this site (no outside request when a page is
     * viewed). Set to false to hotlink the network's own copies instead.
     */
    selfHostBanners: true,
    /**
     * The network's 1x1 impression pixel. Off: it would load from the
     * network on every view. Commissions are credited from the click.
     */
    impressionPixel: false,
    /** Where the network serves the artwork and counts impressions. */
    imageBase: 'https://discover-car-hire.postaffiliatepro.com/accounts/default1/bunyh71e',
    pixelBase: 'https://discover-car-hire.postaffiliatepro.com/scripts/iunyh71e',
  },

  /** Default "Updated ..." date for guides that don't set their own. */
  defaultUpdated: '2026-08-01',

  /** Effective / last-reviewed date shown on the policy pages. */
  legalUpdated: '2026-08-30',

  /** Plain-English trust copy, reused in the footer and About page. */
  trust: {
    whyTrust:
      'TripAxle is an independent guide. We are not a rental company or a booking site, and we do not sell favourable reviews, recommendations, or rankings. Our aim is simply to help English-speaking travelers understand how renting and driving a car in Portugal actually works.',
    howWeResearch:
      'Guidance is based on airport and rental-company information, published rental terms, and patterns travelers report again and again. Details like desk locations, shuttle points, and fees change, so we always tell you what to confirm on your own booking before you travel.',
  },
} as const;

/** Primary navigation, shared by the header. */
export const nav = [
  { label: 'Portugal Guide', href: '/portugal-guide/' },
  { label: 'Airport Rental Guides', href: '/airport-rental-guides/' },
  { label: 'Booking Basics', href: '/booking-basics/' },
  { label: 'Practical Guides', href: '/practical-guides/' },
] as const;

/** Most-read individual guides, surfaced in the footer. */
export const popularGuides = [
  { label: 'Do you need a car in Portugal?', href: '/do-you-need-a-car-in-portugal/' },
  { label: 'Car rental insurance explained', href: '/portugal-car-rental-insurance/' },
  { label: 'Renting with a debit card', href: '/portugal-car-rental-with-debit/' },
  { label: 'Toll roads for rental cars', href: '/portugal-toll-roads-for-rental-cars/' },
  { label: 'Lisbon Airport car rental', href: '/lisbon-airport-car-rental/' },
] as const;

/** About / policy pages, shown in the footer. */
export const siteNav = [
  { label: 'About TripAxle', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Affiliate Disclosure', href: '/affiliate-disclosure/' },
  { label: 'Privacy Policy', href: '/privacy/' },
  { label: 'Disclaimer', href: '/disclaimer/' },
] as const;
