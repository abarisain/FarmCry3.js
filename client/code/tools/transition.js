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
		CrymeEngine.invalidateGraphic = true;
		if (this.started) {
			if (this.transitionType === Transition.Type.FADE_IN) {
				this.progress += this.progressRate;
				if (Math.abs(this.progress) >= Math.abs(this.progressMax)) {
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
				this.progress -= this.progressRate;
				if (this.progress <= this.progressInit) {
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