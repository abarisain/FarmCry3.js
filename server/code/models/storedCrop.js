function StoredCrop(crop, owner, harvested_quantity) {
	if (typeof(crop) === 'undefined') {
		throw "You cannot create a StoredCrop without an attached crop"
	}
	this.id = this.generateUniqueId();
	this.crop = crop;
	this.owner = owner; //Who this belongs to, obviously
	this.parent_tile = null; //If this is null, it's in the player's inventory, otherwise it's in a building
	this.harvested_quantity = harvested_quantity;
	this.time_left = crop.storability; //Time left before it withers. If it is 0, congrats, it's rotten
}

StoredCrop.prototype.generateUniqueId = function () {
	// Thanks http://stackoverflow.com/a/6248722
	// Add _ in the beginning since we'll store in a literal and they can't have a number as first char
	return "_" + ("0000" + (Math.random() * Math.pow(36,4) << 0).toString(36)).substr(-4);
}

StoredCrop.prototype.getSmallStoredCrop = function () {
	var tmp = {};
	tmp.id = this.id;
	tmp.crop = this.crop.codename;
	tmp.harvested_quantity = this.harvested_quantity;
	tmp.time_left = this.time_left;
	if(this.parent_tile != null) {
		tmp.parent_tile = {
			col: this.parent_tile.position.x,
			line: this.parent_tile.position.y
		}
	} else {
		tmp.parent_tile = null;
	}
	return tmp;
}

StoredCrop.prototype.getPersistable = function () {
	var tmp = {};
	tmp.id = this.id;
	tmp.crop = this.crop.codename;
	tmp.owner = this.owner.nickname;
	tmp.harvested_quantity = this.harvested_quantity;
	tmp.time_left = this.time_left;
	if(this.parent_tile != null) {
		tmp.parent_tile = {
			x: this.parent_tile.position.x,
			y: this.parent_tile.position.y
		}
		tmp.parent_tile = JSON.stringify(tmp.parent_tile);
	} else {
		tmp.parent_tile = "null";
	}
	return tmp;
}

/**
 @param {Farmer} targetFarmer
 @return {boolean}
 */
StoredCrop.prototype.isOwnedBy = function (targetFarmer) {
	return (this.owner == targetFarmer);
}

/**
 @return {boolean}
 */
StoredCrop.prototype.isInInventory = function () {
	return (this.parent_tile == null);
}

/**
 @return {boolean}
 */
StoredCrop.prototype.isRotten = function () {
	return (this.time_left <= 0);
}

module.exports = StoredCrop;