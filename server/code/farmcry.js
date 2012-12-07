console.log("Starting server ...");
GameState = require('./models/gamestate');
NetworkEngine = require('./network/engine');

var io = require('socket.io').listen(8080);

console.log("Server started on port 8080");

io.sockets.on('connection', function (socket) {
	/*socket.on('my other event', function (data) {
		console.log(data);
	});*/
	//TODO : Tell the event manager that a new client connected
	//TODO : Oh, also don't forget to code an event manager
	NetworkEngine.clients.add(socket);
});