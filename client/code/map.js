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
    addPlayer: function(player) {
        this.removePlayer(player.nickname);
        var tmpPlayer = new TileItems.Character(player);
        this.players.push(tmpPlayer);
        if(player.constructor == PlayableFarmer)
            this.player = tmpPlayer;
    },
    removePlayer: function(nickname) {
        if(this.player != null && nickname == this.player.farmer.nickname)
            return;
        var playerCount = this.players.length;
        for (var i = playerCount - 1; i >= 0; i--) {
            if (this.players[i].farmer.nickname == nickname) {
                this.players.removeItemAtIndex(i);
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
    }
};