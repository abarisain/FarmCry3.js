NetworkConnection = require('./connection');

var NetworkEngine = {
	timeout : 300, //5 minutes
	clients : {
		list: [],
		add: function(socket) {
			//We wrap this so we can do stuff when we add a connection
			//TODO : Implement a remove thingy
			list.push(socket);
		}
	}
};

module.exports = NetworkEngine;