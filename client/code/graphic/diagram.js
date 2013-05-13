var diagramSizeX = 60;
var diagramSizeY = 40;
var diagramSizeZ = 100;
var diagramDetailWidth = 140;

function Diagram(color, text, count) {
	this.count = count;
	this.color = color;//de type Color
	this.x = 0;
	this.y = 0;
	this.gradient = null;
	this.value = count * 10;
	this.text = text;
}

Diagram.Color = {
	BLUE: {top: '#4df5ff', left: '#3dc2ff', right: '#226f94', textColor: '#fff', border: '#2e94b6'},
	GREEN: {top: '#c8ff46', left: '#9cf438', right: '#598b20', textColor: '#fff', border: '#75b02a'},
	YELLOW: {top: '#fff946', left: '#fec538', right: '#907120', textColor: '#fff', border: '#b4952c'},
	RED: {top: '#ff8181', left: '#d95e5e', right: '#8d3030', textColor: '#fff', border: 'bc4141'},
	BROWN: {top: '#f1765d', left: '#bc5641', right: '#632e23', textColor: '#fff', border: 'bc7141'},
	VIOLET: {top: '#bc71ff', left: '#8c54bf', right: '#502f6e', textColor: '#fff', border: '8c54bf'},
	ORANGE: {top: '#ff9245', left: '#ff822b', right: '#a54400', textColor: '#fff', border: 'ed6b11'},
	CYAN: {top: '#21ffee', left: '#2cc5b9', right: '#1f766f', textColor: '#fff', border: '2cc5b9'},
	WHITE: {top: '#f0f0f0', left: '#eee', right: '#908b83', textColor: '#fff', border: 'bbb'}
};

Diagram.ColorById = [
	Diagram.Color.BLUE,
	Diagram.Color.GREEN,
	Diagram.Color.RED,
	Diagram.Color.YELLOW,
	Diagram.Color.ORANGE,
	Diagram.Color.BROWN,
	Diagram.Color.VIOLET,
	Diagram.Color.CYAN,
	Diagram.Color.WHITE
];

Diagram.prototype = {
	constructor: Diagram,
	init: function () {
		this.gradient = CE.canvas.map.context.createLinearGradient(0, 0, diagramDetailWidth, 0);
		this.gradient.addColorStop(0, this.color.right);
		this.gradient.addColorStop(1, this.color.border);
	},
	//coordonnees du centre de dessin
	drawItem: function () {
		if (this.gradient == null) {
			this.init();
		}
		var top = this.value;
		if (Map.transitionInformation.started) {
			top = this.value * Map.transitionInformation.percentage();
		}
		CE.canvas.map.context.fillStyle = this.color.left;
		CE.canvas.map.context.beginPath();
		CE.canvas.map.context.moveTo(this.x, this.y + diagramSizeY / 2);
		CE.canvas.map.context.lineTo(this.x - diagramSizeX / 2, this.y);
		CE.canvas.map.context.lineTo(this.x - diagramSizeX / 2, this.y - top);
		CE.canvas.map.context.lineTo(this.x, this.y - top + diagramSizeY / 2);
		CE.canvas.map.context.fill();
		CE.canvas.map.context.fillStyle = this.color.right;
		CE.canvas.map.context.beginPath();
		CE.canvas.map.context.moveTo(this.x, this.y + diagramSizeY / 2);
		CE.canvas.map.context.lineTo(this.x + diagramSizeX / 2, this.y);
		CE.canvas.map.context.lineTo(this.x + diagramSizeX / 2, this.y - top);
		CE.canvas.map.context.lineTo(this.x, this.y - top + diagramSizeY / 2);
		CE.canvas.map.context.fill();
		CE.canvas.map.context.fillStyle = this.color.top;
		CE.canvas.map.context.beginPath();
		CE.canvas.map.context.lineTo(this.x - diagramSizeX / 2, this.y - top);
		CE.canvas.map.context.lineTo(this.x, this.y - top + diagramSizeY / 2);
		CE.canvas.map.context.lineTo(this.x + diagramSizeX / 2, this.y - top);
		CE.canvas.map.context.lineTo(this.x, this.y - top - diagramSizeY / 2);
		CE.canvas.map.context.fill();
	},
	drawItemDetailed: function () {
		if (Map.transitionInformationDetailed.started) {
			CE.canvas.map.context.globalAlpha = Map.transitionInformationDetailed.progress / 10;
		}
		CE.canvas.map.context.translate(this.x + diagramSizeX / 2 + 2, this.y - (this.count / 2) * (diagramDeltaY / 2));//deplacement du context pour le degrade
		CE.canvas.map.context.fillStyle = this.gradient;
		CE.canvas.map.context.fillRect(0, 0, diagramDetailWidth, 22);
		CE.canvas.map.context.strokeStyle = this.color.border;
		CE.canvas.map.context.lineWidth = 3;
		CE.canvas.map.context.lineCap = 'round';
		CE.canvas.map.context.strokeRect(0, 0, diagramDetailWidth, 22);
		CE.canvas.map.context.fillStyle = this.color.textColor;
		CE.canvas.map.context.fillText(this.text + ' ' + Math.floor(this.count * 10) + '%', 10, 17);
		CE.canvas.map.context.translate(-(this.x + diagramSizeX / 2 + 2), -(this.y - (this.count / 2) * (diagramDeltaY / 2)));//remise en place du context
		if (Map.transitionInformationDetailed.started) {
			CE.canvas.map.context.globalAlpha = 1;
		}
	}
};