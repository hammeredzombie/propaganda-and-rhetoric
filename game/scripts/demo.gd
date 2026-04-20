extends Node3D

const GROUND_TEXTURE: Texture2D = preload("res://game/assets/textures/ground_texture.png")
const WALL_POSTER_TEXTURE: Texture2D = preload("res://game/assets/sprites/goosetapo.png")

## Z positions for east/west wall tables (same rows; excludes north / back wall).
const WALL_POSTER_ROW_Z: Array[float] = [7.5, 2.5, -2.5, -7.5]
const WALL_POSTER_PIXEL_SIZE: float = 0.0028
## Room wall mesh height (demo.tscn); poster Y is prior placement + 10% of this.
const ROOM_WALL_HEIGHT: float = 3.0
const WALL_POSTER_Y: float = 1.875 + ROOM_WALL_HEIGHT * 0.1
const WALL_INNER_X: float = 9.76

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
@onready var corkboard: Sprite3D = $NavRegion/Corkboard
@onready var music: AudioStreamPlayer = $Music
@onready var machine_gun: AudioStreamPlayer = $MachineGun


func _ready() -> void:
	corkboard.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	_spawn_wall_posters()
	_apply_placeholder_materials()
	await get_tree().process_frame
	nav_region.bake_navigation_mesh()
	GamePopup.show_start()
	GamePopup.started.connect(_on_started)


func _on_started() -> void:
	_start_music_loop()
	_start_machine_gun_loop()


func _start_music_loop() -> void:
	await get_tree().create_timer(5.0).timeout
	while true:
		music.play()
		await music.finished
		await get_tree().create_timer(9.0).timeout


func _start_machine_gun_loop() -> void:
	await get_tree().create_timer(18.0).timeout
	while true:
		machine_gun.play()
		await machine_gun.finished
		await get_tree().create_timer(randf_range(18.0, 33.0)).timeout


func _spawn_wall_posters() -> void:
	var holder := Node3D.new()
	holder.name = "WallPosters"
	nav_region.add_child(holder)

	var i := 0
	for z in WALL_POSTER_ROW_Z:
		i += 1
		var west := _make_wall_poster(WALL_POSTER_TEXTURE, "Poster_W_%d" % i)
		west.transform = Transform3D(Basis().rotated(Vector3.UP, -PI / 2.0), Vector3(-WALL_INNER_X, WALL_POSTER_Y, z))
		holder.add_child(west)

		var east := _make_wall_poster(WALL_POSTER_TEXTURE, "Poster_E_%d" % i)
		east.transform = Transform3D(Basis().rotated(Vector3.UP, PI / 2.0), Vector3(WALL_INNER_X, WALL_POSTER_Y, z))
		holder.add_child(east)


func _make_wall_poster(tex: Texture2D, node_name: String) -> Sprite3D:
	var s := Sprite3D.new()
	s.name = node_name
	s.texture = tex
	s.pixel_size = WALL_POSTER_PIXEL_SIZE
	s.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	s.billboard = BaseMaterial3D.BILLBOARD_DISABLED
	s.shaded = false
	s.alpha_cut = SpriteBase3D.ALPHA_CUT_DISCARD
	return s


func _apply_placeholder_materials() -> void:
	var wall_tex := PlaceholderTexture.make_wall(64)
	var ceil_tex := PlaceholderTexture.make_checker(64, 16, Color(0.08, 0.08, 0.1), Color(0.05, 0.05, 0.07))

	floor_mesh.material_override = _make_pixel_material(GROUND_TEXTURE)
	ceiling_mesh.material_override = _make_pixel_material(ceil_tex)
	for wm in wall_meshes:
		wm.material_override = _make_pixel_material(wall_tex)


func _make_pixel_material(tex: Texture2D) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_texture = tex
	mat.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	mat.uv1_scale = Vector3(5, 5, 1)
	return mat
