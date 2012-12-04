Weapon = require('./weapon');

var GameState = function() {
	this.weapons = Weapon.getDefaultWeapons();
	this.farmers = [];
	this.bite = "penis";
}

var currentGameState = new GameState();
module.exports = currentGameState;