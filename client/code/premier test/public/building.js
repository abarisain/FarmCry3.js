var texBuildingList = [
	{image: 'silo', reflected: true},
	{image: 'barn', reflected: true},
	{image: 'cold_storage', reflected: true}
];
var texBuildings = [];
var texBuildingReflections = [];

function Building(type, col, line) {
	this.col = col;
	this.line = line;
	this.x = 0;
	this.y = 0;
	//gère l'image avec la réflection
	this.updateCoord();
	this.tileItem = new TileItem(type, this.x, this.y, 0, 0, type < 3);

}

Building.prototype = {
	updateCoord: function () {
		this.x = this.col * tileWidth - (tileWidth) * (this.line - 1);
		this.y = (this.line - lineSize) * tileHeight + this.col * tileHeight - 62;
	},
	drawReflection: function () {
		this.tileItem.drawReflection(texBuildingReflections);
	},
	drawItem: function () {
		this.tileItem.drawItem(texBuildings);
	}
};

function LoadTexBuildings() {
	totalLoadingCount += 2 * texBuildingList.length;//2 pour les reflets
	for (var i = 0; i < texBuildingList.length; i++) {
		var texture = new Texture(i, texBuildingList[i].image, 'src/buildings/' + texBuildingList[i].image + '.png');
		texture.image.onload = function () {
			texBuildings.push(this);
			currentLoadingCount++;
		};
		if (texBuildingList[i].reflected) {
			var textureReflection = new Texture(i, texBuildingList[i].image, 'src/buildings/' + texBuildingList[i].image + '_reflect.png');
			textureReflection.image.onload = function () {
				texBuildingReflections.push(this);
				currentLoadingCount++;
			};
		}
	}
}