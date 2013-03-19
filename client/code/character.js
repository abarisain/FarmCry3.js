var texCharacterList = [
	{image: 'farmer', centerX: 0, centerY: 0}
];
var texCharacters = [];

TileItems.Character = function (type, col, line) {
	TileItem.call(this, texCharacters[type], col, line, texCharacterList[type].centerX, texCharacterList[type].centerY);
}

TileItems.Character.prototype = new TileItem();
TileItems.Character.prototype.constructor = TileItems.Character;

function LoadTexBuildings() {
	totalLoadingCount += texCharacterList.length;
	for (var i = 0; i < texCharacterList.length; i++) {
		var texture = new Texture(i, texCharacterList[i].image, 'src/character/' + texCharacterList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texCharacters[i] = texture;
	}
}