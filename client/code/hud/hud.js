CrymeEngine.hud = {
	textures: {
		bag_panel: null,
		popup: null,
		popup_important: null,
		action_bar: null,
		action_bar_small: null,
		action_attack: null,
		action_buy: null,
		action_fertilizes: null,
		action_harvests: null,
		action_hide_chat: null,
		action_open: null,
		action_waters: null,
		button_red: null,
		button_gray: null,
		button_green: null,
		button_blue: null,
		button_buy: null,
		button_close: null,
		button_delete: null,
		filter_header: null,
		filter_owner: null,
		filter_humidity: null,
		filter_fertility: null,
		filter_maturity: null,
		filter_health: null,
		filter_storage: null,
		filters_enable: null,
		market_barn: null,
		market_silo: null,
		market_cold_storage: null,
		market_corn: null,
		market_tomato: null,
		market_wheat: null,
		progressbar_background: null,
		progressbar_green: null,
		progressbar_red: null,
		progressbar_life: null,
		topbar: null,
		book: null,
		coin: null
	},
	panels: {
		lifebar: null,
		inventorybar: null,
		market: null,
		inventory: null,
		rightbar: null,
		actionBarSmall: null,
		actionBar: null,
		filters_enable: null,
		filter_buttons: []
	},
	init: function () {
		this.rootHudElement.resize();

		if (isIOS) {
			CE.hud.chat.toggleVisibility(false);
		}

		CE.hud.panels.lifebar = new HudElements.ProgressBar(108, 28, 34, 78, HudElement.Anchors.TOP_LEFT);
		CE.hud.panels.lifebar.image = null;
		CE.hud.panels.lifebar._progressbar.ninepatch = {
			enabled: true,
			left_padding: 0,
			right_padding: 0,
			left_width: 1,
			right_width: 16,
			top_height: 1,
			bottom_height: 16
		}
		CE.hud.panels.lifebar.setProgressImage("progressbar_life");
		this.rootHudElement.addChild(CE.hud.panels.lifebar);

		CE.hud.panels.inventorybar = new HudElement("lifebar", "bag_panel", 202, 111, 0, 0, HudElement.Anchors.TOP_LEFT, true);
		CE.hud.panels.inventorybar.onClick = (function () {
			if (CE.hud.panels.inventory == null) {
				CE.hud.panels.inventory = HudElements.Book.Premade.Inventory();
				this.rootHudElement.addChild(CE.hud.panels.inventory);
			} else {
				CE.hud.panels.inventory.visible = true;
			}
		}).bind(this);
		CE.hud.panels.inventorybar.addChild(new HudElement("money_icon", "coin", 20, 23, 28, 88, HudElement.Anchors.TOP_LEFT, false));
		var posText = new HudElements.Text("position_text");
		posText.horizontalMargin = 115;
		posText.verticalMargin = 29;
		posText.setTextFunction(function () {
			if (GameState.player == null)
				return 0;
			return GameState.player.money;
		});
		CE.hud.panels.inventorybar.addChild(posText);
		this.rootHudElement.addChild(CE.hud.panels.inventorybar);

		CE.hud.panels.filters_enable = new HudElement("filter_button", "filters_enable", 99, 99, 0, 0, HudElement.Anchors.TOP_RIGHT, true);
		CE.hud.panels.filters_enable.onClick = (function () {
			if (CE.displayType == CE.DisplayType.STANDARD) {
				CE.Event.showFilterType();
			} else {
				CE.Event.removeFilterType();
			}
		}).bind(this);
		this.rootHudElement.addChild(CE.hud.panels.filters_enable);

		/*		Small action panel 	*/

		var chatPanel = new HudElement("chatPanel", 'action_bar_small', 95, 95, 0, 0, HudElement.Anchors.BOTTOM_RIGHT);

		var hide_chat = new HudElement('hide_chat', 'action_hide_chat', 56, 48, 0, 0, HudElement.Anchors.CENTER);
		hide_chat.onClick = function () {
			CE.hud.chat.toggleVisibility(null);
		};
		chatPanel.addChild(hide_chat);

		this.rootHudElement.addChild(chatPanel);

		/*		Small panel for non owend tile or owned tile with building or nothing	*/

		//TODO modifier l'action bar pour afficher la petite à la place
		this.panels.actionBarSmall = new HudElement("actionBarSmall", 'action_bar_small', 95, 95, 0, 0, HudElement.Anchors.BOTTOM_CENTER);

		this.panels.actionBarSmall.viewbag.buy = new HudElement('buy', 'action_buy', 56, 48, 0, 0, HudElement.Anchors.CENTER);
		this.panels.actionBarSmall.viewbag.buy.onClick = (function () {
			if (CE.hud.panels.market == null) {
				CE.hud.panels.market = HudElements.Book.Premade.Market();
				this.rootHudElement.addChild(CE.hud.panels.market);
			} else {
				CE.hud.panels.market.visible = true;
			}
		}).bind(this);
		this.panels.actionBarSmall.addChild(this.panels.actionBarSmall.viewbag.buy);

		this.panels.actionBarSmall.viewbag.attack = new HudElement('attack', 'action_attack', 56, 48, 0, 0, HudElement.Anchors.CENTER);
		this.panels.actionBarSmall.viewbag.attack.onClick = function () {
			networkEngine.subsystems.player.actions.takeCurrentTile();
		}
		this.panels.actionBarSmall.addChild(this.panels.actionBarSmall.viewbag.attack);

		/*this.panels.actionBarSmall.viewbag.open_building = new HudElement('open', 'action_open', 56, 48, 0, 0, HudElement.Anchors.CENTER);
		 this.panels.actionBarSmall.viewbag.open_building.onClick = function () {
		 CE.hud.chat.toggleVisibility(null);
		 };
		 this.panels.actionBarSmall.addChild(this.panels.actionBarSmall.viewbag.open_building);*/

		this.rootHudElement.addChild(this.panels.actionBarSmall);

		/*		Big panel for own tile with crop	*/

		this.panels.actionBar = new HudElement("actionBar", 'action_bar', 298, 95, 0, 0, HudElement.Anchors.BOTTOM_CENTER);

		this.panels.actionBar.viewbag.harvest = new HudElement('harvest', 'action_harvests', 56, 48, 0, -100, HudElement.Anchors.CENTER);
		this.panels.actionBar.viewbag.harvest.onClick = (function () {
			networkEngine.subsystems.player.actions.harvestCrop();
		}).bind(this);
		this.panels.actionBar.addChild(this.panels.actionBar.viewbag.harvest);

		this.panels.actionBar.viewbag.fertlizes = new HudElement('harvest', 'action_fertilizes', 56, 48, 0, 0, HudElement.Anchors.CENTER);
		this.panels.actionBar.viewbag.fertlizes.onClick = (function () {
			networkEngine.subsystems.player.actions.fertilizesTile();
		}).bind(this);
		this.panels.actionBar.addChild(this.panels.actionBar.viewbag.fertlizes);

		this.panels.actionBar.viewbag.waters = new HudElement('harvest', 'action_waters', 56, 48, 0, 105, HudElement.Anchors.CENTER);
		this.panels.actionBar.viewbag.waters.onClick = (function () {
			networkEngine.subsystems.player.actions.watersTile();
		}).bind(this);
		this.panels.actionBar.addChild(this.panels.actionBar.viewbag.waters);

		this.rootHudElement.addChild(this.panels.actionBar);


		/*			UI pour les filtres		*/
		this.rootHudElement.viewbag.filter_header = new HudElement("filterDisabled", "filter_header", 306, 35, 0, 0, HudElement.Anchors.TOP_CENTER, true);
		this.rootHudElement.viewbag.filter_header.visible = false;
		this.rootHudElement.viewbag.filter_header.onClick = function () {
			CE.Event.removeFilterType();
		}
		this.rootHudElement.addChild(this.rootHudElement.viewbag.filter_header);

		this.rootHudElement.viewbag.filter_text = new HudElements.Text("No filter", HudElement.Anchors.CENTER);
		this.rootHudElement.viewbag.filter_header.addChild(this.rootHudElement.viewbag.filter_text);

		var filter = new HudElement("filterOwner", "filter_owner", 32, 32, 100, -34, HudElement.Anchors.TOP_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.OWNER);
		}
		filter.visible = false;
		CE.hud.panels.filter_buttons.push(filter);
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterHumidity", "filter_humidity", 32, 32, 140, -34, HudElement.Anchors.TOP_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.HUMIDITY);
		}
		filter.visible = false;
		CE.hud.panels.filter_buttons.push(filter);
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterFertility", "filter_fertility", 32, 32, 180, -34, HudElement.Anchors.TOP_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.FERTILITY);
		}
		filter.visible = false;
		CE.hud.panels.filter_buttons.push(filter);
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterMaturity", "filter_maturity", 32, 32, 220, -34, HudElement.Anchors.TOP_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.MATURITY);
		}
		filter.visible = false;
		CE.hud.panels.filter_buttons.push(filter);
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterHealth", "filter_health", 32, 32, 260, -34, HudElement.Anchors.TOP_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.HEALTH);
		}
		filter.visible = false;
		CE.hud.panels.filter_buttons.push(filter);
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterStorage", "filter_storage", 32, 32, 300, -34, HudElement.Anchors.TOP_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.STORAGE_AVAILABLE);
		}
		filter.visible = false;
		CE.hud.panels.filter_buttons.push(filter);
		this.rootHudElement.addChild(filter);
	},
	loadTextures: function () {
		var textureList = Object.keys(this.textures);
		totalLoadingCount += textureList.length;
		var i = 0;
		textureList.forEach(function (textureName) {
			var texture = new Texture(textureName, 'src/hud/' + textureName + '.png');
			texture.image.onload = function () {
				texture.updateWidthHeight();
				currentLoadingCount++;
			};
			CrymeEngine.hud.textures[textureName] = texture;
			i++;
		});
	},
	events: {
		showFilter: function (name) {
			//CE.hud.panels.lifebar.visible = false;
			//CE.hud.panels.inventorybar.visible = false;
			//CE.hud.panels.actionBar.visible = false;
			//CE.hud.panels.actionBarSmall.visible = false;
			CE.hud.rootHudElement.viewbag.filter_header.visible = true;
			CE.hud.rootHudElement.viewbag.filter_text.setText(name);
			for (var i = 0; i < CE.hud.panels.filter_buttons.length; i++) {
				CE.hud.panels.filter_buttons[i].visible = true;
			}
		},
		removeFilter: function () {
			//CE.hud.panels.lifebar.visible = true;
			//CE.hud.panels.inventorybar.visible = true;
			//CE.hud.panels.actionBar.visible = true;
			//CE.hud.panels.actionBarSmall.visible = true;
			CE.hud.rootHudElement.viewbag.filter_header.visible = false;
			CE.hud.rootHudElement.viewbag.filter_text.setText('No filter');
			for (var i = 0; i < CE.hud.panels.filter_buttons.length; i++) {
				CE.hud.panels.filter_buttons[i].visible = false;
			}
		},
		updateActionAvailables: function (tile) {
			if (tile.data.owner != Map.player.farmer.nickname) {//attack
				CE.hud.panels.actionBarSmall.visible = true;
				CE.hud.panels.actionBar.visible = false;
				CE.hud.panels.actionBarSmall.viewbag.attack.visible = true;
				CE.hud.panels.actionBarSmall.viewbag.buy.visible = false;
			} else if (tile.hasGrowingCrop) {//fertilizes, waters and harvest
				CE.hud.panels.actionBarSmall.visible = false;
				CE.hud.panels.actionBar.visible = true;
			} else {//buy
				CE.hud.panels.actionBarSmall.visible = true;
				CE.hud.panels.actionBar.visible = false;
				CE.hud.panels.actionBarSmall.viewbag.attack.visible = false;
				CE.hud.panels.actionBarSmall.viewbag.buy.visible = true;
			}
		}
	},
	draw: function () {
		if (loadingComplete) {
			CrymeEngine.hud.rootHudElement.draw();
		}
	},
	onClick: function (x, y) {
		return CrymeEngine.hud.rootHudElement.onClick(x, y);
	},
	rootHudElement: new HudElements.Root()
};

