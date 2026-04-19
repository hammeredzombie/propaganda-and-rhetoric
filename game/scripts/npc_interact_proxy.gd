extends Area3D
## Forwards interact from a larger raycast-only shape to the parent NPC.

func interact(who: Node, hit_point: Vector3 = Vector3.ZERO) -> void:
	var n := get_parent()
	if n and n.has_method(&"interact"):
		n.interact(who, hit_point)
