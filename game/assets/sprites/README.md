# Sprites

Drop PNGs exported from Procreate here. Everything in this folder is intended
to be consumed as a `Texture2D` by `Sprite3D` (NPCs) or `StandardMaterial3D`
(walls / floor / ceiling).

## Rules of thumb for Doom-style PNGs

- **Transparency** – use a transparent background; NPCs and props are cut out
  per-pixel (`alpha_cut = DISCARD`).
- **Resolution** – small is fine. 64×128 for an NPC holds up beautifully when
  pixel-filtered. Don't go above 512 on any axis unless you want silky edges.
- **Square or 1:2** – NPCs are happiest at a 1:2 aspect (portrait). `pixel_size`
  on the `Sprite3D` controls world-space scale (default `0.02` → 64px tall
  sprite is ~1.28m tall in-world).
- **Facing** – sprites billboard toward the camera. If you want pseudo-3D
  directional sprites later, switch `billboard` off and swap textures based on
  viewing angle.
- **Colour** – the project-wide default texture filter is Nearest, so your
  line work stays crisp. Paint at final pixel size if you can.

## Using a sprite

1. Export from Procreate as **PNG, transparent background**.
2. Save into this folder (any subfolder is fine, e.g. `sprites/npcs/margot.png`).
3. In the Godot Inspector, select the NPC scene (or an instance in `demo.tscn`)
   and drag the PNG onto the `Sprite Texture` field on the `NPC` script.
4. Godot will auto-import the PNG. To tune the import, open its `.import`
   sibling or edit per-project defaults in `Project > Project Settings >
   Import Defaults > Texture`.

## For walls / floors / ceilings

Edit the materials on `NavRegion/Floor/Mesh`, `NavRegion/Ceiling`, or any
`NavRegion/Wall*/Mesh` node in `demo.tscn`, and replace `material_override`
with a `StandardMaterial3D` pointing at your PNG. Remember to set
`texture_filter = Nearest` on that material for the pixel-art look.

Until you do, the `demo.gd` script paints placeholder checker/brick textures
so the scene is never blank.
