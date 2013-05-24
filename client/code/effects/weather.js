/*
 Cette classe gère tous les évènements venant du serveur et liés à la météo et aux catastrophes.
 */
CrymeEngine.Weather = {
	clouds: [],
	wind: {x: -4, y: 0 },
	movementTransition: new Transition(0, 1, 1200, function () {
		CE.Weather.move();
	}),
	init: function () {
		this.clouds = [];
		for (var i = 0; i < colSize / 4; i++) {
			for (var j = 0; j < lineSize / 4; j++) {
				this.clouds.push(new MapItems.Cloud(j * 4, i * 4));
			}
		}
		this.movementTransition.loop = true;
		this.movementTransition.start(Transition.Type.FADE_IN);
		this.move();
	},
	move: function () {
		//on verra plus tard pour l'aléatoire
		/*this.wind.x = Math.floor(Math.random() * 4);
		 this.wind.y = Math.floor(Math.random() * 4);*/
		/*if (this.movementTransition.type == Transition.Type.FADE_IN) {
		 this.movementTransition.start(Transition.Type.FADE_OUT, false);
		 } else {
		 this.movementTransition.start(Transition.Type.FADE_IN, false);
		 }*/
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].move(this.wind.x, this.wind.y);
		}
	},
	refreshWeatherVisibility: function () {//appelé quand la caméra bouge pour optimiser
		CE.canvas.map.context.globalCompositeOperation = "destination-lighter";
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].checkVisibility();
		}
	},
	update: function () {
		this.movementTransition.updateProgress();
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].update();
		}
	},
	draw: function () {
		//this.update();
		this.movementTransition.updateProgress();
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].update();
			this.clouds[i].draw();
		}
	}
}