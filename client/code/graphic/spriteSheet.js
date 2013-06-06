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
	Battle: new SpriteSheet('src/battle/', false),
	Background: new SpriteSheet('src/background/', false),
	Buildings: new SpriteSheet('src/buildings/', true),
	Characters: new SpriteSheet('src/character/', false),
	Crops: new SpriteSheet('src/crops/', true),
	Effects: new SpriteSheet('src/effects/', false),
	Fight: new SpriteSheet('src/fight/', false),
	Storages: new SpriteSheet('src/storages/', true),
	Tiles: new SpriteSheet('src/tiles/', false)

}

function LoadSpritePack() {
	SpritePack.Buildings.Sprites.BARN = new Sprite('barn', 50, 138);
	SpritePack.Buildings.Sprites.BARN_ROOF = new Sprite('barn_roof', 47, 178);
	SpritePack.Buildings.Sprites.COLD_STORAGE = new Sprite('cold_storage', 133, 198);
	SpritePack.Buildings.Sprites.COLD_STORAGE_ROOF = new Sprite('cold_storage_roof', 10, 175);
	SpritePack.Buildings.Sprites.SILO = new Sprite('silo', 133, 106);

	SpritePack.Storages.Sprites.BARREL_CORN = new Sprite('barrel_corn', 20, 38);
	SpritePack.Storages.Sprites.BARREL_TOMATO = new Sprite('barrel_tomato', 20, 38);
	SpritePack.Storages.Sprites.BARREL_WHEAT = new Sprite('barrel_wheat', 20, 38);

	SpritePack.Storages.Sprites.BOX_CORN = new Sprite('box_corn', 25, 50);
	SpritePack.Storages.Sprites.BOX_TOMATO = new Sprite('box_tomato', 24, 44);
	SpritePack.Storages.Sprites.BOX_WHEAT = new Sprite('box_wheat', 24, 44);

	SpritePack.Storages.Sprites.ICE_BOX_CORN = new Sprite('ice_box_corn', 24, 50);
	SpritePack.Storages.Sprites.ICE_BOX_TOMATO = new Sprite('ice_box_tomato', 24, 44);
	SpritePack.Storages.Sprites.ICE_BOX_WHEAT = new Sprite('ice_box_wheat', 24, 45);

	SpritePack.Characters.Sprites.SHADOW = new Sprite('shadow', 14, 12);
	SpritePack.Characters.Sprites.FARMER = new Sprite('farmer', 13, 34);
	SpritePack.Characters.Sprites.ANIM_AURA = new Sprites.Animation('aura', 50, 36, 20, 40);
	SpritePack.Characters.Sprites.ANIM_WATERS = new Sprites.Animation('farmer_waters', 18, 85, 47, 120);
	SpritePack.Characters.Sprites.ANIM_FERTLIZES = new Sprites.Animation('farmer_fertilizes', 16, 89, 23, 60);
	SpritePack.Characters.Sprites.ANIM_TOP_LEFT = new Sprites.Animation('farmer_top_left', 18, 42, 23, 30);
	SpritePack.Characters.Sprites.ANIM_TOP_RIGHT = new Sprites.Animation('farmer_top_right', 12, 34, 23, 30);
	SpritePack.Characters.Sprites.ANIM_BOTTOM_LEFT = new Sprites.Animation('farmer_bottom_left', 10, 49, 23, 30);
	SpritePack.Characters.Sprites.ANIM_BOTTOM_RIGHT = new Sprites.Animation('farmer_bottom_right', 30, 39, 23, 30);

	SpritePack.Crops.Sprites.WHEAT = new Sprite('wheat', 112, 118);
	SpritePack.Crops.Sprites.TOMATO = new Sprite('tomato', 125, 114);
	SpritePack.Crops.Sprites.CORN = new Sprite('corn', 114, 88);

	SpritePack.Tiles.Sprites.GRASS_0 = new Sprite('grass_0');
	SpritePack.Tiles.Sprites.GRASS_1 = new Sprite('grass_1');
	SpritePack.Tiles.Sprites.GRASS_2 = new Sprite('grass_2');
	SpritePack.Tiles.Sprites.GRASS_3 = new Sprite('grass_3');
	SpritePack.Tiles.Sprites.ROCK_0 = new Sprite('rock_0');
	SpritePack.Tiles.Sprites.ROCK_1 = new Sprite('rock_1');
	SpritePack.Tiles.Sprites.LEAVE = new Sprite('leave');
	SpritePack.Tiles.Sprites.SOIL = new Sprite('soil');
	SpritePack.Tiles.Sprites.WATER_0 = new Sprite('water_0');
	SpritePack.Tiles.Sprites.WATER_1 = new Sprite('water_1');
	SpritePack.Tiles.Sprites.WATER_2 = new Sprite('water_2');
	SpritePack.Tiles.Sprites.WHITE = new Sprite('white');

	SpritePack.Effects.Sprites.CLOUD = new Sprite('cloud', 545, 427);
	SpritePack.Effects.Sprites.TORNADO = new Sprites.Animation('tornado_animated', 150, 420, 23, 46);
	SpritePack.Effects.Sprites.RAIN = new Sprite('rain', 256, 256);
	SpritePack.Effects.Sprites.FIRE = new Sprite('fire', 102, 103);

	SpritePack.Battle.Sprites.BACKGROUND = new Sprite('background', 0, 0);
	SpritePack.Battle.Sprites.ACTION = new Sprite('action', 42, 40);
	SpritePack.Battle.Sprites.BUTTON = new Sprite('button', 126, 126);
	SpritePack.Battle.Sprites.BUTTON_AK47 = new Sprite('button_ak', 81, 81);
	SpritePack.Battle.Sprites.BUTTON_ANTHRAX = new Sprite('button_anthrax', 81, 81);
	SpritePack.Battle.Sprites.BUTTON_DODGE = new Sprite('button_dodge', 81, 81);
	SpritePack.Battle.Sprites.BUTTON_JUMP = new Sprite('button_jump', 81, 81);
	SpritePack.Battle.Sprites.BUTTON_RUN = new Sprite('button_run', 81, 81);
	SpritePack.Battle.Sprites.BUTTON_CROP = new Sprite('button_wheat', 81, 81);
	SpritePack.Battle.Sprites.BACKGROUND = new Sprite('background', 0, 0);
	SpritePack.Battle.Sprites.LENGTH = new Sprite('length', 81, 81);
	SpritePack.Battle.Sprites.BUTTON_ANTHRAX = new Sprite('button_anthrax', 81, 81);

	SpritePack.Battle.Sprites.AVATAR = new Sprite('avatar', 233, 260);
	SpritePack.Battle.Sprites.AVATAR_BAD_GUY = new Sprite('avatar_bad_guy', 295, 211);
	SpritePack.Battle.Sprites.AURA = new Sprite('aura', 797, 797);
	SpritePack.Battle.Sprites.WEAPON_FORK = new Sprite('fork', 212, 189);
	SpritePack.Battle.Sprites.WEAPON_FLAMETHROWER = new Sprite('flamethrower', 212, 189);
	SpritePack.Battle.Sprites.WEAPON_AK = new Sprite('ak', 240, 200);
	SpritePack.Battle.Sprites.LIGHTNING = new Sprite('lightning', 480, 327);
	SpritePack.Battle.Sprites.HIT_POINT = new Sprite('hit_point', 25, 26);
	SpritePack.Battle.Sprites.GROUND = new Sprite('ground', 288, 76);
	SpritePack.Battle.Sprites.GROUND.scale = 1.2;

	SpritePack.Fight.Sprites.PLAYER_INTRO = new Sprites.Animation('player_intro', 40, 176, 25, 60, 2);
	SpritePack.Fight.Sprites.PLAYER_FORK = new Sprites.Animation('player_fork', 190, 210, 23, 60, 2);
	SpritePack.Fight.Sprites.PLAYER_DODGE = new Sprites.Animation('player_dodge', 83, 182, 23, 60, 2);
	SpritePack.Fight.Sprites.PLAYER_HIT = new Sprites.Animation('player_hit', 51, 120, 23, 60, 2);

	SpritePack.Fight.Sprites.OPPONENT_INTRO = new Sprites.Animation('opponent_intro', 203, 167, 25, 60, 2);
	SpritePack.Fight.Sprites.OPPONENT_FORK = new Sprites.Animation('opponent_fork', 211, 259, 23, 60, 2);
	SpritePack.Fight.Sprites.OPPONENT_DODGE = new Sprites.Animation('opponent_dodge', 108, 116, 23, 60, 2);
	SpritePack.Fight.Sprites.OPPONENT_HIT = new Sprites.Animation('opponent_hit', 102, 124, 23, 60, 2);

	SpritePack.Background.Sprites.TOP_LEFT = new Sprite('bkg_top_left', 0, 0, false, ".jpg");
	SpritePack.Background.Sprites.TOP_RIGHT = new Sprite('bkg_top_right', 1920, 0, false, ".jpg");
	SpritePack.Background.Sprites.BOTTOM_LEFT = new Sprite('bkg_bottom_left', 0, 1080, false, ".jpg");
	SpritePack.Background.Sprites.BOTTOM_RIGHT = new Sprite('bkg_bottom_right', 1920, 1080, false, ".jpg");

	for (var key in SpritePack) {
		SpritePack[key].loadSprites();
	}
}

