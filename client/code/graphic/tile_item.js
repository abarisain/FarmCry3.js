MapItems.TileItems = {};

MapItems.TileItem = function (sprite, col, line) {
	if (sprite != null) {
		MapItem.call(this, sprite, col, line);
		this.highlighted = false;//affiche un halo autour de l'élement
		this.updateCoord();
		this.updateImageCoord();
		this.informations = new TileItemInfos(this.x, this.y, [
			new Diagram(Diagram.Color.YELLOW, this.x / 100),
			new Diagram(Diagram.Color.BLUE, this.y / 100)
		]);
	}
};

MapItems.TileItem.prototype = new MapItem();
MapItems.TileItem.prototype.constructor = MapItems.TileItem;
MapItems.TileItem.prototype.moveToMousePosition = function (x, y) {
	var newCol = y / tileHeight - lineSize / 2 + x / tileWidth + 1;
	var newLine = x / tileWidth - y / tileHeight + lineSize / 2;
	this.move(Math.floor(newCol), Math.floor(newLine));
};
MapItems.TileItem.prototype.move = function (col, line) {
	this.col = col;
	this.line = line;
	var messageData = {
		kind: CE.hud.chat.Kind.LOCAL,
		message: 'Moving ' + this.sprite.name + ' to : (' + col + ', ' + line + ')'
	}
	CE.hud.chat.append(messageData);
	this.updateCoord();
	this.updateImageCoord();
};

MapItems.TileItem.prototype.drawLoading = function (progress) {
	CE.canvas.map.context.drawImage(this.sprite.image, this.imageLeft,
		this.imageTop - this.col * tileHeight * (1 - progress / (animationDuration / 2)));
};
MapItems.TileItem.prototype.draw = function () {
	if (CE.displayType == CE.DisplayType.STANDARD) {
		CE.canvas.map.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
	} else {
		CE.canvas.map.context.drawImage(this.sprite.imageInfo, this.imageLeft, this.imageTop);
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
};
MapItems.TileItem.prototype.load = function () {
	this.informations.loadInformations();
};
MapItems.TileItem.prototype.drawInfo = function () {
	this.informations.drawInformations();
};
MapItems.TileItem.prototype.drawInfoDetailed = function () {
	this.informations.drawInformationDetailed();
};