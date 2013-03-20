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
        player: {
            events: {
                connected: function (data) {
                    var tmpPlayer = new Farmer();
                    tmpPlayer.initFromFarmer(data.farmer);
                    GameState.addPlayer(tmpPlayer);
                },
                disconnected: function (data) {
                    GameState.removePlayer(data.nickname);
                }
            }
        },
		game: {
			events: {
				initialData: function (data) {
					//Initial data is received here
					networkEngine.onLoadingStarted();
					initialDataLoaded = true;
                    GameState.player = tmpFarmer;
					Map.init(data);
                    var tmpFarmer;
                    for (var i = 0; i < data.online_farmers.length; i++) {
                        tmpFarmer = new Farmer();
                        tmpFarmer.initFromFarmer(data.online_farmers[i]);
                        GameState.addPlayer(tmpFarmer);
                    }
                    tmpFarmer = new PlayableFarmer();
                    tmpFarmer.initFromFarmer(data.player_farmer);
					CrymeEngine.init();
					currentLoadingCount++;
					console.log("Initial data ok");
				}
			}
		},
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