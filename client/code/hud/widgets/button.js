/*
 Button HUD element
 */
HudElements.Button = function (width, height, verticalMargin, horizontalMargin, text, anchor, color, font) {
	HudElement.call(this, "Button", null);
	this.anchor = anchor || this.anchor;
	this.image = "button_red";
	this.width = width || 32;
	this.height = height || 32;
	this.verticalMargin = verticalMargin || 0;
	this.horizontalMargin = horizontalMargin || 0;
	this.ninepatch = {
		enabled: true,
		left_width: 16,
		right_width: 16,
		top_height: 16,
		bottom_height: 16
	}
	this._text = new HudElements.Text(text, HudElement.Anchors.CENTER, color, font);
	// Default button style makes text not exactly centered in it
	this._text.verticalMargin = -3;
	this.addChild(this._text);
}

HudElements.Button.prototype = new HudElement();
HudElements.Button.prototype.constructor = HudElements.Button;

/*
 Please use setText for setting the text instead of accessing the variable directly
 */
HudElements.Button.prototype.setText = function (text) {
	this._text.setText(text);
}

HudElements.Button.prototype.setTextColor = function (color) {
	this._text.setColor(color);
}

HudElements.Button.prototype.setTextStroke = function (enable, color, width) {
	this._text.setStroke(enable, color, width);
}

/*
 Set a text function. To remove it set it to null. This function will be called on each draw() call.
 */
HudElements.Button.prototype.setTextFunction = function (func) {
	this._text.setTextFunction(func);
}

HudElements.Button.Premade = {
	buy: function (verticalMargin, horizontalMargin, anchor) {
		var tmpBtn = new HudElements.Button(41, 39, verticalMargin, horizontalMargin, null, anchor);
		tmpBtn.ninepatch.enabled = false;
		tmpBtn.image = "button_buy";
		tmpBtn.removeAllChildren();
		return tmpBtn;
	},
	pickup: function (verticalMargin, horizontalMargin, anchor) {
		var tmpBtn = new HudElements.Button(41, 39, verticalMargin, horizontalMargin, null, anchor);
		tmpBtn.ninepatch.enabled = false;
		tmpBtn.image = "button_pickup";
		tmpBtn.removeAllChildren();
		return tmpBtn;
	},
	switch: function (verticalMargin, horizontalMargin, anchor) {
		var tmpBtn = new HudElements.Button(41, 39, verticalMargin, horizontalMargin, null, anchor);
		tmpBtn.ninepatch.enabled = false;
		tmpBtn.image = "button_switch";
		tmpBtn.removeAllChildren();
		return tmpBtn;
	},
	close: function (verticalMargin, horizontalMargin, anchor) {
		var tmpBtn = new HudElements.Button(41, 39, verticalMargin, horizontalMargin, null, anchor);
		tmpBtn.ninepatch.enabled = false;
		tmpBtn.image = "button_close";
		tmpBtn.removeAllChildren();
		return tmpBtn;
	},
	delete: function (verticalMargin, horizontalMargin, anchor) {
		var tmpBtn = new HudElements.Button(37, 37, verticalMargin, horizontalMargin, null, anchor);
		tmpBtn.ninepatch.enabled = false;
		tmpBtn.image = "button_delete";
		tmpBtn.removeAllChildren();
		return tmpBtn;
	}
}