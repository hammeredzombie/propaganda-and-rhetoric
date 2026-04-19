extends CanvasLayer

signal started
signal retried

@onready var root: Control = $Root
@onready var label: Label = $Root/Panel/Margin/VBox/Label
@onready var button: Button = $Root/Panel/Margin/VBox/ButtonRow/Button

var _action: StringName = &""


func _ready() -> void:
	root.visible = false
	button.pressed.connect(_on_button)


func show_start() -> void:
	_action = &"start"
	label.text = "Hello soldier. This is your time to fight the Goosetapo. Not with guns, but with your little Duck brain.\nWe need you to match the Signals on the Board with the ground truth in the dossier. But three mistakes and there's sure to be a leak that gets you killed.\nYou will need to go online to find the Goose."
	button.text = "  Continue  "
	_show()


func show_lost() -> void:
	_action = &"lost"
	label.text = "Honk! Honk! Honk! You Lost"
	button.text = "  Retry  "
	_show()


func show_win() -> void:
	_action = &"win"
	label.text = "The End"
	button.text = "  Retry  "
	_show()


func _show() -> void:
	root.visible = true
	button.grab_focus()


func _on_button() -> void:
	root.visible = false
	if _action == &"start":
		started.emit()
	else:
		retried.emit()
		get_tree().reload_current_scene()
