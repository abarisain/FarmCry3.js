CrymeEngine.keyboard = {
	showKeyMap: false,//pour afficher ou non la keyMap à l'écran
	Keys: {
		ENTER: 13,
		SPACE: 32,
		TAB: 9,
		KEY_1: 49,
		KEY_2: 50,
		KEY_3: 51,
		KEY_4: 52,
		KEY_5: 53
	},
	Shortcuts: {
		CHAT: undefined,
		INVENTORY: undefined,
		KEY_MAP: undefined,
		SHOW_GRAPHIC_DEBUG: undefined,
		SHOW_GRAPHIC_DEBUG_ITEM: undefined,
		SHOW_GRAPHIC_DEBUG_MAP: undefined,
		SHOW_GRAPHIC_DEBUG_ADVANCED: undefined,
		CHANGE_GRAPHIC_DEBUG_ALPHA: undefined
	},
	init: function () {
		CE.keyboard.Shortcuts.CHAT = CrymeEngine.keyboard.Keys.ENTER;
		CE.keyboard.Shortcuts.INVENTORY = CE.keyboard.Keys.SPACE;
		CE.keyboard.Shortcuts.KEY_MAP = CE.keyboard.Keys.TAB;
		CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG = CE.keyboard.Keys.KEY_1;
		CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_ITEM = CE.keyboard.Keys.KEY_2;
		CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_MAP = CE.keyboard.Keys.KEY_3;
		CE.keyboard.Shortcuts.SHOW_GRAPHIC_DEBUG_ADVANCED = CE.keyboard.Keys.KEY_4;
		CE.keyboard.Shortcuts.CHANGE_GRAPHIC_DEBUG_ALPHA = CE.keyboard.Keys.KEY_5;
	},
	drawKeyMap: function () {
		CE.canvas.hud.context.fillStyle = "rgba(29, 82, 161, 0.8)";
		CE.canvas.hud.context.fillRect(0, 200, 400, 20 * CE.keyboard.Shortcuts.length);
		CE.canvas.hud.context.fillStyle = "#fff";
		for (var i = 0; i < CE.keyboard.Shortcuts.length; i++) {

			CE.canvas.hud.context.fillText('Key : ' + CE.keyboard.Shortcuts[i], 20, 200 + 20 * i);
			CE.canvas.hud.context.fillText('...          ' + CE.keyboard.Keys[i], 220, 200 + 20 * i);
		}
	}
};