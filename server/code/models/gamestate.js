Weapon = require('./weapon');

var GameState = function() {
	this.weapons = Weapon.getDefaultWeapons();
	this.farmers = [];
}

var currentGameState = new GameState();
module.exports = currentGameState;