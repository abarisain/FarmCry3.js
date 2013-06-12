MapItems.Tile = function (data) {
	MapItem.call(this, null, data.position.col, data.position.line);
	this.data = data;
	this.hasGrowingCrop = false;
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
		this.hasGrowingCrop = true;
		GameState.updateGrowingCrop(this.data.growingCrop, this.col, this.line);
	}
	if (this.data.building != null) {
		GameState.updateBuilding(this.data.building, this.col, this.line);
	}
	this.updateImageCoord();
};

MapItems.Tile.prototype.updateData = function (data) {
	if (data.fertility) {
		this.data.fertility = data.fertility;
	}
	if (data.humidity) {
		this.data.humidity = data.humidity;
	}
	this.updateImage();
	if (CE.displayType == CE.DisplayType.INFORMATION) {
		this.showInformation();
	}
};

MapItems.Tile.prototype.setHasGrowingCrop = function (hasGrowingCrop) {
	this.hasGrowingCrop = hasGrowingCrop;
	this.updateImage();
};

MapItems.Tile.prototype.updateOwner = function (data) {
	this.data.owner = data.owner;
	if (CE.displayType == CE.DisplayType.INFORMATION) {
		this.showInformation();
	}
};

MapItems.Tile.prototype.showInformation = function () {
	this.informations.text = null;
	this.informations.value = 0;
	switch (CE.filterType) {
		case CE.FilterType.OWNER:

			if (this.data.owner == 'dummy') {
				this.informations.text = 'Free';
				this.infoColor.copyColor(ColorHelper.Templates.WHITE);
			} else if (this.data.owner == GameState.player.nickname) {
				this.informations.text = this.data.owner;
				this.infoColor.copyColor(ColorHelper.Templates.ORANGE);
			} else {
				this.informations.text = this.data.owner;
				this.infoColor.copyColor(ColorHelper.Templates.RED);
			}
			break;
		case CE.FilterType.HUMIDITY:
			this.infoColor.copyColor(ColorHelper.Templates.WHITE);
			this.informations.value = this.data.humidity * 100;
			break;
		case CE.FilterType.HEALTH:
			this.infoColor.copyColor(ColorHelper.Templates.WHITE);
			this.informations.value = this.data.humidity * this.data.fertility * 100;
			break;
		case CE.FilterType.FERTILITY:
			this.informations.value = this.data.fertility * 100;
			this.infoColor.createColorFactor(ColorHelper.Templates.WHITE, ColorHelper.Templates.BLUE, this.data.humidity);
			break;
	}
	this.informations.loadInformations();
};

MapItems.Tile.prototype.updateImage = function () {
	if (this.hasGrowingCrop) {
		if (this.data.humidity < 0.2) {
			this.sprite = SpritePack.Tiles.Sprites.SOIL_0;
		} else if (this.data.humidity < 0.4) {
			this.sprite = SpritePack.Tiles.Sprites.SOIL_1;
		} else if (this.data.humidity < 0.6) {
			this.sprite = SpritePack.Tiles.Sprites.SOIL_2;
		} else if (this.data.humidity < 0.8) {
			this.sprite = SpritePack.Tiles.Sprites.SOIL_3;
		} else {
			this.sprite = SpritePack.Tiles.Sprites.SOIL_4;
		}
	} else {
		if (this.data.humidity < 0.2) {
			if (this.data.fertility < 0.5) {
				this.sprite = SpritePack.Tiles.Sprites.ROCK_0;
			}
			else {
				this.sprite = SpritePack.Tiles.Sprites.LEAVE;
			}
		}
		else if (this.data.humidity < 0.3) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_LIGHT_0;
		}
		else if (this.data.humidity < 0.37) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_LIGHT_1;
		}
		else if (this.data.humidity < 0.45) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_LIGHT_2;
		}
		else if (this.data.humidity < 0.47) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_LIGHT_3;
		}
		else if (this.data.humidity < 0.5) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_LIGHT_4;
		}
		else if (this.data.humidity < 0.58) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_MEDIUM_0;
		}
		else if (this.data.humidity < 0.65) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_MEDIUM_1;
		}
		else if (this.data.humidity < 0.67) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_MEDIUM_2;
		}
		else if (this.data.humidity < 0.70) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_MEDIUM_3;
		}
		else if (this.data.humidity < 0.73) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_HEAVY_0;
		}
		else if (this.data.humidity < 0.77) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_HEAVY_1;
		}
		else if (this.data.humidity < 0.78) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_HEAVY_2;
		}
		else if (this.data.humidity < 0.8) {
			this.sprite = SpritePack.Tiles.Sprites.GRASS_HEAVY_3;
		}
		else if (this.data.humidity < 0.90) {
			this.sprite = SpritePack.Tiles.Sprites.WATER_0;
		}
		else if (this.data.humidity < 0.95) {
			this.sprite = SpritePack.Tiles.Sprites.WATER_1;
		}
		else {
			this.sprite = SpritePack.Tiles.Sprites.WATER_2;
		}
	}
};

MapItems.Tile.prototype.drawLoading = function (progress) {
	if (this.visible) {
		if (this.alpha < 1) {
			this.alpha += 0.1;
		}
		CrymeEngine.canvas.map.context.globalAlpha = this.alpha;
		CrymeEngine.canvas.map.context.drawImage(this.sprite.image, this.imageLeft,
			this.imageTop - this.col * tileHeight * (1 - progress));
	}
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