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
	transitionMapCreation: null,
	DisplayType: {//Selection du type de display
		STANDARD: 0,
		INFORMATION: 1
	},
	displayType: 0,
	//TODO ptet faire une classe pour gérer ça correctement parce que finalement ça devient le bordel
	//Je sais que j'aurai passé beaucoup de temps sur cette partie, mais ça peut être vraiment super pratique pour l'utilisateur
	FilterType: {//Filter to display informations
		OWNER: {index: 0, name: 'Owner', tiles: false, tileBorders: false, mapItems: false, color: ColorHelper.Color.RED},
		HUMIDITY: {index: 1, name: 'Humidity', tiles: true, tileBorders: true, mapItems: false, color: ColorHelper.Color.BLUE},
		FERTILITY: {index: 2, name: 'Fertility', tiles: true, tileBorders: false, mapItems: false, color: ColorHelper.Color.GREEN},
		MATURITY: {index: 3, name: 'Maturity', tiles: false, tileBorders: true, mapItems: true, color: ColorHelper.Color.YELLOW},
		HEALTH: {index: 4, name: 'Health', tiles: false, tileBorders: false, mapItems: true, color: ColorHelper.Color.WHITE},
		STORAGE_AVAILABLE: {index: 5, name: 'Space available', tiles: false, tileBorders: true, mapItems: true, color: ColorHelper.Color.BROWN},
		STORAGE_USED: {index: 6, name: 'Space used', tiles: false, tileBorders: true, mapItems: true, color: ColorHelper.Color.VIOLET}
	},
	filterType: undefined,
	GameState: {
		FARMING: 0,
		BATTLE: 1
	},
	gameState: 0,
	camera: new Camera(),
	mousePosition: {
		x: 0,
		y: 0
	},
	canvas: { //Element type : CrymeCanvas
		resizeAll: function (width, height) {
			Object.keys(CrymeEngine.canvas).forEach(function (targetCanvas) {
				if (targetCanvas != 'resizeAll' && targetCanvas != 'logAsPng') { //Exclude this function
					CrymeEngine.canvas[targetCanvas].resize(width, height);
				}
			});
		},
		logAsPng: function () {
			for (var key in CE.canvas) {
				var cn = CE.canvas[key];
				if (cn == CE.canvas.resizeAll || cn == undefined
					|| cn == CE.canvas.logAsPng) {
					continue;
				}
				;
				console.log(key + " " + cn.canvas.toDataURL("image/png"));
			}
		}
	},
	onLoadingAnimationFinished: function () {
		//Normal draw loop will now handle the rendering
		networkEngine.onLoadingAnimationFinished();
		loadingComplete = true;
		CE.mapInvalidated = true;
		CrymeEngine.camera.centerCamera(Map.player.x, Map.player.y);
	},
	Draw: {
		Loading: function () {
			if (initialDataLoaded && currentLoadingCount >= totalLoadingCount) {
				networkEngine.onLoadingFinished();
				//indispensable pour créer la map
				initSpriteEnums();
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
		MapCreation: function () {
			CE.transitionMapCreation.updateProgress();
			//Pour faire apparaître la map de façon un peu "Qui pête"
			CrymeEngine.canvas.map.context.save();
			CrymeEngine.canvas.map.clear();

			CrymeEngine.canvas.map.context.translate(CrymeEngine.camera.position.x,
				CrymeEngine.camera.position.y);

			//dessin du terrain
			Map.drawMapLoading(CE.transitionMapCreation.progress);
			//il vaux mieux restaurer le contexte avant de commencer à dessiner, pour être tranquille
			CrymeEngine.canvas.map.context.restore();

			if (CE.transitionMapCreation.started) {
				window.requestAnimFrame(function () {
					CrymeEngine.Draw.MapCreation();
				});
			}
		},
		Map: function () {
			CrymeEngine.canvas.map.clear();
			CrymeEngine.canvas.map.context.save();

			if (CE.displayType != CE.DisplayType.STANDARD) {
				CrymeEngine.canvas.map.context.fillStyle = "#fff";
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

			//dessin de la map (tiles et mapitems)
			Map.drawMap();

			CrymeEngine.canvas.map.context.restore();
			if (Options.Debug.Graphic.enabled) {
				CrymeEngine.canvas.debug.context.restore();
			}
		},
		Animation: function () {
			CrymeEngine.canvas.animation.clear();
			CrymeEngine.canvas.animation.context.save();
			CrymeEngine.canvas.animation.context.scale(scaleFactor, scaleFactor);
			CrymeEngine.canvas.animation.context.translate(CrymeEngine.camera.position.x, CrymeEngine.camera.position.y);

			Map.drawAnimation();
			if (CE.displayType == CE.DisplayType.STANDARD) {
				CE.Weather.draw();
			}

			CrymeEngine.canvas.animation.context.restore();
		},
		Information: function () {
			CrymeEngine.canvas.information.clear();
			if (CE.displayType != CE.DisplayType.STANDARD) {
				CrymeEngine.canvas.information.context.save();
				CrymeEngine.canvas.information.context.scale(scaleFactor, scaleFactor);
				CrymeEngine.canvas.information.context.translate(CrymeEngine.camera.position.x, CrymeEngine.camera.position.y);

				Map.drawMapInfos();
				CrymeEngine.canvas.information.context.restore();
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
			if (CrymeEngine.gameState == CE.GameState.FARMING) {
				CrymeEngine.camera.updateCamera();
				//There is another render loop for when the map is loading
				if (CrymeEngine.mapInvalidated) {
					CrymeEngine.mapInvalidated = false;
					CrymeEngine.Draw.Map();
				}
				CrymeEngine.Draw.Animation();
				CrymeEngine.Draw.Information();
				CrymeEngine.Draw.Hud();
			} else if (CrymeEngine.gameState == CE.GameState.BATTLE) {
				CrymeEngine.Draw.Battle();
			}
		}
	},
	Update: {
		Animation: function () {
			CE.Weather.update();
		},
		MainLoop: function () {
			if (!CrymeEngine.pauseRendering) {
				if (loadingComplete) {
					CE.Update.Animation();

					CE.Draw.MainLoop();
				}
			}
			window.requestAnimFrame(function () {
				CrymeEngine.Update.MainLoop();
			});
		}
	},
	Event: {
		launchBattle: function (data) {
			CE.gameState = CE.GameState.BATTLE;
			CE.Battle.launchBattle(SpritePack.Battle.Sprites.WEAPON_FORK);
			CE.mapInvalidated = true;
		},
		showFilterType: function () {
			CE.displayType = CE.DisplayType.INFORMATION;
			CE.hud.events.showFilter(CE.filterType.name);
			Map.tileHighLighted.index = -1;
			Map.showMapInformations();
			CrymeEngine.mapInvalidated = true;
		},
		changeFilterType: function (filterType) {
			if (CE.displayType == CE.DisplayType.STANDARD) {
				CE.displayType = CE.DisplayType.INFORMATION;
			} else {

			}
			CE.hud.events.showFilter(filterType.name);
			CE.filterType = filterType;
			Map.tileHighLighted.index = -1;
			Map.showMapInformations();
			CrymeEngine.mapInvalidated = true;
		},
		removeFilterType: function () {
			CE.hud.events.removeFilter();
			CE.displayType = CE.DisplayType.STANDARD;
			Map.tileHighLighted.index = -1;
			CE.mapInvalidated = true;
		}
	},
	init: function () {
		this.canvas.map = new CrymeCanvas('#canvas');
		this.canvas.animation = new CrymeCanvas('#canvasAnimation');
		this.canvas.information = new CrymeCanvas('#canvasInformation');
		this.canvas.hud = new CrymeCanvas('#canvasHud');
		this.canvas.debug = new CrymeCanvas('#canvasDebug');
		this.canvas.map.setFont("normal 12pt stanberry");
		this.canvas.hud.setFont("bold 13pt stanberry,Calibri,Geneva,Arial");
		this.canvas.resizeAll(canvasWidth, canvasHeight);

		CE.keyboard.init();
		ColorHelper.init();

		//Bind events

		this.canvas.hud.canvas.onmousedown = function (event) {
			if (loadingComplete) {
				if (event.button == 0) {
					// If the hud has handled the event, forget it
					if (CE.hud.onClick(event.pageX, event.pageY))
						return;

					//pour du debug de position d'image
					CrymeEngine.mousePosition.x = event.pageX / scaleFactor - this.offsetLeft;
					CrymeEngine.mousePosition.y = event.pageY / scaleFactor - this.offsetTop;
					var objectSelected = false;
					for (var i = Map.mapItems.length - 1; i >= 0; i--) {//en gérant par la fin, on sélectionne l'élément au premier plan
						if (Map.mapItems[i].mouseIntersect(CE.mousePosition.x - CE.camera.position.x, CE.mousePosition.y - CE.camera.position.y)) {
							if (CE.highlightedItem > -1 && CE.highlightedItem != i) {
								Map.mapItems[CE.highlightedItem].highlighted = false;
							}
							CE.highlightedItem = i;
							objectSelected = true;
							break;
						}
					}
					//si on ne sélectionne rien, on déselectionne
					if (!objectSelected) {
						if (CE.highlightedItem > -1) {
							Map.mapItems[CE.highlightedItem].highlighted = false;
							CE.highlightedItem = -1;
							CrymeEngine.mapInvalidated = true;
						}
					}

					if (!Options.Debug.Graphic.enabled) {
						var x = event.pageX / scaleFactor - this.offsetLeft - CE.camera.position.x;
						var y = event.pageY / scaleFactor - this.offsetTop - CE.camera.position.y;
						var coord = Map.getPlayerCoordinate(x, y);
						var data = {col: 0, line: 0};
						var moved = true;
						coord.col -= Map.player.col;
						coord.line -= Map.player.line;
						if (coord.building) {
							//Vieux hack de merde pour forcer le joueur a entrer dans un building, part 2
							data.col = coord.col;
							data.line = coord.line;
						} else {
							var delta = {col: coord.col / Math.abs(coord.col), line: coord.line / Math.abs(coord.line)};//delta entre -1 et 1
							if (delta.col == 0 && delta.line == 0) {
								moved = false;
							} else {
								if (Math.abs(coord.col) > Math.abs(coord.line)) {
									data.col = delta.col;
								} else {
									data.line = delta.line;
								}
							}
						}
						if (moved) {
							networkEngine.call('player', 'move', data);
						}
					}
				}
				if (event.button == 2) {
					if (Options.Debug.Graphic.enabled) {
						//en mode debug
						//le clic droit sers a bouger la map, et le gauche a agir
						//positionnement de la souris
						CrymeEngine.mousePosition.x = event.pageX - this.offsetLeft;
						CrymeEngine.mousePosition.y = event.pageY - this.offsetTop;

						//activation du deplacement de la map
						CrymeEngine.movingMap = true;
					}
				}
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
			if (!Options.Debug.Graphic.enabled) {
				CE.hud.rootHudElement.onScroll(evt.pageX, evt.pageY, evt.wheelDeltaY);
			} else {
				if (evt.wheelDeltaY > 0) {
					scaleFactor += 0.25;
				}
				else {
					if (scaleFactor > 0.25) {
						scaleFactor -= 0.25;
					}
				}
				CrymeEngine.mapInvalidated = true;
			}
		};

		window.onmouseup = function () {
			CrymeEngine.movingMap = false;
			if (CE.highlightedItem > -1) {
				Map.mapItems[CE.highlightedItem].highlighted = false;
				CE.highlightedItem = -1;
				CrymeEngine.mapInvalidated = true;
			}
		};

		window.onresize = function () {
			//Doesn't work yet
			canvasWidth = window.innerWidth;
			canvasHeight = window.innerHeight;
			CrymeEngine.canvas.resizeAll(canvasWidth, canvasHeight);
			Map.refreshMapVisibility();
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

			if (CE.highlightedItem > -1 && Options.Debug.Graphic.enabled) {
				Map.mapItems[CE.highlightedItem].sprite.centerX -= (event.pageX / scaleFactor - this.offsetLeft - CrymeEngine.mousePosition.x);
				Map.mapItems[CE.highlightedItem].sprite.centerY -= (event.pageY / scaleFactor - this.offsetTop - CrymeEngine.mousePosition.y);
				Map.mapItems[CE.highlightedItem].updateImageCoord();

				CrymeEngine.mousePosition.x = event.pageX / scaleFactor - this.offsetLeft;
				CrymeEngine.mousePosition.y = event.pageY / scaleFactor - this.offsetTop;
				CrymeEngine.mapInvalidated = true;
			}
		};

		//Start the main drawing loop.
		CrymeEngine.Draw.Loading();
		CrymeEngine.Update.MainLoop();

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
	CE.filterType = CE.FilterType.HUMIDITY;
	var tmpFarmer;
	for (var i = 0; i < initialData.online_farmers.length; i++) {
		tmpFarmer = new LogicItems.Farmer();
		tmpFarmer.initFromFarmer(initialData.online_farmers[i]);
		GameState.addPlayer(tmpFarmer);
	}
	tmpFarmer = new LogicItems.PlayableFarmer();
	tmpFarmer.initFromFarmer(initialData.player_farmer);
	GameState.player = tmpFarmer;
	Map.addPlayer(tmpFarmer);

	Map.initMap();
	CE.Weather.init();

	CE.transitionMapCreation = new Transition(0, 1, 80, CrymeEngine.onLoadingAnimationFinished)
	CE.transitionMapCreation.smoothing = true;
	CE.transitionMapCreation.start(Transition.Direction.IN);

}
