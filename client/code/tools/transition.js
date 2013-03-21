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
}

Transition.Type = {
	FADE_IN: -1,//on va de la valeur minimale à la valeur max avec max > init
	FADE_OUT: 1//l'inverse
}

Transition.prototype = {
	constructor: Transition,
	start: function (transitionType) {
		this.started = true;
		this.progress = this.progressInit;
		this.transitionType = transitionType;
	},
	updateProgress: function () {
		if (this.started) {
			if (this.transitionType == Transition.Type.FADE_IN) {
				this.progress += this.progressRate;
				if (Math.abs(this.progress) >= Math.abs(this.progressMax)) {
					this.progress = this.progressMax;
					this.started = false;
					this.eventEnd(this.transitionType);
				}
				else {
					return this.progress;
				}
			}
			else {
				if (Math.abs(this.progress) <= Math.abs(this.progressInit)) {
					this.progress = this.progressInit;
					this.started = false;
					this.eventEnd(this.transitionType);
				}
				else {
					return this.progress;
				}
			}
		}
	}
}