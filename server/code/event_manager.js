GameState = require('./models/gamestate');
NetworkEngine = require('./network/engine');
Chat = require('./network/modules/chat');
StoredCrop = require('./models/storedCrop');

var EventManager = {
	subsystems: {
		game: {
			/**
			 * @param {boolean} force
			 */
			rainStart: function (force) {
				GameState.rain.isRaining = true;
				if (force) {
					GameState.rain.timeLeft = -1;
				} else {
					GameState.rain.timeLeft = GameState.rain.defaultDuration;
				}
				NetworkEngine.clients.broadcast("game.rainChanged", {
					isRaining: GameState.rain.isRaining
				});
			},

			/**
			 * @param {boolean} force
			 */
			rainStop: function () {
				GameState.rain.isRaining = false;
				GameState.rain.timeLeft = GameState.rain.interval;
				NetworkEngine.clients.broadcast("game.rainChanged", {
					isRaining: GameState.rain.isRaining
				});
			}
		},
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
				var targetTile = GameState.board.getTileForFarmer(farmer);
				var buildingInfo = GameState.settings.buildings[buildingType];
				var tmpTile;
				var tmpY;
				var tmpX;
				// We need to check if he is the owner. I know we check one tile once but heh
				for (var i = 0; i < buildingInfo.size.y; i++) {
					for (var j = 0; j < buildingInfo.size.x; j++) {
						tmpY = targetTile.position.y + i;
						tmpX = targetTile.position.x + j;
						if (tmpY >= GameState.board.size.y || tmpX >= GameState.board.size.y || tmpY < 0 || tmpX < 0) {
							// Outside of the map
							NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
								title: null,
								message: "The building doesn't fit on the map !"
							});
							return false;
						}
						tmpTile = GameState.board.tiles[tmpY][tmpX];
						if (tmpTile.isAliasOf != null || !tmpTile.isOwnedBy(farmer) ||
							tmpTile.hasGrowingCrop() || tmpTile.hasBuilding()) {
							// We can't buy anything here, this is bat country
							NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
								title: null,
								message: "You cannot buy a building on a land you don't own (you need to own the adjacent tiles) or that is not free !"
							});
							return false;
						}
					}
				}
				for (var i = 0; i < buildingInfo.size.y; i++) {
					for (var j = 0; j < buildingInfo.size.x; j++) {
						if (i != 0 || j != 0) {
							GameState.board.tiles[targetTile.position.y + i][targetTile.position.x + j].isAliasOf = targetTile;
						}
					}
				}

				if (!this.substractMoney(farmer, buildingInfo.price)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You do not have enough money for this building !"
					});
					return false;
				}
				this.substractMoney(buildingInfo.price);
				targetTile.building = GameState.settings.buildings[buildingType];
				targetTile.storedCrops = []; // This should not be polluted but clear it anyway, just to be safe
				NetworkEngine.clients.broadcast("player.buildingUpdated", {
					nickname: farmer.nickname,
					building: { codename: targetTile.building.codename },
					col: targetTile.position.x,
					line: targetTile.position.y
				});
				return true;
			},
			sellBuilding: function (farmer) {
				var targetTile = GameState.board.getAliasableTileForFarmer(farmer);
				if (targetTile.isOwnedBy(farmer) && targetTile.hasBuilding()) {
					if (targetTile.hasStoredCrops()) {
						NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
							title: null,
							message: "The stored crops must be removed before you sell the building !"
						});
						return false;
					}
					// Clear the aliases
					var tmpX;
					var tmpY;
					for (var i = 0; i < targetTile.building.size.y; i++) {
						for (var j = 0; j < targetTile.building.size.x; j++) {
							tmpY = targetTile.position.y + i;
							tmpX = targetTile.position.x + j;
							if (tmpY >= GameState.board.size.y || tmpX >= GameState.board.size.y || tmpY < 0 || tmpX < 0)
								continue;
							GameState.board.tiles[tmpY][tmpX].isAliasOf = null;
						}
					}
					this.addMoney(farmer, Math.ceil(targetTile.building.price / 4));
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
					if (!this.substractMoney(farmer, GameState.settings.tileCost)) {
						NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
							title: null,
							message: "You need at least " + GameState.settings.tileCost + " to buy this tile."
						});
						return false;
					}
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
			fertilizesTile: function (farmer) {
				var targetTile = GameState.board.getTileForFarmer(farmer);
				if (targetTile.hasBuilding())
					return false;
				if (!targetTile.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You do not own this tile !"
					});
					return false;
				}
				// Manual fertilization can go over max_fertility ! It's only a limit for natural healing
				if (!this.substractMoney(farmer, GameState.settings.fertilizerCost)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You don't have enough money !"
					});
					return false;
				}
				targetTile.fertility = Math.min(targetTile.fertility + 0.2, 1);
				var farmerConnection = NetworkEngine.clients.getConnectionForFarmer(farmer);
				farmerConnection.send("player.tileFertilized", {
					fertility: targetTile.fertility,
					col: targetTile.position.x,
					line: targetTile.position.y
				});
				// Tick update tiles contains fertilization/humidity
				NetworkEngine.clients.broadcast("game.tileDataUpdated", {
					tiles: [
						targetTile.getTickUpdateTile()
					]
				}, true, farmerConnection);
				return true;
			},
			watersTile: function (farmer) {
				var targetTile = GameState.board.getTileForFarmer(farmer);
				if (targetTile.hasBuilding())
					return false;
				if (!targetTile.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You do not own this tile !"
					});
					return false;
				}
				if (!this.substractMoney(farmer, GameState.settings.wateringCost)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You don't have enough money !"
					});
					return false;
				}
				targetTile.humidity = Math.min(targetTile.humidity + 0.2, 1);
				var farmerConnection = NetworkEngine.clients.getConnectionForFarmer(farmer);
				farmerConnection.send("player.tileWatered", {
					humidity: targetTile.humidity,
					col: targetTile.position.x,
					line: targetTile.position.y
				});
				// Tick update tiles contains fertilization/humidity
				NetworkEngine.clients.broadcast("game.tileDataUpdated", {
					tiles: [
						targetTile.getTickUpdateTile()
					]
				}, true, farmerConnection);
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
			},

			sellStoredCrop: function (farmer, storedCropId) {
				var targetStoredCrop = GameState.board.storedCrops[storedCropId];
				if (typeof targetStoredCrop == 'undefined') {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "Internal error : StoredCrop " + storedCropId + " does not exist."
					});
					return false;
				}
				if (!targetStoredCrop.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "Internal error : You don't own storedCrop " + storedCropId + "."
					});
					return false;
				}

				// Remove from tile from the right location
				if (targetStoredCrop.isInInventory()) {
					if (!this.removeFromInventory(farmer, targetStoredCrop)) {
						NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
							title: null,
							message: "Internal error : StoredCrop " + storedCropId + " is not in your inventory."
						});
						return false;
					}
				} else {
					if (!this.removeStoredCropFromTile(farmer, targetStoredCrop.parent_tile, targetStoredCrop))
						return false;
				}

				if (!targetStoredCrop.isRotten()) {
					this.addMoney(farmer, targetStoredCrop.crop.selling_price * targetStoredCrop.harvested_quantity);
				}
				GameState.board.removeStoredCrop(targetStoredCrop);
			},

			/**
			 * NOTE : This does not check anything. You should do the checks yourself beforehand
			 * @param {Farmer} farmer
			 * @param {Tile} tile
			 * @param {StoredCrop} storedCrop
			 */
			addStoredCropToTile: function (farmer, tile, storedCrop) {
				var storedCropsLength = tile.storedCrops.length;
				var itemFound = false;
				for (var i = 0; i < storedCropsLength; i++) {
					if (tile.storedCrops[i].id === storedCrop.id) {
						itemFound = true;
						break;
					}
				}
				if (itemFound)
					return true;
				tile.storedCrops.push(storedCrop);
				NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.tileStoredCropsUpdated", {
					col: tile.position.x,
					line: tile.position.y,
					storedCrops: tile.getSmallStoredCrops()
				});
				return true;
			},

			/**
			 * NOTE : This does not check anything. You should do the checks yourself beforehand
			 * @param {Farmer} farmer
			 * @param {Tile} tile
			 * @param {StoredCrop} storedCrop
			 */
			removeStoredCropFromTile: function (farmer, tile, storedCrop) {
				var storedCropsLength = tile.storedCrops.length;
				var itemIndex = -1;
				for (var i = 0; i < storedCropsLength; i++) {
					if (tile.storedCrops[i].id === storedCrop.id) {
						itemIndex = i;
						break;
					}
				}
				if (itemIndex < 0) {
					var msg = "Internal error : " + farmer.nickname + "'s StoredCrop " + storedCrop.id + " could not be found on tile " + JSON.stringify(tile.position);
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: msg
					});
					console.log(msg);
					return false;
				}
				tile.storedCrops.removeItem(storedCrop);
				NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.tileStoredCropsUpdated", {
					col: tile.position.x,
					line: tile.position.y,
					storedCrops: tile.getSmallStoredCrops()
				});
				return true;
			},

			/**
			 * Move a stored crop from the inventory to a tile
			 * @param {Farmer} farmer
			 * @param {string} storedCropId
			 */
			depositStoredCrop: function (farmer, storedCropId) {
				var targetTile = GameState.board.getAliasableTileForFarmer(farmer);
				if (!targetTile.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You cannot deposit a crop on a tile you don't own."
					});
					return false;
				}
				if (!targetTile.hasBuilding()) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You cannot deposit a crop on a tile without a building."
					});
					return false;
				}
				if (targetTile.isBuildingFull()) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You cannot deposit a crop on this tile because the building is full."
					});
					return false;
				}

				var targetStoredCrop = GameState.board.storedCrops[storedCropId];
				if (typeof targetStoredCrop == 'undefined') {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "Internal error : StoredCrop " + storedCropId + " does not exist."
					});
					return false;
				}
				if (!targetStoredCrop.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "Internal error : You don't own storedCrop " + storedCropId + "."
					});
					return false;
				}
				if (!this.removeFromInventory(farmer, targetStoredCrop)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "Internal error : StoredCrop " + storedCropId + " is not in your inventory."
					});
					return false;
				}
				if (!this.addStoredCropToTile(farmer, targetTile, targetStoredCrop))
					return false;
				targetStoredCrop.parent_tile = targetTile;
			},

			/**
			 * Move a stored crop from a tile to the inventory
			 * @param {Farmer} farmer
			 * @param {string} storedCropId
			 */
			pickupStoredCrop: function (farmer, storedCropId) {
				var targetStoredCrop = GameState.board.storedCrops[storedCropId];
				if (typeof targetStoredCrop == 'undefined') {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "Internal error : StoredCrop " + storedCropId + " does not exist."
					});
					return false;
				}
				if (!targetStoredCrop.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "Internal error : You don't own storedCrop " + storedCropId + "."
					});
					return false;
				}
				if (!targetStoredCrop.parent_tile.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
						title: null,
						message: "You can't remove a crop from a tile that you don't own."
					});
					return false;
				}

				if (!this.addToInventory(farmer, targetStoredCrop))
					return false;
				if (!this.removeStoredCropFromTile(farmer, targetStoredCrop.parent_tile, targetStoredCrop))
					return false;
				targetStoredCrop.parent_tile = null;
			}
		}
	}
};

module.exports = EventManager;