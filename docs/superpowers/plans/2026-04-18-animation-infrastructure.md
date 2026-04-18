# Animation Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete every animation currently rendered on the site, then add a tiny FSM + animation registry + dispatch layer under `src/site/fx/` so future animations can be triggered by events.

**Architecture:** Three small modules — `machine.js` (state machine core), `registry.js` (animation lookup), `index.js` (singleton wiring + Svelte readable store). Day one ships with empty state config and an empty registry; callers fill them in as animations are added. The `gsap`, `pixi.js`, and `howler` dependencies stay in `package.json` for future use.

**Tech Stack:** Svelte 4, Vite 5, Vitest (added by this plan), no new runtime deps.

---

## Spec

Canonical design: `docs/superpowers/specs/2026-04-18-animation-infrastructure-design.md`. Any disagreement between this plan and the spec is resolved in favour of the spec.

## File Structure

Files created:

- `src/site/fx/machine.js` — FSM factory; `send`, `subscribe`, `getState`, `getContext`.
- `src/site/fx/registry.js` — animation registry factory; `register`, `play`.
- `src/site/fx/index.js` — singleton machine + registry + Svelte `state` store + re-exported API.
- `src/site/fx/README.md` — usage doc (four patterns).
- `src/site/fx/machine.test.js` — Vitest unit tests.
- `src/site/fx/registry.test.js` — Vitest unit tests.
- `src/site/vitest.config.js` — Vitest config (jsdom environment off; pure JS tests).

Files deleted:

- `src/site/game/fx.js`
- `src/site/game/cutscene.js`
- `src/site/docs/cutscenes.md`
- `src/site/docs/fx-and-audio.md`

Files modified:

- `src/site/main.js` — drop `fx`/`cutscene` imports; drop `fx.init()` and censor-flash subscription; keep drift-stage data attribute write.
- `src/site/App.svelte` — remove `<canvas id="fx-overlay">` and its style block.
- `src/site/pages/FrontPage.svelte` — remove `fx` import and `fx.inkSplash` call.
- `src/site/components/ArticleCard.svelte` — remove `transition`, `transform: translateY(-1px)` on `.card__hit` hover/focus, and `transition: color` on `.card__headline`.
- `src/site/styles/global.css` — delete cutscene CSS block, drift transition block, prefers-reduced-motion transition override; remove link `transition`.
- `src/site/package.json` — add `vitest` devDependency and `test` script.
- `src/site/docs/README.md` — remove links to deleted docs.
- `src/site/docs/architecture.md` — remove cutscene/fx references; point at `src/site/fx/`.
- `src/site/docs/build-and-deploy.md` — remove lines about cutscene removal / PixiJS chunk coming from `game/fx.js`.
- `src/site/README.md` — remove cutscene/fx bullet points.
- `src/site/.impeccable.md` — remove the two sentences naming cutscenes and PixiJS ink-splash.

Files untouched (explicit decision):

- `src/site/game/state.js`, `events.js`, `audio.js`, `articles.js`, `router.js` — data + routing stays.
- `src/site/package.json` dependencies block (keep `gsap`, `pixi.js`, `howler`).
- `.skip-link` focus transform in `global.css` (accessibility affordance, not decoration).

---

## Phase 1 — Remove existing animations

The site must build and load correctly after each task.

### Task 1: Remove `fx.inkSplash` call from FrontPage

**Files:**
- Modify: `src/site/pages/FrontPage.svelte:7, 29-36`

- [ ] **Step 1: Edit FrontPage.svelte — remove the import line**

Delete line 7 (`import { fx } from '../game/fx.js';`).

- [ ] **Step 2: Edit FrontPage.svelte — simplify `openArticle`**

Replace the existing `openArticle` function (lines 29–36) with:

```js
function openArticle(article) {
  state.markArticleRead(article.id);
  goToArticle(article.id);
}
```

The `event` parameter and coord calculation go away. The `<ArticleCard ... onOpen={openArticle} />` callers already pass the event as the second argument; dropping it on the receiving side is fine because JS ignores extra args.

- [ ] **Step 3: Verify site builds**

