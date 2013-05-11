//TODO : faire une classe networkEngineSubsystem qui gère les erreurs et tout ...
//Pour l'instant il faut les recoder à chaque fois, ce n'est pas optimisé, mais il faut bien tester rapidement !
//(En fait j'ai juste aucune idée de comment l'implémenter)

var networkEngine = {
	manual_disconnect: false,
	socket: null,
	socket_connected: false,
	onConnectionFailed: function () {
	},
	onLoginFailed: function (error) {
	},
	onLoadingStarted: function () {
	},
	onLoadingProgress: function (current, total) {
	},
	onLoadingFinished: function () {
	},
	init: function (serverUrl, email, password) {
		this.manual_disconnect = false;
		console.log("Network connecting to " + serverUrl);
		this.socket = io.connect(serverUrl);
		//TODO : Add a connection timeout
		this.socket.on('connect', function () {
			//Iterate over the subsystems and their functions to bind them to events (module.function)
			Object.keys(networkEngine.subsystems).forEach(function (subsystem) {
				Object.keys(networkEngine.subsystems[subsystem].events).forEach(function (_function) {
					networkEngine.socket.on(subsystem + '.' + _function, function (data) {
						//TODO a virer pour faire une version propre
						var messageData = {
							kind: CE.hud.chat.Kind.SERVER,
							message: 'Received : ' + subsystem + ', ' + _function
						}
						CE.hud.chat.append(messageData);
						console.log('Received : ' + subsystem + ', ' + _function);
						console.debug(data);
						networkEngine.subsystems[subsystem].events[_function](data);
					});
				});
			});

			networkEngine.socket.emit("auth.login", {email: email, password: password}, function (data) {
				if (typeof data.error != 'undefined') {
					console.log("Error while logging in : " + data.error.description);
					this.manual_disconnect = true;
					networkEngine.socket.disconnect();
					networkEngine.onLoginFailed(data.error.description);
				} else {
					console.log("Network engine ready ! Requesting initial data.");
					networkEngine.socket.emit("game.getInitialData");
				}
			});
		});
		this.socket.on('disconnect', function () {
			if (this.manual_disconnect) {
				return;
			}
			alert("Network error : Socket Disconnected !\nYou may have logged on from another location.\n" +
				"Going back to login page.");
			window.location.reload();
		});
	},
	call: function (subsystem, method, data, callback) {
		networkEngine.socket.emit(subsystem + "." + method, data, callback);
	},
	subsystems: {
		chat: {
			sendMessage: function (message) {
				this.sendCommand("message", {message: message});
			},
			sendCommand: function (command, data) {
				networkEngine.call("chat", command, data);
			},
			events: {
				message: function (data) {
					CrymeEngine.hud.chat.append(data);
				}
			}
		}
	}
};