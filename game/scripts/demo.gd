extends Node3D

## Demo room bootstrapper. Assigns placeholder textures so the scene is
## visible before any Procreate PNGs exist, then bakes the navigation mesh.

@onready var floor_mesh: MeshInstance3D = $NavRegion/Floor/Mesh
@onready var ceiling_mesh: MeshInstance3D = $NavRegion/Ceiling
@onready var wall_meshes: Array[MeshInstance3D] = [
	$NavRegion/WallN/Mesh,
	$NavRegion/WallS/Mesh,
	$NavRegion/WallE/Mesh,
	$NavRegion/WallW/Mesh,
]
@onready var nav_region: NavigationRegion3D = $NavRegion


func _ready() -> void:
	_apply_placeholder_materials()
	await get_tree().process_frame
	nav_region.bake_navigation_mesh()


func _apply_placeholder_materials() -> void:
	var floor_tex := PlaceholderTexture.make_checker(64, 8, Color(0.22, 0.22, 0.26), Color(0.14, 0.14, 0.18))
	var wall_tex := PlaceholderTexture.make_wall(64)
	var ceil_tex := PlaceholderTexture.make_checker(64, 16, Color(0.08, 0.08, 0.1), Color(0.05, 0.05, 0.07))

	floor_mesh.material_override = _make_pixel_material(floor_tex)
	ceiling_mesh.material_override = _make_pixel_material(ceil_tex)
	for wm in wall_meshes:
		wm.material_override = _make_pixel_material(wall_tex)


func _make_pixel_material(tex: Texture2D) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_texture = tex
	mat.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	mat.uv1_scale = Vector3(5, 5, 1)
	return mat
