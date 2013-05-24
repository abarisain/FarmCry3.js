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
	// Default button style makes text not exactly centered it in
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

/*
 Set a text function. To remove it set it to null. This function will be called on each draw() call.
 */
HudElements.Button.prototype.setTextFunction = function (func) {
	this._text.setTextFunction(func);
}

/*
 Special buttons, since I don't have a style system =°
 */

HudElements.CloseButton = function (verticalMargin, horizontalMargin, anchor) {
	HudElements.Button.call(this);
	this.name = "Close Button";
	this.image = "button_close";
	this.height = 37;
	this.width = 37;
	this.verticalMargin = verticalMargin;
	this.horizontalMargin = horizontalMargin;
	this.anchor = anchor;
	this.ninepatch.enabled = false;
}

HudElements.CloseButton.prototype = new HudElements.Button();
HudElements.CloseButton.prototype.constructor = HudElements.CloseButton;