function StoredCrop(crop, maturation, health) {
	if (typeof(crop) === 'undefined') {
		throw "You cannot create a StoredCrop without an attached crop"
	}
	this.crop = crop; //Must match with the crop codename
	this.maturation = maturation; //Current maturation between 0 and 1
	this.health = health; //Current health between 0 and 1
}

module.exports = StoredCrop;