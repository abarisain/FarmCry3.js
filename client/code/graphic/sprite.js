var Sprites = {};

function Sprite(name, centerX, centerY, textureInfo, extension) {
	this.name = name;
	this.scale = 1;
	if (centerX === undefined || centerX === null) {
		this.centerX = tileWidth / 2;
		this.centerY = tileHeight / 2;
	} else {
		this.centerX = centerX;
		this.centerY = centerY;
	}
	this.image = {};
	this.imageInfo = {};
	if (textureInfo === undefined || textureInfo === null) {
		this.textureInfo = false;
	} else {
		this.textureInfo = textureInfo;
	}
	this.width = 0;
	this.height = 0;
	if (extension === undefined || extension === null) {
		this.extension = '.png';
	} else {
		this.extension = extension;
	}
}

Sprite.prototype = {
	constructor: Sprite,
	load: function (folderPath) {
		var sprite = this;
		this.image = new Image();
		this.image.src = folderPath + this.name + this.extension;
		this.image.addEventListener('load', function () {
			sprite.loadingEnded();
			sprite.updateWidthHeight();
		});
		if (this.textureInfo) {
			this.imageInfo = new Image();
			this.imageInfo.src = folderPath + this.name + '_white' + this.extension;
			this.imageInfo.addEventListener('load', function () {
				sprite.loadingEnded();
				sprite.updateWidthHeight();

			});
		} else {
			this.imageInfo = this.image;
		}
	},
	updateWidthHeight: function () {
		this.width = this.image.width;
		this.height = this.image.height;
	},
	loadingEnded: function () {
		currentLoadingCount++;
	},
	//on dessine toujours un sprite sur la map, sauf exception
	draw: function (x, y) {
		if (this.scale == 1) {
			if (CrymeEngine.displayType == CrymeEngine.DisplayType.STANDARD) {
				CE.canvas.map.context.drawImage(this.image, x - this.centerX, y - this.centerY);
			} else {
				CE.canvas.map.context.drawImage(this.imageInfo, x - this.centerX, y - this.centerY);
			}
		} else {
			if (CrymeEngine.displayType == CrymeEngine.DisplayType.STANDARD) {
				CE.canvas.map.context.drawImage(this.image, x - this.centerX * this.scale, y - this.centerY * this.scale, this.width * this.scale, this.height * this.scale);
			} else {
				CE.canvas.map.context.drawImage(this.imageInfo, x - this.centerX * this.scale, y - this.centerY * this.scale, this.width * this.scale, this.height * this.scale);
			}
		}
	},
	drawOnAnimation: function (x, y) {
		if (this.scale == 1) {
			if (CrymeEngine.displayType == CrymeEngine.DisplayType.STANDARD) {
				CE.canvas.animation.context.drawImage(this.image, x - this.centerX, y - this.centerY);
			} else {
				CE.canvas.animation.context.drawImage(this.imageInfo, x - this.centerX, y - this.centerY);
			}
		} else {
			if (CrymeEngine.displayType == CrymeEngine.DisplayType.STANDARD) {
				CE.canvas.animation.context.drawImage(this.image, x - this.centerX * this.scale, y - this.centerY * this.scale, this.width * this.scale, this.height * this.scale);
			} else {
				CE.canvas.animation.context.drawImage(this.imageInfo, x - this.centerX * this.scale, y - this.centerY * this.scale, this.width * this.scale, this.height * this.scale);
			}
		}
	}
}