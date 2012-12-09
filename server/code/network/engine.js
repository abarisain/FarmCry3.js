NetworkConnection = require('./connection');
DebugModule = require('./modules/debug');
AuthModule = require('./modules/auth');

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
			NetworkEngine.modules.forEach(function (_module) {
				Object.keys(_module.functions).forEach(function (_function) {
					socket.on(_module.name + '.' + _function, function (data, callback) {
						//Whitelist the auth module for authless events
						if (_module != AuthModule) {
							_module.functions[_function](connection, data, callback);
						} else {
							//If the function uses a callback, send the error this way, otherwise
							//send it async.
							//Note : I'm not sure that no callback sets callback to undefined
							//So this needs testing.
							if (callback != null) {
								callback(Error.getAuthError());
							} else {
								connection.sendAuthError();
							}
						}
					});
				});
			});
			//Add the socket to the list
			this.list.push(connection);
		}
	},
	modules: [
		DebugModule,
		AuthModule
	]
};

var moduleList = "";
NetworkEngine.modules.forEach(function (_module) {
	moduleList += " " + _module.name;
});
console.log("Loaded network modules :" + moduleList);

module.exports = NetworkEngine;