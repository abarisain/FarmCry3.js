function Building(type, col, line) {
	this.col = col;
	this.line = line;
	this.x = col * tileWidth - (tileWidth) * line - tileWidth;
	this.y = (line - lineSize) * tileHeight + (tileHeight) * col - 62;
	//gère l'image avec la réflection
	this.tileItem = new TileItem(type, this.x, this.y, 0, 0, type < 3 && reflectBuilding);
}

Building.prototype = {
	draw: function() {

	}
};