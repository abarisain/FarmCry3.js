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
		databaseVersion: "databaseVersion",
		lastPersistDate: "lastPersistDate",
		farmersPrefix: "farmer:",
		settingsPrefix: "settings:",
		tickRate: this.settingsPrefix + "tickRate",
		startMoney: this.settingsPrefix + "startMoney",
		weaponsPrefix: this.settingsPrefix + "weapon:",
		cropPrefix: this.settingsPrefix + "crop:",
		buildingsPrefix: this.settingsPrefix + "building:",
		boardPrefix: "board:",
		boardSizeX: this.boardPrefix + "size:x",
		boardSizeY: this.boardPrefix + "size:y",
		boardTilesPrefix: this.boardPrefix + "tile:"
	},
	databaseVersion: 1,
	client: null,
	onError: function(err) {
		console.log("Redis error : " + err);
	},
	persist: function(gamestate, callback) {
		var t = this;
		this.asyncblock(function(flow) {
			console.log("PersistenceManager - Persisting gamestate");
			var startDate = Date.now();
			t.client.flushdb(flow.add());
			flow.wait();
			t.client.set(t.keys.databaseVersion, t.databaseVersion, flow.add());
			t.client.set(t.keys.lastPersistDate, startDate, flow.add());
			flow.wait();
			for(var farmer in gamestate.farmers) {
				// Key : farmer:<nickname>
				t.client.hmset(t.keys.farmersPrefix + farmer.nickname, farmer.getPersistable(), flow.add());
			}
			for(var tile in gamestate.board.tiles) {
				// Key : board:tile:<x>:<y>
				t.client.hmset(t.keys.boardTilesPrefix + tile.position.x + ":" + tile.position.y, tile.getPersistable(), flow.add());
			}
			t.client.set(t.keys.tickRate, gamestate.settings.tickRate, flow.add());
			t.client.set(t.keys.startMoney, gamestate.settings.startMoney, flow.add());
			t.client.set(t.keys.boardSizeX, gamestate.board.size.x, flow.add());
			t.client.set(t.keys.boardSizeY, gamestate.board.size.y, flow.add());
			gamestate.lastPersistDate = startDate;
			console.log("PersistenceManager - Persist done in " + Date.now() - startDate + " ms");
		}, callback);
	},
	load: function(gamestate, callback) {
		this.asyncblock(function(flow) {
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
			console.log("PersistenceManager - Loading done in " + Date.now() - startDate + " ms");
			return true;
		}, callback);
	}
};

// Synchronous node.js, deal with it.
PersistenceManager.asyncblock = require('asyncblock');
PersistenceManager.client = redis.createClient();
PersistenceManager.client.on("error", PersistenceManager.onError);

module.exports = PersistenceManager;