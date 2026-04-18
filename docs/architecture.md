# Architecture

## The mental model

The game is a **real website** that happens to run a game underneath
it. Everything you see is DOM + CSS — article cards, layouts,
typography, hover states, routing. The "game" part lives in a handful
of JS modules and a transparent PixiJS canvas layered on top.

```
+-----------------------------------------------+
|                                               |
|   DOM (Svelte components)                     |
|   ─ Masthead, Nav, ArticleCard, AdSlot…       |
|   ─ Front page + Article page                 |
|                                               |
|   + invisible PixiJS canvas overlay           |
|     (particles, flashes, distortion)          |
|                                               |
|   + GSAP cutscene overlay (full-screen,       |
|     shown only during cutscenes)              |
|                                               |
+-----------------------------------------------+
         ▲                         ▲
         │                         │
  click / scroll             cutscene trigger
         │                         │
         ▼                         ▼
   game/state.js  ◀─────▶  game/events.js  ◀─────▶  game/cutscene.js
         │
         ▼
    localStorage
```

**Key idea:** the news site renders first and always. Game effects
layer on top; they never own the layout.

## Entry point

`src/main.js` is the boot sequence:

1. Import global CSS
2. `state.load()` — rehydrate from localStorage or seed fresh
3. Register audio sprites (fake sources for now)
4. Mount the Svelte `App`
5. Initialise audio (autoplay-unlock listener) and Pixi FX overlay

The Pixi overlay canvas (`<canvas id="fx-overlay">`) is declared in
`App.svelte` and picked up by `fx.init()` after mount.

## File layout

```
src/
  main.js                  entry point
  App.svelte               masthead + nav + router + footer + fx canvas
  styles/global.css        design tokens, typography, resets
  components/              building blocks (all presentational)
    Masthead.svelte        site header
    Nav.svelte             section nav
    Footer.svelte          footer
    ArticleCard.svelte     hero/large/medium/small card on front page
    Headline.svelte        article-page headline + dek + eyebrow
    Byline.svelte          author, role, date, read time
    PullQuote.svelte       inline blockquote
    AdSlot.svelte          small/medium/large advertisement block
  pages/
    FrontPage.svelte       composes the front page from articles.js
    ArticlePage.svelte     renders one article + inline ad/pullquote
  game/
    state.js               Svelte store + save/load/reset
    events.js              pub/sub event bus
    router.js              hash-based router store
    articles.js            article data (the only content file)
    cutscene.js            GSAP overlay + library of cutscenes
    fx.js                  PixiJS overlay + FX primitives
    audio.js               Howler wrapper + autoplay unlock
```

## Data flow

Three modules coordinate everything game-side:

### `state.js`
- Exposes a Svelte store — any component can `$state` to subscribe
- Persists every mutation to `localStorage` automatically
- Shapes: `articlesRead`, `articleOpenCount`, `cutscenesSeen`,
  `flags`, `audioUnlocked`, `firstVisitAt`, `lastVisitAt`
- Methods: `load`, `save`, `reset`, `update`, `markArticleRead`,
  `markCutsceneSeen`, `setFlag`, `setAudioUnlocked`

### `events.js`
- Minimal pub/sub (`on`, `once`, `off`, `emit`)
- Lets subsystems talk without import cycles
- Standard events emitted by the framework:
  - `article:read` — after `state.markArticleRead`
  - `cutscene:start`, `cutscene:end`
  - `audio:unlocked`, `audio:play-fake`
  - `fx:ready`
  - `state:reset`

### `cutscene.js` / `fx.js` / `audio.js`
All three consume state/events rather than orchestrating each other
directly. This keeps them independently swappable — if you cut
PixiJS mid-jam and replace `fx.js` with CSS filters, nothing else
changes.

## Routing

Hash-based. `router.js` exposes a readable store `route` that parses
`window.location.hash` into `{ name, params }`. Two routes exist:

- `''` or `'#/'` → `{ name: 'home' }`
- `'#/article/<id>'` → `{ name: 'article', params: { id } }`

`App.svelte` switches between `FrontPage` and `ArticlePage` based on
`$route.name`. `goToArticle(id)` and `goHome()` are the two helpers.

We don't use SvelteKit — for a single-file-entry Compo build,
hash-routing keeps the bundle small and the LD embed happy.

## Rendering order

1. **DOM renders first.** This is the "real" website. It's what
   players see before any JS boots.
2. **Svelte hydrates** and wires up interactivity.
3. **Pixi overlay initialises** on top of the DOM.
4. **First cutscene** fires if it's the player's first visit.

Cutscenes are **always** skippable (Esc, Enter, or click the
overlay). Don't gate gameplay behind a cutscene that can't be
escaped.

## Autoplay unlock

Browsers block audio until the player interacts. `audio.js` listens
for the first pointerdown or keydown, resumes the Howler AudioContext,
flips `state.audioUnlocked` to true, and emits `audio:unlocked`.

If you're triggering music or SFX on page load, hook into
`audio:unlocked` instead.

## Where to plug in real art

Right now every visual asset is a CSS-drawn placeholder box with a
label like `[illustration]`. Find these in:

- `ArticleCard.svelte` — `.card__image-placeholder`
- `ArticlePage.svelte` — `.article__image-placeholder`

Swap the div for an `<img src="./assets/art/foo.webp">` when real
Procreate exports land. See [fx-and-audio.md](./fx-and-audio.md) for
pipeline specifics.
