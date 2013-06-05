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
		var temp = this.logicItems.growingCrops[key];
		//si le growing crop existe pas, on le créé
		if (temp != undefined) {
			Map.mapItems[key] = new MapItems.TileItems.Crop(temp.data, temp.col, temp.line);
		} else {
			Map.mapItems[key].data = temp.data;
		}
	},
	/** The key name of the building
	 * @param {key} c_col_line
	 * */
	updateBuilding: function (key) {
		var temp = this.logicItems.buildings[key];
		Map.mapItems[key] = new MapItems.TileItems.Building(temp.data, temp.col, temp.line);
	}

	//TODO : Add weapons and stuff
}