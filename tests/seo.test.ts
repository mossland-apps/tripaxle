import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pageDates } from '../src/lib/page-dates.mjs';

const ORIGIN = 'https://tripaxle.com';
const dist = (p: string) => resolve(process.cwd(), 'dist', p);
const read = (p: string) => readFileSync(dist(p), 'utf8');

beforeAll(() => {
  if (!existsSync(dist('index.html'))) {
    execSync('npx astro build', { stdio: 'inherit' });
  }
}, 180_000);

/** Every built page that represents an indexable route. */
function routes(): { route: string; file: string }[] {
  const out = [{ route: '/', file: 'index.html' }];
  for (const entry of readdirSync(dist(''), { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(dist(`${entry.name}/index.html`))) {
      out.push({ route: `/${entry.name}/`, file: `${entry.name}/index.html` });
    }
  }
  return out;
}

const all = (html: string, re: RegExp) => [...html.matchAll(re)].map((m) => m[1]);
const one = (html: string, re: RegExp) => {
  const m = html.match(re);
  return m ? m[1] : '';
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

describe('SEO metadata', () => {
  const pages = routes();

  it('finds every indexable route', () => {
    expect(pages.length).toBeGreaterThanOrEqual(25);
  });

  for (const { route, file } of pages) {
    describe(route, () => {
      const html = read(file);

      it('has exactly one non-empty title', () => {
        const titles = all(html, /<title>([^<]*)<\/title>/g);
        expect(titles.length).toBe(1);
        expect(titles[0].trim().length).toBeGreaterThan(10);
      });

      it('has exactly one non-empty meta description', () => {
        const descs = all(html, /<meta name="description" content="([^"]*)"/g);
        expect(descs.length).toBe(1);
        expect(descs[0].trim().length).toBeGreaterThan(50);
      });

      it('has exactly one self-referencing absolute canonical', () => {
        const canons = all(html, /<link rel="canonical" href="([^"]*)"/g);
        expect(canons.length).toBe(1);
        expect(canons[0]).toBe(`${ORIGIN}${route}`);
      });

      it('has exactly one H1', () => {
        expect(all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g).length).toBe(1);
      });

      it('is not accidentally noindexed', () => {
        expect(html).not.toMatch(/<meta name="robots"[^>]*noindex/);
      });

      it('has complete Open Graph metadata with an absolute raster image', () => {
        for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) {
          const values = all(html, new RegExp(`<meta property="${prop}" content="([^"]*)"`, 'g'));
          expect(values.length, `${prop} should appear once`).toBe(1);
          expect(values[0].length).toBeGreaterThan(0);
        }
        const image = one(html, /<meta property="og:image" content="([^"]*)"/);
        expect(image.startsWith(`${ORIGIN}/`)).toBe(true);
        expect(image).toMatch(/\.(jpe?g|png|webp)$/);
        expect(one(html, /<meta property="og:url" content="([^"]*)"/)).toBe(`${ORIGIN}${route}`);
      });

      it('has complete Twitter card metadata', () => {
        expect(one(html, /<meta name="twitter:card" content="([^"]*)"/)).toBe('summary_large_image');
        for (const name of ['twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) {
          expect(all(html, new RegExp(`<meta name="${name}" content="([^"]*)"`, 'g')).length).toBe(1);
        }
      });

      it('uses an og:type that matches the kind of page', () => {
        const types = all(html, /<meta property="og:type" content="([^"]*)"/g);
        expect(types.length).toBe(1);
        expect(['website', 'article']).toContain(types[0]);
        // Only editorial guides carry Article schema, and only they claim og:type=article.
        const isArticle = html.includes('"@type":"Article"');
        expect(types[0]).toBe(isArticle ? 'article' : 'website');
      });

      it('emits only valid JSON-LD', () => {
        const blocks = all(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g);
        expect(blocks.length).toBeGreaterThan(0);
        for (const block of blocks) {
          expect(() => JSON.parse(block)).not.toThrow();
        }
      });

      it('links only to canonical trailing-slash internal URLs', () => {
        const offenders = all(html, /href="(\/[a-z0-9][a-z0-9-/]*)"/g).filter(
          (href) =>
            !href.endsWith('/') && !href.startsWith('/_') && !/\.[a-z0-9]+$/i.test(href),
        );
        expect(offenders, `${route} links to non-canonical paths`).toEqual([]);
      });

      it('has a heading hierarchy that never skips a level', () => {
        const levels = all(html, /<(h[1-6])[^>]*>/g).map((h) => Number(h[1]));
        for (let i = 1; i < levels.length; i += 1) {
          expect(
            levels[i] - levels[i - 1],
            `${route} jumps from h${levels[i - 1]} to h${levels[i]}`,
          ).toBeLessThanOrEqual(1);
        }
      });

      it('gives every image an alt attribute and intrinsic dimensions', () => {
        for (const attrs of all(html, /<img\b([^>]*)>/g)) {
          expect(attrs, `${route} has an <img> without alt`).toMatch(/\balt="/);
          expect(attrs, `${route} has an <img> without width`).toMatch(/\bwidth="/);
          expect(attrs, `${route} has an <img> without height`).toMatch(/\bheight="/);
        }
      });

      it('warns when the title or description is likely to truncate', () => {
        const title = one(html, /<title>([^<]*)<\/title>/);
        const desc = one(html, /<meta name="description" content="([^"]*)"/);
        // Length is a warning, not a failure: message quality beats character count.
        if (title.length > 62) console.warn(`[seo] long title (${title.length}) on ${route}: ${title}`);
        if (desc.length > 165) console.warn(`[seo] long description (${desc.length}) on ${route}`);
        expect(title.length).toBeLessThan(120);
        expect(desc.length).toBeLessThan(320);
      });
    });
  }
});

