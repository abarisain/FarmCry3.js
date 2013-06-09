LogicItems.Farmer = function () {
	LogicItem.call(this, 0, 0);
	this.is_allied = false;
	this.nickname = "nick";
};

LogicItems.Farmer.prototype.constructor = LogicItems.Farmer;
LogicItems.Farmer.prototype.getSmallFarmer = function () {
	var tmpFarmer = {};
	tmpFarmer.nickname = this.nickname;
	tmpFarmer.col = this.position.col;
	tmpFarmer.line = this.position.line;
	return tmpFarmer;
};
LogicItems.Farmer.prototype.initFromFarmer = function (smallFarmer) {
	this.nickname = smallFarmer.nickname;
	this.admin = smallFarmer.admin;
	this.position.col = smallFarmer.col;
	this.position.line = smallFarmer.line;
	//TODO : Add support for allies
};
LogicItems.Farmer.prototype.invalidate = function () {
	// Refresh everything about the farmer here.
	// This include telling the engine about it
	for (var i = 0; i < Map.players.length; i++) {
		if (Map.players[i].nickname == this.nickname)
			Map.players[i].invalidate();
	}
};

/*
 * Object representing the current farmer (the player)
 */
LogicItems.PlayableFarmer = function () {
	LogicItems.Farmer.call(this);
	this.money = 0;
	this.allied_farmers = [];
	this.weapons = [];
	this.inventory = {};
}

LogicItems.PlayableFarmer.prototype = new LogicItems.Farmer();
LogicItems.PlayableFarmer.prototype.constructor = LogicItems.PlayableFarmer;
LogicItems.PlayableFarmer.prototype.getSmallFarmer = function () {
	var tmpFarmer = LogicItems.Farmer.prototype.getSmallFarmer.call(this);
	tmpFarmer.money = this.money;
	tmpFarmer.weapons = [];
	for (var weapon in tmpFarmer.weapons) {
		tmpFarmer.weapons.push(weapon.codename);
	}
};
LogicItems.PlayableFarmer.prototype.initFromFarmer = function (smallFarmer) {
	LogicItems.Farmer.prototype.initFromFarmer.call(this, smallFarmer);
	this.money = smallFarmer.money;
	//TODO : Add support for allies
	this.allied_farmers = [];
	//TODO : Implement weapons parsing
	this.weapons = [];
	this.health = smallFarmer.health;
};