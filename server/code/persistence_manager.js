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
 */

var redis = require("redis");

var PersistenceManager = {
	keys: {
		databaseVersion: "databaseVersion",
		lastPersistDate: "lastPersistDate"
	},
	databaseVersion: 1,
	client: null,
	onError: function(err) {
		console.log("Redis error : " + err);
	},
	persist: function(gamestate) {
		console.log("PersistenceManager - Persisting gamestate");
		var startDate = Date.now();
		this.client.flushdb();
		this.client.set(this.keys.databaseVersion, this.databaseVersion);
		this.client.set(this.keys.lastPersistDate, startDate);
		gamestate.lastPersistDate = startDate;
		console.log("PersistenceManager - Persist done in " + Date.now() - startDate + " ms");
	},
	load: function(gamestate) {
		console.log("PersistenceManager - Loading gamestate");
		var startDate = Date.now();
		if(this.client.get(this.keys.databaseVersion))
		console.log("PersistenceManager - Loading done in " + Date.now() - startDate + " ms");
	}
};

PersistenceManager.client = redis.createClient();
PersistenceManager.client.on("error", PersistenceManager.onError);

module.exports = PersistenceManager;