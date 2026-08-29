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
      expect(html).toContain('Why trust TripAxle');
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
