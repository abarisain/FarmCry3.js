MapItems.Cloud = function (col, line) {
	MapItem.call(this, SpritePack.Effects.Sprites.CLOUD, col, line);
	this.updateCoord();
	this.updateImageCoord();
	this.emitterRain = new ParticlesEmitter(SpritePack.Effects.Sprites.RAIN, this.x, this.y - 1000, 0.01, 7, 240);
	this.emitterRain.scale = 1;
	this.emitterRain.scatteringX = 20;
	var cloud = this;
	this.emitterRain.endEvent = function () {
		cloud.raining = false;
		cloud.transitionThunder.started = false;
	}
	this.movement = { finalPosition: { x: 0, y: 0}, startPosition: { x: 0, y: 0}};
	this.alpha = 0.6 * Math.random() + 0.4;
	this.transition = new Transition(0, 1, 600, function () {
	});
	this.transition.start(Transition.Direction.IN);
	this.transition.loopType = Transition.LoopType.BOUNCE;

	this.transitionThunder = new Transition(0, 300, 300, function () {
	});
	this.transitionThunder.loopType = Transition.LoopType.RESET;

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
	this.transitionThunder.updateProgress();
	this.emitterRain.update();
}

MapItems.Cloud.prototype.rain = function () {
	this.raining = true;
	this.transition.start(Transition.Direction.IN, false);
	this.transitionThunder.start(Transition.Direction.IN, true);
	this.emitterRain.start(5, 1 / 2 * Math.PI + Math.PI * 3 / 180, 0);
}

MapItems.Cloud.prototype.draw = function () {
	if (this.visible) {
		if (this.raining) {
			var maxAlpha = 1;
			if (this.transitionThunder.started && this.transitionThunder.progress > this.transitionThunder.progressMax - 5) {
				maxAlpha = this.transition.progress * ((this.transitionThunder.progressMax - this.transitionThunder.progress) / 5);
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