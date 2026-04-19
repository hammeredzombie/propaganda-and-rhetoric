extends Area3D


func interact(_who: Node, _hit_point: Vector3 = Vector3.ZERO) -> void:
	CorkboardPopup.open_popup()
