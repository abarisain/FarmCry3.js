var texBuildingList = [
	{image: 'home'}
];
var texBuildings = [];

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

function Building(type, col, line) {
	this.col = col;
	this.line = line;
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
	this.tileItem = new TileItem(type, this.col, this.line, 0, 148, type < 3);
}

Building.prototype = {
	constructor: Building,
	drawItem: function () {
		this.tileItem.drawItem(texBuildings);
	}
};

function LoadTexBuildings() {
	totalLoadingCount += texBuildingList.length;
	for (var i = 0; i < texBuildingList.length; i++) {
		var texture = new Texture(i, texBuildingList[i].image, 'src/buildings/' + texBuildingList[i].image + '.png');
		texture.image.onload = function () {
			currentLoadingCount++;
		};
		texBuildings[i] = texture;
	}
}