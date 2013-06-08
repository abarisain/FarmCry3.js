/*
 Cette classe gère tous les évènements venant du serveur et liés à la météo et aux catastrophes.
 */
CrymeEngine.Environment = {
	clouds: [],
	effects: [],
	wind: {x: -4, y: 0 },
	transitionThunder: new Transition(0, 1200, 1200, function () {
	}),
	thunderAlpha: 0,
	movementTransition: new Transition(0, 1, 1200, function () {
		CE.Environment.move();
	}),
	init: function (initialData) {

		this.clouds = [];
		for (var i = 0; i < colSize / 4; i++) {
			for (var j = 0; j < lineSize / 4; j++) {
				this.clouds.push(new MapItems.Cloud(j * 4, i * 4));
				this.effects.push(this.clouds[this.clouds.length - 1]);
			}
		}
		this.movementTransition.loopType = Transition.LoopType.BOUNCE;
		this.movementTransition.start(Transition.Direction.IN);
		this.move();
		if (initialData.raining) {
			this.startRain();
		}
	},
	move: function () {
		//on verra plus tard pour l'aléatoire
		/*this.wind.x = Math.floor(Math.random() * 4);
		 this.wind.y = Math.floor(Math.random() * 4);*/
		/*if (this.movementTransition.Direction == Transition.Direction.FADE_IN) {
		 this.movementTransition.start(Transition.Direction.FADE_OUT, false);
		 } else {
		 this.movementTransition.start(Transition.Direction.FADE_IN, false);
		 }*/
		for (var i = 0; i < this.effects.length; i++) {
			this.effects[i].move(this.wind.x, this.wind.y);
		}
	},
	startRain: function () {
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].startRain();
		}
		CE.Sound.sounds.ambiant.rain.play();
		this.transitionThunder.start(Transition.Direction.IN, true);
		this.transitionThunder.loopType = Transition.LoopType.RESET;
		this.transitionThunder.eventEnd = function () {
			CE.Sound.sounds.ambiant.thunder.play(3);
		};
	},
	stopRain: function () {
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].stopRain();
		}
		this.transitionThunder.start(Transition.Direction.OUT, true);
		this.transitionThunder.loopType = Transition.LoopType.NONE;
		this.transitionThunder.eventEnd = function () {
		};
		CE.Sound.sounds.ambiant.rain.stop();
	},
	addTornado: function (col, line) {
		var tornado = new MapItems.Tornado(col, line);
		tornado.move(Math.random() * 5 + 3, Math.random() * 5 + 3);
		this.effects.push(tornado);
	},
	addExplosion: function (col, line) {
		var explosion = new MapItems.Effect(col, line);
		explosion.effect = new ParticlesEmitter(SpritePack.Effects.Sprites.FIRE, explosion.x, explosion.y, 60, 120, 30);
		//explosion.effect.gravity = -0.05;
		explosion.effect.start(2, 1, 0, Math.PI * 2, 0.5, 0.5);
		/*explosion.effect.endEvent = function() {
		 CE.Environment.remove(this);
		 }.bind(explosion.effect);*/
		this.effects.push(explosion);
	},
	addSmoke: function (col, line) {
		var explosion = new MapItems.Effect(col, line);
		explosion.effect = new ParticlesEmitter(SpritePack.Effects.Sprites.SMOKE, explosion.x, explosion.y, 60, 180, 60);
		//explosion.effect.gravity = -0.05;
		explosion.effect.scatteringX = tileWidth * 2 / 3;
		explosion.effect.scatteringY = tileHeight * 2 / 3;
		explosion.effect.start(1, 1, -Math.PI * 90 / 180, 0, 0.2, 0);
		/*explosion.effect.endEvent = function() {
		 CE.Environment.remove(this);
		 }.bind(explosion.effect);*/
		this.effects.push(explosion);
	},
	remove: function (effect) {
		this.effects.removeItem(effect);
	},
	refreshWeatherVisibility: function () {//appelé quand la caméra bouge pour optimiser
		for (var i = 0; i < this.effects.length; i++) {
			this.effects[i].checkVisibility();
		}
	},
	update: function () {
		this.movementTransition.updateProgress();
		this.transitionThunder.updateProgress();
		if (this.transitionThunder.started && this.transitionThunder.progress > this.transitionThunder.progressMax - 5) {
			this.thunderAlpha = (this.transitionThunder.progressMax - this.transitionThunder.progress) / 5;
		} else {
			this.thunderAlpha = 0;
		}
		for (var i = 0; i < this.effects.length; i++) {
			this.effects[i].update(this.thunderAlpha);//je suis obligé de séparé pour la suppression des tornades
		}
	},
	draw: function () {
		for (var i = 0; i < this.effects.length; i++) {
			this.effects[i].draw();
		}
	}
}