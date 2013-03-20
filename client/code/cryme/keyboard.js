CrymeEngine.keyboard = {
	showKeyMap: true,//pour afficher ou non la keyMap à l'écran
	Keys: {
		ENTER: { value: 13, name: 'Enter' },
		SPACE: { value: 32, name: 'Space' },
		TAB: { value: 9, name: 'Tab' },
		KEY_1: { value: 49, name: '&' },
		KEY_2: { value: 50, name: 'é' },
		KEY_3: { value: 51, name: '"' },
		KEY_4: { value: 52, name: '\'' },
		KEY_5: { value: 53, name: '(' }
	},
	Shortcuts: {
		CHAT: undefined,
		INVENTORY: undefined,
		SHOW_KEY_MAP: undefined,
		SHOW_GRAPHIC_DEBUG: undefined,
		SHOW_GRAPHIC_DEBUG_ITEM: undefined,
		SHOW_GRAPHIC_DEBUG_MAP: undefined,
		SHOW_GRAPHIC_DEBUG_ADVANCED: undefined,
		CHANGE_GRAPHIC_DEBUG_ALPHA: undefined
	},
	init: function () {
		CE.keyboard.Shortcuts.CHAT = CrymeEngine.keyboard.Keys.ENTER;
		CE.keyboard.Shortcuts.INVENTORY = CE.keyboard.Keys.SPACE;
		CE.keyboard.Shortcuts.SHOW_KEY_MAP = CE.keyboard.Keys.TAB;
		CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG = CE.keyboard.Keys.KEY_1;
		CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_ITEM = CE.keyboard.Keys.KEY_2;
		CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_MAP = CE.keyboard.Keys.KEY_3;
		CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_ADVANCED = CE.keyboard.Keys.KEY_4;
		CE.keyboard.Shortcuts.CHANGE_GRAPHIC_DEBUG_ALPHA = CE.keyboard.Keys.KEY_5;
	},
	keyPressed: function (event) {
		//Special case, unless we are pressing enter, ignore everything while we're in the chat box
		if (document.activeElement == CE.hud.chat.divs.input && event.keyCode != CE.keyboard.Shortcuts.CHAT) {
			return true;
		}
		switch (event.keyCode) {
			case CE.keyboard.Shortcuts.CHAT.value:
				if (document.activeElement == CE.hud.chat.divs.input) {
					CE.hud.chat.send();
				} else {
					CE.hud.chat.divs.input.focus();
				}
				break;
			case CE.keyboard.Shortcuts.INVENTORY.value:
				//TODO a réimplémenter plus tard
				break;
			case CE.keyboard.Shortcuts.SHOW_KEY_MAP.value:
				CE.keyboard.showKeyMap = !CE.keyboard.showKeyMap;
				break;
			//graphic debug
			case CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG.value:
				Options.Debug.Graphic.enabled = !Options.Debug.Graphic.enabled;
				var messageData = {
					kind: CE.hud.chat.Kind.LOCAL,
					message: 'Graphical debug : enabled - ' + Options.Debug.Graphic.enabled
				}
				CE.hud.chat.append(messageData);
				break;
			case CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_ITEM.value:
				Options.Debug.Graphic.item = !Options.Debug.Graphic.item;
				break;
			case CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_MAP.value:
				Options.Debug.Graphic.map = !Options.Debug.Graphic.map;
				break;
			case CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_ADVANCED.value:
				Options.Debug.Graphic.advanced = !Options.Debug.Graphic.advanced;
				var messageData = {
					kind: CE.hud.chat.Kind.LOCAL,
					message: 'Graphical debug : advanced - ' + Options.Debug.Graphic.advanced
				}
				CE.hud.chat.append(messageData);
				break;
			case CE.keyboard.Shortcuts.CHANGE_GRAPHIC_DEBUG_ALPHA.value:
				Options.Debug.Graphic.globalAlpha = (Options.Debug.Graphic.globalAlpha + 0.25) % 1;
				var messageData = {
					kind: CE.hud.chat.Kind.LOCAL,
					message: 'Graphical debug : advanced - opacity set to ' + Options.Debug.Graphic.globalAlpha
				}
				CE.hud.chat.append(messageData);
				break;
		}
	},
	drawKeyMap: function () {
		if (CE.keyboard.showKeyMap) {
			CE.canvas.hud.context.fillStyle = "rgba(0, 0, 0, 0.5)";
			CE.canvas.hud.context.fillRect(0, 180, 400, 20 * 10);
			//Pour afficher/masquer la bordure
			/*CE.canvas.hud.context.strokeStyle = "rgba(0, 0, 0, 0.8)";
			 CE.canvas.hud.context.strokeRect(0, 180, 400, 20 * 10);*/
			CE.canvas.hud.context.fillStyle = "#fff";
			CE.canvas.hud.context.fillText('Keys Map :', 20, 200);
			var i = 0;
			for (var item in this.Shortcuts) {
				CE.canvas.hud.context.fillText(CE.keyboard.Shortcuts[item].name, 20, 220 + 20 * i);
				CE.canvas.hud.context.fillText('' + item, 100, 220 + 20 * i);
				i++;
			}
		}
	}
};