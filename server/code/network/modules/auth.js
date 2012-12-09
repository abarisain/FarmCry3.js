Error = require('../error.js');

var NetworkModule = {
	name: "auth",
	functions: {
		login: function (connection, data, callback) {
			connection.authenticated = true;
			callback({result: "ok"});
		}
	}
};

module.exports = NetworkModule;