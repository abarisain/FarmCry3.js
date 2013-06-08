//classe utilisée pour tous les éléments qui se dessineront sur l'écran des combats
CE.Battle.Timeline = {
	sequences: [],
	currentFrame: 0,
	duration: 5,//10 sec
	frameCount: 5 * Options.Graphic.refreshRate,
	started: true,
	eventEnd: function () {
		CE.Battle.stopBattle();
	},
	update: function () {
		this.currentFrame++;
		if (this.currentFrame >= this.frameCount) {
			this.started = false;
			this.eventEnd();
		} else {
			for (var i = 0; i < this.sequences.length; i++) {
				this.sequences[i].update(this.currentFrame);
			}
		}
	},
	draw: function () {//cette fonction devras être override par les classes enfants
		if (this.started) {
			for (var i = 0; i < this.sequences.length; i++) {
				this.sequences[i].draw();
			}
		}
	}
}
