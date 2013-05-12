CrymeEngine.keyboard = {
	showKeyMap: false,//pour afficher ou non la keyMap à l'écran
	keyCount: -1,
	Keys: {
		ENTER: { code: 13, name: 'Enter' },
		SPACE: { code: 32, name: 'Space' },
		TAB: { code: 9, name: 'Tab' },
		KEY_A: { code: 65, name: 'A' },
		KEY_B: { code: 66, name: 'B' },
		KEY_C: { code: 67, name: 'C' },
		KEY_D: { code: 68, name: 'D' },
		KEY_E: { code: 69, name: 'E' },
		KEY_F: { code: 70, name: 'F' },
		KEY_G: { code: 71, name: 'G' },
		KEY_H: { code: 72, name: 'H' },
		KEY_I: { code: 73, name: 'I' },
		KEY_J: { code: 74, name: 'J' },
		KEY_K: { code: 75, name: 'K' },
		KEY_Q: { code: 81, name: 'Q' },
		KEY_R: { code: 82, name: 'R' },
		KEY_S: { code: 83, name: 'S' },
		KEY_Z: { code: 90, name: 'Z' },
		KEY_1: { code: 49, name: '&' },
		KEY_2: { code: 50, name: 'é' },
		KEY_3: { code: 51, name: '"' },
		KEY_4: { code: 52, name: '\'' },
		KEY_5: { code: 53, name: '(' }
	},
	Shortcuts: {
		CHAT: null,
		CHANGE_DISPLAY_TYPE: null,
		CROP_ADD_TOMATO: null,
		CROP_ADD_WHEAT: null,
		CROP_ADD_CORN: null,
		CROP_HARVEST: null,
		LAUNCH_BATTLE: null,
		STOP_BATTLE: null,
		SHOW_KEY_MAP: null,
		SHOW_GRAPHIC_DEBUG: null,
		SHOW_GRAPHIC_DEBUG_ITEM: null,
		SHOW_GRAPHIC_DEBUG_MAP: null,
		SHOW_GRAPHIC_DEBUG_ADVANCED: null,
		CHANGE_GRAPHIC_DEBUG_ALPHA: null
	},
	init: function () {
		CE.keyboard.Shortcuts.CHAT = CrymeEngine.keyboard.Keys.ENTER;
		CE.keyboard.Shortcuts.CHANGE_DISPLAY_TYPE = CE.keyboard.Keys.KEY_A;
		CE.keyboard.Shortcuts.CROP_ADD_CORN = CE.keyboard.Keys.KEY_Q;
		CE.keyboard.Shortcuts.CROP_ADD_TOMATO = CE.keyboard.Keys.KEY_S;
		CE.keyboard.Shortcuts.CROP_ADD_WHEAT = CE.keyboard.Keys.KEY_D;
		CE.keyboard.Shortcuts.CROP_HARVEST = CE.keyboard.Keys.KEY_Z;
		CE.keyboard.Shortcuts.LAUNCH_BATTLE = CE.keyboard.Keys.KEY_E;
		CE.keyboard.Shortcuts.STOP_BATTLE = CE.keyboard.Keys.KEY_R;
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
		var messageData = {
			kind: CE.hud.chat.Kind.LOCAL,
			message: 'Keyboard debug : key - ' + event.keyCode
		}
		CE.hud.chat.append(messageData);
		switch (event.keyCode) {
			case CE.keyboard.Shortcuts.CHAT.code:
				if (document.activeElement == CE.hud.chat.divs.input) {
					CE.hud.chat.send();
				} else {
					CE.hud.chat.divs.input.focus();
				}
				break;
			case CE.keyboard.Shortcuts.CHANGE_DISPLAY_TYPE.code:
				CE.displayType = (CE.displayType + 1) % 3;
				if (CE.displayType != CE.DisplayType.STANDARD) {
					Map.showMapInformations();
				}
				Map.tileHighLighted.index = -1;
				break;
			case CE.keyboard.Shortcuts.SHOW_KEY_MAP.code:
				CE.keyboard.showKeyMap = !CE.keyboard.showKeyMap;
				break;
			case CE.keyboard.Shortcuts.LAUNCH_BATTLE.code:
				CE.gameState = CE.GameState.BATTLE;
				CE.Battle.launchBattle();
				CE.mapInvalidated = true;
				break;
			case CE.keyboard.Shortcuts.STOP_BATTLE.code:
				CE.gameState = CE.GameState.FARMING;
				CE.mapInvalidated = true;
				break;
			case CE.keyboard.Shortcuts.CROP_ADD_CORN.code:
				networkEngine.subsystems.player.actions.buyCrop(MapItems.TileItems.Crop.Type.corn.codename);
				break;
			case CE.keyboard.Shortcuts.CROP_ADD_TOMATO.code:
				networkEngine.subsystems.player.actions.buyCrop(MapItems.TileItems.Crop.Type.tomato.codename);
				break;
			case CE.keyboard.Shortcuts.CROP_ADD_WHEAT.code:
				networkEngine.subsystems.player.actions.buyCrop(MapItems.TileItems.Crop.Type.wheat.codename);
				break;
			case CE.keyboard.Shortcuts.CROP_HARVEST.code:
				networkEngine.subsystems.player.actions.harvestCrop();
				break;
			//graphic debug
			case CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG.code:
				Options.Debug.Graphic.enabled = !Options.Debug.Graphic.enabled;
				var messageData = {
					kind: CE.hud.chat.Kind.LOCAL,
					message: 'Graphical debug : enabled - ' + Options.Debug.Graphic.enabled
				}
				CE.hud.chat.append(messageData);
				break;
			case CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_ITEM.code:
				Options.Debug.Graphic.item = !Options.Debug.Graphic.item;
				break;
			case CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_MAP.code:
				Options.Debug.Graphic.map = !Options.Debug.Graphic.map;
				break;
			case CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_ADVANCED.code:
				Options.Debug.Graphic.advanced = !Options.Debug.Graphic.advanced;
				var messageData = {
					kind: CE.hud.chat.Kind.LOCAL,
					message: 'Graphical debug : advanced - ' + Options.Debug.Graphic.advanced
				}
				CE.hud.chat.append(messageData);
				break;
			case CE.keyboard.Shortcuts.CHANGE_GRAPHIC_DEBUG_ALPHA.code:
				Options.Debug.Graphic.globalAlpha = (Options.Debug.Graphic.globalAlpha + 0.25) % 1;
				var messageData = {
					kind: CE.hud.chat.Kind.LOCAL,
					message: 'Graphical debug : advanced - opacity set to ' + Options.Debug.Graphic.globalAlpha
				}
				CE.hud.chat.append(messageData);
				break;
		}
	},
	keyReleased: function (event) {
		/*switch (event.keyCode) {
		 }*/
	},
	drawKeyMap: function () {
		if (CE.keyboard.showKeyMap) {
			if (this.keyCount === -1) {
				this.keyCount = 0;
				for (var item in this.Shortcuts) {
					this.keyCount++;
				}
			}
			CE.canvas.hud.context.fillStyle = "rgba(0, 0, 0, 0.5)";
			CE.canvas.hud.context.fillRect(0, 180, 400, 20 * (this.keyCount + 1) + 10);
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