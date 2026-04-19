# Propaganda and Rhetoric

Monorepo for two linked-but-separate projects:

| Path | What it is |
|------|------------|
| `src/site/` | **The Daily Record**, a fictional online publication. Svelte + Vite static site, deployed to proper-goose.com. |
| `src/counter-goose/` | **Counter-Goose** HTML5 jam build: Vite + vanilla JS (raycaster + corkboard). `npm run pack:ldjam` → zip with `index.html` at root for Ludum Dare embedding (948×533). |
| `project.godot` + `game/` | The **Ludum Dare Compo** game. Godot 4.6 project at repo root. Submitted to LD; hosts its own source. |

The site at proper-goose.com is standalone. The Godot game may
reference or link to it as companion worldbuilding, but the site is
not part of any LD submission and is not bound by Compo rules
(48h / solo / all-original-content).

## Working on the site

```bash
cd src/site
npm install
npm run dev        # http://localhost:5173
npm run build      # → src/site/dist/
npm run preview    # http://localhost:4173
```

Site-specific docs live in `src/site/docs/` (architecture, content,
cutscenes, FX + audio, styling, build + deploy). Site-specific README
is `src/site/README.md`.

## Counter-Goose (HTML5 / Ludum Dare embed)

```bash
cd src/counter-goose
npm install
npm run dev
npm run build              # default Vite build → dist/
npm run pack:ldjam         # build with embed rules + counter-goose-ldjam.zip (upload contents: index.html at zip root)
```

Embed build sets `VITE_LDJAM_EMBED=1` (via `.env.ldjam`): fixed **948×533** shell, no `window.open` to external URLs (dialog instead), no `fetch`/`localStorage` usage in the game code. Upload the zip under Ludum Dare’s **Embedding** section.

## Working on the Godot game

Open `project.godot` in Godot 4.6+. Scenes live in `game/scenes/`,
assets in `game/assets/`. Keep it isolated from the site — different
toolchain, different release cadence, different submission. The
`.godot/` editor cache is gitignored.

## Tech stack (site)

- **Vite + Svelte** — static build, HMR, scoped CSS
- **GSAP** — timeline-driven cutscenes and reveals
- **PixiJS** — full-screen canvas overlay for particles / flashes
- **Howler.js** — sprites, fade, autoplay-policy handling
- **localStorage** — persistence under key `propaganda-and-rhetoric:v1`

## Deploy (site)

- `base: '/'` in `src/site/vite.config.js` — served from domain root
- `npm run build` in `src/site/` produces static output in
  `src/site/dist/`
- Host on Cloudflare Pages / Netlify / Vercel / any static host
- Point proper-goose.com DNS at the host

## Editorial rules (for the fiction)

- The Daily Record is a fictional publication — no real outlet names,
  logos, mastheads, or URLs
- No real copyrighted photos or article text
- Original art; reference photos as visual study, not traced
- Fonts via Google Fonts (license permits web use)

## Copy policy — Lorem Ipsum is the placeholder, leave it alone

The site copy is intentionally Lorem Ipsum placeholder and must stay
that way until an explicit content freeze. Do **not** upgrade Lorem
Ipsum to English, period-flavored, or in-fiction copy — not even as
part of a "polish" or "design" pass. Content will be written later,
on purpose, and premature voice-specific copy creates rework.

Lorem Ipsum lives in (non-exhaustive):

- `src/site/game/articles.js` — headlines, decks, kickers, dateline,
  lede, body paragraphs, pull-quote text and attribution
- `src/site/game/ads.js` — every ad's kicker, brand, headline, body,
  footnote, signature, classifieds items
- `src/site/pages/**/*.svelte` — any in-page section heading
  (e.g. "Inside This Edition" is placeholder, not a real label)

The only committed real copy is the **site header and footer**:

- `src/site/components/Masthead.svelte` — nameplate, tagline, volume,
  date, submasthead dateline band
- `src/site/components/Nav.svelte` — section link labels
- `src/site/components/Footer.svelte` — column headings, fine print

Functional UI strings are not editorial copy and may stay in English:
the `Advertisement` disclosure label, coupon field labels (`Name`,
`Street`, `Town`, `District`), the `By` byline prefix, byline
metadata (author name, role, date, read time), the
`Continued on Page A4, Col. 3` format marker.

When adding a new component or ad variant, fill any new copy slots
with Lorem Ipsum too — never invent prose for them.
