GameState = require('../../models/gamestate');
Chat = require('./chat');

var NetworkModule = {
	name: "game",
	functions: {
		// Persist the GameState to the database
		save: function (connection, request, data, callback) {
			//WARNING : Debug/admin function
			Chat.broadcastServerMessage(connection.farmer.nickname + " forced GameState persist");
			var PM = require('../../persistence_manager');
			PM.persist(PM.defaultPersistCallback);
		},
		clearSavedGame: function  (connection, request, data, callback) {
			//WARNING : Debug/admin function
			Chat.broadcastServerMessage(connection.farmer.nickname + " DELETED GAME DATA");
			var PM = require('../../persistence_manager');
			PM.clear();
		},
		updateMap: function () {

			/*connection.send("game.initialData", {
			 tiles: tmpTiles,
			 player_farmer: connection.farmer.getSmallFarmer(),
			 online_farmers: tmpFarmers,
			 weapons: GameState.settings.weapons,//I'm going to use this later
			 crops: GameState.settings.crops,//TODO implement the use of these values in the client market
			 buildings: GameState.settings.buildings
			 });*/
		},
		getInitialData: function (connection, request, data, callback) {
			var tmpTiles = [];
			for (var y = 0; y < GameState.board.size.y; y++) {
				if (typeof tmpTiles[y] == 'undefined') {
					tmpTiles[y] = [];
				}
				for (var x = 0; x < GameState.board.size.x; x++) {
					tmpTiles[y][x] = GameState.board.tiles[y][x].getSmallTile();
				}
			}

			var tmpFarmers = [];
			for (var i = 0; i < GameState.farmers.length; i++) {
				if (GameState.farmers[i].logged_in && GameState.farmers[i].nickname != connection.farmer.nickname)
					tmpFarmers.push(GameState.farmers[i].getMinimalFarmer());
			}

			var tmpStoredCrops = [];
			for (var i = 0; i < GameState.board.storedCrops.length; i++) {
				if (GameState.board.storedCrops.owner != connection.farmer)
					continue;
				tmpStoredCrops.push(GameState.board.storedCrops[i]);
			}

			connection.send("game.initialData", {
				tiles: tmpTiles,
				col_size: GameState.board.size.x,
				line_size: GameState.board.size.y,
				player_farmer: connection.farmer.getSmallFarmer(),
				stored_crops: tmpStoredCrops,
				online_farmers: tmpFarmers,
				inventory_size: GameState.settings.inventorySize,
				weapons: GameState.settings.weapons,//I'm going to use this later
				crops: GameState.settings.crops,//TODO implement the use of these values in the client market
				buildings: GameState.settings.buildings
			});
		}
	}
};

module.exports = NetworkModule;