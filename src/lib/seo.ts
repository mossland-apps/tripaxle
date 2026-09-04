/**
 * One source of truth for page metadata and structured data.
 *
 * Pages describe themselves (title, description, type, dates, social image) and
 * this module turns that into canonical URLs, Open Graph / Twitter tags and
 * JSON-LD. Nothing here invents facts: the publisher entity is built only from
 * values that already exist in `src/config.ts` and `public/`.
 */
import { site } from '../config';

export type PageType = 'home' | 'guide' | 'hub' | 'about' | 'contact' | 'legal' | 'utility';

/** Page types that are editorial articles rather than site furniture. */
const ARTICLE_TYPES: readonly PageType[] = ['guide'];

/** Open Graph `og:type` for each page type. */
export function ogTypeFor(pageType: PageType): 'article' | 'website' {
  return ARTICLE_TYPES.includes(pageType) ? 'article' : 'website';
}

export function isArticleType(pageType: PageType): boolean {
  return ARTICLE_TYPES.includes(pageType);
}

/**
 * Production serves directory-style URLs, so every internal path is normalised
 * to the trailing-slash form. Keeps canonicals, sitemap entries, JSON-LD and
 * in-page links pointing at the same URL instead of a 308 hop.
 */
export function canonicalPath(pathname: string): string {
  if (!pathname.startsWith('/')) return pathname;
  const [pathAndQuery, ...hashRest] = pathname.split('#');
  const [path, ...queryRest] = pathAndQuery.split('?');
  // Leave files (anything with an extension) alone.
  const normalised = /\.[a-z0-9]+$/i.test(path) ? path : path.replace(/\/*$/, '/');
  const query = queryRest.length ? `?${queryRest.join('?')}` : '';
  const hash = hashRest.length ? `#${hashRest.join('#')}` : '';
  return `${normalised}${query}${hash}`;
}

/** Absolute production URL for an internal path. */
export function absoluteUrl(pathname: string): string {
  return new URL(canonicalPath(pathname), site.domain).href;
}

/** `2026-03-14` -> `2026-03-14T00:00:00.000Z`, timezone-safe. */
export function isoDate(date: string | Date): string {
  if (date instanceof Date) return date.toISOString();
  return new Date(date.length === 10 ? `${date}T00:00:00Z` : date).toISOString();
}

/** The publisher entity, assembled only from configured, real values. */
export function organizationLd() {
  return {
    '@type': 'Organization',
    '@id': `${site.domain}/#organization`,
    name: site.name,
    url: `${site.domain}/`,
    description: site.tagline,
    logo: {
      '@type': 'ImageObject',
      url: `${site.domain}/icon-512.png`,
      width: 512,
      height: 512,
    },
  };
}

export function websiteLd() {
  return {
    '@type': 'WebSite',
    '@id': `${site.domain}/#website`,
    name: site.name,
    url: `${site.domain}/`,
    description: site.tagline,
    inLanguage: 'en',
    publisher: { '@id': `${site.domain}/#organization` },
  };
}

export interface ArticleLdInput {
  path: string;
  headline: string;
  description?: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  datePublished?: string | Date;
  dateModified?: string | Date;
}

export function articleLd(input: ArticleLdInput) {
  const url = absoluteUrl(input.path);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'en',
    ...(input.image
      ? {
          image: {
            '@type': 'ImageObject',
            url: input.image.url,
            ...(input.image.width ? { width: input.image.width } : {}),
            ...(input.image.height ? { height: input.image.height } : {}),
            ...(input.image.alt ? { caption: input.image.alt } : {}),
          },
        }
      : {}),
    ...(input.datePublished ? { datePublished: isoDate(input.datePublished) } : {}),
    ...(input.dateModified ? { dateModified: isoDate(input.dateModified) } : {}),
    author: { '@id': `${site.domain}/#organization` },
    publisher: { '@id': `${site.domain}/#organization` },
  };
}

export interface Crumb {
  label: string;
  href?: string;
}

export function breadcrumbLd(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
}

/** Wrap one or more entities in a single `@graph` document. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
