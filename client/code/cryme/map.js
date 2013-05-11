var Map = {
	tiles: [],
	player: null,//le character du joueur
	players: [],//tous les joueurs y compris le notre
	mapItems: [],//contient à la fois les buildings, les crops de la map, et tous les personnages de la map
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
	loadInformations: function () {
		for (var i = 0; i < this.tiles.length; i++) {
			this.tiles[i].load();
		}
		for (var i = 0; i < this.mapItems.length; i++) {
			this.mapItems[i].load();
		}
	},
	addPlayer: function (player) {
		this.removePlayer(player.nickname);
		var tmpPlayer = new MapItems.Character(player);
		this.players.push(tmpPlayer);
		if (player.constructor == PlayableFarmer)
			this.player = tmpPlayer;
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
		var count = this.players.length;
		for (var i = count - 1; i >= 0; i--) {
			if (this.mapItems[i].constructor == Farmer && this.mapItems[i].farmer.nickname == nickname) {
				this.mapItems.removeItemAtIndex(i);
			}
			break;
		}
	},
	loadTiles: function (tileData) {
		for (var i = tileData.length - 1; i >= 0; i--) {
			for (var j = 0; j < tileData[i].length; j++) {
				var tile = new MapItems.Tile(tileData[i][j]);
				this.tiles.push(tile);
			}
		}
	},
	drawMapLoading: function (progress) {
		if (progress < animationDuration / 2) {
			for (var i = 0; i < Math.min(this.tiles.length * progress / (animationDuration / 2), this.tiles.length); i++) {
				this.tiles[i].drawLoading(progress);
			}
		}
		else {
			for (var i = 0; i < this.tiles.length; i++) {
				this.tiles[i].draw();
			}
			for (var i = 0; i < this.mapItems.length; i++) {
				this.mapItems[i].drawLoading(progress - animationDuration / 2);
			}
		}
	},
	changeTile: function (sprite, col, line) {
		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].col == col && this.tiles[i].line == line) {
				this.tiles[i].sprite = sprite;
				break;
			}
		}
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
	drawMap: function () {
		//Todo séparer l'update du draw
		this.transitionInformation.updateProgress();
		this.transitionInformationDetailed.updateProgress();
		for (var i = 0; i < this.tiles.length; i++) {
			this.tiles[i].draw();
		}
	},
	drawAnimation: function () {
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].draw();
		}
	},
	drawMapInfos: function () {
		if (CE.displayType == CE.DisplayType.INFO_MAP) {
			for (var i = 0; i < this.tiles.length; i++) {
				this.tiles[i].drawInfo();
			}
			if (this.tileHighLighted.index > -1) {
				this.tiles[this.tileHighLighted.index].drawInfoDetailed();
			}
		} else if (CE.displayType == CE.DisplayType.INFO_BUILDING) {
			for (var i = 0; i < this.mapItems.length; i++) {
				this.mapItems[i].drawInfo();
			}
			if (this.tileHighLighted.index > -1) {
				this.mapItems[this.tileHighLighted.index].drawInfoDetailed();
			}
		}
	},
	drawTileItems: function () {
		for (var i = 0; i < this.mapItems.length; i++) {
			this.mapItems[i].draw();
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
		this.transitionInformation.start(Transition.Type.FADE_IN, true);
	},
	highlightTile: function (x, y) {
		var exHighlighted = this.tileHighLighted.index;
		this.tileHighLighted.index = -1;
		var coord = Map.coordinatesFromMousePosition(x, y);
		if (CE.displayType == CE.DisplayType.INFO_MAP) {
			for (var i = 0; i < this.tiles.length; i++) {
				if (this.tiles[i].match(coord.col, coord.line)) {
					this.tileHighLighted.col = coord.col;
					this.tileHighLighted.line = coord.line;
					this.tileHighLighted.index = i;
					if (i != exHighlighted) {
						this.transitionInformationDetailed.start(Transition.Type.FADE_IN, true);
					}
					break;
				}
			}
		} else {
			for (var i = 0; i < this.mapItems.length; i++) {
				if (this.mapItems[i].match(coord.col, coord.line)) {
					this.tileHighLighted.col = coord.col;
					this.tileHighLighted.line = coord.line;
					this.tileHighLighted.index = i;
					if (i != exHighlighted) {
						this.transitionInformationDetailed.start(Transition.Type.FADE_IN, true);
					}
					break;
				}
			}
		}
	}
};