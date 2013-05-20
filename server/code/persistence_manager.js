/*
 * Turn my head
 * Off
 * Forever
 * Turn it off
 * Forever
 * http://www.youtube.com/watch?v=yLuOzNeHw5I
 */

/*
 * Persistence manager will take care of saving the internal game data into redis.
 * Of course, it will also be able to load the saved data, otherwise there is no point in doing this.
 * I may write documentation for this someday.
 * Uses redis, node-fibers, asyncblock.
 * https://github.com/scriby/asyncblock/blob/master/docs/overview.md
 */

var redis = require("redis");
var Farmer = require('./models/farmer');
var Tile = require('./models/tile');

var PersistenceManager = {
	asyncblock: null,
	keys: {
		databaseVersion: null,
		lastPersistDate: null,
		farmersPrefix: null,
		settingsPrefix: null,
		tickRate: null,
		startMoney: null,
		weaponsPrefix: null,
		cropPrefix: null,
		buildingsPrefix: null,
		boardPrefix: null,
		boardSizeX: null,
		boardSizeY: null,
		boardTilesPrefix: null
	},
	databaseVersion: 1,
	client: null,
	onError: function(err) {
		console.log("Redis error : " + err);
	},
	persist: function(gamestate, callback) {
		this.asyncblock((function(flow) {
			console.log("PersistenceManager - Persisting gamestate");
			var startDate = Date.now();
			this.client.flushdb(flow.add());
			flow.wait();
			this.client.set(this.keys.databaseVersion, this.databaseVersion, flow.add());
			this.client.set(this.keys.lastPersistDate, startDate, flow.add());
			flow.wait();
			gamestate.farmers.forEach((function(farmer) {
				// Key : farmer:<nickname>
				this.client.hmset(this.keys.farmersPrefix + farmer.nickname, farmer.getPersistable(), flow.add());
			}).bind(this));
			gamestate.board.tiles.forEach((function(tileLine) {
				tileLine.forEach((function(tile) {
					// Key : board:tile:<x>:<y>
					this.client.hmset(this.keys.boardTilesPrefix + tile.position.x + ":" + tile.position.y, tile.getPersistable(), flow.add());
				}).bind(this));
			}).bind(this));
			this.client.set(this.keys.tickRate, gamestate.settings.tickRate, flow.add());
			this.client.set(this.keys.startMoney, gamestate.settings.startMoney, flow.add());
			this.client.set(this.keys.boardSizeX, gamestate.board.size.x, flow.add());
			this.client.set(this.keys.boardSizeY, gamestate.board.size.y, flow.add());
			flow.wait();
			gamestate.lastPersistDate = startDate;
			console.log("PersistenceManager - Persist done in " + (Date.now() - startDate) + " ms");
			return true;
		}).bind(this), callback);
	},
	load: function(gamestate, callback) {
		this.asyncblock((function(flow) {
			console.log("PersistenceManager - Loading gamestate");
			var startDate = Date.now();
			// This syntax allows me to get the database value in a synchronous way
			// Not really elegant but source transformation is quite bugged
			var dbPersistedVer = flow.sync(this.client.get(this.keys.databaseVersion, flow.callback()));
			if(dbPersistedVer == null) {
				console.log("PersistenceManager - Loading gamestate failed. Nothing in database.");
				return false;
			}
			if(dbPersistedVer != this.databaseVersion) {
				console.log("PersistenceManager - Loading gamestate failed. Stored db ver = " + dbPersistedVer + ", current is " +  + ".");
				return false;
			}
			this.client.get(this.keys.tickRate, flow.set(this.keys.tickRate));
			this.client.get(this.keys.startMoney, flow.set(this.keys.startMoney));
			this.client.get(this.keys.boardSizeX, flow.set(this.keys.boardSizeX));
			this.client.get(this.keys.boardSizeY, flow.set(this.keys.boardSizeY));
			this.client.get(this.keys.lastPersistDate, flow.set(this.keys.lastPersistDate));
			this.client.keys(this.keys.boardTilesPrefix, flow.set('tilesKeys'));
			this.client.keys(this.keys.farmersPrefix, flow.set('farmersKeys'));
			gamestate.settings.tickRate = flow.get(this.keys.tickRate);
			gamestate.settings.startMoney = flow.get(this.keys.startMoney);
			gamestate.board.size.x = flow.get(this.keys.boardSizeX);
			gamestate.board.size.y = flow.get(this.keys.boardSizeY);
			var farmersKeys = flow.get('farmersKeys');
			var tilesKeys = flow.get('tilesKeys');
			farmersKeys.forEach((function(key) {
				this.client.hgetall(key, flow.add(key));
			}).bind(this));
			var dbFarmers = flow.wait();
			tilesKeys.forEach((function(key) {
				this.client.hgetall(key, flow.add(key));
			}).bind(this));
			var dbTiles = flow.wait();

			var farmers = {};
			gamestate.farmers = [];
			// Do this once, we'll loop again after that.
			// Otherwise we won't be able to populate allied_farmers correctly !
			for(var key in dbFarmers) {
				var farmer = dbFarmers[key];
				var tmpFarmer = new Farmer();
				tmpFarmer.nickname = farmer.nickname;
				farmers[farmer.nickname] = tmpFarmer;
				gamestate.farmers.push(tmpFarmer);
			}

			for(var key in dbFarmers) {
				var farmer = dbFarmers[key];
				var tmpFarmer = farmers[farmer.nickname];
				tmpFarmer.email = farmer.email;
				tmpFarmer.password = farmer.password;
				tmpFarmer.last_pos.x = farmer.last_pos_x;
				tmpFarmer.last_pos.y = farmer.last_pos_y;
				tmpFarmer.money = farmer.money;
				tmpFarmer.weapons = [];
				JSON.parse(farmer.weapons).forEach((function(key) {
					// We consider that the database is consistent and the stored weapons still exist.
					tmpFarmer.weapons.push(gamestate.settings.weapons[key]);
				}).bind(this));
				tmpFarmer.allied_farmers = [];
				JSON.parse(farmer.allied_farmers).forEach((function(key) {
					// We consider that the database is consistent and the farmers exist.
					tmpFarmer.allied_farmers.push(farmers[key]);
				}).bind(this));
			}

			gamestate.board.tiles = [];
			for(y = 0; y < gamestate.board.size.y; y++) {
				gamestate.board.tiles[y] = [];
			}
			for(var key in dbTiles) {
				var tile = dbTiles[key];
				var tmpTile = new Tile();
				tmpTile.position.x = tile.pos_x;
				tmpTile.position.y = tile.pos_y;
				tmpTile.humidity = tile.humidity;
				tmpTile.fertility = tile.fertility;
				tmpTile.max_fertility = tile.max_fertility;
				tmpTile.maturity = tile.maturity;
				if(tile.owner != "dummy") {
					// We consider that the database is consistent bla bla
					tmpTile.owner = farmers[tile.owner];
				}
				if(tile.crop != "dummy") {
					// We consider that bla bla bla
					tmpTile.crop = gamestate.settings.crops[tile.crop];
				}
				if(tile.building != "dummy") {
					// Oh come on you should know the deal by now
					tmpTile.building = gamestate.settings.buildings[tile.building];
				}
				gamestate.board.tiles[tmpTile.position.y][tmpTile.position.x];
			}

			console.log("PersistenceManager - Loading done in " + (Date.now() - startDate) + " ms");
			return true;
		}).bind(this), callback);
	}
};

