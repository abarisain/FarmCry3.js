GameState = {
	player: null,
	online_players: [],
	logicItems: {
		growingCrops: {},
		storedCrops: {},
		buildings: {}
	},
	buildings: {},
	weapons: {},
	stored_crops: {},
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
	/**
	 @param {data} data
	 @return {string} key
	 */
	addGrowingCrop: function (data, col, line) {
		var key = 'g_' + col + '_' + line;
		this.logicItems.growingCrops[key] = { data: data, col: col, line: line};
		return key;
	},
	/**
	 @param {data} data
	 @return {string} key
	 */
	addBuilding: function (data, col, line) {
		var key = 'b_' + col + '_' + line;
		this.logicItems.buildings[key] = { data: GameState.buildings[data.codename], col: col, line: line};
		return key;
	},
	/**
	 Methode which decide to add, update or remove any mapItem
	 */
	updateMapItems: function () {
		for (var key in this.logicItems.growingCrops) {
			this.updateGrowingCrop(key);
		}
		for (var key in this.logicItems.buildings) {
			this.updateBuilding(key);
		}
	},
	/** The key name of the mapItem
	 * @param {key} = g_col_line
	 * */
	updateGrowingCrop: function (key) {
		var growingCrop = this.logicItems.growingCrops[key];
		var mapItem = Map.mapItems[key];
		//si le growing crop existe existe, il faut l'ajouter ou l'updater
		if (growingCrop != undefined) {
			//si le growing crop existe et le mapItem aussi, on l'update
			if (mapItem != undefined) {
				mapItem.data = temp.data;
			} else {//sinon il faut l'ajouter
				Map.mapItems[key] = new MapItems.TileItems.Crop(growingCrop.data, growingCrop.col, growingCrop.line);
			}
		} else {//si le growingCrop existe plus, on le supprime
			delete mapItem;
		}
	},
	/** The key name of the building
	 * @param {key} c_col_line
	 * */
	updateBuilding: function (key) {
		var building = this.logicItems.buildings[key];
		var mapItem = Map.mapItems[key];
		//si le building existe existe, il faut l'ajouter ou l'updater
		if (building != undefined) {
			//si le building existe et le mapItem aussi, on l'update
			if (mapItem != undefined) {
				mapItem.data = temp.data;
			} else {//sinon il faut l'ajouter
				Map.mapItems[key] = new MapItems.TileItems.Building(building.data, building.col, building.line);
			}
		} else {//si le building existe plus, on le supprime
			delete mapItem;
		}
	}

	//TODO : Add weapons and stuff
}