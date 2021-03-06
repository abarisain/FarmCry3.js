var diagramSizeX = 60;
var diagramSizeY = 40;
var diagramDeltaY = 10;
var diagramDetailWidth = 150;

MapItems.TileItemInfos = function (x, y) {
	this.x = x;
	this.y = y;
	this.color = null;//de type Color
	this.gradient = null;
	this.value = 0;
	this.valueMax = 0;
	this.text = null;
	this.visible = true;
}

MapItems.TileItemInfos.prototype = {
	constructor: MapItems.TileItemInfos,
	loadInformations: function () {
		this.color = CE.filterType.color;
		this.gradient = CE.canvas.information.context.createLinearGradient(0, 0, diagramDetailWidth, 0);
		this.gradient.addColorStop(0, this.color.right);
		this.gradient.addColorStop(1, this.color.border);
	},
	//coordonnees du centre de dessin
	drawInformations: function () {
		if (this.visible) {
			if (this.gradient == null) {
				this.loadInformations();
			}
			if (this.text == null) {//for the owners
				var top = this.value;
				if (Map.transitionInformation.started) {
					top = this.value * Map.transitionInformation.percentage();
				}
				CE.canvas.information.context.fillStyle = this.color.left;
				CE.canvas.information.context.beginPath();
				CE.canvas.information.context.moveTo(this.x, this.y + diagramSizeY / 2);
				CE.canvas.information.context.lineTo(this.x - diagramSizeX / 2, this.y);
				CE.canvas.information.context.lineTo(this.x - diagramSizeX / 2, this.y - top);
				CE.canvas.information.context.lineTo(this.x, this.y - top + diagramSizeY / 2);
				CE.canvas.information.context.fill();
				CE.canvas.information.context.fillStyle = this.color.right;
				CE.canvas.information.context.beginPath();
				CE.canvas.information.context.moveTo(this.x, this.y + diagramSizeY / 2);
				CE.canvas.information.context.lineTo(this.x + diagramSizeX / 2, this.y);
				CE.canvas.information.context.lineTo(this.x + diagramSizeX / 2, this.y - top);
				CE.canvas.information.context.lineTo(this.x, this.y - top + diagramSizeY / 2);
				CE.canvas.information.context.fill();
				CE.canvas.information.context.fillStyle = this.color.top;
				CE.canvas.information.context.beginPath();
				CE.canvas.information.context.lineTo(this.x - diagramSizeX / 2, this.y - top);
				CE.canvas.information.context.lineTo(this.x, this.y - top + diagramSizeY / 2);
				CE.canvas.information.context.lineTo(this.x + diagramSizeX / 2, this.y - top);
				CE.canvas.information.context.lineTo(this.x, this.y - top - diagramSizeY / 2);
				CE.canvas.information.context.fill();
				if (this.valueMax > 0) {
					var topMax = this.valueMax;
					if (Map.transitionInformation.started) {
						topMax = this.valueMax * Map.transitionInformation.percentage();
					}
					CE.canvas.information.context.globalAlpha = 0.75;
					CE.canvas.information.context.fillStyle = this.color.left;
					CE.canvas.information.context.beginPath();
					CE.canvas.information.context.moveTo(this.x, this.y - top + diagramSizeY / 2);
					CE.canvas.information.context.lineTo(this.x - diagramSizeX / 2, this.y - top);
					CE.canvas.information.context.lineTo(this.x - diagramSizeX / 2, this.y - topMax);
					CE.canvas.information.context.lineTo(this.x, this.y - topMax + diagramSizeY / 2);
					CE.canvas.information.context.fill();
					CE.canvas.information.context.fillStyle = this.color.right;
					CE.canvas.information.context.beginPath();
					CE.canvas.information.context.moveTo(this.x, this.y - top + diagramSizeY / 2);
					CE.canvas.information.context.lineTo(this.x + diagramSizeX / 2, this.y - top);
					CE.canvas.information.context.lineTo(this.x + diagramSizeX / 2, this.y - topMax);
					CE.canvas.information.context.lineTo(this.x, this.y - topMax + diagramSizeY / 2);
					CE.canvas.information.context.fill();
					CE.canvas.information.context.fillStyle = this.color.top;
					CE.canvas.information.context.beginPath();
					CE.canvas.information.context.lineTo(this.x - diagramSizeX / 2, this.y - topMax);
					CE.canvas.information.context.lineTo(this.x, this.y - topMax + diagramSizeY / 2);
					CE.canvas.information.context.lineTo(this.x + diagramSizeX / 2, this.y - topMax);
					CE.canvas.information.context.lineTo(this.x, this.y - topMax - diagramSizeY / 2);
					CE.canvas.information.context.fill();
					CE.canvas.information.context.globalAlpha = 1;
				}
			}
		}
	},
	drawInformationDetailed: function () {
		if (this.visible) {
			if (Map.transitionInformationDetailed.started) {
				CE.canvas.information.context.globalAlpha = Map.transitionInformationDetailed.progress / 10;
			}
			CE.canvas.information.context.translate(this.x + diagramSizeX / 2 + 2, this.y - (this.value / 2) - (diagramDeltaY));//deplacement du context pour le degrade
			CE.canvas.information.context.fillStyle = this.gradient;
			CE.canvas.information.context.fillRect(0, 0, diagramDetailWidth, 22);
			CE.canvas.information.context.strokeStyle = this.color.border;
			CE.canvas.information.context.lineWidth = 3;
			CE.canvas.information.context.lineCap = 'round';
			CE.canvas.information.context.strokeRect(0, 0, diagramDetailWidth, 22);
			CE.canvas.information.context.fillStyle = this.color.textColor;
			if (this.text == null) {//for the owners
				CE.canvas.information.context.fillText(CE.filterType.name + ' ' + Math.floor(this.value) + '%', 10, 17);
			} else {
				CE.canvas.information.context.fillText(this.text, 10, 17);
			}
			CE.canvas.information.context.translate(-(this.x + diagramSizeX / 2 + 2), -(this.y - (this.value / 2) - (diagramDeltaY)));//remise en place du context
			if (Map.transitionInformationDetailed.started) {
				CE.canvas.information.context.globalAlpha = 1;
			}
		}
	}
};