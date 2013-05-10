function Character(targetFarmer) {
	this.sprite = targetFarmer.constructor == PlayableFarmer ? SpritePack.Characters.Sprites.PLAYER : SpritePack.Characters.Sprites.FARMER;
	this.farmer = targetFarmer;

	this.sprite.updateWidthHeight();
	this.col = targetFarmer.position.col;
	this.line = targetFarmer.position.line;
	this.x = 0;
	this.y = 0;
	this.imageLeft = 0;
	this.imageTop = 0;
	this.imageRight = 0;
	this.imageBottom = 0;
	this.updateCoord();
	this.updateImageCoord();
}

Character.prototype = {
	constructor: Character,
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
		var messageData = {
			kind: CE.hud.chat.Kind.LOCAL,
			message: 'Moving ' + this.sprite.name + ' to : (' + col + ', ' + line + ')'
		}
		CE.hud.chat.append(messageData);
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
	drawLoading: function () {
	},
	draw: function () {
		if (CE.displayType == CE.DisplayType.STANDARD) {
			CE.canvas.map.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
		} else {
			CE.canvas.map.context.drawImage(this.sprite.imageInfo, this.imageLeft, this.imageTop);
		}
		if (Options.Debug.Graphic.enabled) {
			CE.canvas.debug.context.fillStyle = "rgb(29, 82, 161)";
			CE.canvas.debug.context.fillRect(this.x - Options.Debug.Graphic.dotSize / 2, this.y - Options.Debug.Graphic.dotSize / 10, Options.Debug.Graphic.dotSize, Options.Debug.Graphic.dotSize / 5);
			CE.canvas.debug.context.fillRect(this.x - Options.Debug.Graphic.dotSize / 10, this.y - Options.Debug.Graphic.dotSize / 2, Options.Debug.Graphic.dotSize / 5, Options.Debug.Graphic.dotSize);

			if (Options.Debug.Graphic.item) {
				CE.canvas.debug.context.fillRect(this.imageLeft, this.imageTop, Options.Debug.Graphic.dotSize / 2, Options.Debug.Graphic.dotSize / 2);

				CE.canvas.debug.context.beginPath();
				CE.canvas.debug.context.moveTo(this.imageLeft, this.imageTop);
				CE.canvas.debug.context.lineTo(this.x, this.y);
				CE.canvas.debug.context.lineWidth = 2;
				CE.canvas.debug.context.strokeStyle = 'rgba(29, 82, 161, 1)';
				CE.canvas.debug.context.stroke();


				CE.canvas.debug.context.fillStyle = "rgba(29, 82, 161, 0.8)";
				CE.canvas.debug.context.fillRect(this.imageLeft + Options.Debug.Graphic.dotSize / 2, this.imageTop - 4, 100, 19);
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText(this.sprite.name + ' : ' + this.col + ',' + this.line, this.imageLeft + Options.Debug.Graphic.dotSize / 2 + 5, this.imageTop + 10);
			}

			if (this.highlighted) {
				CE.canvas.debug.context.fillStyle = "rgba(29, 82, 161, 0.8)";
				CE.canvas.debug.context.fillRect(this.x + 5, this.y - 18, 140, 19);
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText('center : ' + Math.floor(this.sprite.centerX) + ',' + Math.floor(this.sprite.centerY), this.x + 10, this.y - 4);
			}
		}
		//ces informations sont indispensables
		if (this.highlighted) {
			CE.canvas.map.context.lineWidth = 2;
			CE.canvas.map.context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
			CE.canvas.map.context.strokeRect(this.imageLeft + 1, this.imageTop - 1, this.sprite.width - 2, this.sprite.height - 2);
		}
	},
	load: function () {
	},
	drawInfo: function () {
	},
	drawInfoDetailed: function () {
	},
	getCol: function () {
		return this.col;
	},
	getLine: function () {
		return this.line;
	},
	match: function (col, line) {
		if (col == this.col && line == this.line) {
			return true;
		} else {
			return false;
		}
	}
};