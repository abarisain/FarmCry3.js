var texDiagramList = [
	{image: 'block'}
];

var texDiagrams = [];

function Diagram(index, color, count) {
	this.texture = texDiagrams[index];//à partir de maintenant il s'agit de l'image et plus de l'index
	this.texture.updateWidthHeight();
	this.count = count;
	this.color = color;//de type Color
}

Diagram.Color = {
	WHITE: { color: 'rgb(125, 200, 0)', text: 'Value' }
};

Diagram.prototype = {
	constructor: Diagram,
	//coordonnees du centre de dessin
	drawItem: function (x, y) {
		for (var i = 0; i < this.count; i++) {
			CE.canvas.map.context.drawImage(this.texture.image, x - this.texture.width / 2, y - this.texture.height / 2 - i * 23);
		}
		/*CE.canvas.map.context.globalCompositeOperation = 'lighter';
		 CE.canvas.map.context.fillStyle = this.color.color;
		 CE.canvas.map.context.fillRect(x, y, 50, 80);
		 CE.canvas.map.context.globalCompositeOperation = 'source-over';*/
	}
};

function LoadTexDiagram() {
	totalLoadingCount += texDiagramList.length * 2;//2 pour les textures infos
	for (var i = 0; i < texDiagramList.length; i++) {
		var texture = new Texture(i, texDiagramList[i].image, 'src/diagram/' + texDiagramList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texDiagrams[i] = texture;
	}
}