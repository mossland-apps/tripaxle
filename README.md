# TripAxle

An independent guide to renting and driving a car in Portugal. Static Astro
site, no client-side JavaScript, deployed as plain HTML.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Production build, then the full vitest suite |

## How the site is put together

```text
src/
├── assets/images/     source photos — Astro's image pipeline emits AVIF/WebP variants
├── components/        QuickAnswer, Callout, OnThisPage, PageHero, Sources, …
├── layouts/           Layout (metadata + schema) → ArticleLayout / HubLayout / LegalLayout
├── lib/
│   ├── seo.ts         canonical URLs, og/twitter, JSON-LD builders
│   ├── sources.ts     the few authoritative links the time-sensitive guides cite
│   ├── images.ts      image manifest (key → imported asset + alt + credit)
│   ├── page-dates.mjs real per-route content dates, used for sitemap <lastmod>
│   └── text.ts        slugify / date formatting
└── pages/             one .astro file per route
```

### Metadata and structured data

Pages never write their own `<meta>` tags. They pass `title`, `description`,
`pageType`, `image` and dates to a layout, and `src/layouts/Layout.astro` emits
the canonical URL, Open Graph, Twitter card and a single JSON-LD `@graph`
containing `Organization` + `WebSite`, plus `Article` on guides.
`pageType` decides `og:type`, so only editorial guides claim to be articles.

Internal links are always written in the canonical trailing-slash form; the
test suite fails the build if one is not.

### Evidence, kept light

Most of the site is durable travel guidance and carries no citations at all.
Only four pages move fast enough to need them — the toll guide and the three
airport guides. Those pass `lastChecked` and two to five links from
`src/lib/sources.ts`, which render as one quiet line under the byline and one
plain Sources list at the foot of the page. There are no inline citation
markers, no per-page research notes and no verification banners; adding them
back would make the guides read like reference works rather than travel advice.

`updated` is the page's own content date and must match
`src/lib/page-dates.mjs`, which is what the sitemap's `<lastmod>` is built
from. `tests/seo.test.ts` fails if the two drift apart, and also fails if a
page outside those four grows a Sources section.

`src/pages/_unpublished/` holds pages withdrawn from the site; Astro does not
route anything under an underscore-prefixed folder.

### Images

Photos live in `src/assets/images/` and are referenced by key from
`src/lib/images.ts`. `PageHero` and `InlineFigure` route them through Astro's
`<Picture>` to emit AVIF and WebP at 480/768/1200 with intrinsic dimensions.
The above-the-fold hero is eager with `fetchpriority="high"`; everything else
is lazy. `scripts/process-photos.mjs` resizes new drops from `photos-from-you/`
into `src/assets/images/`.

### Fonts

Fraunces and Inter are self-hosted from `public/fonts/` (SIL OFL 1.1; licences
and provenance are in `public/fonts/README.md`). There is no request to
`fonts.googleapis.com` and no render-blocking third-party stylesheet.

## Tests

`tests/seo.test.ts` crawls the built `dist/` and fails on: a missing or
duplicated title, description, canonical or H1; an unintended `noindex`;
incomplete social metadata; an invalid social image; a mismatched `og:type`;
invalid JSON-LD; an internal link that would redirect; a skipped heading level;
an image without `alt`/`width`/`height`; a sitemap that disagrees with the
built routes or with `page-dates.mjs`; a Sources section on a page that should
not have one; a raw URL used as citation text; an inline citation marker or
research boilerplate on a guide; and duplicate navigation landmarks. Title and
description length only warn.

`tests/build.test.ts` covers the shared shell, footer, policy pages and
per-guide template; `tests/components.test.ts` renders components in isolation;
`tests/text.test.ts` covers the pure helpers.
