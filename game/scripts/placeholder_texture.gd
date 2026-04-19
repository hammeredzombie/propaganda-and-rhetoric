class_name PlaceholderTexture
extends RefCounted

# Generates simple nearest-neighbour textures so scenes render before the user
# drops in their Procreate PNGs. Replace every call site by assigning a real
# Texture2D in the Inspector — these exist purely as visible stand-ins.

static func make_npc(primary: Color = Color(0.85, 0.25, 0.35), size: int = 64) -> Texture2D:
	var img := Image.create(size, size, false, Image.FORMAT_RGBA8)
	img.fill(Color(0, 0, 0, 0))

	var body_top := int(size * 0.25)
	var body_bottom := size - 2
	var body_left := int(size * 0.3)
	var body_right := int(size * 0.7)
	for y in range(body_top, body_bottom):
		for x in range(body_left, body_right):
			img.set_pixel(x, y, primary)

	var head_cx := size / 2
	var head_cy := int(size * 0.18)
	var head_r := int(size * 0.14)
	for y in range(head_cy - head_r, head_cy + head_r):
		for x in range(head_cx - head_r, head_cx + head_r):
			var dx := x - head_cx
			var dy := y - head_cy
			if dx * dx + dy * dy <= head_r * head_r:
				img.set_pixel(x, y, Color(0.95, 0.82, 0.7))

	var eye_y := head_cy
	img.set_pixel(head_cx - 3, eye_y, Color.BLACK)
	img.set_pixel(head_cx + 3, eye_y, Color.BLACK)

	return ImageTexture.create_from_image(img)


static func make_checker(size: int = 64, tile: int = 8, a: Color = Color(0.22, 0.22, 0.26), b: Color = Color(0.14, 0.14, 0.18)) -> Texture2D:
	var img := Image.create(size, size, false, Image.FORMAT_RGBA8)
	for y in range(size):
		for x in range(size):
			var on := ((x / tile) + (y / tile)) % 2 == 0
			img.set_pixel(x, y, a if on else b)
	return ImageTexture.create_from_image(img)


static func make_wall(size: int = 64, brick: Color = Color(0.35, 0.25, 0.22), mortar: Color = Color(0.1, 0.08, 0.08)) -> Texture2D:
	var img := Image.create(size, size, false, Image.FORMAT_RGBA8)
	img.fill(brick)
	var row_h := 16
	var brick_w := 32
	for y in range(0, size, row_h):
		for x in range(size):
			img.set_pixel(x, y, mortar)
		var offset := (y / row_h) % 2 * (brick_w / 2)
		for x in range(offset, size, brick_w):
			for yy in range(y, min(y + row_h, size)):
				if x < size:
					img.set_pixel(x, yy, mortar)
	return ImageTexture.create_from_image(img)
