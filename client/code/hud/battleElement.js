var BattleHud = {};

BattleHud.Element = function (background, sprite, x, y) {
	this.background = background;
	this.sprite = sprite;
	this.x = x;
	this.y = y;
}

BattleHud.Element.prototype = {
	constructor: BattleHud.Element,
	draw: function () {
		CE.canvas.animation.context.drawImage(this.background.image, this.x - this.background.centerX, this.y - this.background.centerY);
		CE.canvas.animation.context.drawImage(this.sprite.image, this.x - this.sprite.centerX, this.y - this.sprite.centerY);
	}
}

BattleHud.Button = function (sprite, x, y) {
	BattleHud.Element.call(this, SpritePack.Battle.Sprites.BUTTON, sprite, x, y);
}

BattleHud.Button.prototype = new BattleHud.Element();
BattleHud.Button.prototype.constructor = BattleHud.Button;