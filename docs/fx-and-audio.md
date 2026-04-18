# FX and Audio

## Visual FX — `src/game/fx.js`

A transparent PixiJS canvas sits above the entire DOM as
`#fx-overlay`. Its `pointer-events` are `none`, so it never
intercepts clicks. Use it for particles, flashes, distortion.

### Available FX

**`fx.inkSplash({ x, y, count, color })`**
Spawns `count` particles at `(x, y)` that fan out, fall, and fade.

```js
import { fx } from './game/fx.js';

fx.inkSplash({
  x: e.clientX,
  y: e.clientY,
  count: 14,
  color: 0xa01818
});
```

Defaults: 14 particles, red ink, at screen center if no coords.

**`fx.flash({ color, duration, opacity })`**
A full-screen color flash that fades out.

```js
fx.flash({ color: 0xfffaf0, duration: 120, opacity: 0.7 });
```

### Adding new FX

All FX follow the same pattern: create Pixi Graphics, stage them on
`app.stage`, tick them with a `Ticker`, destroy when finished.

```js
function glitchBar({ y = 0, height = 8, color = 0xff0000 } = {}) {
  if (!ready) return;
  const bar = new Graphics();
  bar.rect(0, y, app.screen.width, height).fill({ color, alpha: 0.9 });
  app.stage.addChild(bar);
  const start = performance.now();
  const ticker = new Ticker();
  ticker.add(() => {
    const t = (performance.now() - start) / 160;
    bar.x = Math.sin(t * 40) * 6;
    if (t >= 1) {
      app.stage.removeChild(bar);
      bar.destroy();
      ticker.stop();
      ticker.destroy();
    }
  });
  ticker.start();
}
// Export it by adding to the exported object at the bottom of fx.js
```

### Triggering FX

Two patterns:

1. **Direct call** — `fx.inkSplash(...)` in a click handler.
2. **Event-driven** — listen for a game event and fire FX.

```js
import { events } from './game/events.js';
events.on('cutscene:start', () => fx.flash({ opacity: 0.4 }));
```

### Performance note

Pixi is ~120 kB gzipped. If FX feels like a luxury mid-jam, you can:

- Remove `fx.init()` from `main.js` to stop loading it.
- Replace individual FX calls with CSS animations (keyframed
  overlays, `filter: blur/hue-rotate`, SVG displacement filters).
- Drop `pixi.js` from `package.json` for a big bundle-size win.

The `fx.inkSplash` call sites are all in `FrontPage.svelte`
(`openArticle` handler). Only one place to find and replace.

## Audio — `src/game/audio.js`

Howler.js wrapped in a minimal registry. Three reasons we use Howler
instead of raw Web Audio:

1. It handles the autoplay-unlock dance cross-browser.
2. Sprites mean one audio file for all SFX (fewer network requests).
3. API is simple: `register`, `play`, `stop`, `mute`.

### Autoplay unlock

`audio.init()` binds `pointerdown` and `keydown` listeners that
resume the audio context on first interaction. This fires
`audio:unlocked` on the event bus and sets `state.audioUnlocked`.

If you want music to kick in at a specific moment instead of on
first click, wait for the event:

```js
events.once('audio:unlocked', () => audio.play('ambient'));
```

### Fake-play mode

Right now we register sounds with empty `src: []` arrays:

```js
// main.js
audio.register('cutscene_tick', { src: [] });
audio.register('article_open', { src: [] });
audio.register('ambient', { src: [], loop: true, volume: 0.4 });
```

Calling `audio.play('cutscene_tick')` with no src emits
`audio:play-fake` on the bus but makes no sound. This lets the rest
of the code reference sounds **before** you've made them. When the
real audio is ready, swap `src: []` for `src: ['./assets/audio/sfx.mp3']`
and the same `play()` calls will work without changes.

### Adding a real sound

1. Drop an audio file in `src/assets/audio/`. MP3 or OGG, 96–128 kbps
   is usually plenty for SFX.
2. Update the `audio.register(...)` call in `main.js`.
3. Build; Vite will bundle it with a hashed filename and rewrite
   paths. Use the `?url` import pattern if you want an explicit
   ref:

```js
import tickUrl from './assets/audio/cutscene_tick.mp3?url';
audio.register('cutscene_tick', { src: [tickUrl], volume: 0.5 });
```

### Sprites

A single audio file with multiple regions. Usually fastest path for
a Compo entry because you make all SFX in one DAW session and export
once.

```js
audio.register('sfx', {
  src: ['./assets/audio/sfx.mp3'],
  sprite: {
    tick:  [0,    140],
    click: [300,  120],
    swoosh:[600,  400]
  }
});

audio.play('sfx', { sprite: 'tick' });
```

### Playing a sound

```js
audio.play('cutscene_tick', { volume: 0.5 });
```

Returns a Howler sound ID (or `null` for fake sounds). Keep it if
you need to stop or fade that specific play:

```js
const id = audio.play('ambient');
// later
audio.stop('ambient'); // stops all plays of this registered sound
```

### Muting

```js
audio.mute(true);   // global mute
audio.mute(false);  // unmute
```

No mute UI is built yet. When you add one, call `audio.mute()` on
change and persist the flag via `state.setFlag('muted', true)`.

## Asset pipeline summary

```
Procreate (.procreate)
      │
      ▼
  Export PNG (transparency on)
      │
      ▼
  cwebp -q 80 in.png -o out.webp
      │
      ▼
  src/assets/art/out.webp
      │
      ▼
  Referenced in a Svelte component:
    <img src="./assets/art/out.webp" alt="" />
```

```
DAW (or sfxr / ChipTone / etc.)
      │
      ▼
  Export MP3 @ 96–128 kbps
      │
      ▼
  src/assets/audio/sfx.mp3
      │
      ▼
  Registered in main.js and played via audio.play(...)
```

For frame-sequence animations, use CSS `steps()` on a sprite sheet or
Pixi's `AnimatedSprite` for anything more dynamic. Cutscene videos
can be MP4 (small file, low bitrate) inlined as `<video autoplay muted>`
inside a cutscene frame override.
