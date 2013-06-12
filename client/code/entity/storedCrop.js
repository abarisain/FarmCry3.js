//Classe pour afficher les objects de stockage (tonneau, caisse...)
MapItems.StoredCrop = function (logicStoredCrop, buildingCodename, x, y) {
	MapItem.call(this, null, 0, 0);
	this.logicStoredCrop = logicStoredCrop;
	this.x = x;
	this.y = y;
	this.buildingCodename = buildingCodename;
	this.updateImage();
}

MapItems.StoredCrop.prototype = new MapItem();
MapItems.StoredCrop.prototype.constructor = MapItems.StoredCrop;

MapItems.StoredCrop.prototype.updateStoredCrop = function (logicStoredCrop) {
	this.logicStoredCrop = logicStoredCrop;
}

MapItems.StoredCrop.prototype.updateCoord = function (index) {
	var buildingType = MapItems.TileItems.Building.Type[this.buildingCodename];
	this.imageLeft = this.x + buildingType.positionAvailable[index].x;
	this.imageTop = this.y + buildingType.positionAvailable[index].y;
};

MapItems.StoredCrop.prototype.updateImage = function () {
	switch (this.logicStoredCrop.crop) {
		case 'corn':
			switch (this.buildingCodename) {
				case 'silo':
					this.sprite = SpritePack.Storages.Sprites.BOX_CORN;
					break;
				case 'barn':
					this.sprite = SpritePack.Storages.Sprites.BARREL_CORN;
					break;
				case 'cold_storage':
					this.sprite = SpritePack.Storages.Sprites.ICE_BOX_CORN;
					break;
			}
			break;
		case 'tomato':
			switch (this.buildingCodename) {
				case 'silo':
					this.sprite = SpritePack.Storages.Sprites.BOX_TOMATO;
					break;
				case 'barn':
					this.sprite = SpritePack.Storages.Sprites.BARREL_TOMATO;
					break;
				case 'cold_storage':
					this.sprite = SpritePack.Storages.Sprites.ICE_BOX_TOMATO;
					break;
			}
			break;
		case 'wheat':
			switch (this.buildingCodename) {
				case 'silo':
					this.sprite = SpritePack.Storages.Sprites.BOX_WHEAT;
					break;
				case 'barn':
					this.sprite = SpritePack.Storages.Sprites.BARREL_WHEAT;
					break;
				case 'cold_storage':
					this.sprite = SpritePack.Storages.Sprites.ICE_BOX_WHEAT;
					break;
			}
			break;
	}
	this.updateImageCoord();
}