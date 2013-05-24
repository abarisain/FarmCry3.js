MapItems.Tile = function (data) {
	MapItem.call(this, null, data.position.col, data.position.line);
	this.humidity = data.humidity;
	this.fertility = data.fertility;
	this.maturity = data.maturity;
	this.cropType = data.crop;//version du serveur
	this.buildingType = data.building;//version du serveur
	this.sprite = {};
	this.alpha = 0;
	this.infoColor = new ColorHelper(255, 255, 255);
	this.updateCoord();
	this.informations = new MapItems.TileItemInfos(this.x, this.y, [
		new Diagram(Diagram.Color.GREEN, 'Fertility', this.fertility * 10)
	]);
};

MapItems.Tile.prototype = new MapItem();
MapItems.Tile.prototype.constructor = MapItems.Tile;
MapItems.Tile.prototype.updateImage = function () {
	if (this.humidity < 0.3) {
		if (this.fertility < 0.2) {
			this.sprite = SpritePack.Tiles.Sprites.ROCK_0;
		}
		else if (this.fertility < 0.5) {
			this.sprite = SpritePack.Tiles.Sprites.LEAVE;
		}
		else {
			this.sprite = SpritePack.Tiles.Sprites.SOIL;
		}
	}
	else if (this.humidity < 0.5) {
		this.sprite = SpritePack.Tiles.Sprites.GRASS_1;
	}
	else if (this.humidity < 0.55) {
		this.sprite = SpritePack.Tiles.Sprites.GRASS_0;
	}
	else if (this.humidity < 0.6) {
		this.sprite = SpritePack.Tiles.Sprites.GRASS_2;
	}
	else if (this.humidity < 0.7) {
		this.sprite = SpritePack.Tiles.Sprites.GRASS_3;
	}
	else if (this.humidity < 0.8) {
		this.sprite = SpritePack.Tiles.Sprites.WATER_0;
	}
	else if (this.humidity < 0.9) {
		this.sprite = SpritePack.Tiles.Sprites.WATER_1;
	}
	else {
		this.sprite = SpritePack.Tiles.Sprites.WATER_2;
	}
	this.updateInfoColor();
};
MapItems.Tile.prototype.updateInfoColor = function () {
	this.infoColor.createColorFactor(ColorHelper.Templates.WHITE, ColorHelper.Templates.ORANGE, this.humidity);
};
MapItems.Tile.prototype.drawLoading = function (progress) {
	if (this.alpha < 1) {
		this.alpha += 0.1;
	}
	CrymeEngine.canvas.map.context.globalAlpha = this.alpha;
	CrymeEngine.canvas.map.context.drawImage(this.sprite.image, this.imageLeft,
		this.imageTop - this.col * tileHeight * (1 - progress / (animationDuration / 2)));
};
//attention a bien se préoccuper du context avant, ici je m'en occupe pas
MapItems.Tile.prototype.draw = function () {
	if (this.visible) {
		if (CE.displayType == CE.DisplayType.STANDARD) {
			CrymeEngine.canvas.map.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
		} else {
			//attention ici l'échelle du canvas est modifié depuis la map
			//CE.canvas.map.context.scale(1, 0.8);
			CE.canvas.map.context.globalAlpha = 1;
			CE.canvas.map.context.fillStyle = this.infoColor.rgb;
			CE.canvas.map.context.beginPath();
			CE.canvas.map.context.moveTo(this.x, this.y + tileHeight / 2 - borderSize);
			CE.canvas.map.context.lineTo(this.x - tileWidth / 2 + borderSize, this.y);
			CE.canvas.map.context.lineTo(this.x, this.y - tileHeight / 2 + borderSize);
			CE.canvas.map.context.lineTo(this.x + tileWidth / 2 - borderSize, this.y);
			CE.canvas.map.context.fill();
			/*CE.canvas.map.context.globalAlpha = 1;
			 CE.canvas.map.context.globalCompositeOperation = "source-over";
			 CE.canvas.map.context.fillStyle = ColorHelper.Templates.ORANGE.rgb;
			 CE.canvas.map.context.scale(1, 0.8);
			 CE.canvas.map.context.globalAlpha = 1;
			 CE.canvas.map.context.beginPath();
			 CE.canvas.map.context.arc(this.x, this.y * 1/0.8, 150 * this.humidity, 0, Math.PI * 2, true);
			 CE.canvas.map.context.fill();*/
			/*CE.canvas.map.context.beginPath();
			 CE.canvas.map.context.globalAlpha = 0.4;

			 CE.canvas.map.context.arc(this.x, this.y * 1/0.8, 200 * this.humidity, 0, Math.PI * 2, true);
			 CE.canvas.map.context.fill();*/
			//CE.canvas.map.context.globalCompositeOperation = "source-over";
			//CE.canvas.map.context.scale(1, 1/0.8);

		}
		if (Options.Debug.Graphic.enabled) {
			if (Options.Debug.Graphic.map) {
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillRect(this.x, this.y, Options.Debug.Graphic.dotSize / 2, Options.Debug.Graphic.dotSize / 2);
				CE.canvas.debug.context.fillRect(Math.ceil(this.x - tileWidth / 2), this.y, 5, 1);
				CE.canvas.debug.context.fillRect(Math.ceil(this.x - tileWidth / 2), this.y - 4, 1, 9);
				CE.canvas.debug.context.fillRect(Math.ceil(this.x + tileWidth / 2) - 1, this.y - 4, 1, 9);
				CE.canvas.debug.context.fillRect(Math.ceil(this.x + tileWidth / 2) - 5, this.y, 5, 1);
				CE.canvas.debug.context.fillStyle = "rgba(255, 255, 255, 0.5)";
				CE.canvas.debug.context.fillRect(this.x + Options.Debug.Graphic.dotSize / 2, this.y - 4, 100, 19);
				CE.canvas.debug.context.fillStyle = "#000";
				CE.canvas.debug.context.fillText(this.sprite.name + ' : ' + this.col + ',' + this.line, this.x + Options.Debug.Graphic.dotSize / 2 + 5, this.y + 10);
			}
			else {
				CE.canvas.debug.context.fillStyle = "#fff";
				CE.canvas.debug.context.fillText('(' + this.col + ',' + this.line + ')', this.x, this.y);
			}
		}
	}
};
MapItems.Tile.prototype.drawInfo = function () {
	if (this.visible) {
		this.informations.drawInformations();
	}
};
MapItems.Tile.prototype.drawInfoDetailed = function () {
	if (this.visible) {
		this.informations.drawInformationDetailed();
	}
};
MapItems.Tile.prototype.load = function () {
	this.updateImage();
	if (this.cropType != 'dummy') {
		this.sprite = SpritePack.Tiles.Sprites.SOIL;
		var crop = new MapItems.TileItems.Crop(MapItems.TileItems.Crop.Type[this.cropType], this.col, this.line);
		Map.mapItems.push(crop);
	}
	if (this.buildingType != 'dummy') {
		var building = new MapItems.TileItems.Building(MapItems.TileItems.Building.Type[this.buildingType], this.col, this.line);
		Map.mapItems.push(building);
	}
	this.updateImageCoord();
	this.informations.loadInformations();
};