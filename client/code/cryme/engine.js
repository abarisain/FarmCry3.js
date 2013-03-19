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
	highlightedItem: -1,//index de l'item selectionne
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

			if (showGraphicDebug) {
				if (showGraphicDebugAdvanced) {
					CrymeEngine.canvas.map.context.fillStyle = "#000";
					CrymeEngine.canvas.map.context.fillRect(0, 0, canvasWidth, canvasHeight);
					CrymeEngine.canvas.map.context.globalAlpha = graphicDebugAlpha;//pour afficher tous les éléments en transparence
				}

				CrymeEngine.canvas.debug.clear();
				CrymeEngine.canvas.debug.context.save();
				CrymeEngine.canvas.debug.context.scale(scaleFactor, scaleFactor);
				CrymeEngine.canvas.debug.context.translate(CrymeEngine.camera.position.x, CrymeEngine.camera.position.y);
			}
			else {
				CrymeEngine.canvas.debug.clear();
				CrymeEngine.canvas.map.context.globalAlpha = 1;//pour être sur de ne pas avoir de bug de transparence
			}

			//gestion du positionnement de la caméra
			CrymeEngine.canvas.map.context.scale(scaleFactor, scaleFactor);
			CrymeEngine.canvas.map.context.translate(CrymeEngine.camera.position.x, CrymeEngine.camera.position.y);

			//couleur par defaut
			CrymeEngine.canvas.map.context.fillStyle = "#fff";

			//dessin du terrain
			Map.drawMap();

			//dessin des bâtiments
			Map.drawTileItems();

			CrymeEngine.canvas.map.context.restore();
			if (showGraphicDebug) {
				CrymeEngine.canvas.debug.context.restore();
			}
		},
		Hud: function () {
			CrymeEngine.canvas.hud.clear();
			CrymeEngine.hud.draw();
		},
		MainLoop: function () {
			if (!CrymeEngine.pauseRendering) {
				if (loadingComplete) {
					//There is another render loop for when the map is loading
					if (CrymeEngine.mapInvalidated) {
						CrymeEngine.Draw.Map();
					}
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
		this.canvas.debug = new CrymeCanvas('#canvasDebug');
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
				if (event.button == 0) {
					CE.hud.onClick(event.pageX, event.pageY);
					CrymeEngine.mousePosition.x = event.pageX / scaleFactor - this.offsetLeft;
					CrymeEngine.mousePosition.y = event.pageY / scaleFactor - this.offsetTop;
					var objectSelected = false;
					for (var i = 0; i < CE.tileItems.length; i++) {
						if (Map.tileItems[i].mouseIntersect(CE.mousePosition.x - CE.camera.position.x, CE.mousePosition.y - CE.camera.position.y)) {
							if (CE.highlightedItem > -1 && CE.highlightedItem != i) {
								Map.tileItems[CE.highlightedItem].highlighted = false;
							}
							CE.highlightedItem = i;
							objectSelected = true;
							break;
						}
					}
					//si on ne sélectionne rien, on déselectionne
					if (!objectSelected) {
						if (CE.highlightedItem > -1) {
							Map.tileItems[CE.highlightedItem].highlighted = false;
							CE.highlightedItem = -1;
						}
					}
				}
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
			if (document.activeElement == CrymeEngine.hud.chat.divs.input && event.keyCode != 13) {
				return true;
			}
			switch (event.keyCode) {
				case 13: //Enter
					if (document.activeElement == CrymeEngine.hud.chat.divs.input) {
						CrymeEngine.hud.chat.send();
					} else {
						CrymeEngine.hud.chat.divs.input.focus();
					}
					break;
				case 32: //Space
					CrymeEngine.hudElements[3].visible = !CrymeEngine.hudElements[3].visible;
					break;
				//graphic debug
				case 49://1
					showGraphicDebug = !showGraphicDebug;
					var messageData = {
						kind: CrymeEngine.hud.chat.Kind.LOCAL,
						message: 'Graphical debug : enabled - ' + showGraphicDebug
					}
					CrymeEngine.hud.chat.append(messageData);
					break;
				case 50://2
					showGraphicDebugItem = !showGraphicDebugItem;
					break;
				case 51://3
					showGraphicDebugMap = !showGraphicDebugMap;
					break;
				case 52://4
					showGraphicDebugAdvanced = !showGraphicDebugAdvanced;
					var messageData = {
						kind: CrymeEngine.hud.chat.Kind.LOCAL,
						message: 'Graphical debug : advanced - ' + showGraphicDebugAdvanced
					}
					CrymeEngine.hud.chat.append(messageData);
					break;
				case 53://5
					graphicDebugAlpha = (graphicDebugAlpha + 0.25) % 1;
					var messageData = {
						kind: CrymeEngine.hud.chat.Kind.LOCAL,
						message: 'Graphical debug : advanced - opacity set to ' + graphicDebugAlpha
					}
					CrymeEngine.hud.chat.append(messageData);
					break;
			}
		};

		this.canvas.hud.canvas.onmousewheel = function (evt) {
			if (evt.wheelDeltaY > 0) {
				scaleFactor += 0.25;
			}
			else {
				if (scaleFactor > 0.25) {
					scaleFactor -= 0.25;
				}
			}
		};

		window.onmouseup = function () {
			CrymeEngine.movingMap = false;
			if (CE.highlightedItem > -1) {
				Map.tileItems[CE.highlightedItem].highlighted = false;
				CE.highlightedItem = -1;
			}
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

			if (CE.highlightedItem > -1) {
				CE.tileItems[CE.highlightedItem].centerX -= (event.pageX / scaleFactor - this.offsetLeft - CrymeEngine.mousePosition.x);
				CE.tileItems[CE.highlightedItem].centerY -= (event.pageY / scaleFactor - this.offsetTop - CrymeEngine.mousePosition.y);
				CE.tileItems[CE.highlightedItem].updateImageCoord();

				CrymeEngine.mousePosition.x = event.pageX / scaleFactor - this.offsetLeft;
				CrymeEngine.mousePosition.y = event.pageY / scaleFactor - this.offsetTop;
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
	LoadTexTiles();
	LoadTexTilesItem();
	CrymeEngine.hud.loadTextures();
}

//fonction pour placer des trucs sur la map pour test le rendu
function CreateMap() {
	var building = new TileItems.Building(0, 5, 13);
	Map.tileItems.push(building);
	building = new TileItems.Building(0, 4, 7);
	Map.tileItems.push(building);
	building = new TileItems.Building(0, 8, 9);
	Map.tileItems.push(building);

	var crop = new TileItems.Crop(0, 1, 6);
	Map.tileItems.push(crop);
	crop = new TileItems.Crop(1, 3, 5);
	Map.tileItems.push(crop);
	crop = new TileItems.Crop(2, 2, 1);
	Map.tileItems.push(crop);
	Map.changeTile(6, 1, 6);//pour mettre de la terre sous les crops sous le cold storage
	Map.changeTile(6, 3, 5);
	Map.changeTile(6, 2, 1);
}
