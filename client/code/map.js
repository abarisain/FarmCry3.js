var Map = {
	tiles: [],
	buildings: [],
	crops: [],
	borders: [],
	rect: { x: 1, y: 1, dx: 0, dy: 0 },
	init: function (data) {
		this.loadTiles((data.tiles));
		this.rect.dx = (tileWidth / 2) * (colSize + lineSize);
		this.rect.dy = (tileHeight / 2) * (colSize + lineSize);
	},
	loadTiles: function (tileData) {
		for (var i = tileData.length - 1; i >= 0; i--) {
			for (var j = 0; j < tileData[i].length; j++) {
				var tile = new Tile(tileData[i][j]);
				CrymeEngine.tiles.push(tile);
			}
		}
	},
	drawMapLoading: function (progress) {
		if (progress < animationDuration / 2) {
			for (var i = 0;
				 i < Math.min(CrymeEngine.tiles.length * progress / (animationDuration / 2), CrymeEngine.tiles.length); i++) {
				CrymeEngine.tiles[i].drawTileLoading(progress);
			}
		}
		else {
			for (var i = 0; i < CrymeEngine.tiles.length; i++) {
				CrymeEngine.tiles[i].drawTile();
			}
			for (var i = 0; i < CrymeEngine.buildings.length; i++) {
				CrymeEngine.buildings[i].drawItemLoading(progress - animationDuration / 2);
			}
			for (var i = 0; i < CrymeEngine.crops.length; i++) {
				CrymeEngine.crops[i].drawItemLoading(progress - animationDuration / 2);
			}
		}
	},
	changeTile: function (type, col, line) {
		for (var i = 0; i < CrymeEngine.tiles.length; i++) {
			if (CrymeEngine.tiles[i].col == col && CrymeEngine.tiles[i].line == line) {
				CrymeEngine.tiles[i].image = type;
				break;
			}
		}
	},
	drawMap: function () {
		for (var i = 0; i < CrymeEngine.tiles.length; i++) {
			CrymeEngine.tiles[i].drawTile();
		}
	}
};