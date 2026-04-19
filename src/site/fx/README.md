# fx — animation orchestration

One global state machine, one animation registry, one `dispatch`
entry point. Day-one state config is empty. Day-one registry is
empty. Add states and animations as the site needs them.

## Files

- `machine.js` — FSM factory (`createMachine`).
- `registry.js` — animation registry factory (`createRegistry`).
- `index.js` — the single app-wide instance; exports
  `dispatch`, `register`, `play`, `state` (Svelte readable store),
  and `machine` (raw, for debugging).

## Pattern 1 — register an animation

An animation is a function `(target, opts) => { stop, done }`.
It can use GSAP, Pixi, CSS classes, or anything else.

```js
// e.g. in main.js, or a dedicated fx/animations.js
import { register } from './fx/index.js';
import { gsap } from 'gsap';

register('shake', (el, { reducedMotion } = {}) => {
  if (reducedMotion) {
    return { stop: () => {}, done: Promise.resolve() };
  }
  const tl = gsap.timeline();
  tl.to(el, { x: -4, duration: 0.05 })
    .to(el, { x: 4, duration: 0.05 })
    .to(el, { x: 0, duration: 0.05 });
  return {
    stop: () => tl.kill(),
    done: new Promise((resolve) => tl.eventCallback('onComplete', resolve))
  };
});
```

## Pattern 2 — extend the machine with a new state

The machine is created in `index.js` with one `idle` state.
Replace that config with a richer one when the app needs more modes.
Entry hooks can call `play` to fire animations on state changes.

```js
// fx/index.js
import { readable } from 'svelte/store';
import { createMachine } from './machine.js';
import { createRegistry } from './registry.js';

const registry = createRegistry();

export function register(name, fn) { registry.register(name, fn); }
export function play(name, target, opts) { return registry.play(name, target, opts); }

export const machine = createMachine({
  initial: 'idle',
  context: { lastArticleId: null },
  states: {
    idle: {
      on: {
        ARTICLE_OPEN: {
          target: 'reading',
          action: (ctx, e) => ({ ...ctx, lastArticleId: e.payload?.id ?? null })
        }
      }
    },
    reading: {
      entry: () => play('shake', document.body),
      on: { ARTICLE_CLOSE: { target: 'idle' } }
    }
  }
});

export function dispatch(event, payload) { machine.send(event, payload); }
export const state = readable(
  { state: machine.getState(), context: machine.getContext() },
  (set) => machine.subscribe(set)
);
```

## Pattern 3 — dispatch from a Svelte component

```svelte
<script>
  import { dispatch, state } from '../fx/index.js';
  export let article;

  function open() {
    dispatch('ARTICLE_OPEN', { id: article.id });
  }
</script>

<button on:click={open}>Open</button>
<p>Current mode: {$state.state}</p>
```

## Pattern 4 — cancel an animation on state exit

State hooks can capture a handle and `stop()` it on `exit`:

```js
let handle = null;
states: {
  alert: {
    entry: () => { handle = play('flash', document.body); },
    exit:  () => { handle?.stop(); handle = null; }
  }
}
```

## `prefers-reduced-motion`

`play` always passes `opts.reducedMotion` (sourced from
`matchMedia`). Each animation decides how to degrade —
snap instead of fade, skip particles, render a brief overlay, etc.

## Not in scope here

- No triggers are wired on day one. Components don't dispatch
  anything yet.
- No animations are registered on day one.
- `gsap`, `pixi.js`, and `howler` remain installed. Use them from
  registered animations as needed.
