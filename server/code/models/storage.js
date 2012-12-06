function Storage(codename, name, size, capacity, price, price_tick) {
	if (typeof(codename) === 'undefined') {
		//Same philosophy as weapon's constructor
		this.codename = "dummy";
		this.name = "Dummy storage";
		this.size = 1;
		this.capacity = 100;
		this.price = 100;
		this.price_tick = 1;
		return;
	}
	this.codename = codename;
	this.name = name;
	this.size = size; //Tile size, storage is only on x-axis for the time being
	this.capacity = 100; //Storage capacity
	this.price = 100; //Build price
	this.price_tick = 1; //Maintenance per tick if not empty
}

Storage.getDefaultStorages = function () {
	var storages = [];
	storages.push(new Storage("silo",
		"Silo",
		1,
		200,
		300,
		1)
	);
	storages.push(new Storage("barn",
		"Barn",
		2,
		450,
		800,
		1)
	);
	storages.push(new Storage("cold",
		"Cold Storage",
		6,
		2200,
		1400,
		3)
	);
	return storages;
};

module.exports = Storage;