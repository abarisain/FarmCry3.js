var diagramSizeX = 50;
var diagramSizeY = 60;
var diagramDeltaY = 23;

function TileItemInfos(x, y, diagrams) {
	this.diagrams = diagrams;//à partir de maintenant il s'agit de l'image et plus de l'index
	this.y = y;
	this.x = x;
	this.count = diagrams.length;
	for (var i = 0; i < this.count; i++) {
		this.diagrams[i].x = this.x + TileItemInfos.Place[this.count - 1][i].x - diagramSizeX / 4;
		this.diagrams[i].y = this.y + TileItemInfos.Place[this.count - 1][i].y - diagramSizeY / 4;
	}

}

//contient les coordonnées disponibles pour placer plusieurs diagrammes sur une case
TileItemInfos.Place = [
	[
		{ x: 0, y: 0}
	],
	[
		{ x: 10, y: -10},
		{ x: -10, y: 10}
	],
	[
		{ x: 20, y: -5},
		{ x: -20, y: -5},
		{ x: 0, y: 15}
	]
];

TileItemInfos.prototype = {
	constructor: TileItemInfos,
	//coordonnees du centre de dessin
	drawInformations: function () {
		if (Map.transition.started) {
			for (var i = 0; i < this.count; i++) {
				this.diagrams[i].drawItemTransition();
			}
		} else {
			for (var i = 0; i < this.count; i++) {
				this.diagrams[i].drawItem();
			}
		}
	}
};