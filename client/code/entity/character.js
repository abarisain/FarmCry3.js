MapItems.Character = function (targetFarmer) {
	MapItem.call(this, SpritePack.Characters.Sprites.FARMER, targetFarmer.position.col, targetFarmer.position.line);
	this.isPlayer = targetFarmer.constructor == LogicItems.PlayableFarmer;
	this.farmer = targetFarmer;
	this.updateCoord();
	this.updateImageCoord();
	this.movement = { sprite: SpritePack.Characters.Sprites.ANIM_TOP_LEFT, finalPosition: {x: 0, y: 0}, startPosition: {x: 0, y: 0}};
	this.transitions = {
		movement: new Transition(0, 1, 60, function () {
		}),
		waters: new Transition(0, 1, 119, function () {
		}),//la durée doit correspondre à la durée de l'animation pour éviter les boucles
		fertilizes: new Transition(0, 1, 59, function () {
		})//la durée doit correspondre à la durée de l'animation pour éviter les boucles
	}
};

MapItems.Character.prototype = new MapItem();
MapItems.Character.prototype.constructor = MapItems.Character;

MapItems.Character.prototype.waters = function () {
	if (!this.transitions.fertilizes.started) {
		this.transitions.waters.start(Transition.Type.FADE_IN, true);
	}
}

MapItems.Character.prototype.fertilizes = function () {
	if (!this.transitions.waters.started) {
		this.transitions.fertilizes.start(Transition.Type.FADE_IN, true);
	}
}

MapItems.Character.prototype.move = function (col, line) {
	var moved = true;
	if (col > this.col) {
		this.movement.sprite = SpritePack.Characters.Sprites.ANIM_TOP_LEFT;
		this.col++;
	} else if (col < this.col) {
		this.movement.sprite = SpritePack.Characters.Sprites.ANIM_BOTTOM_RIGHT;
		this.col--;
	} else if (line > this.line) {
		this.movement.sprite = SpritePack.Characters.Sprites.ANIM_BOTTOM_LEFT;
		this.line++;
	} else if (line < this.line) {
		this.movement.sprite = SpritePack.Characters.Sprites.ANIM_TOP_RIGHT;
		this.line--;
	} else {
		moved = false;
	}
	if (moved) {
		this.movement.finalPosition = this.translateCoord(this.col, this.line);
		this.movement.startPosition.x = this.x;
		this.movement.startPosition.y = this.y;
		if (this.isPlayer) {
			CrymeEngine.camera.centerCamera(this.movement.finalPosition.x, this.movement.finalPosition.y);
		}
		this.transitions.movement.start(Transition.Type.FADE_IN, true);
	}
};

MapItems.Character.prototype.draw = function () {
	if (this.visible) {
		if (this.transitions.movement.started) {
			this.transitions.movement.updateProgress();
			this.x = this.movement.startPosition.x + (this.movement.finalPosition.x - this.movement.startPosition.x) * this.transitions.movement.progress;
			this.y = this.movement.startPosition.y + (this.movement.finalPosition.y - this.movement.startPosition.y) * this.transitions.movement.progress;
			this.updateImageCoord();
			//je suis obligé d'attendre l'update de coordonnée en cas d'animation
			SpritePack.Characters.Sprites.SHADOW.drawOnAnimation(this.x, this.y);
			if (this.isPlayer) {
				SpritePack.Characters.Sprites.ANIM_AURA.draw(this.x, this.y);
			}
			this.movement.sprite.draw(this.x, this.y);
		} else {
			SpritePack.Characters.Sprites.SHADOW.drawOnAnimation(this.x, this.y);
			if (this.isPlayer) {
				SpritePack.Characters.Sprites.ANIM_AURA.draw(this.x, this.y);
			}
			if (this.transitions.waters.started) {
				this.transitions.waters.updateProgress();
				SpritePack.Characters.Sprites.ANIM_WATERS.draw(this.x, this.y);
			} else if (this.transitions.fertilizes.started) {
				this.transitions.fertilizes.updateProgress();
				SpritePack.Characters.Sprites.ANIM_FERTLIZES.draw(this.x, this.y);
			} else {
				CE.canvas.animation.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
			}
		}
		if (Options.Debug.Graphic.enabled) {
			CE.canvas.debug.context.fillStyle = "rgb(29, 82, 161)";
			CE.canvas.debug.context.fillRect(this.x - Options.Debug.Graphic.dotSize / 2, this.y - Options.Debug.Graphic.dotSize / 10, Options.Debug.Graphic.dotSize, Options.Debug.Graphic.dotSize / 5);
			CE.canvas.debug.context.fillRect(this.x - Options.Debug.Graphic.dotSize / 10, this.y - Options.Debug.Graphic.dotSize / 2, Options.Debug.Graphic.dotSize / 5, Options.Debug.Graphic.dotSize);

			if (Options.Debug.Graphic.item) {
				CE.canvas.debug.context.fillRect(this.imageLeft, this.imageTop, Options.Debug.Graphic.dotSize / 2, Options.Debug.Graphic.dotSize / 2);

				CE.canvas.debug.context.beginPath();
				CE.canvas.debug.context.moveTo(this.imageLeft, this.imageTop);
				CE.canvas.debug.context.lineTo(this.x, this.y);
				CE.canvas.debug.context.lineWidth = 2;
				CE.canvas.debug.context.strokeStyle = 'rgba(29, 82, 161, 1)';
				CE.canvas.debug.context.stroke();


				CE.canvas.debug.context.fillStyle = "rgba(29, 82, 161, 0.8)";
				CE.canvas.debug.context.fillRect(this.imageLeft + Options.Debug.Graphic.dotSize / 2, this.imageTop - 4, 100, 19);
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText(this.sprite.name + ' : ' + this.col + ',' + this.line, this.imageLeft + Options.Debug.Graphic.dotSize / 2 + 5, this.imageTop + 10);
			}

			if (this.highlighted) {
				CE.canvas.debug.context.fillStyle = "rgba(29, 82, 161, 0.8)";
				CE.canvas.debug.context.fillRect(this.x + 5, this.y - 18, 140, 19);
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText('center : ' + Math.floor(this.sprite.centerX) + ',' + Math.floor(this.sprite.centerY), this.x + 10, this.y - 4);
			}
		}
		//ces informations sont indispensables
		if (this.highlighted) {
			CE.canvas.map.context.lineWidth = 2;
			CE.canvas.map.context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
			CE.canvas.map.context.strokeRect(this.imageLeft + 1, this.imageTop - 1, this.sprite.width - 2, this.sprite.height - 2);
		}
	}
};