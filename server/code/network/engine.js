NetworkConnection = require('./connection');
DebugModule = require('./modules/debug');

// Check modules/debug.js for an explanation of how modules work and should be written

var NetworkEngine = {
	timeout: 300, //5 minutes
	clients: {
		list: [],
		add: function (socket) {
			//We wrap this so we can do stuff when we add a connection
			//TODO : Implement a remove thingy
			//Register the NetworkModules to socket.io
			NetworkEngine.modules.forEach(function (_module) {
				Object.keys(_module.functions).forEach(function (_function) {
					socket.on(_module.name + '.' + _function, _module.functions[_function]);
				});
			});
			//Add the socket to the list
			NetworkEngine.clients.list.push(socket);
		}
	},
	modules: [
		DebugModule
	]
};

module.exports = NetworkEngine;