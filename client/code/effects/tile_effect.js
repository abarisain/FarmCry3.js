MapItems.Effect = function (col, line) {
	MapItem.call(this, null, col, line);
	this.updateCoord();
	this.effect = {};
}

MapItems.Effect.prototype = new MapItem();
MapItems.Effect.prototype.constructor = MapItems.Effect;

MapItems.Effect.prototype.move = function (deltaCol, deltaLine) {
}

MapItems.Effect.prototype.update = function () {
	this.effect.update();
}

MapItems.Effect.prototype.draw = function () {
	if (this.visible) {
		this.effect.draw();
	}
};