/*
 Button HUD element
 */
HudElements.Button = function (width, height, text, anchor, color, font) {
	HudElement.call(this, "Button", null);
	this.anchor = anchor || this.anchor;
	this.image = "button_red";
	this.width = width || 32;
	this.height = height || 32;
	this.ninepatch = {
		enabled: true,
		left_width: 16,
		right_width: 16,
		top_height: 16,
		bottom_height: 16
	}
	this._text = new HudElements.Text(text, HudElement.Anchors.CENTER, color, font);
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

HudElements.CloseButton = function (text, anchor, color, font) {
	HudElements.Button.call(this, text, anchor, color, font);
	this.name = "Close Button";
	this.image = "button_close";
	this.height = 37;
	this.width = 37;
	this.ninepatch.enabled = false;
}

HudElements.CloseButton.prototype = HudElements.Button;
HudElements.CloseButton.prototype.constructor = HudElements.CloseButton;