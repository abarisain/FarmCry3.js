var Map = {
	tiles: [],
	player: null,//le character du joueur
	players: [],//tous les joueurs y compris le notre
	tileItems: [],//contient à la fois les buildings et les crops de la map
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
			this.tiles[i].loadTile();
		}
		for (var i = 0; i < this.tileItems.length; i++) {
			this.tileItems[i].loadInformations();
		}
	},
	addPlayer: function (player) {
		this.removePlayer(player.nickname);
		var tmpPlayer = new TileItems.Character(player);
		//TODO : REMOVE THIS LATER, QUICK FIX !!!!!
		if (typeof tmpPlayer.texture == "undefined")
			return;
		this.players.push(tmpPlayer);
		this.tileItems.push(tmpPlayer);
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
			if (this.tileItems[i].constructor == Farmer && this.tileItems[i].farmer.nickname == nickname) {
				this.tileItems.removeItemAtIndex(i);
			}
			break;
		}
	},
	loadTiles: function (tileData) {
		for (var i = tileData.length - 1; i >= 0; i--) {
			for (var j = 0; j < tileData[i].length; j++) {
				var tile = new Tile(tileData[i][j]);
				this.tiles.push(tile);
			}
		}
	},
	drawMapLoading: function (progress) {
		if (progress < animationDuration / 2) {
			for (var i = 0; i < Math.min(this.tiles.length * progress / (animationDuration / 2), this.tiles.length); i++) {
				this.tiles[i].drawTileLoading(progress);
			}
		}
		else {
			for (var i = 0; i < this.tiles.length; i++) {
				this.tiles[i].drawTile();
			}
			for (var i = 0; i < this.tileItems.length; i++) {
				this.tileItems[i].drawItemLoading(progress - animationDuration / 2);
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
			this.tiles[i].drawTile();
		}
	},
	drawMapInfos: function () {
		if (CE.displayType == CE.DisplayType.INFO_MAP) {
			for (var i = 0; i < this.tiles.length; i++) {
				this.tiles[i].drawTileInfo();
			}
			if (this.tileHighLighted.index > -1) {
				this.tiles[this.tileHighLighted.index].drawTileInfoDetailed();
			}
		} else if (CE.displayType == CE.DisplayType.INFO_BUILDING) {
			for (var i = 0; i < this.tileItems.length; i++) {
				this.tileItems[i].drawTileItemInfo();
			}
			if (this.tileHighLighted.index > -1) {
				this.tileItems[this.tileHighLighted.index].drawTileItemInfoDetailed();
			}
		}
	},
	drawTileItems: function () {
		for (var i = 0; i < this.tileItems.length; i++) {
			this.tileItems[i].drawItem();
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
			for (var i = 0; i < this.tileItems.length; i++) {
				if (this.tileItems[i].match(coord.col, coord.line)) {
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