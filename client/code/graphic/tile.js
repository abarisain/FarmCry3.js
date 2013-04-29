function Tile(data) {
	this.humidity = data.humidity;
	this.fertility = data.fertility;
	this.maturity = data.maturity;
	this.sprite = {};
	this.col = data.position.col;
	this.line = data.position.line;
	this.alpha = 0;
	this.x = 0;
	this.y = 0;
	this.imageLeft = 0;
	this.imageTop = 0;
	this.informations = new TileItemInfos(this.x, this.y, [
		new Diagram(Diagram.Color.BLUE, this.humidity * 10),
		new Diagram(Diagram.Color.YELLOW, this.maturity * 10),
		new Diagram(Diagram.Color.GREEN, this.fertility * 10)
	]);
}

Tile.prototype = {
	constructor: Tile,
	//cherche le sprite correspondante à l'humidité et la fertilité
	updateImage: function () {
		if (this.humidity < 0.3) {
			if (this.fertility < 0.2) {
				this.sprite = SpritePack.Tiles.Sprites.ROCK;
			}
			else if (this.fertility < 0.5) {
				this.sprite = SpritePack.Tiles.Sprites.LEAVE;
			}
			else {
				this.sprite = SpritePack.Tiles.Sprites.SOIL;
			}
		}
		else if (this.humidity < 0.5) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_0;
		}
		else if (this.humidity < 0.55) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_1;
		}
		else if (this.humidity < 0.6) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_2;
		}
		else if (this.humidity < 0.7) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_3;
		}
		else if (this.humidity < 0.8) {
			this.sprite = SpritePack.Tiles.Sprites.WATER_0;
		}
		else if (this.humidity < 0.9) {
			this.sprite = SpritePack.Tiles.Sprites.WATER_1;
		}
		else {
			this.sprite = SpritePack.Tiles.Sprites.WATER_2;
		}
	},
	updateCoord: function () {
		this.x = (this.col + this.line) * (tileWidth / 2);
		this.y = (lineSize - this.line + this.col - 1) * (tileHeight / 2);
	},
	updateImageCoord: function () {
		this.imageLeft = this.x - this.sprite.centerX;
		this.imageTop = this.y - this.sprite.centerY;
	},
	drawTileLoading: function (progress) {
		if (this.alpha < 1) {
			this.alpha += 0.1;
		}
		CrymeEngine.canvas.map.context.globalAlpha = this.alpha;
		CrymeEngine.canvas.map.context.drawImage(this.sprite.image, this.imageLeft,
			this.imageTop - this.col * tileHeight * (1 - progress / (animationDuration / 2)));
	},
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	drawTile: function () {
		if (CE.displayType == CE.DisplayType.STANDARD) {
			CrymeEngine.canvas.map.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
		} else {
			CrymeEngine.canvas.map.context.drawImage(SpritePack.Tiles.Sprites.WHITE.image, this.imageLeft, this.imageTop);
		}
		if (Options.Debug.Graphic.enabled) {
			if (Options.Debug.Graphic.map) {
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillRect(this.x, this.y, Options.Debug.Graphic.dotSize / 2, Options.Debug.Graphic.dotSize / 2);
				CE.canvas.debug.context.fillRect(Math.ceil(this.x - tileWidth / 2), this.y, 5, 1);
				CE.canvas.debug.context.fillRect(Math.ceil(this.x - tileWidth / 2), this.y - 4, 1, 9);
				CE.canvas.debug.context.fillRect(Math.ceil(this.x + tileWidth / 2) - 1, this.y - 4, 1, 9);
				CE.canvas.debug.context.fillRect(Math.ceil(this.x + tileWidth / 2) - 5, this.y, 5, 1);
				CE.canvas.debug.context.fillStyle = "rgba(255, 255, 255, 0.5)";
				CE.canvas.debug.context.fillRect(this.x + Options.Debug.Graphic.dotSize / 2, this.y - 4, 100, 19);
				CE.canvas.debug.context.fillStyle = "#000";
				CE.canvas.debug.context.fillText(this.sprite.name + ' : ' + this.col + ',' + this.line, this.x + Options.Debug.Graphic.dotSize / 2 + 5, this.y + 10);
			}
			else {
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText('(' + this.col + ',' + this.line + ')', this.x, this.y);
			}
		}
	},
	drawTileInfo: function () {
		this.informations.drawInformations();
	},
	drawTileInfoDetailed: function () {
		this.informations.drawInformationDetailed();
	},
	loadTile: function () {
		this.updateImage();
		this.updateCoord();
		this.updateImageCoord();
		this.informations.loadInformations();
	},
	match: function (col, line) {
		if (col == this.col && line == this.line) {
			return true;
		} else {
			return false;
		}
	}
};