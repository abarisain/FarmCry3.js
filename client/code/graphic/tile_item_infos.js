var diagramSizeX = 60;
var diagramSizeY = 40;
var diagramDeltaY = 10;
var diagramDetailWidth = 140;

MapItems.TileItemInfos = function (x, y) {
	this.x = x;
	this.y = y;
	this.color = null;//de type Color
	this.gradient = null;
	this.value = 0;
	this.visible = true;
}

MapItems.TileItemInfos.prototype = {
	constructor: MapItems.TileItemInfos,
	loadInformations: function () {
		this.color = CE.filterType.color;
		this.gradient = CE.canvas.map.context.createLinearGradient(0, 0, diagramDetailWidth, 0);
		this.gradient.addColorStop(0, this.color.right);
		this.gradient.addColorStop(1, this.color.border);
	},
	//coordonnees du centre de dessin
	drawInformations: function () {
		if (this.visible) {
			if (this.gradient == null) {
				this.loadInformations();
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
		}
	},
	drawInformationDetailed: function () {
		if (this.visible) {
			if (Map.transitionInformationDetailed.started) {
				CE.canvas.map.context.globalAlpha = Map.transitionInformationDetailed.progress / 10;
			}
			CE.canvas.map.context.translate(this.x + diagramSizeX / 2 + 2, this.y - (this.value) - (diagramDeltaY / 2));//deplacement du context pour le degrade
			CE.canvas.map.context.fillStyle = this.gradient;
			CE.canvas.map.context.fillRect(0, 0, diagramDetailWidth, 22);
			CE.canvas.map.context.strokeStyle = this.color.border;
			CE.canvas.map.context.lineWidth = 3;
			CE.canvas.map.context.lineCap = 'round';
			CE.canvas.map.context.strokeRect(0, 0, diagramDetailWidth, 22);
			CE.canvas.map.context.fillStyle = this.color.textColor;
			CE.canvas.map.context.fillText(CE.filterType.name + ' ' + Math.floor(this.value) + '%', 10, 17);
			CE.canvas.map.context.translate(-(this.x + diagramSizeX / 2 + 2), -(this.y - (this.value) - (diagramDeltaY / 2)));//remise en place du context
			if (Map.transitionInformationDetailed.started) {
				CE.canvas.map.context.globalAlpha = 1;
			}
		}
	}
};