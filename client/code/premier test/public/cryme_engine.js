/**
 * User: Guigui
 * Date: 08/12/12
 * Time: 17:51
 * To change this template use File | Settings | File Templates.
 */

var moveMap = false;
var cameraPosition = {
	x: 1000,
	y: 800
};
var mousePosition = {
	x: 0,
	y: 0
};
var animationDuration = 30;

var buildings = [];
var crops = [];
var tiles = [];
var hudElements = [];

//temporaire mais ça fait joli
var hudLife = new Image();
hudLife.src = "src/hud/life.png";
var hudTime = new Image();
hudTime.src = "src/hud/time.png";

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

	/*initialisation du canvas
	 * indispensable sinon le canvas fait 150px de large*/
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	context.font = "bold 16pt Calibri,Geneva,Arial";

	/*Initialisation de la connexion reseau*/
	DrawWelcome();

	canvas.onmousedown = function (event) {
		if (loadingComplete) {
			if (event.button == 2)//le clic droit sers a bouger la map, et le gauche a agir
			{
				//positionnement de la souris
				mousePosition.x = event.pageX - this.offsetLeft;
				mousePosition.y = event.pageY - this.offsetTop;
				//activation du deplacement de la map
				moveMap = true;
			}
			else if (event.button == 1)//clic central
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
		}
	};

	window.onmouseup = function () {
		moveMap = false;
	};

	canvas.onmousemove = function (event) {
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
	context.save();
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	if (!initialDataLoaded) {
		context.fillStyle = "#fff";
		context.fillText("Waiting for server...", canvasWidth / 2 - 30, 260);

		context.restore();
		window.requestAnimFrame(function () {
			DrawWelcome()
		});
	}
	else {
		CreateHud();
		CreateMap();
		window.requestAnimFrame(function () {
			InitLoading();
			DrawLoading();
		});
	}
}

function DrawLoading() {
	context.save();
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	if (texTiles.length != texTileList.length && !initialDataLoaded) {
		context.fillStyle = "#fff";
		context.fillText("Loading...", canvasWidth / 2 - 30, 260);

		//affichage de la barre de progression
		context.fillStyle = "rgba(60, 60, 60, 1)";
		context.fillRect(canvasWidth / 2 - 202, 300, 404, 20);

		context.fillStyle = "rgba(120, 120, 120, 1)";
		context.fillRect(canvasWidth / 2 - 200, 302, 200 * (currentLoadingCount / totalLoadingCount), 16);
		context.restore();
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

		context.fillStyle = "#fff";
		context.fillText("Loading...  " + currentLoadingCount + '/' + totalLoadingCount, 20, 20);

		//dessin du terrain
		for (var line = 0; line < lineSize * (progress / (animationDuration)); line++) {
			for (var col = 0; col < colSize * (progress / (animationDuration)); col++) {
				context.drawImage(texTiles[Math.round((line + col) / 2) % texTiles.length], cameraPosition.x + col *
					tileWidth - (tileWidth) * line, (cameraPosition.y + (line - lineSize) * tileHeight +
					(tileHeight) * col) * (progress / animationDuration));
			}
		}
		//il vaux mieux restaurer le contexte avant de commencer à dessiner, pour être tranquille
		context.restore();
		if (progress == animationDuration && currentLoadingCount == totalLoadingCount) {
			loadingComplete = true;
			window.requestAnimFrame(function () {
				Draw()
			});
		}
		else {
			if (progress >= animationDuration * 2 || progress <= 0) {
				speed *= -1;
			}
			window.requestAnimFrame(function () {
				DrawMapCreation(progress + speed, speed)
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
		for (var line = 0; line < lineSize; line++) {
			for (var col = 0; col < colSize; col++) {
				context.drawImage(texTiles[Math.round((line + col) / 2) % texTiles.length], col * tileWidth - (tileWidth) * line, (line - lineSize) * tileHeight + (tileHeight) * col);

				//affichage de la bordure
				if (col == colSize - 1) {
					context.drawImage(texBorders[1], (col) * tileWidth - (tileWidth) * line, (line - lineSize + 1) * tileHeight + (tileHeight) * col + 1);
				}
				if (line == 0) {
					context.fillText('col : ' + col, col * tileWidth - (tileWidth) * (line - 1), (line - lineSize + 1) * tileHeight + (tileHeight) * col);
				}
				else if (line == lineSize - 1) {
					context.drawImage(texBorders[0], col * tileWidth - (tileWidth) * (line), (line - lineSize + 1) * tileHeight + (tileHeight) * (col) + 1);
				}
			}
		}

		//dessin des bâtiments
		for (var i = 0; i < buildings.length; i++) {
			buildings[i].drawItem();
		}
		for (i = 0; i < crops.length; i++) {
			crops[i].drawItem();
		}

		//indispensable pour l'affichage du hud, tant qu'on a pas séparé les 2 canvas
		context.restore();

		//affichage du hudLife
		/*context.drawImage(hudLife, 0, 0);
		 context.drawImage(hudTime, canvasWidth - 160, 0);*/
		hud.drawHud();
		context.fillStyle = "#6f440d";
		context.fillText("x : " + cameraPosition.x + ", y : " + cameraPosition.y, 120, 34);
		var currentTime = new Date();
		context.fillText(currentTime.getHours() + ':' + currentTime.getMinutes(), canvasWidth - 72, 34);
	}


}
function InitLoading() {
	LoadTiles();
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
	var building = new Building(0, 2, 8);
	buildings.push(building);
	building = new Building(1, 4, 5);
	buildings.push(building);
	building = new Building(2, 7, 1);
	buildings.push(building);
	var crop = new Crop(0, 0, 1);
	crops.push(crop);
	crop = new Crop(1, 1, 1);
	crops.push(crop);
	crop = new Crop(2, 2, 1);
	crops.push(crop);
}

