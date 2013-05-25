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
//on dessine toujours une animation sur le canvas animation
Sprites.Animation.prototype.draw = function (x, y) {
	//TODO dupliquer ces paramètres de la texture, car actuellement je modifie toutes les tornades ici
	this.currentFrame = (this.currentFrame + this.frameSpeed) % this.frameCount;
	if (this.scale == 1) {
		CE.canvas.animation.context.drawImage(this.image, Math.floor(this.currentFrame) * this.frameWidth, 0,
			this.frameWidth, this.height, x - this.centerX, y - this.centerY, this.frameWidth, this.height);
	} else {
		CE.canvas.animation.context.drawImage(this.image, Math.floor(this.currentFrame) * this.frameWidth, 0,
			this.frameWidth, this.height, x - this.centerX * this.scale, y - this.centerY * this.scale, this.frameWidth * this.scale, this.height * this.scale);
	}
};
