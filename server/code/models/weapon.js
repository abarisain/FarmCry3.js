var Weapon = function(codename,
						name,
						power,
						hit_ratio,
						hps,
						price) {
	if(typeof(codename) === 'undefined') {
		//Si le premier paramètre est undefined, alors on part du principe qu'on veut le const. par defaut
		//On devrait jamais instancier ca
		this.codename = "dummy";
		this.name = "Dummy weapon";
		this.power = 0;
		this.hit_ratio = 100;
		this.hps = 2;
		this.price = 9001;
		return;
	}
	//A dummy weapon should never be instanciated
	this.codename = codename; //Codename for client (helps for showing the right sprite)
	this.name = name;
	this.power = power; //Damage per hit
	this.hit_ratio = hit_ratio; //Chances to strike in %
	this.hps = hps; //Hits per second
	this.price = price; //Let's say dollars OK ?
};

Weapon.prototype = {

	getDefaultWeapons : function() {
		var weapons = [];
		weapons.push(new Weapon("fork",
								"Fork",
								1,
								60,
								1,
								0)
					);
		weapons.push(new Weapon("bat",
								"Baseball Bat",
								4,
								70,
								2,
								250)
					);
		weapons.push(new Weapon("chainsaw",
								"Chainsaw",
								20,
								80,
								1,
								2500)
					);
		weapons.push(new Weapon("ak",
								"AK-47",
								250,
								80,
								5,
								4000)
					);
		return weapons;
	}

	//TODO : maybe add an unicorn as a easter egg
};

exports = Weapon;