# Animation Infrastructure — Design

Date: 2026-04-18
Scope: `src/site/` (The Proper Goose). The Godot project is unaffected.

## Goal

Remove every animation currently rendered on the site, then add a small
infrastructure that makes it easy to later attach animations to events.
The site should behave like a game substrate: a single global state
machine processes dispatched events, and animations are registered by
name and invoked from state entry/exit hooks (or ad-hoc from anywhere).

On day one, nothing animates. The infrastructure exists, empty, and is
ready to be filled in incrementally.

## Non-goals

- Re-implementing the current cutscene, ink splash, censor flash, or
  drift colour crossfade. Those are deleted.
- Wiring any site-level triggers (clicks, route changes, scroll) into
  the machine. That is deferred to follow-up work that adds specific
  animations.
- Replacing `gsap`, `pixi.js`, or `howler`. They remain in
  `package.json` so future animations can use them.

## Constraints

- No new runtime dependencies.
- Finite-state machine is a small custom module (~60 lines), not
  XState.
- One global machine instance for the whole site.
- Drift stage data (the `articleOpenCount`-driven stage in the app
  store) stays; only its animation side-effects are removed.
- The `.skip-link` focus affordance in `styles/global.css` is retained
  (accessibility, not decorative motion).

## Architecture

Three modules under `src/site/fx/`:

```
src/site/fx/
├── machine.js    # FSM core
├── registry.js   # animation registry
├── index.js      # singleton wiring + Svelte store
└── README.md     # usage patterns
```

### `machine.js`

Exports `createMachine(config)`.

`config` shape:

```js
{
  initial: 'idle',
  context: { /* arbitrary data, mutated via transitions */ },
  states: {
    idle: {
      on: {
        EVENT_NAME: {
          target: 'otherState',
          // optional: updates context, fires before entry hook
          action: (context, event) => ({ ...context, foo: 1 }),
        },
      },
      entry: (context, event) => { /* side effects */ },
      exit:  (context, event) => { /* side effects */ },
    },
    otherState: { /* ... */ },
  },
}
```

Returned machine API:

- `send(event, payload)` — processes an event. If the current state
  defines a handler, runs exit on old state, applies optional `action`
  to context, transitions, runs entry on new state. Notifies subscribers
  after the transition completes.
- `subscribe(listener)` — listener is called as
  `listener({ state, context })` on every transition. Returns an
  unsubscribe function. Emits current state synchronously on subscribe.
- `getState()` — returns the current state name.
- `getContext()` — returns the current context (frozen shallow copy).

Self-transitions (target equals current state) still fire exit then
entry, which matches game-engine expectations (re-enter the state to
re-fire the hook). Events with no handler in the current state are a
no-op in production; in dev they `console.warn`.

A transition whose `target` is not defined in `states` throws at
`send` time. This is a configuration bug, so it fails loud.

### `registry.js`

Exports a factory `createRegistry()` returning `{ register, play }`.

- `register(name, fn)` — stores `fn` under `name`. `fn` has signature
  `(target, opts) => handle`, where `handle` is
  `{ stop(): void, done: Promise<void> }`.
  - `target` is whatever the caller passes (DOM element, selector,
    object). The registry does not inspect it.
  - `opts` is caller-defined. Animations are free to accept any shape.
  - `handle.done` resolves when the animation finishes naturally, or
    when `stop()` is called.
- `play(name, target, opts)` — looks up `name`, invokes it, returns the
  handle. Unknown name: `console.warn` and return a no-op handle
  (`{ stop() {}, done: Promise.resolve() }`) so callers don't crash.
- `play` checks `window.matchMedia('(prefers-reduced-motion: reduce)')`
  and passes `opts.reducedMotion = true` to the animation fn so each
  animation can decide how to degrade. The registry does not silently
  skip; degradation is the animation author's responsibility.

### `index.js`

Creates the one global machine and the one global registry, then
re-exports a thin surface:

- `dispatch(event, payload)` — delegates to `machine.send`.
- `register(name, fn)` — delegates to registry.
- `play(name, target, opts)` — delegates to registry.
- `state` — a Svelte readable store derived from `machine.subscribe`,
  exposing `{ state, context }` so components can `$state`.
- `machine` — the raw machine for advanced cases (tests, devtools).

The day-one config is an empty skeleton:

```js
createMachine({
  initial: 'idle',
  context: {},
  states: { idle: {} },
});
```

