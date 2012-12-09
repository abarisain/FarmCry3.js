function LoadTiles() {
	totalLoadingCount += texTileList.length;
	LoadTexTiles();
}

function LoadTexTiles() {
	for (var i = 0; i < texTileList.length; i++) {
		var tile = new Image();
		tile.src = 'src/tiles/' + texTileList[i] + '.png';
		tile.onload = function () {
			texTiles.push(this);
			currentLoadingCount++;
		};
	}
}