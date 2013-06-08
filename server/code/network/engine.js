NetworkConnection = require('./connection');
DebugModule = require('./modules/debug');
AuthModule = require('./modules/auth');
MapModule = require('./modules/map');
GameModule = require('./modules/game');
ChatModule = require('./modules/chat');
PlayerModule = require('./modules/player');
EventManager = require('../event_manager');
Farmer = require('../models/farmer');

// Check modules/debug.js for an explanation of how modules work and should be written

module.exports = {
	timeout: 300, //5 minutes
	clients: {
		list: [],
		getConnectionForFarmer: function (farmer) {
			if (typeof farmer == 'undefined') {
				if (this.fakeConnection.farmer == null) {
					this.fakeConnection.farmer = new Farmer();
				}
				return this.fakeConnection;
			}
			var clientCount = NetworkEngine.clients.list.length;
			var connection;
			for (var i = 0; i < clientCount; i++) {
				connection = NetworkEngine.clients.list[i];
				if (typeof connection == 'undefined') {
					//This should never happen
				}
				if (connection.farmer.email == farmer.email) {
					return connection;
				}
			}
			if (this.fakeConnection.farmer == null) {
				this.fakeConnection.farmer = new Farmer();
			}
			return this.fakeConnection;
		},
		fakeConnection: { // Useful for disconnected farmers lolol dirty code
			farmer: null, // Will be lazy loaded because of issues with GameState
			send: function () {},
			sendError: function () {}
		},
		add: function (socket) {
			//We wrap this so we can do stuff when we add a connection
			//TODO : Implement a remove thingy
			//Register the NetworkModules to socket.io
			var connection = new NetworkConnection(socket);
			socket.on('disconnect', function () {
				console.log((connection.farmer == null ? "Unknown farmer" : connection.farmer.nickname)
					+ " disconnected, socketID : " + connection.socket.id);
				var clientCount = NetworkEngine.clients.list.length;
				for (var i = clientCount - 1; i >= 0; i--) {
					if (NetworkEngine.clients.list[i].socket.id == socket.id) {
						NetworkEngine.clients.list.removeItemAtIndex(i);
					}
				}
				if (connection.farmer != null) {
					EventManager.subsystems.player.disconnected(connection.farmer);
				}
			});
			//Iterate over the modules and their functions to bind them to events (module.function)
			NetworkEngine.modules.forEach(function (_module) {
				Object.keys(_module.functions).forEach(function (_function) {
					var request = _module.name + '.' + _function;
					socket.on(request, function (data, callback) {
						//Whitelist the auth module for authless events
						if (connection.authenticated || _module == AuthModule) {
							_module.functions[_function](connection, request, data, callback);
						} else {
							//If the function uses a callback, send the error this way, otherwise
							//send it async.
							//Note : I'm not sure that no callback sets callback to undefined
							//So this needs testing.
							if (callback != null) {
								callback(new Error(Error.Codes.NOT_AUTHENTICATED));
							} else {
								connection.sendError(new Error(Error.Codes.NOT_AUTHENTICATED));
							}
						}
					});
				});
			});
			//Add the socket to the list
			this.list.push(connection);
		},
		broadcast: function (event, data, require_auth, excluded_connection) {
			var listLength = this.list.length;
			for (var i = 0; i < listLength; i++) {
				if (this.list[i] != excluded_connection)
					this.list[i].send(event, data, require_auth);
			}
		}
	},
	modules: [
		DebugModule,
		AuthModule,
		MapModule,
		GameModule,
		ChatModule,
		PlayerModule
	]
};

var NetworkEngine = module.exports;

var moduleList = "";
NetworkEngine.modules.forEach(function (_module) {
	moduleList += " " + _module.name;
});
console.log("Loaded network modules :" + moduleList);
