MapItems.TileItems.Crop = function (sprite, col, line) {
	MapItems.TileItem.call(this, sprite, col, line);
}

MapItems.TileItems.Crop.prototype = new MapItems.TileItem();
MapItems.TileItems.Crop.prototype.constructor = MapItems.TileItem.Crop;

MapItems.TileItems.Crop.Type = {
	CORN: { sprite: {}, storageSprite: {}},
	WHEAT: { sprite: {}, storageSprite: {}},
	TOMATO: { sprite: {}, storageSprite: {}}
}