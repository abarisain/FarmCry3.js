MapItems.Cloud = function (col, line) {
	MapItem.call(this, SpritePack.Effects.Sprites.CLOUD, col, line);
	this.updateCoord();
	this.updateImageCoord();
	this.emitterRain = new ParticlesEmitter(SpritePack.Effects.Sprites.RAIN, this.x, this.y - 1000, 0.01, -1, 240);
	this.emitterRain.scale = 1;
	this.emitterRain.scatteringX = 20;
	this.movement = { finalPosition: { x: 0, y: 0}, startPosition: { x: 0, y: 0}};
	this.alpha = 0.6 * Math.random() + 0.4;
	this.transition = new Transition(0, 1, 600, function () {
	});
	this.transition.start(Transition.Direction.IN);
	this.transition.loopType = Transition.LoopType.BOUNCE;

	this.transitionThunder = new Transition(0, 300, 300, function () {
	});
	this.transitionThunder.loopType = Transition.LoopType.RESET;
	this.thunderAlpha = 0;
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

MapItems.Cloud.prototype.update = function (thunderAlpha) {
	this.x = this.movement.startPosition.x + (this.movement.finalPosition.x - this.movement.startPosition.x) * CE.Environment.movementTransition.progress;
	this.y = this.movement.startPosition.y + (this.movement.finalPosition.y - this.movement.startPosition.y) * CE.Environment.movementTransition.progress;
	this.updateImageCoord();
	this.transition.updateProgress();
	this.emitterRain.update();
	this.thunderAlpha = thunderAlpha;
}

MapItems.Cloud.prototype.startRain = function () {
	if (this.raining)
		return;
	this.raining = true;
	this.transition.start(Transition.Direction.IN, false);
	this.transition.loopType = Transition.LoopType.NONE;
	this.emitterRain.start(5, 0, 1 / 2 * Math.PI + Math.PI * 3 / 180, 0);
}

MapItems.Cloud.prototype.stopRain = function () {
	this.transition.start(Transition.Direction.OUT, false);
	this.transition.loopType = Transition.LoopType.BOUNCE;
	this.emitterRain.stop();
	this.emitterRain.endEvent = function () {
		this.raining = false;
	}.bind(this);
}

MapItems.Cloud.prototype.draw = function () {
	if (this.visible) {
		if (this.raining) {
			var maxAlpha = 1;
			if (this.thunderAlpha > 0) {
				// Thunder strikes
				maxAlpha = this.transition.progress * this.thunderAlpha;
			} else {
				maxAlpha = this.transition.progress;
			}
			this.emitterRain.draw(CE.canvas.animation.context.globalAlpha);
			CE.canvas.animation.context.globalAlpha = maxAlpha;
		} else {
			CE.canvas.animation.context.globalAlpha = this.transition.progress * this.alpha;
		}
		CE.canvas.animation.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
	}
};