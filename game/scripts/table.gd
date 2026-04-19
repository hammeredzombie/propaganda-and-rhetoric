extends StaticBody3D

## Sprite furniture: Y-billboards smoothly toward the camera. Horizontal mirroring
## toggles when the viewer crosses table-local thresholds (in front / behind, or
## left / right of the prop), not by snapping rotation.

@export var pixel_size: float = 0.003306452
@export var orientation_enabled: bool = true
## Extra radians on billboard Y if the art faces the wrong way in world space.
@export var y_rotation_offset: float = 0.0
## How much camera pitch (look up/down) tweaks uniform scale -- 0 disables.
@export var view_pitch_scale_amount: float = 0.12
@export var mirror_x_when_behind_table: bool = true
@export var mirror_x_when_left_of_table: bool = false
## Widen the front/back and left/right dividing planes so the mirror does not
## chatter when dot_f or dot_r hovers near zero. 0 = flip exactly on the plane.
@export var mirror_hysteresis: float = 0.12

@onready var sprite: Sprite3D = $Sprite
@onready var collider: CollisionShape3D = $CollisionShape3D

var _base_sprite_scale: Vector3 = Vector3.ONE
var _behind_mirror: bool = false
var _left_mirror: bool = false
var _mirror_states_initialized: bool = false


func _ready() -> void:
	var tex := sprite.texture
	if not tex:
		return
	sprite.pixel_size = pixel_size
	sprite.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	sprite.shaded = false
	sprite.alpha_cut = SpriteBase3D.ALPHA_CUT_DISCARD
	sprite.billboard = BaseMaterial3D.BILLBOARD_DISABLED

	var h_world: float = tex.get_height() * pixel_size
	sprite.position.y = h_world * 0.5
	_base_sprite_scale = sprite.scale

	var box := collider.shape as BoxShape3D
	if not box:
		return
	var w_world: float = tex.get_width() * pixel_size
	box.size = Vector3(w_world * 0.55, 0.38, w_world * 0.42)
	collider.position.y = box.size.y * 0.5

	set_process(orientation_enabled)


func _process(_delta: float) -> void:
	if not orientation_enabled:
		return
	var cam := get_viewport().get_camera_3d()
	if not cam or not sprite:
		return

	var p := global_position
	var c := cam.global_position
	var dx := c.x - p.x
	var dz := c.z - p.z
	if dx * dx + dz * dz < 1e-8:
		return

	sprite.global_rotation = Vector3(0.0, atan2(dx, dz) + y_rotation_offset, 0.0)

	var to_viewer := c - p
	to_viewer.y = 0.0
	to_viewer = to_viewer.normalized()

	var forward := -global_transform.basis.z
	forward.y = 0.0
	if forward.length_squared() < 1e-8:
		forward = Vector3(0, 0, -1)
	forward = forward.normalized()

	var right := global_transform.basis.x
	right.y = 0.0
	if right.length_squared() < 1e-8:
		right = Vector3(1, 0, 0)
	right = right.normalized()

	var dot_f: float = to_viewer.dot(forward)
	var dot_r: float = to_viewer.dot(right)

	_update_mirror_states(dot_f, dot_r)

	var s := _base_sprite_scale
	if mirror_x_when_behind_table and _behind_mirror:
		s.x *= -1.0
	if mirror_x_when_left_of_table and _left_mirror:
		s.x *= -1.0

	if view_pitch_scale_amount > 0.0:
		var pitch := cam.rotation.x
		var t: float = cos(pitch)
		var u: float = 1.0 + view_pitch_scale_amount * (t - 1.0)
		sprite.scale = s * u
	else:
		sprite.scale = s


func _update_mirror_states(dot_f: float, dot_r: float) -> void:
	var h: float = mirror_hysteresis

	if h <= 0.0:
		if mirror_x_when_behind_table:
			_behind_mirror = dot_f < 0.0
		if mirror_x_when_left_of_table:
			_left_mirror = dot_r < 0.0
		_mirror_states_initialized = true
		return

	if not _mirror_states_initialized:
		if mirror_x_when_behind_table:
			_behind_mirror = dot_f < 0.0
		if mirror_x_when_left_of_table:
			_left_mirror = dot_r < 0.0
		_mirror_states_initialized = true
		return

	if mirror_x_when_behind_table:
		if not _behind_mirror and dot_f < -h:
			_behind_mirror = true
		elif _behind_mirror and dot_f > h:
			_behind_mirror = false

	if mirror_x_when_left_of_table:
		if not _left_mirror and dot_r < -h:
			_left_mirror = true
		elif _left_mirror and dot_r > h:
			_left_mirror = false
