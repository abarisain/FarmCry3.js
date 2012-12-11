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
	//gère l'image avec la réflection
	this.tileItem = new TileItem(type, this.col, this.line, 0, 148, type < 3);
}

Building.prototype = {
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