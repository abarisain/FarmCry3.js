//Classe pour afficher les objects de stockage (tonneau, caisse...)
MapItems.Storage = function (cropType, buildingType, index, x, y) {
	MapItem.call(this, cropType.storageSprite, 0, 0);
	this.index = index;
	this.x = x;
	this.y = y;
	this.cropType = cropType;
	this.buildingType = buildingType;
	this.updateCoord();
}

MapItems.Storage.prototype = new MapItem();
MapItems.Storage.prototype.constructor = MapItems.Storage;
MapItems.Storage.prototype.updateCoord = function () {
	this.imageLeft = this.x + this.buildingType.positionAvailable[this.index].x;
	this.imageTop = this.y + this.buildingType.positionAvailable[this.index].y;
};

