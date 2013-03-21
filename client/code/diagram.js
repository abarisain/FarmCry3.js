var texDiagramList = [
	{image: 'block'},
	{image: 'yellow'},
	{image: 'blue'},
	{image: 'green'}
];

var texDiagrams = [];

var diagramDetailWidth = 120;

function Diagram(color, count) {
	this.texture = null;
	this.count = count;
	this.color = color;//de type Color
	this.x = 0;
	this.y = 0;
	this.detailPosition = null;
	this.gradient = null;
}

Diagram.DetailPosition = [
	//direction = 0 ==> position droite
	//direction = 1 ==> position gauche
	{ x: diagramSizeX / 2, y: 0, direction: 0},
	{ x: -diagramDetailWidth, y: 10, direction: 1},
	{ x: diagramSizeX / 2, y: 30, direction: 0}
];

Diagram.Color = {
	WHITE: { color: 'rgb(255, 255, 255)', colorGradient: 'rgb(220, 220, 220)', text: 'Value ', index: 0 },
	YELLOW: { color: 'rgb(144, 113, 33)', colorGradient: 'rgb(180, 144, 44)', text: 'Maturity ', index: 1 },
	BLUE: { color: 'rgb(34, 111, 148)', colorGradient: 'rgb(46, 148, 182)', text: 'Humidity ', index: 2 },
	GREEN: { color: 'rgb(91, 141, 33)', colorGradient: 'rgb(117, 176, 42)', text: 'Fertility ', index: 3 }
};

Diagram.prototype = {
	constructor: Diagram,
	init: function () {
		this.texture = texDiagrams[this.color.index];
		//this.texture.updateWidthHeight();
		this.gradient = CE.canvas.map.context.createLinearGradient(0, 0, diagramDetailWidth, 0);
		this.gradient.addColorStop((0 + this.detailPosition.direction) % 2, this.color.color);
		this.gradient.addColorStop((1 + this.detailPosition.direction) % 2, this.color.colorGradient);
	},
	//coordonnees du centre de dessin
	drawItem: function () {
		for (var i = 0; i < this.count; i++) {
			CE.canvas.map.context.drawImage(this.texture.image, this.x, this.y - i * diagramDeltaY / 2, diagramSizeX / 2, diagramSizeY / 2);
		}
		/*CE.canvas.map.context.globalCompositeOperation = 'lighter';
		 CE.canvas.map.context.fillStyle = this.color.color;
		 CE.canvas.map.context.fillRect(x, y, 50, 80);
		 CE.canvas.map.context.globalCompositeOperation = 'source-over';*/
	},
	drawItemDetailed: function () {
		//Todo améliorer l'affichage détaillé de la case
		for (var i = 0; i < this.count; i++) {
			CE.canvas.map.context.drawImage(this.texture.image, this.x, this.y - i * diagramDeltaY / 2, diagramSizeX / 2, diagramSizeY / 2);
		}
		CE.canvas.map.context.translate(this.x + this.detailPosition.x, this.y - (this.count / 2) * (diagramDeltaY / 2) + this.detailPosition.y);//deplacement du context pour le degrade
		CE.canvas.map.context.fillStyle = this.gradient;
		CE.canvas.map.context.fillRect(0, 0, diagramDetailWidth, 22);
		CE.canvas.map.context.strokeStyle = this.color.colorGradient;
		CE.canvas.map.context.lineWidth = 2;
		CE.canvas.map.context.strokeRect(0, 0, diagramDetailWidth, 22);
		CE.canvas.map.context.fillStyle = "#fff";
		CE.canvas.map.context.fillText(this.color.text + Math.floor(this.count * 10) + '%', 10, 15);
		CE.canvas.map.context.translate(-(this.x + this.detailPosition.x), -(this.y - (this.count / 2) * (diagramDeltaY / 2) + this.detailPosition.y));//remise en place du context
	},
	drawItemTransition: function () {
		/*if (this.texture == null) {
		 this.init();
		 }*/
		for (var i = 0; i < this.count; i++) {
			CE.canvas.map.context.drawImage(this.texture.image, this.x, this.y - (i * diagramDeltaY / (2 * (Map.transition.progressMax - Map.transition.progress + 1))), diagramSizeX / 2, diagramSizeY / 2);
		}
	}
};

function LoadTexDiagram() {
	totalLoadingCount += texDiagramList.length;
	for (var i = 0; i < texDiagramList.length; i++) {
		var texture = new Texture(i, texDiagramList[i].image, 'src/diagram/' + texDiagramList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texDiagrams[i] = texture;
	}
}