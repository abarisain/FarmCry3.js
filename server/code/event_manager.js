GameState = require('./models/gamestate');
NetworkEngine = require('./network/engine');
Chat = require('./network/modules/chat');
StoredCrop = require('./models/storedCrop');

var EventManager = {
	tick: function () {
		var tickStart = Date.now();
		console.log("Event manager tick - " + tickStart);

		// TODO : Add rain/Tornados

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
					EventManager.subsystems.player.substractMoney(tile.owner, tile.building.price_tick);
					// The stored crops are whithered somewhere else, stop processing this tile
					continue;
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
						// No need to check for rottenness, since rotten means tha time_left equals 0
						if (tile.growingCrop.time_left > 0) {
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
				 */

				// So now, make it more fertile over time
				tileValueUpdated = false;
				/* Todo : check if raining
				 if(tile.humidity < 1) {
				 tileValueUpdated = true;
				 tile.humidity = Math.min(1, tile.humidity + 0.01);
				 }*/
				if (tile.fertility < tile.max_fertility) {
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
			NetworkEngine.clients.broadcast("game.tileDataUpdated", {
				tiles: smallUpdatedTiles
			});
		}

		//Schedule the next tick. We don't use setInterval because the tick might change at anytime
		setTimeout(EventManager.tick, GameState.settings.tickRate);
		console.log("Event manager tick end - " + (Date.now() - tickStart));
	},
	subsystems: {
		player: {
			connected: function (newConnection, farmer) {
				farmer.logged_in = true;
				//Disconnect already connected clients, but check for socket id so we don't disconnect ourselves
				var clientCount = NetworkEngine.clients.list.length;
				var connection;
				for (var i = 0; i < clientCount; i++) {
					connection = NetworkEngine.clients.list[i];
					if (typeof connection == 'undefined') {
						//This should never happen, but I'm tired of crashing because of this
					}
					if (connection.farmer.email == farmer.email &&
						connection.socket.id != newConnection.socket.id) {
						connection.socket.disconnect();
						//There should not be any ghost left, this needs to be tested
						//But due to the single threaded nature of node, even some asyncness won't matter
						break;
					}
				}
				Chat.sendServerMessage(newConnection, "Welcome to FarmCry, " + farmer.nickname + " !");
				Chat.broadcastServerMessage(farmer.nickname + " signed in");
				NetworkEngine.clients.broadcast("player.connected", {
					farmer: farmer.getMinimalFarmer()
				}, null, newConnection);
			},
			disconnected: function (farmer) {
				if (farmer == null) {
					return;
				}
				//Check if it was a ghost disconnection (the farmer connected but disconnected the other client)
				var isGhost = false;
				var clientCount = NetworkEngine.clients.list.length;
				for (var i = 0; i < clientCount; i++) {
					if (NetworkEngine.clients.list[i].farmer.email == farmer.email) {
						isGhost = true;
						break;
					}
				}
				if (!isGhost) {
					farmer.logged_in = false;
					Chat.broadcastServerMessage(farmer.nickname + " signed out");
					NetworkEngine.clients.broadcast("player.disconnected", {
						nickname: farmer.nickname
					});
				}
			},
			move: function (farmer, x, y) {
				x = Math.floor(x);
				y = Math.floor(y);
				var newX = farmer.last_pos.x + x;
				var newY = farmer.last_pos.y + y;
				//TODO : Re-enable this to disallow teleportation
				if (/*x < -1 || x > 1 || y < -1 || y > 1 || */newX >= GameState.board.size.x || newY >= GameState.board.size.y
					|| newX < 0 || newY < 0) {
					return false;
				}
				farmer.last_pos.x = newX;
				farmer.last_pos.y = newY;
				//TODO : Send events only to people in the viewport
				NetworkEngine.clients.broadcast("player.moved", {
					nickname: farmer.nickname,
					col: farmer.last_pos.x,
					line: farmer.last_pos.y
				});
				return true;
			},
			addMoney: function (farmer, amount) {
				if (amount == 0)
					return true;
				if (amount < 0)
					return false;
				farmer.money += amount;
				NetworkEngine.clients.getConnectionForFarmer(farmer).send("player.moneyUpdated", {
					money: farmer.money
				});
				return true;
			},
			substractMoney: function (farmer, amount) {
				if (amount == 0)
					return true;
				if (amount < 0 || farmer.money < amount)
					return false;
				farmer.money -= amount;
				NetworkEngine.clients.getConnectionForFarmer(farmer).send("player.moneyUpdated", {
					money: farmer.money
				});
				return true;
			},
			addHealth: function (farmer, health) {
				if (health == 0)
					return true;
				if (health < 0)
					return false;
				var oldHealth = farmer.health;
				farmer.health = Math.min(100, farmer.health + health);
				if (oldHealth != farmer.health) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("player.healthUpdated", {
						health: farmer.health
					});
				}
				return true;
			},
			substractHealth: function (farmer, health) {
				if (health == 0)
					return true;
				var oldHealth = farmer.health;
				farmer.health = Math.max(0, farmer.health - health);
				if (oldHealth != farmer.health) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("player.healthUpdated", {
						health: farmer.health
					});
				}
				return true;
			},
			buyCrop: function (farmer, cropType) {
				var targetTile = GameState.board.getAliasableTileForFarmer(farmer);
				if (!targetTile.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You cannot buy a crop on a land you don't own !"
					});
					return false;
				}
				if (!targetTile.hasGrowingCrop() && !targetTile.hasBuilding()) {
					var cropInfo = GameState.settings.crops[cropType];
					if (!this.substractMoney(farmer, cropInfo.seed_price)) {
						NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
							title: null,
							message: "You do not have enough money for this seed !"
						});
						return false;
					}
					targetTile.initGrowingCrop(cropInfo);
					NetworkEngine.clients.broadcast("game.growingCropUpdated", {
						growingCrop: targetTile.growingCrop,
						col: targetTile.position.x,
						line: targetTile.position.y
					});
					return true;
				}
				return false;
			},
			harvestCrop: function (farmer) {
				var targetTile = GameState.board.getAliasableTileForFarmer(farmer);
				if (targetTile.isOwnedBy(farmer) && targetTile.hasGrowingCrop()) {
					// Harvesting a rotten or non mature tile products nothing
					// Note that a mature and non rotten growingCrop MUST be harvested and put in the player's inventory
					// You can NOT delete it if it's viable
					if (!targetTile.growingCrop.rotten && targetTile.growingCrop.harvested_quantity > 0) {
						/*
						 If the inventory is full, abort the harvest and tell the user that it's inventory is full
						 Of course, even if the inventory is full, a rotten/non mature crop can be deleted.
						 */
						var tmpStored = new StoredCrop(GameState.settings.crops[targetTile.growingCrop.codename],
							farmer,
							targetTile.growingCrop.harvested_quantity
						);

						if (!this.addToInventory(farmer, tmpStored)) {
							return false; // If there is no room, then stop
						}
						GameState.board.addStoredCrop(tmpStored);
					}
					targetTile.resetGrowingCrop();
					NetworkEngine.clients.broadcast("game.growingCropUpdated", {
						growingCrop: targetTile.hasGrowingCrop() ? targetTile.growingCrop : null,
						col: targetTile.position.x,
						line: targetTile.position.y
					});
					return true;
				}
				return false;
			},
			buyBuilding: function (farmer, buildingType) {
				var targetTile = GameState.board.getAliasableTileForFarmer(farmer);
				if (!targetTile.isOwnedBy(farmer)) {
					NetworkEngine.clients.broadcast("game.error", {
						title: null,
						message: "You cannot buy a building on a land you don't own !"
					});
					return false;
				}
				if (!targetTile.hasGrowingCrop() && !targetTile.hasBuilding()) {
					var buildingInfo = GameState.settings.buildings[buildingType];
					if (!this.substractMoney(farmer, buildingInfo.price)) {
						NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
							title: null,
							message: "You do not have enough money for this building !"
						});
						return false;
					}
					farmer.money -= buildingInfo.price;
					targetTile.building = GameState.settings.buildings[buildingType];
					targetTile.storedCrops = []; // This should not be polluted but clear it anyway, just to be safe
					NetworkEngine.clients.broadcast("player.buildingUpdated", {
						nickname: farmer.nickname,
						building: { codename: targetTile.building.codename },
						col: targetTile.position.x,
						line: targetTile.position.y
					});
					return true;
				}
				return false;
			},
			destroyBuilding: function (farmer) {
				var targetTile = GameState.board.getAliasableTileForFarmer(farmer);
				if (targetTile.isOwnedBy(farmer) && targetTile.hasBuilding()) {
					// TODO : Take care of the storedCrops. Forbid building removal or just do something.
					targetTile.building = null;
					NetworkEngine.clients.broadcast("player.buildingUpdated", {
						nickname: farmer.nickname,
						building: null,
						col: targetTile.position.x,
						line: targetTile.position.y
					});
					return true;
				}
				return false;
			},
			takeCurrentTile: function (farmer) {
				// If you attack a tile with a building on it, you will (read not implemented yet) inherit the building and what's in it
				var targetTile = GameState.board.getAliasableTileForFarmer(farmer);
				if (targetTile.isNeutral()) {
					this.changeTileOwner(targetTile, farmer);
				} else if (!targetTile.isOwnedBy(farmer)) {
					var healthLossMine = 10 + Math.ceil(10 * Math.random()) * 5;
					var healthLossTheirs = 10 + Math.ceil(10 * Math.random()) * 5;
					this.substractHealth(farmer, healthLossMine);
					this.substractHealth(targetTile.owner, healthLossTheirs);
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("player.launchBattle", {
						health_loss_mine: healthLossMine,
						health_loss_theirs: healthLossTheirs
					});
					NetworkEngine.clients.getConnectionForFarmer(targetTile.owner).send("player.launchBattle", {
						health_loss_mine: healthLossTheirs,
						health_loss_theirs: healthLossMine
					});

					// If the ennemy died and we DID NOT die, we won
					console.log("Battle against " + farmer.nickname + "(lost " + healthLossMine + " remaining " + farmer.health + " )" + " and "
						+ targetTile.owner.nickname + "(lost " + healthLossTheirs + " remaining " + targetTile.owner.health + " )");
					if (targetTile.owner.isDead() && !farmer.isDead()) {
						this.changeTileOwner(targetTile, farmer);
					}
				}
				return true;
			},
			changeTileOwner: function (tile, farmer) {
				// Take the building/growingCrop too, but destroy any storedCrop
				tile.storedCrops.forEach(function (tileStoredCrop) {
					GameState.board.removeStoredCrop(tileStoredCrop);
				});
				tile.storedCrops.length = 0; // According to the spec, clears the array
				tile.owner = farmer;
				NetworkEngine.clients.broadcast("game.tileOwnerUpdated", {
					owner: tile.owner.nickname,
					col: tile.position.x,
					line: tile.position.y
				});
			},

			/**
			 * @param {Farmer} farmer
			 * @param {StoredCrop} storedCrop
			 */
			addToInventory: function (farmer, storedCrop) {
				var inventoryLength = farmer.inventory.length;
				if (farmer.inventory.length >= GameState.settings.inventorySize) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You do not have enough room in your inventory !"
					});
					return false;
				}
				var itemFound = false;
				for (var i = 0; i < inventoryLength; i++) {
					if (farmer.inventory[i].id === storedCrop.id) {
						itemFound = true;
						break;
					}
				}
				if (itemFound)
					return true;
				farmer.inventory.push(storedCrop);
				NetworkEngine.clients.getConnectionForFarmer(farmer).send("player.inventoryItemAdded", {
					id: storedCrop.id
				});
				return true;
			},

			/**
			 * @param {Farmer} farmer
			 * @param {StoredCrop} storedCrop
			 */
			removeFromInventory: function (farmer, storedCrop) {
				var inventoryLength = farmer.inventory.length;
				for (var i = inventoryLength - 1; i >= 0; i--) {
					if (farmer.inventory[i].id === storedCrop.id) {
						farmer.inventory.removeItemAtIndex(i);
						NetworkEngine.clients.getConnectionForFarmer(farmer).send("player.inventoryItemRemoved", {
							id: storedCrop.id
						});
						return true;
					}
				}
				return false;
			}
		}
	}
};

module.exports = EventManager;