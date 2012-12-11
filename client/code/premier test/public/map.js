var Map = {
	tiles: [],
	buildings: [],
	crops: [],
	borders: [],
	init: function (data) {
		this.loadTiles((data.tiles));
	},
	loadTiles: function (tileData) {
		for (var i = 0; i < tileData.length; i++) {
			for (var j = 0; j < tileData[i].length; j++) {

			}
		}
	}
}