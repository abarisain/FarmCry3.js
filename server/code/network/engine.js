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
			list.push(socket);
		}
	},
	modules: [
		DebugModule
	]
};

module.exports = NetworkEngine;