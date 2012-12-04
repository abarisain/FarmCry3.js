var Tile = function() {
	this.x = 0;
	this.y = 0;
	this.owner = null;
	this.humidity = 1; // 0 to 1
	this.fertility = 1;
	this.max_fertility = 1;
	this.crop = null;
};

Tile.prototype = {
	isNeutral: function() {
		return (this.owner == null);
	},

	isOwnedBy: function(targetFarmer) {
		return (this.owner == targetFarmer);
	}
}

module.exports = Tile;