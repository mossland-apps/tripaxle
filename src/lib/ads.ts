/**
 * Banner advertising helpers.
 *
 * One place that knows the partner's three English banners and how to build a
 * tracked link for each. Pages never hand-write affiliate URLs: they drop in
 * <AdSlot format="..."/> and this module supplies everything else.
 */
import { site } from '../config';

export type BannerFormat = 'rectangle' | 'leaderboard' | 'wide';

interface Banner {
  /** The network's banner id, credited on every click. */
  bannerId: string;
  width: number;
  height: number;
  /** File name of our own copy under /images/partners/. */
  file: string;
}

/** Discover Cars' English banners, exactly as issued. */
export const banners: Record<BannerFormat, Banner> = {
  rectangle: { bannerId: '61a4ac81', width: 601, height: 397, file: 'discover-cars-601x397.jpg' },
  leaderboard: { bannerId: 'f29909e9', width: 728, height: 90, file: 'discover-cars-728x90.jpg' },
  wide: { bannerId: '4414fbe0', width: 900, height: 150, file: 'discover-cars-900x150.jpg' },
};

/**
 * Landing pages on the partner site that match our guides. Each was checked to
 * exist on discovercars.com, and the network's own "Dynamic link" tool produced
 * the same tracked URLs for them.
 */
export const destinations = {
  portugal: `${site.partner.origin}/portugal`,
  lisbon: `${site.partner.origin}/portugal/lisbon/lis`,
  porto: `${site.partner.origin}/portugal/porto/opo`,
  faro: `${site.partner.origin}/portugal/faro/fao`,
} as const;

/** "/lisbon-airport-car-rental/" -> "lisbon-airport-car-rental"; "/" -> "home". */
export function slugFor(pathname: string): string {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  return slug === '' ? 'home' : slug;
}

/**
 * Add a per-placement tag (the network's "data1" parameter) so the affiliate
 * reports can show which page and slot produced a click.
 */
export function withTag(url: string, tag?: string): string {
  if (!tag) return url;
  return `${url}${url.includes('?') ? '&' : '?'}data1=${encodeURIComponent(tag)}`;
}

/**
 * The tracked click link for a banner. `destination` deep-links to any page on
 * the partner site (default: its home page); the tracking is the same.
 */
export function bannerHref(
  format: BannerFormat,
  opts: { tag?: string; destination?: string } = {},
): string {
  const { affiliateId, origin } = site.partner;
  const destination = opts.destination ?? `${origin}/`;
  const base = `${destination}${destination.includes('?') ? '&' : '?'}a_aid=${affiliateId}&a_bid=${banners[format].bannerId}`;
  return withTag(base, opts.tag);
}

/**
 * A tracked plain-text link (no banner id) to a partner page, for buttons.
 * With no destination it is the partner's home page, i.e. the general link.
 */
export function partnerLink(destination?: string, tag?: string): string {
  const { origin, affiliateId } = site.partner;
  const base = destination ?? `${origin}/`;
  return withTag(`${base}${base.includes('?') ? '&' : '?'}a_aid=${affiliateId}`, tag);
}

/** Where the banner artwork is loaded from. */
export function bannerImageSrc(format: BannerFormat): string {
  const { bannerId, file } = banners[format];
  return site.partner.selfHostBanners
    ? `/images/partners/${file}`
    : `${site.partner.imageBase}/${bannerId}.jpg`;
}

/** The network's impression pixel for a banner (only rendered when enabled). */
export function bannerPixelSrc(format: BannerFormat): string {
  return `${site.partner.pixelBase}?a_aid=${site.partner.affiliateId}&a_bid=${banners[format].bannerId}`;
}
