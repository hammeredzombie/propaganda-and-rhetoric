# Propaganda and Rhetoric — Ludum Dare Compo Entry

A game that looks and operates like an online news publication (AP News-style),
built solo in 48 hours for the Ludum Dare Compo.

## Event context

- **Category:** Ludum Dare Compo (solo, 48 hours, all content made during the event)
- **Submission:** Direct upload to Ludum Dare website (verify current size limits and supported formats before packaging)
- **Source code:** Must be included and shared publicly — Compo requirement

## Compo rules recap (what constrains this project)

- Solo work only
- All content (art, music, SFX, copy) created during the 48 hours
- Code, libraries, frameworks, base-code are all fair game
- Fonts are exempt — use any licensed font
- Photos: only allowed if captured during the event
- Content generators (AI, sfxr, etc.) are allowed but require opting out of categories where they did ≥90% of the work
- Brushes / texture masks / loops / samples allowed only as raw material for derivative works
- Reference photos are fine; tracing form or photobashing into the final image is a "bad derivative"
- Publication must be fictional — no real outlet names, logos, photos, or copyrighted article text

## Tech stack

### Build & framework
- **Vite** — dev server, HMR, static build output
- **Svelte** — components for article cards, ad slots, masthead; scoped CSS; built-in transitions
  - Vanilla JS is a valid fallback if Svelte feels heavy mid-jam

### Animation
- **GSAP** — timeline-driven cutscenes, DOM/SVG/canvas from one API
- **GSAP ScrollTrigger** — scroll-driven reveals (fits the news-site feel)
- CSS transitions for simple state changes

### Visual effects
- **PixiJS** — full-screen canvas overlay (pointer-events: none) for particles, distortion, glitch FX
- **CSS filters + SVG filters** — cheap effects (blur, hue-rotate, displacement, scanlines)
- Reach for PixiJS only when CSS can't do it

### Audio
- **Howler.js** — sprites, fade, pan, preload, autoplay-policy handling
- **Tone.js** only if doing procedural / generative music

### Save system
- **localStorage** for JSON state (progress, read articles, flags)
- **idb** wrapper over IndexedDB only if binary data or large volume is needed
- Wrap in a `save.js` module with `load()` / `save()` / `reset()`

### Asset pipeline
- **Procreate** → PNG export with transparency
- Convert to **WebP** with `cwebp` for 50–80% size reduction
- Sprite animation: frame sequence → CSS `steps()` sprite sheet or PixiJS AnimatedSprite
- Cutscene video: MP4 export from Procreate (keep under a few MB) or frame sequence driven by GSAP

### Typography
- Serif body (Georgia, Charter) + condensed sans headline (Oswald, Bebas)
- Google Fonts is fine — fonts are a Compo exemption

## Project structure

```
src/
  routes/              # pages (SvelteKit) or plain pages/
    index.html         # front page
    article/[id].html  # article template
  components/
    ArticleCard.svelte
    AdSlot.svelte
    Masthead.svelte
    Headline.svelte
    Byline.svelte
    PullQuote.svelte
  game/
    state.js           # game state + save/load
    events.js          # game event system
    cutscene.js        # GSAP timeline orchestrator
    fx.js              # PixiJS overlay controller
    audio.js           # Howler wrapper
  assets/
    art/               # Procreate exports (WebP preferred)
    audio/             # Howler sprites
    fonts/             # licensed fonts
public/
  (static, unbundled files)
```

## Scope budget (48 hours)

| Hour  | Focus |
|-------|-------|
| 0–4   | Theme interpretation + core game loop design |
| 4–10  | News site shell + 1–2 hero article layouts |
| 10–24 | Main interaction / gameplay logic |
| 24–32 | Procreate asset batch (between dev sessions) |
| 32–40 | 1–2 cutscenes + FX layer |
| 40–46 | Audio + save system + polish |
| 46–48 | Submission packaging |

**Cut first if slipping:**
1. PixiJS overlay → CSS filters only
2. Multiple cutscenes → one opening + one ending
3. Procedural audio → pre-baked Howler sprites

## Asset workflow rules (Compo-compliant)

- Procreate art: original silhouette, composition, pose must be mine
- Reference photos: look at them on a separate canvas, never trace form
- Photobashing: only if source is unrecognizable in the final — otherwise skip
- Textures from brush packs (e.g. RetroSupply): fine as raw material for derivatives, not as finished content
- Document Procreate layer history as process evidence in case of questions

## Build & submission

- `base: './'` in `vite.config.js` — Vite defaults to absolute paths which break in embedded players
- `npm run build` → zip contents of `dist/` (not the folder itself)
- `index.html` at the root of the zip
- Test `npm run preview` before zipping
- Verify LD direct-upload size limit and format before final packaging
- Source code: publish publicly (GitHub repo link or source zip)

## Gotchas

- **Audio autoplay:** kick off first sound on user interaction (first article click), not on load
- **Vite base path:** `'./'` or the build breaks when embedded
- **Asset size:** first-interactive under ~5s; players bounce on slow LD entries
- **AI usage:** code/co-pilot is unrestricted; if AI writes >90% of any scorable category content, opt out

## AI & tooling notes

- Code-level AI assistance (copilots): no opt-out required
- No scoring category for writing, so AI-generated article copy is fine scoring-wise, but still document tool use
- All Procreate art is solo-created during the 48h → Graphics category stays in

## What not to include

- Real news outlet names, logos, mastheads, URLs
- Real photos from news sites or stock libraries (unless captured by me during the event)
- Real copyrighted article text
- Pre-made assets of any kind (sprites, audio, music) from before the event
