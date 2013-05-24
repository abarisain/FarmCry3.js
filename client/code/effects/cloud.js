MapItems.Cloud = function (col, line) {
	MapItem.call(this, SpritePack.Effects.Sprites.CLOUD, col, line);
	this.updateCoord();
	this.updateImageCoord();
}

MapItems.Cloud.prototype = new MapItem();
MapItems.Cloud.prototype.constructor = MapItems.Cloud;

MapItems.Cloud.prototype.draw = function () {
	if (this.visible) {
		CE.canvas.animation.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
	}
};

MapItems.Cloud.prototype.drawAnimation = function () {//en fait je me servirais de ça pour la pluie
	if (this.visible) {
		//CE.canvas.animation.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
	}
};