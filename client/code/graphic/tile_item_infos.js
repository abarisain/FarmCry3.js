var diagramSizeX = 50;
var diagramSizeY = 60;
var diagramDeltaY = 23;

MapItems.TileItemInfos = function (x, y, diagrams) {
	this.diagrams = diagrams;//à partir de maintenant il s'agit de l'image et plus de l'index
	this.y = y;
	this.x = x;
	this.count = diagrams.length;
	for (var i = 0; i < this.count; i++) {
		this.diagrams[i].x = this.x;
		this.diagrams[i].y = this.y;
	}

}

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