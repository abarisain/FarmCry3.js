var texBuildingList = [
	{image: 'home', centerX: 0, centerY: 128}
];
var texBuildings = [];

TileItems.Building = function (type, col, line) {
	TileItem.call(this, texBuildings[type], col, line, texBuildingList[type].centerX, texBuildingList[type].centerY);
}

TileItems.Building.prototype = new TileItem();
TileItems.Building.prototype.constructor = TileItems.Building;

function LoadTexBuildings() {
	totalLoadingCount += texBuildingList.length;
	for (var i = 0; i < texBuildingList.length; i++) {
		var texture = new Texture(i, texBuildingList[i].image, 'src/buildings/' + texBuildingList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texBuildings[i] = texture;
	}
}