describe('structured data', () => {
  function graphNodes(html: string): Record<string, unknown>[] {
    const blocks = all(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g);
    return blocks.flatMap((b) => {
      const parsed = JSON.parse(b);
      return (parsed['@graph'] ?? [parsed]) as Record<string, unknown>[];
    });
  }

  it('the home page declares WebSite and Organization', () => {
    const types = graphNodes(read('index.html')).map((n) => n['@type']);
    expect(types).toContain('WebSite');
    expect(types).toContain('Organization');
  });

  it('the publisher entity carries a real logo that ships in the build', () => {
    const org = graphNodes(read('index.html')).find((n) => n['@type'] === 'Organization') as any;
    expect(org.url).toBe(`${ORIGIN}/`);
    expect(org.logo.url).toBe(`${ORIGIN}/icon-512.png`);
    expect(existsSync(dist('icon-512.png'))).toBe(true);
  });

  it('every guide Article is complete and truthful', () => {
    for (const { route, file } of routes()) {
      const html = read(file);
      const article = graphNodes(html).find((n) => n['@type'] === 'Article') as any;
      if (!article) continue;
      expect(article.headline, route).toBeTruthy();
      expect(article.url, route).toBe(`${ORIGIN}${route}`);
      expect(article.mainEntityOfPage['@id'], route).toBe(`${ORIGIN}${route}`);
      expect(article.dateModified, route).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(article.publisher['@id'], route).toBe(`${ORIGIN}/#organization`);
      expect(article.image.url, route).toMatch(new RegExp(`^${ORIGIN}/.*\\.jpe?g$`));
      // dateModified must never precede datePublished
      if (article.datePublished) {
        expect(new Date(article.dateModified).getTime(), route).toBeGreaterThanOrEqual(
          new Date(article.datePublished).getTime(),
        );
      }
    }
  });

  it('every breadcrumb trail starts at Home and matches the rendered trail', () => {
    for (const { route, file } of routes()) {
      if (route === '/') continue;
      const html = read(file);
      const crumbs = graphNodes(html).find((n) => n['@type'] === 'BreadcrumbList') as any;
      expect(crumbs, `${route} has no BreadcrumbList`).toBeTruthy();
      expect(crumbs.itemListElement[0].name, route).toBe('Home');
      expect(crumbs.itemListElement[0].item, route).toBe(`${ORIGIN}/`);
      // Every linked crumb is an absolute canonical URL that the site renders.
      for (const item of crumbs.itemListElement) {
        if (item.item) expect(item.item, route).toMatch(/^https:\/\/tripaxle\.com\/[a-z0-9-]*\/?$/);
      }
      // The rendered trail carries the same number of steps.
      const nav = html.slice(html.indexOf('aria-label="Breadcrumb"'));
      const rendered = (nav.slice(0, nav.indexOf('</nav>')).match(/<li>/g) ?? []).length;
      expect(rendered, `${route} breadcrumb trail length`).toBe(crumbs.itemListElement.length);
    }
  });
});

describe('sitemap', () => {
  const xml = () => read('sitemap-0.xml');

  it('contains every indexable route and nothing else', () => {
    const locs = all(xml(), /<loc>([^<]+)<\/loc>/g).sort();
    const built = routes().map((r) => `${ORIGIN}${r.route}`).sort();
    expect(locs).toEqual(built);
  });

  it('excludes the 404 page', () => {
    expect(xml()).not.toContain('/404');
  });

  it('gives every URL a meaningful lastmod, not the build time', () => {
    const today = new Date().toISOString().slice(0, 10);
    const entries = [...xml().matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g)];
    expect(entries.length).toBeGreaterThan(0);
    for (const [block, loc] of entries) {
      const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
      const route = loc.replace(ORIGIN, '');
      expect(lastmod, `${route} has no lastmod`).toBeTruthy();
      // The date must come from page-dates.mjs, which records content changes.
      expect(lastmod!.slice(0, 10), route).toBe((pageDates as Record<string, string>)[route]);
      expect(lastmod!.slice(0, 10) <= today, `${route} lastmod is in the future`).toBe(true);
    }
  });

  it('records a date for every built route', () => {
    const missing = routes()
      .map((r) => r.route)
      .filter((r) => !(r in (pageDates as Record<string, string>)));
    expect(missing, 'routes missing from src/lib/page-dates.mjs').toEqual([]);
  });
});

