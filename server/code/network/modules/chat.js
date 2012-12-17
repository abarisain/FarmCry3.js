Error = require('../error.js');
NetworkEngine = require('../engine');

var NetworkModule = {
	name: "chat",
	Kind: {
		SERVER: 0,
		PLAYER: 1
	},
	broadcastServerMessage: function (message) {
		NetworkEngine.clients.broadcast("chat.message", {kind: NetworkModule.Kind.SERVER, message: message});
	},
	functions: {
		send: function (connection, request, data, callback) {
			if (typeof data.message == 'undefined') {
				callback(new Error(Error.Codes.BAD_REQUEST, null, request, data));
				return;
			}
			if (connection.farmer == null) {
				//wat
				console.log("Internal error in chat module : Farmer == null");
				return;
			}
			NetworkEngine.clients.broadcast("chat.message", {
				kind: NetworkModule.Kind.PLAYER,
				message: data.message,
				player: connection.farmer.nickname
			});
		}
	}
};

module.exports = NetworkModule;