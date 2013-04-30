var Battle = {};

//classe utilisée pour tous les éléments qui se dessineront sur l'écran des combats
Battle.Element = function (sprite, x, y) {
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.scaleFactor = 1;
	this.rotation = 0;
}

Battle.Element.prototype = {
	constructor: Battle.Element,
	update: function () {
	},
	initContext: function () {
		//attention l'ordre est super important
		//translation puis échelle puis rotation
		this.initContextTranslation();
		this.initContextScale();
		this.initContextRotation();
	},
	initContextTranslation: function () {
		CE.canvas.animation.context.translate(this.x, this.y);
	},
	initContextScale: function () {
		CE.canvas.animation.context.scale(this.scaleFactor, this.scaleFactor);
	},
	initContextRotation: function () {
		CE.canvas.animation.context.rotate(this.rotation);
	},
	restoreContext: function () {
		//attention l'ordre est super important
		//rotation puis échelle puis translation
		this.restoreContextRotation();
		this.restoreContextScale();
		this.restoreContextTranslation();
	},
	restoreContextRotation: function () {
		CE.canvas.animation.context.rotate(-this.rotation);
	},
	restoreContextScale: function () {
		CE.canvas.animation.context.scale(1 / this.scaleFactor, 1 / this.scaleFactor);
	},
	restoreContextTranslation: function () {
		CE.canvas.animation.context.translate(-this.x, -this.y);
	},
	draw: function () {//cette fonction devras être override par les classes enfants
		this.initContext();
		this.drawBackground();
		this.drawElement();
		this.restoreContext();
	},
	drawElement: function () {
		CE.canvas.animation.context.drawImage(this.sprite.image, -this.sprite.centerX, -this.sprite.centerY);
	},


	drawBackground: function () {
	}
}

Battle.Button = function (sprite, x, y) {
	Battle.Element.call(this, sprite, x, y);
	this.background = SpritePack.Battle.Sprites.BUTTON;
}

Battle.Button.prototype = new Battle.Element();
Battle.Button.prototype.constructor = Battle.Button;
Battle.Button.prototype.update = function () {
	this.scaleFactor = CE.Battle.breathTransition.progress;
}
Battle.Button.prototype.drawBackground = function () {
	CE.canvas.animation.context.drawImage(this.background.image, -this.background.centerX, -this.background.centerY);
}

Battle.Avatar = function (x, y) {
	Battle.Element.call(this, SpritePack.Battle.Sprites.AVATAR, x, y);
	this.aura = SpritePack.Battle.Sprites.AURA;
}

Battle.Avatar.prototype = new Battle.Element();
Battle.Avatar.prototype.constructor = Battle.Avatar;
Battle.Avatar.prototype.update = function () {
	this.rotation += 2 * Math.PI / 180;
}
Battle.Avatar.prototype.draw = function () {
	this.initContext();
	this.drawBackground();
	this.drawElement();
	this.restoreContextScale();
	this.restoreContextTranslation();
}
Battle.Avatar.prototype.drawBackground = function () {
	this.initContextScale();
	CE.canvas.animation.context.globalAlpha = CE.Battle.breathTransition.progress - 0.6;
	CE.canvas.animation.context.drawImage(this.aura.image, -this.aura.centerX, -this.aura.centerY);
	this.restoreContextRotation();
	this.restoreContextRotation();
	CE.canvas.animation.context.drawImage(this.aura.image, -this.aura.centerX, -this.aura.centerY);
	this.initContextRotation();
	CE.canvas.animation.context.globalAlpha = 1;
	this.restoreContextScale();
}

Battle.BackgroundParticle = function (x, y) {
	Battle.Element.call(this, SpritePack.Battle.Sprites.LENGTH, x, y);
}

Battle.BackgroundParticle.prototype = new Battle.Element();
Battle.BackgroundParticle.prototype.constructor = Battle.Button;
Battle.BackgroundParticle.prototype.update = function () {
	this.x += 60;
	this.y += 46;
	if (this.x > 2000) {
		this.x -= 3000;
		this.y -= 2300;
	}
}