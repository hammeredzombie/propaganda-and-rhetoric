# Propaganda and Rhetoric — The Daily Record

The source for **The Daily Record**, a fictional online publication
self-hosted at [proper-goose.com](https://proper-goose.com). A Svelte +
Vite static site. See [`../../CLAUDE.md`](../../CLAUDE.md) for the
monorepo overview, or [`docs/`](./docs) for subsystem docs.

The Ludum Dare Compo game is a **separate Godot project**, tracked
elsewhere in this monorepo — this site is not the LD submission.

> *The Daily Record. All the news that stays on-message.*

## Run

All commands run from `src/site/` (this directory).

```bash
npm install
npm run dev
```

Dev server with HMR at `http://localhost:5173`.

## Build & preview

```bash
npm run build
npm run preview
```

Preview serves `dist/` at `http://localhost:4173`.

## Deploy

Deploy `dist/` to any static host (Cloudflare Pages, Netlify, Vercel).
Point proper-goose.com DNS at the host. `vite.config.js` uses `base: '/'`
so assets resolve from the domain root.

## What's here

```
src/site/
  main.js                   entry point
  App.svelte                top-level layout
  index.html                Vite entry HTML
  vite.config.js            Vite config (base: '/')
  styles/
    global.css              typography, palette, resets
  components/
    Masthead.svelte
    Nav.svelte
    Footer.svelte
    ArticleCard.svelte      hero / large / medium / small sizes
    Headline.svelte
    Byline.svelte
    PullQuote.svelte
    AdSlot.svelte           small / medium / large
  pages/
    FrontPage.svelte
    ArticlePage.svelte
  game/
    state.js                Svelte store + localStorage (save/load/reset)
    events.js               pub/sub
    router.js               hash-based routing (home vs /article/:id)
    cutscene.js             GSAP timelines + overlay + prebuilt library
    fx.js                   PixiJS ink-splash + flash overlay
    audio.js                Howler wrapper with autoplay unlock
    articles.js             placeholder article data
  docs/                     subsystem docs (architecture, content, etc.)
```

## Tech choices

- **Vite + Svelte** — static build, HMR, scoped CSS, minimal runtime
- **GSAP** — cutscene timelines
- **PixiJS** — full-screen FX overlay (`#fx-overlay` canvas)
- **Howler.js** — audio; uses a fake-play fallback so the app works
  before real sprites are added
- **localStorage** — save state persistence

## Interactions

- First visit → `intro` cutscene plays after a short delay
- Click an article → ink-splash FX, state bumps `articleOpenCount`, route
  changes to the article page
- On the third article open → `deeper` cutscene plays
- All progress persists in `localStorage` under key
  `propaganda-and-rhetoric:v1`

Reset state from the browser console:
```js
localStorage.removeItem('propaganda-and-rhetoric:v1'); location.reload();
```

## Asset pipeline

Procreate → PNG with transparency → `cwebp -q 80 in.png -o out.webp` →
drop into `assets/art/`. Swap the `[illustration]` placeholder div
in `ArticleCard.svelte` / `ArticlePage.svelte` for an `<img>` when
real art is ready.

Audio: drop sprite files into `assets/audio/`, update the
`audio.register('id', { src: [...] })` calls in `main.js`.

## Editorial rules

- The Daily Record is a fictional publication. No real outlet names,
  mastheads, URLs, or copyrighted photos/text.
- Original art only; reference photos as visual study, never traced.
- Fonts: Google Fonts (Playfair Display / Source Serif 4 / Oswald)
  loaded by CDN.
