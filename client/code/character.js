var texCharacterList = [
	{image: 'farmer'}
];
var texCharacters = [];

/*var texAnimatedList = [
 {
 image: 'cold_storage_mecanism',
 x: 260,
 y: -16,
 frameWidth: 144,
 frameHeight: 147,
 frameCount: 15,
 frameTimer: 4
 },
 {
 image: 'cold_storage_water',
 x: 391,
 y: 187,
 frameWidth: 124,
 frameHeight: 96,
 frameCount: 13,
 frameTimer: 4
 },
 {
 image: 'chimney',
 x: 170,
 y: -140,
 frameWidth: 46,
 frameHeight: 136,
 frameCount: 5,
 frameTimer: 4
 }
 ];*/

function Character(type, col, line) {
	this.col = col;
	this.line = line;
	this.x = 0;
	this.y = 0;
	this.centerX = centerX;//attention ceci est la distance top-left au centre de la tile, réferentiel indispensable
	this.centerY = centerY;
	this.imageLeft = 0;
	this.imageTop = 0;
	this.updateCoord();
	this.updateImageCoord();
	/*this.animations = [];
	 if (animationIndex != undefined) {
	 for (var i = 0; i < animationIndex.length; i++) {
	 this.animations.push({
	 animationIndex: animationIndex[i],
	 x: animationList[animationIndex[i]].x,
	 y: animationList[animationIndex[i]].y
	 });
	 }
	 }*/
}

Character.prototype = {
	constructor: Building,
	drawItem: function () {
		this.tileItem.drawItem(texCharacters);
	}
};

function LoadTexCharacters() {
	totalLoadingCount += texCharacterList.length;
	for (var i = 0; i < texCharacterList.length; i++) {
		var texture = new Texture(i, texCharacterList[i].image, 'src/character/' + texCharacterList[i].image + '.png');
		texture.image.onload = function () {
			currentLoadingCount++;
		};
		texCharacters[i] = texture;
	}
}