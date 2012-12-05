Weapon = require('./weapon');
Crop = require('./crop');
Storage = require('./storage');

var Settings = function() {
	this.tickRate = 1000; //Time between ticks in mS
	this.startMoney = 1000; //Still dollars
	//Here are the reference instances of the objects
	//If they are modified, everything using them will reflect the change
	//If they break, THINGS WILL GO TO HELL SO BE CAREFUL FUTURE-ME !
	this.weapons = Weapon.getDefaultWeapons();
	this.crops = Crop.getDefaultCrops();
	this.storages = Storage.getDefaultStorages();
};

var Board = function() {
	this.size_x = 20;
	this.size_y = 20;
	this.tiles = []; //Please only add instance of Tile here
};

var GameState = function() {

	this.farmers = [];
	this.paused = false;
	this.Settings = new Settings();
	this.board = new Board();
};

var currentGameState = new GameState();
module.exports = currentGameState;