var texCropList = [
	{image: 'wheat', reflected: true},
	{image: 'tomato', reflected: true},
	{image: 'corn', reflected: true}
];
var texCrops = [];
var texCropsReflections = [];

function Crop(type, col, line) {
	this.col = col;
	this.line = line;
	//gère l'image avec la réflection
	this.tileItem = new TileItem(type, this.col, this.line, 0, 24, true);
}

Crop.prototype = {
	drawReflection: function () {
		this.tileItem.drawReflection(texCropsReflections);
	},
	drawItem: function () {
		this.tileItem.drawItem(texCrops);
	}
};

function LoadTexCrops() {
	totalLoadingCount += 2 * texCropList.length;//+1 pour le reflet
	for (var i = 0; i < texCropList.length; i++) {
		var texture = new Texture(i, texCropList[i].image, 'src/crops/' + texCropList[i].image + '.png');
		texture.image.onload = function () {
			texCrops.push(this);
			currentLoadingCount++;
		};
		if (texCropList[i].reflected) {
			var textureReflection = new Texture(i, texCropList[i].image, 'src/crops/' + texCropList[i].image + '_reflect.png');
			textureReflection.image.onload = function () {
				texCropsReflections.push(this);
				currentLoadingCount++;
			};
		}
	}
}