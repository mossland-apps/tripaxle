import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

import Callout from '../src/components/Callout.astro';
import QuickAnswer from '../src/components/QuickAnswer.astro';
import Breadcrumbs from '../src/components/Breadcrumbs.astro';
import AtAGlance from '../src/components/AtAGlance.astro';
import OnThisPage from '../src/components/OnThisPage.astro';
import RelatedGuides from '../src/components/RelatedGuides.astro';
import CommercialCTA from '../src/components/CommercialCTA.astro';
import AdSlot from '../src/components/AdSlot.astro';

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('Callout', () => {
  it('defaults to a note with no forced title and renders slot content', async () => {
    const html = await container.renderToString(Callout, {
      slots: { default: 'Check your voucher.' },
    });
    expect(html).toContain('callout--note');
    expect(html).toContain('Check your voucher.');
  });

  it('labels the tip variant "TripAxle tip"', async () => {
    const html = await container.renderToString(Callout, {
      props: { variant: 'tip' },
      slots: { default: "Don't collect a car just to park it." },
    });
    expect(html).toContain('callout--tip');
    expect(html).toContain('TripAxle tip');
  });

  it('uses a custom title when provided', async () => {
    const html = await container.renderToString(Callout, {
      props: { variant: 'warning', title: 'Pay tolls within 5 days' },
      slots: { default: 'Otherwise fines follow the plate.' },
    });
    expect(html).toContain('callout--warning');
    expect(html).toContain('Pay tolls within 5 days');
  });
});

describe('QuickAnswer', () => {
  it('renders a labelled quick-answer box with slot content', async () => {
    const html = await container.renderToString(QuickAnswer, {
      slots: { default: 'Rent at the airport only if you are leaving Lisbon immediately.' },
    });
    expect(html).toContain('quick-answer');
    expect(html).toMatch(/quick answer/i);
    expect(html).toContain('leaving Lisbon immediately');
  });
});

describe('Breadcrumbs', () => {
  it('renders a trail and marks the last item as current', async () => {
    const html = await container.renderToString(Breadcrumbs, {
      props: {
        items: [
          { label: 'Portugal', href: '/portugal-guide/' },
          { label: 'Airports', href: '/airport-rental-guides/' },
          { label: 'Lisbon Airport' },
        ],
      },
    });
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain('href="/airport-rental-guides/"');
    expect(html).toContain('aria-current="page"');
    // structured data for search engines, always starting at Home
    expect(html).toContain('BreadcrumbList');
    expect(html).toContain('"name":"Home"');
    expect(html).toContain('"item":"https://tripaxle.com/"');
  });
});

describe('AtAGlance', () => {
  it('renders every label/value pair', async () => {
    const html = await container.renderToString(AtAGlance, {
      props: {
        items: [
          { label: 'Airport code', value: 'LIS' },
          { label: 'Rental desks', value: 'Terminal 1 Arrivals' },
        ],
      },
    });
    expect(html).toContain('Airport code');
    expect(html).toContain('LIS');
    expect(html).toContain('Terminal 1 Arrivals');
  });
});

describe('OnThisPage', () => {
  it('links each section by id', async () => {
    const html = await container.renderToString(OnThisPage, {
      props: {
        items: [
          { label: 'Rental desks', id: 'rental-desks' },
          { label: 'Documents', id: 'documents' },
        ],
      },
    });
    expect(html).toMatch(/on this page/i);
    expect(html).toContain('href="#rental-desks"');
    expect(html).toContain('href="#documents"');
  });
});

describe('RelatedGuides', () => {
  it('renders each related link', async () => {
    const html = await container.renderToString(RelatedGuides, {
      props: {
        links: [
          { label: 'Porto Airport Car Rental', href: '/porto-airport-car-rental' },
          { label: 'Portugal Toll Roads', href: '/portugal-toll-roads-for-rental-cars' },
        ],
      },
    });
    expect(html).toContain('href="/porto-airport-car-rental"');
    expect(html).toContain('Portugal Toll Roads');
  });
});

describe('CommercialCTA', () => {
  it('renders the end-of-guide box with a sponsored, tagged partner link', async () => {
    const html = await container.renderToString(CommercialCTA, {
      props: { heading: 'Ready to compare cars at Lisbon Airport?' },
    });
    expect(html).toContain('commercial-cta');
    expect(html).toContain('Ready to compare cars at Lisbon Airport?');
    expect(html).toContain('rel="sponsored nofollow noopener"');
    expect(html).toContain('a_aid=TripAxle');
    expect(html).toContain('data1=');
    expect(html).toContain('Compare cars on Discover Cars');
  });
});

describe('AdSlot', () => {
  it('renders a labelled, sponsored banner at its true size', async () => {
    const html = await container.renderToString(AdSlot, { props: { format: 'rectangle' } });
    expect(html).toContain('ad-slot--rectangle');
    expect(html).toContain('Advertisement');
    expect(html).toContain('rel="sponsored nofollow noopener"');
    expect(html).toContain('a_bid=61a4ac81');
    expect(html).toContain('width="601"');
    expect(html).toContain('height="397"');
    expect(html).toContain('loading="lazy"');
  });

  it('gives the slim leaderboard a text-button fallback for phones', async () => {
    const html = await container.renderToString(AdSlot, { props: { format: 'leaderboard' } });
    expect(html).toContain('ad-slot--leaderboard');
    expect(html).toContain('a_bid=f29909e9');
    expect(html).toContain('ad-slot__text');
    expect(html).toContain('Compare cars on Discover Cars');
  });

  it('falls back to the text button if the image is blocked or fails', async () => {
    const html = await container.renderToString(AdSlot, { props: { format: 'rectangle' } });
    expect(html).toMatch(/onerror="[^"]*ad-slot--text/);
  });

  it('deep-links to a partner page and keeps the tracking and the tag', async () => {
    const html = await container.renderToString(AdSlot, {
      props: {
        format: 'rectangle',
        destination: 'https://www.discovercars.com/portugal/faro/fao',
        tag: 'faro_test',
      },
    });
    expect(html).toContain('https://www.discovercars.com/portugal/faro/fao?a_aid=TripAxle');
    expect(html).toContain('data1=faro_test');
  });
});
