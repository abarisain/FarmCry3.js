MapItems.Effect = function (col, line) {
	MapItem.call(this, null, col, line);
	this.updateCoord();
	this.imageLeft = this.x - tileWidth / 2;
	this.imageRight = this.x + tileWidth / 2;
	this.imageTop = this.y - tileHeight / 2;
	this.imageBottom = this.y + tileHeight / 2;
	this.effects = [];
	this.checkVisibility();
}

MapItems.Effect.prototype = new MapItem();
MapItems.Effect.prototype.constructor = MapItems.Effect;

MapItems.Effect.prototype.addEffect = function (effect) {
	this.effects.push(effect);
}

MapItems.Effect.prototype.move = function (deltaCol, deltaLine) {
}

MapItems.Effect.prototype.update = function () {
	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].update();
	}
}

MapItems.Effect.prototype.draw = function () {
	if (this.visible) {
		for (var i = 0; i < this.effects.length; i++) {
			this.effects[i].draw();
		}
	}
};