extends Area3D

@export var external_url: String = ""


func interact(_who: Node, _hit_point: Vector3 = Vector3.ZERO) -> void:
	if external_url.is_empty():
		return
	OS.shell_open(external_url)
