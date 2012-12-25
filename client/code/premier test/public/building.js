var texBuildingList = [
	{image: 'silo', reflected: true},
	{image: 'barn', reflected: true},
	{image: 'cold_storage', reflected: true}
];
var texBuildings = [];
var texBuildingReflections = [];

var texAnimatedList = [
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
];
var texAnimations = [];
var animationList = [];

function Building(type, col, line, animationIndex) {
	this.col = col;
	this.line = line;
	this.animations = [];
	if (animationIndex != undefined) {
		for (var i = 0; i < animationIndex.length; i++) {
			this.animations.push({
				animationIndex: animationIndex[i],
				x: animationList[animationIndex[i]].x,
				y: animationList[animationIndex[i]].y
			});
		}
	}
	//gère l'image avec la réflection
	this.tileItem = new TileItem(type, this.col, this.line, 0, 148, type < 3);
}

Building.prototype = {
	constructor: Building,
	/*addAnimation: function(textureAnimated, x, y) {
	 var temp = {
	 animation: textureAnimated,
	 x: x,
	 y: y
	 };
	 this.animations.push(temp);
	 },*/
	drawAnimation: function () {
		for (var i = 0; i < this.animations.length; i++) {
			animationList[this.animations[i].animationIndex].animation.drawAnimation(this.tileItem.x + this.animations[i].x, this.tileItem.y + this.animations[i].y);
		}
	},
	drawReflection: function () {
		this.tileItem.drawReflection(texBuildingReflections);
	},
	drawItem: function () {
		this.tileItem.drawItem(texBuildings);
	}
};

function LoadTexBuildings() {
	totalLoadingCount += 2 * texBuildingList.length;//2 pour les reflets
	for (var i = 0; i < texBuildingList.length; i++) {
		var texture = new Texture(i, texBuildingList[i].image, 'src/buildings/' + texBuildingList[i].image + '.png');
		texture.image.onload = function () {
			currentLoadingCount++;
		};
		texBuildings[i] = texture;
		if (texBuildingList[i].reflected) {
			var textureReflection = new Texture(i, texBuildingList[i].image, 'src/buildings/' + texBuildingList[i].image + '_reflect.png');
			textureReflection.image.onload = function () {
				currentLoadingCount++;
			};
			texBuildingReflections[i] = textureReflection;
		}
	}
}

function LoadAnimations() {
	totalLoadingCount += texAnimatedList.length;
	LoadTexAnimations();
}

function LoadTexAnimations() {
	for (var i = 0; i < texAnimatedList.length; i++) {
		var texture = new TextureAnimated(i, 'src/animation/' + texAnimatedList[i].image + '.png');
		this.animationList.push({
			animation: texture,
			x: texAnimatedList[i].x,
			y: texAnimatedList[i].y
		});
		texture.image.onload = function () {
			currentLoadingCount++;
		};
		texAnimations[i] = texture;
	}
}