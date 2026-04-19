# Styling

Everything visual is DOM + CSS. No canvas layout, no framework UI kit.
Just tokens, components, and Svelte's scoped styles.

## Design tokens

Defined once in `styles/global.css` under `:root`. Reference them
as `var(--token-name)` anywhere.

### Colors

```css
--color-bg:           /* page background, pulp cream */
--color-paper:        /* card / column ground */
--color-ink:          /* body text, warm near-black */
--color-ink-soft:     /* secondary text */
--color-ink-muted:    /* captions, fine print */
--color-ink-strong:   /* nameplate, top rules */
--color-rule:         /* hairline dividers */
--color-rule-strong:  /* heavy dividers (masthead bottom, etc.) */

/* Recruitment-poster chrome — see .impeccable.md slot table */
--color-accent:       /* ring red — banners, stamps, date rule */
--color-navy:         /* wartime navy — kickers, cartouches, nav-current */
--color-navy-deep:    /* deep navy — pull-quote attribution */
--color-gold:         /* mustard — pullquote ground, ad label, ornaments */
--color-gold-deep:    /* burnt orange — ad signatures, deep accents */

--color-link:         /* body-ink link color */
```

Primitives (`--paper-base`, `--ink-*`, `--accent`, `--gold*`, `--navy*`)
are the canonical values; the `--color-*` aliases are what components
read. Don't hardcode hex in components.

### Fonts

```css
--font-body:    /* body copy — Gelasio, Georgia, Source Serif 4 */
--font-display: /* headlines, nameplate, eyebrows — Old Standard TT */
```

Both are loaded from Google Fonts in `index.html`. There is no
sans-serif in this project — eyebrows and nav chrome use
letterspaced all-caps Old Standard TT, not Oswald.

### Type scale

```css
--text-xxs:  0.6875rem /* 11px — running heads, microcopy */
--text-xs:   0.75rem   /* 12px — bylines, datelines, eyebrows */
--text-sm:   0.8125rem /* 13px — small caps decks, captions */
--text-base: 0.9375rem /* 15px — body copy */
--text-md:   1.0625rem /* 17px — sub-hero headlines */
--text-lg:   1.375rem  /* 22px — secondary headlines */
--text-xl:   1.75rem   /* 28px — front-page hero dek */
--text-2xl:  2.375rem  /* 38px — hero headline */
--text-3xl:  3rem      /* 48px — masthead nameplate */
```

No `--text-4xl` or `--text-5xl` — the scale is tuned for the
LD embed viewport (948 × 533), not unconstrained desktop.

### Line heights

```css
--leading-tight:   1.1   /* headlines */
--leading-snug:    1.3   /* dek, pull-quotes */
--leading-normal:  1.55  /* default body */
--leading-relaxed: 1.7   /* article long-form */
```

### Spacing

```css
--space-1: 0.25rem    /*  4px */
--space-2: 0.375rem   /*  6px */
--space-3: 0.5rem     /*  8px */
--space-4: 0.75rem    /* 12px */
--space-5: 1rem       /* 16px — default gutter */
--space-6: 1.5rem     /* 24px — section break */
--space-7: 2rem       /* 32px */
--space-8: 3rem       /* 48px — top-of-page only */
```

All component padding/margins use these. If you catch yourself
typing `padding: 18px`, reach for a token instead.

## Global classes

Defined in `global.css`, usable from any component:

- **`.eyebrow`** — filled navy cartouche with cream letterspaced
  all-caps. Used for section kickers on cards and headlines.
- **`.eyebrow--accent`** — red variant, reserved for hero kickers.
- **`.eyebrow--gold`** — gold ground, ink type (ornamental).
- **`.rule--strong`** — 2px ink top border. Section transitions.
- **`.rule--accent`** — 4px red top border. Banner-style article opener.
- **`.banner`** — filled red caps banner (see masthead ribbon).
- **`.banner--navy`** — navy variant.

See `.impeccable.md` for the canonical slot table (which color goes where).

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

Keep it simple — readers will arrive on whatever device they're
holding. Mobile-first isn't necessary given the news-site aesthetic
is inherently desktop-flavored. Just ensure it doesn't break.

## Adding a new component

1. Create `components/NewThing.svelte`.
2. Use the script/markup/style pattern above.
3. Import where needed:

```svelte
<script>
  import NewThing from '../components/NewThing.svelte';
</script>
<NewThing someProp="hi" />
```

## Adding a new page

The site is a single static front page — there's no router. If you
need a second page, introduce routing yourself (hash-based is still
the easy path for a static host) and switch on it in `App.svelte`.

## Placeholder images

The site ships with no image elements. Article data carries an `image`
description field reserved for future use; `AdSlot` compositions are
pure type. When Procreate exports land, add an `<img>` render branch
to `ArticleCard.svelte` (see `docs/architecture.md` → "Where to plug
in real art"). Ad variants can take branded art on the same pattern.

## Dark mode / theme variants

Not done. Easy to add: wrap a second `:root[data-theme="dark"]`
block in `global.css` overriding the color tokens, toggle the
attribute on `<html>` from JS.
