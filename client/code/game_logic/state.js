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
	/** Add, update or delete growingCrop
	 * @param {GrowingCrop} data
	 * */
	updateGrowingCrop: function (data, col, line) {
		var key = Map.getMapItemKey(col, line);
		var growingCrop = this.logicItems.growingCrops[key];
		var mapItem = {}
		if (data == null) {
			//Remove growingCrop if data null
			mapItem = Map.mapItems[key];
			delete growingCrop;
			delete mapItem;

		} else {
			if (growingCrop == undefined) {
				//add growingCrop if growingCrop don't exist
				this.logicItems.growingCrops[key] = data;
				Map.mapItems[key] = new MapItems.TileItems.Crop(data, col, line);
			} else {
				//update growingCrop if exist
				mapItem = Map.mapItems[key];
				growingCrop.data = data;
				mapItem.updateData(data);
			}
		}
		CE.mapInvalidated = true;
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
			mapItem = Map.mapItems[key];
			delete building;
			delete mapItem;

		} else {
			if (building == undefined) {
				//add growingCrop if growingCrop don't exist
				this.logicItems.buildings[key] = data;
				Map.mapItems[key] = new MapItems.TileItems.Building(data, col, line);
			} else {
				//update building if exist
				//TODO add update building here
			}
		}
		CE.mapInvalidated = true;
	}
	//TODO : Add weapons and stuff
}