MapItems.TileItems.Crop = function (data, col, line) {
	this.type = MapItems.TileItems.Crop.Type[data.codename];
	MapItems.TileItem.call(this, this.type.sprite, col, line);
	this.data = data;
	this.informations = new MapItems.TileItemInfos(this.x, this.y);
}

MapItems.TileItems.Crop.prototype = new MapItems.TileItem();
MapItems.TileItems.Crop.prototype.constructor = MapItems.TileItem.Crop;

MapItems.TileItems.Crop.prototype.showInformation = function () {
	this.informations.visible = true;
	switch (CE.filterType) {
		case CE.FilterType.HEALTH:
			this.informations.value = this.data.storedCrop.health;
			break;
		case CE.FilterType.MATURITY:
			this.informations.value = this.data.storedCrop.maturity;
			break;
		default:
			this.informations.value = 0;
			this.informations.visible = false;
			break;
	}
	this.informations.loadInformations();
};

MapItems.TileItems.Crop.Type = {
	corn: { codename: 'corn', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}},
	wheat: { codename: 'wheat', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}},
	tomato: { codename: 'tomato', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}}
}