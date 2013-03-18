var texCropList = [
	{image: 'wheat'},
	{image: 'tomato'},
	{image: 'corn'}
];
var texCrops = [];

function Crop(type, col, line) {
	this.col = col;
	this.line = line;
	this.tileItem = new TileItem(type, this.col, this.line, 0, 24, true);
}

Crop.prototype = {
	constructor: Crop,
	drawItemLoading: function (progress) {
		this.tileItem.drawItemLoading(texCrops, progress);
	},
	drawItem: function () {
		this.tileItem.drawItem(texCrops);
	}
};

function LoadTexCrops() {
	totalLoadingCount += texCropList.length;
	for (var i = 0; i < texCropList.length; i++) {
		var texture = new Texture(i, texCropList[i].image, 'src/crops/' + texCropList[i].image + '.png');
		texture.image.onload = function () {
			currentLoadingCount++;
		};
		texCrops[i] = texture;
	}
}