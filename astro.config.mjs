// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { pageDates } from './src/lib/page-dates.mjs';

const SITE = 'https://tripaxle.com';

/** Routes that must never appear in the sitemap. */
const EXCLUDED = new Set(['/404/', '/404']);

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.has(new URL(page).pathname),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const lastmod = pageDates[path];
        // Real content dates only — never the build timestamp. A route with no
        // recorded date is emitted without <lastmod> rather than with a lie.
        return lastmod ? { ...item, lastmod: `${lastmod}T00:00:00+00:00` } : item;
      },
    }),
  ],
});
