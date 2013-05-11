var diagramSizeX = 50;
var diagramSizeY = 60;
var diagramDeltaY = 23;

MapItems.TileItemInfos = function (x, y, diagrams) {
	this.diagrams = diagrams;//à partir de maintenant il s'agit de l'image et plus de l'index
	this.y = y;
	this.x = x;
	this.count = diagrams.length;
	for (var i = 0; i < this.count; i++) {
		this.diagrams[i].x = this.x + MapItems.TileItemInfos.Place[this.count - 1][i].x - diagramSizeX / 4;
		this.diagrams[i].y = this.y + MapItems.TileItemInfos.Place[this.count - 1][i].y - diagramSizeY / 4;
		this.diagrams[i].detailPosition = Diagram.DetailPosition[i];
	}

}

//contient les coordonnées disponibles pour placer plusieurs diagrammes sur une case
MapItems.TileItemInfos.Place = [
	[
		{ x: 0, y: 0}
	],
	[
		{ x: 12, y: -12},
		{ x: -12, y: 12}
	],
	[
		{ x: 20, y: -5},
		{ x: -20, y: -5},
		{ x: 0, y: 15}
	]
];

MapItems.TileItemInfos.prototype = {
	constructor: MapItems.TileItemInfos,
	//coordonnees du centre de dessin
	drawInformations: function () {
		for (var i = 0; i < this.count; i++) {
			this.diagrams[i].drawItem();
		}
	},
	drawInformationDetailed: function () {
		for (var i = 0; i < this.count; i++) {
			this.diagrams[i].drawItemDetailed();
		}
	},
	loadInformations: function () {
		for (var i = 0; i < this.count; i++) {
			this.diagrams[i].init();
		}
	}
};