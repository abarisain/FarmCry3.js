MapItems.TileItems.Building = function (data, col, line) {
	this.type = MapItems.TileItems.Building.Type[data.codename];
	MapItems.TileItem.call(this, this.type.sprite, col, line);
	if (this.type == MapItems.TileItems.Building.Type.cold_storage) {
		CE.Environment.addColdStorageEffect(col, line);
	}
	this.data = data;
	this.storedCrops = {};
	this.storedCropCount = 0;
	this.informations = new MapItems.TileItemInfos(this.x + this.type.positionInfo.x, this.y + this.type.positionInfo.y);
}

MapItems.TileItems.Building.prototype = new MapItems.TileItem();
MapItems.TileItems.Building.prototype.constructor = MapItems.TileItems.Building;
MapItems.TileItems.Building.prototype.drawParent = MapItems.TileItems.Building.prototype.draw;

MapItems.TileItems.Building.prototype.showInformation = function () {
	this.informations.visible = true;
	switch (CE.filterType) {
		case CE.FilterType.STORAGE_AVAILABLE:
			var capacity = GameState.buildings[this.data.codename].capacity;
			this.informations.value = (capacity - this.storedCropCount) / capacity * 100;//shared instance
			break;
		default:
			this.informations.value = 0;
			this.informations.visible = false;
			break;
	}
	this.informations.loadInformations();
};

MapItems.TileItems.Building.prototype.updateStoredCrop = function (id) {
	var logicStoredCrop = GameState.logicItems.storedCrops[id];
	var storedCrop = this.storedCrops[id];
	if (storedCrop == undefined) {
		this.storedCrops[id] = new MapItems.StoredCrop(logicStoredCrop, this.data.codename, this.x, this.y);
	}
};

//this method is not really optimized, but for now it will work
MapItems.TileItems.Building.prototype.refreshStoredCropCoord = function () {
	var i = 0;
	for (var key in this.storedCrops) {
		this.storedCrops[key].updateCoord(i++);
	}
	this.storedCropCount = i;
}

MapItems.TileItems.Building.prototype.draw = function () {
	if (this.visible) {
		this.drawParent();
		for (var key in this.storedCrops) {
			this.storedCrops[key].draw();
		}
	}
};

MapItems.TileItems.Building.prototype.drawAnimation = function () {
	if (this.visible) {
		if (this.type == MapItems.TileItems.Building.Type.barn) {
			SpritePack.Buildings.Sprites.BARN_ROOF.drawOnAnimation(this.x, this.y);
		} else if (this.type == MapItems.TileItems.Building.Type.cold_storage) {
			SpritePack.Buildings.Sprites.COLD_STORAGE_ROOF.drawOnAnimation(this.x, this.y);
		}
	}
};

MapItems.TileItems.Building.prototype.match = function (col, line) {
	//TODO a remplacer par des conditions parce que là ça devient ridicule ^^
	if (col >= this.col && col <= this.col + Math.ceil(this.type.size / 2 - 1) &&
		line >= this.line && line <= this.line + (this.type.size + 1) % 2) {
		return true;
	} else {
		return false;
	}
}

MapItems.TileItems.Building.Type = {
	barn: { codename: 'barn', size: 4, sprite: {}, positionInfo: {x: tileWidth / 2, y: 0}, positionAvailable: [
		{x: 135, y: -46},//0
		{x: 180, y: -36},
		{x: 200, y: -8},
		{x: 194, y: 27},
		{x: 91, y: -35},
		{x: 158, y: 46},//5
		{x: 72, y: -7},
		{x: 79, y: 28},
		{x: 113, y: 45},
		{x: 90, y: 90},
		{x: 181, y: 90},//10
		{x: 251, y: 48},
		{x: 266, y: -16},
		{x: 221, y: -72},
		{x: 135, y: -94},
		{x: 52, y: -71},//15
		{x: 8, y: -14},
		{x: 23, y: 50}
	]},
	cold_storage: { codename: 'cold_storage', size: 6, sprite: {}, positionInfo: {x: tileWidth / 2, y: 0}, positionAvailable: [
		{x: 112, y: -126},//0
		{x: 180, y: -79},
		{x: 246, y: -32},
		{x: 314, y: 15},
		{x: 59, y: -88},
		{x: 125, y: -41},//5
		{x: 192, y: 6},
		{x: 261, y: 53},
		{x: 6, y: -51},
		{x: 73, y: -5},
		{x: 140, y: 42},//10
		{x: 207, y: 87},
		{x: -47, y: -14},
		{x: 20, y: 33},
		{x: 87, y: 80},
		{x: 154, y: 128}//15
	]},
	silo: { codename: 'silo', size: 1, sprite: {}, positionInfo: {x: 0, y: 0}, positionAvailable: [
		{x: 1, y: -47},
		{x: 68, y: -1},
		{x: 2, y: 46},
		{x: -65, y: -1}
	]}
}