class_name Player
extends CharacterBody3D

@export var move_speed: float = 4.5
@export var mouse_sensitivity: float = 0.0025
@export var gravity: float = 20.0
@export var interact_range: float = 3.0

@onready var camera: Camera3D = $Camera
@onready var interact_ray: RayCast3D = $Camera/InteractRay

var _input_locked: bool = false


func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	Dialogue.opened.connect(_on_dialogue_opened)
	Dialogue.closed.connect(_on_dialogue_closed)
	interact_ray.target_position = Vector3(0, 0, -interact_range)


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_WINDOW_FOCUS_IN and not _input_locked:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED


func _unhandled_input(event: InputEvent) -> void:
	if _input_locked:
		return

	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
				Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
			_try_interact()
			get_viewport().set_input_as_handled()
			return
		if Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
			return

	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		rotate_y(-event.relative.x * mouse_sensitivity)
		camera.rotate_x(-event.relative.y * mouse_sensitivity)
		camera.rotation.x = clamp(camera.rotation.x, -1.4, 1.4)

	if event.is_action_pressed("interact"):
		if Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
		else:
			_try_interact()

	if event.is_action_pressed("ui_cancel"):
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE


func _physics_process(delta: float) -> void:
	if _input_locked:
		velocity.x = 0
		velocity.z = 0
	else:
		var input_dir := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
		var direction := (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
		velocity.x = direction.x * move_speed
		velocity.z = direction.z * move_speed

	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = 0

	move_and_slide()


func _try_interact() -> void:
	if Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
		return
	interact_ray.force_raycast_update()
	if not interact_ray.is_colliding():
		return
	var hit := interact_ray.get_collider()
	if hit and hit.has_method("interact"):
		hit.interact(self)


func _on_dialogue_opened() -> void:
	_input_locked = true
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE


func _on_dialogue_closed() -> void:
	_input_locked = false
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
