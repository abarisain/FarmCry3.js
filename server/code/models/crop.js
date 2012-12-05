function Crop(codename,
				name,
				maturation_time,
				productivity,
				storability,
				seed_price) {
	if(typeof(codename) === 'undefined') {
		//Same philosophy as weapon's constructor
		this.codename = "dummy";
		this.name = "Dummy crop";
		this.maturation_time = 1000;
		this.productivity = 30;
		this.storability = 3600;
		this.seed_price = 100;
		return;
	}
	this.codename = codename;
	this.name = name;
	this.maturation_time = maturation_time; //Time from seeding to harvest in ticks. NOT SECONDS.
	this.productivity = productivity; //Harvest per tile at 100% health
	this.storability = storability; //Amount of ticks that the crop can be stored without withering
	this.seed_price = seed_price; //Seed price for one tile
}

Crop.getDefaultCrops = function() {
	var crops = [];
	crops.push(new Crop("tomatoes",
						"Tomatoes",
						1000,
						30,
						2000,
						100)
				);
	crops.push(new Crop("corn",
						"Corn",
						1800,
						40,
						3540,
						200)
				);
	crops.push(new Crop("wheat",
						"Wheat",
						1300,
						30,
						5800,
						50)
				);
	crops.push(new Crop("weed",
						"Weed",
						900,
						200,
						4800,
						800)
				);
	return crops;
};

module.exports = Crop;