var Weapon = function() {
	//A dummy weapon should never be instanciated
	this.codename = "dummy"; //Codename for client (helps for showing the right sprite)
	this.name = "Dummy weapon";
	this.power = 0; //Damage per hit
	this.hit_ratio = 100; //Chances to strike in %
	this.hps = 2; //Hits per second
	this.price = 9001; //Let's say dollars OK ?
};

Weapon.prototype = {
	getFork : function() {
		var fork = new Weapon();
		fork.codename = "fork";
		fork.name = "Fork";
		fork.power = 1;
		fork.hit_ratio = 60;
		fork.hps = 1;
		fork.price = 0; //Every farmer has a fork anyway
		return fork;
	},

	getBaseballBat : function() {
		var bat = new Weapon();
		bat.codename = "bat";
		bat.name = "Baseball Bat";
		bat.power = 2;
		bat.hit_ratio = 70;
		bat.hps = 1;
		bat.price = 250;
		return bat;
	},

	getChainsaw : function() {
		var chainsaw = new Weapon();
		chainsaw.codename = "chainsaw";
		chainsaw.name = "Chainsaw";
		chainsaw.power = 1;
		chainsaw.hit_ratio = 80;
		chainsaw.hps = 1;
		chainsaw.price = 0;
		return chainsaw;
	},

	getAK47 : function() {
		var ak = new Weapon();
		ak.codename = "ak";
		ak.name = "AK-47";
		ak.power = 250;
		ak.hit_ratio = 80;
		ak.hps = 5;
		ak.price = 4000;
		return ak;
	},

	getAllWeapons : function() {
		return [this.getFork(), this.getBaseballBat(), this.getChainsaw(), this.getAK47()];
	}

	//TODO : maybe add an unicorn as a easter egg
};

exports = Weapon;