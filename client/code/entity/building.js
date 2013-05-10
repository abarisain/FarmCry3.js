MapItems.TileItems.Building = function (sprite, col, line) {
	MapItems.TileItem.call(this, sprite, col, line);
}

MapItems.TileItems.Building.prototype = new MapItems.TileItem();
MapItems.TileItems.Building.prototype.constructor = MapItems.TileItems.Building;