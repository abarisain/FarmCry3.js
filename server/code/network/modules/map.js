Error = require('../error.js');
GameState = require('../../models/gamestate');

var NetworkModule = {
	name: "map",
	functions: {
		dump: function (connection, request, data, callback) {
			//WARNING : This is a debug function and should never be used in production code
			var tmpTiles = [];
			for (var y = 0; y < GameState.board.size.y; y++) {
				if (typeof tmpTiles[y] == 'undefined') {
					tmpTiles[y] = [];
				}
				for (var x = 0; x < GameState.board.size.x; x++) {
					tmpTiles[y][x] = GameState.board.tiles[y][x].getSmallTile();
				}
			}
			connection.send("map.dump", {
				tiles: tmpTiles
			});
		}
	}
};

module.exports = NetworkModule;