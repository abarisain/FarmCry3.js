/*
 Fullscreen Popup HUD element (modal)
 Please note that it doesn't care about opacity
 */
HudElements.FullscreenPopup = function (title, text) {
	HudElement.call(this);
	this.name = "PopupHost";
	this.anchor = HudElement.Anchors.TOP_LEFT;
	this.image = null;
	this.modal = true;
	this.clickable = true;

	this.close = function () {
		this.baseClose();
	}

	this.popup = new HudElements.Popup(title, text);
	this.popup.modal = true;
	this.popup.onOutsideClick = (function () {
		this.close();
	}).bind(this);
	this.popup.close = (function() {
		this.close();
	}).bind(this);
	this.addChild(this.popup);
}

HudElements.FullscreenPopup.prototype = new HudElement();
HudElements.FullscreenPopup.prototype.constructor = HudElements.FullscreenPopup;

HudElements.FullscreenPopup.prototype.draw = function () {
	if (this.visible) {
		if(this.targetCanvas == null) // We can't do that in the constructor
			this.targetCanvas = CrymeEngine.canvas.hud.context;
		// Gray out the screen
		this.targetCanvas.globalAlpha = 0.4;
		this.targetCanvas.fillStyle = "black";
		this.targetCanvas.fillRect(this._x, this._y, this.width, this.height);
		this.targetCanvas.globalAlpha = 1;

		var childrenCount = this.children.length;
		for (var i = 0; i < childrenCount; i++) {
			this.children[i].draw();
		}
	}
}

HudElements.FullscreenPopup.prototype.computeLayout = function () {
	this.height = this.parent.height;
	this.width = this.parent.width;
	HudElement.prototype.computeLayout.call(this);
}

HudElements.FullscreenPopup.prototype.baseClose = function () {
	this.parent.removeChild(this);
}

/*
 Popup HUD element (modal)
 */
HudElements.Popup = function (title, text) {
	HudElement.call(this);
	this.name = "PopupWindow";
	this.anchor = HudElement.Anchors.CENTER;
	this.image = "popup";
	this.modal = true;
	this.clickable = true;
	this.width = 400;
	this.height = 180;
	this._title = title || "Alert";
	this._text = text || "";

	this.ninepatch = {
		enabled: true,
		left_width: 22,
		right_width: 22,
		top_height: 68,
		bottom_height: 21
	}

	var tmpCloseBtn = HudElements.Button.Premade.close(15, -15, HudElement.Anchors.TOP_RIGHT);
	tmpCloseBtn.onClick = (function() {
		this.close();
	}).bind(this);

	var tmpTitle = new HudElements.Text();
	tmpTitle.setTextFunction((function() {
		return this._title;
	}).bind(this));
	tmpTitle.verticalMargin = 22;
	tmpTitle.horizontalMargin = 0;
	tmpTitle.anchor = HudElement.Anchors.TOP_CENTER;

	var tmpText = new HudElements.Text();
	tmpText.anchor = HudElement.Anchors.TOP_LEFT;
	tmpText.setText(this._text);
	tmpText.verticalMargin = 65;
	tmpText.horizontalMargin = 32;
	this.addChild(tmpText);
	tmpText.enableAutoSizing(false);
	tmpText.wrap = true;
	tmpText.width = 330;

	var tmpOkBtn = new HudElements.Button(120, 40, -46, 0, "OK", HudElement.Anchors.BOTTOM_CENTER, "#fff");
	tmpOkBtn.onClick = (function() {
		this.close();
	}).bind(this);
	tmpOkBtn.verticalMargin = -14;

	this.addChild(tmpCloseBtn);
	this.addChild(tmpTitle);
	this.addChild(tmpOkBtn);
}

HudElements.Popup.prototype = new HudElement();
HudElements.Popup.prototype.constructor = HudElements.FullscreenPopup;

HudElements.Popup.prototype.baseClose = function () {
	this.parent.removeChild(this);
}