// Populate keys here. We can't do this before because some values depend on others.
PersistenceManager.keys.databaseVersion= "databaseVersion";
PersistenceManager.keys.lastPersistDate = "lastPersistDate";
PersistenceManager.keys.farmersPrefix = "farmer:";
PersistenceManager.keys.settingsPrefix = "settings:";
PersistenceManager.keys.tickRate = PersistenceManager.keys.settingsPrefix + "tickRate";
PersistenceManager.keys.startMoney = PersistenceManager.keys.settingsPrefix + "startMoney";
PersistenceManager.keys.weaponsPrefix = PersistenceManager.keys.settingsPrefix + "weapon:";
PersistenceManager.keys.cropPrefix = PersistenceManager.keys.settingsPrefix + "crop:";
PersistenceManager.keys.buildingsPrefix = PersistenceManager.keys.settingsPrefix + "building:";
PersistenceManager.keys.boardPrefix = "board:";
PersistenceManager.keys.boardSizeX = PersistenceManager.keys.boardPrefix + "size:x";
PersistenceManager.keys.boardSizeY = PersistenceManager.keys.boardPrefix + "size:y";
PersistenceManager.keys.boardTilesPrefix = PersistenceManager.keys.boardPrefix + "tile:";


// Synchronous node.js, deal with it.
PersistenceManager.asyncblock = require('asyncblock');
PersistenceManager.client = redis.createClient();
PersistenceManager.client.on("error", PersistenceManager.onError);

module.exports = PersistenceManager;