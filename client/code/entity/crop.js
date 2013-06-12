MapItems.TileItems.Crop = function (data, col, line) {
	this.data = data;
	this.maturity = 0;
	this.health = 0;
	this.health = 1;
	this.col = col;//needed for the rotten smoke
	this.line = line;
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
		var decayTime = GameState.crops[this.data.codename].decay_time;
		this.health = this.data.time_left / decayTime;
		this.maturity = 1;
	} else {
		this.health = 1;
		var maturationTime = GameState.crops[this.data.codename].maturation_time;
		this.maturity = (maturationTime - this.data.time_left) / maturationTime;
	}
}

MapItems.TileItems.Crop.prototype.showInformation = function () {
	this.informations.visible = true;
	switch (CE.filterType) {
		case CE.FilterType.MATURITY:
			this.informations.value = this.maturity * 100;
			break;
		case CE.FilterType.HEALTH:
			this.informations.value = this.health * 100;
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
	if (this.data.rotten) {
		this.sprite = SpritePack.Crops.Sprites.ROTTEN;
		CE.Environment.addRottenEffect(this.col, this.line);
	} else {
		switch (this.data.codename) {
			case 'corn':
				if (this.data.harvested_quantity > 0) {
					this.sprite = SpritePack.Crops.Sprites.CORN_4;
				} else if (this.maturity > 0.75) {
					this.sprite = SpritePack.Crops.Sprites.CORN_3;
				} else if (this.maturity > 0.5) {
					this.sprite = SpritePack.Crops.Sprites.CORN_2;
				} else if (this.maturity > 0.25) {
					this.sprite = SpritePack.Crops.Sprites.CORN_1;
				} else {
					this.sprite = SpritePack.Crops.Sprites.CORN_0;
				}
				break;
			case 'tomato':
				if (this.data.harvested_quantity > 0) {
					this.sprite = SpritePack.Crops.Sprites.TOMATO_4;
				} else if (this.maturity > 0.75) {
					this.sprite = SpritePack.Crops.Sprites.TOMATO_3;
				} else if (this.maturity > 0.5) {
					this.sprite = SpritePack.Crops.Sprites.TOMATO_2;
				} else if (this.maturity > 0.25) {
					this.sprite = SpritePack.Crops.Sprites.TOMATO_1;
				} else {
					this.sprite = SpritePack.Crops.Sprites.TOMATO_0;
				}
				break;
			case 'wheat':
				if (this.data.harvested_quantity > 0) {
					this.sprite = SpritePack.Crops.Sprites.WHEAT_4;
				} else if (this.maturity > 0.75) {
					this.sprite = SpritePack.Crops.Sprites.WHEAT_3;
				} else if (this.maturity > 0.5) {
					this.sprite = SpritePack.Crops.Sprites.WHEAT_2;
				} else if (this.maturity > 0.25) {
					this.sprite = SpritePack.Crops.Sprites.WHEAT_1;
				} else {
					this.sprite = SpritePack.Crops.Sprites.WHEAT_0;
				}
				break;
		}
	}
	this.updateImageCoord();
}