/*
 Text HUD elements
 */
HudElements.Text = function (text, anchor, color, font) {
	HudElement.call(this, "Text", null);
	this.anchor = anchor || this.anchor;
	this._text = text || null;
	this._textFunction = null;
	this._color = color || "#6f440d";
	this._font = font || "bold 13pt stanberry,Calibri,Geneva,Arial";
	this._enableAutoSizing = true;
	//By default, you cannot click on text
	this.clickable = false;
	if(this._textFunction == null && this._text != null)
		this.autoResize();
}

HudElements.Text.prototype = new HudElement();
HudElements.Text.prototype.constructor = HudElements.Text;
HudElements.Text.prototype.updateWithTextFunction = function () {
	if (this._textFunction != null) {
		var newText = this._textFunction();
		if (this._text != newText) {
			this._text = newText;
			this.autoResize();
		}
	}
}
HudElements.Text.prototype.draw = function () {
	if(this._text == null && this._textFunction == null)
		return;
	//No need to call base since there is no background image or children
	this.setupCanvas();
	//If no text function, this function does nothing.
	this.updateWithTextFunction();
	CrymeEngine.canvas.hud.context.fillText(this._text, this._x, this._y + this.height, this.width);
}
HudElements.Text.prototype.setupCanvas = function () {
	//No need to use setFont because we will reapply the font on draw anyway
	CrymeEngine.canvas.hud.context.font = this._font;
	CrymeEngine.canvas.hud.context.fillStyle = this._color;
}

HudElements.Text.prototype.onAttached = function () {
	this.autoResize();
}

HudElements.Text.prototype.resize = function (width, height) {
	//Disable resizing if auto sizing is enabled since it will be recalculated at some point anyway
	if (!this._enableAutoSizing) {
		HudElement.prototype.resize.call(this, width, height);
	}
}
HudElements.Text.prototype.autoResize = function () {
	if (this._enableAutoSizing) {
		this.setupCanvas();
		var textWidth = CrymeEngine.canvas.hud.context.measureText(this._text).width;
		//An acceptable approximate of text height is the width of the capital M. Then add some safety extra pixels.
		var textHeight = CrymeEngine.canvas.hud.context.measureText("M").width + 2;
		HudElement.prototype.resize.call(this, textWidth, textHeight);
	}
}
/*
 Please use setText for setting the text instead of accessing the variable directly
 */
HudElements.Text.prototype.setText = function (text) {
	this._text = text;
	this.autoResize();
}
/*
 Set a text function. To remove it set it to null. This function will be called on each draw() call.
 */
HudElements.Text.prototype.setTextFunction = function (func) {
	this._textFunction = func;
	this.updateWithTextFunction();
	this.autoResize(); //autoResize might be ran twice but this is no big deal. Will be optimized if necessary.
}
/*
 Same as setText for the same reasons
 */
HudElements.Text.prototype.setFont = function (font) {
	this._font = font;
	this.autoResize();
}
/*
 Same as setText for not the same reason this time, but for consistency
 */
HudElements.Text.prototype.setColor = function (color) {
	this._color = color;
}
/*
 Same as setText for the same reasons
 */
HudElements.Text.prototype.enableAutoSizing = function (enableAutoSizing) {
	this._enableAutoSizing = enableAutoSizing;
	this.autoResize();
}
/*
 Text cannot have any children
 */
HudElements.Text.prototype.addChild = function () {
	console.log("Error : addChild called on HudElements.Text. A text cannot have any children");
}
HudElements.Text.prototype.removeAllChildren = function () {
	console.log("Error : removeAllChildren called on HudElements.Text. A text cannot have any children");
}
