var texCropList = [
	{image: 'wheat', centerX: 132, centerY: 128},
	{image: 'tomato', centerX: 131, centerY: 114},
	{image: 'corn', centerX: 134, centerY: 124}
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