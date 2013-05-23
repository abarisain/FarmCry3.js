GameState = require('./models/gamestate');
NetworkEngine = require('./network/engine');
Chat = require('./network/modules/chat');

var EventManager = {
	tick: function () {
		//Trigger all the time based events here
		//Schedule the next tick. We don't use setInterval because the tick might change at anytime
		setTimeout(EventManager.tick(), GameState.settings.tickRate);
	},
	subsystems: {
		player: {
			connected: function (newConnection, farmer) {
				farmer.logged_in = true;
				//Disconnect already connected clients, but check for socket id so we don't disconnect ourselves
				var clientCount = NetworkEngine.clients.list.length;
				var connection;
				for (var i = 0; i < clientCount; i++) {
					connection = NetworkEngine.clients.list[i];
					if (typeof connection == 'undefined') {
						//This should never happen, but I'm tired of crashing because of this
					}
					if (connection.farmer.email == farmer.email &&
						connection.socket.id != newConnection.socket.id) {
						connection.socket.disconnect();
						//There should not be any ghost left, this needs to be tested
						//But due to the single threaded nature of node, even some asyncness won't matter
						break;
					}
				}
				Chat.sendServerMessage(newConnection, "Welcome to FarmCry, " + farmer.nickname + " !");
				Chat.broadcastServerMessage(farmer.nickname + " signed in");
				NetworkEngine.clients.broadcast("player.connected", {
					farmer: farmer.getMinimalFarmer()
				}, null, newConnection);
			},
			disconnected: function (farmer) {
				if (farmer == null) {
					return;
				}
				//Check if it was a ghost disconnection (the farmer connected but disconnected the other client)
				var isGhost = false;
				var clientCount = NetworkEngine.clients.list.length;
				for (var i = 0; i < clientCount; i++) {
					if (NetworkEngine.clients.list[i].farmer.email == farmer.email) {
						isGhost = true;
						break;
					}
				}
				if (!isGhost) {
					farmer.logged_in = false;
					Chat.broadcastServerMessage(farmer.nickname + " signed out");
					NetworkEngine.clients.broadcast("player.disconnected", {
						nickname: farmer.nickname
					});
				}
			},
			move: function (farmer, x, y) {
				x = Math.floor(x);
				y = Math.floor(y);
				var newX = farmer.last_pos.x + x;
				var newY = farmer.last_pos.y + y;
				//TODO : Re-enable this to disallow teleportation
				if (x < -1 || x > 1 || y < -1 || y > 1 || newX >= GameState.board.size.x || newY >= GameState.board.size.y
					|| newX < 0 || newY < 0) {
					return false;
				}
				farmer.last_pos.x = newX;
				farmer.last_pos.y = newY;
				//TODO : Send events only to people in the viewport
				NetworkEngine.clients.broadcast("player.moved", {
					nickname: farmer.nickname,
					col: farmer.last_pos.x,
					line: farmer.last_pos.y
				});
				return true;
			},
			buyCrop: function (farmer, cropType) {
				if (GameState.board.tiles[farmer.last_pos.y][farmer.last_pos.x].crop.codename == 'dummy') {
					GameState.board.tiles[farmer.last_pos.y][farmer.last_pos.x].crop = GameState.settings.crops[cropType];
					NetworkEngine.clients.broadcast("player.cropBought", {
						nickname: farmer.nickname,
						cropType: cropType,
						col: farmer.last_pos.x,
						line: farmer.last_pos.y
					});
					return true;
				}
				return false;
			},
			harvestCrop: function (farmer) {
				if (GameState.board.tiles[farmer.last_pos.y][farmer.last_pos.x].crop.codename != 'dummy') {
					GameState.board.tiles[farmer.last_pos.y][farmer.last_pos.x].crop = new Crop();
					NetworkEngine.clients.broadcast("player.cropHarvested", {
						nickname: farmer.nickname,
						col: farmer.last_pos.x,
						line: farmer.last_pos.y
					});
					return true;
				}
				return false;
			},
			buyBuilding: function (farmer, buildingType) {
				if (GameState.board.tiles[farmer.last_pos.y][farmer.last_pos.x].building.codename == 'dummy') {
					GameState.board.tiles[farmer.last_pos.y][farmer.last_pos.x].building = GameState.settings.buildings[buildingType];
					NetworkEngine.clients.broadcast("player.buildingBought", {
						nickname: farmer.nickname,
						buildingType: buildingType,
						col: farmer.last_pos.x,
						line: farmer.last_pos.y
					});
					return true;
				}
				return false;
			},
			destroyBuilding: function (farmer) {
				if (GameState.board.tiles[farmer.last_pos.y][farmer.last_pos.x].building.codename != 'dummy') {
					GameState.board.tiles[farmer.last_pos.y][farmer.last_pos.x].building = new Building();
					NetworkEngine.clients.broadcast("player.buildingDestroyed", {
						nickname: farmer.nickname,
						col: farmer.last_pos.x,
						line: farmer.last_pos.y
					});
					return true;
				}
				return false;
			}
		}
	}
};

module.exports = EventManager;