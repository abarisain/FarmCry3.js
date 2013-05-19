Weapon = require('./weapon');
GameState = require('./gamestate');

//TODO: Well fuck, there is so much to do
function Farmer(nickname, email, password) {
	this.last_pos = {
		x: 0,
		y: 0
	};
	this.money = 0;
	this.allied_farmers = [];
	this.logged_in = false;
	if (typeof nickname == 'undefined') {
		this.nickname = "dummy";
		this.email = "dummy";
		this.password = "";
		this.weapons = [];
		return;
	}
	this.nickname = nickname;
	this.email = email;
	this.password = password;
	this.weapons = [ GameState.settings.weapons[0] ];
}

Farmer.prototype = {
	constructor: Farmer,
	getSmallFarmer: function () {
		var tmpFarmer = this.getMinimalFarmer();
		tmpFarmer.money = this.money;
		tmpFarmer.weapons = [];
		for (var weapon in this.weapons) {
			tmpFarmer.weapons.push(weapon.codename);
		}
		return tmpFarmer;
	},
    getMinimalFarmer: function() {
        var tmpFarmer = {};
        tmpFarmer.nickname = this.nickname;
        tmpFarmer.col = this.last_pos.x;
        tmpFarmer.line = this.last_pos.y;
        return tmpFarmer;
    },
	getPersistable: function () {
		var tmpFarmer = {};
		tmpFarmer.nickname = this.nickname;
		tmpFarmer.email = this.email;
		tmpFarmer.password = this.password;
		tmpFarmer.last_pos_x = this.last_pos.x;
		tmpFarmer.last_pos_y = this.last_pos.y;
		tmpFarmer.money = this.money;
		var tmpArray = [];
		for (var weapon in this.weapons) {
			tmpArray.push(weapon.codename);
		}
		tmpFarmer.weapons = JSON.stringify(tmpArray);
		var tmpArray = [];
		for (var farmer in this.allied_farmers) {
			tmpArray.push(farmer.nickname);
		}
		tmpFarmer.allied_farmers = JSON.stringify(tmpArray);
		return tmpFarmer;
	}
};

module.exports = Farmer;