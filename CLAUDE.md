# Propaganda and Rhetoric

Monorepo for two linked-but-separate projects:

| Path | What it is |
|------|------------|
| `src/site/` | **The Daily Record**, a fictional online publication. Svelte + Vite static site, deployed to proper-goose.com. |
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
