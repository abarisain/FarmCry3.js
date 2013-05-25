networkEngine.subsystems.player = {
	actions: {
		move: function (col, line) {
			networkEngine.call('player', 'move', {col: col, line: line});
		},
		//cropType doit être le codename correspondant au serveur
		buyCrop: function (cropType) {
			networkEngine.call('player', 'buyCrop', {cropType: cropType});
		},
		harvestCrop: function () {
			networkEngine.call('player', 'harvestCrop', {});
		},
		//buildingType doit être le codename correspondant au serveur
		buyBuilding: function (buildingType) {
			networkEngine.call('player', 'buyBuilding', {buildingType: buildingType});
		},
		destroyBuilding: function () {
			networkEngine.call('player', 'destroyBuilding', {});
		}
	},
	events: {
		connected: function (data) {
			var tmpPlayer = new Farmer();
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
			} else {
				for (var i = 0; i < Map.players.length; i++) {
					if (Map.players[i].farmer.nickname == data.nickname)
						target = Map.players[i];
				}
			}
			if (target != null) {
				target.move(data.col, data.line);
			}
			target.invalidate();
		},
		cropBought: function (data) {
			Map.network.buyCrop(data.cropType, data.col, data.line);
		},
		cropHarvested: function (data) {
			Map.network.harvestCrop(data.col, data.line);
		},
		buildingBought: function (data) {
			Map.network.buyBuilding(data.buildingType, data.col, data.line);
		},
		buildingDestroyed: function (data) {
			Map.network.destroyBuilding(data.col, data.line);
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
			GameState.buildings = data.buildings;
			GameState.crops = data.crops;
			GameState.weapons = data.weapons;
			Map.init(data);
			CrymeEngine.init();
			currentLoadingCount++;
			console.log("Initial data ok");
		}
	}
};