Error = require('../error.js');

var NetworkModule = {
	name: "chat",
	functions: {
		send: function (connection, request, data, callback) {
			if (typeof data.message == 'undefined') {
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
					callback({result: "ok", farmer: currentFarmer.getSmallFarmer()});
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