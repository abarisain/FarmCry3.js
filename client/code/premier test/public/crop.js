var texCropList = [
	{image: 'wheat', reflected: false},
	{image: 'tomato', reflected: true},
	{image: 'corn', reflected: false}
];
var texCrops = [];
var texCropsReflections = [];

function Crop(type, col, line) {
	this.col = col;
	this.line = line;
	this.x = col * tileWidth - (tileWidth) * (line);
	this.y = (line - lineSize) * tileHeight + (tileHeight) * (col - 0.5) + 12;
	//gère l'image avec la réflection
	this.tileItem = new TileItem(type, this.x, this.y, 0, 0, false);
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
	totalLoadingCount += texCropList.length + 1;//+1 pour le reflet
	for (var i = 0; i < texCropList.length; i++) {
		var texture = new Texture(i, texCropList[i].image, 'src/crops/' + texCropList[i].image + '.png');
		texture.image.onload = function () {
			texCrops.push(this);
			currentLoadingCount++;
		};
		if (texCropList[i].reflected) {
			textureReflection = new Texture(i, texCropList[i].image, 'src/crops/' + texCropList[i].image + '_reflect.png');
			textureReflection.image.onload = function () {
				texCropsReflections.push(this);
				currentLoadingCount++;
			};
		}
	}
}