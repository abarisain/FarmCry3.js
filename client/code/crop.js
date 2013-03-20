var texCropList = [
	{image: 'wheat', centerX: 111, centerY: 111},
	{image: 'tomato', centerX: 125, centerY: 114},
	{image: 'corn', centerX: 114, centerY: 88}
];
var texCrops = [];
var texCropInfos = [];

TileItems.Crop = function (type, col, line) {
	TileItem.call(this, texCrops[type], texCropInfos[type], col, line, texCropList[type].centerX, texCropList[type].centerY);
}

TileItems.Crop.prototype = new TileItem();
TileItems.Crop.prototype.constructor = TileItem.Crop;

function LoadTexCrops() {
	totalLoadingCount += texCropList.length;
	for (var i = 0; i < texCropList.length; i++) {
		var texture = new Texture(i, texCropList[i].image, 'src/crops/' + texCropList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texCrops[i] = texture;
		var textureInfo = new Texture(i, texCropList[i].image, 'src/crops/' + texCropList[i].image + '_white.png');
		textureInfo.image.addEventListener('load', textureInfo.loadingEnded);
		texCropInfos[i] = textureInfo;
	}
}