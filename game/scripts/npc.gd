class_name NPC
extends CharacterBody3D

## Random-wandering billboard NPC. Assign a Texture2D in the Inspector for the
## sprite; if none is supplied a placeholder is generated at runtime so the
## scene is usable before any Procreate PNGs exist.
##
## Movement is direct steering + move_and_slide (no NavigationAgent). Tables
## and walls are StaticBodies; the capsule slides around them.
##
## Left-click (via player raycast) shows a short overhead dialogue panel; each
## NPC alternates the line independently on each click.

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

const BUBBLE_DURATION_SEC := 3.0
const LINE_MOMMY := "\"Mommy...?\""
const LINE_DADDY := "\"Daddy...?\""

@onready var sprite: Sprite3D = $Sprite
@onready var wait_timer: Timer = $WaitTimer

var _home: Vector3
var _wander_target: Vector3
var _idle: bool = true

var _next_line_is_mommy: bool = true
var _bubble_label: Label
var _bubble_sprite: Sprite3D
var _bubble_timer: Timer


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

	_setup_head_bubble()

	_bubble_timer = Timer.new()
	_bubble_timer.name = "BubbleTimer"
	_bubble_timer.wait_time = BUBBLE_DURATION_SEC
	_bubble_timer.one_shot = true
	add_child(_bubble_timer)
	_bubble_timer.timeout.connect(_on_bubble_timeout)

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


func _setup_head_bubble() -> void:
	var vp := SubViewport.new()
	vp.name = "HeadBubbleViewport"
	vp.disable_3d = true
	vp.transparent_bg = true
	vp.size = Vector2i(440, 100)
	vp.render_target_update_mode = SubViewport.UPDATE_WHEN_VISIBLE
	add_child(vp)

	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.06, 0.06, 0.08, 0.94)
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.border_color = Color(0.9, 0.85, 0.7)
	style.corner_radius_top_left = 4
	style.corner_radius_top_right = 4
	style.corner_radius_bottom_right = 4
	style.corner_radius_bottom_left = 4
	style.content_margin_left = 20
	style.content_margin_top = 16
	style.content_margin_right = 20
	style.content_margin_bottom = 16

	var vp_px := Vector2(vp.size)
	var panel := Panel.new()
	panel.name = "HeadBubblePanel"
	panel.position = Vector2.ZERO
	panel.size = vp_px

	var label := Label.new()
	label.name = "HeadBubbleLabel"
	label.position = Vector2(style.content_margin_left, style.content_margin_top)
	label.size = Vector2(
		vp_px.x - style.content_margin_left - style.content_margin_right,
		vp_px.y - style.content_margin_top - style.content_margin_bottom
	)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.add_theme_font_size_override(&"font_size", 18)
	label.add_theme_color_override(&"font_color", Color(0.94, 0.94, 0.96))
	panel.add_theme_stylebox_override(&"panel", style)
	panel.add_child(label)

	var root := Control.new()
	root.name = "HeadBubbleRoot"
	root.position = Vector2.ZERO
	root.size = vp_px
	root.add_child(panel)
	vp.add_child(root)

	_bubble_label = label

	var spr := Sprite3D.new()
	spr.name = "HeadBubbleSprite"
	spr.position = Vector3(0.0, 1.55, 0.0)
	spr.pixel_size = 0.004
	spr.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	spr.texture = vp.get_texture()
	spr.shaded = false
	spr.visible = false
	spr.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(spr)
	_bubble_sprite = spr


func interact(_who: Node) -> void:
	_idle = true
	wait_timer.stop()
	velocity.x = 0.0
	velocity.z = 0.0

	var line := LINE_MOMMY if _next_line_is_mommy else LINE_DADDY
	_next_line_is_mommy = not _next_line_is_mommy
	_bubble_label.text = line
	_bubble_sprite.visible = true
	_bubble_timer.stop()
	_bubble_timer.start()


func _on_bubble_timeout() -> void:
	_bubble_sprite.visible = false
	_bubble_label.text = ""
	_start_waiting()
