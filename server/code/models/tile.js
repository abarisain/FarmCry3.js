function Tile() {
	this.x = 0;
	this.y = 0;
	this.owner = null;
	this.humidity = 1; // 0 to 1
	this.fertility = 1;
	this.max_fertility = 1;
	this.crop = null;
	this.maturity = 0;
	//Health being a dynamic value, it's not implemented as a variable
}

Tile.prototype = {
	isNeutral: function() {
		return (this.owner == null);
	},

	isOwnedBy: function(targetFarmer) {
		return (this.owner == targetFarmer);
	},

	getHealth: function() {
		//Return a 0 to 1 value function of fertility, humidity

		return 1; //Guaranteed random since 1801 !
	}
};

module.exports = Tile;