// Load all the models, fucking node-fibers and node.js screwing everything up
Weapon = require('./weapon');
Storage = require('./storedCrop');
Crop = require('./crop');
Building = require('./building');
Tile = require('./tile');
Farmer = require('./farmer');
NetworkEngine = require('../network/engine');

module.exports = {
	farmers: [],
	autoPersisterId: null,
	pauseAutoPersistence: false,
	paused: false,
	startDate: Date.now(),
	lastPersistDate: 0,
	tickCount: 0,
	settings: {
		fertilizerCost: 20,
		wateringCost: 5,
		healPerSecond: 1,
		tileCost: 100, //Price for taking a neutral tile
		inventorySize: 5, //Max items a farmer can carry
		tickRate: 2500, //Time between ticks in mS
		startMoney: 1000, //Still dollars
		playerRefreshDelay: 1500,//Time in ms before the refresh of a player
		//Here are the reference instances of the objects
		//If they are modified, everything using them will reflect the change
		//If they break, THINGS WILL GO TO HELL SO BE CAREFUL FUTURE-ME !
		weapons: Weapon.Types,
		crops: Crop.Types,
		buildings: Building.Types
	},
	rain: {
		isRaining: true, // For init purposes, first tick will correct it
		timeLeft: 0,
		defaultDuration: 70, // 3 minutes of rain
		interval: 360, // 15 minutes of good weather
		humidification: 0.1 // How much humidity rises per 2 tick
	},
	board: {
		size: {
			x: 0,
			y: 0
		},
		storedCrops: {},
		tiles: [], //Please only add instances of Tile here. [x,y]

		/**
		 @param {StoredCrop} storedCrop
		 */
		addStoredCrop: function (storedCrop) {
			this.storedCrops[storedCrop.id] = storedCrop;
			NetworkEngine.clients.getConnectionForFarmer(storedCrop.owner).send("game.storedCropUpdated", {
				storedCrop: storedCrop.getSmallStoredCrop()
			});
		},

		/**
		 @param {StoredCrop} storedCrop
		 */
		removeStoredCrop: function (storedCrop) {
			delete this.storedCrops[storedCrop.id];
			NetworkEngine.clients.getConnectionForFarmer(storedCrop.owner).send("game.storedCropDeleted", {
				id: storedCrop.id
			});
		},

		/**
		 @param {Farmer} farmer
		 @return {Tile}
		 */
		getAliasableTileForFarmer: function (farmer) {
			return this.tiles[farmer.last_pos.y][farmer.last_pos.x].getAliasableSelf();
		},

		/**
		 @param {Farmer} farmer
		 @return {Tile}
		 */
		getTileForFarmer: function (farmer) {
			return this.tiles[farmer.last_pos.y][farmer.last_pos.x];
		},


		//Inits a 8x8 grid
		init: function () {
			//We tell the board that it is already 16 tiles long
			//But it's not, since it's size_y is 0
			//Grow Y will take care of filling everything without any hack this way
			this.size.x = 16;
			GameState.board.growY(16);
		},
		grow: function (x, y) {
			this.growX(x);
			this.growY(y);
		},
		//A map can only be grown by a multiple of 4 (eases band generation)
		growX: function (size) {
			if (size <= 0) {
				throw "Invalid growth size";
			}
			if (size % 4 != 0) {
				throw "Growth size must be a multiple of 4";
			}
			//Generate 4xGrowth_size sized blocks.
			//The width of the board will tell how muck blocks need to be created.
			var old_size_x = this.size.x;
			this.size.x += size;
			this.writeTileLines(old_size_x, 0, this.generateTileLines(4, this.size.y, size / 4));
		},
		growY: function (size) {
			if (size <= 0) {
				throw "Invalid growth size";
			}
			if (size % 4 != 0) {
				throw "Growth size must be a multiple of 4";
			}
			//Same as growX above, but with 4 x Growth_size sized blocks
			var old_size_y = this.size.y;
			GameState.board.size.y += size;
			this.writeTileLines(0, old_size_y, this.generateTileLines(4, size, this.size.x / 4));
		},
		writeTileLines: function (base_x, base_y, tile_lines) {
			var x = base_x;
			var y = base_y;
			tile_lines.forEach(function (tile_line) {
				if (x >= GameState.board.size.x) {
					//If x is out of bounds, lets write the next line
					x = base_x;
					y++;
					if (y >= GameState.board.size.y) {
						//This should never happen.
						//TODO : Remove after debug
						throw "y (" + y + ") exceeds size_y (" + GameState.board.size.y + ") in growY";
					}
				}
				if (typeof GameState.board.tiles[y] == 'undefined') {
					GameState.board.tiles[y] = [];
				}
				tile_line.forEach(function (tile) {
					tile.position.x = x;
					tile.position.y = y;
					GameState.board.tiles[y][x] = tile;
					x++;
				});
			});
		},
		generateTileLines: function (size_x, size_y, count) {
			var lowFertility;
			var highHumidity;
			var tile;
			var lines = [];
			var line;
			for (var i = 0; i < count * size_y; i++) {
				line = [];
				//80% of chances to be a fertile ground
				//Calculate fertility by 4x1 bands
				//90% of chances to have a medium humidity ground
				lowFertility = (Math.random() <= 0.2);
				highHumidity = (Math.random() <= 0.1);
				for (var j = 0; j < size_x; j++) {
					tile = new Tile();
					//Fertile ground output a max fertility of 70-100%
					//Non fertile is 2-32%
					tile.max_fertility = (lowFertility ? 0.02 : 0.70) + Math.random() * 0.3;
					tile.fertility = tile.max_fertility;
					tile.humidity = (highHumidity ? (0.70 + Math.random() * 0.3) :
						(0.30 + Math.random() * 0.4));
					line.push(tile);
				}
				lines.push(line);
			}
			return lines;
		},
		print: function () {
			console.log("Current GameState board tiles :");
			var line;
			for (var i = 0; i < this.size.y; i++) {
				line = "";
				for (var j = 0; j < this.size.x; j++) {
					if (typeof this.tiles[i][j] != 'undefined') {
						if (this.tiles[i][j].max_fertility >= .75) line += '█';
						else if (this.tiles[i][j].max_fertility >= .50) line += '▓';
						else if (this.tiles[i][j].max_fertility >= .25) line += '▒';
						else line += '░';
					} else {
						line += 'u';
					}
				}
				console.log(line);
			}
		}
	}
};

var GameState = module.exports;