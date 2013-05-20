GameState = require('../../models/gamestate');
EventManager = require('../../event_manager');

var NetworkModule = {
	name: "player",
	functions: {
		move: function (connection, request, data, callback) {
			data.col = (typeof data.col == 'undefined') ? 0 : Math.floor(data.col);
			data.line = (typeof data.line == 'undefined') ? 0 : Math.floor(data.line);
			//TODO : Re-enable this to disallow teleportation
			/*if (data.col < -1 || data.col > 1 || data.line < -1 || data.line > 1) {
			 connection.sendError(new Error(Error.Codes.BAD_REQUEST, null, request, data));
			 return;
			 }*/

			if (!EventManager.subsystems.player.move(connection.farmer, data.col, data.line)) {
				connection.send("player.moveDenied", data);
			}
		},
		buyCrop: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.buyCrop(connection.farmer, data.cropType)) {
				connection.send("player.buyCropDenied", data);
			}
		},
		harvestCrop: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.harvestCrop(connection.farmer)) {
				connection.send("player.harvestCropDenied", data);
			}
		},
		buyBuilding: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.buyBuilding(connection.farmer, data.buildingType)) {
				connection.send("player.buyBuildingDenied", data);
			}
		},
		destroyBuilding: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.destroyBuilding(connection.farmer)) {
				connection.send("player.destroyBuildingDenied", data);
			}
		}
	}
};

module.exports = NetworkModule;