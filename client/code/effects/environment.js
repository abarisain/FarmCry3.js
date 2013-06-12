/*
 Cette classe gère tous les évènements venant du serveur et liés à la météo et aux catastrophes.
 */
CrymeEngine.Environment = {
	clouds: [],
	postEffects: [],
	preEffects: [],
	wind: {x: -4, y: 0 },
	transitionThunder: new Transition(0, 1200, 1200, function () {
	}),
	thunderAlpha: 0,
	movementTransition: new Transition(0, 1, 1600, function () {
		CE.Environment.move();
	}),
	init: function (initialData) {

		this.clouds = [];
		for (var i = 0; i < colSize / 4; i++) {
			for (var j = 0; j < lineSize / 4; j++) {
				this.clouds.push(new MapItems.Cloud(j * 4, i * 4));
				this.postEffects.push(this.clouds[this.clouds.length - 1]);
			}
		}
		this.movementTransition.smoothing = true;
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
		for (var i = 0; i < this.postEffects.length; i++) {
			this.postEffects[i].move(this.wind.x, this.wind.y);
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
		this.postEffects.push(tornado);
	},
	addExplosion: function (col, line) {
		var particle = new MapItems.Effect(col, line);
		if (particle.visible) {
			var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.FIRE, particle.x, particle.y, 60, 120, 30);
			effect.start(2, 1, 0, Math.PI * 2, 0.5, 0.5);
			particle.addEffect(effect);
			this.postEffects.push(particle);
		}
	},
	addRottenEffect: function (col, line) {
		var particle = new MapItems.Effect(col, line);
		var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.ROTTEN_SMOKE, particle.x, particle.y - 5, 0.004, -1, 240, 160);
		effect.start(0, 0, 0, 0, 0.1, 0.2, 0.01);
		particle.addEffect(effect);
		this.preEffects.push(particle);
	},
	addColdStorageEffect: function (col, line) {
		var particle = new MapItems.Effect(col, line);
		var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.ICE, particle.x, particle.y - 5, 0.004, -1, 300, 120);
		effect.start(0, 0, 0, 0, 0.1, 0, 0.005);
		particle.addEffect(effect);
		var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.ICE, particle.x + 185, particle.y - 140, 0.004, -1, 300, 120);
		effect.start(0, 0, 0, 0, 0.1, 0, 0.005);
		particle.addEffect(effect);
		var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.ICE, particle.x + 85, particle.y + 55, 0.004, -1, 300, 120);
		effect.start(0, 0, 0, 0, 0.1, 0, 0.005);
		particle.addEffect(effect);
		var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.ICE, particle.x + 270, particle.y - 90, 0.004, -1, 300, 120);
		effect.start(0, 0, 0, 0, 0.1, 0, 0.005);
		particle.addEffect(effect);
		this.preEffects.push(particle);
	},
	addSmoke: function (col, line) {
		var particle = new MapItems.Effect(col, line);
		if (particle.visible) {
			var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.LIGHT_WHITE, particle.x, particle.y, 60, 180, 60);
			//explosion.effect.gravity = -0.05;
			effect.scatteringX = tileWidth * 2 / 3;
			effect.scatteringY = tileHeight * 2 / 3;
			effect.start(1, 1, -Math.PI * 90 / 180, 0, 0.2, 0);
			particle.addEffect(effect);
			/*explosion.effect.endEvent = function() {
			 CE.Environment.remove(this);
			 }.bind(explosion.effect);*/
			this.postEffects.push(particle);
		}
	},
	addHalo: function (col, line) {
		var particle = new MapItems.Effect(col, line);
		if (particle.visible) {
			var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.HALO, particle.x, particle.y, 0.1, 2, 30);
			effect.start(1, 0, -Math.PI * 90 / 180, 0, 0.5, 0);
			effect.endEvent = function () {
				CE.Environment.removePostEffect(particle);
			}
			particle.addEffect(effect);
			this.postEffects.push(particle);
		}
	},
	addBuildingGhost: function (data, col, line) {
		var building = MapItems.TileItems.Building.Type[data.buildingType];
		for (var j = 0; j <= Math.ceil(building.size / 2 - 1); j++) {
			for (var i = 0; i <= (building.size + 1) % 2; i++) {
				var particle = new MapItems.Effect(col + j, line + i);
				var effect = new ParticlesEmitter(SpritePack.Effects.Sprites.GHOST, particle.x, particle.y, 1, 1, 300, 60);
				effect.start(0, 0, -Math.PI * 90 / 180, 0, 1, 0);
				effect.endEvent = function () {
					CE.Environment.removePostEffect(particle);
				}
				particle.addEffect(effect);
				this.postEffects.push(particle);
			}
		}
	},
	removePreEffect: function (effect) {
		this.preEffects.removeItem(effect);
	},
	removePostEffect: function (effect) {
		this.postEffects.removeItem(effect);
	},
	refreshWeatherVisibility: function () {//appelé quand la caméra bouge pour optimiser
		for (var i = 0; i < this.preEffects.length; i++) {
			this.preEffects[i].checkVisibility();
		}
		for (var i = 0; i < this.postEffects.length; i++) {
			this.postEffects[i].checkVisibility();
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
		for (var i = 0; i < this.preEffects.length; i++) {
			this.preEffects[i].update();
		}
		for (var i = 0; i < this.postEffects.length; i++) {
			this.postEffects[i].update(this.thunderAlpha);//je suis obligé de séparé pour la suppression des tornades
		}
	},
	/**
	 * every effect drawn before building
	 */
	drawPreEffects: function () {
		for (var i = 0; i < this.preEffects.length; i++) {
			this.preEffects[i].draw();
		}
	},
	drawPostEffects: function () {
		for (var i = 0; i < this.postEffects.length; i++) {
			this.postEffects[i].draw();
		}
	}
}