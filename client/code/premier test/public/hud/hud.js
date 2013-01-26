var texHudList = ['life', 'time', 'popup', 'inventory'];
var texHud = [];

CrymeEngine.hud = {
	textures: {
		life: null,
		time: null,
		popup: null,
		inventory: null
	},
	init: function () {
		this.rootHudElement.resize();
		//var hudElement = new HudElement(0, 0, 0, true);
		this.rootHudElement.addChild(new HudElement("Lifebar", "life", 317, 124, 0, 0, HudElement.Anchors.CENTER, false));
		this.rootHudElement.children[0].addChild(new HudElement("Time", "time", 159, 61, 0, 0, HudElement.Anchors.TOP_RIGHT, false));
		this.rootHudElement.children[0].children[0].onClick = function () {
			alert = "prout";
		};
		/*hudElement = new HudElement(1, canvasWidth - 160, 0, true);
		 CrymeEngine.hudElements.push(hudElement);
		 hudElement = new HudElement(2, canvasWidth - 320, 200, true);
		 CrymeEngine.hudElements.push(hudElement);
		 hudElement = new HudElement(3, canvasWidth / 2 - 500, 200, false);
		 CrymeEngine.hudElements.push(hudElement);*/
		//Now compute the layout
	},
	loadTextures: function () {
		var textureList = Object.keys(this.textures);
		totalLoadingCount += textureList.length;
		var i = 0;
		textureList.forEach(function (textureName) {
			var texture = new Texture(i, textureName, 'src/hud/' + textureName + '.png');
			texture.image.onload = function () {
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
		CrymeEngine.hud.rootHudElement.onClick(x, y);
	},
	rootHudElement: new RootHudElement()
};

/* Chat methods
 It's a special case, so it's not implemented as an HudElement.
 It's drawn using the DOM (html/css) and not canvas, so there it goes.
 */
CrymeEngine.hud.chat = {
	timestampFormat: "HH:MM:ss",
	Kind: {
		SERVER: 0,
		PLAYER: 1
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
			networkEngine.subsystems.chat.sendMessage(this.divs.input.value);
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
			case this.Kind.SERVER:
				classText = "server";
				break;
			case this.Kind.PLAYER:
				classText = "player";
				messagePrefix += "<" + messageData.player + "> ";
				break;
		}
		tmpDiv.setAttribute("class", "chat_text " + classText);
		tmpDiv.appendChild(document.createTextNode(messagePrefix + messageData.message));
		this.divs.log.appendChild(tmpDiv);
		this.divs.log.scrollTop = this.divs.log.scrollHeight;
	}
};