Run: `cd src/site && npm run build`
Expected: exits 0, no errors referencing `fx` or `inkSplash`.

- [ ] **Step 4: Commit**

```bash
git add src/site/pages/FrontPage.svelte
git commit -m "$(cat <<'EOF'
refactor(site): drop ink-splash trigger from article open

Part of removing the site's animation layer ahead of the new
FSM-driven fx infrastructure.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Remove fx/cutscene usage from main.js

**Files:**
- Modify: `src/site/main.js:5, 9-26, 36`

- [ ] **Step 1: Edit main.js — remove the `fx` import**

Delete line 5 (`import { fx } from './game/fx.js';`).

- [ ] **Step 2: Edit main.js — simplify the drift subscription**

Replace lines 9–26 with:

```js
state.subscribe((s) => {
  const count = s.articleOpenCount || 0;
  const stage =
    count >= 5 ? 'censored' : count >= 3 ? 'loud' : count >= 2 ? 'warm' : 'pristine';
  if (document.documentElement.dataset.drift !== stage) {
    document.documentElement.dataset.drift = stage;
  }
});
```

The `prevDriftStage` tracker and `fx.censorFlash` setTimeout block are gone. The drift stage *data attribute* still flips on the html element; the crossfade CSS that reacted to it is removed in Task 5.

- [ ] **Step 3: Edit main.js — remove `fx.init()`**

Delete the `fx.init();` line (was line 36). Leave `audio.init();` in place.

- [ ] **Step 4: Verify site builds**

Run: `cd src/site && npm run build`
Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/site/main.js
git commit -m "$(cat <<'EOF'
refactor(site): drop fx wiring from entry point

Drift-stage data attribute still flips on the root element; the
censor-flash side effect and fx.init are removed.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Remove the Pixi fx overlay canvas from App.svelte

**Files:**
- Modify: `src/site/App.svelte:25, 41-48`

- [ ] **Step 1: Edit App.svelte — remove the canvas element**

Delete line 25 (`<canvas id="fx-overlay" aria-hidden="true"></canvas>`).

- [ ] **Step 2: Edit App.svelte — remove the canvas style rule**

Delete the `#fx-overlay { ... }` block (lines 41–48 in the `<style>` section).

- [ ] **Step 3: Verify site builds**

Run: `cd src/site && npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/site/App.svelte
git commit -m "$(cat <<'EOF'
refactor(site): drop fx-overlay canvas

Nothing renders into it now; the Pixi application that used it
is being removed.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Delete fx.js and cutscene.js

**Files:**
- Delete: `src/site/game/fx.js`
- Delete: `src/site/game/cutscene.js`

- [ ] **Step 1: Confirm no remaining references**

Run from repo root:

```bash
grep -rn --include='*.svelte' --include='*.js' -E "from .+(fx|cutscene)\\.js" src/site
```

Expected: no output. If any match remains, fix that file before proceeding.

- [ ] **Step 2: Delete both files**

```bash
git rm src/site/game/fx.js src/site/game/cutscene.js
```

- [ ] **Step 3: Verify site builds**

Run: `cd src/site && npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
chore(site): remove fx.js and cutscene.js

These modules are replaced by the new src/site/fx/ infrastructure
introduced in Phase 2 of this change.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Strip cutscene + drift-transition CSS from global.css

**Files:**
- Modify: `src/site/styles/global.css:119-129, 204-282, 308-391`

- [ ] **Step 1: Remove the link `transition` rule**

In the `a { ... }` block (around lines 119–124), delete the `transition: border-color 120ms ease, color 120ms ease;` line. The resulting block is:

```css
a {
  color: var(--color-link);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}
```

- [ ] **Step 2: Delete the cutscene CSS block**

Delete everything from the `/* ── Cutscene overlay ── … */` comment through the closing brace of `.cutscene-hint` (lines 204 through 282 in the current file). That removes `.cutscene-overlay`, `.cutscene-overlay[data-open="true"]`, `.cutscene-stage`, `.cutscene-frame`, `.cutscene-frame__eyebrow`, `.cutscene-frame__headline`, `.cutscene-frame__body`, `.cutscene-hint`.

- [ ] **Step 3: Delete the drift-transition block**

