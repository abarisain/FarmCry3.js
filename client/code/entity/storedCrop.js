//Classe pour afficher les objects de stockage (tonneau, caisse...)
MapItems.StoredCrop = function (data, cropCodename, buildingCodename, x, y) {
	MapItem.call(this, null, 0, 0);
	this.data = data;
	this.x = x;
	this.y = y;
	this.cropCodename = cropCodename;
	this.buildingCodename = buildingCodename;
}

MapItems.StoredCrop.prototype = new MapItem();
MapItems.StoredCrop.prototype.constructor = MapItems.StoredCrop;

MapItems.StoredCrop.prototype.updateStoredCrop = function (data) {
	this.data = data;
}

MapItems.StoredCrop.prototype.updateCoord = function (index) {
	this.imageLeft = this.x + this.buildingType.positionAvailable[this.index].x;
	this.imageTop = this.y + this.buildingType.positionAvailable[this.index].y;
};

MapItems.StoredCrop.prototype.updateImage = function () {
	this.updateValues();
	switch (this.cropCodename) {
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
	CE.mapInvalidated = true;
}