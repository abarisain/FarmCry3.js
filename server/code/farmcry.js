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

//Add test data

var tmpFarmer = new Farmer("Arkanta", "dreamteam69@gmail.com", "prout");
tmpFarmer.money = 9001;
GameState.farmers.push(tmpFarmer);
tmpFarmer = new Farmer("Yaurthek", "yaurthek@gmail.com", "nightcore");
tmpFarmer.money = 9002;
GameState.farmers.push(tmpFarmer);
tmpFarmer = new Farmer("iPoi", "rouxguigui@gmail.com", "3D");
tmpFarmer.money = 9003;
GameState.farmers.push(tmpFarmer);
tmpFarmer = new Farmer("Kalahim", "kalahim69@gmail.com", "dieu");
tmpFarmer.money = 9004;
GameState.farmers.push(tmpFarmer);