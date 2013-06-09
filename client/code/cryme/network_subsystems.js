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
		},
		healthUpdated: function (data) {
			if (GameState.player != null)
				GameState.player.health = data.health;
			CE.hud.panels.lifebar.setProgress(GameState.player.health);
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
			Map.init(data);
			CrymeEngine.init();
			currentLoadingCount++;
			console.log("Initial data ok");
			if (data.isRaining)
				CrymeEngine.Environment.startRain();
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
			for (var i = 0; i < data.storedCrop.length; i++) {
				GameState.updateStoredCrop(data.storedCrop[i]);
			}
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