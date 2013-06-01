Crop = require('./crop');
Building = require('./building');
Farmer = require('./farmer');

function Tile() {
	this.position = {
		x: 0,
		y: 0
	};
	this.owner = new Farmer();
	this.humidity = 1; // 0 to 1
	this.fertility = 1;
	this.max_fertility = 1;
	this.crop = undefined;
	this.building = undefined;
	this.maturity = 0;
	//Health being a dynamic value, it's not implemented as a variable
}

Tile.prototype = {
	constructor: Tile,

	isNeutral: function () {
		return (this.owner.name == "dummy");
	},

	isOwnedBy: function (targetFarmer) {
		return (this.owner == targetFarmer);
	},

	getHealth: function () {
		//Return a 0 to 1 value function of fertility, humidity

		return 1; //Guaranteed random since 1801 !
	},
	getSmallTile: function () {
		//Returns a small version of this tile (for network usage)
		var tmpTile = new Tile();
		//Copy basic values
		tmpTile.position.x = undefined;
		tmpTile.position.y = undefined;
		tmpTile.position.col = this.position.x;
		tmpTile.position.line = this.position.y;
		tmpTile.humidity = this.humidity;
		tmpTile.fertility = this.fertility;
		tmpTile.max_fertility = this.max_fertility;
		tmpTile.crop = this.crop;
		tmpTile.building = this.building;
		tmpTile.owner = this.owner.nickname;
		tmpTile.health = this.getHealth();
		return tmpTile;
	},
	getPersistable: function () {
		var tmpTile = {};
		tmpTile.pos_x = this.position.x;
		tmpTile.pos_y = this.position.y;
		tmpTile.owner = this.owner.nickname;
		tmpTile.humidity = this.humidity;
		tmpTile.fertility = this.fertility;
		tmpTile.max_fertility = this.max_fertility;
		tmpTile.maturity = this.maturity;
		if(this.crop === undefined) {
			tmpTile.crop = "dummy";
		} else {
			tmpTile.crop = this.crop;
		}
		if(this.building === undefined) {
			tmpTile.building = "dummy";
		} else {
			tmpTile.building = this.building;
		}
		return tmpTile;
	}
};

module.exports = Tile;