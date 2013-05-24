CrymeEngine.Battle = {
	background: {},
	elements: [],
	breathTransition: {},
	auraTransition: {},
	playerTransition: {},
	weaponTransition: {},
	initialized: false,
	init: function (weaponSprite) {
		this.background = SpritePack.Battle.Sprites.BACKGROUND;
		this.breathTransition = new Transition(0.9, 1.1, 30, function () {
		});
		this.breathTransition.loop = true;
		this.breathTransition.start(Transition.Type.FADE_IN);
		this.auraTransition = new Transition(0, 1, 300, function () {
			CE.gameState = CE.GameState.FARMING;
			CE.mapInvalidated = true;
		});
		this.auraTransition.start(Transition.Type.FADE_IN);
		this.playerTransition = new Transition(1, 2, 10, function () {
			CE.Battle.weaponTransition.start(Transition.Type.FADE_IN, true);
		});
		this.playerTransition.start(Transition.Type.FADE_OUT, true);
		this.weaponTransition = new Transition(0, 1, 15, function () {
			CE.Battle.weaponTransition.start(Transition.Type.FADE_OUT);
		});
		this.elements = [];
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 5; j++) {
				this.elements.push(new Battle.BackgroundParticle(-1500 + j * 600 - 200 * i, -2000 + i * 400 + 300 * j));
			}
		}
		this.elements.push(new Battle.Avatar(canvasWidth / 2, canvasHeight / 2));//avatar
		this.elements.push(new Battle.Weapon(weaponSprite, canvasWidth / 2 - 350, 270));//weapon
		this.elements.push(new Battle.Button(SpritePack.Battle.Sprites.BUTTON_AK47, canvasWidth / 2 - 350, canvasHeight / 2));//left
		this.elements.push(new Battle.Button(SpritePack.Battle.Sprites.BUTTON_JUMP, canvasWidth / 2, canvasHeight / 2 - 350));//top
		this.elements.push(new Battle.Button(SpritePack.Battle.Sprites.BUTTON_CROP, canvasWidth / 2 + 350, canvasHeight / 2));//right
		this.elements.push(new Battle.Button(SpritePack.Battle.Sprites.BUTTON_DODGE, canvasWidth / 2, canvasHeight / 2 + 350));//bottom

		this.initialized = true;
	},
	launchBattle: function (weaponSprite) {//c'est temporaire de passer le sprite de l'arme en paramètre of course
		this.init(weaponSprite);
	},
	update: function () {
		this.breathTransition.updateProgress();
		this.auraTransition.updateProgress();
		this.playerTransition.updateProgress();
		this.weaponTransition.updateProgress();
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