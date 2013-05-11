function CrymeCanvas(selector) {
	//Canvas is accessible using context.canvas, but this is more readable
	this.canvas = document.querySelector(selector);
	this.context = this.canvas.getContext("2d");
	this.height = 0;
	this.width = 0;
	this.font = "11pt stanberry, Helvetica, Arial, sans-serif";
}

CrymeCanvas.prototype.resize = function (width, height) {
	this.width = width;
	this.height = height;
	this.canvas.width = width;
	this.canvas.height = height;
	//Reapply font after resizing, otherwise the canvas sets it to the default one
	this.context.font = this.font;
	CrymeEngine.mapInvalidated = true;
};

CrymeCanvas.prototype.clear = function () {
	this.context.clearRect(0, 0, this.width, this.height);
};

CrymeCanvas.prototype.setFont = function (font) {
	this.font = font;
	this.context.font = this.font;
};