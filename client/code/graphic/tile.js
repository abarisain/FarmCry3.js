MapItems.Tile = function (data) {
	MapItem.call(this, null, data.position.col, data.position.line);
	this.data = data;
	this.crop = {};//GRAPHIC
	this.building = {};//GRAPHIC
	this.sprite = {};
	this.alpha = 0;
	this.infoColor = new ColorHelper(255, 255, 255);
	this.updateCoord();
	this.informations = new MapItems.TileItemInfos(this.x, this.y);
};

MapItems.Tile.prototype = new MapItem();
MapItems.Tile.prototype.constructor = MapItems.Tile;

MapItems.Tile.prototype.init = function () {
	this.updateImage();
	//TODO optimier ici en remplacement update par add
	if (this.data.growingCrop != null) {
		//this.sprite = SpritePack.Tiles.Sprites.SOIL;
		GameState.updateGrowingCrop(this.data.growingCrop, this.col, this.line);
	}
	if (this.data.building != null) {
		GameState.updateBuilding(this.data.building, this.col, this.line);
	}
	this.updateImageCoord();
};

MapItems.Tile.prototype.updateData = function (data) {
	this.data = data;
	this.updateImage();
	if (CE.displayType == CE.DisplayType.INFORMATION) {
		this.showInformation();
	}
};

MapItems.Tile.prototype.showInformation = function () {
	switch (CE.filterType) {
		case CE.FilterType.OWNER:
			if (this.data.owner == 'dummy') {
				this.infoColor.copyColor(ColorHelper.Templates.WHITE);
			} else if (this.data.owner == GameState.player.name) {
				this.infoColor.copyColor(ColorHelper.Templates.ORANGE);
			} else {
				this.infoColor.copyColor(ColorHelper.Templates.RED);
			}
			break;
		case CE.FilterType.HUMIDITY:
			this.informations.value = this.data.humidity * 100;
			break;
		case CE.FilterType.HEALTH:
			this.infoColor.createColorFactor(ColorHelper.Templates.WHITE, ColorHelper.Templates.BLUE, this.data.humidity);
			break;
		case CE.FilterType.FERTILITY:
			this.informations.value = this.data.fertility * 100;
			this.infoColor.createColorFactor(ColorHelper.Templates.WHITE, ColorHelper.Templates.BLUE, this.data.humidity);
			break;
	}
	this.informations.loadInformations();
};

MapItems.Tile.prototype.updateImage = function () {
	if (this.data.humidity < 0.3) {
		if (this.data.fertility < 0.2) {
			this.sprite = SpritePack.Tiles.Sprites.ROCK_0;
		}
		else if (this.data.fertility < 0.5) {
			this.sprite = SpritePack.Tiles.Sprites.LEAVE;
		}
		else {
			this.sprite = SpritePack.Tiles.Sprites.SOIL;
		}
	}
	else if (this.data.humidity < 0.5) {
		this.sprite = SpritePack.Tiles.Sprites.GRASS_1;
	}
	else if (this.data.humidity < 0.55) {
		this.sprite = SpritePack.Tiles.Sprites.GRASS_0;
	}
	else if (this.data.humidity < 0.6) {
		this.sprite = SpritePack.Tiles.Sprites.GRASS_2;
	}
	else if (this.data.humidity < 0.7) {
		this.sprite = SpritePack.Tiles.Sprites.GRASS_3;
	}
	else if (this.data.humidity < 0.8) {
		this.sprite = SpritePack.Tiles.Sprites.WATER_0;
	}
	else if (this.data.humidity < 0.9) {
		this.sprite = SpritePack.Tiles.Sprites.WATER_1;
	}
	else {
		this.sprite = SpritePack.Tiles.Sprites.WATER_2;
	}
};

MapItems.Tile.prototype.drawLoading = function (progress) {
	if (this.alpha < 1) {
		this.alpha += 0.1;
	}
	CrymeEngine.canvas.map.context.globalAlpha = this.alpha;
	CrymeEngine.canvas.map.context.drawImage(this.sprite.image, this.imageLeft,
		this.imageTop - this.col * tileHeight * (1 - progress));
};
//attention a bien se préoccuper du context avant, ici je m'en occupe pas
MapItems.Tile.prototype.draw = function () {
	if (this.visible) {
		if (CE.displayType == CE.DisplayType.STANDARD) {
			CrymeEngine.canvas.map.context.drawImage(this.sprite.image, this.imageLeft, this.imageTop);
		} else {
			CE.canvas.map.context.globalAlpha = 1;
			if (CE.filterType.tileBorders) {
				CE.canvas.map.context.strokeStyle = '#f0f0f0';
				CE.canvas.map.context.lineWidth = 1;
				CE.canvas.map.context.beginPath();
				CE.canvas.map.context.moveTo(this.x, this.y + tileHeight / 2 - borderSize);
				CE.canvas.map.context.lineTo(this.x - tileWidth / 2 + borderSize, this.y);
				CE.canvas.map.context.lineTo(this.x, this.y - tileHeight / 2 + borderSize);
				CE.canvas.map.context.lineTo(this.x + tileWidth / 2 - borderSize, this.y);
				CE.canvas.map.context.stroke();
			} else {
				CE.canvas.map.context.fillStyle = this.infoColor.rgb;
				CE.canvas.map.context.beginPath();
				CE.canvas.map.context.moveTo(this.x, this.y + tileHeight / 2 - borderSize);
				CE.canvas.map.context.lineTo(this.x - tileWidth / 2 + borderSize, this.y);
				CE.canvas.map.context.lineTo(this.x, this.y - tileHeight / 2 + borderSize);
				CE.canvas.map.context.lineTo(this.x + tileWidth / 2 - borderSize, this.y);
				CE.canvas.map.context.fill();
			}
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