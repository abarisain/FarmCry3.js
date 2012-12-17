var texHudList = ['life', 'time', 'popup', 'inventory'];
var texHud = [];

var hud = {
	drawHud: function () {
		var tmpLength = CrymeEngine.hudElements.length;
		for (var i = 0; i < tmpLength; i++) {
			CrymeEngine.hudElements[i].drawItem(texHud);
		}
	}
};

function LoadHud() {
	totalLoadingCount += texHudList.length;
	LoadTexHud();
}

function LoadTexHud() {
	for (var i = 0; i < texHudList.length; i++) {
		var texture = new Texture(i, texHudList[i].image, 'src/hud/' + texHudList[i] + '.png');
		texture.image.onload = function () {
			currentLoadingCount++;
		};
		texHud[i] = texture;
	}
}

/* Chat methods */
//TODO : Refactor the HUD, really. No, REALLY.
hud.chat = {
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
			hud.chat.divs.send.setAttribute("class", hud.chat.divs.input.value == "" ? "hidden" : "");
			return false;
		});
		this.hideSendButton();
		this.divs.send.onclick = function () {
			hud.chat.send();
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