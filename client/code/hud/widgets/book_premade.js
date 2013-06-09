/*
 Premade books
 */
HudElements.Book.Premade = {};

HudElements.Book.Premade.Market = function () {
	var book = new HudElements.Book();
	book.close = (function () {
		CE.hud.panels.market = null;
		book.baseClose();
	}).bind(book);
	var tmpBuildingsData = [];
	for (var key in GameState.buildings) {
		tmpBuildingsData.push(GameState.buildings[key]);
	}
	var buildingsLayout = HudElements.List.PremadeLayouts.buildingMarketItem(null);
	buildingsLayout.viewbag.buy.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.buyBuilding(item.codename);
		CE.hud.panels.market.close();
	};
	var buildingsList = new HudElements.List(470, 510, 0, 0, HudElement.Anchors.TOP_LEFT,
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
	for (var key in GameState.crops) {
		tmpCropsData.push(GameState.crops[key]);
	}
	var cropsLayout = HudElements.List.PremadeLayouts.cropMarketItem(null);
	cropsLayout.viewbag.buy.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.buyCrop(item.codename);
		CE.hud.panels.market.close();
	};
	var cropsList = new HudElements.List(470, 510, 0, 0, HudElement.Anchors.TOP_LEFT,
		tmpCropsData,
		cropsLayout,
		function (layout, index, item) {
			layout.viewbag.icon.image = "market_" + item.codename;
			// I know that ticks aren't seconds, but we can't use that ...
			layout.viewbag.maturation.setText(item.maturation_time + " s");
			layout.viewbag.production.setText(item.productivity);
			layout.viewbag.storability.setText(item.storability + " s");
			layout.viewbag.price.setText(item.seed_price);
		}
	);
	book.rightPage.title = "Crops";
	book.rightPage.addChild(cropsList);

	return book;
};

HudElements.Book.Premade.Inventory = function () {
	var inventory = new HudElements.Book();
	inventory.close = (function () {
		CE.hud.panels.inventory = null;
		inventory.baseClose();
	}).bind(inventory);

	inventory.leftPage.title = "Character";

	/*var tmpInventoryData = ["j","j","j","j","j","j","j","j"];
	 GameState.player.inventory.forEach(function (inventoryItem) {
	 tmpInventoryData.push(GameState.logicItems[inventoryItem]);
	 });*/

	var inventoryItemLayout = HudElements.List.PremadeLayouts.inventoryItem(null);
	inventoryItemLayout.viewbag.sell.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.sellStoredCrop(item.id);
	};

	var inventoryItemList = new HudElements.List(470, 460, 0, 0, HudElement.Anchors.TOP_LEFT,
		[],
		inventoryItemLayout,
		function (layout, index, item) {
			layout.viewbag.icon.image = 'stored_' + item.crop;
			// I know that ticks aren't seconds, but we can't use that ...
			layout.viewbag.status.setText(item.healthStatus);
			layout.viewbag.price.setText(GameState.crops[item.crop].selling_price * item.harvested_quantity);
		}
	);
	inventory.rightPage.title = "Inventory";
	inventory.rightPage.viewbag.list = inventoryItemList;

	inventory.rightPage.viewbag.inventoryFillMeter = new HudElements.ProgressBar(200, 32, 0, 0, HudElement.Anchors.BOTTOM_CENTER);

	inventory.rightPage.addChild(inventory.rightPage.viewbag.list);
	inventory.rightPage.addChild(inventory.rightPage.viewbag.inventoryFillMeter);

	inventory.rightPage.refresh = (function () {
		var tmpInventoryData = [];
		for (var i = 0; i < GameState.player.inventory.length; i++) {
			tmpInventoryData.push(GameState.logicItems.storedCrops[GameState.player.inventory[i]]);
		}
		this.viewbag.list.setData(tmpInventoryData);
		this.viewbag.inventoryFillMeter.setProgress(tmpInventoryData.length);
		this.viewbag.inventoryFillMeter.setMaxProgress(GameState.inventorySize);
		this.viewbag.inventoryFillMeter.setText(tmpInventoryData.length + " / " + GameState.inventorySize);
	}).bind(inventory.rightPage);

	inventory.refresh();

	return inventory;
};