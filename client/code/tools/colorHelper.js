//Cette classe permet de faire de l'interpolation linéaire entre 2 couleurs facilement
function ColorHelper(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.rgb = {};
	this.updateRGB();
}

ColorHelper.prototype = {
	constructor: ColorHelper,
	updateRGB: function () {
		this.rgb = 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
	},
	createColorFactor: function (color, secondColor, colorFactor) {
		this.r = Math.floor(color.r * (1 - colorFactor) + secondColor.r * (colorFactor));
		this.g = Math.floor(color.g * (1 - colorFactor) + secondColor.g * (colorFactor));
		this.b = Math.floor(color.b * (1 - colorFactor) + secondColor.b * (colorFactor));
		this.updateRGB();
		return this.rgb;
	}
};

ColorHelper.Templates = {
	WHITE: {},
	BLUE: {},
	ORANGE: {},
	RED: {}
};

ColorHelper.init = function () {
	this.Templates.WHITE = new ColorHelper(255, 255, 255);
	this.Templates.BLUE = new ColorHelper(61, 194, 255);
	this.Templates.ORANGE = new ColorHelper(255, 212, 128);
	this.Templates.RED = new ColorHelper(255, 128, 128);
}