# Doom-style first-person framework

Godot 4.6 project. Runs out of the box with procedural placeholder textures
so you can drop in Procreate PNGs as you draw them.

## Run it

Open `project.godot` in Godot 4.6, press **F5** (or set `demo.tscn` as the
main scene — it already is).

## Controls

- **WASD** — move
- **Mouse** — look
- **Left click** — interact / click Continue
- **Esc** — release mouse

## What's in the demo

- A 20×20 m walled room with a lit floor, walls, and ceiling.
- A first-person `CharacterBody3D` player with mouse-look, gravity, and a
  centre-screen crosshair.
- Two billboard-sprite NPCs wandering on a runtime-baked
  `NavigationRegion3D`.
- A `Dialogue` autoload. When the crosshair is over an NPC and you click,
  their dialogue appears; **Continue** closes it and they resume wandering.

## File map

```
game/
  assets/sprites/        # drop Procreate PNGs here
  scenes/
    demo.tscn            # main scene: room + player + NPCs
    player.tscn          # CharacterBody3D + Camera + crosshair
    npc.tscn             # billboard sprite + NavigationAgent
    dialogue.tscn        # autoloaded CanvasLayer UI
  scripts/
    demo.gd              # applies placeholders, bakes navmesh
    player.gd            # FPS controller + interact raycast
    npc.gd               # random wander + interact()
    dialogue.gd          # show_line() / opened / closed
    placeholder_texture.gd   # generates stand-in textures
```

## Adding real art

See `assets/sprites/README.md` for PNG conventions. In short:

- NPCs — drag a PNG onto the `Sprite Texture` export of an NPC instance.
- Walls / floor / ceiling — replace the `material_override` on the relevant
  `MeshInstance3D` in `demo.tscn` with a `StandardMaterial3D` pointing at
  your PNG and set `texture_filter = Nearest`.

## Extending

- **New NPC dialogue** — set `display_name` and `dialogue_line` on the NPC
  instance in the Inspector, or call `Dialogue.show_line(...)` from any script.
- **New rooms** — duplicate `demo.tscn`, rearrange the walls under
  `NavRegion`, and the navmesh will re-bake at runtime.
- **Multiple lines per NPC** — extend `npc.gd`'s `interact()` to loop through
  an `Array[String]` of lines, re-calling `Dialogue.show_line()` each time
  the `closed` signal fires.
