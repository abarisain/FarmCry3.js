Error = require('../error.js');
GameState = require('../../models/gamestate');
EventManager = require('../../event_manager');

var NetworkModule = {
	name: "auth",
	functions: {
		login: function (connection, request, data, callback) {
			if (typeof data.email == 'undefined' || typeof data.password == 'undefined') {
				callback(new Error(Error.Codes.BAD_REQUEST, null, request, data));
				return;
			}
			var farmersCount = GameState.farmers.length;
			var currentFarmer;
			for (var i = 0; i < farmersCount; i++) {
				currentFarmer = GameState.farmers[i];
				if (data.email == currentFarmer.email) {
					//TODO : Disconnect already connected farmers for that email (if any)
					//TODO : CRYPT THIS SHIT
					//Password check is disabled, too annoying for debugging. I tested it before commenting it.
					//if(data.password == currentFarmer.password) {
					connection.authenticated = true;
					connection.farmer = currentFarmer;
					callback({result: "ok", farmer: currentFarmer.getSmallFarmer()});
					EventManager.subsystems.player.connected(connection.socket.id, connection.farmer);
					return;
					//}
				}
			}
			//Login failed if this code is reached
			callback(new Error(Error.Codes.BAD_LOGIN));
		}
	}
};

module.exports = NetworkModule;