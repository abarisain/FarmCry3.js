
function NetworkConnection(socket) {
	if (typeof socket == 'undefined')
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
		isTileInViewport: function (tile) {
			if (typeof tile == 'undefined' || typeof tile.position.x == 'undefined') {
				console.log("Warning : invalid tile in isTileInViewport, ignoring");
				return false;
			}
			return this.isPointInViewport(tile.position.x, tile.position.y);
		},
		isPointInViewport: function (x, y) {
			return (x >= this.x && x <= (this.width + this.x) &&
				y >= this.y && y <= (this.height + this.y))
		}
	}
}

NetworkConnection.prototype = {
	constructor: NetworkConnection,
	send: function (event, data, require_auth) {
		if (typeof require_auth == 'undefined') {
			require_auth = true;
		}
		if (require_auth && !this.authenticated) {
			console.log("Not sending message to unauthenticated user");
			return;
		}
		this.socket.emit(event, data);
	},
	sendError: function (error) {
		this.send('error', error, false);
	}
};

module.exports = NetworkConnection;