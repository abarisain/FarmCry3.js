//gestion des textures
var texTileList = ['grass_1', 'grass_2', 'leave', 'mountain', 'rock', 'soil', 'water'];//je précise qu'ici il faudra que je fasse commencer grass à 0
var texTiles = [];

function TileItem(col, line, humidity, fertility, centerX, centerY, reflected) {
	this.humidity = humidity;
	this.fertility = fertility;
	this.image = image;
	this.reflected = reflected;//pour savoir si les reflets sont supportés par cet item, en théorie c'est pour du debug
	this.col = col;
	this.line = line;
	this.x = 0;
	this.y = 0;
	this.centerX = centerX;//attention ceci est la distance top-left au centre de la tile, réferentiel indispensable
	this.centerY = centerY;
	this.imageLeft = 0;
	this.imageTop = 0;
	this.updateImageCoord();
}

TileItem.prototype = {
	//cherche l'image correspondante à l'humidité et la fertilité
	updateImage: function () {

	},
	updateCoord: function () {
		this.x = this.col * tileWidth - (tileWidth) * (this.line);
		this.y = (this.line - lineSize) * tileHeight + this.col * tileHeight;
	},
	updateImageCoord: function () {
		this.imageLeft = this.x - this.centerX;
		this.imageTop = this.y - this.centerY;
	},
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	drawTile: function (imageList) {
		context.drawImage(imageList[this.image], this.imageLeft, this.imageTop);
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