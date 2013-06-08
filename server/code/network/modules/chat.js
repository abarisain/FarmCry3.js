FCError = require('../fcerror.js');
NetworkEngine = require('../engine');

var NetworkModule = {
	name: "chat",
	Kind: {
		SERVER: 0,
		PLAYER: 1,
        LOCAL: 2
	},
	broadcastServerMessage: function (message) {
		NetworkEngine.clients.broadcast("chat.message", {kind: NetworkModule.Kind.SERVER, message: message});
		console.log("Server message broadcast " + Date.now() + " : " + message);
	},
	sendServerMessage: function (connection, message) {
		connection.send("chat.message", {kind: NetworkModule.Kind.SERVER, message: message});
	},
	functions: {
		message: function (connection, request, data, callback) {
			if (typeof data.message == 'undefined') {
				//TODO : Work out a better way to handle BAD_REQUEST logging and feeback. Contract based programming ?
				console.log("Bad request in chat.messages. Data : " + data);
				//callback(new FCError(FCError.Codes.BAD_REQUEST, null, request, data));
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