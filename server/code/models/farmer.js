Point2D = require('./point2d');
Weapon = require('./weapon');
GameState = require('./gamestate');

//TODO: Well fuck, there is so much to do
var Farmer = function(nickname, email, password) {
	this.nickname = nickname;
	this.email = email;
	this.password = password;
	this.last_pos = new Point2D(0,0);
	this.money = 0;
	this.allied_farmers = [];
	this.weapons = [ GameState.weapons[0] ];
	this.logged_in = false;
};

module.exports = Farmer;