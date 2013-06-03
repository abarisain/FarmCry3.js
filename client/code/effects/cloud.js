MapItems.Cloud = function (col, line) {
	MapItem.call(this, SpritePack.Effects.Sprites.CLOUD, col, line);
	this.updateCoord();
	this.updateImageCoord();
	this.emitterRain = new ParticlesEmitter(SpritePack.Effects.Sprites.RAIN, this.x, this.y - 1000, 0.01, 10, 20);
	this.emitterRain.scale = 2;
	this.emitterRain.scatteringX = 20;
	this.movement = { finalPosition: { x: 0, y: 0}, startPosition: { x: 0, y: 0}};
	this.alpha = 0.6 * Math.random() + 0.4;
	var cloud = this;
	this.transition = new Transition(0, 1, 600, function () {
		cloud.raining = false;
	});
	this.transition.start(Transition.Type.FADE_IN);
	this.transition.loop = true;
	this.raining = false;
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
	this.emitterRain.update();
}

MapItems.Cloud.prototype.rain = function () {
	this.raining = true;
	this.transition.start(Transition.Type.FADE_IN);
	this.emitterRain.start(5, 1 / 2 * Math.PI, 0);
}

MapItems.Cloud.prototype.draw = function () {
	if (this.visible) {
		if (this.raining) {
			CE.canvas.animation.context.globalAlpha = this.transition.progress;
			this.emitterRain.draw();
		} else {
			CE.canvas.animation.context.globalAlpha = this.transition.progress * this.alpha;
		}
		CE.canvas.animation.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
	}
};