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
		sellBuilding: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.sellBuilding(connection.farmer)) {
				connection.send("player.sellBuildingDenied", data);
			}
		},
		takeCurrentTile: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.takeCurrentTile(connection.farmer)) {
				connection.send("player.takeCurrentTileDenied", data);
			}
		},
		watersTile: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.watersTile(connection.farmer)) {
				connection.send("player.watersTileDenied", data);
			}
		},
		fertilizesTile: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.fertilizesTile(connection.farmer)) {
				connection.send("player.fertilizesTileDenied", data);
			}
		},
		depositStoredCrop: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.depositStoredCrop(connection.farmer, data.storedCropId)) {
				connection.send("player.depositStoredCropDenied", data);
			}
		},
		pickupStoredCrop: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.pickupStoredCrop(connection.farmer, data.storedCropId)) {
				connection.send("player.pickupStoredCropDenied", data);
			}
		},
		sellStoredCrop: function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.sellStoredCrop(connection.farmer, data.storedCropId)) {
				connection.send("player.sellStoredCropDenied", data);
			}
		},
		openBuilding:  function (connection, request, data, callback) {
			if (!EventManager.subsystems.player.openBuilding(connection.farmer)) {
				connection.send("player.openBuildingDenied", data);
			}
		}
	}
};

module.exports = NetworkModule;