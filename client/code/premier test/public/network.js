//TODO : faire une classe networkEngineSubsystem qui gère les erreurs et tout ...
//Pour l'instant il faut les recoder à chaque fois, ce n'est pas optimisé, mais il faut bien tester rapidement !
//(En fait j'ai juste aucune idée de comment l'implémenter)

var networkEngine = {
	socket: null,
	socket_connected: false,
	init: function (serverUrl, email, password) {
		console.log("Network connecting to " + serverUrl);
		this.socket = io.connect(serverUrl);
		//TODO : Add a connection timeout
		this.socket.on('connect', function () {
			//Iterate over the subsystems and their functions to bind them to events (module.function)
			Object.keys(this.subsystems).forEach(function (subsystem) {
				Object.keys(subsystem).forEach(function (_function) {
					networkEngine.socket.on(subsystem.name + '.' + _function, function (data) {
						networkEngine.subsystems[subsystem][_function](data);
					});
				});
			});

			networkEngine.socket.emit("auth.login", {email: email, password: password}, function (data) {
				if (typeof data.error != 'undefined') {
					console.log("Error while logging in : " + data.error.message);
					networkEngine.socket.disconnect();
				} else {
					console.log("Network engine ready ! Requesting initial data.");
					networkEngine.socket.emit("game.getInitialData");
				}
			});
		});
	},
	call: function (subsystem, method, data, callback) {
		socket.emit(subsystem + "." + method, data, callback);
	},
	subsystems: {
		game: {
			initialData: function (data) {
				//Initial data is received here
			}
		}
	}
};

networkEngine.init('http://localhost:8080');