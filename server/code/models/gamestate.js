Weapon = require('./weapon');
Crop = require('./crop');
Storage = require('./storage');

var GameState = {
	farmers : [],
	paused : false,
	settings : {
		tickRate : 1000, //Time between ticks in mS
		startMoney : 1000, //Still dollars
		//Here are the reference instances of the objects
		//If they are modified, everything using them will reflect the change
		//If they break, THINGS WILL GO TO HELL SO BE CAREFUL FUTURE-ME !
		weapons : Weapon.getDefaultWeapons(),
		crops : Crop.getDefaultCrops(),
		storages : Storage.getDefaultStorages()
	},
	board : {
		size_x : 20,
		size_y : 20,
		tiles : [] //Please only add instances of Tile here
	}
};

module.exports = GameState;