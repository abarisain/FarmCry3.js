StoredCrop = require('./storedCrop');

function Crop(codename, name, maturation_time, productivity, storability, min_seed_price, max_seed_price, min_selling_price, max_selling_price, decay_time) {
	if (typeof(codename) === 'undefined') {
		//Same philosophy as weapon's constructor
		this.codename = "dummy";
		this.name = "Dummy crop";
		this.maturation_time = 1000;
		this.productivity = 30;
		this.storability = 3600;
		this.seed_price = 100;
		this.storedCrop = undefined;
		return;
	}
	this.codename = codename;
	this.name = name;
	this.maturation_time = maturation_time; //Time from seeding to harvest in ticks. NOT SECONDS.
	this.productivity = productivity; //Harvest per tile at 100% health
	this.storability = storability; //Amount of ticks that the STORED crop can be stored without withering
	this.decay_time = decay_time; //Amount of ticks that the GROWN crop can be left on the tile without withering
	this.min_seed_price = min_seed_price;
	this.max_seed_price = max_seed_price;
	this.seed_price = 0; //Seed price for one tile
	this.max_selling_price = max_selling_price;
	this.min_selling_price = min_selling_price;
	this.selling_price = 0; //Selling price PER unit. Don't forget that you have multiple harvest per stored crop. Randomized over time
	this.randomizePrices();
}

Crop.prototype.getSmallPriceUpdate = function () {
	return {
		codename: this.codename,
		selling_price: this.selling_price,
		seed_price: this.seed_price
	}
}

Crop.prototype.randomizePrices = function () {
	this.seed_price = Math.ceil(this.min_seed_price + (this.max_seed_price - this.min_seed_price) * Math.random());
	this.selling_price = Math.ceil(this.min_selling_price + (this.max_selling_price - this.min_selling_price) * Math.random());
}

Crop.Types = {
	tomato: new Crop("tomato",
		"Tomato",
		20,
		30,
		200000,
		100,
		200,
		30,
		80,
		200000),
	corn: new Crop("corn",
		"Corn",
		36,
		40,
		354000,
		200,
		400,
		100,
		150,
		354000),
	wheat: new Crop("wheat",
		"Wheat",
		26,
		30,
		580000,
		50,
		100,
		10,
		40,
		580000)
	//désolé mais j'ai pas du tout envie d'en faire plus que ce qui est dans le sujet de ce côté là
	/*crops.push(new Crop("weed",
	 "Weed",
	 900,
	 200,
	 4800,
	 800)
	 );*/
};

module.exports = Crop;