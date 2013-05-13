MapItems = {};

function MapItem(sprite, col, line) {
	this.sprite = sprite;//à partir de maintenant il s'agit de l'image et plus de l'index
	this.col = col;
	this.line = line;
	this.x = 0;
	this.y = 0;
	this.imageLeft = 0;
	this.imageTop = 0;
	this.imageRight = 0;
	this.imageBottom = 0;
}

MapItem.prototype = {
	constructor: MapItem,
	mouseIntersect: function (x, y) {
		if (x > this.imageLeft && x < this.imageRight
			&& y > this.imageTop && y < this.imageBottom) {
			this.highlighted = true;
			return true;
		}
		return false;
	},
	moveToMousePosition: function (x, y) {
		var newCol = y / tileHeight - lineSize / 2 + x / tileWidth + 1;
		var newLine = x / tileWidth - y / tileHeight + lineSize / 2;
		this.move(Math.floor(newCol), Math.floor(newLine));
	},
	move: function (col, line) {
		this.col = col;
		this.line = line;
		this.updateCoord();
		this.updateImageCoord();
	},
	invalidate: function () {
		this.updateCoord();
		this.updateImageCoord();
	},
	updateCoord: function () {
		this.x = (this.getCol() + this.getLine()) * (tileWidth / 2);
		this.y = (lineSize - this.getLine() + this.getCol() - 1) * (tileHeight / 2);
	},
	updateImageCoord: function () {
		this.imageLeft = this.x - this.sprite.centerX;
		this.imageTop = this.y - this.sprite.centerY;
		this.imageRight = this.imageLeft + this.sprite.width;
		this.imageBottom = this.imageTop + this.sprite.height;
	},
	drawLoading: function (progress) {
	},
	draw: function (text) {
		CE.canvas.map.context.globalAlpha = 0.9;
		this.sprite.draw(this.imageLeft, this.imageTop);
		CE.canvas.map.context.globalAlpha = 1;
		if (Options.Debug.Graphic.enabled) {
			if (Options.Debug.Graphic.item) {
				CE.canvas.debug.context.globalAlpha = 0.5;
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillRect(this.imageLeft - 25, this.imageTop, 50, 1);
				CE.canvas.debug.context.fillRect(this.imageLeft, this.imageTop - 19, 1, 38);
				CE.canvas.debug.context.fillText(text, this.imageLeft, this.imageTop - 19);
				CE.canvas.debug.context.globalAlpha = 1;
			}
		}
	},
	translateCoord: function (col, line) {
		var x = (col + line) * (tileWidth / 2);
		var y = (lineSize - line + col - 1) * (tileHeight / 2);
		return {x: x, y: y};
	},
	getCol: function () {
		return this.col;
	},
	getLine: function () {
		return this.line;
	},
	load: function () {
		this.sprite.updateWidthHeight();
		this.updateCoord();
		this.updateImageCoord();
	},
	match: function (col, line) {
		if (col == this.col && line == this.line) {
			return true;
		} else {
			return false;
		}
	}
};