class_name NPC
extends CharacterBody3D

## Random-wandering billboard NPC. Assign a Texture2D in the Inspector for the
## sprite; if none is supplied a placeholder is generated at runtime so the
## scene is usable before any Procreate PNGs exist.

@export var display_name: String = "Stranger"
@export_multiline var dialogue_line: String = "Hello, friend. The air here tastes like tin."
@export var sprite_texture: Texture2D
@export var sprite_tint: Color = Color(0.85, 0.25, 0.35)

@export var move_speed: float = 1.8
@export var wander_radius: float = 6.0
@export var wait_time_min: float = 1.0
@export var wait_time_max: float = 3.5

@onready var sprite: Sprite3D = $Sprite
@onready var agent: NavigationAgent3D = $NavigationAgent
@onready var wait_timer: Timer = $WaitTimer

var _home: Vector3
var _idle: bool = true


func _ready() -> void:
	_home = global_position
	if sprite_texture:
		sprite.texture = sprite_texture
	else:
		sprite.texture = PlaceholderTexture.make_npc(sprite_tint)
	sprite.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	sprite.pixel_size = 0.02
	sprite.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	sprite.shaded = false
	sprite.alpha_cut = SpriteBase3D.ALPHA_CUT_DISCARD

	agent.path_desired_distance = 0.4
	agent.target_desired_distance = 0.4
	agent.avoidance_enabled = false

	wait_timer.timeout.connect(_pick_new_target)
	await get_tree().create_timer(0.6).timeout
	_pick_new_target()


func _physics_process(_delta: float) -> void:
	if _idle or agent.is_navigation_finished():
		velocity = Vector3.ZERO
		if not _idle:
			_start_waiting()
		move_and_slide()
		return

	var next := agent.get_next_path_position()
	var dir := (next - global_position)
	dir.y = 0
	if dir.length() > 0.001:
		dir = dir.normalized()
		velocity.x = dir.x * move_speed
		velocity.z = dir.z * move_speed
		var look := global_position + Vector3(dir.x, 0, dir.z)
		look_at(look, Vector3.UP)
	move_and_slide()


func _pick_new_target() -> void:
	var attempts := 8
	while attempts > 0:
		attempts -= 1
		var angle := randf() * TAU
		var dist := randf_range(1.5, wander_radius)
		var candidate := _home + Vector3(cos(angle) * dist, 0, sin(angle) * dist)
		var map := get_world_3d().navigation_map
		var snapped := NavigationServer3D.map_get_closest_point(map, candidate)
		if snapped.distance_to(candidate) < 1.5:
			agent.target_position = snapped
			_idle = false
			return
	_start_waiting()


func _start_waiting() -> void:
	_idle = true
	wait_timer.wait_time = randf_range(wait_time_min, wait_time_max)
	wait_timer.start()


func interact(_who: Node) -> void:
	_idle = true
	wait_timer.stop()
	velocity = Vector3.ZERO
	Dialogue.show_line(dialogue_line, display_name)
	if not Dialogue.closed.is_connected(_resume_after_dialogue):
		Dialogue.closed.connect(_resume_after_dialogue, CONNECT_ONE_SHOT)


func _resume_after_dialogue() -> void:
	_start_waiting()
