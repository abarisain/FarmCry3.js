CrymeEngine.Battle = {
	background: {},
	elements: [],
	transitionBreath: {},//used to make buttton breath
	transitionAura: {},
	transitionPlayer: {},//used to display the character with a small animation
	transitionWeapon: {},//used to move the main weapon
	sequencePlayer: {},
	sequenceOpponent: {},
	explosion: null,
	initialized: false,
	damagePlayer: 0,
	damagePlayerRemaining: 0,
	damageOpponent: 0,
	damageOpponentRemaining: 0,
	FightPhase: {
		INTRODUCTION: 0,
		FIGHT: 1
	},
	fightPhase: 0,
	init: function (weaponSprite) {
		CE.hud.chat.toggleVisibility(false);
		this.fightPhase = CE.Battle.FightPhase.INTRODUCTION;
		this.background = SpritePack.Battle.Sprites.BACKGROUND;
		this.transitionBreath = new Transition(0.9, 1.1, 30, function () {
		});
		this.transitionBreath.loopType = Transition.LoopType.BOUNCE;
		this.transitionBreath.start(Transition.Direction.IN);
		this.transitionAura = new Transition(0, 1, 120, function () {
			CE.Battle.launchFight();
		});
		this.transitionAura.start(Transition.Direction.IN);
		this.transitionPlayer = new Transition(1, 2, 10, function () {
			CE.Battle.transitionWeapon.start(Transition.Direction.IN, true);
		});
		this.transitionPlayer.start(Transition.Direction.OUT, true);
		this.transitionWeapon = new Transition(0, 1, 15, function () {
			CE.Battle.transitionWeapon.start(Transition.Direction.OUT);
		});

		this.sequencePlayer = new Battle.Sequence(canvasWidth / 2 + 130, canvasHeight / 2 + 100, function () {
			CE.Battle.stopBattle();
		});

		this.sequenceOpponent = new Battle.Sequence(canvasWidth / 2 - 130, canvasHeight / 2 + 100, function () {
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
	launchBattle: function (data) {//c'est temporaire de passer le sprite de l'arme en paramètre of course
		this.damagePlayer = data.health_loss_mine;
		this.damageOpponent = data.health_loss_theirs;
		this.init(SpritePack.Battle.Sprites.WEAPON_FORK);
	},
	launchFight: function () {
		this.fightPhase = CE.Battle.FightPhase.FIGHT;

		this.elements = [];
		this.sequencePlayer.hit_points.init(5, 3, -Math.PI * 100 / 180, 45 * Math.PI / 180, 1, 0.8);
		this.sequenceOpponent.hit_points.init(5, 3, -Math.PI * 80 / 180, 45 * Math.PI / 180, 1, 0.8);
		this.sequencePlayer.addAnimation(SpritePack.Fight.Sprites.PLAYER_INTRO, 0);
		this.sequenceOpponent.addAnimation(SpritePack.Fight.Sprites.OPPONENT_INTRO, 0);

		this.damagePlayerRemaining = this.damagePlayer;
		this.damageOpponentRemaining = this.damageOpponent;
		//on part sur du 6 animations au total
		for (var i = 0; i < Options.Gameplay.fightRoundCount; i++) {
			this.addHitOpponent(i);
			this.addHitPlayer(i);
		}

		this.elements.push(new Battle.Element(SpritePack.Battle.Sprites.GROUND, this.sequencePlayer.x, this.sequencePlayer.y + 120));
		this.elements.push(new Battle.Element(SpritePack.Battle.Sprites.GROUND, this.sequenceOpponent.x, this.sequenceOpponent.y + 120));
		this.elements.push(this.sequencePlayer);//avatar
		this.elements.push(this.sequenceOpponent);//avatar
	},
	addHitPlayer: function (round) {
		var damage = 0;
		if (round == Options.Gameplay.fightRoundCount - 1) {
			damage = this.damagePlayerRemaining;
		} else {
			var hit = Math.random();
			if (this.damagePlayerRemaining >= 20 && hit > 0.8) {//coup critique
				damage = Math.floor(Math.random() * 20) * this.damagePlayerRemaining / 20;
			} else if (hit < 0.2) {
				damage = 0;
			} else {
				damage = Math.floor(Math.random() * 10) * this.damagePlayerRemaining / 10;
			}
		}
		this.damagePlayerRemaining -= damage;
		this.sequencePlayer.addAnimation(SpritePack.Fight.Sprites.PLAYER_HIT, damage);
		this.sequenceOpponent.addAnimation(SpritePack.Fight.Sprites.OPPONENT_FORK, 0);
	},
	addHitOpponent: function (round) {
		var damage = 0;
		if (round == Options.Gameplay.fightRoundCount - 1) {
			damage = this.damageOpponentRemaining;
		} else {
			var hit = Math.random();
			if (this.damageOpponentRemaining >= 20 && hit > 0.8) {//coup critique
				damage = Math.floor(Math.random() * 20) * this.damageOpponentRemaining / 20;
			} else if (hit < 0.2) {
				damage = 0;
			} else {
				damage = Math.floor(Math.random() * 10) * this.damageOpponent / 10;
			}
		}
		this.damageOpponentRemaining -= damage;
		this.sequencePlayer.addAnimation(SpritePack.Fight.Sprites.PLAYER_FORK, 0);
		this.sequenceOpponent.addAnimation(SpritePack.Fight.Sprites.OPPONENT_HIT, damage);
	},
	stopBattle: function () {
		CE.hud.chat.toggleVisibility(true);
		CE.gameState = CE.GameState.FARMING;
		CE.mapInvalidated = true;
	},
	update: function () {
		if (CE.Battle.fightPhase == CE.Battle.FightPhase.INTRODUCTION) {
			this.transitionBreath.updateProgress();
			this.transitionAura.updateProgress();
			this.transitionPlayer.updateProgress();
			this.transitionWeapon.updateProgress();
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
			} else {
				CE.canvas.animation.context.fillStyle = '#000000';
				CE.canvas.animation.context.fillRect(-10, -10, canvasWidth, canvasHeight);
			}

			CE.canvas.animation.context.globalAlpha = 1;//vu que l'opacité est modifié par les particules
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].draw();
			}
		}
	}
};