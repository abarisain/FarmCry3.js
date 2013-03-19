var texCropList = [
	{image: 'wheat', centerX: 0, centerY: 28},
	{image: 'tomato', centerX: 0, centerY: 28},
	{image: 'corn', centerX: 0, centerY: 28}
];
var texCrops = [];

TileItems.Crop = function (type, col, line) {
	TileItem.call(this, texCrops[type], col, line, texCropList[type].centerX, texCropList[type].centerY);
}

TileItems.Crop.prototype = new TileItem();
TileItems.Crop.prototype.constructor = TileItem.Crop;

function LoadTexCrops() {
	totalLoadingCount += texCropList.length;
	for (var i = 0; i < texCropList.length; i++) {
		var texture = new Texture(i, texCropList[i].image, 'src/crops/' + texCropList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texCrops[i] = texture;
	}
}