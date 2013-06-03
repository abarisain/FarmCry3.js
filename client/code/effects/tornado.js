MapItems.Tornado = function (col, line) {
	MapItem.call(this, SpritePack.Effects.Sprites.TORNADO, col, line);
	this.sprite.scale = 2;
	this.updateCoord();
	this.updateImageCoord();
	this.movement = { finalPosition: { x: 0, y: 0}, startPosition: { x: 0, y: 0}};
	this.transition = new Transition(0, 1, 60, function () {
	});
	this.transition.start(Transition.Direction.IN);
	var tornado = this;//variable moche pour la fonction suivante
	this.movementTransition = new Transition(0, 1, 1200, function () {
		CE.Weather.removeTornado(tornado);
	})
	this.movementTransition.start(Transition.Direction.IN);
}

MapItems.Tornado.prototype = new MapItem();
MapItems.Tornado.prototype.constructor = MapItems.Tornado;

MapItems.Tornado.prototype.move = function (deltaCol, deltaLine) {
	this.col += deltaCol;
	this.line += deltaLine;
	this.movement.startPosition.x = this.x;
	this.movement.startPosition.y = this.y;
	this.updateCoord();
	this.movement.finalPosition.x = this.x;
	this.movement.finalPosition.y = this.y;
}

MapItems.Tornado.prototype.update = function () {
	this.transition.updateProgress();
	this.movementTransition.updateProgress();
	this.x = this.movement.startPosition.x + (this.movement.finalPosition.x - this.movement.startPosition.x) * this.movementTransition.progress;
	this.y = this.movement.startPosition.y + (this.movement.finalPosition.y - this.movement.startPosition.y) * this.movementTransition.progress;
	this.updateImageCoord();
}

MapItems.Tornado.prototype.draw = function () {
	if (this.visible) {
		CE.canvas.animation.context.globalAlpha = this.transition.progress;
		this.sprite.draw(this.x, this.y);
	}
};

MapItems.Tornado.prototype.drawAnimation = function () {//en fait je me servirais de ça pour la pluie
	if (this.visible) {
		//CE.canvas.animation.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
	}
};