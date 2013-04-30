var Battle = {
	background: {},
	elements: [],
	init: function () {
		this.background = SpritePack.Battle.Sprites.BACKGROUND;
		this.elements = [];
		this.elements.push(new BattleHud.Button(SpritePack.Battle.Sprites.BUTTON_AK47, 460, 500));//left
		this.elements.push(new BattleHud.Button(SpritePack.Battle.Sprites.BUTTON_JUMP, 960, 200));//top
		this.elements.push(new BattleHud.Button(SpritePack.Battle.Sprites.BUTTON_CROP, 1460, 500));//right
		this.elements.push(new BattleHud.Button(SpritePack.Battle.Sprites.BUTTON_DODGE, 960, 800));//bottom
		this.elements.push(new BattleHud.Element(SpritePack.Battle.Sprites.AURA, SpritePack.Battle.Sprites.AVATAR, 960, 500));//avatar
	},
	launchBattle: function () {
		this.init();
	},
	draw: function () {
		CE.canvas.animation.context.drawImage(this.background.image, 0, 0);
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].draw();
		}
	}
};