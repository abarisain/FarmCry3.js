NetworkConnection = require('./connection');
DebugModule = require('./modules/debug');
AuthModule = require('./modules/auth');
MapModule = require('./modules/map');
GameModule = require('./modules/game');

// Check modules/debug.js for an explanation of how modules work and should be written

var NetworkEngine = {
	timeout: 300, //5 minutes
	clients: {
		list: [],
		add: function (socket) {
			//We wrap this so we can do stuff when we add a connection
			//TODO : Implement a remove thingy
			//Register the NetworkModules to socket.io
			var connection = new NetworkConnection(socket);
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
		broadcast: function (event, data, require_auth) {
			var listLength = this.list.length;
			for (var i = 0; i < listLength; i++) {
				this.list[i].send(event, data, require_auth);
			}
		}
	},
	modules: [
		DebugModule,
		AuthModule,
		MapModule,
		GameModule
	]
};

var moduleList = "";
NetworkEngine.modules.forEach(function (_module) {
	moduleList += " " + _module.name;
});
console.log("Loaded network modules :" + moduleList);

module.exports = NetworkEngine;