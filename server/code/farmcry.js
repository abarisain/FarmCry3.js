console.log("Starting server ...");
require('./models/gamestate.js');
require('./models/farmer.js');

var io = require('socket.io').listen(8080);

console.log("Server started on port 8080");