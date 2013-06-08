function Farmer(nickname, email, password) {
	this.last_pos = {
		x: 0,
		y: 0
	};
	this.money = 0;
	this.allied_farmers = [];
	this.logged_in = false;
	this.health = 100;
	this.nickname = nickname;
	this.email = email;
	this.password = password;
	this.weapons = [ require('./gamestate').settings.weapons.fork ];
	this.inventory = []; // Instances of storedCrop only for the time being
	if (typeof nickname == 'undefined') {
		this.nickname = "dummy";
		this.email = "dummy";
		this.password = "";
	}
}

Farmer.prototype = {
	constructor: Farmer,
	isDead: function () {
		return this.health == 0;
	},
	getSmallFarmer: function () {
		var tmpFarmer = this.getMinimalFarmer();
		tmpFarmer.money = this.money;
		tmpFarmer.weapons = [];
		this.weapons.forEach(function (weapon) {
			tmpFarmer.weapons.push(weapon.codename);
		});
		tmpFarmer.inventory = [];
		this.inventory.forEach(function (storedCrop) {
			tmpFarmer.inventory.push(storedCrop.id);
		});
		return tmpFarmer;
	},
	getMinimalFarmer: function () {
		var tmpFarmer = {};
		tmpFarmer.nickname = this.nickname;
		tmpFarmer.col = this.last_pos.x;
		tmpFarmer.line = this.last_pos.y;
		tmpFarmer.health = this.health;
		return tmpFarmer;
	},
	getPersistable: function () {
		var tmpFarmer = {};
		tmpFarmer.nickname = this.nickname;
		tmpFarmer.email = this.email;
		tmpFarmer.password = this.password;
		tmpFarmer.health = this.health;
		tmpFarmer.last_pos_x = this.last_pos.x;
		tmpFarmer.last_pos_y = this.last_pos.y;
		tmpFarmer.money = this.money;
		var tmpArray = [];
		this.weapons.forEach(function (weapon) {
			tmpArray.push(weapon.codename);
		});
		tmpFarmer.weapons = JSON.stringify(tmpArray);
		tmpArray = [];
		this.allied_farmers.forEach(function (farmer) {
			tmpArray.push(farmer.nickname);
		});
		tmpFarmer.allied_farmers = JSON.stringify(tmpArray);
		tmpArray = [];
		this.inventory.forEach(function (storedCrop) {
			tmpArray.push(storedCrop.id);
		});
		tmpFarmer.inventory = JSON.stringify(tmpArray);
		return tmpFarmer;
	}
};

module.exports = Farmer;