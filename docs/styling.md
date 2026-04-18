# Styling

Everything visual is DOM + CSS. No canvas layout, no framework UI kit.
Just tokens, components, and Svelte's scoped styles.

## Design tokens

Defined once in `src/styles/global.css` under `:root`. Reference them
as `var(--token-name)` anywhere.

### Colors

```css
--color-bg:          /* page background, warm off-white */
--color-paper:       /* card/ad background */
--color-ink:         /* body text, near-black */
--color-ink-soft:    /* secondary text */
--color-ink-muted:   /* captions, fine print */
--color-rule:        /* hairline dividers */
--color-rule-strong: /* heavy dividers (masthead bottom, etc.) */
--color-accent:      /* brand red for eyebrows, hovers */
--color-accent-soft: /* lighter red, unused today — available */
--color-link:        /* deep blue for inline links */
--color-ad-bg:       /* slightly warmer beige for ad slots */
```

Changing the whole palette = editing these eleven values. Don't
hardcode hex in components.

### Fonts

```css
--font-serif:   /* body copy — Source Serif 4, Charter, Georgia */
--font-display: /* headlines — Playfair Display */
--font-sans:    /* eyebrows, metadata, UI chrome — Oswald */
```

All three are loaded from Google Fonts in `index.html`. Fonts are a
Compo exemption so this is fine.

### Type scale

```css
--text-xs:   0.75rem   /* labels, metadata */
--text-sm:   0.875rem  /* captions, small body */
--text-base: 1rem
--text-lg:   1.125rem  /* article body */
--text-xl:   1.375rem  /* card dek, inline headlines */
--text-2xl:  1.75rem   /* card large headlines */
--text-3xl:  2.25rem   /* section headlines */
--text-4xl:  3rem      /* article headline on small screens */
--text-5xl:  4rem      /* masthead, hero headlines */
```

### Line heights

```css
--leading-tight:   1.1   /* headlines */
--leading-snug:    1.3   /* dek, pull-quotes */
--leading-normal:  1.55  /* default body */
--leading-relaxed: 1.7   /* article long-form */
```

### Spacing

```css
--space-1:  0.25rem
--space-2:  0.5rem
--space-3:  0.75rem
--space-4:  1rem
--space-5:  1.5rem
--space-6:  2rem
--space-8:  3rem
--space-10: 4rem
```

All component padding/margins use these. If you catch yourself
typing `padding: 18px`, reach for a token instead.

## Global classes

Defined in `global.css`, usable from any component:

- **`.eyebrow`** — small uppercase red label. Used for section tags
  and cutscene labels.
- **`.rule--strong`** — 2px top border. Marks section transitions
  on the front page.

Everything else is per-component scoped CSS.

## The component pattern

Svelte components hold their CSS scoped — no BEM prefixing required.
The pattern used throughout this project:

```svelte
<script>
  export let someProp;
</script>

<div class="widget">
  <div class="widget__title">…</div>
  <div class="widget__body">…</div>
</div>

<style>
  .widget { /* root */ }
  .widget__title { /* child */ }
  .widget__body { /* child */ }
</style>
```

- Root class matches the component name lowercased (`widget`).
- Children use `widget__child` (BEM double-underscore).
- Modifiers use `widget--modifier` (BEM double-dash).

Svelte's scoped CSS means you don't *need* BEM for isolation, but
using it consistently makes DevTools output readable.

## Responsive breakpoints

One breakpoint, used inconsistently but repeatedly:

```css
@media (max-width: 720px) { /* mobile */ }
@media (max-width: 900px) { /* tablet (used in FrontPage grid) */ }
```

Keep it simple — LD players will play on whatever they're holding.
Mobile-first isn't necessary given the news-site aesthetic is
inherently desktop-flavored. Just ensure it doesn't break.

## Adding a new component

1. Create `src/components/NewThing.svelte`.
2. Use the script/markup/style pattern above.
3. Import where needed:

```svelte
<script>
  import NewThing from '../components/NewThing.svelte';
</script>
<NewThing someProp="hi" />
```

## Adding a new page

1. Create `src/pages/NewPage.svelte`.
2. Add a new route to `src/game/router.js`:

```js
function parse() {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('/article/')) return { name: 'article', params: { id: hash.slice('/article/'.length) } };
  if (hash === '/credits') return { name: 'credits', params: {} };
  return { name: 'home', params: {} };
}

export function goToCredits() { window.location.hash = '/credits'; window.scrollTo({ top: 0 }); }
```

3. Add the branch to `App.svelte`:

```svelte
{#if $route.name === 'credits'}
  <CreditsPage />
{:else if $route.name === 'article'}
  <ArticlePage id={$route.params.id} />
{:else}
  <FrontPage />
{/if}
```

## Drop caps and print flourishes

The article lede uses `::first-letter` to draw a large accent-colored
initial cap. To remove it from an article, pass a flag from
`articles.js` and drop the `article__para--lede` class conditionally.

## Placeholder images

All placeholder imagery is CSS (a beige box with a text label). This
keeps the build runnable without any art. Swap the placeholder divs
for `<img>` tags when Procreate exports land.

Check:
- `ArticleCard.svelte` — `.card__image-placeholder`
- `ArticlePage.svelte` — `.article__image-placeholder`
- `AdSlot.svelte` — uses no image, pure type; can take one if you
  want branded ad art.

## Dark mode / theme variants

Not done. Easy to add: wrap a second `:root[data-theme="dark"]`
block in `global.css` overriding the color tokens, toggle the
attribute on `<html>` from JS.
