GameState = {
	player: null,
	online_players: [],
	logicItems: {
		growingCrops: {},//data from server
		storedCrops: {},//data from server
		buildings: {}//data from server
	},
	buildings: {},//reference from server
	weapons: {},//reference from server
	inventorySize: 5,
	addPlayer: function (player) {
		this.removePlayer(player.nickname);
		this.online_players.push(player);
		Map.addPlayer(player);
	},
	removePlayer: function (nickname) {
		Map.removePlayer(nickname);
		if (this.player != null && nickname == this.player.nickname)
			return;
		var playerCount = this.online_players.length;
		for (var i = playerCount - 1; i >= 0; i--) {
			if (this.online_players[i].nickname == nickname) {
				this.online_players.removeItemAtIndex(i);

			}
			break;
		}
	},
	loadPlayer: function () {
		for (var i = 0; i < initialData.player_farmer.inventory.length; i++) {
			this.inventoryItemAdded(initialData.player_farmer.inventory[i]);
		}
	},
	updateTile: function (data, col, line) {
		var tile = Map.getTile(col, line);
		tile.updateData(data);
	},
	updateTileOwner: function (data, col, line) {
		var tile = Map.getTile(col, line);
		tile.updateOwner(data);
		CE.Environment.addSmoke(col, line);
	},
	inventoryItemAdded: function (id) {
		GameState.player.inventory.push(id);
		CE.hud.events.refreshInventory();
	},
	inventoryItemRemoved: function (id) {
		GameState.player.inventory.removeItem(id);
		CE.hud.events.refreshInventory();
	},
	/**
	 * Add or update storedCrop
	 * @param data
	 */
	updateStoredCrop: function (data) {
		if (!loadingComplete)
			return;
		data.healthPercent = data.time_left / GameState.crops[data.crop].maturation_time;
		if (data.healthPercent < 0.2) {
			data.healthStatus = 'Critical';
		} else if (data.healthPercent < 0.4) {
			data.healthStatus = 'Medium';
		} else {
			data.healthStatus = 'Good';
		}

		if (this.logicItems.storedCrops[data.id] == undefined) {
			this.logicItems.storedCrops[data.id] = data;
			if (data.parent_tile == null) {//if storedCrop is in inventory
				//nothing special happens here for now
			} else {
				// The target building
				var mapItem = Map.mapItems[Map.getMapItemKey(data.parent_tile.col, data.parent_tile.line)];
				mapItem.updateStoredCrop(data.id);
				mapItem.refreshStoredCropCoord();
				CE.Environment.addSmoke(data.parent_tile.col, data.parent_tile.line);
			}
		}
	},
	/** Add, update or delete growingCrop
	 * @param {GrowingCrop} data
	 * */
	updateGrowingCrop: function (data, col, line) {
		var key = Map.getMapItemKey(col, line);
		var growingCrop = this.logicItems.growingCrops[key];

		var mapItem = {}
		if (data == null) {
			//Remove growingCrop if data null
			delete this.logicItems.growingCrops[key];
			delete Map.mapItems[key];
			Map.getTile(col, line).setHasGrowingCrop(false);
			CE.Environment.addSmoke(col, line);
		} else {
			if (growingCrop == undefined) {
				//add growingCrop if growingCrop don't exist
				this.logicItems.growingCrops[key] = data;
				Map.mapItems[key] = new MapItems.TileItems.Crop(data, col, line);
				Map.getTile(col, line).setHasGrowingCrop(true);
				CE.Environment.addSmoke(col, line);
			} else {
				//update growingCrop if exist
				mapItem = Map.mapItems[key];
				growingCrop.data = data;
				mapItem.updateData(data);
				Map.getTile(col, line).setHasGrowingCrop(true);
			}
		}
	},
	/** Add or delete growingCrop
	 * @param {Building} data
	 * */
	updateBuilding: function (data, col, line) {
		var key = Map.getMapItemKey(col, line);
		var building = this.logicItems.buildings[key];
		var mapItem = {}
		if (data == null) {
			//Remove building if data null
			delete this.logicItems.buildings[key];
			delete Map.mapItems[key];
			CE.Environment.addSmoke(col, line);
		} else {
			if (building == undefined) {
				//add growingCrop if growingCrop don't exist
				this.logicItems.buildings[key] = data;
				Map.mapItems[key] = new MapItems.TileItems.Building(data, col, line);
				CE.Environment.addSmoke(col, line);
			} else {
				//update building if exist
				//TODO add update building here
			}
		}
	}
	//TODO : Add weapons and stuff
}