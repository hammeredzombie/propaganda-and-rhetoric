extends CanvasLayer

## Singleton (autoload) dialogue box. Any node can call:
##     Dialogue.show_line("hello", "Speaker Name")
## and await the `closed` signal if it wants to react.

signal opened
signal closed

@onready var root: Control = $Root
@onready var speaker_label: Label = $Root/Panel/Margin/VBox/Speaker
@onready var body_label: Label = $Root/Panel/Margin/VBox/Body
@onready var continue_button: Button = $Root/Panel/Margin/VBox/Continue


func _ready() -> void:
	root.visible = false
	continue_button.pressed.connect(_on_continue)


func show_line(text: String, speaker: String = "") -> void:
	speaker_label.text = speaker
	speaker_label.visible = speaker != ""
	body_label.text = text
	root.visible = true
	continue_button.grab_focus()
	opened.emit()


func _on_continue() -> void:
	root.visible = false
	closed.emit()


func _unhandled_input(event: InputEvent) -> void:
	if not root.visible:
		return
	if event.is_action_pressed("ui_accept") or event.is_action_pressed("ui_cancel"):
		_on_continue()
		get_viewport().set_input_as_handled()
