/**
 *
 * @param begin {sec}
 * @param duration {sec}
 * @param event {function}
 * @param action {function(progress)} entre 0 et 1 suivant le début et la fin
 * @constructor
 */
Battle.KeyFrame = function (begin, duration, startEvent, action, endEvent) {
	this.begin = begin;//for human read only
	this.duration = duration;//idem
	this.frameCount = this.duration * Options.Graphic.refreshRate;
	this.beginFrame = begin * Options.Graphic.refreshRate;
	this.startEvent = startEvent || function () {
	};
	this.endEvent = endEvent || function () {
	};
	this.action = action || function () {
	};
	this.progress = 0;
	this.started = false;
}

Battle.KeyFrame.prototype = {
	constructor: Battle.KeyFrame,
	reset: function () {
		this.started = false;
		this.progress = 0;
	},
	update: function (frame) {
		if (this.started == false) {
			if (frame > this.beginFrame && frame < this.beginFrame + this.frameCount) {
				this.started = true;
				this.startEvent();
			}
		} else {
			if (frame >= this.beginFrame + this.frameCount) {
				this.started = false;
				this.endEvent();
			} else {
				this.progress = (frame - this.beginFrame) / this.frameCount;
			}
		}
		if (this.started) {
			this.action(this.progress);
		}
	}
};

Battle.Sequence = function () {
	this.keyFrames = [];
}

Battle.Sequence.prototype = {
	constructor: Battle.Sequence,
	reset: function () {
		for (var i = 0; i < this.keyFrames.length; i++) {
			this.keyFrames[i].reset();
		}
	},
	update: function (progress) {
		for (var i = 0; i < this.keyFrames.length; i++) {
			this.keyFrames[i].update(progress);
		}
	},
	draw: function () {//cette fonction devras être override par les classes enfants
	}
}

Battle.Sequences = {};

