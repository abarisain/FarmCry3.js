CrymeEngine.keyboard = {
	showKeyMap: false,//pour afficher ou non la keyMap à l'écran
	keyCount: -1,
	Keys: {
		ENTER: { value: 13, name: 'Enter' },
		SPACE: { value: 32, name: 'Space' },
		TAB: { value: 9, name: 'Tab' },
		KEY_A: { value: 65, name: 'A' },
		KEY_B: { value: 66, name: 'B' },
		KEY_C: { value: 67, name: 'C' },
		KEY_D: { value: 68, name: 'D' },
		KEY_E: { value: 69, name: 'E' },
		KEY_Q: { value: 81, name: 'Q' },
		KEY_R: { value: 82, name: 'R' },
		KEY_S: { value: 83, name: 'S' },
		KEY_Z: { value: 90, name: 'Z' },
		KEY_1: { value: 49, name: '&' },
		KEY_2: { value: 50, name: 'é' },
		KEY_3: { value: 51, name: '"' },
		KEY_4: { value: 52, name: '\'' },
		KEY_5: { value: 53, name: '(' }
	},
	Shortcuts: {
		CHAT: null,
		CHANGE_DISPLAY_TYPE: null,
		MOVE_UP: null,
		MOVE_DOWN: null,
		MOVE_LEFT: null,
		MOVE_RIGHT: null,
		MOVE_MAP: null,
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
		CE.keyboard.Shortcuts.LAUNCH_BATTLE = CE.keyboard.Keys.KEY_E;
		CE.keyboard.Shortcuts.STOP_BATTLE = CE.keyboard.Keys.KEY_R;
		CE.keyboard.Shortcuts.MOVE_UP = CE.keyboard.Keys.KEY_Z;
		CE.keyboard.Shortcuts.MOVE_DOWN = CE.keyboard.Keys.KEY_S;
		CE.keyboard.Shortcuts.MOVE_LEFT = CE.keyboard.Keys.KEY_Q;
		CE.keyboard.Shortcuts.MOVE_RIGHT = CE.keyboard.Keys.KEY_D;
		CE.keyboard.Shortcuts.MOVE_MAP = CE.keyboard.Keys.SPACE;
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
			case CE.keyboard.Shortcuts.CHAT.value:
				if (document.activeElement == CE.hud.chat.divs.input) {
					CE.hud.chat.send();
				} else {
					CE.hud.chat.divs.input.focus();
				}
				break;
			case CE.keyboard.Shortcuts.CHANGE_DISPLAY_TYPE.value:
				CE.displayType = (CE.displayType + 1) % 3;
				if (CE.displayType != CE.DisplayType.STANDARD) {
					Map.showMapInformations();
				}
				Map.tileHighLighted.index = -1;
				break;
			case CE.keyboard.Shortcuts.SHOW_KEY_MAP.value:
				CE.keyboard.showKeyMap = !CE.keyboard.showKeyMap;
				break;
			case CE.keyboard.Shortcuts.MOVE_UP.value:
				CE.camera.position.y += Options.Gameplay.mapSpeed;
				break;
			case CE.keyboard.Shortcuts.MOVE_DOWN.value:
				CE.camera.position.y -= Options.Gameplay.mapSpeed;
				break;
			case CE.keyboard.Shortcuts.MOVE_LEFT.value:
				CE.camera.position.x += Options.Gameplay.mapSpeed;
				break;
			case CE.keyboard.Shortcuts.MOVE_RIGHT.value:
				CE.camera.position.x -= Options.Gameplay.mapSpeed;
				break;
			case CE.keyboard.Shortcuts.LAUNCH_BATTLE.value:
				CE.gameState = CE.GameState.BATTLE;
				CE.Battle.launchBattle();
				CE.mapInvalidated = true;
				break;
			case CE.keyboard.Shortcuts.STOP_BATTLE.value:
				CE.gameState = CE.GameState.FARMING;
				CE.mapInvalidated = true;
				break;
			case CE.keyboard.Shortcuts.MOVE_MAP.value:
				//Todo ajouter une recuperation de la position de la souris
				/*CrymeEngine.mousePosition.x = event.pageX - this.offsetLeft;
				 CrymeEngine.mousePosition.y = event.pageY - this.offsetTop;
				 CE.movingMap = true;*/
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
	keyReleased: function (event) {
		switch (event.keyCode) {
			case CE.keyboard.Shortcuts.MOVE_MAP.value:
				CE.movingMap = false;
				break;
		}
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