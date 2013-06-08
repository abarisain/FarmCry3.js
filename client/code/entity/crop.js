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
			this.informations.value = this.data.time_left / 10;
			break;
		case CE.FilterType.MATURITY:
			if (this.data.harvested_quantity > 0) {
				this.informations.value = 100;
			} else {
				var maturationTime = GameState.crops[this.type.codename].maturation_time;
				this.informations.value = (maturationTime - this.data.time_left) / maturationTime * 100;
			}
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