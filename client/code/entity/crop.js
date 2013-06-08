MapItems.TileItems.Crop = function (data, col, line) {
	this.type = MapItems.TileItems.Crop.Type[data.codename];
	this.data = data;
	this.maturity = 0;
	this.health = 0;
	this.updateImage();
	MapItems.TileItem.call(this, this.sprite, col, line);
	this.informations = new MapItems.TileItemInfos(this.x, this.y);
}

MapItems.TileItems.Crop.prototype = new MapItems.TileItem();
MapItems.TileItems.Crop.prototype.constructor = MapItems.TileItem.Crop;

MapItems.TileItem.prototype.updateData = function (data) {
	this.data = data;
	this.updateImage();
	if (CE.displayType == CE.DisplayType.INFORMATION) {
		this.showInformation();
	}
};

MapItems.TileItems.Crop.prototype.updateValues = function () {
	if (this.data.harvested_quantity > 0) {
		this.maturity = 1;
	} else {
		var maturationTime = GameState.crops[this.type.codename].maturation_time;
		this.maturity = (maturationTime - this.data.time_left) / maturationTime;
	}
	this.health = this.data.time_left;
}

MapItems.TileItems.Crop.prototype.showInformation = function () {
	this.informations.visible = true;
	switch (CE.filterType) {
		case CE.FilterType.HEALTH:
			this.informations.value = this.health / 10;
			break;
		case CE.FilterType.MATURITY:
			this.informations.value = this.maturity * 100;
			break;
		default:
			this.informations.value = 0;
			this.informations.visible = false;
			break;
	}
	this.informations.loadInformations();
};

MapItems.TileItems.Crop.prototype.updateImage = function () {
	this.updateValues();
	switch (this.type.codename) {
		case 'corn':
			if (this.maturity > 0.8) {
				this.sprite = SpritePack.Crops.Sprites.CORN_4;
			} else if (this.maturity > 0.6) {
				this.sprite = SpritePack.Crops.Sprites.CORN_3;
			} else if (this.maturity > 0.4) {
				this.sprite = SpritePack.Crops.Sprites.CORN_2;
			} else if (this.maturity > 0.2) {
				this.sprite = SpritePack.Crops.Sprites.CORN_1;
			} else {
				this.sprite = SpritePack.Crops.Sprites.CORN_0;
			}
			break;
		case 'wheat':
			if (this.maturity > 0.8) {
				this.sprite = SpritePack.Crops.Sprites.TOMATO_4;
			} else if (this.maturity > 0.6) {
				this.sprite = SpritePack.Crops.Sprites.TOMATO_3;
			} else if (this.maturity > 0.4) {
				this.sprite = SpritePack.Crops.Sprites.TOMATO_2;
			} else if (this.maturity > 0.2) {
				this.sprite = SpritePack.Crops.Sprites.TOMATO_1;
			} else {
				this.sprite = SpritePack.Crops.Sprites.TOMATO_0;
			}
			break;
		case 'tomato':
			if (this.maturity > 0.8) {
				this.sprite = SpritePack.Crops.Sprites.WHEAT_4;
			} else if (this.maturity > 0.6) {
				this.sprite = SpritePack.Crops.Sprites.WHEAT_3;
			} else if (this.maturity > 0.4) {
				this.sprite = SpritePack.Crops.Sprites.WHEAT_2;
			} else if (this.maturity > 0.2) {
				this.sprite = SpritePack.Crops.Sprites.WHEAT_1;
			} else {
				this.sprite = SpritePack.Crops.Sprites.WHEAT_0;
			}
			break;
	}
	this.updateImageCoord();
	CE.mapInvalidated = true;
}

MapItems.TileItems.Crop.Type = {
	corn: { codename: 'corn', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}},
	wheat: { codename: 'wheat', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}},
	tomato: { codename: 'tomato', sprite: {}, spriteBarrel: {}, spriteBox: {}, spriteIceBox: {}}
}