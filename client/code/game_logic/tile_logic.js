LogicItems.Tile = function (tileServer) {
	this.owner = new LogicItems.Farmer();
	this.humidity = 1; // 0 to 1
	this.fertility = 1;
	this.max_fertility = 1;
	this.crop = {};//new Crop();
	this.building = {};//new Building();
	this.maturity = 0;
	//Health being a dynamic value, it's not implemented as a variable
}

LogicItems.Tile.prototype = {
	constructor: LogicItems.Tile,

	isNeutral: function () {
		return (this.owner.name == "dummy");
	},

	isOwnedBy: function (targetFarmer) {
		return (this.owner == targetFarmer);
	},

	getHealth: function () {
		//Return a 0 to 1 value function of fertility, humidity

		return 1; //Guaranteed random since 1801 !
	}
};