Delete everything from the `/* Drift transitions — …` comment through the end of the file (lines 308–391). That removes the big selector chain applying `transition: background-color …` for drift stages, and the `@media (prefers-reduced-motion: reduce)` override with the same selector chain.

- [ ] **Step 4: Sanity check the file**

Run: `cd src/site && npm run build`
Expected: exits 0. No CSS errors.

- [ ] **Step 5: Visual check — dev server**

Run: `cd src/site && npm run dev`
Open http://localhost:5173. Confirm:
- Front page renders.
- Clicking an article still navigates (no splash, no overlay).
- Hover on links and cards snaps (no fade).
- Drift stages still change the html `data-drift` attribute (inspect element; colours now switch instantly rather than crossfade).
- Skip-link still slides in on keyboard focus (only motion left).

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/site/styles/global.css
git commit -m "$(cat <<'EOF'
style(site): strip animated CSS — cutscene block, drift transitions, link fade

Drift stage data still switches instantly. Skip-link focus slide
is retained as an accessibility affordance.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Strip hover animation from ArticleCard

**Files:**
- Modify: `src/site/components/ArticleCard.svelte:50-76, 96-102`

- [ ] **Step 1: Remove the transition and transform on `.card__hit`**

In the `<style>` block, replace the `.card__hit`, `.card__hit:hover`, and `.card__hit:focus-visible` rules (lines 50–76) with:

```css
.card__hit {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.card__hit:focus-visible {
  outline: 2px solid var(--color-ink-strong);
  outline-offset: 2px;
}

.card__hit:hover .card__headline,
.card__hit:focus-visible .card__headline {
  color: var(--color-ink-strong);
}
```

The hover `transform: translateY(-1px)` is gone; the focus-visible outline stays.

- [ ] **Step 2: Remove the `transition: color` on `.card__headline`**

In the `.card__headline` rule (around lines 96–102), delete the `transition: color 150ms ease;` line. The block becomes:

```css
.card__headline {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-ink);
  margin: 0 0 var(--space-2);
}
```

- [ ] **Step 3: Verify site builds**

Run: `cd src/site && npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/site/components/ArticleCard.svelte
git commit -m "$(cat <<'EOF'
style(site): drop card hover lift and headline colour fade

Focus outline and hover colour change are retained (style, not motion).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Final removal-phase smoke check

**Files:** none.

- [ ] **Step 1: Build the site**

Run: `cd src/site && npm run build`
Expected: exits 0, no warnings referencing `gsap`, `pixi`, `howler`, `cutscene`, `fx`, `inkSplash`, or `censorFlash`.

- [ ] **Step 2: Confirm the site game dir no longer contains fx/cutscene**

Run: `ls src/site/game`
Expected output (order may vary):

```
articles.js
audio.js
events.js
router.js
state.js
```

- [ ] **Step 3: Confirm no orphan references remain**

Run from repo root:

```bash
grep -rn --include='*.svelte' --include='*.js' --include='*.css' -E "(inkSplash|censorFlash|cutscene\.|fx\.(init|inkSplash|censorFlash|flash))" src/site
```

Expected: no output.

No commit — this is a read-only check.

---

## Phase 2 — Add the FSM + registry + dispatch infrastructure

### Task 8: Add Vitest

**Files:**
- Modify: `src/site/package.json`
- Create: `src/site/vitest.config.js`

- [ ] **Step 1: Install Vitest as a devDependency**

Run:

```bash
cd src/site && npm install --save-dev vitest@^2.1.0
```

Expected: `vitest` appears in `devDependencies` in `src/site/package.json`.

- [ ] **Step 2: Add a `test` script**

Edit `src/site/package.json` so the `scripts` block is:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Write `vitest.config.js`**

Create `src/site/vitest.config.js`:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['fx/**/*.test.js'],
    globals: false
  }
});
```

- [ ] **Step 4: Verify the test runner starts (nothing to run yet)**

Run: `cd src/site && npm test`
Expected: `No test files found` (or similar). Exit code 0 or 1 is fine — the runner loaded.

- [ ] **Step 5: Commit**

