//gestion des textures
//je précise qu'ici il faudra que je fasse commencer grass à 0 et que j'inverse les 2 tiles
var texTileList = ['grass_0', 'grass_1', 'grass_2', 'grass_3', 'rock', 'leave', 'soil', 'water_0', 'water_1', 'water_2', 'white'];
var texTiles = [];

function Tile(data) {
	this.humidity = data.humidity;
	this.fertility = data.fertility;
	this.maturity = data.maturity;
	this.image = undefined;
	this.col = data.position.col;
	this.line = data.position.line;
	this.alpha = 0;
	this.x = 0;
	this.y = 0;
	this.centerX = tileWidth / 2;//attention ceci est la distance top-left au centre de la tile, réferentiel indispensable
	this.centerY = tileHeight / 2;
	this.imageLeft = 0;
	this.imageTop = 0;
	this.updateImage();
	this.updateCoord();
	this.updateImageCoord();
	this.informations = new TileItemInfos(this.x, this.y, [
		new Diagram(Diagram.Color.BLUE, this.humidity * 10),
		new Diagram(Diagram.Color.YELLOW, this.maturity * 10),
		new Diagram(Diagram.Color.GREEN, this.fertility * 10)
	]);
}

Tile.prototype = {
	constructor: Tile,
	//cherche l'image correspondante à l'humidité et la fertilité
	updateImage: function () {
		if (this.humidity < 0.3) {
			if (this.fertility < 0.2) {
				this.image = 0;//mountain
			}
			else if (this.fertility < 0.5) {
				this.image = 1;//rock
			}
			else {
				this.image = 2;//soil
			}
		}
		else if (this.humidity < 0.4) {
			this.image = 3;//grass_2
		}
		else if (this.humidity < 0.6) {
			this.image = 0;//grass_1
		}
		else if (this.humidity < 0.8) {
			this.image = 8;//leave
		}
		else {
			this.image = 9;//water
		}
	},
	updateCoord: function () {
		this.x = (this.col + this.line) * (tileWidth / 2);
		this.y = (lineSize - this.line + this.col - 1) * (tileHeight / 2);
	},
	updateImageCoord: function () {
		this.imageLeft = this.x - this.centerX;
		this.imageTop = this.y - this.centerY;
	},
	drawTileLoading: function (progress) {
		if (this.alpha < 1) {
			this.alpha += 0.1;
		}
		CrymeEngine.canvas.map.context.globalAlpha = this.alpha;
		CrymeEngine.canvas.map.context.drawImage(texTiles[this.image].image, this.imageLeft,
			this.imageTop - this.col * tileHeight * (1 - progress / (animationDuration / 2)));
	},
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	drawTile: function () {
		if (CE.displayType == CE.DisplayType.STANDARD) {
			CrymeEngine.canvas.map.context.drawImage(texTiles[this.image].image, this.imageLeft, this.imageTop);
		} else {
			CrymeEngine.canvas.map.context.drawImage(texTiles[10].image, this.imageLeft, this.imageTop);
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
				CE.canvas.debug.context.fillText(texTiles[this.image].name + ' : ' + this.col + ',' + this.line, this.x + Options.Debug.Graphic.dotSize / 2 + 5, this.y + 10);
			}
			else {
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText('(' + this.col + ',' + this.line + ')', this.x, this.y);
			}
		}
	},
	drawTileInfo: function () {
		this.informations.drawInformations();
	}
};

function LoadTexTiles() {
	totalLoadingCount += texTileList.length;
	for (var i = 0; i < texTileList.length; i++) {
		var tile = new Texture(i, texTileList[i], 'src/tiles/' + texTileList[i] + '.png');
		tile.image.onload = function () {
			currentLoadingCount++;
		};
		texTiles[i] = tile;
	}
}