Battle.Sequences.MainTimeline = function (playerName, opponentName) {
	Battle.Sequence.call(this);
	this.x = -canvasWidth / 2;
	this.y = canvasHeight / 2 - 50;
	this.text = 'Vs';
	this.keyFrames.push(
		new Battle.KeyFrame(1, 0.3, null,
			function (progress) {//action
				this.x = -canvasWidth / 2 + canvasWidth * progress;
			}.bind(this),
			null
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(2, 0.3, null,
			function (progress) {//action
				this.x = canvasWidth / 2 + canvasWidth * progress;
			}.bind(this),
			null
		)
	);
}

Battle.Sequences.MainTimeline.prototype = new Battle.Sequence();
Battle.Sequences.MainTimeline.prototype.constructor = Battle.Sequences.MainTimeline;

Battle.Sequences.MainTimeline.prototype.drawParent = Battle.Sequences.MainTimeline.prototype.draw;
Battle.Sequences.MainTimeline.prototype.draw = function () {//cette fonction devras être override par les classes enfants
	CE.canvas.animation.context.globalAlpha = 1;
	CE.canvas.animation.context.fillStyle = '#fff';
	CE.canvas.animation.context.fillText(this.text, this.x, this.y);
};


//classe utilisée pour tous les éléments qui se dessineront sur l'écran des combats
Battle.Sequences.Fighter = function (name, x, y, life, damage) {
	Battle.Sequence.call(this);
	this.name = name;
	this.x = x;
	this.y = y;
	this.textX = this.x;
	this.textY = this.y - 200;
	this.life = life;
	this.damage = damage;

	this.initialized = false;
	this.state = Battle.Sequences.Fighter.State.INTRO;

	this.spriteIntro = {};
	this.spriteIdle = {};
	this.spriteAnimation = {};
	this.hit_points = new ParticlesEmitter(SpritePack.Battle.Sprites.HIT_POINT, x, y - 30, 5, 10, 240);
	this.hit_points.gravity = -0.089;
	this.hit_points.scatteringX = 20;
	this.hit_points.scatteringY = 20;
}

Battle.Sequences.Fighter.State = {
	INTRO: 0,
	ANIMATED: 1,
	IDLE: 2
}

Battle.Sequences.Fighter.prototype = new Battle.Sequence();
Battle.Sequences.Fighter.prototype.constructor = Battle.Sequences.Fighter;

Battle.Sequences.Fighter.prototype.resetParent = Battle.Sequences.Fighter.prototype.reset;
Battle.Sequences.Fighter.prototype.reset = function () {
	this.resetParent();
	this.state = Battle.Sequences.Fighter.State.INTRO;
}

Battle.Sequences.Fighter.prototype.updateParent = Battle.Sequences.Fighter.prototype.update;
Battle.Sequences.Fighter.prototype.update = function (progress) {
	this.updateParent(progress);
	this.hit_points.update();
};

//Battle.Sequences.Fighter.prototype.addAnimation(begin,

Battle.Sequences.Fighter.prototype.drawParent = Battle.Sequences.Fighter.prototype.draw;
Battle.Sequences.Fighter.prototype.draw = function () {//cette fonction devras être override par les classes enfants
	if (this.initialized) {
		CE.canvas.animation.context.globalAlpha = 1;
		CE.canvas.animation.context.fillStyle = '#fff';
		CE.canvas.animation.context.fillText(this.name, this.textX, this.textY);
		switch (this.state) {
			case Battle.Sequences.Fighter.State.INTRO:
				this.spriteIntro.drawOnAnimation(this.x, this.y);
				break;
			case Battle.Sequences.Fighter.State.IDLE:
				this.spriteIdle.drawOnAnimation(this.x, this.y);
				break;
			case Battle.Sequences.Fighter.State.ANIMATED:
				this.spriteAnimation.drawOnAnimation(this.x, this.y);
				break;
		}
		this.hit_points.draw();
	}
};

Battle.Sequences.Player = function (name, x, y, life, damage) {
	Battle.Sequences.Fighter.call(this, name, x, y, life, damage);
	this.spriteIntro = SpritePack.Battle.Sprites.PLAYER_FLYING;
	this.spriteIdle = SpritePack.Battle.Sprites.PLAYER_IDLE;
	this.textX = canvasWidth * 3 / 4;
	this.keyFrames.push(
		new Battle.KeyFrame(0, 0.5, null,
			function (progress) {//action
				this.textY = 200 * progress;
				this.x = canvasWidth + 250 - (canvasWidth / 2) * progress;
			}.bind(this),
			null
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(2, 0.5, null,
			function (progress) {//action
				this.textY = 200 - 400 * progress;
			}.bind(this),
			null
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(3, 1, null,
			function (progress) {//action
				this.x = canvasWidth / 2 + 250 - 100 * progress;
				this.spriteAnimation = SpritePack.Fight.Sprites.PLAYER_INTRO;
				this.state = Battle.Sequences.Fighter.State.ANIMATED;
			}.bind(this),
			function (progress) {//end
				this.state = Battle.Sequences.Fighter.State.IDLE;
			}.bind(this)
		)
	);
	this.initialized = true;
}

Battle.Sequences.Player.prototype = new Battle.Sequences.Fighter();
Battle.Sequences.Player.prototype.constructor = Battle.Sequences.Player;

Battle.Sequences.Opponent = function (name, x, y, life, damage) {
	Battle.Sequences.Fighter.call(this, name, x, y, life, damage);
	this.spriteIntro = SpritePack.Battle.Sprites.OPPONENT_FLYING;
	this.spriteIdle = SpritePack.Battle.Sprites.OPPONENT_IDLE;
	this.textX = canvasWidth * 1 / 4;
	this.keyFrames.push(
		new Battle.KeyFrame(0, 0.5, null,
			function (progress) {//action
				this.textY = 200 * progress;
				this.x = (canvasWidth / 2) * progress - 250;
			}.bind(this),
			null
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(2, 0.5, null,
			function (progress) {//action
				this.textY = 200 - 400 * progress;
			}.bind(this),
			null
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(3, 1, null,
			function (progress) {//action
				this.x = canvasWidth / 2 - 250 + 100 * progress;
				this.spriteAnimation = SpritePack.Fight.Sprites.OPPONENT_INTRO;
				this.state = Battle.Sequences.Fighter.State.ANIMATED;
			}.bind(this),
			function (progress) {//end
				this.state = Battle.Sequences.Fighter.State.IDLE;
			}.bind(this)
		)
	);
	this.initialized = true;
}

Battle.Sequences.Opponent.prototype = new Battle.Sequences.Fighter();
Battle.Sequences.Opponent.prototype.constructor = Battle.Sequences.Opponent;