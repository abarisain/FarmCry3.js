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

//gestion des textures
var texTileList = ['grass_1', 'grass_2', 'leave', 'mountain', 'rock', 'soil', 'water'];//je précise qu'ici il faudra que je fasse commencer grass à 0
var texTiles = [];

var texBorderList = ['border_0', 'border_1', 'barrier_0', 'barrier_1', 'barrier_2', 'barrier_3'];
var texBorders = [];
var borders = [];

var texBuildingList = ['silo', 'barn', 'cold_storage', 'silo_reflect', 'barn_reflect', 'cold_storage_reflect'];
var texBuildings = [];
var buildings = [];

var texParticleList = ['smoke'];
var texParticles = [];

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

	/*chargement des ressources*/
	InitLoading();
	DrawLoading();

	function DrawLoading() {
		context.save();
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		if (texTiles.length != texTileList.length) {
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
			context.fillText("Loading...", 20, 20);

			//dessin du terrain
			for (var line = 0; line < lineSize * (progress / (animationDuration)); line++) {
				for (var col = 0; col < colSize * (progress / (animationDuration)); col++) {
					context.drawImage(texTiles[Math.round((line + col) / 2) % texTiles.length], cameraPosition.x + col *
						tileWidth - (tileWidth) * line, (cameraPosition.y + (line - lineSize) * tileHeight +
						(tileHeight) * col) * (progress / animationDuration));
				}
			}
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
			context.fillStyle = "#fff";

			context.translate(cameraPosition.x, cameraPosition.y);

			//dessin des reflets
			for (i = 0; i < buildings.length; i++) {
				if (buildings[i].texReflect != -1) {
					context.drawImage(texBuildings[buildings[i].texReflect], buildings[i].x, buildings[i].y);
				}
			}

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
				context.fillText('line : ' + line, (tileWidth) * (line - 0.5), (line - lineSize + 1) * tileHeight + 1);
			}

			//dessin des bâtiments
			for (var i = 0; i < buildings.length; i++) {
				context.fillRect(buildings[i].x, buildings[i].y, 3, 3);
				context.drawImage(texBuildings[buildings[i].texBuilding], buildings[i].x, buildings[i].y);
			}

			//affichage des particules
			/*particleEmitters.update();//temporaire
			particleEmitters.draw(context);
			*/
			context.restore();

			context.fillStyle = "#fff";
			context.fillText("x : " + cameraPosition.x + ", y : " + cameraPosition.y, 20, 20);

			/*if (particleEmitters.isAlive())//temporaire, mais nécessaire a cause des particule
			{
				window.requestAnimFrame(function () {
					Draw()
				});
			}*/
		}
	}

	canvas.onmousedown = function (event) {
		if (loadingComplete) {
			//positionnement de la souris
			mousePosition.x = event.pageX - this.offsetLeft;
			mousePosition.y = event.pageY - this.offsetTop;
			//activation du deplacement de la map
			moveMap = true;
		}
	};

	canvas.onmouseup = function () {
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

function CreateMap() {
	CreateBuilding(0, 2, 8);
	CreateBuilding(1, 4, 5);
	CreateBuilding(2, 7, 1);
}

function CreateBuilding(type, col, line) {
	var building = { texBuilding: type, texReflect: type + 3, col: col, line: line, x: col * tileWidth - (tileWidth) * line - tileWidth, y: (line - lineSize) * tileHeight + (tileHeight) * col - 62};
	buildings.push(building);
	var emitter = new ParticlesEmitter(0, building.x, building.y);
	particleEmitters.emitters.push(emitter);
	/*for (var i = 0; i <= type; i++) {
		CreateTileParticle(building.x + tileWidth * i, building.y + tileHeight * i);
	}*/
}

function InitLoading() {
	totalLoadingCount += texTileList.length;
	totalLoadingCount += texBuildingList.length;
	totalLoadingCount += texBorderList.length;
	totalLoadingCount += texParticleList.length;
	LoadTexTiles();
	LoadTexBorders();
	LoadTexBuildings();
	LoadTexParticles();
}

function LoadTexTiles() {
	for (var i = 0; i < texTileList.length; i++) {
		var tile = new Image();
		tile.src = 'src/tiles/' + texTileList[i] + '.png';
		tile.onload = function () {
			texTiles.push(this);
			currentLoadingCount++;
		};
	}
}

function LoadTexBorders() {
	for (var i = 0; i < texBorderList.length; i++) {
		var tile = new Image();
		tile.src = 'src/borders/' + texBorderList[i] + '.png';
		tile.onload = function () {
			texBorders.push(this);
			currentLoadingCount++;
		};
	}
}

function LoadTexBuildings() {
	for (var i = 0; i < texBuildingList.length; i++) {
		var building = new Image();
		building.src = 'src/buildings/' + texBuildingList[i] + '.png';
		building.onload = function () {
			texBuildings.push(this);
			currentLoadingCount++;
		};
	}
}

function LoadTexParticles() {
	for (var i = 0; i < texParticleList.length; i++) {
		var particle = new Image();
		particle.src = 'src/effects/' + texParticleList[i] + '.png';
		particle.onload = function () {
			texParticles.push(this);
			currentLoadingCount++;
		};
	}
}