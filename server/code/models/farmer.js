Crypto = require('crypto');

function Farmer(nickname, email, password, difficulty) {
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
	this.password = password || "";
	this.password = Crypto.createHash('md5').update(this.password).digest("hex"); // Weak storage, but not plaintext
	this.weapons = [ require('./gamestate').settings.weapons.fork ];
	this.inventory = []; // Instances of storedCrop only for the time being
	this.admin = false;
	this.setMoneyForDifficulty(difficulty);
	if (typeof nickname == 'undefined') {
		this.nickname = "dummy";
		this.email = "dummy";
		this.password = "";
	}
}

Farmer.prototype = {
	constructor: Farmer,
	checkPassword: function (targetPassword) {
		return Crypto.createHash('md5').update(targetPassword).digest("hex") == this.password;
	},
	isDead: function () {
		return this.health == 0;
	},
	setMoneyForDifficulty: function (difficulty) {
		if(difficulty == "hard") {
			this.money = 2000;
		} else if(difficulty == "normal") {
			this.money = 9000;
		} else if(difficulty == "easy") {
			this.money = 20000;
		} else {
			this.money = 9000;
		}
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
		tmpFarmer.admin = this.admin;
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
		tmpFarmer.admin = this.admin;
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