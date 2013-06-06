CrymeEngine.Battle = {
	background: {},
	elements: [],
	breathTransition: {},//used to make buttton breath
	auraTransition: {},
	playerTransition: {},//used to display the character with a small animation
	weaponTransition: {},//used to move the main weapon
	player_hit_points: null,
	opponent_hit_points: null,
	explosion: null,
	initialized: false,
	FightPhase: {
		INTRODUCTION: 0,
		FIGHT: 1
	},
	fightPhase: 0,
	init: function (weaponSprite) {
		this.fightPhase = CE.Battle.FightPhase.INTRODUCTION;
		this.background = SpritePack.Battle.Sprites.BACKGROUND;
		this.breathTransition = new Transition(0.9, 1.1, 30, function () {
		});
		this.breathTransition.loopType = Transition.LoopType.BOUNCE;
		this.breathTransition.start(Transition.Direction.IN);
		this.auraTransition = new Transition(0, 1, 120, function () {
			CE.Battle.playerTransition.start(Transition.Direction.IN);
			CE.Battle.explosion.start(60, 20, 0, 0, 1, 3);
		});
		this.auraTransition.start(Transition.Direction.IN);
		this.playerTransition = new Transition(1, 2, 10, function () {
			CE.Battle.weaponTransition.start(Transition.Direction.IN, true);
		});
		this.playerTransition.start(Transition.Direction.OUT, true);
		this.weaponTransition = new Transition(0, 1, 15, function () {
			CE.Battle.weaponTransition.start(Transition.Direction.OUT);

		});

		this.explosion = new ParticlesEmitter(SpritePack.Effects.Sprites.FIRE, 0, canvasHeight / 2, 120, 240, 40);
		this.explosion.scatteringY = canvasHeight;
		this.explosion.endEvent = function () {
			CE.Battle.launchFight();
		};

		this.player_hit_points = new ParticlesEmitter(SpritePack.Battle.Sprites.HIT_POINT, canvasWidth - 270, canvasHeight / 2 - 120, 5, 10, 240);
		this.player_hit_points.endEvent = function () {
			CE.Battle.stopBattle();
		};
		this.player_hit_points.gravity = -0.089;
		this.player_hit_points.scatteringX = 20;
		this.player_hit_points.scatteringY = 20;

		this.opponent_hit_points = new ParticlesEmitter(SpritePack.Battle.Sprites.HIT_POINT, 280, canvasHeight / 2 - 120, 5, 30, 240);
		this.opponent_hit_points.gravity = -0.089;
		this.opponent_hit_points.scatteringX = 20;
		this.opponent_hit_points.scatteringY = 20;

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
	launchFight: function () {
		this.fightPhase = CE.Battle.FightPhase.FIGHT;

		this.elements = [];
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 5; j++) {
				this.elements.push(new Battle.BackgroundParticle(-1500 + j * 600 - 200 * i, -2000 + i * 400 + 300 * j));
			}
		}
		this.elements.push(new Battle.Element(SpritePack.Battle.Sprites.AVATAR, canvasWidth - 250, canvasHeight / 2));//avatar
		this.elements.push(new Battle.Element(SpritePack.Battle.Sprites.AVATAR_BAD_GUY, 250, canvasHeight / 2));//avatar

		CE.Battle.player_hit_points.start(5, 3, -Math.PI * 100 / 180, 45 * Math.PI / 180, 1, 0.8);
		CE.Battle.opponent_hit_points.start(5, 3, -Math.PI * 80 / 180, 45 * Math.PI / 180, 1, 0.8);
	},
	stopBattle: function () {
		CE.gameState = CE.GameState.FARMING;
		CE.mapInvalidated = true;
	},
	update: function () {
		this.breathTransition.updateProgress();
		this.auraTransition.updateProgress();
		this.playerTransition.updateProgress();
		this.weaponTransition.updateProgress();
		this.explosion.update();
		this.player_hit_points.update();
		this.opponent_hit_points.update();
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
			this.player_hit_points.draw();
			this.opponent_hit_points.draw();
		}
	}
};