/** The only pages whose facts move fast enough to need citing. */
const TIME_SENSITIVE: Record<string, string> = {
  '/portugal-toll-roads-for-rental-cars/': 'Last checked 3 September 2026',
  '/lisbon-airport-car-rental/': 'Last checked 15 August 2026',
  '/porto-airport-car-rental/': 'Last checked 1 May 2026',
  '/faro-airport-car-rental/': 'Last checked 16 March 2026',
};

describe('evidence, kept deliberately light', () => {
  it("each guide's visible Updated line matches its recorded sitemap date", () => {
    for (const { route, file } of routes()) {
      const html = read(file);
      const shown = html.match(/Updated (\w+ 20\d\d)</)?.[1];
      if (!shown) continue;
      const recorded = (pageDates as Record<string, string>)[route];
      const [y, m] = recorded.split('-');
      expect(shown, `${route} shows "${shown}" but page-dates says ${recorded}`).toBe(
        `${MONTHS[Number(m) - 1]} ${y}`,
      );
    }
  });

  it('only the time-sensitive guides carry a Sources section', () => {
    for (const { route, file } of routes()) {
      const hasSources = read(file).includes('class="sources"');
      expect(hasSources, `${route} sources section`).toBe(route in TIME_SENSITIVE);
    }
  });

  it('each of those has one Last checked line and two to five links', () => {
    for (const [route, line] of Object.entries(TIME_SENSITIVE)) {
      const html = read(`${route.slice(1)}index.html`);
      expect((html.match(/Last checked/g) ?? []).length, route).toBe(1);
      expect(html, route).toContain(line);

      const i = html.indexOf('class="sources"');
      const section = html.slice(i, html.indexOf('</section>', i));
      const links = all(section, /<a href="(https?:\/\/[^"]+)"/g);
      expect(links.length, `${route} source count`).toBeGreaterThanOrEqual(2);
      expect(links.length, `${route} source count`).toBeLessThanOrEqual(5);
      // Authoritative citations are followable, and never a bare URL as link text.
      expect(section, route).not.toMatch(/nofollow/);
      for (const label of all(section, /<a [^>]*>([\s\S]*?)<\/a>/g)) {
        expect(label.replace(/<[^>]+>/g, '').trim(), route).not.toMatch(/^https?:\/\//);
      }
    }
  });

  it('carries no inline citation markers or research boilerplate anywhere', () => {
    for (const { route, file } of routes()) {
      const html = read(file);
      expect(html, `${route} has an inline citation marker`).not.toMatch(/\[\d+\]/);
      // The home page and About have always pointed at how the site is
      // researched; what must not come back is the block that the SEO pass
      // repeated at the foot of every guide.
      if (!html.includes('"@type":"Article"')) continue;
      expect(html, `${route} has research boilerplate`).not.toMatch(
        /How we research|How this guide is checked|Facts last verified/,
      );
    }
  });
});

describe('crawlable without JavaScript', () => {
  it('ships no render-blocking third-party stylesheet and no client bundle', () => {
    const html = read('portugal-guide/index.html');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toMatch(/<script(?![^>]*application\/ld\+json)[^>]*src=/);
  });

  it('serves the full article, sources and navigation in the initial HTML', () => {
    const html = read('portugal-toll-roads-for-rental-cars/index.html');
    for (const needle of [
      'class="quick-answer"',
      'class="sources"',
      'aria-label="Breadcrumb"',
      'class="site-footer"',
    ]) {
      expect(html).toContain(needle);
    }
  });

  it('adds no AI-only file, meta tag or hidden summary', () => {
    expect(existsSync(dist('llms.txt'))).toBe(false);
    const html = read('index.html');
    expect(html).not.toMatch(/<meta name="(ai|llm|gpt)[^"]*"/i);
  });
});

describe('accessibility invariants', () => {
  it('every page offers a skip link and a labelled main landmark', () => {
    for (const { route, file } of routes()) {
      const html = read(file);
      expect(html, route).toContain('class="skip-link"');
      expect(html, route).toMatch(/<main[^>]*id="main"/);
    }
  });

  it('footer group labels are not headings', () => {
    const footer = read('index.html').slice(read('index.html').indexOf('class="site-footer"'));
    expect(footer).not.toMatch(/<h2/);
    expect(footer).toContain('site-footer__label');
    expect(footer).toMatch(/aria-labelledby="footer-/);
  });

  it('never renders two identical in-page navigation landmarks', () => {
    for (const { route, file } of routes()) {
      const labels = all(read(file), /<nav[^>]*aria-label="([^"]*)"/g);
      expect(new Set(labels).size, `${route} has duplicate nav labels: ${labels}`).toBe(labels.length);
    }
  });
});
