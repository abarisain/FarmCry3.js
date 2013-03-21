var texBuildingList = [
	{image: 'home', centerX: 133, centerY: 275}
];
var texBuildings = [];
var texBuildingInfos = [];

TileItems.Building = function (type, col, line) {
	TileItem.call(this, texBuildings[type], texBuildingInfos[type], col, line, texBuildingList[type].centerX, texBuildingList[type].centerY);
}

TileItems.Building.prototype = new TileItem();
TileItems.Building.prototype.constructor = TileItems.Building;

function LoadTexBuildings() {
	totalLoadingCount += texBuildingList.length * 2;
	for (var i = 0; i < texBuildingList.length; i++) {
		var texture = new Texture(i, texBuildingList[i].image, 'src/buildings/' + texBuildingList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texBuildings[i] = texture;
		var textureInfo = new Texture(i, texBuildingList[i].image, 'src/buildings/' + texBuildingList[i].image + '_white.png');
		textureInfo.image.addEventListener('load', textureInfo.loadingEnded);
		texBuildingInfos[i] = textureInfo;
	}
}