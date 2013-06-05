CrymeEngine.hud = {
	textures: {
		life: null,
		time: null,
		popup: null,
		popup_important: null,
		inventory: null,
		button_red: null,
		button_gray: null,
		button_green: null,
		button_blue: null,
		button_buy: null,
		button_close: null,
		button_delete: null,
		filter_disabled: null,
		filter_owner: null,
		filter_humidity: null,
		filter_fertility: null,
		filter_maturity: null,
		filter_health: null,
		filter_storage: null,
		market_barn: null,
		market_silo: null,
		market_cold_storage: null,
		market_corn: null,
		market_tomato: null,
		market_wheat: null,
		progressbar_background: null,
		progressbar_green: null,
		progressbar_red: null,
		book: null,
		coin: null
	},
	panels: {
		lifebar: null,
		tray: null,
		market: null
	},
	init: function () {
		this.rootHudElement.resize();
		//Lifebar
		CE.hud.lifebar = new HudElement("lifebar", "life", 317, 124, 0, 0, HudElement.Anchors.TOP_LEFT, false);
		CE.hud.lifebar.addChild(new HudElement("money_icon", "coin", 20, 23, 16, 120, HudElement.Anchors.TOP_LEFT, false));
		var posText = new HudElements.Text("position_text");
		posText.horizontalMargin = 145;
		posText.verticalMargin = 16;
		posText.setTextFunction(function () {
			if (GameState.player == null)
				return 0;
			return GameState.player.money;
		});
		CE.hud.lifebar.addChild(posText);
		this.rootHudElement.addChild(CE.hud.lifebar);

		//Time and notifications (tray)
		CE.hud.tray = new HudElement("tray", "time", 159, 61, 0, 0, HudElement.Anchors.TOP_RIGHT, true);
		var timeText = new HudElements.Text("time_text");
		timeText.horizontalMargin = -20;
		timeText.verticalMargin = 18;
		timeText.anchor = HudElement.Anchors.TOP_RIGHT;
		timeText.setTextFunction(function () {
			var currentTime = new Date();
			return currentTime.getHours() + ':' + currentTime.getSeconds();
		});
		CE.hud.tray.addChild(timeText);
		this.rootHudElement.addChild(CE.hud.tray);

		var marketButton = new HudElements.Button(100, 50, 150, 0, "Market", HudElement.Anchors.TOP_LEFT, "#fff");
		marketButton.onClick = (function () {
			if (CE.hud.market == null) {
				CE.hud.market = HudElements.Book.Premade.Market();
				this.rootHudElement.addChild(CE.hud.market);
			} else {
				CE.hud.market.visible = true;
			}
		}).bind(this);
		this.rootHudElement.addChild(marketButton);

		/*			UI pour les filtres		*/
		var filter = new HudElement("filterDisabled", "filter_disabled", 92, 92, -5, -10, HudElement.Anchors.BOTTOM_RIGHT, true);
		filter.onClick = function () {
			CE.displayType = CE.DisplayType.STANDARD;
			Map.tileHighLighted.index = -1;
			CE.mapInvalidated = true;
		}
		this.rootHudElement.addChild(filter);

		var filter = new HudElement("filterOwner", "filter_owner", 32, 32, -17, -112, HudElement.Anchors.BOTTOM_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.OWNER);
		}
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterHumidity", "filter_humidity", 32, 32, -50, -117, HudElement.Anchors.BOTTOM_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.HUMIDITY);
		}
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterFertility", "filter_fertility", 32, 32, -83, -107, HudElement.Anchors.BOTTOM_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.FERTILITY);
		}
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterMaturity", "filter_maturity", 32, 32, -107, -83, HudElement.Anchors.BOTTOM_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.MATURITY);
		}
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterHealth", "filter_health", 32, 32, -113, -50, HudElement.Anchors.BOTTOM_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.HEALTH);
		}
		this.rootHudElement.addChild(filter);

		filter = new HudElement("filterStorage", "filter_storage", 32, 32, -104, -17, HudElement.Anchors.BOTTOM_RIGHT, true);
		filter.onClick = function () {
			CE.Event.changeFilterType(CE.FilterType.STORAGE_AVAILABLE);
		}
		this.rootHudElement.addChild(filter);


		/* Boutons de test pour la version iPad	*/
		var forkButton = new HudElements.Button(100, 50, -10, -210, "Fork", HudElement.Anchors.BOTTOM_RIGHT, "#fff");
		forkButton.onClick = function () {
			CE.gameState = CE.GameState.BATTLE;
			CE.Battle.launchBattle(SpritePack.Battle.Sprites.WEAPON_FORK);
			CE.mapInvalidated = true;
		}
		this.rootHudElement.addChild(forkButton);

		var tornadoButton = new HudElements.Button(100, 50, -10, -310, "Tornado", HudElement.Anchors.BOTTOM_RIGHT, "#fff");
		tornadoButton.onClick = function () {
			CE.Weather.addTornado(Map.player.col, Map.player.line);
		}
		this.rootHudElement.addChild(tornadoButton);

		var rainButton = new HudElements.Button(100, 50, -10, -410, "Rain", HudElement.Anchors.BOTTOM_RIGHT, "#fff");
		rainButton.onClick = function () {
			CE.Weather.startRain();
		}
		this.rootHudElement.addChild(rainButton);
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
	timestampFormat: "HH:MM:ss",
	Kind: {
		SERVER: 0,
		PLAYER: 1,
		LOCAL: 2
	},
	divs: {
		log: null,
		input: null,
		send: null
	},
	init: function () {
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
			//TODO : Parse /commands here
			var msg = this.divs.input.value;
			if (msg.beginsWith("/")) {
				if (msg.beginsWith("/help")) {
					messageData = {
						kind: this.Kind.LOCAL,
						message: 'Help : "/raw <module.command> <JSON args>" Send raw command to server. DANGEROUS'
					}
					CrymeEngine.hud.chat.append(messageData);
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
				if (messageData.player == "Kalahim") {
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