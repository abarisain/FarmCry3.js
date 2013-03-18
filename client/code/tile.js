//gestion des textures
//je précise qu'ici il faudra que je fasse commencer grass à 0 et que j'inverse les 2 tiles
var texTileList = ['grass_0', 'grass_1', 'grass_2', 'grass_3', 'rock', 'leave', 'soil', 'water_0', 'water_1', 'water_2'];
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
			this.image = 4;//grass_1
		}
		else if (this.humidity < 0.8) {
			this.image = 5;//leave
		}
		else {
			this.image = 6;//water
		}

	},
	updateCoord: function () {
		this.x = (this.col + this.line) * (tileWidth / 2);
		this.y = (lineSize - this.line + this.col - 1) * (tileHeight / 2);
	},
	updateImageCoord: function () {
		this.imageLeft = this.x;// - this.centerX;
		this.imageTop = this.y;// - this.centerY;
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
		CrymeEngine.canvas.map.context.drawImage(texTiles[this.image].image, this.imageLeft, this.imageTop);
		if (showGraphicDebug) {
			if (showGraphicDebugMapAdvanced) {
				CrymeEngine.canvas.map.context.fillText('( ' + texTiles[this.image].name + ' : ' + this.line + ',' + this.col + ')', this.imageLeft, this.imageTop);
			}
			else {
				CrymeEngine.canvas.map.context.fillText('(' + this.line + ',' + this.col + ')', this.imageLeft, this.imageTop);
			}
		}
	}
};

function LoadTiles() {
	totalLoadingCount += texTileList.length;
	LoadTexTiles();
}

function LoadTexTiles() {
	for (var i = 0; i < texTileList.length; i++) {
		var tile = new Texture(i, texTileList[i], 'src/tiles/' + texTileList[i] + '.png');
		tile.image.onload = function () {
			currentLoadingCount++;
		};
		texTiles[i] = tile;
	}
}