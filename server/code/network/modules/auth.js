FCError = require('../fcerror.js');
GameState = require('../../models/gamestate');
EventManager = require('../../event_manager');
NetworkEngine = require('../engine');
Farmer = require('../../models/farmer');

var NetworkModule = {
	name: "auth",
	functions: {
		login: function (connection, request, data, callback) {
			if (typeof data.email == 'undefined' || typeof data.password == 'undefined') {
				callback(new FCError(FCError.Codes.BAD_REQUEST, null, request, data));
				return;
			}
			var farmersCount = GameState.farmers.length;
			var currentFarmer;
			data.email = data.email.toLowerCase();
			for (var i = 0; i < farmersCount; i++) {
				currentFarmer = GameState.farmers[i];
				if (data.email == currentFarmer.email) {
					if(currentFarmer.checkPassword(data.password) || NetworkEngine.debugDisablePasswordCheck) {
						connection.authenticated = true;
						connection.farmer = currentFarmer;
						callback({result: "ok", farmer: currentFarmer.getSmallFarmer()});
						EventManager.subsystems.player.connected(connection, connection.farmer);
						return;
					}
				}
			}
			//Login failed if this code is reached
			callback(new FCError(FCError.Codes.BAD_LOGIN));
		},

		register: function (connection, request, data, callback) {
			var failMessage = "";

			if (typeof data.nickname == 'undefined' || typeof data.email == 'undefined'
				|| typeof data.password == 'undefined' || typeof data.difficulty == 'undefined') {
				failMessage += "\nBad input data";
			}

			var emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/;
			if (!emailPattern.test(data.email)) {
				failMessage += "\nBad email format. Please check it";
			}
			var nicknamePattern = /^[a-zA-Z0-9_]{4,16}$/;
			if (!nicknamePattern.test(data.nickname)) {
				failMessage += "\nBad nickname format. It must be only letters, numbers and '_', and be between 4 or 16 characters.";
			}
			var passwordPattern = /^.{6,64}$/;
			if (!passwordPattern.test(data.password)) {
				failMessage += "\nBad password format. It must be only letters, numbers and '_', and be between 6 or 16 characters.";
			}

			var difficultyPattern = /^(easy|hard|normal)$/;
			if (!difficultyPattern.test(data.difficulty)) {
				failMessage += "\nBad difficulty.";
			}

			var email = data.email.toLowerCase();
			var nickname = data.nickname.toLowerCase();
			GameState.farmers.forEach(function (farmer) {
				if(farmer.nickname.toLowerCase() == nickname)
					failMessage += "\nThis nickname is already used.";
				if(farmer.email.toLowerCase() == email)
					failMessage += "\nThis email is already used.";
			});

			if (failMessage == "") {
				GameState.farmers.push(new Farmer(nickname, email, data.password, data.difficulty));
				callback({result: "ok"});
			} else {
				// Register failed if this code is reached
				callback({result: "fail", message: "Error while registering :" + failMessage});
			}
		}
	}
};

module.exports = NetworkModule;