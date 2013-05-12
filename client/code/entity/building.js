MapItems.TileItems.Building = function (type, col, line) {
	MapItems.TileItem.call(this, type.sprite, col, line);
	this.type = type;
	this.storages = [];
	this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.corn, this.type, 0, this.x, this.y));
	this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.wheat, this.type, 1, this.x, this.y));
	this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.tomato, this.type, 2, this.x, this.y));

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
		this.storages[i].draw();
	}
};

MapItems.TileItems.Building.prototype.drawAnimation = function () {
	if (this.type == MapItems.TileItems.Building.Type.barn) {
		SpritePack.Buildings.Sprites.BARN_ROOF.drawOnAnimation(this.x, this.y);
	}
};

MapItems.TileItems.Building.Type = {
	barn: { codename: 'barn', sprite: {}, positionInfo: {x: tileWidth / 2, y: 0}, positionAvailable: [
		{x: 0, y: -45},
		{x: 67, y: 0},
		{x: 0, y: 45},
		{x: -67, y: 0}
	]},
	silo: { codename: 'silo', sprite: {}, positionInfo: {x: 0, y: 0}, positionAvailable: [
		{x: 0, y: -45},
		{x: 67, y: 0},
		{x: 0, y: 45},
		{x: -67, y: 0}
	]},
	cold_storage: { codename: 'cold_storage', sprite: {}, positionInfo: {x: tileWidth / 2, y: tileHeight / 2}, positionAvailable: [
		{x: 0, y: -45},
		{x: 67, y: 0},
		{x: 0, y: 45},
		{x: -67, y: 0}
	]}
}