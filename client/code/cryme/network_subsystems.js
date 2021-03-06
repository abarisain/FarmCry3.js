networkEngine.subsystems.player = {
	actions: {
		move: function (col, line) {
			networkEngine.call('player', 'move', {col: col, line: line});
		},
		//cropType doit être le codename correspondant au serveur
		buyCrop: function (cropType) {
			CE.Sound.sounds.action.buy_crop.play();
			networkEngine.call('player', 'buyCrop', {cropType: cropType});
		},
		harvestCrop: function () {
			networkEngine.call('player', 'harvestCrop', {});
		},
		//buildingType doit être le codename correspondant au serveur
		buyBuilding: function (buildingType) {
			CE.Sound.sounds.action.buy_building.play();
			networkEngine.call('player', 'buyBuilding', {buildingType: buildingType});
		},
		sellBuilding: function () {
			networkEngine.call('player', 'sellBuilding', {});
		},
		openBuilding: function () {
			networkEngine.call('player', 'openBuilding', {});
		},
		takeCurrentTile: function () {
			CE.Sound.sounds.wololo.play();
			networkEngine.call('player', 'takeCurrentTile', {});
		},
		watersTile: function () {
			networkEngine.call('player', 'watersTile', {});
		},
		fertilizesTile: function () {
			networkEngine.call('player', 'fertilizesTile', {});
		},
		sellStoredCrop: function (id) {
			networkEngine.call('player', 'sellStoredCrop', {storedCropId: id});
		},
		depositStoredCrop: function (id) {
			networkEngine.call('player', 'depositStoredCrop', {storedCropId: id});
		},
		pickupStoredCrop: function (id) {
			networkEngine.call('player', 'pickupStoredCrop', {storedCropId: id});
		}
	},
	events: {

		connected: function (data) {
			var tmpPlayer = new LogicItems.Farmer();
			tmpPlayer.initFromFarmer(data.farmer);
			GameState.addPlayer(tmpPlayer);
		},
		disconnected: function (data) {
			GameState.removePlayer(data.nickname);
		},
		moved: function (data) {
			var target = null;
			if (data.nickname == GameState.player.nickname) {
				target = Map.player;
				target.move(data.col, data.line);
				Map.updateHud();
			} else {
				for (var i = 0; i < Map.players.length; i++) {
					if (Map.players[i].farmer.nickname == data.nickname) {
						target = Map.players[i];
						target.move(data.col, data.line);
						break;
					}
				}
			}
			target.invalidate();
		},
		buyBuildingDenied: function (data) {
			CE.Environment.addBuildingGhost(data.buildingType, Map.player.col, Map.player.line);
		},
		/*
		 this method add, update or remove a building
		 */
		buildingUpdated: function (data) {
			GameState.updateBuilding(data.building, data.col, data.line);
			Map.updateHud();
			CE.mapInvalidated = true;
		},
		moneyUpdated: function (data) {
			if (GameState.player != null)
				GameState.player.money = data.money;
			CE.hud.events.refreshCharacter();
		},
		healthUpdated: function (data) {
			if (loadingComplete) {
				GameState.player.health = data.health;
				CE.hud.panels.lifebar.setProgress(GameState.player.health);
				CE.hud.events.refreshCharacter();
			}
		},
		launchBattle: function (data) {
			CE.Event.launchBattle(data);
		},
		tileFertilized: function (data) {
			CE.Sound.sounds.action.fertilize.play();
			Map.player.fertilizes();
			GameState.updateTile(data, data.col, data.line);
			CE.mapInvalidated = true;
		},
		tileWatered: function (data) {
			CE.Sound.sounds.action.waters.play();
			Map.player.waters();
			GameState.updateTile(data, data.col, data.line);
			CE.mapInvalidated = true;
		},
		inventoryItemAdded: function (data) {
			GameState.inventoryItemAdded(data.id);
		},
		inventoryItemRemoved: function (data) {
			GameState.inventoryItemRemoved(data.id);
		},
		buildingOpened: function (data) {
			CE.hud.events.buildingOpened(Map.mapItems[Map.getMapItemKey(data.col, data.line)]);
		}
	}
};
networkEngine.subsystems.game = {
	events: {
		initialData: function (data) {
			//Initial data is received here
			initialData = data;
			networkEngine.onLoadingStarted();
			initialDataLoaded = true;
			colSize = data.col_size;
			lineSize = data.line_size;
			GameState.buildings = data.buildings;
			GameState.crops = data.crops;
			GameState.weapons = data.weapons;
			GameState.tickRate = data.tick_rate;
			Map.init(data);
			CrymeEngine.init();
			currentLoadingCount++;
			console.log("Initial data ok");
			if (data.isRaining)
				CrymeEngine.Environment.startRain();
		},
		cropsPriceUpdated: function (data) {
			var crop;
			data.crops.forEach(function (updatedCrop) {
				crop = GameState.crops[updatedCrop.codename];
				crop.selling_price = updatedCrop.selling_price;
				crop.seed_price = updatedCrop.seed_price;
			});
			CE.hud.events.cropsPriceUpdated();
		},
		tileOwnerUpdated: function (data) {
			GameState.updateTileOwner(data, data.col, data.line);
			Map.updateHud();
			Map.player.wololo();
			CE.mapInvalidated = true;
		},
		/**
		 @param {array} data
		 */
		tilesDataUpdated: function (data) {
			for (var i = 0; i < data.tiles.length; i++) {
				GameState.updateTile(data.tiles[i], data.tiles[i].col, data.tiles[i].line);
			}
			CE.mapInvalidated = true;
		},
		error: function (data) {
			if (data.title == null)
				data.title = "Error"
			if (data.message == null)
				data.message = "Unknown error"
			CE.hud.rootHudElement.addChild(new HudElements.FullscreenPopup(data.title, data.message));
		},
		/*
		 this method add, update or remove a growingCrop depending on the data.growingCrop value
		 */
		growingCropUpdated: function (data) {
			GameState.updateGrowingCrop(data.growingCrop, data.col, data.line);
			Map.updateHud();
			CE.mapInvalidated = true;
		},
		tileStoredCropsUpdated: function (data) {
			var tile = Map.mapItems[Map.getMapItemKey(data.col, data.line)];
			var missingKeys = [];
			//Remove missing stored crops
			for (var key in tile.storedCrops) {
				if (data.storedCrops.indexOf(key) == -1)
					missingKeys.push(key);
			}
			missingKeys.forEach(function (key) {
				delete tile.storedCrops[key];
			});
			for (var i = 0; i < data.storedCrops.length; i++) {
				tile.updateStoredCrop(data.storedCrops[i]);
			}
			tile.refreshStoredCropCoord();
			CE.hud.events.refreshStoredCrop(data.col, data.line);
		},
		storedCropUpdated: function (data) {
			GameState.updateStoredCrop(data.storedCrop);
		},
		rainChanged: function (data) {
			if (data.isRaining) {
				CrymeEngine.Environment.startRain();
			} else {
				CrymeEngine.Environment.stopRain();
			}
		}
	}
};