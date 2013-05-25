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

	var tmpCropsData = [];
	for(var key in GameState.crops) {
		tmpCropsData.push(GameState.crops[key]);
	}
	var cropsList = new HudElements.List(470, 520, 0, 0, HudElement.Anchors.TOP_LEFT,
		tmpCropsData,
		HudElements.List.PremadeLayouts.marketItem("cropMarketListItemLayout", 75),
		function (layout, index, item) {
			layout.viewbag.name.setText(item.name);
			layout.viewbag.price.setText(item.seed_price);
		}
	);
	book.rightPage.title = "Crops";
	book.rightPage.addChild(cropsList);

	return book;
};