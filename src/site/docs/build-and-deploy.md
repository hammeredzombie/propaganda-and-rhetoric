# Build and deploy

All commands run from `src/site/`.

## Dev

```bash
npm run dev
```

- Vite dev server at `http://localhost:5173`
- Hot-reloads on file changes

## Production build

```bash
npm run build
```

- Output goes to `dist/` (inside `src/site/`)
- Minified, hashed, gzipped
- Uses `base: '/'` — assets resolve from the domain root. The site is
  served from the root of proper-goose.com, so this is correct. Do
  **not** change to `'./'` unless you're deploying under a subpath.

## Preview

```bash
npm run preview
```

- Serves `dist/` at `http://localhost:4173`
- The closest local approximation to production

## Deploy to proper-goose.com

Static build — deploy `dist/` anywhere that serves files.

Recommended: **Cloudflare Pages**.

1. Connect the repo to Cloudflare Pages
2. Build command: `cd src/site && npm install && npm run build`
3. Build output directory: `src/site/dist`
4. Add `proper-goose.com` as a custom domain
5. DNS: point an `A`/`CNAME` at Cloudflare's target (or delegate DNS
   to Cloudflare for automatic config)

Netlify, Vercel, GitHub Pages, or S3 + CloudFront all work with the
same `dist/` output.

## Pre-deploy checklist

- [ ] `npm run build` runs clean
- [ ] `npm run preview` loads without console errors
- [ ] Every article opens from the front page
- [ ] Back button returns to the front page
- [ ] Refreshing on an article page still loads it (hash routing survives reload)
- [ ] Cutscene can be skipped with Esc and click
- [ ] localStorage reset does the right thing (first-time state)
- [ ] Publication name, masthead, and all copy are fictional — no real
      outlets, mastheads, or URLs

## Bundle size

Current gzipped sizes (subject to change as content grows):

- JS: ~190 kB gzipped
- CSS: ~3 kB gzipped
- HTML: ~0.5 kB

Pixi accounts for ~120 kB gzipped alone. Budget:

- Under ~250 kB gzipped JS → fine on even slow connections
- Under ~500 kB gzipped JS → fine on typical broadband
- Above that → investigate. Readers bounce on slow first paint.

Ways to shrink if needed:

- Remove PixiJS (drop `pixi.js` from `package.json`, remove
  `fx.init()`, delete `fx.js`). ~120 kB gzipped saved.
- Remove Howler if you don't ship audio. ~8 kB gzipped saved.
- Remove GSAP if cutscenes become CSS-only. ~15 kB gzipped saved.
- Tree-shake PixiJS by importing only what you need.

## First-interactive budget

Aim for under ~5 seconds on a typical connection. Items that slow
first paint:

- Google Fonts — already `preconnect`ed; consider self-hosting for
  the extra ~200ms
- The PixiJS chunk is imported from `game/fx.js` which is imported
  from `main.js`. If boot feels slow, move `fx.init()` to after first
  user interaction.
- Big images — convert to WebP, lazy-load below-the-fold

## Local dry run before deploying

```bash
npm run build
cd dist
python3 -m http.server 8080
# open http://localhost:8080 in a fresh incognito window
```

Incognito avoids cached state. If the site works fresh with no dev
server, you're ready to push.
