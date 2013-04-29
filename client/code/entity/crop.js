TileItems.Crop = function (sprite, col, line) {
	TileItem.call(this, sprite, col, line);
}

TileItems.Crop.prototype = new TileItem();
TileItems.Crop.prototype.constructor = TileItem.Crop;