GameState = require('./models/gamestate');
NetworkEngine = require('./network/engine');
EventManager = require('./event_manager');
Chat = require('./network/modules/chat');
StoredCrop = require('./models/storedCrop');

module.exports = function () {
	var tickStart = Date.now();

	// TODO : Add Tornados
	// Only decrement if > 0, -1 means forced rain
	if(GameState.rain.timeLeft > 0) {
		GameState.rain.timeLeft--;
	}
	if(GameState.rain.timeLeft == 0) {
		if(GameState.rain.isRaining) {
			// It was raining, no time left, stops raining
			EventManager.subsystems.game.rainStop(false);
		} else {
			// It was not raining, no time left, starts raining
			EventManager.subsystems.game.rainStart(false);
		}
	}

	// Handle farmers
	// Heal a little (if not in combat, if we handle that someday)
	// That's it, stored crops have already been decayed
	GameState.farmers.forEach((function (currentFarmer) {
		this.addHealth(currentFarmer, GameState.settings.healPerSecond);
	}).bind(EventManager.subsystems.player));

	// Whither stored crops
	var storedCrops = GameState.board.storedCrops; // faster lookup
	var storedCrop;
	for (var key in storedCrops) {
		storedCrop = storedCrops[key];
		// If there is time left and the stored crop is not on a tile with a building that stops withering
		if (storedCrop.time_left > 0 && storedCrop.parent_tile != null && storedCrop.parent_tile.hasBuilding()
			&& storedCrop.parent_tile.building.stops_withering) {
			continue;
		}
		storedCrop.time_left--;
		NetworkEngine.clients.broadcast("game.storedCropUpdated", {
			storedCrop: storedCrop.getSmallStoredCrop()
		});
	}

	// Handle tiles changes
	// If aliased, do nothing.
	// If building on it, check if it has maintenance and suck the building's money
	// If growing crop, tick it, and decrease humidity/fertility
	// If nothing else, rise humidity/fertility slowly
	var tile;
	var targetCrop;
	var updatedTiles = [];
	var tileValueUpdated;
	for (var y = 0; y < GameState.board.size.y; y++) {
		for (var x = 0; x < GameState.board.size.x; x++) {
			tile = GameState.board.tiles[y][x];
			if (tile.getAliasableSelf() != tile) {
				// Aliased tile, don't do anything
				continue;
			}
			if (tile.hasBuilding()) {
				// Buildings are ticked every 24 ticks.
				// Buildings with no storedCrop do not subtract any money
				if(GameState.tickCount % 24 == 0 && tile.hasStoredCrops())
					EventManager.subsystems.player.substractMoney(tile.owner, tile.building.price_tick);
				// The stored crops are whithered somewhere else, stop processing this tile
				continue;
			}

			// If it's raining, every 15 ticks, humidify the tiles, but not more than 80%. Also, keep relative humidity
			if(GameState.tickCount % 15 == 0 && GameState.rain.isRaining && (tile.humidity + GameState.rain.humidification) <= 0.8) {
				tile.humidity = Math.min(0.8, tile.humidity + GameState.rain.humidification);
				if (updatedTiles.indexOf(tile) <= 0)
					updatedTiles.push(tile);
			}

			// Every 15 ticks, if not raining, if not too humid, decrease the humidity naturally, (unless there is a non-mature/non-rotten growing crop of course)
			if (GameState.tickCount % 15 == 0 && !GameState.rain.isRaining && !tile.isGrowingCropMaturing() && tile.humidity < 0.8) {
				tile.humidity = Math.max(0, tile.humidity - 0.01);
				if (updatedTiles.indexOf(tile) <= 0) {
					updatedTiles.push(tile);
				}
			}

			if (tile.hasGrowingCrop()) {
				// If it's rotten, there is nothing to do
				if (!tile.growingCrop.rotten) {
					// If it is mature already, decrease its life
					// Or, if it is not, make it mature only if humidity and fertility are > 0
					if(tile.growingCrop.harvested_quantity > 0 ||
						(tile.humidity > 0 && tile.fertility > 0)) {
						tile.growingCrop.time_left--;
					}

					if (tile.growingCrop.time_left <= 0) {
						// Whoops, its life is over
						// Was it already mature ?
						if (tile.growingCrop.harvested_quantity > 0) {
							// Boom, it's rotten now
							tile.growingCrop.rotten = true;
							tile.growingCrop.time_left = 0; // If we went < 0, should not happen but heh
						} else {
							// Now it's mature ! Yay
							// Sadly, it also starts decaying
							targetCrop = GameState.settings.crops[tile.growingCrop.codename];
							// TODO : implement health pondering of productivity
							tile.growingCrop.harvested_quantity = targetCrop.productivity;
							tile.growingCrop.time_left = targetCrop.decay_time;
						}
					}
					NetworkEngine.clients.broadcast("game.growingCropUpdated", {
						growingCrop: tile.growingCrop,
						col: tile.position.x,
						line: tile.position.y
					});


					// We need to check that again. Because time_left might have been changed by the maturation logic
					// If it is still maturing, suck the tile's ressources
					// No need to check for rottenness, since rotten means that time_left equals 0
					if (tile.isGrowingCropMaturing()) {
						// Hey its still alive ! Let's suck some ressources
						tileValueUpdated = false;
						if (tile.humidity > 0) {
							tileValueUpdated = true;
							tile.humidity = Math.max(0, tile.humidity - 0.01);
						}
						if (tile.fertility > 0) {
							tileValueUpdated = true;
							tile.fertility = Math.max(0, tile.fertility - 0.01);
						}
						if (tileValueUpdated && updatedTiles.indexOf(tile) <= 0) {
							updatedTiles.push(tile);
						}
					}
				}
				continue;
			}

			/*
			 If we got here, the tile :
			 - Not aliased
			 - Does not have a building
			 - Does not have a growing crop
			 Everything implied by any of these cases has already been taken care of
			 DO NOT FORGET THAT THE CODE IS SKIPPED IF THE CONDITIONS ARE NOT MET
			 */

			// So now, make it more fertile over time, but only if it is owned
			// Otherwise, the map maxes out too fast
			tileValueUpdated = false;
			if (!tile.isNeutral() && tile.fertility < tile.max_fertility) {
				tileValueUpdated = true;
				tile.fertility = Math.min(tile.max_fertility, tile.fertility + 0.01);
			}

			if (tileValueUpdated && updatedTiles.indexOf(tile) <= 0) {
				updatedTiles.push(tile);
			}
		}
	}

	// Now that we're done with tiles, push the updates in a more efficient format
	if (updatedTiles.length > 0) {
		var smallUpdatedTiles = [];
		updatedTiles.forEach(function (updatedTile) {
			smallUpdatedTiles.push(updatedTile.getTickUpdateTile());
		});
		NetworkEngine.clients.broadcast("game.tilesDataUpdated", {
			tiles: smallUpdatedTiles
		});
	}

	GameState.tickCount++;
	if(GameState.tickCount == 9007199254740990) { //If almost max int (closest to a multiple of 10), reset to 0
		GameState.tickCount = 0;
	}
	console.log("Tick n°" + GameState.tickCount + " - " + (Date.now() - tickStart) + " ms");
	//Schedule the next tick. We don't use setInterval because the tick might change at anytime
	setTimeout(tick, GameState.settings.tickRate);
}

var tick = module.exports;