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
	this.growingCrop = {};
	this.resetGrowingCrop();
	this.storedCrops = [];
	this.building = null;
	this.maturity = 0;
	this.isAliasOf = null; // Getting this tile should return the alias if present
	//Health being a dynamic value, it's not implemented as a variable
}

Tile.prototype = {
	constructor: Tile,

	/**
	 @return {Tile}
	 */
	getAliasableSelf: function () {
		//TODO : Remove this automatic correction for performance
		//return (this.isAliasOf == null ? this : this.isAliasOf);

		// Check if the alias target had a building on it. If not, it should not be aliased so log it and correct it
		if (this.isAliasOf != null) {
			if (this.isAliasOf.building == null) {
				console.log("ERROR : Tile " + this.position.x + "," + this.position.y + " is aliased to " + +this.isAliasOf.position.x + "," + this.isAliasOf.position.y
					+ " but the alias target has no building on it. Fixing.");
				this.isAliasOf = null;
			} else {
				return this.isAliasOf;
			}
		}
		return this;
	},

	isNeutral: function () {
		return (this.owner.nickname == "dummy");
	},

	/**
	 @param {Farmer} targetFarmer
	 @return {boolean}
	 */
	isOwnedBy: function (targetFarmer) {
		return (this.owner == targetFarmer);
	},

	/**
	 @return {boolean}
	 */
	hasBuilding: function () {
		return this.isAliasOf == null && this.building != null;
	},

	/**
	 @return {boolean}
	 */
	hasGrowingCrop: function () {
		return this.growingCrop.codename != null;
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

	resetGrowingCrop: function () {
		this.growingCrop = {
			codename: null,
			rotten: false,
			time_left: 0,
			harvested_quantity: 0 // If > 0 then time left is time before it becomes rotten
		}
	},

	getHealth: function () {
		//Return a 0 to 1 value function of fertility, humidity

		return 1; //Guaranteed random since 1801 !
	},
	getTickUpdateTile: function () {
		var tmpTile = {};
		tmpTile.col = this.position.x;
		tmpTile.line = this.position.y;
		tmpTile.humidity = this.humidity;
		tmpTile.fertility = this.fertility;
		return tmpTile;
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
		tmpTile.growingCrop = this.hasGrowingCrop() ? this.growingCrop : null
		if (this.building == null) {
			tmpTile.building = null;
		} else {
			tmpTile.building = { codename: this.building.codename };
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
		if (this.building == null) {
			tmpTile.building = "dummy";
		} else {
			tmpTile.building = this.building.codename;
		}
		var tmpArray = [];
		this.storedCrops.forEach(function (storedCrop) {
			tmpArray.push(storedCrop.id);
		});
		tmpTile.storedCrops = JSON.stringify(tmpArray);
		tmpTile.growingCrop = JSON.stringify(this.growingCrop);
		if (this.isAliasOf == null) {
			tmpTile.isAliasOf = null;
		} else {
			tmpTile.isAliasOf = JSON.stringify({
				x: this.isAliasOf.position.x,
				y: this.isAliasOf.position.y
			});
		}
		return tmpTile;
	}
};

module.exports = Tile;