MapItems.TileItems.Building = function (type, col, line) {
	MapItems.TileItem.call(this, type.sprite, col, line);
	this.type = type;
	this.storages = [];
	this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.CORN, this.type, 0, this.x, this.y));
	this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.WHEAT, this.type, 1, this.x, this.y));
	this.storages.push(new MapItems.Storage(MapItems.TileItems.Crop.Type.TOMATO, this.type, 2, this.x, this.y));
}

MapItems.TileItems.Building.prototype = new MapItems.TileItem();
MapItems.TileItems.Building.prototype.constructor = MapItems.TileItems.Building;
MapItems.TileItems.Building.prototype.drawParent = MapItems.TileItems.Building.prototype.draw;

MapItems.TileItems.Building.prototype.draw = function () {
	this.drawParent();
	for (var i = 0; i < this.storages.length; i++) {
		this.storages[i].draw();
	}
}

MapItems.TileItems.Building.Type = {
	BARN: { sprite: {}, positionAvailable: [
		{x: 0, y: -45},
		{x: 67, y: 0},
		{x: 0, y: 45},
		{x: -67, y: 0}
	]}
}