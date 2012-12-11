function Notification(texte, type) {
	this.texte = texte;
	this.hudElement = new HudElement(2, canvasWidth - 320, 200, true);
	this.type = type;
	this.dead = false;
}

Notification.prototype = {
	showNotification: function () {

	},
	updateNotification: function (progress) {

	}
};