```bash
git add src/site/package.json src/site/package-lock.json src/site/vitest.config.js
git commit -m "$(cat <<'EOF'
chore(site): add vitest for fx infrastructure unit tests

Tests run under the node environment; the fx modules are pure JS
with no DOM dependency.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Build the FSM core (TDD)

**Files:**
- Create: `src/site/fx/machine.test.js`
- Create: `src/site/fx/machine.js`

- [ ] **Step 1: Write the failing tests**

Create `src/site/fx/machine.test.js`:

```js
import { describe, it, expect, vi } from 'vitest';
import { createMachine } from './machine.js';

function baseConfig(overrides = {}) {
  return {
    initial: 'idle',
    context: { count: 0 },
    states: {
      idle: {
        on: {
          TICK: {
            target: 'active',
            action: (ctx) => ({ ...ctx, count: ctx.count + 1 })
          },
          NOOP: { target: 'idle' }
        },
        entry: vi.fn(),
        exit: vi.fn()
      },
      active: {
        on: {
          STOP: { target: 'idle' }
        },
        entry: vi.fn(),
        exit: vi.fn()
      }
    },
    ...overrides
  };
}

describe('createMachine', () => {
  it('starts in the configured initial state', () => {
    const m = createMachine(baseConfig());
    expect(m.getState()).toBe('idle');
  });

  it('returns the initial context', () => {
    const m = createMachine(baseConfig());
    expect(m.getContext()).toEqual({ count: 0 });
  });

  it('freezes the context snapshot it returns', () => {
    const m = createMachine(baseConfig());
    const ctx = m.getContext();
    expect(Object.isFrozen(ctx)).toBe(true);
  });

  it('ignores events with no handler in the current state', () => {
    const m = createMachine(baseConfig());
    const listener = vi.fn();
    m.subscribe(listener);
    listener.mockClear();
    m.send('UNKNOWN');
    expect(m.getState()).toBe('idle');
    expect(listener).not.toHaveBeenCalled();
  });

  it('runs exit, then action, then entry on a transition', () => {
    const config = baseConfig();
    const order = [];
    config.states.idle.exit = () => order.push('exit-idle');
    config.states.idle.on.TICK.action = (ctx) => {
      order.push('action');
      return { ...ctx, count: ctx.count + 1 };
    };
    config.states.active.entry = () => order.push('entry-active');

    const m = createMachine(config);
    m.send('TICK');

    expect(order).toEqual(['exit-idle', 'action', 'entry-active']);
    expect(m.getState()).toBe('active');
    expect(m.getContext()).toEqual({ count: 1 });
  });

  it('passes context and event to hooks', () => {
    const config = baseConfig();
    const m = createMachine(config);
    m.send('TICK', { id: 42 });

    expect(config.states.idle.exit).toHaveBeenCalledWith(
      { count: 0 },
      { type: 'TICK', payload: { id: 42 } }
    );
    expect(config.states.active.entry).toHaveBeenCalledWith(
      { count: 1 },
      { type: 'TICK', payload: { id: 42 } }
    );
  });

  it('re-fires exit and entry on a self-transition', () => {
    const config = baseConfig();
    const m = createMachine(config);
    m.send('NOOP');
    expect(config.states.idle.exit).toHaveBeenCalledTimes(1);
    expect(config.states.idle.entry).toHaveBeenCalledTimes(1);
    expect(m.getState()).toBe('idle');
  });

  it('throws when a transition target is not a defined state', () => {
    const config = baseConfig({
      initial: 'idle',
      context: {},
      states: {
        idle: { on: { BAD: { target: 'nowhere' } } }
      }
    });
    const m = createMachine(config);
    expect(() => m.send('BAD')).toThrow(/unknown target state: nowhere/i);
  });

  it('notifies subscribers synchronously on subscribe, then on each transition', () => {
    const m = createMachine(baseConfig());
    const listener = vi.fn();
    m.subscribe(listener);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toEqual({
      state: 'idle',
      context: { count: 0 }
    });

    m.send('TICK');
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener.mock.calls[1][0]).toEqual({
      state: 'active',
      context: { count: 1 }
    });
  });

  it('unsubscribe stops further emissions', () => {
    const m = createMachine(baseConfig());
    const listener = vi.fn();
    const unsub = m.subscribe(listener);
    listener.mockClear();
    unsub();
    m.send('TICK');
    expect(listener).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd src/site && npm test`
Expected: every test in `machine.test.js` fails with an import error (module does not exist).

- [ ] **Step 3: Implement `machine.js`**

Create `src/site/fx/machine.js`:

```js
export function createMachine(config) {
  const states = config.states || {};
  if (!states[config.initial]) {
    throw new Error(`initial state not in states: ${config.initial}`);
  }

  let currentState = config.initial;
  let context = { ...(config.context || {}) };
  const listeners = new Set();

  function snapshot() {
    return { state: currentState, context: Object.freeze({ ...context }) };
  }

  function notify() {
    const snap = snapshot();
    for (const fn of listeners) fn(snap);
  }

  function send(type, payload) {
    const def = states[currentState];
    const transition = def?.on?.[type];
    if (!transition) return;

    if (!states[transition.target]) {
      throw new Error(`unknown target state: ${transition.target}`);
    }

    const event = { type, payload };

    states[currentState].exit?.(context, event);

    if (typeof transition.action === 'function') {
      const next = transition.action(context, event);
      if (next && typeof next === 'object') context = next;
    }

    currentState = transition.target;

    states[currentState].entry?.(context, event);

    notify();
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn(snapshot());
    return () => listeners.delete(fn);
  }

  function getState() {
    return currentState;
  }

  function getContext() {
    return Object.freeze({ ...context });
  }

  return { send, subscribe, getState, getContext };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd src/site && npm test`
Expected: all `machine.test.js` tests pass; exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/site/fx/machine.js src/site/fx/machine.test.js
git commit -m "$(cat <<'EOF'
feat(fx): add state machine core

Small FSM factory with send/subscribe/getState/getContext, entry/exit
hooks, and context mutation via transition actions. Self-transitions
re-fire hooks. Unknown targets throw.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Build the animation registry (TDD)

**Files:**
- Create: `src/site/fx/registry.test.js`
- Create: `src/site/fx/registry.js`

- [ ] **Step 1: Write the failing tests**

Create `src/site/fx/registry.test.js`:

```js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRegistry } from './registry.js';

const originalMatchMedia = globalThis.matchMedia;

function mockMatchMedia(matches) {
  globalThis.matchMedia = vi.fn().mockReturnValue({
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  });
}

beforeEach(() => {
  mockMatchMedia(false);
});

afterEach(() => {
  globalThis.matchMedia = originalMatchMedia;
});

describe('createRegistry', () => {
  it('play invokes the registered fn with target and opts', () => {
    const r = createRegistry();
    const fn = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    r.register('splash', fn);
    const target = { id: 't' };
    r.play('splash', target, { duration: 100 });
    expect(fn).toHaveBeenCalledTimes(1);
    const [gotTarget, gotOpts] = fn.mock.calls[0];
    expect(gotTarget).toBe(target);
    expect(gotOpts).toMatchObject({ duration: 100, reducedMotion: false });
  });

  it('play passes reducedMotion=true when the media query matches', () => {
    mockMatchMedia(true);
    const r = createRegistry();
    const fn = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    r.register('splash', fn);
    r.play('splash', null, {});
    expect(fn.mock.calls[0][1].reducedMotion).toBe(true);
  });

  it('play returns the handle the animation fn returned', () => {
    const r = createRegistry();
    const handle = { stop: vi.fn(), done: Promise.resolve() };
    r.register('x', () => handle);
    expect(r.play('x', null, {})).toBe(handle);
  });

  it('play of an unknown name warns and returns a no-op handle', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const r = createRegistry();
    const handle = r.play('nope', null, {});
    expect(warn).toHaveBeenCalled();
    expect(typeof handle.stop).toBe('function');
    await expect(handle.done).resolves.toBeUndefined();
    handle.stop();
    warn.mockRestore();
  });

  it('register with a duplicate name overwrites the previous fn', () => {
    const r = createRegistry();
    const first = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    const second = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    r.register('same', first);
    r.register('same', second);
    r.play('same', null, {});
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('play with no opts still supplies reducedMotion', () => {
    const r = createRegistry();
    const fn = vi.fn(() => ({ stop: () => {}, done: Promise.resolve() }));
    r.register('z', fn);
    r.play('z', null);
    expect(fn.mock.calls[0][1]).toEqual({ reducedMotion: false });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd src/site && npm test`
Expected: all `registry.test.js` tests fail with import error.

- [ ] **Step 3: Implement `registry.js`**

Create `src/site/fx/registry.js`:

```js
const NOOP_HANDLE = Object.freeze({
  stop() {},
  done: Promise.resolve()
});

function reducedMotionPreferred() {
  if (typeof globalThis.matchMedia !== 'function') return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
}

export function createRegistry() {
  const animations = new Map();

  function register(name, fn) {
    animations.set(name, fn);
  }

  function play(name, target, opts) {
    const fn = animations.get(name);
    if (!fn) {
      console.warn(`[fx] unknown animation: ${name}`);
      return NOOP_HANDLE;
    }
    const mergedOpts = { ...(opts || {}), reducedMotion: reducedMotionPreferred() };
    return fn(target, mergedOpts);
  }

  return { register, play };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd src/site && npm test`
Expected: all `machine.test.js` and `registry.test.js` tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/site/fx/registry.js src/site/fx/registry.test.js
git commit -m "$(cat <<'EOF'
feat(fx): add animation registry

register(name, fn) / play(name, target, opts) with automatic
reducedMotion flag sourced from matchMedia. Unknown names warn and
return a shared no-op handle.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Wire the singleton and Svelte store

**Files:**
- Create: `src/site/fx/index.js`

- [ ] **Step 1: Write `index.js`**

Create `src/site/fx/index.js`:

```js
import { readable } from 'svelte/store';
import { createMachine } from './machine.js';
import { createRegistry } from './registry.js';

export const machine = createMachine({
  initial: 'idle',
  context: {},
  states: {
    idle: {}
  }
});

const registry = createRegistry();

export function dispatch(event, payload) {
  machine.send(event, payload);
}

export function register(name, fn) {
  registry.register(name, fn);
}

export function play(name, target, opts) {
  return registry.play(name, target, opts);
}

export const state = readable(
  { state: machine.getState(), context: machine.getContext() },
  (set) => machine.subscribe(set)
);
```

- [ ] **Step 2: Verify the module imports cleanly**

Run: `cd src/site && node --input-type=module -e "import('./fx/index.js').then(m => console.log(Object.keys(m).sort().join(',')))"`

Expected stdout: `dispatch,machine,play,register,state`

If `svelte/store` fails to resolve from that invocation, skip this check — Vite's bundling will resolve it. In that case, run `npm run build` instead; the build should succeed because `index.js` is not imported anywhere yet, but the file will be parsed by Vite if any later import picks it up. A plain syntax check is sufficient here:

```bash
cd src/site && node --check fx/index.js
```

Expected: exits 0 (syntax OK).

- [ ] **Step 3: Run the unit tests**

Run: `cd src/site && npm test`
Expected: pre-existing `machine.test.js` and `registry.test.js` still pass. `index.js` has no tests by design — it is a thin wiring module whose behaviour is covered by the two factory tests.

- [ ] **Step 4: Commit**

```bash
git add src/site/fx/index.js
git commit -m "$(cat <<'EOF'
feat(fx): singleton machine + registry + dispatch + Svelte store

Day-one config is an empty idle state and empty registry. Svelte
components can subscribe with \$state; the rest of the site can
call dispatch, register, and play by name.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Write the fx README

**Files:**
- Create: `src/site/fx/README.md`

- [ ] **Step 1: Write the doc**

Create `src/site/fx/README.md`:

````markdown
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
// somewhere in app startup
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
Replace that config when you want to model more of the app.
Example: add a `reading` state with a hook.

```js
// fx/index.js
import { play } from './index.js'; // circular-safe because ESM

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
      entry: (ctx) => play('shake', document.body),
      on: { ARTICLE_CLOSE: { target: 'idle' } }
    }
  }
});
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
````

- [ ] **Step 2: Commit**

```bash
git add src/site/fx/README.md
git commit -m "$(cat <<'EOF'
docs(fx): add README with four usage patterns

Covers registering an animation, extending the machine, dispatching
from Svelte, and cancelling on state exit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Tidy the surrounding docs

### Task 13: Delete and update docs that described the old system

**Files:**
- Delete: `src/site/docs/cutscenes.md`
- Delete: `src/site/docs/fx-and-audio.md`
- Modify: `src/site/docs/README.md`
- Modify: `src/site/docs/architecture.md`
- Modify: `src/site/docs/build-and-deploy.md`
- Modify: `src/site/README.md`
- Modify: `src/site/.impeccable.md`

- [ ] **Step 1: Delete the two docs that described deleted code**

```bash
git rm src/site/docs/cutscenes.md src/site/docs/fx-and-audio.md
```

- [ ] **Step 2: Update `src/site/docs/README.md`**

Remove any row or bullet that links to `cutscenes.md` or `fx-and-audio.md`. Replace with a single row linking to the new fx README:

```
| [../fx/README.md](../fx/README.md) | Animation infrastructure — FSM + registry + dispatch. |
```

- [ ] **Step 3: Update `src/site/docs/architecture.md`**

Replace any mention of `cutscene.js`, `fx.js`, "GSAP cutscene overlay", "ink splash", or the `cutscene:start` / `cutscene:end` events with a pointer to the new `src/site/fx/` module. Representative line to replace is currently around line 105 (`### cutscene.js / fx.js / audio.js`) — rename the section to `### fx/ and audio.js` and describe only `audio.js` plus the new fx module.

- [ ] **Step 4: Update `src/site/docs/build-and-deploy.md`**

Remove the lines that describe "Remove GSAP if cutscenes become CSS-only" and "The PixiJS chunk is imported from `game/fx.js`" (currently around lines 82 and 92). Replace with a single sentence: "GSAP, Pixi, and Howler are installed but unused on day one; registered animations may import them as needed."

- [ ] **Step 5: Update `src/site/README.md`**

Remove the bullets mentioning "cutscene.js — GSAP timelines + overlay + prebuilt library", "GSAP — cutscene timelines", "First visit → `intro` cutscene plays", and "On the third article open → `deeper` cutscene plays". Add a one-line bullet pointing at `fx/README.md` for the animation infrastructure.

- [ ] **Step 6: Update `src/site/.impeccable.md`**

Remove the sentence describing "state-driven cutscenes" and the sentence "cutscenes and PixiJS ink-splash must have reduced-motion fallbacks that…". Leave the rest of the file intact.

- [ ] **Step 7: Confirm no stale references remain**

Run:

```bash
grep -rn --include='*.md' -E "(cutscene|inkSplash|censorFlash|game/fx\\.js|game/cutscene\\.js)" src/site
```

Expected: no output.

- [ ] **Step 8: Build one more time**

Run: `cd src/site && npm run build`
Expected: exits 0.

- [ ] **Step 9: Commit**

```bash
git add src/site/docs src/site/README.md src/site/.impeccable.md
git commit -m "$(cat <<'EOF'
docs(site): retire cutscene/fx.js docs; point at new fx/ module

Deletes cutscenes.md and fx-and-audio.md. Trims stale mentions of
the old GSAP cutscene overlay and PixiJS ink-splash from README,
architecture, build-and-deploy, and .impeccable.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Done-when

- `src/site/game/fx.js` and `src/site/game/cutscene.js` no longer exist.
- `grep -rn --include='*.svelte' --include='*.js' --include='*.css' -E "(inkSplash|censorFlash|cutscene)" src/site` returns no output.
- `cd src/site && npm run build` succeeds.
- `cd src/site && npm test` reports both `machine.test.js` and `registry.test.js` passing.
- `src/site/fx/index.js` exists and exports `dispatch`, `register`, `play`, `state`, `machine`.
- `src/site/fx/README.md` documents the four usage patterns.
- Hovering a card no longer lifts. Clicking an article no longer splashes. Drift stage still switches the `data-drift` attribute but no longer crossfades. `.skip-link` focus slide is retained.