/* Chat methods
 It's a special case, so it's not implemented as an HudElement.
 It's drawn using the DOM (html/css) and not canvas, so there it goes.
 */
CrymeEngine.hud.chat = {
	visible: true,
	timestampFormat: "HH:MM:ss",
	Kind: {
		SERVER: 0,
		PLAYER: 1,
		LOCAL: 2
	},
	divs: {
		root: null,
		log: null,
		input: null,
		send: null
	},
	toggleVisibility: function (visible) {
		if (visible == null) {
			if (this.divs.root.style.display == 'none') {
				this.divs.root.style.display = null;
				this.visible = true;
			} else {
				this.divs.root.style.display = 'none';
				this.visible = false;
			}
		} else {
			if (visible) {
				this.divs.root.style.display = null;
				this.visible = true;
			} else {
				this.divs.root.style.display = "none";
				this.visible = false;
			}
		}
	},
	init: function () {
		this.divs.root = document.getElementById("hud_chat");
		this.divs.log = document.getElementById("hud_chat_messages");
		this.divs.input = document.getElementById("hud_chat_message");
		this.divs.send = document.getElementById("hud_chat_send");
		this.divs.input.addEventListener("input", function () {
			CrymeEngine.hud.chat.divs.send.setAttribute("class", CrymeEngine.hud.chat.divs.input.value == "" ? "hidden" : "");
			return false;
		});
		this.hideSendButton();
		this.divs.send.onclick = function () {
			CrymeEngine.hud.chat.send();
			return false;
		}
	},
	hideSendButton: function () {
		this.divs.send.setAttribute("class", "hidden");
	},
	send: function () {
		if (this.divs.input.value != "") {
			var messageData;
			var msg = this.divs.input.value;
			if (msg.beginsWith("/")) {
				if (msg.beginsWith("/help")) {
					messageData = {
						kind: this.Kind.LOCAL,
						message: 'Help : "/raw <module.command> <JSON args>" Send raw command to server. DANGEROUS'
					}
					CrymeEngine.hud.chat.append(messageData);
				} else if (msg.beginsWith("/reload")) {
					document.location.reload();
				} else if (msg.beginsWith("/raw ")) {
					try {
						var splitMsg = msg.split(" ", 2);
						var jsonArgs = msg.substring(splitMsg[0].length + splitMsg[1].length + 2);
						networkEngine.socket.emit(splitMsg[1], JSON.parse(jsonArgs));
						messageData = {
							kind: this.Kind.LOCAL,
							message: 'Sending raw command : ' + splitMsg[1] + " " + jsonArgs
						}
						CrymeEngine.hud.chat.append(messageData);
					} catch (err) {
						messageData = {
							kind: this.Kind.LOCAL,
							message: 'Invalid raw command : ' + msg
						}
						CrymeEngine.hud.chat.append(messageData);
					}
				} else {
					messageData = {
						kind: this.Kind.LOCAL,
						message: 'Error : Unknown command'
					}
					CrymeEngine.hud.chat.append(messageData);
				}
			} else {
				networkEngine.subsystems.chat.sendMessage(this.divs.input.value);
			}
		}
		this.divs.input.value = "";
		this.hideSendButton();
		this.divs.input.blur();
	},
	clear: function () {
		if (this.divs.log.hasChildNodes()) {
			while (this.divs.log.childNodes.length >= 1) {
				this.divs.log.removeChild(this.divs.log.firstChild);
			}
		}
	},
	append: function (messageData) {
		if (typeof messageData == 'undefined' || typeof messageData.kind == 'undefined' ||
			typeof messageData.message == 'undefined') {
			console.log("Error : invalid chat message, ignoring. Data : " + messageData);
		}
		var tmpDiv = document.createElement("div");
		var messagePrefix = new Date().format(this.timestampFormat) + " ";
		var classText = "";
		switch (messageData.kind) {
			case this.Kind.LOCAL:
				classText = "local";
				messagePrefix = "";
				break;
			case this.Kind.SERVER:
				classText = "server";
				break;
			case this.Kind.PLAYER:
				classText = "player";
				// Easter eeeeeg
				var targetFarmer = null;
				if (GameState.player.nickname.toLowerCase() == messageData.player.toLowerCase()) {
					targetFarmer = GameState.player;
				} else {
					GameState.online_players.forEach(function (onlinePlayer) {
						if (onlinePlayer.nickname.toLowerCase() == messageData.player.toLowerCase())
							targetFarmer = onlinePlayer;
					});
				}
				if (targetFarmer != null && targetFarmer.admin) {
					var tmpImg = document.createElement("img");
					tmpImg.setAttribute("src", "src/hud/admin.gif");
					tmpDiv.appendChild(tmpImg);
				}
				messagePrefix += "<" + messageData.player + "> ";
				break;
		}
		tmpDiv.setAttribute("class", "chat_text " + classText);
		tmpDiv.appendChild(document.createTextNode(messagePrefix + messageData.message));
		this.divs.log.appendChild(tmpDiv);
		this.divs.log.scrollTop = this.divs.log.scrollHeight;
	}
};