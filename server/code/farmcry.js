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
	var index = this.indexOf(element);
	if(index != -1)
		this.splice(index, 1);
};
Array.prototype.removeItemAtIndex = function (index) {
	this.splice(index, 1);
};

String.prototype.beginsWith = function (string) {
	return(this.indexOf(string) === 0);
};

PM = require('./persistence_manager');
GameState = require('./models/gamestate');
NetworkEngine = require('./network/engine');
EventManager = require('./event_manager');
tick = require('./tick');

process.argv.forEach(function (val, index, array) {
	if (val == "--nopasswordcheck") {
		console.log("Debug - WARNING : Password check disabled");
		NetworkEngine.debugDisablePasswordCheck = true;
	}
	if (val == "--nosave") {
		console.log("Debug - WARNING : Persistence disabled");
		PM.enabled = false;
	}
});

var start_game = (function() {

	// Show the map in the console, because it looks greaaaaat.
	// But don't show it if it's too big.
	/*if(GameState.board.size.x < 32 && GameState.board.size.y < 32) {
		GameState.board.print();
	} else {
		console.log("Board is too big to be displayed");
	}*/

	// Setup auto-persistence every 5 minutes
	GameState.autoPersisterId = setInterval(function() {
		if(!GameState.pauseAutoPersistence)
			PM.persist(PM.defaultPersistCallback);
	}, 300000);

	var express = require('express');
	var app = express();
	app.use(express.static(__dirname + '/../../client/code'));

	var http = require('http')
		, server = http.createServer(app)

	var io = require('socket.io').listen(server);
	//io.set('heartbeats', false);

	server.listen(8088);

	console.log("Server started on port 8088");

	// Less logging
	io.set('log level', 1);
	
	io.sockets.on('connection', function (socket) {
		NetworkEngine.clients.add(socket);
	});

	tick();
}).bind(this);

var generate_new_initialdata = (function() {

	// Create the 16x16 map

	GameState.board.init();
	GameState.board.grow(8, 8);

	// Create the users
	var tmpFarmer = new Farmer("Administrator", "admin@farmcry.com", "password");
	tmpFarmer.admin = true;
	GameState.farmers.push(tmpFarmer);

}).bind(this);

PM.load(function(err, result) {
	//Workaround for asyncblock (bug?) behaviour where if an error is thrown in this callback,
	//the callback will be called again with err set as the new error. This is horrible.
	try {
		if(err == null && result) {
			console.log("Saved game data loaded (database version " + PM.databaseVersion
				+ ", timestamp " + GameState.lastPersistDate + ")");
		} else {
			if(err != null) {
				console.log("Error while loading saved data : " + err);
			}

			generate_new_initialdata();

			// Save it
			PM.persist(PM.defaultPersistCallback);
		}
		start_game();
	} catch (err2) {
		console.log("Error while starting game : " + err2);
		console.log(err2.stack);
	}
});