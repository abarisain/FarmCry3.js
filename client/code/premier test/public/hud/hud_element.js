function HudElement(image, x, y, visible) {
	this.image = image;
	this.x = x;
	this.y = y;
	this.visible = visible;
}

HudElement.prototype = {
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	drawItem: function (imageList) {
		if (this.visible) {
			contextHud.drawImage(imageList[this.image], this.x, this.y);
		}
	}
};