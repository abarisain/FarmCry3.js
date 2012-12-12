/**
 * User: Guigui
 * Date: 08/12/12
 * Time: 17:51
 * To change this template use File | Settings | File Templates.
 */

var moveMap = false;
var cameraPosition = {
	x: -1000,
	y: -1000
};
var mousePosition = {
	x: 0,
	y: 0
};

var buildings = [];
var crops = [];
var tiles = [];
var hudElements = [];

window.requestAnimFrame = (function () {
	return window.requestAnimationFrame || // La forme standardisée
		window.webkitRequestAnimationFrame || // Pour Chrome et Safari
		window.mozRequestAnimationFrame || // Pour Firefox
		window.oRequestAnimationFrame || // Pour Opera
		window.msRequestAnimationFrame || // Pour Internet Explorer
		function (callback) {                   // Pour les élèves du dernier rang
			window.setTimeout(callback, 1000 / 60);
		};
})();

window.onload = function () {
	canvas = document.querySelector('#canvas');
	context = canvas.getContext('2d');

	canvasAnimation = document.querySelector('#canvasAnimation');
	contextAnimation = canvasAnimation.getContext('2d');

	canvasHud = document.querySelector('#canvasHud');
	contextHud = canvasHud.getContext('2d');

	/*initialisation du canvas
	 * indispensable sinon le canvas fait 150px de large*/
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvasAnimation.width = canvasWidth;
	canvasAnimation.height = canvasHeight;
	canvasHud.width = canvasWidth;
	canvasHud.height = canvasHeight;

	contextHud.font = "bold 16pt Calibri,Geneva,Arial";

	/*Initialisation de la connexion reseau automatique*/

	/*Gestion de la musique*/
	var audioPlayer = document.getElementById('audioPlayer');
	audioPlayer.style.top = (canvasHeight - 30) + 'px';
	if (music) {
		audioPlayer.play();
	}
	DrawWelcome();

	canvasHud.onmousedown = function (event) {
		if (loadingComplete) {
			if (event.button == 2)//le clic droit sers a bouger la map, et le gauche a agir
			{
				//positionnement de la souris
				mousePosition.x = event.pageX - this.offsetLeft;
				mousePosition.y = event.pageY - this.offsetTop;
				//activation du deplacement de la map
				moveMap = true;
			}
		}
	};

	window.onkeydown = function (event) {
		if (event.keyCode == 32)//touche espace
		{
			if (hudElements[3].visible) {
				hudElements[3].visible = false;
			}
			else {
				hudElements[3].visible = true;
			}
			window.requestAnimFrame(function () {
				Draw()
			});
		}
	};

	window.onmouseup = function () {
		moveMap = false;
	};

	canvasHud.onmousemove = function (event) {
		if (moveMap) {
			event = event || window.event;

			//deplacement de la caméra en fonction de la dernière position de la souris
			cameraPosition.x += (event.pageX - this.offsetLeft - mousePosition.x);
			cameraPosition.y += (event.pageY - this.offsetTop - mousePosition.y);

			//pour se souvenir de la dernière position de la souris
			mousePosition.x = event.pageX - this.offsetLeft;
			mousePosition.y = event.pageY - this.offsetTop;

			window.requestAnimFrame(function () {
				Draw()
			});
		}
	};
};

function DrawWelcome() {
	contextHud.save();
	contextHud.clearRect(0, 0, canvasWidth, canvasHeight);
	if (!initialDataLoaded) {
		contextHud.fillStyle = "#fff";
		contextHud.fillText("Waiting for server...", canvasWidth / 2 - 30, 260);

		contextHud.restore();
		window.requestAnimFrame(function () {
			DrawWelcome();
		});
	}
	else {
		CreateHud();
		window.requestAnimFrame(function () {
			InitLoading();
			DrawLoading();
		});
	}
}

function DrawLoading() {
	contextHud.save();
	contextHud.clearRect(0, 0, canvasWidth, canvasHeight);
	if (texTiles.length != texTileList.length && initialDataLoaded) {
		contextHud.fillStyle = "#fff";
		contextHud.fillText("Loading...", canvasWidth / 2 - 30, 260);

		//affichage de la barre de progression
		contextHud.fillStyle = "rgba(60, 60, 60, 1)";
		contextHud.fillRect(canvasWidth / 2 - 202, 300, 404, 20);

		contextHud.fillStyle = "rgba(120, 120, 120, 1)";
		contextHud.fillRect(canvasWidth / 2 - 200, 302, 200 * (currentLoadingCount / totalLoadingCount), 16);
		contextHud.restore();
		window.requestAnimFrame(function () {
			DrawLoading()
		});
	}
	else {
		CreateMap();
		window.requestAnimFrame(function () {
			DrawMapCreation(1, 1)
		});
	}
}

