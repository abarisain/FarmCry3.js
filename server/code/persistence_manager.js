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
var GameState = require('./models/gamestate');

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
	defaultPersistCallback: function(err) {
		if(err != null) {
			console.log("PersistenceManager - Error while persisting : " + err);
		}
	},
	persist: function(callback) {
		this.asyncblock((function(flow) {
			return;
			console.log("PersistenceManager - Persisting gamestate");
			var startDate = Date.now();
			this.client.flushdb(flow.add());
			flow.wait();
			this.client.set(this.keys.databaseVersion, this.databaseVersion, flow.add());
			this.client.set(this.keys.lastPersistDate, startDate, flow.add());
			flow.wait();
			GameState.farmers.forEach((function(farmer) {
				// Key : farmer:<nickname>
				this.client.hmset(this.keys.farmersPrefix + farmer.nickname, farmer.getPersistable(), flow.add());
			}).bind(this));
			GameState.board.tiles.forEach((function(tileLine) {
				tileLine.forEach((function(tile) {
					// Key : board:tile:<y>:<x>
					this.client.hmset(this.keys.boardTilesPrefix + tile.position.y + ":" + tile.position.x, tile.getPersistable(), flow.add());
				}).bind(this));
			}).bind(this));
			this.client.set(this.keys.tickRate, GameState.settings.tickRate, flow.add());
			this.client.set(this.keys.startMoney, GameState.settings.startMoney, flow.add());
			this.client.set(this.keys.boardSizeX, GameState.board.size.x, flow.add());
			this.client.set(this.keys.boardSizeY, GameState.board.size.y, flow.add());
			flow.wait();
			GameState.lastPersistDate = startDate;
			console.log("PersistenceManager - Persist done in " + (Date.now() - startDate) + " ms, at " + startDate);
			return true;
		}).bind(this), callback);
	},
	load: function(callback) {
		this.asyncblock((function(flow) {
			return;
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
			this.client.keys(this.keys.boardTilesPrefix + "*", flow.set('tilesKeys'));
			this.client.keys(this.keys.farmersPrefix + "*", flow.set('farmersKeys'));
			GameState.settings.tickRate = parseInt(flow.get(this.keys.tickRate));
			GameState.settings.startMoney = parseInt(flow.get(this.keys.startMoney));
			GameState.board.size.x = parseInt(flow.get(this.keys.boardSizeX));
			GameState.board.size.y = parseInt(flow.get(this.keys.boardSizeY));
			GameState.lastPersistDate = parseInt(flow.get(this.keys.lastPersistDate));
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
			GameState.farmers = [];
			// Do this once, we'll loop again after that.
			// Otherwise we won't be able to populate allied_farmers correctly !
			for(var key in dbFarmers) {
				var farmer = dbFarmers[key];
				var tmpFarmer = new Farmer();
				tmpFarmer.nickname = farmer.nickname;
				farmers[farmer.nickname] = tmpFarmer;
				GameState.farmers.push(tmpFarmer);
			}

			for(var key in dbFarmers) {
				var farmer = dbFarmers[key];
				var tmpFarmer = farmers[farmer.nickname];
				tmpFarmer.email = farmer.email;
				tmpFarmer.password = farmer.password;
				tmpFarmer.last_pos.x = parseInt(farmer.last_pos_x);
				tmpFarmer.last_pos.y = parseInt(farmer.last_pos_y);
				tmpFarmer.money = parseInt(farmer.money);
				tmpFarmer.weapons = [];
				JSON.parse(farmer.weapons).forEach((function(key) {
					// We consider that the database is consistent and the stored weapons still exist.
					tmpFarmer.weapons.push(GameState.settings.weapons[key]);
				}).bind(this));
				tmpFarmer.allied_farmers = [];
				JSON.parse(farmer.allied_farmers).forEach((function(key) {
					// We consider that the database is consistent and the farmers exist.
					tmpFarmer.allied_farmers.push(farmers[key]);
				}).bind(this));
			}

			GameState.board.tiles = [];
			for(y = 0; y < GameState.board.size.y; y++) {
				GameState.board.tiles[y] = [];
			}
			for(var key in dbTiles) {
				var tile = dbTiles[key];
				var tmpTile = new Tile();
				tmpTile.position.x = parseInt(tile.pos_x);
				tmpTile.position.y = parseInt(tile.pos_y);
				tmpTile.humidity = parseFloat(tile.humidity);
				tmpTile.fertility = parseFloat(tile.fertility);
				tmpTile.max_fertility = parseFloat(tile.max_fertility);
				tmpTile.maturity = parseFloat(tile.maturity);
				if(tile.owner != "dummy") {
					// We consider that the database is consistent bla bla
					tmpTile.owner = farmers[tile.owner];
				}
				if(tile.crop != "dummy") {
					// We consider that bla bla bla
					tmpTile.crop = GameState.settings.crops[tile.crop];
				}
				if(tile.building != "dummy") {
					// Oh come on you should know the deal by now
					tmpTile.building = GameState.settings.buildings[tile.building];
				}
				GameState.board.tiles[tmpTile.position.y][tmpTile.position.x] = tmpTile;
			}

			console.log("PersistenceManager - Loading done in " + (Date.now() - startDate) + " ms");
			return true;
		}).bind(this), callback);
	}
};

// Populate keys here. We can't do this before because some values depend on others.
PersistenceManager.keys.databaseVersion = "databaseVersion";
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