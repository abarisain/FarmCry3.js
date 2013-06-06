CrymeEngine.Battle = {
	background: {},
	elements: [],
	breathTransition: {},
	auraTransition: {},
	playerTransition: {},
	weaponTransition: {},
	explosion: null,
	initialized: false,
	init: function (weaponSprite) {
		this.background = SpritePack.Battle.Sprites.BACKGROUND;
		this.breathTransition = new Transition(0.9, 1.1, 30, function () {
		});
		this.breathTransition.loopType = Transition.LoopType.BOUNCE;
		this.breathTransition.start(Transition.Direction.IN);
		this.auraTransition = new Transition(0, 1, 300, function () {
			CE.gameState = CE.GameState.FARMING;
			CE.mapInvalidated = true;
		});
		this.auraTransition.start(Transition.Direction.IN);
		this.playerTransition = new Transition(1, 2, 10, function () {
			CE.Battle.weaponTransition.start(Transition.Direction.IN, true);
		});
		this.playerTransition.start(Transition.Direction.OUT, true);
		this.weaponTransition = new Transition(0, 1, 15, function () {
			CE.Battle.weaponTransition.start(Transition.Direction.OUT);
			if (!CE.Battle.explosion.started) {
				CE.Battle.explosion.start(5, 3, -Math.PI * 90 / 180, 45 * Math.PI / 180, 1, 0.8);
			}
		});
		this.explosion = new ParticlesEmitter(SpritePack.Battle.Sprites.HIT_POINT, canvasWidth / 2 - 40, canvasHeight / 2 - 120, 5, 30, 600);
		this.explosion.gravity = -0.089;
		this.explosion.scatteringX = 20;
		this.explosion.scatteringY = 20;
		this.elements = [];
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 5; j++) {
				this.elements.push(new Battle.BackgroundParticle(-1500 + j * 600 - 200 * i, -2000 + i * 400 + 300 * j));
			}
		}
		this.elements.push(new Battle.Avatar(canvasWidth / 2, canvasHeight / 2));//avatar
		this.elements.push(new Battle.Weapon(weaponSprite, canvasWidth / 2 - 350, 270));//weapon

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
		this.explosion.update();
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

			CE.canvas.animation.context.globalAlpha = 1;//vu que l'opacité est modifié par les particules
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].draw();
			}
			this.explosion.draw();
		}
	}
};