import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = (p: string) => resolve(process.cwd(), 'dist', p);
const read = (p: string) => readFileSync(dist(p), 'utf8');

beforeAll(() => {
  if (!existsSync(dist('index.html'))) {
    execSync('npx astro build', { stdio: 'inherit' });
  }
}, 120_000);

function allBuiltPages(): string[] {
  const out = ['index.html'];
  for (const entry of readdirSync(dist(''), { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(dist(`${entry.name}/index.html`))) {
      out.push(`${entry.name}/index.html`);
    }
  }
  return out;
}

describe('every built page', () => {
  const pages = allBuiltPages();

  it('built the whole sitemap (25+ pages)', () => {
    expect(pages.length).toBeGreaterThanOrEqual(25);
  });

  for (const page of pages) {
    it(`${page}: has the shared shell and the terracotta design system`, () => {
      const html = read(page);
      expect(html).toContain('class="site-header"');
      expect(html).toContain('class="site-footer"');
      // footer carries the About / policy links on every page
      for (const href of ['/about', '/contact', '/affiliate-disclosure', '/privacy', '/disclaimer']) {
        expect(html, `${page} footer missing ${href}`).toContain(`href="${href}"`);
      }
      // bundled design-system stylesheet is wired up
      expect(html).toMatch(/href="\/_astro\/[^"]+\.css"/);
      // Google Fonts (Fraunces serif headings)
      expect(html).toContain('Fraunces');
    });

    it(`${page}: never ships the commercial box while the affiliate switch is off`, () => {
      expect(read(page)).not.toContain('commercial-cta');
    });
  }
});

describe('footer', () => {
  let html = '';
  beforeAll(() => {
    html = read('about/index.html');
  });

  it('is a multi-column footer with Guides, Popular and TripAxle sections', () => {
    const footer = html.slice(html.indexOf('class="site-footer"'));
    expect(footer).toContain('>Guides<');
    expect(footer).toContain('>Popular<');
    expect(footer).toContain('>TripAxle<');
    expect(footer).toContain('href="/portugal-guide"');
    expect(footer).toContain('href="/portugal-car-rental-insurance"');
  });

  it('states editorial independence while the commercial switch is off', () => {
    const footer = html.slice(html.indexOf('class="site-footer__bottom"'));
    expect(footer).toMatch(/[Ee]ditorially independent/);
  });
});

describe('commercial / editorial policy', () => {
  it('the affiliate disclosure permits advertising and states the real promise', () => {
    const html = read('affiliate-disclosure/index.html');
    // monetisation is allowed and named
    expect(html).toMatch(/display advertising/i);
    expect(html).toMatch(/affiliate links/i);
    expect(html).toMatch(/sponsorship|sponsored/i);
    // the promise that survives
    expect(html).toMatch(/Payment does not buy TripAxle.?s editorial conclusions/i);
    expect(html).toMatch(/rel="sponsored"|rel=.sponsored./);
    // must NOT reinstate the over-broad bans
    expect(html).not.toMatch(/payment for coverage, placement,? or reviews/i);
    expect(html).not.toMatch(/no affiliate links and no advertising/i);
  });

  it('the contact page welcomes commercial enquiries', () => {
    const html = read('contact/index.html');
    expect(html).toMatch(/Media, advertising and partnerships/);
    expect(html).toMatch(/welcome enquiries about advertising/i);
    expect(html).not.toMatch(/will be\s+declined/i);
  });

  it('the about page explains monetisation without prohibiting advertising', () => {
    const html = read('about/index.html');
    expect(html).toMatch(/How TripAxle makes money/);
    expect(html).toMatch(/can carry advertising, affiliate\s+links/i);
    expect(html).not.toMatch(/the only commercial element/i);
  });
});

describe('policy pages', () => {
  const pages = {
    'about/index.html': [/how we research/i],
    'contact/index.html': [/contact form/i, /correction/i],
    'affiliate-disclosure/index.html': [/qualifying booking or transaction/i, /rel="sponsored"|rel=.sponsored./, /never/i],
    'privacy/index.html': [/no cookies|sets .*no.* cookies/i, /Google Fonts/, /Cloudflare/],
    'disclaimer/index.html': [/not.*(legal|professional).*advice/i, /as is/i, /out of date/i],
  };

  for (const [page, patterns] of Object.entries(pages)) {
    it(`${page} builds with the expected substance`, () => {
      const html = read(page);
      expect(html).toContain('aria-label="Breadcrumb"');
      for (const p of patterns) expect(html, `${page} missing ${p}`).toMatch(p);
    });
  }
});

describe('home page', () => {
  it('leads with the value proposition and links every hub', () => {
    const html = read('index.html');
    expect(html).toContain('Renting and driving a car in Portugal');
    for (const href of [
      '/portugal-guide',
      '/airport-rental-guides',
      '/booking-basics',
      '/practical-guides',
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
  });
});

describe('every guide article', () => {
  const guides = [
    'portugal-guide/index.html',
    'lisbon-airport-car-rental/index.html',
    'porto-airport-car-rental/index.html',
    'faro-airport-car-rental/index.html',
    'portugal-car-rental-insurance/index.html',
    'portugal-car-rental-with-debit/index.html',
    'portugal-car-rental-deposits-and-card-requirements/index.html',
    'portugal-toll-roads-for-rental-cars/index.html',
    'do-you-need-a-car-in-portugal/index.html',
    'where-a-rental-car-is-most-useful-in-portugal/index.html',
    'driving-in-portugal-what-to-expect/index.html',
    'broker-vs-direct-supplier-portugal-car-rental/index.html',
    'how-to-read-portugal-car-rental-terms/index.html',
    'common-car-rental-mistakes-portugal/index.html',
    'manual-vs-automatic-portugal/index.html',
    'what-to-photograph-rental-pickup/index.html',
    'flight-late-for-car-rental-pickup/index.html',
    'after-hours-car-rental-returns-portugal/index.html',
    'gasoleo-vs-gasolina-portugal/index.html',
    'portugal-rental-car-into-spain/index.html',
    'child-seats-and-extras-portugal/index.html',
  ];
  for (const g of guides) {
    it(`${g}: carries the full guide template`, () => {
      const html = read(g);
      expect(html).toContain('aria-label="Breadcrumb"');
      expect(html).toContain('BreadcrumbList');
      expect(html).toMatch(/Updated \w+ 20\d\d/);
      expect(html).toContain('quick-answer');
      expect(html).toContain('on-this-page');
      expect(html).toContain('How we research this guide');
      expect(html).toContain('related-guides');
      expect(html).toContain('"@type":"Article"');
    });
    it(`${g}: every on-this-page anchor resolves to a real section id`, () => {
      const html = read(g);
      const targets = [...html.matchAll(/class="on-this-page"[\s\S]*?<\/nav>/g)]
        .flatMap((m) => [...m[0].matchAll(/href="#([^"]+)"/g)].map((x) => x[1]));
      expect(targets.length).toBeGreaterThan(2);
      for (const id of targets) {
        expect(html, `missing id="${id}" in ${g}`).toContain(`id="${id}"`);
      }
    });
  }
});

describe('sitemap & crawl files', () => {
  it('generates a sitemap index that points at the live sitemap over https', () => {
    expect(existsSync(dist('sitemap-index.xml'))).toBe(true);
    const idx = read('sitemap-index.xml');
    expect(idx).toContain('<loc>https://tripaxle.com/sitemap-0.xml</loc>');
  });

  it('lists every built page in the sitemap with the correct live origin', () => {
    const xml = read('sitemap-0.xml');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    expect(locs.length).toBeGreaterThanOrEqual(25);
    expect(locs).toContain('https://tripaxle.com/');
    expect(locs).toContain('https://tripaxle.com/faro-airport-car-rental/');

    for (const loc of locs) {
      expect(loc, `bad sitemap URL: ${loc}`).toMatch(/^https:\/\/tripaxle\.com\//);
      expect(loc).not.toMatch(/localhost|readertweaks|127\.0\.0\.1/);
    }

    // one sitemap <url> per built HTML page
    const builtRoutes = allBuiltPages()
      .map((p) => (p === 'index.html' ? '/' : `/${p.replace(/index\.html$/, '')}`))
      .sort();
    const sitemapRoutes = locs
      .map((l) => l.replace('https://tripaxle.com', ''))
      .sort();
    expect(sitemapRoutes).toEqual(builtRoutes);
  });

  it('ships a robots.txt that allows crawling and advertises the sitemap', () => {
    expect(existsSync(dist('robots.txt'))).toBe(true);
    const robots = read('robots.txt');
    expect(robots).toMatch(/Allow:\s*\//);
    expect(robots).toContain('Sitemap: https://tripaxle.com/sitemap-index.xml');
  });

  it('redirects the conventional /sitemap.xml to the generated index', () => {
    expect(existsSync(dist('_redirects'))).toBe(true);
    expect(read('_redirects')).toMatch(
      /^\/sitemap\.xml\s+\/sitemap-index\.xml\s+30\d/m,
    );
  });

  it('has a real 404 page so unknown paths are not soft-200s', () => {
    expect(existsSync(dist('404.html'))).toBe(true);
    const html = read('404.html');
    expect(html).toContain('class="site-header"');
    expect(html).toMatch(/isn.t here|not found/i);
  });
});

describe('favicon', () => {
  it('ships every icon asset and links them from the shared head', () => {
    for (const f of [
      'favicon.ico',
      'favicon.svg',
      'favicon-mask.svg',
      'apple-touch-icon.png',
    ]) {
      expect(existsSync(dist(f)), `missing dist/${f}`).toBe(true);
    }
    const html = read('index.html');
    expect(html).toContain('href="/favicon.ico"');
    expect(html).toContain('rel="apple-touch-icon"');
    expect(html).toContain('name="theme-color"');
  });
});

describe('images', () => {
  it('every /images/*.jpg referenced in built HTML exists in public/images', () => {
    const pages = allBuiltPages();
    const missing = new Set<string>();
    for (const page of pages) {
      for (const m of read(page).matchAll(/\/images\/([a-z0-9-]+\.(?:jpg|jpeg|png|webp))/g)) {
        if (!existsSync(resolve(process.cwd(), 'public/images', m[1]))) {
          missing.add(`${page} -> /images/${m[1]}`);
        }
      }
    }
    expect([...missing]).toEqual([]);
  });
});

describe('internal links', () => {
  it('no page links to a route that was not built', () => {
    const builtRoutes = new Set(['/', '/about']);
    for (const entry of readdirSync(dist(''), { withFileTypes: true })) {
      if (entry.isDirectory() && existsSync(dist(`${entry.name}/index.html`))) {
        builtRoutes.add(`/${entry.name}`);
      }
    }

    const pages = readdirSync(dist(''), { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(dist(`${e.name}/index.html`)))
      .map((e) => `${e.name}/index.html`)
      .concat('index.html');

    const broken: string[] = [];
    for (const page of pages) {
      const html = read(page);
      for (const m of html.matchAll(/href="(\/[a-z0-9-]*(?:\/[a-z0-9-]+)*)\/?"/g)) {
        const route = m[1] === '' ? '/' : m[1];
        if (route.startsWith('/_') || route.startsWith('/images')) continue;
        if (!builtRoutes.has(route)) broken.push(`${page} -> ${route}`);
      }
    }
    expect(broken, `broken internal links:\n${broken.join('\n')}`).toEqual([]);
  });
});

describe('Lisbon airport guide (reference template)', () => {
  let html = '';
  beforeAll(() => {
    html = read('lisbon-airport-car-rental/index.html');
  });

  it('shows a breadcrumb trail with structured data', () => {
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain('BreadcrumbList');
    expect(html).toContain('href="/airport-rental-guides"');
  });

  it('shows the updated date', () => {
    expect(html).toContain('Updated August 2026');
  });

  it('shows a quick-answer box and an at-a-glance panel', () => {
    expect(html).toContain('quick-answer');
    expect(html).toContain('at-a-glance');
    expect(html).toContain('Humberto Delgado');
  });

  it('shows an on-this-page menu that targets real section ids', () => {
    expect(html).toContain('on-this-page');
    for (const id of ['rental-desks', 'off-airport', 'pickup', 'tolls']) {
      expect(html).toContain(`href="#${id}"`);
      expect(html).toContain(`id="${id}"`);
    }
  });

  it('renders a TripAxle tip callout', () => {
    expect(html).toContain('callout--tip');
    expect(html).toContain('TripAxle tip');
  });

  it('includes the how-we-research trust note and related guides', () => {
    expect(html).toContain('How we research this guide');
    expect(html).toContain('related-guides');
    expect(html).toContain('href="/porto-airport-car-rental"');
  });

  it('preserves the original operational content', () => {
    expect(html).toContain('Prior Velho');
    expect(html).toContain('Exit 4');
    expect(html).toContain('Via Verde');
    expect(html).toContain('Centauro');
  });

  it('carries Article structured data', () => {
    expect(html).toContain('"@type":"Article"');
  });
});
