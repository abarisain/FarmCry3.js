/*
 Text HUD elements
 */
HudElements.Text = function (text, anchor, color, font) {
	HudElement.call(this, "Text", null);
	this.anchor = anchor || this.anchor;
	this._text = text || null;
	this._textFunction = null;
	this._color = color || this.defaultColor;
	this._font = font || "bold 13pt stanberry,Calibri,Geneva,Arial";
	this._stroke = false;
	this._strokeColor = this.defaultColor;
	this._strokeWidth = 4;
	this._enableAutoSizing = true;
	this.wrap = false; // Automatically wrap text
	//By default, you cannot click on text
	this.clickable = false;
	if(this._textFunction == null && this._text != null)
		this.autoResize();
}

HudElements.Text.prototype = new HudElement();
HudElements.Text.prototype.constructor = HudElements.Text;

HudElements.Text.prototype.defaultColor = "#6f440d";
HudElements.Text.prototype.defaultStrokeInsideColor = "#f7e59c";

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
	if(!this.visible)
		return;
	//No need to call base since there is no background image or children
	this.setupCanvas();
	//If no text function, this function does nothing.
	this.updateWithTextFunction();
	// Note that text wrapping just overdraws, there is no height recalculation
	if(this.wrap) {
		var words = this._text.split(' ');
		var line = '';
		var yOffset = 0;
		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = this.targetCanvas.measureText(testLine);
			var testWidth = metrics.width;
			if(testWidth > this.width) {
				if (this._stroke)
					this.targetCanvas.strokeText(line, this._x, this._y + yOffset);
				this.targetCanvas.fillText(line, this._x, this._y + yOffset);
				line = words[n] + ' ';
				yOffset += this.height;
			}
			else {
				line = testLine;
			}
		}
		if (this._stroke)
			this.targetCanvas.strokeText(line, this._x, this._y + yOffset);
		this.targetCanvas.fillText(line, this._x, this._y + yOffset);
	} else {
		if (this._stroke)
			this.targetCanvas.strokeText(this._text, this._x, this._y + this.height, this.width);
		this.targetCanvas.fillText(this._text, this._x, this._y + this.height, this.width);
	}
}
HudElements.Text.prototype.setupCanvas = function () {
	if(this.targetCanvas == null) // We can't do that in the constructor
		this.targetCanvas = CrymeEngine.canvas.hud.context;
	//No need to use setFont because we will reapply the font on draw anyway
	this.targetCanvas.font = this._font;
	this.targetCanvas.fillStyle = this._color;
	this.targetCanvas.strokeStyle = this._strokeColor;
	if (this._stroke)
		this.targetCanvas.lineWidth = this._strokeWidth;
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
		var textWidth = this.targetCanvas.measureText(this._text).width;
		//An acceptable approximate of text height is the width of the capital M. Then add some safety extra pixels.
		var textHeight = this.targetCanvas.measureText("M").width + 2;
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

/**
 Stroke settings
 * @param {boolean} enable
 * @param [optionalParam] {string} color
 * @param [optionalParam] {number} width
 */
HudElements.Text.prototype.setStroke = function (enable, color, width) {
	this._stroke = enable;
	if(color) {
		this._strokeColor = color;
	} else {
		// Default stroke : switch the text color to stroke color and use the default inside stroke color
		this._strokeColor = this._color;
		this.setColor(this.defaultStrokeInsideColor);
	}
	if(width) {
		this._strokeWidth = width;
	}
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
