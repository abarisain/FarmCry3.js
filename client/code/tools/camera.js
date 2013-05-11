function Camera() {
	this.position = {x: -1000, y: -1000};
	this.movement = { finalPosition: { x: 0, y: 0}, startPosition: { x: 0, y: 0}};
	this.movementTransition = new Transition(0, 1, 80, function () {
	});
	this.movementTransition.smoothing = true;
}

Camera.prototype = {
	constructor: Camera,
	updateCamera: function () {
		if (this.movementTransition.started) {
			this.movementTransition.updateProgress();
			this.position.x = this.movement.startPosition.x + (this.movement.finalPosition.x - this.movement.startPosition.x) * this.movementTransition.progress;
			this.position.y = this.movement.startPosition.y + (this.movement.finalPosition.y - this.movement.startPosition.y) * this.movementTransition.progress;
			CrymeEngine.mapInvalidated = true;
		}
	},
	//delta x et y de deplacement de la caméra (utilisé pour le drag de caméra)
	moveCamera: function (dx, dy) {
		this.position.x += dx;
		if (this.position.x > -Map.rect.x) {
			this.position.x = -Map.rect.x;
		}
		if (this.position.x < -(Map.rect.x + Map.rect.dx - canvasWidth)) {
			this.position.x = -(Map.rect.x + Map.rect.dx - canvasWidth);
		}

		this.position.y += dy;
		if (this.position.y > -Map.rect.y) {
			this.position.y = -Map.rect.y;
		}
		if (this.position.y < -(Map.rect.y + Map.rect.dy - canvasHeight)) {
			this.position.y = -(Map.rect.y + Map.rect.dy - canvasHeight);
		}
		CrymeEngine.mapInvalidated = true;
	},
	//x et y sont les coordonnées absolue de déplacement de la caméra
	//et représentent le point autour duquel centrer la caméra
	centerCamera: function (x, y) {
		this.movement.startPosition.x = this.position.x;
		this.movement.startPosition.y = this.position.y;
		this.movement.finalPosition.x = -x + canvasWidth / 2;
		if (this.movement.finalPosition.x > -Map.rect.x) {
			this.movement.finalPosition.x = -Map.rect.x;
		}
		if (this.movement.finalPosition.x < -(Map.rect.x + Map.rect.dx - canvasWidth)) {
			this.movement.finalPosition.x = -(Map.rect.x + Map.rect.dx - canvasWidth);
		}

		this.movement.finalPosition.y = -y + canvasHeight / 2;
		if (this.movement.finalPosition.y > -Map.rect.y) {
			this.movement.finalPosition.y = -Map.rect.y;
		}
		if (this.movement.finalPosition.y < -(Map.rect.y + Map.rect.dy - canvasHeight)) {
			this.movement.finalPosition.y = -(Map.rect.y + Map.rect.dy - canvasHeight);
		}
		this.movementTransition.start(Transition.Type.FADE_IN, true);
	}
};