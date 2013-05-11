//progressInit est la valeur de début pour la transition
//progressMax est la valeur maximale de la progression pour la transition
//duration est la durée qui va permettre de calculer la progression
function Transition(progressInit, progressMax, duration, eventEnd) {
	this.progressInit = progressInit;
	this.progressMax = progressMax;
	this.progress = progressInit;
	this.duration = duration;
	this.progressRate = (progressMax - progressInit) / duration;
	this.started = false;
	this.transitionType = Transition.Type.FADE_IN;
	this.eventEnd = eventEnd;
	this.state = Transition.State.BEGIN;
	this.loop = false;
	this.smoothing = false;
	this.smoothingProgress = 0;
}

Transition.Type = {
	FADE_IN: -1, //on va de la valeur minimale à la valeur max avec max > init
	FADE_OUT: 1//l'inverse
};

Transition.State = {
	BEGIN: 0,
	MOVING: 1,
	END: 2
};

Transition.prototype = {
	constructor: Transition,
	start: function (transitionType, reinitialize) {
		this.started = true;
		this.smoothingProgress = 0;
		CrymeEngine.invalidateGraphic = true;
		this.transitionType = transitionType;
		this.state = Transition.State.MOVING;
		if (reinitialize) {
			if (transitionType === Transition.Type.FADE_IN) {
				this.progress = this.progressInit;
			} else {
				this.progress = this.progressMax;
			}
		}
	},
	updateProgress: function () {
		if (this.started) {
			if (this.transitionType === Transition.Type.FADE_IN) {
				if (this.smoothing) {
					this.smoothingProgress += 1 / this.duration;
					this.progress = getBezier(this.smoothingProgress);
				} else {
					this.progress += this.progressRate;
				}
				if ((this.smoothing && this.smoothingProgress >= 1) || (!this.smoothing && Math.abs(this.progress) >= Math.abs(this.progressMax))) {
					this.progress = this.progressMax;
					if (this.loop) {
						this.transitionType = Transition.Type.FADE_OUT;
					} else {
						this.started = false;
						this.state = Transition.State.END;
						this.eventEnd(this.transitionType);
					}

				} else {
					return this.progress;
				}
			}
			else {
				if (this.smoothing) {
					this.smoothingProgress -= 1 / this.duration;
					this.progress = getBezier(this.smoothingProgress);
				} else {
					this.progress -= this.progressRate;
				}
				if ((this.smoothing && this.smoothingProgress <= 0) || (!this.smoothing && this.progress <= this.progressInit)) {
					this.progress = this.progressInit;
					if (this.loop) {
						this.transitionType = Transition.Type.FADE_IN;
					} else {
						this.started = false;
						this.state = Transition.State.BEGIN;
						this.eventEnd(this.transitionType);
					}

				} else {
					return this.progress;
				}
			}
		}
	},
	percentage: function () {
		if (this.transitionType === Transition.Type.FADE_IN) {
			return this.progress / (this.progressMax - this.progressInit);
		}
		else {
			return this.progress / Math.abs(this.progressInit - this.progressMax);
		}
	}
};

function B1(t) {
	return t * t * t
}
function B2(t) {
	return 3 * t * t * (1 - t)
}
function B3(t) {
	return 3 * t * (1 - t) * (1 - t)
}
function B4(t) {
	return (1 - t) * (1 - t) * (1 - t)
}

function getBezier(percent) {
	return 0 * B2(1 - percent) + 1 * B3(1 - percent) + 1 * B4(1 - percent);
}