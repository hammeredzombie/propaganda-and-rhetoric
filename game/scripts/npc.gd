class_name NPC
extends CharacterBody3D

## Random-wandering billboard NPC. Assign a Texture2D in the Inspector for the
## sprite; if none is supplied a placeholder is generated at runtime so the
## scene is usable before any Procreate PNGs exist.
##
## Movement is direct steering + move_and_slide (no NavigationAgent). Tables
## and walls are StaticBodies; the capsule slides around them.

@export var display_name: String = "Stranger"
@export_multiline var dialogue_line: String = "Hello, friend. The air here tastes like tin."
@export var sprite_texture: Texture2D
@export var sprite_tint: Color = Color(0.85, 0.25, 0.35)

@export var move_speed: float = 1.8
@export var wander_radius: float = 6.0
@export var wait_time_min: float = 1.0
@export var wait_time_max: float = 3.5
@export var arrival_distance: float = 0.5
@export var gravity: float = 20.0

@onready var sprite: Sprite3D = $Sprite
@onready var wait_timer: Timer = $WaitTimer

var _home: Vector3
var _wander_target: Vector3
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

	wait_timer.timeout.connect(_pick_new_target)
	await get_tree().process_frame
	_pick_new_target()


func _physics_process(delta: float) -> void:
	if _idle:
		velocity.x = 0.0
		velocity.z = 0.0
	else:
		var to_target := _wander_target - global_position
		to_target.y = 0.0
		if to_target.length() <= arrival_distance:
			velocity.x = 0.0
			velocity.z = 0.0
			_start_waiting()
		else:
			var dir := to_target.normalized()
			velocity.x = dir.x * move_speed
			velocity.z = dir.z * move_speed
			look_at(global_position + Vector3(dir.x, 0.0, dir.z), Vector3.UP)

	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = 0.0

	move_and_slide()


func _pick_new_target() -> void:
	var angle := randf() * TAU
	var dist := randf_range(1.5, wander_radius)
	_wander_target = _home + Vector3(cos(angle) * dist, 0.0, sin(angle) * dist)
	_wander_target.y = _home.y
	_idle = false


func _start_waiting() -> void:
	_idle = true
	wait_timer.wait_time = randf_range(wait_time_min, wait_time_max)
	wait_timer.start()


func interact(_who: Node) -> void:
	_idle = true
	wait_timer.stop()
	velocity.x = 0.0
	velocity.z = 0.0
	Dialogue.show_line(dialogue_line, display_name)
	if not Dialogue.closed.is_connected(_resume_after_dialogue):
		Dialogue.closed.connect(_resume_after_dialogue, CONNECT_ONE_SHOT)


func _resume_after_dialogue() -> void:
	_start_waiting()
