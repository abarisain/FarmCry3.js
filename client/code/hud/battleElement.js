var BattleHud = {};

BattleHud.Element = function (background, sprite, x, y) {
	this.background = background;
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.scaleFactor = 1;
	this.rotationBackground = 0;
}

BattleHud.Element.prototype = {
	constructor: BattleHud.Element,
	update: function () {
	},
	draw: function () {
		CE.canvas.animation.context.translate(this.x, this.y);
		CE.canvas.animation.context.rotate(this.rotationBackground);
		CE.canvas.animation.context.drawImage(this.background.image, -this.background.centerX * this.scaleFactor,
			-this.background.centerY * this.scaleFactor, this.background.width * this.scaleFactor,
			this.background.height * this.scaleFactor);
		CE.canvas.animation.context.rotate(-this.rotationBackground);
		CE.canvas.animation.context.drawImage(this.sprite.image, -this.sprite.centerX * this.scaleFactor,
			-this.sprite.centerY * this.scaleFactor, this.sprite.width * this.scaleFactor,
			this.sprite.height * this.scaleFactor);
		CE.canvas.animation.context.translate(-this.x, -this.y);
	}
}

BattleHud.Button = function (sprite, x, y) {
	BattleHud.Element.call(this, SpritePack.Battle.Sprites.BUTTON, sprite, x, y);
}

BattleHud.Button.prototype = new BattleHud.Element();
BattleHud.Button.prototype.constructor = BattleHud.Button;
BattleHud.Button.prototype.update = function () {
	this.scaleFactor = CE.Battle.breathTransition.progress;
}

BattleHud.Avatar = function (x, y) {
	BattleHud.Element.call(this, SpritePack.Battle.Sprites.AURA, SpritePack.Battle.Sprites.AVATAR, x, y);
}

BattleHud.Avatar.prototype = new BattleHud.Element();
BattleHud.Avatar.prototype.constructor = BattleHud.Avatar;
BattleHud.Avatar.prototype.update = function () {
	this.rotationBackground += 3 * Math.PI / 180;
}