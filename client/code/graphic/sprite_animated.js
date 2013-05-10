Sprites.Animation = function (name, centerX, centerY, frameCount, frameTimer, textureInfo, extension) {
	Sprite.call(this, name, centerX, centerY, textureInfo, extension);
	this.frameCount = frameCount;
	this.frameWidth = 0;
	this.frameTimer = frameTimer;
	this.frameSpeed = frameCount / frameTimer;
	this.currentFrame = 0;
}

Sprites.Animation.prototype = new Sprite();
Sprites.Animation.prototype.constructor = Sprites.Animation;
Sprites.Animation.prototype.loadingEnded = function () {
	currentLoadingCount++;
	this.updateWidthHeight();
	this.frameWidth = this.width / this.frameCount;
}
Sprites.Animation.prototype.draw = function (x, y) {
	this.currentFrame = (this.currentFrame + this.frameSpeed) % this.frameCount;
	CE.canvas.map.context.drawImage(this.image, Math.floor(this.currentFrame) * this.frameWidth, 0, this.frameWidth, this.height, x - this.centerX, y - this.centerY, this.frameWidth, this.height);
};
