CrymeEngine.Battle = {
	background: {},
	elements: [],
	breathTransition: {},
	auraTransition: {},
	playerTransition: {},
	initialized: false,
	init: function () {
		this.background = SpritePack.Battle.Sprites.BACKGROUND;
		this.breathTransition = new Transition(0.9, 1.1, 30, function () {
		});
		this.breathTransition.loop = true;
		this.breathTransition.start(Transition.Type.FADE_IN);
		this.auraTransition = new Transition(0, 1, 600, function () {
		});
		this.auraTransition.loop = true;
		this.auraTransition.start(Transition.Type.FADE_IN);
		this.playerTransition = new Transition(1, 2, 10, function () {
		});
		this.playerTransition.start(Transition.Type.FADE_OUT, true);
		this.elements = [];
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 5; j++) {
				this.elements.push(new Battle.BackgroundParticle(-1500 + j * 600 - 200 * i, -2000 + i * 400 + 300 * j));
			}
		}
		this.elements.push(new Battle.Avatar(960, 500));//avatar
		this.elements.push(new Battle.Button(SpritePack.Battle.Sprites.BUTTON_AK47, 460, 500));//left
		this.elements.push(new Battle.Button(SpritePack.Battle.Sprites.BUTTON_JUMP, 960, 200));//top
		this.elements.push(new Battle.Button(SpritePack.Battle.Sprites.BUTTON_CROP, 1460, 500));//right
		this.elements.push(new Battle.Button(SpritePack.Battle.Sprites.BUTTON_DODGE, 960, 800));//bottom

		this.initialized = true;
	},
	launchBattle: function () {
		this.init();
	},
	update: function () {
		this.breathTransition.updateProgress();
		this.auraTransition.updateProgress();
		this.playerTransition.updateProgress();
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].update();
		}
	},
	draw: function () {
		if (this.initialized) {
			this.update();
			CE.canvas.animation.context.translate(Math.random() * 5, Math.random() * 5);
			CE.canvas.animation.context.scale(1.02, 1.02);
			CE.canvas.animation.context.drawImage(this.background.image, -10, -10);
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].draw();
			}
		}
	}
};