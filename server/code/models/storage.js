function Storage(codename, maturation, health) {
	if (typeof(codename) === 'undefined') {
		//Same philosophy as weapon's constructor
		this.codename = "dummy";
		this.maturation = 0;
		this.health = 0;
		return;
	}
	this.codename = codename;//Must match with the crop codename
	this.maturation = maturation; //Current maturation between 0 and 1
	this.health = health; //Current health between 0 and 1
}

module.exports = Storage;