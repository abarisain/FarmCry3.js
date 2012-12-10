/*classe de dessin pour permettre de dessiner absolument tout et n'importe quel objet du moment qu'il est sur la map*/

//declaration des images a charger
var texBorderList = ['border_0', 'border_1', 'barrier_0', 'barrier_1', 'barrier_2', 'barrier_3'];
var texBorders = [];
var borders = [];

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
	drawReflection: function (imageReflectionList) {
		if (this.reflected) {
			context.drawImage(imageReflectionList[this.image], this.imageLeft, this.imageTop);
		}
	},
	drawItem: function (imageList) {
		context.drawImage(imageList[this.image], this.imageLeft, this.imageTop);
		context.fillStyle = "#fff";
		context.fillRect(this.imageLeft, this.imageTop.y, 10, 10);
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
		var tile = new Image();
		tile.src = 'src/borders/' + texBorderList[i] + '.png';
		tile.onload = function () {
			texBorders.push(this);
			currentLoadingCount++;
		};
	}
}