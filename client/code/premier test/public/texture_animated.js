function TextureAnimated(index, imageSrc) {
	//this.index = index;
	this.index = index;
	this.image = new Image();
	this.image.src = imageSrc;
	this.width = 0;
	this.height = 0;
	this.frameCount = texAnimatedList[index].frameCount;
	this.frameWidth = 0;
	this.frameTimer = texAnimatedList[index].frameTimer;
	this.currentFrame = 0;
	this.initAnimation();
}

TextureAnimated.prototype = {
	initAnimation: function () {
		this.frameWidth = texAnimatedList[this.index].frameWidth;
		this.width = this.frameWidth * this.frameCount;
		this.height = texAnimatedList[this.index].frameHeight;

	},
	drawAnimation: function (x, y) {
		this.currentFrame = (this.currentFrame + 1 / this.frameTimer) % this.frameCount;
		contextAnimation.drawImage(texAnimations[this.index], Math.floor(this.currentFrame) * this.frameWidth, 0, this.frameWidth, this.height, x, y, this.frameWidth, this.height);
	}
};