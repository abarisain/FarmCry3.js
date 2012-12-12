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
	getSmallFarmer: function () {
		var tmpFarmer = {};
		tmpFarmer.nickname = this.nickname;
		tmpFarmer.money = this.money;
		tmpFarmer.col = this.last_pos.x;
		tmpFarmer.line = this.last_pos.y;
		tmpFarmer.weapons = [];
		for (var weapon in tmpFarmer.weapons) {
			tmpFarmer.weapons.push(weapon.codename);
		}
		return tmpFarmer;
	}
};

module.exports = Farmer;