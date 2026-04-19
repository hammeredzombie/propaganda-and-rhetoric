# Content — articles and ads

This is the file you'll touch most during the jam.

## Articles

All article data lives in a single file: **`game/articles.js`**.
No CMS, no JSON fetching, no folder-per-article. One array, one
source of truth.

### Schema

```js
{
  id: 'cabinet-shuffle',             // URL-safe, unique, stable
  section: 'Politics',               // Rendered as eyebrow
  headline: '...',                   // Card headline
  dek: '...',                        // Subhead / deck
  byline: 'M. Delacroix',            // Author name
  role: 'Capitol Correspondent',     // Optional; empty string hides it
  date: 'April 18',                  // Display date
  readTime: '4 min read',            // Optional
  image: 'front steps of a gov…',    // Placeholder caption
  body: [                            // Array of paragraphs
    'First paragraph…',
    'Second…'
  ],
  pullquote: {                       // Optional
    quote: '“…”',
    attribution: 'Source'
  }
}
```

### Add an article

1. Append a new object to the `articles` array in `articles.js`.
2. Give it a unique `id` — stable handle used by game state.
3. That's it. It will appear on the front page automatically, unless
   you want a specific slot (see *front-page slotting* below).

```js
export const articles = [
  // …existing
  {
    id: 'mayor-promise',
    section: 'Politics',
    headline: 'Mayor Promises “Full Transparency,” Details To Follow',
    dek: 'The full disclosure, aides clarified, will be at the end of this quarter.',
    byline: 'J. Alvarado',
    role: 'City Desk',
    date: 'April 18',
    readTime: '3 min read',
    image: 'mayor at a podium, lights glaring',
    body: [
      'The promise was delivered on the steps of city hall…',
      'Follow-up questions, the mayor added, would be answered "in the fullness of time."'
    ]
  }
];
```

### Front-page slotting

`FrontPage.svelte` slices `articles` by index:

```js
const hero = articles[0];             // Top-of-page hero card
const topTwo = articles.slice(1, 3);  // Two large cards below hero
const rest = articles.slice(3);       // Three-column grid below the lead
```

So **the first article is your hero** and the next two are leads.
To change what appears where, reorder the array.

If you want finer control (e.g. "this article never goes on the front
page"), add a `frontpage: false` flag and filter in FrontPage.svelte.

### Article body fields

`body`, `pullquote`, and `readTime` are not rendered on the front
page today. They're kept on the data model so future interactions
(inline expansion, modal, a rebuilt article page) can consume them
without a schema migration.

## Ads

Ads are data, not components — they're rendered through `AdSlot.svelte`
using an object like:

```js
{
  label: 'Advertisement',     // Label above the ad
  brand: 'Evergreen Watches', // Small accent-colored brand
  headline: 'Time, Trusted.', // Italic display headline
  body: 'Precision-engineered…', // Optional body copy
  size: 'small'               // 'small' | 'medium' | 'large'
}
```

### Where ads live

Currently inline in `FrontPage.svelte` — `sidebarAd` and `footerAd`
are declared near the top of the `<script>` block.

If you start having more than ~5 ads, promote them into
`game/ads.js` (same pattern as `articles.js`) and import.

### Adding an ad

1. Add the `AdSlot` component where you want it to render.
2. Pass an `ad` prop.

```svelte
<AdSlot ad={{
  brand: 'Civic Harmony Council',
  headline: 'Good citizenship starts at home.',
  body: 'Ask your neighbor what they heard today.',
  size: 'medium'
}} />
```

### Ad size semantics

- `small` — 120px min-height. Ribbon / inline stuff.
- `medium` — 260px min-height. Standard sidebar block.
- `large` — 400px min-height. Full-width spectacle.

Ads use placeholder styling (beige cardstock + brand + italic headline)
so the visual is readable without final Procreate art.

## Sections

The `section` string on an article doubles as its eyebrow label and
(if you decide to add it) a filter key for per-section front pages.

The Nav component hardcodes the section list:

```js
// Nav.svelte
const sections = ['Home', 'Politics', 'World', 'Business', 'Opinion', …];
```

To make the nav functional, add click handlers that filter `articles`
by `section` and rerender the front page. Not wired today — the nav
is chrome-only.

## Rewriting all copy

Most of what's in `articles.js` is placeholder. Rewrite freely — keep
the schema, change the strings. Nothing else in the codebase reads
those specific headlines or body text.
