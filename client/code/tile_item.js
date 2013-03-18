function TileItem(image, col, line, centerX, centerY) {
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
	drawItemLoading: function (imageList, progress) {
		CE.canvas.map.context.drawImage(imageList[this.image].image, this.imageLeft,
			this.imageTop - this.col * tileHeight * (1 - progress / (animationDuration / 2)));
	},
	drawItem: function (imageList) {
		CE.canvas.map.context.drawImage(imageList[this.image].image, this.imageLeft, this.imageTop);
		CE.canvas.map.context.fillStyle = "#fff";
		CE.canvas.map.context.fillRect(this.imageLeft, this.imageTop, 10, 10);
		CE.canvas.map.context.fillStyle = "#ff0007";
		CE.canvas.map.context.fillRect(this.x - 5, this.y - 1, 10, 2);
		CE.canvas.map.context.fillRect(this.x - 1, this.y - 5, 2, 10);
	}
};

function LoadTileItems() {
	LoadTexCrops();
	LoadTexBuildings();
}