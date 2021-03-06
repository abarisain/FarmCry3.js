var Sprites = {};

function Sprite(name, centerX, centerY, textureInfo, extension, scale) {
	this.name = name;
	this.scale = scale || 1;
	if (centerX === undefined || centerX === null) {
		this.centerX = tileWidth / 2;
		this.centerY = tileHeight / 2;
	} else {
		this.centerX = centerX;
		this.centerY = centerY;
	}
	this.image = {};
	this.imageInfo = {};
	this.imageInfoCenterX = this.centerX;//moche
	this.imageInfoCenterY = this.centerY;
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
	copySprite: function (sprite) {
		this.name = sprite.name;
		this.scale = sprite.scale;
		this.centerX = sprite.centerX;
		this.centerY = sprite.centerY;
		this.image = sprite.image;
		this.imageInfo = sprite.imageInfo;
		this.textureInfo = sprite.textureInfo;
		this.width = sprite.width;
		this.height = sprite.height;
	},
	setImageInfo: function (sprite) {
		this.textureInfo = true;
		this.imageInfo = sprite.image;
		this.imageInfoCenterX = sprite.centerX;
		this.imageInfoCenterY = sprite.centerY;
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
				CE.canvas.map.context.drawImage(this.imageInfo, x - this.imageInfoCenterX, y - this.imageInfoCenterY);
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