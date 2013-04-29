TileItems.Character = function (targetFarmer) {
	var index = targetFarmer.constructor == PlayableFarmer ? 1 : 0;
	this.farmer = targetFarmer;
	TileItem.call(this, SpritePack.Characters.spriteList[index], targetFarmer.position.col, targetFarmer.position.line);
}

TileItems.Character.prototype = new TileItem();
TileItems.Character.prototype.constructor = TileItems.Character;