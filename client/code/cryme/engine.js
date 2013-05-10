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
	DisplayType: {
		STANDARD: 0,
		INFO_MAP: 1,
		INFO_BUILDING: 2
	},
	displayType: 0,
	GameState: {
		FARMING: 0,
		BATTLE: 1
	},
	gameState: 0,
	camera: {
		position: {
			x: -1000,
			y: -1000
		},
		moveCamera: function (x, y) {
			this.position.x += x;
			if (this.position.x > -Map.rect.x) {
				this.position.x = -Map.rect.x;
			}
			if (this.position.x < -(Map.rect.x + Map.rect.dx - canvasWidth)) {
				this.position.x = -(Map.rect.x + Map.rect.dx - canvasWidth);
			}

			this.position.y += y;
			if (this.position.y > -Map.rect.y) {
				this.position.y = -Map.rect.y;
			}
			if (this.position.y < -(Map.rect.y + Map.rect.dy - canvasHeight)) {
				this.position.y = -(Map.rect.y + Map.rect.dy - canvasHeight);
			}
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
			if (initialDataLoaded && currentLoadingCount >= totalLoadingCount) {
				networkEngine.onLoadingFinished();
				CreateMap();
				window.requestAnimFrame(function () {
					CrymeEngine.Draw.MapCreation(1, 1);
				});
			}
			else {
				//Kind of a hack, but redoing the whole loading system is really hard and not so useful
				networkEngine.onLoadingProgress(currentLoadingCount, totalLoadingCount);
				window.requestAnimFrame(function () {
					CrymeEngine.Draw.Loading();
				});
			}
		},
		MapCreation: function (progress, speed) {
			//Pour faire apparaître la map de façon un peu "Qui pête"
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
		},
		Map: function () {
			CrymeEngine.canvas.map.clear();
			CrymeEngine.canvas.map.context.save();
			CrymeEngine.canvas.animation.clear();

			if (CE.displayType != CE.DisplayType.STANDARD) {
				CrymeEngine.canvas.map.context.fillStyle = "#ddd";
				CrymeEngine.canvas.map.context.fillRect(0, 0, canvasWidth, canvasHeight);
			}

			if (Options.Debug.Graphic.enabled) {
				if (Options.Debug.Graphic.advanced) {
					CrymeEngine.canvas.map.context.fillStyle = "#000";
					CrymeEngine.canvas.map.context.fillRect(0, 0, canvasWidth, canvasHeight);
					CrymeEngine.canvas.map.context.globalAlpha = Options.Debug.Graphic.globalAlpha;//pour afficher tous les éléments en transparence
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

			if (CE.displayType == CE.DisplayType.STANDARD) {
				Map.drawBackground();
			}

			//couleur par defaut
			CrymeEngine.canvas.map.context.fillStyle = "#fff";

			//dessin du terrain
			Map.drawMap();

			//dessin des bâtiments
			Map.drawTileItems();

			if (CE.displayType != CE.DisplayType.STANDARD) {
				//dessin du terrain
				Map.drawMapInfos();
			}

			CrymeEngine.canvas.map.context.restore();
			if (Options.Debug.Graphic.enabled) {
				CrymeEngine.canvas.debug.context.restore();
			}
		},
		Battle: function () {
			CrymeEngine.canvas.map.clear();
			CrymeEngine.canvas.hud.clear();
			CrymeEngine.canvas.animation.clear();
			CrymeEngine.canvas.animation.context.save();

			CrymeEngine.Battle.draw();

			CrymeEngine.canvas.animation.context.restore();
		},
		Hud: function () {
			CrymeEngine.canvas.hud.clear();
			CrymeEngine.hud.draw();
			//dessin de la keymap si nécessaire
			CE.keyboard.drawKeyMap();
		},
		MainLoop: function () {
			if (!CrymeEngine.pauseRendering) {
				if (loadingComplete) {
					if (CrymeEngine.gameState == CE.GameState.FARMING) {
						//There is another render loop for when the map is loading
						if (CrymeEngine.mapInvalidated || Map.transitionInformation.started) {
							CrymeEngine.Draw.Map();
						}
						CrymeEngine.Draw.Hud();
					} else if (CrymeEngine.gameState == CE.GameState.BATTLE) {
						CrymeEngine.Draw.Battle();
					}
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

		CE.keyboard.init();

		var audioPlayer = document.getElementById('audioPlayer');
		audioPlayer.style.top = (canvasHeight - 30) + 'px';
		if (Options.Sound.music) {
			audioPlayer.play();
		}
		//Bind events

		this.canvas.hud.canvas.onmousedown = function (event) {
			if (loadingComplete) {
				if (event.button == 0) {
					CE.hud.onClick(event.pageX, event.pageY);

					//pour du debug de position d'image
					CrymeEngine.mousePosition.x = event.pageX / scaleFactor - this.offsetLeft;
					CrymeEngine.mousePosition.y = event.pageY / scaleFactor - this.offsetTop;
					var objectSelected = false;
					for (var i = Map.tileItems.length - 1; i >= 0; i--) {//en gérant par la fin, on sélectionne l'élément au premier plan
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
				if (event.button == 0) {
					//le clic gauche permet de sélectionner une case lorsqu'on est en mode informations
					var coord = Map.coordinatesFromMousePosition(event.pageX / scaleFactor - this.offsetLeft - CE.camera.position.x, event.pageY / scaleFactor - this.offsetTop - CE.camera.position.y);
				}
			}
		};

		this.canvas.hud.canvas.ondblclick = function (event) {
			if (loadingComplete) {
				//pour du debug de position d'image
				Map.player.moveToMousePosition(event.pageX / scaleFactor - this.offsetLeft - CE.camera.position.x, event.pageY / scaleFactor - this.offsetTop - CE.camera.position.y);
			}
		};

		window.onkeydown = function (event) {
			CE.keyboard.keyPressed(event);
			CE.mapInvalidated = true;
			//Todo rajouter l'invalidation de la map lorsque nécessaire
		};

		window.onkeyup = function (event) {
			CE.keyboard.keyReleased(event);
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
			if (CE.displayType != CE.DisplayType.STANDARD) {
				Map.highlightTile(event.pageX / scaleFactor - this.offsetLeft - CE.camera.position.x, event.pageY / scaleFactor - this.offsetTop - CE.camera.position.y);
				this.mapInvalidated = true;
			}
			if (CrymeEngine.movingMap) {
				event = event || window.event;

				//deplacement de la caméra en fonction de la dernière position de la souris
				CrymeEngine.camera.moveCamera(event.pageX - this.offsetLeft - CrymeEngine.mousePosition.x, event.pageY - this.offsetTop - CrymeEngine.mousePosition.y);

				//pour se souvenir de la dernière position de la souris
				CrymeEngine.mousePosition.x = event.pageX - this.offsetLeft;
				CrymeEngine.mousePosition.y = event.pageY - this.offsetTop;
				CrymeEngine.mapInvalidated = true;
			}

			if (CE.highlightedItem > -1) {
				Map.tileItems[CE.highlightedItem].sprite.centerX -= (event.pageX / scaleFactor - this.offsetLeft - CrymeEngine.mousePosition.x);
				Map.tileItems[CE.highlightedItem].sprite.centerY -= (event.pageY / scaleFactor - this.offsetTop - CrymeEngine.mousePosition.y);
				Map.tileItems[CE.highlightedItem].updateImageCoord();

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
	LoadSpritePack();
	CrymeEngine.hud.loadTextures();
}

//fonction pour placer des trucs sur la map pour test le rendu
function CreateMap() {
	//ajout de buildings
	var building = new MapItems.TileItems.Building(SpritePack.Buildings.Sprites.HOME, 5, 13);
	Map.tileItems.push(building);
	building = new MapItems.TileItems.Building(SpritePack.Buildings.Sprites.HOME, 4, 7);
	Map.tileItems.push(building);
	building = new MapItems.TileItems.Building(SpritePack.Buildings.Sprites.BARN, 8, 9);
	Map.tileItems.push(building);
	building = new MapItems.TileItems.Building(SpritePack.Buildings.Sprites.BARN, 2, 12);
	Map.tileItems.push(building);

	//ajout de crops
	var crop = new MapItems.TileItems.Crop(SpritePack.Crops.Sprites.TOMATO, 1, 6);
	Map.tileItems.push(crop);
	crop = new MapItems.TileItems.Crop(SpritePack.Crops.Sprites.CORN, 3, 5);
	Map.tileItems.push(crop);
	crop = new MapItems.TileItems.Crop(SpritePack.Crops.Sprites.WHEAT, 2, 1);
	Map.tileItems.push(crop);

	//ajout de characters
	/*var character = new TileItems.Character(0, 5, 5);
	 Map.players.push(character);
	 Map.player = character;//pour pouvoir gerer le joueur facilement
	 Map.tileItems.push(character);//pour gérer les personnages comme n'importe quel autre item, du moins pour le moment
	 var character = new TileItems.Character(1, 12, 7);
	 Map.players.push(character);
	 Map.tileItems.push(character);
	 var character = new TileItems.Character(1, 2, 3);
	 Map.players.push(character);
	 Map.tileItems.push(character);*/

	var tmpFarmer;
	for (var i = 0; i < initialData.online_farmers.length; i++) {
		tmpFarmer = new Farmer();
		tmpFarmer.initFromFarmer(initialData.online_farmers[i]);
		GameState.addPlayer(tmpFarmer);
	}
	tmpFarmer = new PlayableFarmer();
	tmpFarmer.initFromFarmer(initialData.player_farmer);
	GameState.player = tmpFarmer;
	Map.addPlayer(tmpFarmer);

	Map.loadInformations();

	//modification de la map
	Map.changeTile(SpritePack.Tiles.Sprites.SOIL, 1, 6);//pour mettre de la terre sous les crops sous le cold storage
	Map.changeTile(SpritePack.Tiles.Sprites.SOIL, 3, 5);
	Map.changeTile(SpritePack.Tiles.Sprites.SOIL, 2, 1);
}
