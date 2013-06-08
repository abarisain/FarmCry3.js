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
	update: function (frame) {
		if (this.started == false) {
			if (frame >= this.beginFrame && frame < this.beginFrame + this.frameCount) {
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
	},
	draw: function () {
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
	update: function (progress) {
		for (var i = 0; i < this.keyFrames.length; i++) {
			this.keyFrames[i].update(progress);
		}
	},
	draw: function () {//cette fonction devras être override par les classes enfants
		for (var i = 0; i < this.keyFrames.length; i++) {
			this.keyFrames[i].draw();
		}
	}
}

Battle.Sequences = {};

Battle.Sequences.MainTimeline = function () {
	Battle.Sequence.call(this);
	this.keyFrames.push(
		new Battle.KeyFrame(0, 1, null,
			function (progress) {
				CE.canvas.animation.context.fillStyle = '#fff';
				CE.canvas.animation.context.fillText('Kalahims attack !', (canvasWidth / 2) * progress, 200);
			},
			null
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(1, 1, null,
			function (progress) {
				CE.canvas.animation.context.fillStyle = '#fff';
				CE.canvas.animation.context.fillText('Kalahims attack !', canvasWidth / 2, 200);
			},
			null
		)
	);
	this.keyFrames.push(
		new Battle.KeyFrame(2, 1, null,
			function (progress) {
				CE.canvas.animation.context.fillStyle = '#fff';
				CE.canvas.animation.context.fillText('Kalahim attacks !', canvasWidth / 2 + (canvasWidth + 700) * progress, 200);
			},
			null
		)
	);
}

Battle.Sequences.MainTimeline.prototype = new Battle.Sequence();
Battle.Sequences.MainTimeline.prototype.constructor = Battle.Sequences.MainTimeline;


//classe utilisée pour tous les éléments qui se dessineront sur l'écran des combats
Battle.Sequences.Fighter = function (x, y) {
	Battle.Sequence.call(this);
	this.hit_points = new ParticlesEmitter(SpritePack.Battle.Sprites.HIT_POINT, x, y - 30, 5, 10, 240);
	this.hit_points.gravity = -0.089;
	this.hit_points.scatteringX = 20;
	this.hit_points.scatteringY = 20;
	this.x = x;
	this.y = y;
	this.state = Battle.Sequences.Fighter.State.HIDDEN;
}

Battle.Sequences.Fighter.State = {
	HIDDEN: 0,
	ANIMATED: 1,
	IDLE: 2
}

Battle.Sequences.Fighter.prototype = new Battle.Sequence();
Battle.Sequences.Fighter.prototype.constructor = Battle.Sequences.Fighter;
Battle.Sequences.Fighter.prototype.updateParent = Battle.Sequences.Fighter.prototype.update;
Battle.Sequences.Fighter.prototype.update = function () {
	this.updateParent();
	this.hit_points.update();
};

Battle.Sequences.Fighter.prototype.drawParent = Battle.Sequences.Fighter.prototype.draw;
Battle.Sequences.Fighter.prototype.draw = function () {//cette fonction devras être override par les classes enfants
	CE.canvas.animation.context.globalAlpha = 1;
	this.drawParent();
	this.hit_points.draw();
};
