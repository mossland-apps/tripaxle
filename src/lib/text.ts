/**
 * Small pure text helpers shared across the site.
 * Kept dependency-free so they can be unit-tested in isolation.
 */

/**
 * Turn a heading or phrase into a URL-safe anchor id.
 * Folds accented characters (Óbidos -> obidos), drops punctuation,
 * and collapses whitespace/symbols into single hyphens.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics -> hyphen
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Format a date as "August 2026" for the "Updated ..." line on guides.
 * Uses UTC so a plain "YYYY-MM-DD" string never slips to the previous
 * month in negative-offset timezones.
 */
export function formatUpdated(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date + (date.length === 10 ? 'T00:00:00Z' : '')) : date;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
