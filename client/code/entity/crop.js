MapItems.TileItems.Crop = function (type, col, line) {
	this.type = type;
	MapItems.TileItem.call(this, type.sprite, col, line);

	this.informations = new MapItems.TileItemInfos(this.x + this.type.positionInfo.x, this.y + this.type.positionInfo.y, [
		new Diagram(Diagram.Color.YELLOW, 'Maturity', this.x / 100)
	]);
}

MapItems.TileItems.Crop.prototype = new MapItems.TileItem();
MapItems.TileItems.Crop.prototype.constructor = MapItems.TileItem.Crop;

MapItems.TileItems.Crop.Type = {
	corn: { codename: 'corn', sprite: {}, storageSprite: {}},
	wheat: { codename: 'wheat', sprite: {}, storageSprite: {}},
	tomato: { codename: 'tomato', sprite: {}, storageSprite: {}}
}