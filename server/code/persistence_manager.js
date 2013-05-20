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
		var t = this;
		this.asyncblock((function(flow) {
			console.log("PersistenceManager - Persisting gamestate");
			var startDate = Date.now();
			this.client.flushdb(flow.add());
			flow.wait();
			this.client.set(t.keys.databaseVersion, t.databaseVersion, flow.add());
			this.client.set(t.keys.lastPersistDate, startDate, flow.add());
			flow.wait();
			gamestate.farmers.forEach((function(farmer) {
				// Key : farmer:<nickname>
				this.client.hmset(t.keys.farmersPrefix + farmer.nickname, farmer.getPersistable(), flow.add());
			}).bind(this));
			gamestate.board.tiles.forEach((function(tileLine) {
				tileLine.forEach((function(tile) {
					// Key : board:tile:<x>:<y>
					this.client.hmset(t.keys.boardTilesPrefix + tile.position.x + ":" + tile.position.y, tile.getPersistable(), flow.add());
				}).bind(this));
			}).bind(this));
			this.client.set(t.keys.tickRate, gamestate.settings.tickRate, flow.add());
			this.client.set(t.keys.startMoney, gamestate.settings.startMoney, flow.add());
			this.client.set(t.keys.boardSizeX, gamestate.board.size.x, flow.add());
			this.client.set(t.keys.boardSizeY, gamestate.board.size.y, flow.add());
			gamestate.lastPersistDate = startDate;
			console.log("PersistenceManager - Persist done in " + (Date.now() - startDate) + " ms");
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