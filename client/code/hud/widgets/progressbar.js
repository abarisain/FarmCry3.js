/**
 Simple progressbar
 */
HudElements.ProgressBar = function (width, height, verticalMargin, horizontalMargin, anchor, text, textcolor, font) {
	HudElement.call(this, "ProgressBar", null);
	this.anchor = anchor || this.anchor;
	this.image = "progressbar_background";
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
	this.progress = 50;
	this.maxProgress = 100;
	this._progressbar = new HudElement("ProgressBar_progress", "progressbar_green", 0, this.height, 0, 0, HudElement.Anchors.TOP_LEFT, false);
	this._progressbar.ninepatch = {
		enabled: true,
		left_padding: 4,
		right_padding: 4,
		left_width: 16,
		right_width: 16,
		top_height: 16,
		bottom_height: 16
	}
	this.addChild(this._progressbar);
	this.computeProgressbarWidth();
	this._text = new HudElements.Text(text, HudElement.Anchors.CENTER, textcolor, font);
	// Default button style makes text not exactly centered in it
	this._text.verticalMargin = -3;
	this.addChild(this._text);
}

HudElements.ProgressBar.prototype = new HudElement();
HudElements.ProgressBar.prototype.constructor = HudElements.ProgressBar;

HudElements.ProgressBar.prototype.resize = function (width, height) {
	HudElement.prototype.resize.call(this, width, height);
	this._progressbar.height = this.height;
}

HudElements.ProgressBar.prototype.computeLayout = function () {
	HudElement.prototype.computeLayout.call(this);
	this._progressbar.height = this.height;
}

/**
 * Please use setText for setting the text instead of accessing the variable directly
 * @param {string} text
 */
HudElements.ProgressBar.prototype.setText = function (text) {
	this._text.setText(text);
}

/**
 * Set a text function. To remove it set it to null. This function will be called on each draw() call.
 * @param {Function} func
 */
HudElements.ProgressBar.prototype.setTextFunction = function (func) {
	this._text.setTextFunction(func);
}

/**
 * @param {string} image
 */
HudElements.ProgressBar.prototype.setProgressImage = function (image) {
	this._progressbar.image = image;
}

/**
 * @param {Number} progress
 */
HudElements.ProgressBar.prototype.setProgress = function (progress) {
	this.progress = progress;
	this.computeProgressbarWidth();
}

/**
 * @param {Number} maxProgress
 */
HudElements.ProgressBar.prototype.setMaxProgress = function (maxProgress) {
	this.maxProgress = maxProgress;
	this.computeProgressbarWidth();
}

HudElements.ProgressBar.prototype.computeProgressbarWidth = function () {
	var ninePatchPaddingSum = this._progressbar.ninepatch.left_padding + this._progressbar.ninepatch.right_padding;
	var tmpWidth = ninePatchPaddingSum + Math.ceil((this.width - ninePatchPaddingSum) * Math.min(1, this.progress / this.maxProgress));
	tmpWidth = Math.max(this._progressbar.ninepatch.left_width + this._progressbar.ninepatch.right_width,
		tmpWidth);
	this._progressbar.resize(tmpWidth, this._progressbar.height);
}