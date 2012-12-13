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
		for (var i = 0; i < tileData.length; i++) {
			for (var j = 0; j < tileData[i].length; j++) {
				var tile = new Tile(tileData[i][j]);
				CrymeEngine.tiles.push(tile);
			}
		}
	},
	drawMapLoading: function (progress) {
		for (var i = 0;
			 i < Math.min(CrymeEngine.tiles.length * progress / animationDuration, CrymeEngine.tiles.length); i++) {
			CrymeEngine.tiles[i].drawTileLoading(progress);
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
	//fonction qui dessine des grands triangles de chaque côté de la map pour masquer le ciel
	drawMask: function () {
		var margin = 500;
		var context = CrymeEngine.canvas.map.context;

		//bordure gauche
		context.beginPath();
		context.moveTo(this.rect.x + this.rect.dx / 2, this.rect.y + 2);
		context.lineTo(this.rect.x, this.rect.y + this.rect.dy / 2);
		context.lineTo(this.rect.x + this.rect.dx / 2, this.rect.y + this.rect.dy);
		context.lineTo(this.rect.x + this.rect.dx / 2, this.rect.y + this.rect.dy + margin);
		context.lineTo(this.rect.x - margin, this.rect.y + this.rect.dy + margin);
		context.lineTo(this.rect.x - margin, this.rect.y - margin);
		context.lineTo(this.rect.x + this.rect.dx / 2, this.rect.y - margin);
		context.lineTo(this.rect.x + this.rect.dx / 2, this.rect.y + 2);
		context.closePath();
		context.fillStyle = "rgb(10, 10, 10)";
		context.fill();

		//bordure droite
		context.beginPath();
		context.moveTo(this.rect.x + this.rect.dx / 2, this.rect.y + 2);
		context.lineTo(this.rect.x + this.rect.dx, this.rect.y + this.rect.dy / 2);
		context.lineTo(this.rect.x + this.rect.dx / 2, this.rect.y + this.rect.dy);
		context.lineTo(this.rect.x + this.rect.dx / 2, this.rect.y + this.rect.dy + margin);
		context.lineTo(this.rect.x + this.rect.dx + margin, this.rect.y + this.rect.dy + margin);
		context.lineTo(this.rect.x + this.rect.dx + margin, this.rect.y - margin);
		context.lineTo(this.rect.x + this.rect.dx / 2, this.rect.y - margin);
		context.lineTo(this.rect.x + this.rect.dx / 2, this.rect.y + 2);
		context.closePath();
		context.fillStyle = "rgb(10, 10, 10)";
		context.fill();
	},
	drawMap: function () {
		for (var i = 0; i < CrymeEngine.tiles.length; i++) {
			CrymeEngine.tiles[i].drawTile();
			/*if (this.col == colSize - 1) {
			 context.drawImage(texBorders[1], (this.col) * tileWidth - (tileWidth) * this.line, (this.line - lineSize + 1) * tileHeight + (tileHeight) * this.col + 1);
			 }*/
			if (this.line == 0) {
				CrymeEngine.canvas.map.context.fillText('col : ' + this.col, this.col * tileWidth, this.line * tileHeight);
			}
			/*else if (this.line == lineSize - 1) {
			 context.drawImage(texBorders[0], this.col * tileWidth - (tileWidth) * (this.line), (this.line - lineSize + 1) * tileHeight + (tileHeight) * (this.col) + 1);
			 }*/
		}
	}
};