No animations registered. No transitions defined. Ready to extend.

### `README.md`

Short doc in `src/site/fx/README.md` with four copy-pasteable patterns:

1. Register an animation (GSAP example, Pixi example, CSS-class
   example).
2. Add a state and a transition.
3. Dispatch from a Svelte component (imperative) and from the store
   (reactive).
4. Cancelling an animation on state exit.

## Data flow

```
Component ──dispatch(event)──▶ machine.send
                                    │
                                    ├── exit hook (old state)
                                    ├── action mutates context
                                    ├── state := target
                                    ├── entry hook (new state)
                                    │     │
                                    │     └── may call play(name, el)
                                    │              │
                                    │              └── registry invokes fn,
                                    │                   returns handle
                                    └── notify subscribers ──▶ Svelte store
                                                                    │
                                                                    └── components re-render
```

Entry/exit hooks are the expected place to start and stop animations
tied to state lifetimes. The imperative `play` is available to anyone
for one-shot effects that are not part of a state transition.

## Removal list

Delete outright:

- `src/site/game/cutscene.js`
- `src/site/game/fx.js`
- Any import of the above (`main.js`, components)
- The drift-stage → censor-flash subscription in `src/site/main.js`
- Cutscene overlay DOM inserted by `cutscene.js`

Edit:

- `src/site/styles/global.css`:
  - Remove `transition` from link hover/focus rules
  - Remove `transition` and the `transform: translateY(-1px)` hover
    rule in ArticleCard card styles. The colour/border hover change
    stays (it is a style, not an animation), but it will snap instead
    of crossfade.
  - Remove the drift colour `transition` blocks and the
    `prefers-reduced-motion` override for them
  - Remove the `[data-driftable]` selector chain if it only carried
    transitions
  - Keep the `.skip-link` `translateY(-120%)` → `translateY(0)` focus
    rule
- `src/site/components/ArticleCard.svelte`:
  - Remove `transform` and `transition` from `.card__hit` / headline
  - Leave colour/border changes on hover; they just snap now
- `src/site/main.js`:
  - Delete drift-stage animation subscription
  - Keep the drift stage store update (data lives on)
- `src/site/App.svelte`, `src/site/pages/*`:
  - Remove any direct calls to `cutscene.play()` / `fx.*`

Keep unchanged:

- `gsap`, `pixi.js`, `howler` entries in `package.json`
- Drift stage calculation (`articleOpenCount` → stage) in the store

## Error handling

| Situation | Behaviour |
|-----------|-----------|
| `dispatch` of event with no handler in current state | Silent in prod; `console.warn` in dev |
| Transition `target` not in `states` | Throw `Error` at `send` time |
| `play` of unregistered name | `console.warn`; return no-op handle |
| Animation fn throws synchronously | Error propagates to caller; handle is never returned |
| Animation fn rejects its `done` promise | Caller's responsibility; registry does not swallow |

Dev vs prod is determined by `import.meta.env.DEV` (Vite).

## Testing

Unit tests (Vitest, no DOM):

- `machine.test.js`
  - Initial state is `config.initial`
  - `send` of unknown event is a no-op and does not notify
  - `send` of defined event: exit old, apply action, enter new, notify
    once, in that order
  - Self-transition re-fires exit then entry
  - `send` with undefined target throws
  - `subscribe` emits current state synchronously, then on each
    transition, and `unsubscribe` stops further emissions
  - `getContext` returns a frozen shallow copy
- `registry.test.js`
  - `register` then `play` invokes the fn with `(target, opts)`
  - `play` of unknown name returns a no-op handle and warns
  - `prefers-reduced-motion` is reflected in `opts.reducedMotion`
    (mock `matchMedia`)
  - Handle `stop` and `done` are passed through from the animation fn

No integration or browser tests for this change. Nothing is animated.

## Files touched

Created:

- `src/site/fx/machine.js`
- `src/site/fx/registry.js`
- `src/site/fx/index.js`
- `src/site/fx/README.md`
- `src/site/fx/machine.test.js`
- `src/site/fx/registry.test.js`

Deleted:

- `src/site/game/cutscene.js`
- `src/site/game/fx.js`
- `src/site/game/` directory if empty after the above

Edited:

- `src/site/main.js`
- `src/site/App.svelte`
- `src/site/components/ArticleCard.svelte` (and any other components
  with animation imports)
- `src/site/styles/global.css`

## Open questions

None.
