MapItems.TileItems.Building = function (type, col, line) {
	MapItems.TileItem.call(this, type.sprite, col, line);
	this.type = type;
	this.storages = [];
	for (var i = 0; i < this.type.positionAvailable.length; i++) {
		this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.corn, this.type, i, this.x, this.y));
	}
	/*this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.corn, this.type, 0, this.x, this.y));
	 this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.wheat, this.type, 1, this.x, this.y));
	 this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.tomato, this.type, 2, this.x, this.y));*/

	this.informations = new MapItems.TileItemInfos(this.x + this.type.positionInfo.x, this.y + this.type.positionInfo.y, [
		new Diagram(Diagram.Color.GREEN, 'Capacity', this.x / 100)
	]);
}

MapItems.TileItems.Building.prototype = new MapItems.TileItem();
MapItems.TileItems.Building.prototype.constructor = MapItems.TileItems.Building;
MapItems.TileItems.Building.prototype.drawParent = MapItems.TileItems.Building.prototype.draw;

MapItems.TileItems.Building.prototype.draw = function () {
	this.drawParent();
	for (var i = 0; i < this.storages.length; i++) {
		this.storages[i].draw(i);
	}
};

MapItems.TileItems.Building.prototype.drawAnimation = function () {
	if (this.type == MapItems.TileItems.Building.Type.barn) {
		SpritePack.Buildings.Sprites.BARN_ROOF.drawOnAnimation(this.x, this.y);
	} else if (this.type == MapItems.TileItems.Building.Type.cold_storage) {
		SpritePack.Buildings.Sprites.COLD_STORAGE_ROOF.drawOnAnimation(this.x, this.y);
	}
};

MapItems.TileItems.Building.Type = {
	barn: { codename: 'barn', sprite: {}, positionInfo: {x: tileWidth / 2, y: 0}, positionAvailable: [
		{x: 112, y: 45},
		{x: 158, y: 46},
		{x: 194, y: 27},
		{x: 200, y: 8},
		{x: 180, y: -36},
		{x: 135, y: -48},
		{x: 90, y: -36},
		{x: 72, y: -7},
		{x: 79, y: 29},
		{x: 90, y: 90},
		{x: 181, y: 90},
		{x: 251, y: 48},
		{x: 266, y: -16},
		{x: 221, y: -72},
		{x: 135, y: -94},
		{x: 52, y: -71},
		{x: 8, y: -14},
		{x: 23, y: 50}
	]},
	cold_storage: { codename: 'cold_storage', sprite: {}, positionInfo: {x: tileWidth / 2, y: 0}, positionAvailable: [
		{x: 0, y: -45},
		{x: 67, y: 0},
		{x: 0, y: 45},
		{x: -67, y: 0}
	]},
	silo: { codename: 'silo', sprite: {}, positionInfo: {x: 0, y: 0}, positionAvailable: [
		{x: 1, y: -47},
		{x: 68, y: -1},
		{x: 2, y: 46},
		{x: -65, y: -1}
	]}
}