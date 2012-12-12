/*
 * Sample Debug module, mainly used as an example of how to do a module
 *
 * Many things will refer to the socket.io "documentation" : http://socket.io/#how-to-use
 *
 * Modules work this way :
 * Socket.io binds function to events name.
 * We set a convention where an event name is "module.function".
 * module is the "name" variable of NetworkModule, function is one of the functions in the
 * functions literal (obviously).
 *
 * When a socket is created, the engine will register all the events according to a module list.
 * So, if you want to create a new function in your module, it will be registered automatically.
 * If you create a new module, please require() it in network/engine.js and add it in the
 * modules array.
 *
 * NEVER forget to set module.exports to NetworkModule.
 * Also please don't rename NetworkModule to something else, it will still work,
 * but since there is no scope collision, naming them the same makes it look like some
 * inheritance.
 *
 * Concerning errors, this might change, but for the time being, return a new Error(code, description).
 *
 * NEVER forget the connection argument, it will always be passed.
 * It's the NetworkConnection instance that is associated to the event.
 * Data SHOULD ALWAYS BE A LITERAL. It's fine not to except any data, but still set it as a function parameter
 * Protocol should also be documented or else I'll kill your family.
 *
 * Please use the logger instead of console.log (well at least when it will be implemented)
 * Always require on top of the file (no "var X = require('foo').bar;")
 */

Error = require('../error.js');

var NetworkModule = {
	// Prefix for the module in the socket event.
	name: "debug",
	functions: {
		/*
		 * This is a function with a callback, provided by the client
		 * Very useful, we can query server/client stuff without having to read the answer
		 * somewhere else !
		 *
		 * Search the socket.io doc for "Sending and getting data (acknowledgements)."
		 * Client implementation is detailed there
		 */
		hello: function (connection, request, data, callback) {
			//Hello does not except any data. It sends back "world".
			//Callback always excepts one argument, which is a literal
			callback({result: "world"});
		},
		error: function (connection, request, data, callback) {
			//This function always sends an error, echoing the "message" variable sent by the client
			callback(new Error(Error.Codes.DEBUG_TEST_ERROR, "Debug test error, message : " + data.message));
		}
	}
};

module.exports = NetworkModule;