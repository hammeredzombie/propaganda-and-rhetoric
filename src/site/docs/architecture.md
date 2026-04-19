# Architecture

## The mental model

The game is a **real website** that happens to run a game underneath
it. Everything you see is DOM + CSS — article cards, layout,
typography. The site is a single static front page; the "game" part
lives in a handful of JS modules.

```
+-----------------------------------------------+
|                                               |
|   DOM (Svelte components)                     |
|   ─ Masthead, Nav, ArticleCard, AdSlot…       |
|   ─ Front page only                           |
|                                               |
+-----------------------------------------------+
         ▲                         ▲
         │                         │
  click / scroll             fx dispatch event
         │                         │
         ▼                         ▼
   game/state.js  ◀─────▶  game/events.js        fx/index.js (FSM)
         │
         ▼
    localStorage
```

**Key idea:** the news site renders first and always. Animations
are orchestrated by the `fx/` state machine; see `src/site/fx/README.md`.

## Entry point

`main.js` (at `src/site/main.js` from the repo root) is the boot sequence:

1. Import global CSS
2. `state.load()` — rehydrate from localStorage or seed fresh
3. Subscribe drift stage → `data-drift` attribute on `:root`
4. Register audio sprites (fake sources for now)
5. Mount the Svelte `App`
6. Initialise audio (autoplay-unlock listener)

## File layout

Paths below are relative to `src/site/` (the site project root).

```
main.js                  entry point
App.svelte               masthead + nav + front page + footer
index.html               Vite HTML entry
vite.config.js           Vite config (base: '/')
styles/global.css        design tokens, typography, resets
components/              building blocks (all presentational)
  Masthead.svelte        site header
  Nav.svelte             section nav
  Footer.svelte          footer
  ArticleCard.svelte     hero/large/medium/small card on front page
  Headline.svelte        headline + dek + eyebrow
  Byline.svelte          author, role, date, read time
  PullQuote.svelte       inline blockquote
  AdSlot.svelte          small/medium/large advertisement block
pages/
  FrontPage.svelte       composes the front page from articles.js
fx/
  machine.js             FSM factory
  registry.js            animation registry
  index.js               singleton + dispatch + Svelte store
  README.md              usage patterns
game/
  state.js               Svelte store + save/load/reset
  events.js              pub/sub event bus
  articles.js            article data (the only content file)
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
  `setFlag`, `setAudioUnlocked`

### `events.js`
- Minimal pub/sub (`on`, `once`, `off`, `emit`)
- Lets subsystems talk without import cycles
- Standard events emitted by the framework:
  - `article:read` — after `state.markArticleRead`
  - `audio:unlocked`, `audio:play-fake`
  - `state:reset`

### `fx/` and `audio.js`
`fx/` owns a single app-wide state machine plus an animation
registry. Components dispatch events into it; registered animations
are invoked from state hooks (or directly by name). See
`src/site/fx/README.md`. `audio.js` consumes state/events
independently. This keeps both independently swappable — if the
animation library changes, nothing else changes.

## Routing

There is no router. The site is a single static front page.

## Rendering order

1. **DOM renders first.** This is the "real" website. It's what
   players see before any JS boots.
2. **Svelte hydrates** and wires up interactivity.
3. **fx machine** sits in its initial `idle` state. No animations
   are registered or triggered on day one; add them by calling
   `register(name, fn)` and `dispatch(event, payload)`.

## Autoplay unlock

Browsers block audio until the player interacts. `audio.js` listens
for the first pointerdown or keydown, resumes the Howler AudioContext,
flips `state.audioUnlocked` to true, and emits `audio:unlocked`.

If you're triggering music or SFX on page load, hook into
`audio:unlocked` instead.

## Where to plug in real art

Right now every visual asset is a CSS-drawn placeholder box with a
label like `[illustration]`. Find these in `ArticleCard.svelte`
(`.card__image`). Swap the div for an `<img src="./assets/art/foo.webp">`
when real Procreate exports land.
