MapItems.TileItems.Crop = function (type, col, line) {
	this.type = type;
	MapItems.TileItem.call(this, type.sprite, col, line);

	this.informations = new MapItems.TileItemInfos(this.x, this.y, [
		new Diagram(Diagram.Color.YELLOW, 'Maturity', this.x / 100)
	]);
}

MapItems.TileItems.Crop.prototype = new MapItems.TileItem();
MapItems.TileItems.Crop.prototype.constructor = MapItems.TileItem.Crop;

MapItems.TileItems.Crop.Type = {
	corn: { codename: 'corn', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}},
	wheat: { codename: 'wheat', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}},
	tomato: { codename: 'tomato', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}}
}