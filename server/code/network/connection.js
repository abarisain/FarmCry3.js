ErrorCodes = require('./error_codes');

function NetworkConnection(socket) {
	if(typeof socket == 'undefined')
		throw "Cannot instanciate a NetworkConnection without a socket";
	this.socket = socket;
	this.authenticated = false;
	this.farmer = null;
	this.date_connected = new Date();
	this.date_last_heartbeat = new Date();
	this.viewport = {
		x: 0,
		y: 0,
		width: 30,
		height: 40,
		isTileInViewport: function(tile) {
			if(typeof tile == 'undefined' || typeof tile.position.x == 'undefined')	{
				console.log("Warning : invalid tile in isTileInViewport, ignoring");
				return false;
			}
			return this.isPointInViewport(tile.position.x, tile.position.y);
		},
		isPointInViewport: function(x, y) {
			return (x >= this.viewport.x && x <= (this.viewport.width+this.viewport.x) &&
				y >= this.viewport.y && y <= (this.viewport.height+this.viewport.y))
		}
	}
}

NetworkConnection.prototype = {
	send: function(event, data, require_auth) {
		if(typeof require_auth == 'undefined') {
			require_auth = true;
		}
		if(require_auth && !this.authenticated) {
			this.sendError(ErrorCodes.NOT_AUTHENTICATED, "Access denied : Not authenticated. Please login first.");
			return;
		}
		this.socket.emit(event, data);
	},
	sendError: function(code, message) {
		this.send('error', {code: code, message: message}, false);
	}
};

module.exports = NetworkConnection;