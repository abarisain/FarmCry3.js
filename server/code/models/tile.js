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
	this.growingCrop = {
		codename: null,
		rotten: false,
		time_left: 0,
		harvested_quantity: 0 // If > 0 then time left is time before it becomes rotten
	};
	this.storedCrops = [];
	this.building = null;
	this.maturity = 0;
	//Health being a dynamic value, it's not implemented as a variable
}

Tile.prototype = {
	constructor: Tile,

	isNeutral: function () {
		return (this.owner.name == "dummy");
	},

	/**
	 @param {Farmer} targetFarmer
	 */
	isOwnedBy: function (targetFarmer) {
		return (this.owner == targetFarmer);
	},

	/**
	 @param {Crop} crop
	*/
	initGrowingCrop: function (crop) {
		this.growingCrop = {
			codename: crop.codename,
			rotten: false,
			time_left: crop.maturation_time,
			harvested_quantity: 0
		}
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
		tmpTile.growingCrop = this.growingCrop;
		if(tmpTile.growingCrop.codename == null)
			tmpTile.growingCrop = null;
		if(this.building == null) {
			tmpTile.building = null;
		} else {
			tmpTile.building = this.building.codename;
		}
		tmpTile.owner = this.owner.nickname;
		tmpTile.health = this.getHealth();
		tmpTile.storedCrops = [];
		this.storedCrops.forEach(function (storedCrop) {
			tmpTile.storedCrops.push(storedCrop.id);
		});
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
		if(this.building == null) {
			tmpTile.building = "dummy";
		} else {
			tmpTile.building = this.building;
		}
		var tmpArray = [];
		this.storedCrops.forEach(function (storedCrop) {
			tmpArray.push(storedCrop.id);
		});
		tmpTile.storedCrops = JSON.stringify(tmpArray);
		tmpTile.growingCrop = JSON.stringify(this.growingCrop);
		return tmpTile;
	}
};

module.exports = Tile;