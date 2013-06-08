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
				if(force) {
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
				var targetTile = GameState.board.getAliasableTileForFarmer(farmer);
				if (!targetTile.isOwnedBy(farmer)) {
					NetworkEngine.clients.getConnectionForFarmer(farmer).send("game.error", {
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