var texEffectList = [
	{image: 'cloud', centerX: 133, centerY: 275}
];
var texEffects = [];

function Effect(texture, textureInfo, col, line, centerX, centerY) {
	if (texture != undefined) {
		this.texture = texture;//à partir de maintenant il s'agit de l'image et plus de l'index
		this.texture.updateWidthHeight();
		this.textureInfo = textureInfo;
		this.col = col;
		this.line = line;
		this.x = 0;
		this.y = 0;
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

Effect.prototype = {
	constructor: TileItem,
	update: function () {

	},
	updateCoord: function () {
		this.x = (this.getCol() + this.getLine()) * (tileWidth / 2);
		this.y = (lineSize - this.getLine() + this.getCol() - 1) * (tileHeight / 2);
	},
	updateImageCoord: function () {
		this.imageLeft = this.x - this.centerX;
		this.imageTop = this.y - this.centerY;
		this.imageRight = this.imageLeft + this.texture.width;
		this.imageBottom = this.imageTop + this.texture.height;
	},
	drawItem: function () {
		if (CE.displayType == CE.DisplayType.STANDARD) {
			CE.canvas.map.context.drawImage(this.texture.image, this.imageLeft, this.imageTop);
		} else {
			CE.canvas.map.context.drawImage(this.textureInfo.image, this.imageLeft, this.imageTop);
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
				CE.canvas.debug.context.fillText(this.texture.name + ' : ' + this.col + ',' + this.line, this.imageLeft + Options.Debug.Graphic.dotSize / 2 + 5, this.imageTop + 10);
			}

			if (this.highlighted) {
				CE.canvas.debug.context.fillStyle = "rgba(29, 82, 161, 0.8)";
				CE.canvas.debug.context.fillRect(this.x + 5, this.y - 18, 140, 19);
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

function LoadTexEffects() {
	totalLoadingCount += texEffectList.length;
	for (var i = 0; i < texEffectList.length; i++) {
		var texture = new Texture(i, texEffectList[i].image, 'src/effects/' + texEffectList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texEffects[i] = texture;
	}
}