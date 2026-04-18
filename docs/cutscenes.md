# Cutscenes

Cutscenes are full-screen GSAP-driven overlays built out of typed
"frames". They sit on top of the DOM, fade in, play a sequence of
frames with cross-fades, then fade out.

All cutscene code lives in **`src/game/cutscene.js`**.

## Concepts

- A **cutscene** is `{ id, frames[] }`.
- A **frame** is a typed snippet: `{ eyebrow?, headline, body? }`.
- The overlay is created lazily on first play and reused after.
- Cutscenes are **always skippable** via Esc, Enter, or overlay click.

## Frame schema

```js
{
  eyebrow: 'Bulletin',          // optional, small uppercase red label
  headline: 'The presses are running.', // required, large display type
  body: 'Every front page is a lever…'  // optional, serif body copy
}
```

Only `headline` is required. Keep body copy under ~3 sentences — any
longer and you need a different UI (a readable "document" view, not
a cutscene).

## Writing a new cutscene

Add an entry to the `library` object in `cutscene.js`:

```js
const library = {
  intro: { /* existing */ },
  deeper: { /* existing */ },
  // new:
  firstCorrection: {
    id: 'firstCorrection',
    frames: [
      {
        eyebrow: 'Correction',
        headline: 'A word has been changed.',
        body: 'Page 4, column 2, paragraph 3. No one will remember the old one.'
      }
    ]
  }
};
```

Then trigger it from anywhere:

```js
import { cutscene } from './game/cutscene.js';

cutscene.playById('firstCorrection');
```

`cutscene.playById(id)` returns a **Promise** that resolves when the
cutscene finishes. Use it to gate follow-up state changes:

```js
await cutscene.playById('firstCorrection');
state.setFlag('correctionSeen', true);
```

## Triggering cutscenes

Current triggers live in the front page:

- **Intro** — fires on first visit (checked against
  `state.cutscenesSeen`) after a short delay.
- **Deeper** — fires when `articleOpenCount` reaches 3.

Add your own triggers either:

1. Inline in the component that causes them (e.g. clicking an ad
   fires a cutscene).
2. Listening to events on the global `events` bus.

```js
// Option 2: listen for any article read
import { events } from './game/events.js';
import { cutscene } from './game/cutscene.js';

events.on('article:read', ({ articleId }) => {
  if (articleId === 'obit-professor') {
    cutscene.playById('firstCorrection');
  }
});
```

## Tracking which cutscenes have played

`cutscene.js` calls `state.markCutsceneSeen(id)` at the end of each
play. Check via:

```js
let seen = false;
state.subscribe((s) => (seen = s.cutscenesSeen.includes('intro')))();
```

Use this to avoid replaying intro cutscenes on returning visits.

## Custom playback (not using the library)

Call `cutscene.play({ id, frames, onComplete })` directly with an
ad-hoc frames array. Useful for dynamic text (e.g. using article
data inside a cutscene).

```js
cutscene.play({
  id: 'published',
  frames: [{
    eyebrow: 'Published',
    headline: `"${article.headline}" is now on page one.`,
    body: 'Tomorrow's readers will see your chosen words first.'
  }]
});
```

## Timing knobs

Currently baked into `cutscene.js`:

- Frame hold: ~2.6s after the last fade-in
- Per-frame cross-fade: 0.4s out → 0.6s in
- Overlay fade in: 0.35s
- Overlay fade out: 0.5s

If you want per-frame durations, extend the frame schema with a
`hold` field and plug it into the timeline in `cutscene.js`. The
change is a few lines around the `tl.to({}, { duration: 2.6 })` call.

## Skipping

The overlay binds `keydown` (Esc / Enter) and `click` to fast-forward
the timeline to completion via `tl.progress(1)`. This also fires
`onComplete`, so `state.markCutsceneSeen` runs as expected.

If you add critical information that **must** be read, make it a
separate UI (e.g. a reading room page), not a cutscene.

## Typography

Cutscenes inline their font-families and colors to avoid depending on
global CSS load order (the overlay is injected outside the Svelte
tree). If you change the display font in `global.css`, also update
`renderFrames()` in `cutscene.js`.

## Styling the overlay

The overlay's background is `rgba(10, 10, 10, 0.96)` — nearly
opaque black. If you want a themed overlay (e.g. red for alarming
cutscenes), extend the `play()` signature to accept a `tint` and
apply it to `overlay.style.background`.