//cette fonction permet de charger tous les enums qui contiennent des sprites, vu qu'il faut attendre de les avoir chargés
function initSpriteEnums() {
	MapItems.TileItems.Crop.Type.corn.sprite = SpritePack.Crops.Sprites.CORN;
	MapItems.TileItems.Crop.Type.corn.spriteBarrel = SpritePack.Storages.Sprites.BARREL_CORN;
	MapItems.TileItems.Crop.Type.corn.spriteBox = SpritePack.Storages.Sprites.BOX_CORN;
	MapItems.TileItems.Crop.Type.corn.spriteIceBox = SpritePack.Storages.Sprites.ICE_BOX_CORN;

	MapItems.TileItems.Crop.Type.tomato.sprite = SpritePack.Crops.Sprites.TOMATO;
	MapItems.TileItems.Crop.Type.tomato.spriteBarrel = SpritePack.Storages.Sprites.BARREL_TOMATO;
	MapItems.TileItems.Crop.Type.tomato.spriteBox = SpritePack.Storages.Sprites.BOX_TOMATO;
	MapItems.TileItems.Crop.Type.tomato.spriteIceBox = SpritePack.Storages.Sprites.ICE_BOX_TOMATO;

	MapItems.TileItems.Crop.Type.wheat.sprite = SpritePack.Crops.Sprites.WHEAT;
	MapItems.TileItems.Crop.Type.wheat.spriteBarrel = SpritePack.Storages.Sprites.BARREL_WHEAT;
	MapItems.TileItems.Crop.Type.wheat.spriteBox = SpritePack.Storages.Sprites.BOX_WHEAT;
	MapItems.TileItems.Crop.Type.wheat.spriteIceBox = SpritePack.Storages.Sprites.ICE_BOX_WHEAT;

	//SpritePack.Buildings.Type.HOME.sprite = SpritePack.Buildings.Sprites.HOME;
	MapItems.TileItems.Building.Type.barn.sprite = SpritePack.Buildings.Sprites.BARN;
	MapItems.TileItems.Building.Type.cold_storage.sprite = SpritePack.Buildings.Sprites.COLD_STORAGE;
	MapItems.TileItems.Building.Type.silo.sprite = SpritePack.Buildings.Sprites.SILO;
}