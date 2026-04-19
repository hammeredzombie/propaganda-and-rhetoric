# Docs

Project-level documentation spanning both halves of the monorepo:
*The Proper Goose* (`src/site/`) and *Rhetorica* (`project.godot` +
`game/`).

Subsystem-specific documentation lives with its subsystem.
Site-specific documentation is in `src/site/docs/`. Godot-only
technical notes may live here under `tech.md` until they require a
dedicated directory.

## Current documents

- [`world.md`](./world.md) — canonical worldbuilding reference.
  Defines *Rhetorica* (the universe), *The Proper Goose* (the
  in-world publication), the relationship between them, and the
  tonal conventions applied across both halves.

## Planned documents

Create each file when real content exists. Do not create empty
stubs.

- `design.md` — design pillars, core loop, mechanics, systems.
  Includes explicit non-goals.
- `narrative.md` — story arc, scene beats, branching structure, and
  the relationship between player input on the site and world state
  in the game.
- `characters.md` — named cast across both halves: bylines in the
  publication and figures in the game.
- `art.md` — visual direction for the Godot half. Site visual
  direction is maintained in `src/site/.impeccable.md`; this
  document addresses the Godot half and identifies points where the
  two must remain visually consistent.
- `audio.md` — music and sound-effect direction across both halves.
- `tech.md` — Godot architecture, scene tree, save system, input
  handling, and any integration between the game and the site.
- `submission.md` — Ludum Dare Compo submission checklist:
  deliverables, Compo-rule compliance (48 hours, solo, all original
  content), and the handoff from local build to LD entry.

## Conventions

- Start with flat files. Promote a topic to a subdirectory only when
  a single file becomes difficult to navigate.
- Document rationale alongside decisions. A statement of *what*
  without *why* is not maintainable across time.
- Link rather than duplicate. If information belongs in a subsystem
  document, link to it from here.
- Keep all project documentation in a technical register.
  Evocative prose belongs in in-game and on-site content, not in
  project docs, comments, or commit messages.
