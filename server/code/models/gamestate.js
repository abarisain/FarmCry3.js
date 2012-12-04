Weapon = require('./weapon');

var Settings = function() {
	this.tickRate = 1000; //Time between ticks in mS
	this.startMoney = 1000; //Still dollars
};

var Board = function() {
	this.size_x = 20;
	this.size_y = 20;
	this.tiles = []; //Please only add instance of Tile here
};

var GameState = function() {
	this.weapons = Weapon.getDefaultWeapons();
	this.farmers = [];
	this.paused = false;
	this.Settings = new Settings();
	this.board = new Board();
};

var currentGameState = new GameState();
module.exports = currentGameState;