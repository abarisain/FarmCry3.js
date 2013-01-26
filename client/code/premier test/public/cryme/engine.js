//Compatibility function for requestAnimationFrame
//Thanks, web standards !
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

var CrymeEngine = {
	pauseRendering: false,
	movingMap: false,
	mapInvalidated: false, //If this is true, the map will be redrawn
	hudElements: [],
	camera: {
		position: {
			x: -1000,
			y: -1000
		},
		move: function (x, y) {
			this.position.x = x;
			this.position.y = y;
			CrymeEngine.mapInvalidated = true;
		}
	},
	mousePosition: {
		x: 0,
		y: 0
	},
	buildings: [],
	crops: [],
	tiles: [],
	canvas: { //Element type : CrymeCanvas
		resizeAll: function (width, height) {
			Object.keys(CrymeEngine.canvas).forEach(function (targetCanvas) {
				if (targetCanvas != 'resizeAll') { //Exclude this function
					CrymeEngine.canvas[targetCanvas].resize(width, height);
				}
			});
		}
	},
	Draw: {
		Loading: function () {
			if ((texTiles.length != texTileList.length && initialDataLoaded) ||
				currentLoadingCount < totalLoadingCount) {
				//Kind of a hack, but redoing the whole loading system is really hard and not so useful
				networkEngine.onLoadingProgress(currentLoadingCount, totalLoadingCount);
				window.requestAnimFrame(function () {
					CrymeEngine.Draw.Loading();
				});
			}
			else {
				networkEngine.onLoadingFinished();
				CreateMap();
				window.requestAnimFrame(function () {
					CrymeEngine.Draw.MapCreation(1, 1);
				});
			}
		},
		MapCreation: function (progress, speed) {
			//Pour faire apparaître la map de façon un peu "Qui pête"
			if (texTiles.length == texTileList.length) {
				CrymeEngine.canvas.map.context.save();
				CrymeEngine.canvas.map.clear();

				CrymeEngine.canvas.map.context.translate(CrymeEngine.camera.position.x,
					CrymeEngine.camera.position.y);

				//dessin du terrain
				Map.drawMapLoading(progress);
				//il vaux mieux restaurer le contexte avant de commencer à dessiner, pour être tranquille
				CrymeEngine.canvas.map.context.restore();

				if (progress == animationDuration) {
					//Normal draw loop will now handle the rendering
					loadingComplete = true;
					CE.mapInvalidated = true;
				}
				else {
					if (progress >= animationDuration * 2 || progress <= 0) {
						speed *= -1;
					}
					window.requestAnimFrame(function () {
						CrymeEngine.Draw.MapCreation(progress + speed, speed);
					});
				}
			}
		},
		Map: function () {
			CrymeEngine.canvas.map.clear();
			CrymeEngine.canvas.map.context.save();

			//gestion du positionnement de la caméra
			CrymeEngine.canvas.map.context.translate(CrymeEngine.camera.position.x, CrymeEngine.camera.position.y);

			var tmpLength;

			//dessin des reflets
			if (reflectActivated) {
				if (reflectBuilding) {
					tmpLength = CrymeEngine.buildings.length;
					for (i = 0; i < tmpLength; i++) {
						CrymeEngine.buildings[i].drawReflection();
					}
				}
				if (reflectCrop) {
					tmpLength = CrymeEngine.crops.length;
					for (i = 0; i < tmpLength; i++) {
						CrymeEngine.crops[i].drawReflection();
					}
				}
			}
			CrymeEngine.canvas.map.context.fillStyle = "#fff";
			//dessin du terrain
			Map.drawMask();
			Map.drawMap();

			//dessin des bâtiments
			tmpLength = CrymeEngine.buildings.length;
			for (var i = 0; i < tmpLength; i++) {
				CrymeEngine.buildings[i].drawItem();
			}

			tmpLength = CrymeEngine.crops.length;
			for (i = 0; i < tmpLength; i++) {
				CrymeEngine.crops[i].drawItem();
			}

			CrymeEngine.canvas.map.context.restore();
		},
		Animation: function () {
			CrymeEngine.canvas.animation.clear();
			CrymeEngine.canvas.animation.context.save();

			//gestion du positionnement de la caméra
			CrymeEngine.canvas.animation.context.translate(CE.camera.position.x, CE.camera.position.y);

			//dessin des reflets
			if (animationActivated) {
				//dessin des bâtiments
				var tmpLength = CrymeEngine.buildings.length;
				for (var i = 0; i < tmpLength; i++) {
					CrymeEngine.buildings[i].drawAnimation();
				}
			}

			CrymeEngine.canvas.animation.context.restore();
		},
		Hud: function () {
			CrymeEngine.canvas.hud.clear();
			CrymeEngine.hud.draw();

			var currentTime = new Date();
			CrymeEngine.canvas.hud.context.fillText(currentTime.getHours() + ':' +
				currentTime.getSeconds(), canvasWidth - 72, 34);
		},
		MainLoop: function () {
			if (!CrymeEngine.pauseRendering) {
				if (loadingComplete) {
					//There is another render loop for when the map is loading
					if (CrymeEngine.mapInvalidated) {
						CrymeEngine.Draw.Map();
					}
					CrymeEngine.Draw.Animation();
					CrymeEngine.Draw.Hud();
				}
			}
			window.requestAnimFrame(function () {
				CrymeEngine.Draw.MainLoop();
			});
		}
	},
	init: function () {
		this.canvas.map = new CrymeCanvas('#canvas');
		this.canvas.animation = new CrymeCanvas('#canvasAnimation');
		this.canvas.hud = new CrymeCanvas('#canvasHud');
		this.canvas.hud.setFont("bold 13pt stanberry,Calibri,Geneva,Arial");
		this.canvas.resizeAll(canvasWidth, canvasHeight);

		var audioPlayer = document.getElementById('audioPlayer');
		audioPlayer.style.top = (canvasHeight - 30) + 'px';
		if (music) {
			audioPlayer.play();
		}
		//Bind events

		this.canvas.hud.canvas.onmousedown = function (event) {
			if (loadingComplete) {
				if (event.button == 0)
					CrymeEngine.hud.onClick(event.pageX, event.pageY);
				if (event.button == 2) {
					//le clic droit sers a bouger la map, et le gauche a agir
					//positionnement de la souris
					CrymeEngine.mousePosition.x = event.pageX - this.offsetLeft;
					CrymeEngine.mousePosition.y = event.pageY - this.offsetTop;

					//activation du deplacement de la map
					CrymeEngine.movingMap = true;
				}
			}
		};

		window.onkeydown = function (event) {
			//Special case, unless we are pressing enter, ignore everything while we're in the chat box
			if (document.activeElement == hud.chat.divs.input && event.keyCode != 13) {
				return true;
			}
			switch (event.keyCode) {
				case 13: //Enter
					if (document.activeElement == hud.chat.divs.input) {
						hud.chat.send();
					} else {
						hud.chat.divs.input.focus();
					}
					break;
				case 32: //Space
					CrymeEngine.hudElements[3].visible = !CrymeEngine.hudElements[3].visible;
					break;
			}
			return false;
		};

		window.onmouseup = function () {
			CrymeEngine.movingMap = false;
		};

		window.onresize = function () {
			//Doesn't work yet
			canvasWidth = window.innerWidth;
			canvasHeight = window.innerHeight;
			CrymeEngine.canvas.resizeAll(canvasWidth, canvasHeight);
			audioPlayer.style.top = (canvasHeight - 30) + 'px';
			CrymeEngine.hud.rootHudElement.resize();
		};

		this.canvas.hud.canvas.onmousemove = function (event) {
			if (CrymeEngine.movingMap) {
				event = event || window.event;

				//deplacement de la caméra en fonction de la dernière position de la souris
				CrymeEngine.camera.position.x += (event.pageX - this.offsetLeft - CrymeEngine.mousePosition.x);
				CrymeEngine.camera.position.y += (event.pageY - this.offsetTop - CrymeEngine.mousePosition.y);

				//pour se souvenir de la dernière position de la souris
				CrymeEngine.mousePosition.x = event.pageX - this.offsetLeft;
				CrymeEngine.mousePosition.y = event.pageY - this.offsetTop;

				CrymeEngine.mapInvalidated = true;
			}
		};

		//Start the main drawing loop.
		CrymeEngine.Draw.Loading();
		CrymeEngine.Draw.MainLoop();

		CrymeEngine.hud.init();
		InitLoading();
	}
};

var CE = CrymeEngine;

function InitLoading() {
	LoadTiles();
	LoadAnimations();
	LoadTileItems();
	CrymeEngine.hud.loadTextures();
}

//fonction pour placer des trucs sur la map pour test le rendu
function CreateMap() {
	var building = new Building(0, 5, 13);
	CrymeEngine.buildings.push(building);
	building = new Building(1, 4, 7, [2]);
	CrymeEngine.buildings.push(building);
	building = new Building(2, 8, 9, [0, 1]);
	CrymeEngine.buildings.push(building);
	Map.changeTile(6, 8, 8);
	Map.changeTile(6, 9, 8);
	Map.changeTile(6, 10, 8);
	Map.changeTile(6, 11, 8);
	Map.changeTile(6, 11, 9);
	Map.changeTile(6, 10, 9);//pour mettre de l'eau sous le cold storage
	Map.changeTile(6, 10, 10);
	Map.changeTile(6, 11, 10);
	var crop = new Crop(0, 1, 6);
	CrymeEngine.crops.push(crop);
	crop = new Crop(1, 3, 5);
	CrymeEngine.crops.push(crop);
	crop = new Crop(2, 2, 1);
	CrymeEngine.crops.push(crop);
}
