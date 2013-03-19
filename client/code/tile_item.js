TileItems = {};

function TileItem(texture, col, line, centerX, centerY) {
	if (texture != undefined) {
		this.texture = texture;//à partir de maintenant il s'agit de l'image et plus de l'index
		this.texture.updateWidthHeight();
		this.col = col;
		this.line = line;
		this.x = 0;
		this.y = 0;
		this.highlighted = false;//affiche un halo autour de l'élement
		this.centerX = centerX;//attention ceci est la distance top-left au centre de la tile, réferentiel indispensable
		this.centerY = centerY;
		this.imageLeft = 0;
		this.imageTop = 0;
		this.imageRight = 0;
		this.imageBottom = 0;
		this.updateCoord();
		this.updateImageCoord();
	}
}

TileItem.prototype = {
	constructor: TileItem,
	mouseIntersect: function (x, y) {
		if (x > this.imageLeft && x < this.imageRight
			&& y > this.imageTop && y < this.imageBottom) {
			this.highlighted = true;
			return true;
		}
	},
	updateCoord: function () {
		this.x = (this.col + this.line) * (tileWidth / 2);
		this.y = (lineSize - this.line + this.col - 1) * (tileHeight / 2);
	},
	updateImageCoord: function () {
		this.imageLeft = this.x - this.centerX;
		this.imageTop = this.y - this.centerY;
		this.imageRight = this.imageLeft + this.texture.width;
		this.imageBottom = this.imageTop + this.texture.height;
	},
	drawItemLoading: function (progress) {
		CE.canvas.map.context.drawImage(this.texture.image, this.imageLeft,
			this.imageTop - this.col * tileHeight * (1 - progress / (animationDuration / 2)));
	},
	drawItem: function () {
		CE.canvas.map.context.drawImage(this.texture.image, this.imageLeft, this.imageTop);
		if (showGraphicDebug) {
			CE.canvas.debug.context.fillStyle = "rgb(29, 82, 161)";
			CE.canvas.debug.context.fillRect(this.x - graphicDebugDotSize / 2, this.y - graphicDebugDotSize / 10, graphicDebugDotSize, graphicDebugDotSize / 5);
			CE.canvas.debug.context.fillRect(this.x - graphicDebugDotSize / 10, this.y - graphicDebugDotSize / 2, graphicDebugDotSize / 5, graphicDebugDotSize);

			if (showGraphicDebugItem) {
				CE.canvas.debug.context.fillRect(this.imageLeft, this.imageTop, graphicDebugDotSize / 2, graphicDebugDotSize / 2);

				CE.canvas.debug.context.beginPath();
				CE.canvas.debug.context.moveTo(this.imageLeft, this.imageTop);
				CE.canvas.debug.context.lineTo(this.x, this.y);
				CE.canvas.debug.context.lineWidth = 2;
				CE.canvas.debug.context.strokeStyle = 'rgba(29, 82, 161, 1)';
				CE.canvas.debug.context.stroke();


				CE.canvas.debug.context.fillStyle = "rgba(29, 82, 161, 0.8)";
				CE.canvas.debug.context.fillRect(this.imageLeft + graphicDebugDotSize / 2, this.imageTop - 4, 100, 19);
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText(this.texture.name + ' : ' + this.line + ',' + this.col, this.imageLeft + graphicDebugDotSize / 2 + 5, this.imageTop + 10);
			}

			if (this.highlighted) {
				CE.canvas.debug.context.fillStyle = "rgba(29, 82, 161, 0.8)";
				CE.canvas.debug.context.fillRect(this.x + 5, this.y - 18, 100, 19);
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText('center : ' + Math.floor(this.centerX) + ',' + Math.floor(this.centerY), this.x + 10, this.y - 4);
			}
		}
		//ces informations sont indispensables
		if (this.highlighted) {
			CE.canvas.map.context.lineWidth = 2;
			CE.canvas.map.context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
			CE.canvas.map.context.strokeRect(this.imageLeft + 1, this.imageTop - 1, this.texture.width - 2, this.texture.height - 2);
		}
	}
};

function LoadTileItems() {
	LoadTexCrops();
	LoadTexBuildings();
}