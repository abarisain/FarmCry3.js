var texCharacterList = [
	{image: 'player', centerX: 19, centerY: 15},
	{image: 'farmer', centerX: 15, centerY: 18}
];
var texCharacters = [];

TileItems.Character = function (targetFarmer) {
    var type = targetFarmer.constructor == PlayableFarmer ? 1 : 0;
	TileItem.call(this, texCharacters[type], texCharacters[type], targetFarmer.col, targetFarmer.line, texCharacterList[type].centerX, texCharacterList[type].centerY);
    this.farmer = targetFarmer;
}

TileItems.Character.prototype = new TileItem();
TileItems.Character.prototype.constructor = TileItems.Character;

function LoadTexCharacters() {
	totalLoadingCount += texCharacterList.length;
	for (var i = 0; i < texCharacterList.length; i++) {
		var texture = new Texture(i, texCharacterList[i].image, 'src/character/' + texCharacterList[i].image + '.png');
		texture.image.addEventListener('load', texture.loadingEnded);
		texCharacters[i] = texture;
	}
}