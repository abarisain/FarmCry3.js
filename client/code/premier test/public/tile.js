//gestion des textures
//je précise qu'ici il faudra que je fasse commencer grass à 0 et que j'inverse les 2 tiles
var texTileList = ['mountain', 'rock', 'soil', 'grass_2', 'grass_1', 'leave', 'water'];
var texTiles = [];

function Tile(data) {
	this.humidity = data.humidity;
	this.fertility = data.fertility;
	this.maturity = data.maturity;
	this.image = undefined;
	this.col = data.position.col;
	this.line = data.position.line;
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
		this.y = (lineSize - this.line + this.col) * (tileHeight / 2);
	},
	updateImageCoord: function () {
		this.imageLeft = this.x;// - this.centerX;
		this.imageTop = this.y;// - this.centerY;
	},
	drawTileLoading: function (progress) {
		context.drawImage(texTiles[this.image], this.imageLeft, this.imageTop - this.col * tileHeight * (1 - progress / animationDuration));
	},
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	drawTile: function () {
		context.drawImage(texTiles[this.image], this.imageLeft, this.imageTop);
	}
};

function LoadTiles() {
	totalLoadingCount += texTileList.length;
	LoadTexTiles();
}

function LoadTexTiles() {
	for (var i = 0; i < texTileList.length; i++) {
		var tile = new Texture(i, texTileList[i].image, 'src/tiles/' + texTileList[i] + '.png');
		tile.image.onload = function () {
			texTiles.push(this);
			currentLoadingCount++;
		};
	}
}