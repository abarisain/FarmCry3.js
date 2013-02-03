function TileItem(image, col, line, centerX, centerY, reflected) {
	this.image = image;
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
	drawItem: function (imageList) {
		CE.canvas.map.context.drawImage(imageList[this.image].image, this.imageLeft, this.imageTop);
		CE.canvas.map.context.fillStyle = "#fff";
		CE.canvas.map.context.fillRect(this.imageLeft, this.imageTop.y, 10, 10);
	}
};

function LoadTileItems() {
	LoadTexCrops();
	LoadTexBuildings();
}