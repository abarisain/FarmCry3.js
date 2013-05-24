MapItems.Cloud = function (col, line) {
	MapItem.call(this, SpritePack.Effects.Sprites.CLOUD, col, line);
	this.updateCoord();
	this.updateImageCoord();
	this.movement = { finalPosition: { x: 0, y: 0}, startPosition: { x: 0, y: 0}};
	this.alpha = 0.6 * Math.random() + 0.4;
	this.transition = new Transition(0, 1, 600, function () {
	});
	this.transition.start(Transition.Type.FADE_IN);
	this.transition.loop = true;
}

MapItems.Cloud.prototype = new MapItem();
MapItems.Cloud.prototype.constructor = MapItems.Cloud;

MapItems.Cloud.prototype.move = function (deltaCol, deltaLine) {
	this.col += deltaCol;
	this.line += deltaLine;
	this.movement.startPosition.x = this.x;
	this.movement.startPosition.y = this.y;
	this.updateCoord();
	this.movement.finalPosition.x = this.x;
	this.movement.finalPosition.y = this.y;
}

MapItems.Cloud.prototype.update = function () {
	this.x = this.movement.startPosition.x + (this.movement.finalPosition.x - this.movement.startPosition.x) * CE.Weather.movementTransition.progress;
	this.y = this.movement.startPosition.y + (this.movement.finalPosition.y - this.movement.startPosition.y) * CE.Weather.movementTransition.progress;
	this.updateImageCoord();
	this.transition.updateProgress();
}

MapItems.Cloud.prototype.draw = function () {
	if (this.visible) {
		CE.canvas.animation.context.globalAlpha = this.transition.progress * this.alpha;
		CE.canvas.animation.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
	}
};

MapItems.Cloud.prototype.drawAnimation = function () {//en fait je me servirais de ça pour la pluie
	if (this.visible) {
		//CE.canvas.animation.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
	}
};