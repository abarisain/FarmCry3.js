Error = require('../error.js');
GameState = require('../../models/gamestate');

var NetworkModule = {
	name: "game",
	functions: {
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
            for (farmer in GameState.farmers) {
                if(farmer.logged_in && farmer.nickname != connection.farmer.nickname)
                    tmpFarmers.push(farmer.getMinimalFarmer());
            }

			connection.send("game.initialData", {
				tiles: tmpTiles,
                player_farmer: connection.farmer.getSmallFarmer(),
                online_farmers: tmpFarmers,
				weapons: GameState.settings.weapons,
				crops: GameState.settings.crops,
				storages: GameState.settings.storages
			});
		}
	}
};

module.exports = NetworkModule;