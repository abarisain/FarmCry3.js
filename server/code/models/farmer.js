Weapon = require('./weapon');
GameState = require('./gamestate');

//TODO: Well fuck, there is so much to do
function Farmer(nickname, email, password) {
	this.nickname = nickname;
	this.email = email;
	this.password = password;
	this.last_pos = {
		x: 0,
		y: 0
	};
	this.money = 0;
	this.allied_farmers = [];
	this.weapons = [ GameState.settings.weapons[0] ];
	this.logged_in = false;
}

module.exports = Farmer;