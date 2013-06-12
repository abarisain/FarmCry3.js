/**
 *
 * @param begin {sec}
 * @param duration {sec}
 * @param startEvent {function}
 * @param action {function(progress)} entre 0 et 1 suivant le début et la fin
 * @param endEvent {function}
 * @param draw {function()}
 * @constructor
 */
Battle.KeyFrame = function (begin, duration, startEvent, action, endEvent, drawAction) {
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
	this.drawAction = drawAction || null;
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
	},
	draw: function () {
		if (this.drawAction != null && this.started) {
			this.drawAction(this.progress);
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
		CE.canvas.animation.context.globalAlpha = 1;
		for (var i = 0; i < this.keyFrames.length; i++) {
			this.keyFrames[i].draw();
		}
		CE.canvas.animation.context.globalAlpha = 1;
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
	this.keyFrames.push(
		new Battle.KeyFrame(1.5, 0.3, null, null, null,
			function (progress) {//drawAction
				CE.canvas.animation.context.globalAlpha = progress;
				SpritePack.Battle.Sprites.LIGHTNING.drawOnAnimation(canvasWidth / 2, 0);
			}
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(3, 0.1, function (progress) {//drawAction
				CE.Battle.launchFight();
			},
			null, null)
	);
}

Battle.Sequences.MainTimeline.prototype = new Battle.Sequence();
Battle.Sequences.MainTimeline.prototype.constructor = Battle.Sequences.MainTimeline;

Battle.Sequences.MainTimeline.prototype.drawParent = Battle.Sequences.MainTimeline.prototype.draw;
Battle.Sequences.MainTimeline.prototype.draw = function () {//cette fonction devras être override par les classes enfants
	CE.canvas.animation.context.globalAlpha = 1;
	CE.canvas.animation.context.fillStyle = '#fff';
	CE.canvas.animation.context.fillText(this.text, this.x, this.y);
	this.drawParent();
};


//classe utilisée pour tous les éléments qui se dessineront sur l'écran des combats
Battle.Sequences.Fighter = function (name, x, y, life, damage) {
	Battle.Sequence.call(this);
	this.name = name;
	this.x = x;
	this.y = y;
	this.finalX = 0;
	this.finalY = 0;
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

var dodgeDelay = 1 / 3;

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

Battle.Sequences.Fighter.prototype.addDamage = function (begin, damage) {
	this.keyFrames.push(
		new Battle.KeyFrame(begin, 1,
			function (progress) {//action
				this.hit_points.additionnalStart(damage);
				this.state = Battle.Sequences.Fighter.State.ANIMATED;
			}.bind(this)
		)
	);
};

Battle.Sequences.Fighter.prototype.addAnimation = function (begin, name, duration) {
	this.keyFrames.push(
		new Battle.KeyFrame(begin, duration || 1, function () {
			this.spriteAnimation = SpritePack.Fight.Sprites[name];
			this.state = Battle.Sequences.Fighter.State.ANIMATED;
			this.spriteAnimation.reset();
		}.bind(this),
			null,
			function (progress) {//end
				this.state = Battle.Sequences.Fighter.State.IDLE;
			}.bind(this)
		)
	);
};

Battle.Sequences.Fighter.prototype.drawParent = Battle.Sequences.Fighter.prototype.draw;
Battle.Sequences.Fighter.prototype.draw = function () {//cette fonction devras être override par les classes enfants
	if (this.initialized) {
		this.drawParent();
		CE.canvas.animation.context.globalAlpha = 1;
		if (CE.Battle.fightPhase == CE.Battle.FightPhase.FIGHT) {
			SpritePack.Battle.Sprites.GROUND.drawOnAnimation(this.finalX, this.finalY + 110);
		}

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
	this.hit_points.init(5, 3, -Math.PI * 100 / 180, 45 * Math.PI / 180, 1, 0.8);
	this.spriteIntro = SpritePack.Battle.Sprites.PLAYER_FLYING;
	this.spriteIdle = SpritePack.Battle.Sprites.PLAYER_IDLE;
	this.finalX = canvasWidth / 2 + 150;
	this.finalY = this.y;
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
			}.bind(this),
			null
		)
	);
	this.addAnimation(3, 'PLAYER_INTRO');
	this.addAnimation(4, 'PLAYER_AK');
	this.addAnimation(5 + dodgeDelay, 'PLAYER_HIT', 1 - dodgeDelay);
	this.addDamage(5 + dodgeDelay, 20);
	this.addAnimation(6, 'PLAYER_DODGE_AK');
	this.addAnimation(7, 'PLAYER_AK');
	this.initialized = true;
}

Battle.Sequences.Player.prototype = new Battle.Sequences.Fighter();
Battle.Sequences.Player.prototype.constructor = Battle.Sequences.Player;

Battle.Sequences.Opponent = function (name, x, y, life, damage) {
	Battle.Sequences.Fighter.call(this, name, x, y, life, damage);
	this.hit_points.init(5, 3, -Math.PI * 80 / 180, 45 * Math.PI / 180, 1, 0.8);
	this.spriteIntro = SpritePack.Battle.Sprites.OPPONENT_FLYING;
	this.spriteIdle = SpritePack.Battle.Sprites.OPPONENT_IDLE;
	this.finalX = canvasWidth / 2 - 150;
	this.finalY = this.y;
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
			}.bind(this),
			null
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(3.2, 0.4, null, null, null,
			function (progress) {//action
				CE.canvas.animation.context.globalAlpha = progress;
				SpritePack.Battle.Sprites.SHOCKWAVE.drawOnAnimation(this.finalX, this.finalY - 100);
				SpritePack.Battle.Sprites.EXPLOSION.drawOnAnimation(this.finalX, this.finalY - 150);
			}.bind(this)
		)
	);
	this.addAnimation(3, 'OPPONENT_INTRO');
	this.addAnimation(4 + dodgeDelay, 'OPPONENT_DODGE_AK', 1 - dodgeDelay);
	this.addAnimation(5, 'OPPONENT_AK');
	this.addAnimation(6, 'OPPONENT_AK');
	this.addAnimation(7 + dodgeDelay, 'OPPONENT_HIT', 1 - dodgeDelay);
	this.addDamage(7 + dodgeDelay, 30);
	this.initialized = true;
}

Battle.Sequences.Opponent.prototype = new Battle.Sequences.Fighter();
Battle.Sequences.Opponent.prototype.constructor = Battle.Sequences.Opponent;