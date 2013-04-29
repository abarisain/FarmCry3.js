function SpriteSheet(folderPath, textureInfo) {
	this.folderPath = folderPath;
	this.Sprites = {};
	this.spriteList = [];
	this.textureInfo = textureInfo;
}

SpriteSheet.prototype = {
	constructor: SpriteSheet,
	loadSprites: function () {
		for (var key in this.Sprites) {
			this.Sprites[key].textureInfo = this.textureInfo;
			this.spriteList.push(this.Sprites[key]);
		}
		if (this.textureInfo) {
			totalLoadingCount += this.spriteList.length * 2;
		} else {
			totalLoadingCount += this.spriteList.length;
		}
		for (var i = 0; i < this.spriteList.length; i++) {
			this.spriteList[i].load(this.folderPath);
		}
	}
};

var SpritePack = {
	Buildings: new SpriteSheet('src/buildings/', true),
	Characters: new SpriteSheet('src/character/', false),
	Crops: new SpriteSheet('src/crops/', true),
	Tiles: new SpriteSheet('src/tiles/', false)
}

function LoadSpritePack() {
	SpritePack.Buildings.Sprites.HOME = new Sprite('home', 133, 275);
	SpritePack.Buildings.Sprites.BARN = new Sprite('barn', 132, 142);

	SpritePack.Characters.Sprites.PLAYER = new Sprite('player', 19, 15);
	SpritePack.Characters.Sprites.FARMER = new Sprite('farmer', 15, 18);

	SpritePack.Crops.Sprites.WHEAT = new Sprite('wheat', 111, 111);
	SpritePack.Crops.Sprites.TOMATO = new Sprite('tomato', 125, 114);
	SpritePack.Crops.Sprites.CORN = new Sprite('corn', 114, 88);

	LoadTexTiles();

	for (var key in SpritePack) {
		SpritePack[key].loadSprites();
	}
}