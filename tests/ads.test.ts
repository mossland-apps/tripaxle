import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  banners,
  bannerHref,
  bannerImageSrc,
  bannerPixelSrc,
  slugFor,
  withTag,
} from '../src/lib/ads';

const dist = (p: string) => resolve(process.cwd(), 'dist', p);
const read = (p: string) => readFileSync(dist(p), 'utf8');

beforeAll(() => {
  if (!existsSync(dist('index.html'))) {
    execSync('npx astro build', { stdio: 'inherit' });
  }
}, 120_000);

/* ------------------------------------------------------------------ */
/* Pure helpers                                                        */
/* ------------------------------------------------------------------ */

describe('ad helpers', () => {
  it('knows the three English banners exactly as the network issued them', () => {
    expect(banners.rectangle).toMatchObject({ bannerId: '61a4ac81', width: 601, height: 397 });
    expect(banners.leaderboard).toMatchObject({ bannerId: 'f29909e9', width: 728, height: 90 });
    expect(banners.wide).toMatchObject({ bannerId: '4414fbe0', width: 900, height: 150 });
  });

  it('turns a path into a stable tag slug', () => {
    expect(slugFor('/lisbon-airport-car-rental/')).toBe('lisbon-airport-car-rental');
    expect(slugFor('/portugal-guide')).toBe('portugal-guide');
    expect(slugFor('/')).toBe('home');
  });

  it('appends a tracking tag without disturbing the existing query', () => {
    expect(withTag('https://www.discovercars.com/?a_aid=TripAxle', 'faro_cta')).toBe(
      'https://www.discovercars.com/?a_aid=TripAxle&data1=faro_cta',
    );
    expect(withTag('https://www.discovercars.com/portugal', 'x')).toBe(
      'https://www.discovercars.com/portugal?data1=x',
    );
    expect(withTag('https://www.discovercars.com/', undefined)).toBe(
      'https://www.discovercars.com/',
    );
  });

  it('builds the click link from the affiliate id and banner id', () => {
    expect(bannerHref('rectangle', { tag: 'lisbon-airport-car-rental_rectangle' })).toBe(
      'https://www.discovercars.com/?a_aid=TripAxle&a_bid=61a4ac81&data1=lisbon-airport-car-rental_rectangle',
    );
    expect(bannerHref('leaderboard')).toBe(
      'https://www.discovercars.com/?a_aid=TripAxle&a_bid=f29909e9',
    );
  });

  it('can deep-link to a page on the partner site and keep the tracking', () => {
    expect(
      bannerHref('rectangle', { destination: 'https://www.discovercars.com/portugal/lisbon/lis' }),
    ).toBe('https://www.discovercars.com/portugal/lisbon/lis?a_aid=TripAxle&a_bid=61a4ac81');
  });

  it('serves banner images from this site by default, not from a third party', () => {
    expect(bannerImageSrc('rectangle')).toBe('/images/partners/discover-cars-601x397.jpg');
    expect(bannerImageSrc('leaderboard')).toBe('/images/partners/discover-cars-728x90.jpg');
    expect(bannerImageSrc('wide')).toBe('/images/partners/discover-cars-900x150.jpg');
  });

  it('keeps the network impression pixel available but off', () => {
    expect(bannerPixelSrc('rectangle')).toBe(
      'https://discover-car-hire.postaffiliatepro.com/scripts/iunyh71e?a_aid=TripAxle&a_bid=61a4ac81',
    );
  });
});

/* ------------------------------------------------------------------ */
/* The placement plan                                                  */
/* ------------------------------------------------------------------ */

type Format = 'rectangle' | 'leaderboard';

/** Banner units: route -> format. Everything not listed must carry none. */
const UNITS: Record<string, Format> = {
  'lisbon-airport-car-rental': 'rectangle',
  'faro-airport-car-rental': 'rectangle',
  'porto-airport-car-rental': 'rectangle',
  'portugal-guide': 'rectangle',
  'portugal-car-rental-with-debit': 'leaderboard',
  'portugal-car-rental-deposits-and-card-requirements': 'leaderboard',
  'portugal-rental-car-into-spain': 'leaderboard',
};

