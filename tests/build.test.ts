import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = (p: string) => resolve(process.cwd(), 'dist', p);
const read = (p: string) => readFileSync(dist(p), 'utf8');

beforeAll(() => {
  if (!existsSync(dist('index.html'))) {
    execSync('npx astro build', { stdio: 'inherit' });
  }
}, 120_000);

describe('every built page', () => {
  const pages = [
    'index.html',
    'about/index.html',
    'portugal-guide/index.html',
    'airport-rental-guides/index.html',
    'booking-basics/index.html',
    'practical-guides/index.html',
    'lisbon-airport-car-rental/index.html',
    'porto-airport-car-rental/index.html',
    'faro-airport-car-rental/index.html',
    'portugal-car-rental-insurance/index.html',
    'portugal-car-rental-with-debit/index.html',
    'portugal-car-rental-deposits-and-card-requirements/index.html',
    'portugal-toll-roads-for-rental-cars/index.html',
  ];

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
