var Map = {
	tiles: [],
	buildings: [],
	crops: [],
	borders: [],
	init: function (data) {
		this.loadTiles((data.tiles));
	},
	loadTiles: function (tileData) {
		for (var i = 0; i < tileData.length; i++) {
			for (var j = 0; j < tileData[i].length; j++) {
				var tile = new Tile(tileData[i][j]);
				tiles.push(tile);
			}
		}
	},
	drawMapLoading: function (progress) {
		for (var i = 0; i < Math.min(tiles.length * progress / animationDuration, tiles.length); i++) {
			tiles[i].drawTileLoading(progress);
		}
	},
	drawMap: function () {
		for (var i = 0; i < tiles.length; i++) {
			tiles[i].drawTile();
			/*if (this.col == colSize - 1) {
			 context.drawImage(texBorders[1], (this.col) * tileWidth - (tileWidth) * this.line, (this.line - lineSize + 1) * tileHeight + (tileHeight) * this.col + 1);
			 }*/
			if (this.line == 0) {
				context.fillText('col : ' + this.col, this.col * tileWidth, this.line * tileHeight);
			}
			/*else if (this.line == lineSize - 1) {
			 context.drawImage(texBorders[0], this.col * tileWidth - (tileWidth) * (this.line), (this.line - lineSize + 1) * tileHeight + (tileHeight) * (this.col) + 1);
			 }*/
		}
	}
}