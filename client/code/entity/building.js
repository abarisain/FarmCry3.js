TileItems.Building = function (sprite, col, line) {
	TileItem.call(this, sprite, col, line);
}

TileItems.Building.prototype = new TileItem();
TileItems.Building.prototype.constructor = TileItems.Building;