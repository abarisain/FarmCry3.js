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
	book.rightPage.viewbag.list = new HudElements.List(470, 510, 0, 0, HudElement.Anchors.TOP_LEFT,
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
	book.rightPage.addChild(book.rightPage.viewbag.list);

	book.rightPage.refresh = (function () {
		this.viewbag.list.invalidate();
	}).bind(book.rightPage);

	book.refresh();

	return book;
};

HudElements.Book.Premade.Inventory = function () {
	var inventory = new HudElements.Book();
	inventory.close = (function () {
		CE.hud.panels.inventory = null;
		inventory.baseClose();
	}).bind(inventory);

	inventory.leftPage.title = "Character";

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
			layout.viewbag.sell.image = (item.time_left > 0 ? "button_buy" : "button_close");
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

HudElements.Book.Premade.Building = function (building) {
	var inventory = new HudElements.Book();
	inventory._building = building;
	inventory.close = (function () {
		CE.hud.panels.building_content = null;
		inventory.baseClose();
	}).bind(inventory);

	/*
	 Left page
	 */

	var buildingItemLayout = HudElements.List.PremadeLayouts.inventoryBuildingItem(null);
	buildingItemLayout.viewbag.switch.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.pickupStoredCrop(item.id);
	};
	buildingItemLayout.viewbag.sell.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.sellStoredCrop(item.id);
	};

	var buildingItemList = new HudElements.List(470, 460, 0, 0, HudElement.Anchors.TOP_LEFT,
		[],
		buildingItemLayout,
		function (layout, index, item) {
			layout.viewbag.icon.image = 'stored_' + item.logicStoredCrop.crop;
			layout.viewbag.status.setText(item.healthStatus);
			console.debug(item.logicStoredCrop);
			layout.viewbag.price.setText(GameState.crops[item.logicStoredCrop.crop].selling_price * item.harvested_quantity);
		}
	);

	inventory.leftPage.title = "Building";
	inventory.leftPage.viewbag.list = buildingItemList;
	inventory.leftPage.viewbag.listLayout = buildingItemLayout;

	inventory.leftPage.viewbag.buildingFillMeter = new HudElements.ProgressBar(200, 32, 0, 0, HudElement.Anchors.BOTTOM_CENTER);

	inventory.leftPage.viewbag.sellBuilding = HudElements.Button.Premade.buy(0, 0, HudElement.Anchors.CENTER_LEFT);
	inventory.leftPage.viewbag.sellBuilding.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.sellBuilding();
	};

	inventory.leftPage.viewbag.sellBuildingPrice = new HudElements.Text("");
	inventory.leftPage.viewbag.sellBuildingPrice = HudElement.Anchors.CENTER_RIGHT;
	inventory.leftPage.viewbag.sellBuildingPrice = 0;
	inventory.leftPage.viewbag.sellBuildingPrice = 45;

	inventory.leftPage.addChild(inventory.leftPage.viewbag.list);
	inventory.leftPage.addChild(inventory.leftPage.viewbag.buildingFillMeter);

	inventory.leftPage.refresh = (function () {
		var tmpBuildingData = [];
		for (var key in this._building.storedCrops) {
			tmpBuildingData.push(this._building.storedCrops[key]);
		}

		if(GameState.player.inventory.length >= GameState.inventorySize) {
			this.leftPage.viewbag.listLayout.viewbag.switch.image = "button_switch_disabled";
		} else {
			this.leftPage.viewbag.listLayout.viewbag.switch.image = "button_switch";
		}
		this.leftPage.viewbag.list.setData(tmpBuildingData);
		var buildingInfo = GameState.buildings[this._building.data.codename];
		this.leftPage.viewbag.sellBuildingPrice = buildingInfo.selling_price;
		this.leftPage.viewbag.buildingFillMeter.setProgress(this._building.storedCropCount);
		this.leftPage.viewbag.buildingFillMeter.setMaxProgress(buildingInfo.capacity);
		this.leftPage.viewbag.buildingFillMeter.setText(this._building.storedCropCount + " / " + buildingInfo.capacity);
	}).bind(inventory);

	/*
	 Right page
	 */

	var inventoryItemLayout = HudElements.List.PremadeLayouts.inventoryBuildingItem(null);
	inventoryItemLayout.viewbag.switch.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.depositStoredCrop(item.id);
	};
	inventoryItemLayout.viewbag.price.visible = false;
	inventoryItemLayout.viewbag.sell.visible = false;

	var inventoryItemList = new HudElements.List(470, 460, 0, 0, HudElement.Anchors.TOP_LEFT,
		[],
		inventoryItemLayout,
		function (layout, index, item) {
			console.debug(item);
			layout.viewbag.icon.image = 'stored_' + item.crop;
			layout.viewbag.status.setText(item.healthStatus);
		}
	);
	inventory.rightPage.title = "Inventory";
	inventory.rightPage.viewbag.list = inventoryItemList;
	inventory.rightPage.viewbag.listLayout = inventoryItemLayout;

	inventory.rightPage.viewbag.inventoryFillMeter = new HudElements.ProgressBar(200, 32, 0, 0, HudElement.Anchors.BOTTOM_CENTER);

	inventory.rightPage.addChild(inventory.rightPage.viewbag.list);
	inventory.rightPage.addChild(inventory.rightPage.viewbag.inventoryFillMeter);

	inventory.rightPage.refresh = (function () {
		var tmpInventoryData = [];
		for (var i = 0; i < GameState.player.inventory.length; i++) {
			tmpInventoryData.push(GameState.logicItems.storedCrops[GameState.player.inventory[i]]);
		}
		if(this._building.storedCropCount >= GameState.buildings[this._building.data.codename].capacity) {
			this.rightPage.viewbag.listLayout.viewbag.switch.image = "button_switch_disabled";
		} else {
			this.rightPage.viewbag.listLayout.viewbag.switch.image = "button_switch";
		}
		this.rightPage.viewbag.list.setData(tmpInventoryData);
		this.rightPage.viewbag.inventoryFillMeter.setProgress(tmpInventoryData.length);
		this.rightPage.viewbag.inventoryFillMeter.setMaxProgress(GameState.inventorySize);
		this.rightPage.viewbag.inventoryFillMeter.setText(tmpInventoryData.length + " / " + GameState.inventorySize);
	}).bind(inventory);

	inventory.refresh();

	return inventory;
};