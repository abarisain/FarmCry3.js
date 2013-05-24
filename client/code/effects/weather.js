/*
 Cette classe gère tous les évènements venant du serveur et liés à la météo et aux catastrophes.
 */
CrymeEngine.Weather = {
	clouds: [],
	init: function () {
		this.clouds = [];
		for (var i = 0; i < colSize / 4; i++) {
			for (var j = 0; j < lineSize / 4; j++) {
				this.clouds.push(new MapItems.Cloud(j * 4, i * 4));
			}
		}
	},
	refreshWeatherVisibility: function () {//appelé quand la caméra bouge pour optimiser
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].checkVisibility();
		}
	},
	update: function () {

	},
	draw: function () {
		for (var i = 0; i < this.clouds.length; i++) {
			this.clouds[i].draw();
		}
	}
}