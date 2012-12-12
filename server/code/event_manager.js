GameState = require('./models/gamestate');
NetworkEngine = require('./network/engine');

var EventManager = {
	tick: function () {
		//Trigger all the time based events here
		//Schedule the next tick. We don't use setInterval because the tick might change at anytime
		setTimeout(EventManager.tick(), GameState.settings.tickRate);
	},
	subsystems: {
		player: {
			move: function (farmer, x, y) {
				x = Math.floor(x);
				y = Math.floor(y);
				var newX = farmer.last_pos.x + x;
				var newY = farmer.last_pos.y + y;
				if (x < -1 || x > 1 || y < -1 || y > 1 || newX > GameState.board.size.x || newY > GameState.board.size.y
					|| newX < 0 || newY < 0) {
					return false;
				}
				//TODO : Send events only to people in the viewport
				NetworkEngine.broadcast("player.moved", {
					nickname: farmer.nickname,
					col: farmer.last_pos.x,
					line: farmer.last_pos.y
				});
				return true;
			}
		}
	}
};

module.exports = EventManager;