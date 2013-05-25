/*
 Premade books
 */
HudElements.Book.Premade = {};

HudElements.Book.Premade.Market = function () {
	var book = new HudElements.Book();
	book.close = (function() {
		CE.hud.market = null;
		book.baseClose();
	}).bind(book);
	var tmpBuildingsData = [];
	for(var key in GameState.buildings) {
		tmpBuildingsData.push(GameState.buildings[key]);
	}
	var buildingsLayout = HudElements.List.PremadeLayouts.buildingMarketItem(null);
	buildingsLayout.viewbag.buy.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.buyBuilding(item.codename);
		CE.hud.market.close();
	};
	var buildingsList = new HudElements.List(470, 520, 0, 0, HudElement.Anchors.TOP_LEFT,
		tmpBuildingsData,
		buildingsLayout,
		function (layout, index, item) {
			layout.viewbag.icon.image = "market_" + item.codename;
			layout.viewbag.capacity.setText(item.capacity);
			layout.viewbag.withering.setText(item.stops_withering ? "Yes" : "No");
			layout.viewbag.maintenance.setText(item.price_tick == 0 ? "None" : (item.price_tick + " per second"));
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