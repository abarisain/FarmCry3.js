Error = require('../error.js');
GameState = require('../../models/gamestate');
EventManager = require('../../event_manager');

var NetworkModule = {
	name: "player",
	functions: {
		move: function (connection, request, data, callback) {
			data.col = (typeof data.col == 'undefined') ? 0 : Math.floor(data.col);
			data.line = (typeof data.line == 'undefined') ? 0 : Math.floor(data.line);
			if (data.col < -1 || data.col > 1 || data.line < -1 || data.line > 1) {
				connection.sendError(Error.BadRequest(request, data));
				return;
			}

			if (!EventManager.subsystems.player.move(connection.farmer, col, line)) {
				connection.send("player.moveDenied", data);
			}
		}
	}
};

module.exports = NetworkModule;