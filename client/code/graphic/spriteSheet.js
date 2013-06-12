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
	Crops: new SpriteSheet('src/crops/', false),
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
	SpritePack.Characters.Sprites.ANIM_WOLOLO = new Sprites.Animation('farmer_wololo', 13, 48, 23, 60);

	SpritePack.Characters.Sprites.ANIM_TOP_LEFT = new Sprites.Animation('farmer_top_left', 18, 42, 23, 30);
	SpritePack.Characters.Sprites.ANIM_TOP_RIGHT = new Sprites.Animation('farmer_top_right', 12, 34, 23, 30);
	SpritePack.Characters.Sprites.ANIM_BOTTOM_LEFT = new Sprites.Animation('farmer_bottom_left', 10, 49, 23, 30);
	SpritePack.Characters.Sprites.ANIM_BOTTOM_RIGHT = new Sprites.Animation('farmer_bottom_right', 30, 39, 23, 30);

	SpritePack.Crops.Sprites.WHEAT_WHITE = new Sprite('wheat_white', 114, 118);//hack
	SpritePack.Crops.Sprites.WHEAT_0 = new Sprite('wheat_0', 113, 83);
	SpritePack.Crops.Sprites.WHEAT_1 = new Sprite('wheat_1', 112, 89);
	SpritePack.Crops.Sprites.WHEAT_2 = new Sprite('wheat_2', 112, 110);
	SpritePack.Crops.Sprites.WHEAT_3 = new Sprite('wheat_3', 113, 113);
	SpritePack.Crops.Sprites.WHEAT_4 = new Sprite('wheat_4', 115, 113);
	SpritePack.Crops.Sprites.TOMATO_WHITE = new Sprite('tomato_white', 127, 114);
	SpritePack.Crops.Sprites.TOMATO_0 = new Sprite('tomato_0', 116, 77);
	SpritePack.Crops.Sprites.TOMATO_1 = new Sprite('tomato_1', 127, 93);
	SpritePack.Crops.Sprites.TOMATO_2 = new Sprite('tomato_2', 127, 103);
	SpritePack.Crops.Sprites.TOMATO_3 = new Sprite('tomato_3', 135, 112);
	SpritePack.Crops.Sprites.TOMATO_4 = new Sprite('tomato_4', 134, 117);
	SpritePack.Crops.Sprites.CORN_WHITE = new Sprite('corn_white', 116, 88);
	SpritePack.Crops.Sprites.CORN_0 = new Sprite('corn_0', 105, 81);
	SpritePack.Crops.Sprites.CORN_1 = new Sprite('corn_1', 118, 82);
	SpritePack.Crops.Sprites.CORN_2 = new Sprite('corn_2', 116, 88);
	SpritePack.Crops.Sprites.CORN_3 = new Sprite('corn_3', 114, 96);
	SpritePack.Crops.Sprites.CORN_4 = new Sprite('corn_4', 114, 101);
	SpritePack.Crops.Sprites.ROTTEN = new Sprite('rotten', 134, 94);

	SpritePack.Tiles.Sprites.SOIL_0 = new Sprite('soil_0');
	SpritePack.Tiles.Sprites.SOIL_1 = new Sprite('soil_1');
	SpritePack.Tiles.Sprites.SOIL_2 = new Sprite('soil_2');
	SpritePack.Tiles.Sprites.SOIL_3 = new Sprite('soil_3');
	SpritePack.Tiles.Sprites.SOIL_4 = new Sprite('soil_4');
	SpritePack.Tiles.Sprites.GRASS_LIGHT_0 = new Sprite('grass_light_0');
	SpritePack.Tiles.Sprites.GRASS_LIGHT_1 = new Sprite('grass_light_1');
	SpritePack.Tiles.Sprites.GRASS_LIGHT_2 = new Sprite('grass_light_2');
	SpritePack.Tiles.Sprites.GRASS_LIGHT_3 = new Sprite('grass_light_3');
	SpritePack.Tiles.Sprites.GRASS_LIGHT_4 = new Sprite('grass_light_4');
	SpritePack.Tiles.Sprites.GRASS_MEDIUM_0 = new Sprite('grass_medium_0');
	SpritePack.Tiles.Sprites.GRASS_MEDIUM_1 = new Sprite('grass_medium_1');
	SpritePack.Tiles.Sprites.GRASS_MEDIUM_2 = new Sprite('grass_medium_2');
	SpritePack.Tiles.Sprites.GRASS_MEDIUM_3 = new Sprite('grass_medium_3');
	SpritePack.Tiles.Sprites.GRASS_HEAVY_0 = new Sprite('grass_heavy_0');
	SpritePack.Tiles.Sprites.GRASS_HEAVY_1 = new Sprite('grass_heavy_1');
	SpritePack.Tiles.Sprites.GRASS_HEAVY_2 = new Sprite('grass_heavy_2');
	SpritePack.Tiles.Sprites.GRASS_HEAVY_3 = new Sprite('grass_heavy_3');
	SpritePack.Tiles.Sprites.ROCK_0 = new Sprite('rock_0');
	SpritePack.Tiles.Sprites.ROCK_1 = new Sprite('rock_1');
	SpritePack.Tiles.Sprites.LEAVE = new Sprite('leave');
	SpritePack.Tiles.Sprites.WATER_0 = new Sprite('water_0');
	SpritePack.Tiles.Sprites.WATER_1 = new Sprite('water_1');
	SpritePack.Tiles.Sprites.WATER_2 = new Sprite('water_2');

	SpritePack.Effects.Sprites.CLOUD = new Sprite('cloud', 545, 427);
	SpritePack.Effects.Sprites.TORNADO = new Sprites.Animation('tornado_animated', 150, 420, 23, 46);
	SpritePack.Effects.Sprites.RAIN = new Sprite('rain', 256, 256);
	SpritePack.Effects.Sprites.FIRE = new Sprite('fire', 102, 103);
	SpritePack.Effects.Sprites.SMOKE = new Sprite('smoke', 32, 32);
	SpritePack.Effects.Sprites.ICE = new Sprite('ice', 62, 41);
	SpritePack.Effects.Sprites.LIGHT_WHITE = new Sprite('light_white', 7, 7);
	SpritePack.Effects.Sprites.BLUR = new Sprite('blur', 28, 28);
	SpritePack.Effects.Sprites.HALO = new Sprite('halo', 76, 58);
	SpritePack.Effects.Sprites.REQUIRED = new Sprite('required', 92, 14);

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


	SpritePack.Battle.Sprites.PLAYER_IDLE = new Sprite('player_idle', 41, 111, null, null, 2);
	SpritePack.Battle.Sprites.OPPONENT_IDLE = new Sprite('opponent_idle', 83, 119, null, null, 2);
	SpritePack.Battle.Sprites.PLAYER_FLYING = new Sprite('player_flying', 112, 172, null, null, 2);
	SpritePack.Battle.Sprites.OPPONENT_FLYING = new Sprite('opponent_flying', 183, 117, null, null, 2);
	SpritePack.Battle.Sprites.AURA = new Sprite('aura', 797, 797);
	SpritePack.Battle.Sprites.WEAPON_FORK = new Sprite('fork', 212, 189);
	SpritePack.Battle.Sprites.WEAPON_FLAMETHROWER = new Sprite('flamethrower', 212, 189);
	SpritePack.Battle.Sprites.WEAPON_AK = new Sprite('ak', 240, 200);
	SpritePack.Battle.Sprites.LIGHTNING = new Sprite('lightning', 450, 0);
	SpritePack.Battle.Sprites.HIT_POINT = new Sprite('hit_point', 25, 26);
	SpritePack.Battle.Sprites.GROUND = new Sprite('ground', 288, 76);
	SpritePack.Battle.Sprites.GROUND.scale = 1.2;

	SpritePack.Fight.Sprites.PLAYER_INTRO = new Sprites.Animation('player_intro', 40, 176, 25, 60, 2);
	SpritePack.Fight.Sprites.PLAYER_FORK = new Sprites.Animation('player_fork', 190, 210, 23, 60, 2);
	SpritePack.Fight.Sprites.PLAYER_DODGE = new Sprites.Animation('player_dodge', 83, 182, 23, 60, 2);
	SpritePack.Fight.Sprites.PLAYER_HIT = new Sprites.Animation('player_hit', 51, 120, 23, 40, 2);

	SpritePack.Fight.Sprites.OPPONENT_INTRO = new Sprites.Animation('opponent_intro', 203, 167, 25, 60, 2);
	SpritePack.Fight.Sprites.OPPONENT_FORK = new Sprites.Animation('opponent_fork', 211, 259, 23, 60, 2);
	SpritePack.Fight.Sprites.OPPONENT_DODGE = new Sprites.Animation('opponent_dodge', 108, 116, 23, 60, 2);
	SpritePack.Fight.Sprites.OPPONENT_HIT = new Sprites.Animation('opponent_hit', 102, 124, 23, 40, 2);

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

	//pour tout initialiser bien comme il faut, sans dupliquer les textures
	for (var i = 0; i < SpritePack.Crops.spriteList.length; i++) {
		if (SpritePack.Crops.spriteList[i].name.match('corn')) {
			SpritePack.Crops.spriteList[i].imageInfo = SpritePack.Crops.Sprites.CORN_WHITE.image;
		} else if (SpritePack.Crops.spriteList[i].name.match('tomato')) {
			SpritePack.Crops.spriteList[i].imageInfo = SpritePack.Crops.Sprites.TOMATO_WHITE.image;
		} else if (SpritePack.Crops.spriteList[i].name.match('wheat')) {
			SpritePack.Crops.spriteList[i].imageInfo = SpritePack.Crops.Sprites.WHEAT_WHITE.image;
		}
	}

	//MapItems.TileItems.Crop.Type.corn.sprite = SpritePack.Crops.Sprites.CORN;
	/*MapItems.TileItems.Crop.Type.corn.spriteBarrel = SpritePack.Storages.Sprites.BARREL_CORN;
	 MapItems.TileItems.Crop.Type.corn.spriteBox = SpritePack.Storages.Sprites.BOX_CORN;
	 MapItems.TileItems.Crop.Type.corn.spriteIceBox = SpritePack.Storages.Sprites.ICE_BOX_CORN;

	 //MapItems.TileItems.Crop.Type.tomato.sprite = SpritePack.Crops.Sprites.TOMATO;
	 MapItems.TileItems.Crop.Type.tomato.spriteBarrel = SpritePack.Storages.Sprites.BARREL_TOMATO;
	 MapItems.TileItems.Crop.Type.tomato.spriteBox = SpritePack.Storages.Sprites.BOX_TOMATO;
	 MapItems.TileItems.Crop.Type.tomato.spriteIceBox = SpritePack.Storages.Sprites.ICE_BOX_TOMATO;

	 //MapItems.TileItems.Crop.Type.wheat.sprite = SpritePack.Crops.Sprites.WHEAT;
	 MapItems.TileItems.Crop.Type.wheat.spriteBarrel = SpritePack.Storages.Sprites.BARREL_WHEAT;
	 MapItems.TileItems.Crop.Type.wheat.spriteBox = SpritePack.Storages.Sprites.BOX_WHEAT;
	 MapItems.TileItems.Crop.Type.wheat.spriteIceBox = SpritePack.Storages.Sprites.ICE_BOX_WHEAT;
	 */
	//SpritePack.Buildings.Type.HOME.sprite = SpritePack.Buildings.Sprites.HOME;
	MapItems.TileItems.Building.Type.barn.sprite = SpritePack.Buildings.Sprites.BARN;
	MapItems.TileItems.Building.Type.cold_storage.sprite = SpritePack.Buildings.Sprites.COLD_STORAGE;
	MapItems.TileItems.Building.Type.silo.sprite = SpritePack.Buildings.Sprites.SILO;

}