# Propaganda and Rhetoric

A game that presents itself as an online newspaper. Built solo in 48h for
**Ludum Dare Compo**. See [CLAUDE.md](./CLAUDE.md) for the full design brief
and Compo-compliance notes.

> *The Daily Record. All the news that stays on-message.*

## Run

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

Preview serves `dist/` at `http://localhost:4173`. Inspect this before zipping.

## Submission (direct upload to LD)

1. `npm run build`
2. Zip **the contents of `dist/`**, not the `dist/` folder itself.
   `index.html` must be at the root of the zip.
3. Upload zip to the Ludum Dare entry page (verify size/format limits at
   submission time — they may change).
4. Publish source code publicly. GitHub or a `source.zip` alongside the
   build is both acceptable.

The build is configured with `base: './'` so relative asset paths work
when embedded under an arbitrary subpath.

## What's here

```
src/
  main.js                   entry point
  App.svelte                top-level layout
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
```

## Tech choices

- **Vite + Svelte** — static build, HMR, scoped CSS, minimal runtime
- **GSAP** — cutscene timelines
- **PixiJS** — full-screen FX overlay (`#fx-overlay` canvas)
- **Howler.js** — audio; uses a fake-play fallback so the app works
  before real sprites are added
- **localStorage** — save state persistence

## Game loop (placeholder, to be rewritten once the LD theme is known)

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
drop into `src/assets/art/`. Swap the `[illustration]` placeholder div
in `ArticleCard.svelte` / `ArticlePage.svelte` for an `<img>` when
real art is ready.

Audio: drop sprite files into `src/assets/audio/`, update the
`audio.register('id', { src: [...] })` calls in `main.js`.

## Compo compliance reminders

- The Daily Record is a fictional publication. Don't adopt real
  outlet names, mastheads, or photos.
- All art must be created within the 48h (Procreate is fine; reference
  photos OK as visual study, not to trace into the final).
- Fonts are exempt — Google Fonts (Playfair Display / Source Serif 4 /
  Oswald) are loaded by CDN.
- Source code is published as part of the entry.
