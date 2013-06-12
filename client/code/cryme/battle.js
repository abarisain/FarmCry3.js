CrymeEngine.Battle = {
	background: {},
	elements: [],
	sequenceFight: {},
	sequencePlayer: {},
	sequenceOpponent: {},
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
	oldChatVisibility: true,
	init: function () {
		this.oldChatVisibility = CE.hud.chat.visible;
		CE.hud.chat.toggleVisibility(false);
		this.fightPhase = CE.Battle.FightPhase.INTRODUCTION;
		this.background = SpritePack.Battle.Sprites.BACKGROUND;

		if (CE.Battle.Timeline.start()) {

			this.sequencePlayer = new Battle.Sequences.Player('Guigui', canvasWidth / 2 + 130, canvasHeight / 2 + 100, 100, 50);
			CE.Battle.Timeline.sequences.push(this.sequencePlayer);

			this.sequenceOpponent = new Battle.Sequences.Opponent('Kalahim', canvasWidth / 2 - 130, canvasHeight / 2 + 100, 80, 40);
			CE.Battle.Timeline.sequences.push(this.sequenceOpponent);

			this.sequenceFight = new Battle.Sequences.MainTimeline();
			CE.Battle.Timeline.sequences.push(this.sequenceFight);

			this.elements = [];
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 5; j++) {
					this.elements.push(new Battle.BackgroundParticle(-1500 + j * 600 - 200 * i, -2000 + i * 400 + 300 * j));
				}
			}
		}
		this.initialized = true;
	},
	launchBattle: function (data) {//c'est temporaire de passer le sprite de l'arme en paramètre of course
		this.damagePlayer = data.health_loss_mine;
		this.damageOpponent = data.health_loss_theirs;
		this.init();

	},
	launchFight: function () {
		this.fightPhase = CE.Battle.FightPhase.FIGHT;
		this.elements = [];
		CrymeEngine.Sound.sounds.music.fight.play(300);
	},
	stopBattle: function () {
		CE.hud.chat.toggleVisibility(this.oldChatVisibility);
		CE.gameState = CE.GameState.FARMING;
		CE.mapInvalidated = true;
	},
	update: function () {
		CE.Battle.Timeline.update();
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

			CE.Battle.Timeline.draw();
		}
	}
};