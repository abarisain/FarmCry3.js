Weapon = require('./weapon');
Crop = require('./crop');
Storage = require('./storage');
Tile = require('./tile');

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
		size_x : 4,
		size_y : 4,
		tiles : [], //Please only add instances of Tile here. [x,y]
		grow : function (x, y) {
			this.growX(x);
			this.growY(y);
		},
		//A map can only be grown by a multiple of 4 (eases band generation)
		growX : function(size) {
			if(size <= 0) {
				throw "Invalid growth size";
			}
			if(size%4 != 0) {
				throw "Growth size must be a multiple of 4";
			}
			//Generate 4xGrowth_size sized blocks.
			//The width of the board will tell how muck blocks need to be created.
			var old_size_x = this.size_x;
			this.size_x += size;
			this.writeTileLines(old_size_x, 0, this.generateTileLines(4, this.size_y, size/4));
		},
		growY : function(size) {
			if(size <= 0) {
				throw "Invalid growth size";
			}
			if(size%4 != 0) {
				throw "Growth size must be a multiple of 4";
			}
			//Same as growX above, but with 4 x Growth_size sized blocks
			var old_size_y = this.size_y;
			GameState.board.size_y += size;
			this.writeTileLines(0, old_size_y, this.generateTileLines(4, size, this.size_x/4));
		},
		writeTileLines : function(base_x, base_y, tile_lines) {
			var x = base_x;
			var y = base_y;
			tile_lines.forEach(function(tile_line) {
				if(x >= GameState.board.size_x) {
					//If x is out of bounds, lets write the next line
					x = base_x;
					y++;
					if(y >= GameState.board.size_y) {
						//This should never happen.
						//TODO : Remove after debug
						throw "y ("+y+") exceeds size_y ("+GameState.board.size_y+") in growY";
					}
				}
				if(typeof GameState.board.tiles[y] == 'undefined') {
					GameState.board.tiles[y] = [];
				}
				GameState.board.tiles[0] = [];
				tile_line.forEach(function(tile) {
					tile.x = x;
					tile.y = y;
					GameState.board.tiles[y][x] = tile;
					x++;
				});
			});
		},
		generateTileLines : function(size_x, size_y, count) {
			var lowFertility;
			var tile;
			var lines = [];
			var line;
			for(var i = 0; i < count * size_y; i++) {
				line = [];
				//75% of chances to be a fertile ground
				//Calculate fertility by 4x1 bands
				lowFertility = (Math.random() <= 0.25);
				for(var j = 0; j < size_x; j++) {
					tile = new Tile();
					//Fertile ground output a max fertility of 70-100%
					//Non fertile is 2-32%
					tile.max_fertility = (lowFertility ? 0.02 : 0.70) + Math.random()*0.3;
					tile.fertility = tile.max_fertility;
					line.push(tile);
				}
				lines.push(line);
			}
			return lines;
		},
		print : function() {
			console.log("Current GameState board tiles :");
			var line;
			for(var i = 0; i < this.size_y; i++) {
				line = "";
				for(var j = 0; j < this.size_x; j++) {
					if(typeof this.tiles[j][i] != 'undefined') {
						line += (this.tiles[j][i].max_fertility < 0.4 ? "." : "w");
						//line+= this.tiles[j][i].x+","+this.tiles[j][i].y+"|";
					} else {
						line += 'u';
					}
				}
				console.log(line);
			}
		}
	}
};

GameState.board.grow(20,20);
GameState.board.print();
module.exports = GameState;