//pour faire apparaître la map de façon un peu "Qui pête"
function DrawMapCreation(progress, speed) {
	if (texTiles.length == texTileList.length) {
		context.save();
		context.clearRect(0, 0, canvasWidth, canvasHeight);

		context.translate(cameraPosition.x, cameraPosition.y);

		//dessin du terrain
		Map.drawMapLoading(progress);
		//il vaux mieux restaurer le contexte avant de commencer à dessiner, pour être tranquille
		context.restore();

		context.fillStyle = "#fff";
		context.fillText("Loading...  " + currentLoadingCount + '/' + totalLoadingCount, 20, 150);

		if (progress == animationDuration && currentLoadingCount == totalLoadingCount) {
			loadingComplete = true;
			window.requestAnimFrame(function () {
				Draw();
				DrawAnimation();
			});
		}
		else {
			if (progress >= animationDuration * 2 || progress <= 0) {
				speed *= -1;
			}
			window.requestAnimFrame(function () {
				DrawMapCreation(progress + speed, speed);
			});
		}
	}
}

function Draw() {
	if (loadingComplete) {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.save();

		//gestion du positionnement de la caméra
		context.translate(cameraPosition.x, cameraPosition.y);

		//dessin des reflets
		if (reflectActivated) {
			if (reflectBuilding) {
				for (i = 0; i < buildings.length; i++) {
					buildings[i].drawReflection();
				}
			}
			if (reflectCrop) {
				for (i = 0; i < crops.length; i++) {
					crops[i].drawReflection();
				}
			}
		}
		context.fillStyle = "#fff";
		//dessin du terrain
		Map.drawMask();
		Map.drawMap();

		//dessin des bâtiments
		for (var i = 0; i < buildings.length; i++) {
			buildings[i].drawItem();
		}

		for (i = 0; i < crops.length; i++) {
			crops[i].drawItem();
		}

		//indispensable pour l'affichage du hud, tant qu'on a pas séparé les 2 canvas
		context.restore();
	}
}

function DrawAnimation() {
	if (loadingComplete) {
		contextAnimation.clearRect(0, 0, canvasWidth, canvasHeight);
		contextAnimation.save();

		//gestion du positionnement de la caméra
		contextAnimation.translate(cameraPosition.x, cameraPosition.y);

		//dessin des reflets
		if (animationActivated) {
			//dessin des bâtiments
			for (var i = 0; i < buildings.length; i++) {
				buildings[i].drawAnimation();
			}
		}

		//indispensable pour l'affichage du hud, tant qu'on a pas séparé les 2 canvas
		contextAnimation.restore();

		window.requestAnimFrame(function () {
			DrawAnimation();
			DrawHud();
		});
	}
}

function DrawHud() {
	if (loadingComplete) {
		contextHud.clearRect(0, 0, canvasWidth, canvasHeight);
		contextHud.save();

		hud.drawHud();
		contextHud.fillStyle = "#6f440d";
		contextHud.fillText("x : " + cameraPosition.x + ", y : " + cameraPosition.y, 120, 34);
		var currentTime = new Date();
		contextHud.fillText(currentTime.getHours() + ':' + currentTime.getSeconds(), canvasWidth - 72, 34);

		contextHud.restore();
	}
}

function InitLoading() {
	LoadTiles();
	LoadAnimations();
	LoadTileItems();
	LoadHud();
}

function CreateHud() {
	var hudElement = new HudElement(0, 0, 0, true);
	hudElements.push(hudElement);
	hudElement = new HudElement(1, canvasWidth - 160, 0, true);
	hudElements.push(hudElement);
	hudElement = new HudElement(2, canvasWidth - 320, 200, true);
	hudElements.push(hudElement);
	hudElement = new HudElement(3, canvasWidth / 2 - 500, 200, false);
	hudElements.push(hudElement);
}

//fonction pour placer des trucs sur la map pour test le rendu
function CreateMap() {
	var building = new Building(0, 5, 13);
	buildings.push(building);
	building = new Building(1, 4, 7, [2]);
	buildings.push(building);
	building = new Building(2, 8, 9, [0, 1]);
	buildings.push(building);
	Map.changeTile(6, 8, 8);
	Map.changeTile(6, 9, 8);
	Map.changeTile(6, 10, 8);
	Map.changeTile(6, 11, 8);
	Map.changeTile(6, 11, 9);
	Map.changeTile(6, 10, 9);//pour mettre de l'eau sous le cold storage
	Map.changeTile(6, 10, 10);
	Map.changeTile(6, 11, 10);
	var crop = new Crop(0, 1, 6);
	crops.push(crop);
	crop = new Crop(1, 3, 5);
	crops.push(crop);
	crop = new Crop(2, 2, 1);
	crops.push(crop);
}

