/*
 Button HUD element
 */
HudElements.Button = function (text, anchor, color, font) {
	HudElement.call(this, "Button", null);
	this.anchor = anchor || this.anchor;
	this.image = "button_red";
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