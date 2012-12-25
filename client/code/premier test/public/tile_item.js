//declaration des images a charger
var texBorderList = ['border_0', 'border_1', 'barrier_0', 'barrier_1', 'barrier_2', 'barrier_3'];
var texBorders = [];
//var borders = [];

function TileItem(image, col, line, centerX, centerY, reflected) {
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
	this.updateCoord();
	this.updateImageCoord();
}

TileItem.prototype = {
	constructor: TileItem,
	updateCoord: function () {
		this.x = (this.col + this.line) * (tileWidth / 2);
		this.y = (lineSize - this.line + this.col - 1) * (tileHeight / 2);
	},
	updateImageCoord: function () {
		this.imageLeft = this.x - this.centerX;
		this.imageTop = this.y - this.centerY;
	},
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	//par contre il faudra modifier l'utilisation de la liste des textures parce que tel quel c'est tout pourris
	drawReflection: function (imageReflectionList) {
		if (this.reflected) {
			CE.canvas.map.context.drawImage(imageReflectionList[this.image].image, this.imageLeft, this.y + tileHeight / 2);
		}
	},
	drawItem: function (imageList) {
		CE.canvas.map.context.drawImage(imageList[this.image].image, this.imageLeft, this.imageTop);
		CE.canvas.map.context.fillStyle = "#fff";
		CE.canvas.map.context.fillRect(this.imageLeft, this.imageTop.y, 10, 10);
	}
};

function LoadTileItems() {
	LoadTexCrops();
	LoadTexBorders();
	LoadTexBuildings();
}

function LoadTexBorders() {
	totalLoadingCount += texBorderList.length;
	for (var i = 0; i < texBorderList.length; i++) {
		var texture = new Texture(i, texBorderList[i], 'src/borders/' + texBorderList[i] + '.png');
		texture.image.onload = function () {
			currentLoadingCount++;
		};
		texBorders[i] = texture;
	}
}