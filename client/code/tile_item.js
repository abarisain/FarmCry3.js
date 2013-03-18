function TileItem(index, col, line, centerX, centerY) {
	this.image = index;
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
		if (showGraphicDebug) {
			CE.canvas.map.context.fillStyle = "#ff8a00";
			CE.canvas.map.context.fillRect(this.imageLeft, this.imageTop, graphicDebugDotSize / 2, graphicDebugDotSize / 2);

			CE.canvas.map.context.fillRect(this.x - graphicDebugDotSize / 2, this.y - graphicDebugDotSize / 10, graphicDebugDotSize, graphicDebugDotSize / 5);
			CE.canvas.map.context.fillRect(this.x - graphicDebugDotSize / 10, this.y - graphicDebugDotSize / 2, graphicDebugDotSize / 5, graphicDebugDotSize);
			if (showGraphicDebugAdvanced) {
				CE.canvas.map.context.fillStyle = "rgba(255, 138, 0, 0.5)";
				CE.canvas.map.context.fillRect(this.imageLeft + graphicDebugDotSize / 2, this.imageTop - 4, 100, 19);
				CE.canvas.map.context.fillStyle = "#000";
				CE.canvas.map.context.fillText('(' + imageList[this.image].name + ' : ' + this.line + ',' + this.col + ')', this.imageLeft + graphicDebugDotSize / 2 + 5, this.imageTop + 10);
			}
		}
	}
};

function LoadTileItems() {
	LoadTexCrops();
	LoadTexBuildings();
}