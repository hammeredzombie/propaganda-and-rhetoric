# World

Canonical worldbuilding reference. Defines the universe the game is
set in, the in-world publication that reports on it, and the tonal
conventions that apply across the project.

## Structure

The repository title — *Propaganda and Rhetoric* — partitions into
two named halves, one per half of the project.

| Half       | Location                        | Name                 |
|------------|---------------------------------|----------------------|
| Propaganda | `src/site/` (Svelte + Vite)     | *The Proper Goose*   |
| Rhetoric   | `project.godot` + `game/`       | *Rhetorica*          |

*Rhetorica* is the universe. *The Proper Goose* is a newspaper
published within it. The public site at proper-goose.com is, in
fiction, an online edition of that newspaper. Site content must
therefore be internally consistent with *Rhetorica*. The site is
not part of the game submission, but its content is canonical to
the same world.

## Rhetorica

Rhetorica is a nation in which public argument is the primary
mechanism of political legitimacy. Law, authority, and allegiance
are established through formal and informal rhetoric. The Godot
game is set within this nation.

Rationale for the name:

- **Classical register.** *Rhetorica* parses as a place name
  (Latinate; comparable in form to *Britannica* or *America*) rather
  than a label for a concept.
- **Thematic without literalism.** The name echoes the project's
  theme word without naming the concept outright. *Oratoria* and
  *Dialectica* were rejected for reading as labels of the concept
  rather than as proper nouns.
- **Extensibility.** A nation name accommodates later additions —
  factions, cities, regimes, historical periods — without requiring
  a rename of the world.

Specific worldbuilding detail — geography, factions, historical
periods, current political state, characters, calendar — is not
defined here. It will be developed as the game requires and
documented in `narrative.md` and `characters.md`.

## The Proper Goose

*The Proper Goose* is a regime-aligned newspaper within Rhetorica.
The title is a phonetic approximation of *propaganda*. The tagline
is *"All the news that stays on-message."*

Editorial voice is neutral broadsheet: passive constructions,
unnamed sources, no explicit editorialization. The publication does
not argue positions overtly; effect is achieved through omission,
sanitization, and redefinition of terms.

Site-level design and typography guidelines are maintained in
[`../src/site/.impeccable.md`](../src/site/.impeccable.md), which
governs layout, palette, type system, and visual drift states for
the site half.

## Tonal convention

The two names are intentionally mismatched in register. The
mismatch is a design constraint, not an accident.

- *The Proper Goose* is informal and absurd: a deliberately
  unserious name for a regime publication.
- *Rhetorica* is formal and restrained: a plausible nation name.

Both registers are required. Moving either name toward the other's
register weakens the project:

- If Rhetorica adopts an informal register (e.g. animal-parallel
  names), the project reads as a single-note joke.
- If *The Proper Goose* adopts a restrained register (e.g. *The
  Daily Record*), the site's editorial drift reads as generic
  dystopia rather than as ironic propaganda.

### Naming guidance for new content

- Content appearing **within** *The Proper Goose* — headlines,
  bylines, advertisements, section titles, in-world brands —
  follows the informal, bureaucratic, faintly cheerful register.
- Content appearing **within** Rhetorica — place names, faction
  names, characters, historical events, offices — follows the
  restrained, formal, plausible register.

When a proposed name is ambiguous, classify by which surface it
will appear on and name accordingly.

## Rejected names

Recorded to prevent re-evaluation.

- *Rhett or Rick* — functions as a one-line pun; insufficient
  weight as a universe name.
- *The Wretched Ostrich*, *Rhetoric Retriever*, and other
  animal-parallel forms — duplicate the informal register of *The
  Proper Goose* and collapse the tonal contrast.
- *Oratoria*, *Dialectica*, *Sophia* — thematically appropriate but
  read as labels for rhetoric rather than as proper nouns for a
  place.
- *The Agora*, *The Long Forum*, *Chorus*, *The Stoa* — lack a
  phonetic connection to the theme word and read as setting flavor
  rather than as proper names.

## Cross-repository constraints

- The site may reference Rhetorica as companion worldbuilding. It
  must remain presentable as a functioning website; the in-fiction
  premise holds only if the site does not read as a game.
- The Godot submission is bound by Ludum Dare Compo rules: 48
  hours, solo, all original content. The site is not part of the
  submission and is not subject to those rules, but its content is
  canonical and must not contradict the game.
- If site and game canon diverge, the game is authoritative. Site
  corrections are applied without annotation, consistent with the
  in-world publication's editorial pattern.
