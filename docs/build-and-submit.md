# Build and submit

## Dev

```bash
npm run dev
```

- Vite dev server at `http://localhost:5173`
- Hot-reloads on file changes
- Use this while working

## Production build

```bash
npm run build
```

- Output goes to `dist/`
- Minified, hashed, gzipped
- Uses `base: './'` — relative asset paths — so the build works when
  embedded under an arbitrary subpath on Ludum Dare's hosting

## Preview

```bash
npm run preview
```

- Serves `dist/` at `http://localhost:4173`
- This is the closest you can get locally to how LD will serve it
- **Always run preview before zipping for submission**

## Zipping for LD submission

```bash
npm run build
cd dist
zip -r ../propaganda-and-rhetoric.zip .
cd ..
```

Critical: **zip the contents of `dist/`, not the `dist/` folder
itself**. `index.html` must be at the root of the zip.

Test the zip by extracting it somewhere and opening `index.html` in
a browser. (Most browsers will run it directly because paths are
relative; if it doesn't, the build's base path is wrong.)

## Submission checklist

- [ ] `npm run build` runs clean
- [ ] `npm run preview` loads without console errors
- [ ] Every article opens from the front page
- [ ] Back button returns to the front page
- [ ] Refreshing on an article page still loads it (hash routing survives reload)
- [ ] Cutscene can be skipped with Esc and click
- [ ] localStorage reset does the right thing (first-time state)
- [ ] Zipped bundle is under the current LD size limit
- [ ] `index.html` is at the zip root, not inside a `dist/` folder
- [ ] Source code is publicly available (GitHub repo or source zip)
- [ ] Publication name, masthead, and all copy are fictional

## The `base: './'` gotcha

Vite defaults to `base: '/'` which generates absolute paths in the
output (`/assets/index.js`). This breaks on LD's hosting because
the game is served from a subpath like `/html/12345/`.

`vite.config.js` sets `base: './'` so the built HTML references
`./assets/…`, which works under any subpath. **Don't change this**
unless you know exactly why.

## Bundle size

Current gzipped sizes (subject to change as content grows):

- JS: ~190 kB gzipped
- CSS: ~3 kB gzipped
- HTML: ~0.5 kB

Pixi accounts for ~120 kB gzipped alone. Budget:

- Under ~250 kB gzipped JS → fine on even slow connections
- Under ~500 kB gzipped JS → fine on typical broadband
- Above that → LD players bounce. Investigate.

Ways to shrink if needed:

- Remove PixiJS (drop `pixi.js` from package.json, remove
  `fx.init()`, delete `fx.js`). ~120 kB gzipped saved.
- Remove Howler if you don't ship audio. ~8 kB gzipped saved.
- Remove GSAP if cutscenes become CSS-only. ~15 kB gzipped saved.
- Tree-shake PixiJS by importing only what you need (currently
  importing `Application, Container, Graphics, Ticker` — can drop
  further if you're just doing flashes).

## First-interactive budget

Aim for under ~5 seconds on a typical connection. Items that slow
first paint:

- Google Fonts — already `preconnect`ed; consider self-hosting if
  you need the extra ~200ms
- The PixiJS chunk loads lazily (it's imported from
  `game/fx.js` which imports on `main.js`). If boot feels slow,
  move `fx.init()` to after first user interaction.
- Big images — convert to WebP, lazy-load below-the-fold

## Source publication

The Compo requires source to be public. Two paths:

1. **Push to GitHub** — clean, searchable, people can fork. Remember
   to include `README.md` and `LICENSE` if you care about terms of
   reuse.
2. **Include a `source.zip`** on the LD entry page — minimum viable.

Both are acceptable. GitHub is friendlier to reviewers who want to
understand how you built it.

## Post-deadline changes (what's allowed)

- **Bug fixes** — allowed with a short changelog in the entry
- **New features** — not allowed in the Compo submission window
- **Porting** — allowed (e.g. ship a Windows build later)

Keep a `CHANGELOG.md` in the repo if you make post-deadline fixes.

## Local dry run before submission

```bash
npm run build
cd dist
python3 -m http.server 8080
# open http://localhost:8080 in a fresh incognito window
```

Incognito avoids cached state. If the game works fresh, in a browser,
with no dev server, you're ready to zip.