/** Pages that carry the "Ready to compare cars?" box at the end. */
const CTA_PAGES = new Set([
  'lisbon-airport-car-rental',
  'faro-airport-car-rental',
  'porto-airport-car-rental',
  'portugal-guide',
  'portugal-car-rental-insurance',
]);

function allSlugs(): string[] {
  return readdirSync(dist(''), { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(dist(`${e.name}/index.html`)))
    .map((e) => e.name);
}

const pageHtml = (slug: string) => read(`${slug}/index.html`);
const unitOf = (html: string) => {
  const start = html.indexOf('class="ad-slot ');
  if (start < 0) return '';
  const open = html.lastIndexOf('<aside', start);
  const close = html.indexOf('</aside>', start);
  return html.slice(open, close + '</aside>'.length);
};

describe('banner placement plan', () => {
  it('puts a banner on exactly the planned pages and nowhere else', () => {
    const withUnit = allSlugs().filter((s) => pageHtml(s).includes('class="ad-slot '));
    expect(withUnit.sort()).toEqual(Object.keys(UNITS).sort());
  });

  it('never puts a banner on the home page, hubs, policy pages or the 404', () => {
    for (const file of ['index.html', '404.html']) {
      expect(read(file), file).not.toContain('class="ad-slot ');
    }
    for (const slug of [
      'airport-rental-guides', 'booking-basics', 'practical-guides',
      'about', 'contact', 'affiliate-disclosure', 'privacy', 'disclaimer',
      'gasoleo-vs-gasolina-portugal', 'what-to-photograph-rental-pickup',
      'after-hours-car-rental-returns-portugal', 'flight-late-for-car-rental-pickup',
      'broker-vs-direct-supplier-portugal-car-rental',
    ]) {
      expect(pageHtml(slug), slug).not.toContain('class="ad-slot ');
    }
  });

  it('shows the end-of-guide "Ready to compare?" box on exactly five guides', () => {
    const withCta = allSlugs().filter((s) => pageHtml(s).includes('class="commercial-cta"'));
    expect(withCta.sort()).toEqual([...CTA_PAGES].sort());
  });

  for (const [slug, format] of Object.entries(UNITS)) {
    describe(`/${slug}/`, () => {
      const html = pageHtml(slug);
      const unit = unitOf(html);
      const banner = banners[format];

      it('has exactly one banner unit, in the planned format', () => {
        expect(html.split('class="ad-slot ').length - 1).toBe(1);
        expect(unit).toContain(`ad-slot--${format}`);
      });

      it('labels the unit as advertising', () => {
        expect(unit).toContain('Advertisement');
      });

      it('marks every link in the unit as sponsored, nofollow and noopener', () => {
        const links = [...unit.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
        expect(links.length).toBeGreaterThanOrEqual(1);
        for (const a of links) {
          expect(a).toContain('rel="sponsored nofollow noopener"');
          expect(a).toContain('target="_blank"');
          expect(a).toContain('href="https://www.discovercars.com/');
          expect(a).toContain('a_aid=TripAxle');
        }
      });

      it('credits the right banner and tags the placement for reporting', () => {
        expect(unit).toContain(`a_bid=${banner.bannerId}`);
        expect(unit).toContain(`data1=${slug}_${format}`);
      });

      it('uses the banner at its true size, lazily, with alt text', () => {
        const img = unit.match(/<img\b[^>]*>/)?.[0] ?? '';
        expect(img).toContain(`width="${banner.width}"`);
        expect(img).toContain(`height="${banner.height}"`);
        expect(img).toContain('loading="lazy"');
        expect(img).toMatch(/alt="[^"]*Discover Cars[^"]*"/);
        expect(img).toContain(`src="${bannerImageSrc(format)}"`);
      });

      it('sits after the Quick answer, never in the first screen', () => {
        expect(html.indexOf('class="ad-slot ')).toBeGreaterThan(html.indexOf('class="quick-answer"'));
        const before = html.slice(0, html.indexOf('class="ad-slot '));
        expect((before.match(/<h2\b/g) ?? []).length).toBeGreaterThanOrEqual(2);
      });
    });
  }

  it('places the large banner after the off-airport companies, before pickup', () => {
    for (const slug of ['lisbon-airport-car-rental', 'faro-airport-car-rental', 'porto-airport-car-rental']) {
      const html = pageHtml(slug);
      const ad = html.indexOf('class="ad-slot ');
      expect(ad, slug).toBeGreaterThan(html.indexOf('id="off-airport"'));
      expect(ad, slug).toBeLessThan(html.indexOf('id="pickup"'));
    }
  });

  it('places the Portugal Guide banner before the "Driving in Portugal" section', () => {
    const html = pageHtml('portugal-guide');
    const ad = html.indexOf('class="ad-slot ');
    expect(ad).toBeGreaterThan(html.indexOf('id="multi-stop"'));
    expect(ad).toBeLessThan(html.indexOf('id="driving-what-to-expect"'));
  });

  it('places end banners after the last section and before Related guides', () => {
    for (const [slug, format] of Object.entries(UNITS)) {
      if (format !== 'leaderboard') continue;
      const html = pageHtml(slug);
      const ad = html.indexOf('class="ad-slot ');
      const related = html.indexOf('class="related-guides"');
      expect(related, slug).toBeGreaterThan(ad);
      const lastH2 = html.lastIndexOf('<h2', ad);
      // the last heading before the unit is a content section, not the CTA box or Related
      expect(html.slice(lastH2, lastH2 + 60), slug).not.toContain('Related');
    }
  });

  it('offers phones a text button instead of the slim banner', () => {
    for (const [slug, format] of Object.entries(UNITS)) {
      if (format !== 'leaderboard') continue;
      const unit = unitOf(pageHtml(slug));
      expect(unit, slug).toContain('ad-slot__text');
      expect(unit, slug).toContain('Compare cars on Discover Cars');
    }
  });
});

/* ------------------------------------------------------------------ */
/* Privacy and performance                                             */
/* ------------------------------------------------------------------ */

describe('ads stay first-party', () => {
  it('loads no banner, script or pixel from the affiliate network on any page', () => {
    for (const file of ['index.html', '404.html', ...allSlugs().map((s) => `${s}/index.html`)]) {
      expect(read(file), file).not.toContain('postaffiliatepro.com');
    }
  });

  it('ships the banner images with the build', () => {
    for (const f of [
      'images/partners/discover-cars-601x397.jpg',
      'images/partners/discover-cars-728x90.jpg',
      'images/partners/discover-cars-900x150.jpg',
    ]) {
      expect(existsSync(dist(f)), f).toBe(true);
    }
  });

  it('lets browsers cache the banner artwork for a week', () => {
    const headers = read('_headers');
    expect(headers).toMatch(/\/images\/partners\/\*\s+Cache-Control: public, max-age=604800/);
  });

  it('adds no script, only ordinary links and images', () => {
    for (const slug of Object.keys(UNITS)) {
      expect(unitOf(pageHtml(slug)), slug).not.toMatch(/<script/i);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Disclosure stays truthful once ads are live                          */
/* ------------------------------------------------------------------ */

describe('disclosure matches reality', () => {
  it('the footer says the site carries advertising and affiliate links', () => {
    const html = read('about/index.html');
    const bottom = html.slice(html.indexOf('class="site-footer__bottom"'));
    expect(bottom).toMatch(/carries advertising and affiliate\s+links/);
  });

  it('the affiliate disclosure names the live partner and drops the "nothing live yet" line', () => {
    const html = read('affiliate-disclosure/index.html');
    expect(html).toContain('Discover Cars');
    expect(html).not.toMatch(/No advertising or affiliate links are live/i);
    expect(html).toMatch(/Advertisement/);
  });

  it('the privacy policy describes the banners and the affiliate click-through', () => {
    const html = read('privacy/index.html');
    expect(html).toContain('Discover Cars');
    expect(html).toMatch(/banner/i);
    expect(html).not.toMatch(/runs\s+<strong>no analytics, advertising, or tracking scripts/i);
  });
});
