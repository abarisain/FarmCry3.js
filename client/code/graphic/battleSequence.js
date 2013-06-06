//classe utilisée pour tous les éléments qui se dessineront sur l'écran des combats
Battle.Sequence = function (x, y, eventEnd) {
	this.animations = [];
	this.hit_points = new ParticlesEmitter(SpritePack.Battle.Sprites.HIT_POINT, x, y - 30, 5, 10, 240);
	this.hit_points.gravity = -0.089;
	this.hit_points.scatteringX = 20;
	this.hit_points.scatteringY = 20;
	this.x = x;
	this.y = y;
	this.currentAnimation = 0;
	this.currentFrame = 0;
	this.frameCount = 0;
	this.started = true;
	this.eventEnd = eventEnd;
}

Battle.Sequence.prototype = {
	constructor: Battle.Sequence,
	addAnimation: function (animation) {
		this.animations.push(animation);
		this.frameCount += animation.frameCount;
	},
	update: function () {
		this.hit_points.update();
		if (this.started) {
			this.currentFrame += this.animations[this.currentAnimation].frameSpeed;
			if (this.currentFrame >= this.animations[this.currentAnimation].frameCount) {
				this.currentAnimation++;
				this.currentFrame = 0;
				if (this.currentAnimation >= this.animations.length) {
					this.eventEnd();
					this.started = false;
				} else {
					this.hit_points.additionnalStart(Math.random() * 10);
				}
			}
		}
	},
	draw: function () {//cette fonction devras être override par les classes enfants
		if (this.started) {
			CE.canvas.animation.context.globalAlpha = 1;
			this.animations[this.currentAnimation].draw(this.x, this.y);
		}
		this.hit_points.draw();
	}
}
