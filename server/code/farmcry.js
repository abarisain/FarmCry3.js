console.log("Starting server ...");

/*
 * Javascript builtin objects patching, this needs to be done before anything else
 */
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};
Array.prototype.removeItem = function (element) {
	this.splice(this.indexOf(element), 1);
};
Array.prototype.removeItemAtIndex = function (index) {
	this.splice(index, 1);
};

String.prototype.beginsWith = function (string) {
    return(this.indexOf(string) === 0);
};

var GameState = require('./models/gamestate');

var start_game = (function() {
	// Show the map in the console, because it looks greaaaaat.
	// But don't show it if it's too big.
	if(GameState.board.size.x < 32 && GameState.board.size.y < 32) {
		GameState.board.print();
	} else {
		console.log("Board is too big to be displayed");
	}

	// Setup auto-persistence every 5 minutes
	GameState.autoPersisterId = setInterval(function() {
		if(!GameState.pauseAutoPersistence)
			PersistenceManager.persist(GameState, PersistenceManager.defaultPersistCallback);
	}, 300000);

	var NetworkEngine = require('./network/engine');

	var express = require('express');
	var app = express();
	app.use(express.static(__dirname + '/../../client/code'));

	var http = require('http')
		, server = http.createServer(app)

	var io = require('socket.io').listen(server);
	//io.set('heartbeats', false);

	server.listen(8088);

	console.log("Server started on port 8088");

	io.sockets.on('connection', function (socket) {
		/*socket.on('my other event', function (data) {
		 console.log(data);
		 });*/
		//TODO : Tell the event manager that a new client connected
		//TODO : Oh, also don't forget to code an event manager
		NetworkEngine.clients.add(socket);
	});

}).bind(this);

// Load from redis if it's possible, otherwise start a new game and persist it.
var PersistenceManager = require('./persistence_manager');

PersistenceManager.load(GameState, function(err, result) {
	if(err == null && result) {
		console.log("Saved game data loaded (database version " + PersistenceManager.databaseVersion
			+ ", timestamp " + GameState.lastPersistDate + ")");
	} else {
		if(err != null) {
			console.log("Error while loading saved data : " + err);
		}
		console.log("Generating new game data");

		// Generate a 16x16 board
		GameState.board.init();
		GameState.board.grow(8, 8);

		// Generate the default user accounts
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

		// Save it
		PersistenceManager.persist(GameState, PersistenceManager.defaultPersistCallback);
	}
	start_game();
});

