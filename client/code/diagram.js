var texDiagramList = [
	{image: 'block'},
	{image: 'yellow'},
	{image: 'blue'},
	{image: 'green'}
];

var texDiagrams = [];

function Diagram(color, count) {
	this.texture = null;
	this.count = count;
	this.color = color;//de type Color
	this.x = 0;
	this.y = 0;
}

Diagram.Color = {
	WHITE: { color: 'rgb(125, 200, 0)', text: 'Value', index: 0 },
	YELLOW: { color: 'rgb(125, 200, 0)', text: 'Value', index: 1 },
	BLUE: { color: 'rgb(125, 200, 0)', text: 'Value', index: 2 },
	GREEN: { color: 'rgb(125, 200, 0)', text: 'Value', index: 3 }
};

Diagram.prototype = {
	constructor: Diagram,
	//coordonnees du centre de dessin
	drawItem: function () {
		if (this.texture == null) {
			this.texture = texDiagrams[this.color.index];
			//this.texture.updateWidthHeight();
		}
		for (var i = 0; i < this.count; i++) {
			CE.canvas.map.context.drawImage(this.texture.image, this.x, this.y - i * diagramDeltaY / 2, diagramSizeX / 2, diagramSizeY / 2);
		}
		/*CE.canvas.map.context.globalCompositeOperation = 'lighter';
		 CE.canvas.map.context.fillStyle = this.color.color;
		 CE.canvas.map.context.fillRect(x, y, 50, 80);
		 CE.canvas.map.context.globalCompositeOperation = 'source-over';*/
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