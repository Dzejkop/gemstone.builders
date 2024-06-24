extends Node2D

@export_group("Toolbar")
@export
var toolbar_path: NodePath

@export
var toolbar_layer_id := 0

@export
var toolbar_selection_layer_id := 1

@export_group("Game Grid")
@export
var game_grid_path: NodePath

@export
var ground_layer_id := 0

@export
var buildings_layer_id := 2

@export
var ghosts_layer_id := 4

@onready
var toolbar: TileMap = get_node(toolbar_path)

@onready
var game_grid: TileMap = get_node(game_grid_path)

@export_group("General")

@export
var game_root_path: NodePath

@onready
var game_root: Node2D = get_node(game_root_path)

@export
var diamond: PackedScene

var items := []

var game_state := []

const NULLCOORDS := Vector2i(-1, -1)
var selected_toolbar_atlas_coords := NULLCOORDS

func construct_game_state():
	var new_state := []

	for y in range(8):
		var row = []
		for x in range(8):
			row.append([])
		new_state.append(row)

	return new_state

func _ready():
	game_state = construct_game_state()

func _process(_delta):
	var mpos = toolbar.get_local_mouse_position()
	var mi = toolbar.local_to_map(mpos)
	var c = toolbar.get_cell_atlas_coords(toolbar_layer_id, mi)

	toolbar.clear_layer(toolbar_selection_layer_id)

	if c != NULLCOORDS:
		toolbar.set_cell(toolbar_selection_layer_id, mi, 0, Vector2i(25, 10))

		if Input.is_action_just_released("left_click"):
			if selected_toolbar_atlas_coords == c:
				selected_toolbar_atlas_coords = NULLCOORDS
			else:
				selected_toolbar_atlas_coords = c

	if selected_toolbar_atlas_coords != NULLCOORDS:
		mpos = game_grid.get_local_mouse_position()
		mi = game_grid.local_to_map(mpos)

		game_grid.clear_layer(ghosts_layer_id)

		var sid = game_grid.get_cell_source_id(ground_layer_id, mi)
		if sid != -1:
			game_grid.set_cell(ghosts_layer_id, mi, 0, selected_toolbar_atlas_coords)

			if Input.is_action_pressed("left_click"):
				game_grid.set_cell(buildings_layer_id, mi, 0, selected_toolbar_atlas_coords)

			if Input.is_action_pressed("right_click"):
				game_grid.set_cell(buildings_layer_id, mi, 0, NULLCOORDS)

func validate_tick():
	# An array to keep track of where items are being inserted or moved to
	var item_inserts := []
	for y in range(8):
		var row = []
		for x in range(8):
			row.append(0)
		item_inserts.append(row)

	for y in range(8):
		for x in range(8):
			var m = Vector2i(x, y)
			var b = game_grid.get_cell_atlas_coords(buildings_layer_id, m)

			if b == Buildings.MINE:
				item_inserts[y + 1][x] += 1
			elif b == Buildings.BELT_RIGHT:
				for _item in game_state[y][x]:
					item_inserts[y][x + 1] += 1
			elif b == Buildings.BELT_DOWN:
				for _item in game_state[y][x]:
					item_inserts[y + 1][x] += 1
			elif b == Buildings.BELT_LEFT:
				for _item in game_state[y][x]:
					item_inserts[y][x - 1] += 1
			elif b == Buildings.BELT_UP:
				for _item in game_state[y][x]:
					item_inserts[y - 1][x] += 1
			elif b == Buildings.EXPORTER:
				# Do nothing - consumes all resources
				continue
			else:
				for _item in game_state[y][x]:
					item_inserts[y][x] += 1

	for y in range(8):
		for x in range(8):
			if item_inserts[y][x] > 1:
				return "Multiple items are being inserted into the same cell"

	return null

func tick():
	var validation_result = validate_tick()
	if validation_result != null:
		print(validation_result)
		return

	var new_state = construct_game_state()

	for y in range(8):
		for x in range(8):
			var m = Vector2i(x, y)
			var b = game_grid.get_cell_atlas_coords(buildings_layer_id, m)
			if b == Buildings.MINE:
				var diamond_grid_pos = m + Vector2i(0, 1)
				var diamond_spawn_pos = game_grid.map_to_local(diamond_grid_pos)

				var instance: Node2D = diamond.instantiate()
				game_root.add_child(instance)
				instance.position = diamond_spawn_pos

				new_state[y + 1][x].append(instance)
			if b == Buildings.BELT_RIGHT:
				for item in game_state[y][x]:
					item.position = game_grid.map_to_local(m + Vector2i(1, 0))
					new_state[y][x + 1].append(item)
			if b == Buildings.BELT_DOWN:
				for item in game_state[y][x]:
					item.position = game_grid.map_to_local(m + Vector2i(0, 1))
					new_state[y + 1][x].append(item)
			if b == Buildings.BELT_LEFT:
				for item in game_state[y][x]:
					item.position = game_grid.map_to_local(m + Vector2i(-1, 0))
					new_state[y][x - 1].append(item)
			if b == Buildings.BELT_UP:
				for item in game_state[y][x]:
					item.position = game_grid.map_to_local(m + Vector2i(0, -1))
					new_state[y - 1][x].append(item)
			if b == Buildings.EXPORTER:
				for item in game_state[y][x]:
					game_root.remove_child(item)
					item.queue_free()

	game_state = new_state
