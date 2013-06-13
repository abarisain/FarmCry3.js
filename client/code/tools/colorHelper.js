//Le but de cette classe est de simplifier la gestion des couleurs
//Cette classe permet entre autre de faire de l'interpolation linéaire entre 2 couleurs facilement
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
	copyColor: function (color) {
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		this.rgb = color.rgb;
	},
	createColorFactor: function (color, secondColor, colorFactor) {
		this.r = Math.floor(color.r * (1 - colorFactor) + secondColor.r * (colorFactor));
		this.g = Math.floor(color.g * (1 - colorFactor) + secondColor.g * (colorFactor));
		this.b = Math.floor(color.b * (1 - colorFactor) + secondColor.b * (colorFactor));
		this.updateRGB();
	}
};

ColorHelper.Templates = {
	WHITE: {},
	BLUE: {},
	ORANGE: {},
	RED: {},
	GREEN: {}
};

ColorHelper.Color = {
	BLUE: {top: '#4df5ff', left: '#3dc2ff', right: '#226f94', textColor: '#fff', border: '#2e94b6'},
	GREEN: {top: '#c8ff46', left: '#9cf438', right: '#598b20', textColor: '#fff', border: '#75b02a'},
	YELLOW: {top: '#fff946', left: '#fec538', right: '#907120', textColor: '#fff', border: '#b4952c'},
	RED: {top: '#ff8181', left: '#d95e5e', right: '#8d3030', textColor: '#fff', border: '#bc4141'},
	BROWN: {top: '#f1765d', left: '#bc5641', right: '#632e23', textColor: '#fff', border: '#bc7141'},
	VIOLET: {top: '#bc71ff', left: '#8c54bf', right: '#502f6e', textColor: '#fff', border: '#8c54bf'},
	ORANGE: {top: '#ff9245', left: '#ff822b', right: '#a54400', textColor: '#fff', border: '#ed6b11'},
	CYAN: {top: '#21ffee', left: '#2cc5b9', right: '#1f766f', textColor: '#fff', border: '#2cc5b9'},
	WHITE: {top: '#f0f0f0', left: '#eee', right: '#908b83', textColor: '#fff', border: '#bbb'}
};

ColorHelper.ColorById = [
	ColorHelper.Color.BLUE,
	ColorHelper.Color.GREEN,
	ColorHelper.Color.RED,
	ColorHelper.Color.YELLOW,
	ColorHelper.Color.ORANGE,
	ColorHelper.Color.BROWN,
	ColorHelper.Color.VIOLET,
	ColorHelper.Color.CYAN,
	ColorHelper.Color.WHITE
];

ColorHelper.init = function () {
	this.Templates.WHITE = new ColorHelper(255, 255, 255);
	this.Templates.BLUE = new ColorHelper(61, 194, 255);
	this.Templates.ORANGE = new ColorHelper(255, 212, 128);
	this.Templates.RED = new ColorHelper(205, 79, 79);
	this.Templates.GREEN = new ColorHelper(183, 235, 91);
}