//gestion des textures
var texTileList = ['grass_1', 'grass_2', 'leave', 'mountain', 'rock', 'soil', 'water'];//je précise qu'ici il faudra que je fasse commencer grass à 0
var texTiles = [];

function TileItem(image, x, y, centerX, centerY, reflected) {
	this.image = image;
	this.reflected = reflected;//pour savoir si les reflets sont supportés par cet item, en théorie c'est pour du debug
	this.x = x;
	this.y = y;
	this.centerX = centerX;//attention ceci est la distance top-left au centre de la tile, réferentiel indispensable
	this.centerY = centerY;
	this.imageLeft = 0;
	this.imageTop = 0;
	this.updateImageCoord();
}

TileItem.prototype = {
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
		var tile = new Image();
		tile.src = 'src/tiles/' + texTileList[i] + '.png';
		tile.onload = function () {
			texTiles.push(this);
			currentLoadingCount++;
		};
	}
}