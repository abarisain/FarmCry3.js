function Building(codename, name, size, capacity, price, price_tick, stops_withering, size_x, size_y) {
	if (typeof(codename) === 'undefined') {
		//Same philosophy as weapon's constructor
		this.codename = "dummy";
		this.name = "Dummy storage";
		this.size = 1;
		this.capacity = 0;//note this value correspond to a barrel
		this.price = 100;
		this.price_tick = 1;
		this.stops_withering = false;
		return;
	}
	this.codename = codename;
	this.name = name;
	this.size = size; //Tile size, storage is only on x-axis for the time being
	this.capacity = capacity; //Storage capacity
	this.price = price; //Build price
	this.price_tick = price_tick; //Maintenance per tick if not empty
	this.stops_withering = stops_withering;
	this.selling_price = Math.ceil(this.price / 4);
	this.size = { // Size on the board
		x: size_x,
		y: size_y
	}
}

Building.Types = {
	silo: new Building("silo",
		"Silo",
		1,
		4,//4 barrels
		300,
		0,
		false,
		1,
		1),
	barn: new Building("barn",
		"Barn",
		4,
		18,//18 barrels
		800,
		0,
		false,
		2,
		2),
	cold_storage: new Building("cold_storage",
		"Cold Storage",
		6,
		20,//20 barrels
		1400,
		1,
		true,
		3,
		2)
};

module.exports = Building;