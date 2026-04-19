extends CanvasLayer

## Site nav order — matches `src/site/components/Nav.svelte` (`items` array).
const SECTION_LABELS: PackedStringArray = [
	"Home",
	"Politics",
	"World",
	"Business",
	"Opinion",
	"Culture",
	"Science",
	"Obituaries",
]

signal opened
signal closed

@onready var root: Control = $Root
@onready var fields_box: VBoxContainer = $Root/Panel/Margin/VBox/Scroll/Fields
@onready var close_button: Button = $Root/Panel/Margin/VBox/CloseRow/Close

var line_edits: Array[LineEdit] = []


func _ready() -> void:
	root.visible = false
	close_button.pressed.connect(_on_close)
	for label_text in SECTION_LABELS:
		var row := HBoxContainer.new()
		row.add_theme_constant_override("separation", 12)
		var lab := Label.new()
		lab.text = label_text
		lab.custom_minimum_size = Vector2(150, 0)
		lab.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		lab.add_theme_font_size_override("font_size", 22)
		var line := LineEdit.new()
		line.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		line.placeholder_text = "…"
		line.add_theme_font_size_override("font_size", 22)
		row.add_child(lab)
		row.add_child(line)
		fields_box.add_child(row)
		line_edits.append(line)


func open_popup() -> void:
	root.visible = true
	if line_edits.size() > 0:
		line_edits[0].grab_focus()
	else:
		close_button.grab_focus()
	opened.emit()


func _on_close() -> void:
	root.visible = false
	closed.emit()


func _unhandled_input(event: InputEvent) -> void:
	if not root.visible:
		return
	if event.is_action_pressed("ui_cancel"):
		_on_close()
		get_viewport().set_input_as_handled()
