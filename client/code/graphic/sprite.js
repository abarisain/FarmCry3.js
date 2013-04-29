function Sprite(name, centerX, centerY, textureInfo) {
	this.name = name;
	if (centerX === undefined || centerX === null) {
		this.centerX = 0;
		this.centerY = 0;
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
}

Sprite.prototype = {
	constructor: Sprite,
	load: function (folderPath) {
		this.image = new Image();
		this.image.src = folderPath + this.name + '.png';
		this.image.addEventListener('load', this.loadingEnded);
		if (this.textureInfo) {
			this.imageInfo = new Image();
			this.imageInfo.src = folderPath + this.name + '_white.png';
			this.imageInfo.addEventListener('load', this.loadingEnded);
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
	}
}