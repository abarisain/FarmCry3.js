function Texture(index, name, imageSrc) {
	this.index = index;
	this.name = name;
	this.image = new Image();
	this.image.src = imageSrc;
	this.width = 0;
	this.height = 0;
}

Texture.prototype = {
	updateWidthHeight: function () {
		this.width = this.image.width;
		this.height = this.image.height;
	},
	loadingEnded: function () {
		currentLoadingCount++;
	}
};