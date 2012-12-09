var texBuildingList = [
	{image: 'silo', reflected: true},
	{image: 'barn', reflected: true},
	{image: 'cold_storage', reflected: true},
	{image: 'wheat', reflected: false},
	{image: 'tomato', reflected: false},
	{image: 'corn', reflected: false}
];
var texBuildings = [];
var texBuildingReflections = [];

function Building(type, col, line) {
	this.col = col;
	this.line = line;
	this.x = col * tileWidth - (tileWidth) * line - tileWidth;
	this.y = (line - lineSize) * tileHeight + (tileHeight) * col - 62;
	//gère l'image avec la réflection
	this.tileItem = new TileItem(type, this.x, this.y, 0, 0, type < 3);
}

Building.prototype = {
	drawReflection: function() {
		this.tileItem.drawReflection(texBuildingReflections);
	},
	drawItem: function() {
		this.tileItem.drawItem(texBuildings);
	}
};

function LoadTexBuildings() {
	totalLoadingCount += 1.5 * texBuildingList.length;//2 pour les reflets
	for (var i = 0; i < texBuildingList.length; i++) {
		var building = new Image();
		building.src = 'src/buildings/' + texBuildingList[i].image + '.png';
		building.onload = function () {
			texBuildings.push(this);
			currentLoadingCount++;
		};
		if (texBuildingList[i].reflected)
		{
			var buildingReflection = new Image();
			buildingReflection.src = 'src/buildings/' + texBuildingList[i].image + '_reflect.png';
			buildingReflection.onload = function () {
				texBuildingReflections.push(this);
				currentLoadingCount++;
			};
		}
	}
}