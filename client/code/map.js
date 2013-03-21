var Map = {
	tiles: [],
	player: null,//le character du joueur
	players: [],//tous les joueurs y compris le notre
	tileItems: [],//contient à la fois les buildings et les crops de la map
	rect: { x: 1, y: 1, dx: 0, dy: 0 },
	init: function (data) {
		this.loadTiles(data.tiles);
		this.rect.dx = (tileWidth / 2) * (colSize + lineSize);
		this.rect.dy = (tileHeight / 2) * (colSize + lineSize);
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
			for (var i = 0;
				 i < Math.min(this.tiles.length * progress / (animationDuration / 2), this.tiles.length); i++) {
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
	changeTile: function (type, col, line) {
		for (var i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i].col == col && this.tiles[i].line == line) {
				this.tiles[i].image = type;
				break;
			}
		}
	},
	drawMap: function () {
		for (var i = 0; i < this.tiles.length; i++) {
			this.tiles[i].drawTile();
		}
	},
	drawMapInfos: function () {
		if (CE.displayType == CE.DisplayType.INFO_MAP) {
			for (var i = 0; i < this.tiles.length; i++) {
				this.tiles[i].drawTileInfo();
			}
		}
	},
	drawTileItems: function () {
		for (var i = 0; i < this.tileItems.length; i++) {
			this.tileItems[i].drawItem();
		}
	},
	drawTileItemInfos: function () {
		if (CE.displayType == CE.DisplayType.INFO_BUILDING) {
			for (var i = 0; i < this.tileItems.length; i++) {
				this.tileItems[i].drawTileItemInfo();
			}
		}
	},
	coordinatesFromMousePosition: function (x, y) {
		var newCol = y / tileHeight - lineSize / 2 + x / tileWidth + 1;
		var newLine = x / tileWidth - y / tileHeight + lineSize / 2;
		return {
			col: Math.floor(newCol),
			line: Math.floor(newLine)
		};
	}
};