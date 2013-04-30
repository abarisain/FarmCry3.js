CrymeEngine.Battle = {
	background: {},
	elements: [],
	breathTransition: {},
	initialized: false,
	init: function () {
		this.background = SpritePack.Battle.Sprites.BACKGROUND;
		this.breathTransition = new Transition(0.9, 1.1, 30, function () {
		});
		this.breathTransition.loop = true;
		this.breathTransition.start(Transition.Type.FADE_IN);
		this.elements = [];
		this.elements.push(new BattleHud.Button(SpritePack.Battle.Sprites.BUTTON_AK47, 460, 500));//left
		this.elements.push(new BattleHud.Button(SpritePack.Battle.Sprites.BUTTON_JUMP, 960, 200));//top
		this.elements.push(new BattleHud.Button(SpritePack.Battle.Sprites.BUTTON_CROP, 1460, 500));//right
		this.elements.push(new BattleHud.Button(SpritePack.Battle.Sprites.BUTTON_DODGE, 960, 800));//bottom
		this.elements.push(new BattleHud.Avatar(960, 500));//avatar
		this.initialized = true;
	},
	launchBattle: function () {
		this.init();
	},
	update: function () {
		this.breathTransition.updateProgress();
		for (var i = 0; i < this.elements.length; i++) {
			this.elements[i].update();
		}
	},
	draw: function () {
		if (this.initialized) {
			this.update();
			CE.canvas.animation.context.drawImage(this.background.image, 0, 0);
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].draw();
			}
		}
	}
};