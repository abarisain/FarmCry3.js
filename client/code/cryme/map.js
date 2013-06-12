var Map = {
	tiles: [],
	tilesVisibles: [],//tableau contenant les tiles visibles. Pour optimiser le rendu et les calculs
	player: null,//le character du joueur
	players: [],//tous les joueurs y compris le notre
	mapItems: {},//contient à la fois les buildings, les crops de la map, et tous les personnages de la map
	rect: { x: 1, y: 1, dx: 0, dy: 0 },
	tileHighLighted: {col: 0, line: 0, index: -1 },//pour pouvoir retrouver sur quelle case on veux interagir
	transitionInformation: new Transition(0, 10, 15, function (transitionType) {
	}),
	transitionInformationDetailed: new Transition(0, 10, 10, function (transitionType) {
	}),
	init: function (data) {
		this.loadTiles(data.tiles);

		this.rect.x = -tileWidth / 2;
		this.rect.y = -tileHeight / 2;
		this.rect.dx = (tileWidth / 2) * (colSize + lineSize);
		this.rect.dy = (tileHeight / 2) * (colSize + lineSize);
	},
	loadTiles: function (tileData) {
		for (var i = tileData.length - 1; i >= 0; i--) {
			for (var j = 0; j < tileData[i].length; j++) {
				var tile = new MapItems.Tile(tileData[i][j]);
				this.tiles.push(tile);
			}
		}
	},
	initMap: function () {
		for (var i = 0; i < this.tiles.length; i++) {
			this.tiles[i].init();
		}
		for (var key in this.mapItems) {
			this.mapItems[key].init();
		}
		this.refreshMapVisibility();
	},
	refreshMapVisibility: function () {//appelé quand la caméra bouge pour optimiser
		this.tilesVisibles = [];
		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].checkVisibility()) {
				this.tilesVisibles.push(this.tiles[i]);
			}
		}
		for (var key in this.mapItems) {
			this.mapItems[key].checkVisibility();
		}
		CE.Environment.refreshWeatherVisibility();
	},
	addPlayer: function (player) {
		this.removePlayer(player.nickname);
		var tmpPlayer = new MapItems.Character(player);
		this.players.push(tmpPlayer);
		if (player.constructor == LogicItems.PlayableFarmer) {
			this.player = tmpPlayer;
			GameState.loadPlayer();
		}
	},
	updateHud: function () {
		if (this.player != null) {
			CE.hud.events.updateActionAvailables(this.getPlayerTile(), this.getPlayerMapItem());
		}
	},
	removePlayer: function (nickname) {
		if (this.player != null && nickname == this.player.farmer.nickname)
			return;
		var count = this.players.length;
		for (var i = count - 1; i >= 0; i--) {
			if (this.players[i].farmer.nickname == nickname) {
				this.players.removeItemAtIndex(i);
			}
			break;
		}
		//TODO vérifier que j'ai pas pêté cette méthode avec le foreach
		var count = this.mapItems.length;
		for (var key in this.mapItems) {
			if (this.mapItems[key].constructor == LogicItems.Farmer && this.mapItems[key].farmer.nickname == nickname) {
				delete this.mapItems[key];//aucune idée de si ça va marcher
			}
			break;
		}
	},
	getTile: function (col, line) {
		//TODO à vérifier
		return this.tiles[col + (lineSize - 1 - line) * (lineSize)];
	},
	getPlayerTile: function () {
		return this.getTile(this.player.col, this.player.line);
	},
	getPlayerMapItem: function () {
		return this.mapItems[this.getMapItemKey(this.player.col, this.player.line)];
	},
	getMapItemKey: function (col, line) {
		return '_' + col + '_' + line;
	},
	drawBackground: function () {
		CE.canvas.map.context.fillStyle = "#f9f9f9";
		CE.canvas.map.context.fillRect(this.rect.x, this.rect.y, this.rect.dx, this.rect.dy);
		CE.canvas.map.context.drawImage(SpritePack.Background.Sprites.TOP_LEFT.image, this.rect.x, this.rect.y);
		CE.canvas.map.context.drawImage(SpritePack.Background.Sprites.TOP_RIGHT.image, this.rect.x + this.rect.dx -
			SpritePack.Background.Sprites.TOP_RIGHT.centerX, this.rect.y);
		CE.canvas.map.context.drawImage(SpritePack.Background.Sprites.BOTTOM_LEFT.image, this.rect.x, this.rect.y +
			this.rect.dy - SpritePack.Background.Sprites.BOTTOM_LEFT.centerY);
		CE.canvas.map.context.drawImage(SpritePack.Background.Sprites.BOTTOM_RIGHT.image, this.rect.x + this.rect.dx -
			SpritePack.Background.Sprites.BOTTOM_RIGHT.centerX, this.rect.y + this.rect.dy -
			SpritePack.Background.Sprites.BOTTOM_RIGHT.centerY);
	},
	drawMapLoading: function (progress) {
		for (var i = 0; i < Math.min(this.tiles.length * progress, this.tiles.length); i++) {
			this.tiles[i].drawLoading(progress);
		}
		/*for (var key in this.mapItems) {
		 this.mapItems[key].drawLoading(progress);
		 }*/
	},
	drawMap: function () {
		//Todo séparer l'update du draw
		if (this.transitionInformation.started) {
			this.transitionInformation.updateProgress();
			CrymeEngine.mapInvalidated = true;
		}
		if (this.transitionInformationDetailed.started) {
			this.transitionInformationDetailed.updateProgress();
			CrymeEngine.mapInvalidated = true;
		}
		for (var i = 0; i < this.tilesVisibles.length; i++) {
			this.tilesVisibles[i].draw();
		}
		for (var key in this.mapItems) {
			this.mapItems[key].draw();
		}
	},
	drawMapInfos: function () {
		if (CE.filterType.tiles) {//pour savoir si on doit afficher les informations des tiles
			for (var i = 0; i < this.tilesVisibles.length; i++) {
				this.tilesVisibles[i].drawInfo();
			}
			if (this.tileHighLighted.index > -1) {
				this.tiles[this.tileHighLighted.index].drawInfoDetailed();
			}
		} else if (CE.filterType.mapItems) {
			for (var key in this.mapItems) {
				this.mapItems[key].drawInfo();
			}
			if (this.tileHighLighted.index != -1) {
				this.mapItems[this.tileHighLighted.index].drawInfoDetailed();
			}
		}
	},
	drawAnimation: function () {
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].draw();
		}
		for (var key in this.mapItems) {
			this.mapItems[key].drawAnimation();
		}
	},
	coordinatesFromMousePosition: function (x, y) {
		var newCol = y / tileHeight - lineSize / 2 + x / tileWidth + 1;
		var newLine = x / tileWidth - y / tileHeight + lineSize / 2;
		return {
			col: Math.floor(newCol),
			line: Math.floor(newLine)
		};
	},
	showMapInformations: function () {
		for (var i = 0; i < this.tiles.length; i++) {
			this.tiles[i].showInformation();//obligatoire pour la couleur de fond
		}
		if (CE.filterType.mapItems) {
			for (var key in this.mapItems) {
				this.mapItems[key].showInformation();
			}
		}
		this.transitionInformation.start(Transition.Direction.IN, true);
	},
	highlightTile: function (x, y) {
		var exHighlighted = this.tileHighLighted.index;
		this.tileHighLighted.index = -1;
		var coord = Map.coordinatesFromMousePosition(x, y);
		if (CE.filterType.tiles) {
			for (var i = 0; i < this.tiles.length; i++) {
				if (this.tiles[i].match(coord.col, coord.line)) {
					this.tileHighLighted.col = coord.col;
					this.tileHighLighted.line = coord.line;
					this.tileHighLighted.index = i;
					if (i != exHighlighted) {
						this.transitionInformationDetailed.start(Transition.Direction.IN, true);
						CrymeEngine.mapInvalidated = true;
					}
					break;
				}
			}
		}
		if (CE.filterType.mapItems) {
			var key = this.getMapItemKey(coord.col, coord.line);
			var mapItem = this.mapItems[key];
			if (mapItem != undefined) {
				this.tileHighLighted.col = coord.col;
				this.tileHighLighted.line = coord.line;
				this.tileHighLighted.index = key;
				if (key != exHighlighted) {
					this.transitionInformationDetailed.start(Transition.Direction.IN, true);
					CrymeEngine.mapInvalidated = true;
				}
			}
		}
	},
};