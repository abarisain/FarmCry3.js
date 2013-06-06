CrymeEngine.Battle = {
	background: {},
	elements: [],
	breathTransition: {},//used to make buttton breath
	auraTransition: {},
	playerTransition: {},//used to display the character with a small animation
	weaponTransition: {},//used to move the main weapon
	playerSequence: {},
	opponentSequence: {},
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
			CE.Battle.launchFight();
		});
		this.auraTransition.start(Transition.Direction.IN);
		this.playerTransition = new Transition(1, 2, 10, function () {
			CE.Battle.weaponTransition.start(Transition.Direction.IN, true);
		});
		this.playerTransition.start(Transition.Direction.OUT, true);
		this.weaponTransition = new Transition(0, 1, 15, function () {
			CE.Battle.weaponTransition.start(Transition.Direction.OUT);
		});

		this.playerSequence = new Battle.Sequence(canvasWidth / 2 + 250, canvasHeight / 2, function () {
			CE.Battle.stopBattle();
		});

		this.opponentSequence = new Battle.Sequence(canvasWidth / 2 - 250, canvasHeight / 2, function () {
		});

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
		this.playerSequence.addAnimation(SpritePack.Fight.Sprites.PLAYER_INTRO);
		this.playerSequence.addAnimation(SpritePack.Fight.Sprites.PLAYER_DODGE);
		this.playerSequence.addAnimation(SpritePack.Fight.Sprites.PLAYER_FORK);
		this.playerSequence.addAnimation(SpritePack.Fight.Sprites.PLAYER_HIT);
		this.playerSequence.addAnimation(SpritePack.Fight.Sprites.PLAYER_FORK);

		this.opponentSequence.addAnimation(SpritePack.Fight.Sprites.OPPONENT_INTRO);
		this.opponentSequence.addAnimation(SpritePack.Fight.Sprites.OPPONENT_FORK);
		this.opponentSequence.addAnimation(SpritePack.Fight.Sprites.OPPONENT_HIT);
		this.opponentSequence.addAnimation(SpritePack.Fight.Sprites.OPPONENT_FORK);
		this.opponentSequence.addAnimation(SpritePack.Fight.Sprites.OPPONENT_DODGE);

		this.elements.push(this.playerSequence);//avatar
		this.elements.push(this.opponentSequence);//avatar

	},
	stopBattle: function () {
		CE.gameState = CE.GameState.FARMING;
		CE.mapInvalidated = true;
	},
	update: function () {
		if (CE.Battle.fightPhase == CE.Battle.FightPhase.INTRODUCTION) {
			this.breathTransition.updateProgress();
			this.auraTransition.updateProgress();
			this.playerTransition.updateProgress();
			this.weaponTransition.updateProgress();
		}
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].update();
		}
	},
	draw: function () {
		if (this.initialized) {
			this.update();
			CE.canvas.animation.context.translate(Math.random() * 5, Math.random() * 5);
			CE.canvas.animation.context.scale(1.02, 1.02);
			if (CE.Battle.fightPhase == CE.Battle.FightPhase.INTRODUCTION) {
				CE.canvas.animation.context.drawImage(this.background.image, -10, -10);
			}

			CE.canvas.animation.context.globalAlpha = 1;//vu que l'opacité est modifié par les particules
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].draw();
			}
		}
	}
};