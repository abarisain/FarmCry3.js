/*
 Premade books
 */
HudElements.Book.Premade = {};

HudElements.Book.Premade.Market = function () {
	var book = new HudElements.Book();
	var tmpBuildingsData = [];
	for(var key in GameState.buildings) {
		tmpBuildingsData.push(GameState.buildings[key]);
	}
	var buildingsList = new HudElements.List(470, 520, 0, 0, HudElement.Anchors.TOP_LEFT,
		tmpBuildingsData,
		HudElements.List.PremadeLayouts.marketItem("buildingMarketListItemLayout", 75),
		function (layout, index, item) {
			layout.viewbag.name.setText(item.name);
			layout.viewbag.price.setText(item.price);
		}
	);
	book.leftPage.title = "Buildings";
	book.leftPage.addChild(buildingsList);
	return book;
};