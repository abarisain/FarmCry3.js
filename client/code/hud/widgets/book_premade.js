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
			layout.viewbag.maintenance.setText(item.price_tick == 0 ? "None" : (item.price_tick + " per " + GameState.ticksToSeconds(24) + " seconds"));
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
			layout.viewbag.maturation.setText(GameState.ticksToSeconds(item.maturation_time) + " s");
			layout.viewbag.production.setText(item.productivity);
			layout.viewbag.storability.setText(Math.ceil(GameState.ticksToSeconds(item.storability) / 60) + " min");
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
	inventory.leftPage.verticalMargin = 40;
	inventory.leftPage.addChild(new HudElement("farmer_avatar", "farmer_full_old", 164, 179, 0, 0, HudElement.Anchors.TOP_CENTER, false));

	inventory.leftPage.viewbag.nickname = new HudElements.Text("");
	inventory.leftPage.viewbag.nickname.anchor = HudElement.Anchors.TOP_CENTER;
	inventory.leftPage.viewbag.nickname.setFont("bold 18pt stanberry,Calibri,Geneva,Arial");
	inventory.leftPage.viewbag.nickname.horizontalMargin = 0;
	inventory.leftPage.viewbag.nickname.verticalMargin = 199;
	inventory.leftPage.viewbag.nickname.setText(GameState.player.nickname);

	inventory.leftPage.viewbag.healthProgress = new HudElements.ProgressBar(200, 42, 242, 0, HudElement.Anchors.TOP_CENTER);
	inventory.leftPage.viewbag.healthProgress.setProgressImage("progressbar_red");

	inventory.leftPage.addChild(new HudElement("money_icon", "coin", 20, 23, 313, 140, HudElement.Anchors.TOP_LEFT, false));
	inventory.leftPage.viewbag.moneyLabel = new HudElements.Text("");
	inventory.leftPage.viewbag.moneyLabel.horizontalMargin = 170;
	inventory.leftPage.viewbag.moneyLabel.verticalMargin = 315;
	inventory.leftPage.viewbag.moneyLabel.setTextFunction(function () {
		if (GameState.player == null)
			return 0;
		return GameState.player.money;
	});

	inventory.leftPage.addChild(inventory.leftPage.viewbag.nickname);
	inventory.leftPage.addChild(inventory.leftPage.viewbag.moneyLabel);
	inventory.leftPage.addChild(inventory.leftPage.viewbag.healthProgress);

	inventory.leftPage.refresh = (function () {
		this.viewbag.healthProgress.setProgress(GameState.player.health);
		this.viewbag.healthProgress.setText("HP : " + GameState.player.health + " / 100");
	}).bind(inventory.leftPage);


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
		if(tmpInventoryData.length >= GameState.inventorySize) {
			this.viewbag.inventoryFillMeter.setProgressImage("progressbar_red");
		} else {
			this.viewbag.inventoryFillMeter.setProgressImage("progressbar_green");
		}
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
			layout.viewbag.icon.image = 'stored_' + item.crop;
			layout.viewbag.status.setText(item.healthStatus);
			layout.viewbag.price.setText(GameState.crops[item.crop].selling_price * item.harvested_quantity);
		}
	);

	inventory.leftPage.title = "Building";
	inventory.leftPage.viewbag.list = buildingItemList;
	inventory.leftPage.viewbag.listLayout = buildingItemLayout;

	inventory.leftPage.viewbag.buildingFillMeter = new HudElements.ProgressBar(200, 32, 0, 0, HudElement.Anchors.BOTTOM_CENTER);

	inventory.leftPage.viewbag.sellBuilding = HudElements.Button.Premade.buy(4, 5, HudElement.Anchors.BOTTOM_LEFT);
	inventory.leftPage.viewbag.sellBuilding.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.sellBuilding();
		CE.hud.panels.building_content.close();
	};

	inventory.leftPage.viewbag.sellBuildingPrice = new HudElements.Text("");
	inventory.leftPage.viewbag.sellBuildingPrice.anchor = HudElement.Anchors.BOTTOM_LEFT;
	inventory.leftPage.viewbag.sellBuildingPrice.verticalMargin = -9;
	inventory.leftPage.viewbag.sellBuildingPrice.horizontalMargin = 52;

	inventory.leftPage.addChild(inventory.leftPage.viewbag.sellBuilding);
	inventory.leftPage.addChild(inventory.leftPage.viewbag.sellBuildingPrice);
	inventory.leftPage.addChild(inventory.leftPage.viewbag.list);
	inventory.leftPage.addChild(inventory.leftPage.viewbag.buildingFillMeter);

	inventory.leftPage.refresh = (function () {
		var tmpBuildingData = [];
		for (var key in this._building.storedCrops) {
			tmpBuildingData.push(this._building.storedCrops[key].logicStoredCrop);
		}

		if(GameState.player.inventory.length >= GameState.inventorySize) {
			this.leftPage.viewbag.listLayout.viewbag.switch.image = "button_pickup_disabled";
		} else {
			this.leftPage.viewbag.listLayout.viewbag.switch.image = "button_pickup";
		}
		this.leftPage.viewbag.list.setData(tmpBuildingData);
		var buildingInfo = GameState.buildings[this._building.data.codename];
		this.leftPage.viewbag.sellBuildingPrice.setText(buildingInfo.selling_price);
		this.leftPage.viewbag.buildingFillMeter.setProgress(this._building.storedCropCount);
		this.leftPage.viewbag.buildingFillMeter.setMaxProgress(buildingInfo.capacity);
		this.leftPage.viewbag.buildingFillMeter.setText(this._building.storedCropCount + " / " + buildingInfo.capacity);
		if (this._building.storedCropCount >= buildingInfo.capacity) {
			this.leftPage.viewbag.buildingFillMeter.setProgressImage("progressbar_red");
		} else {
			this.leftPage.viewbag.buildingFillMeter.setProgressImage("progressbar_green");
		}
	}).bind(inventory);

	/*
	 Right page
	 */

	var inventoryItemLayout = HudElements.List.PremadeLayouts.inventoryBuildingItem(null);
	inventoryItemLayout.viewbag.switch.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.depositStoredCrop(item.id);
	};
	inventoryItemLayout.viewbag.sell.onClick = function (x, y, index, item) {
		networkEngine.subsystems.player.actions.sellStoredCrop(item.id);
	};

	var inventoryItemList = new HudElements.List(470, 460, 0, 0, HudElement.Anchors.TOP_LEFT,
		[],
		inventoryItemLayout,
		function (layout, index, item) {
			layout.viewbag.icon.image = 'stored_' + item.crop;
			layout.viewbag.status.setText(item.healthStatus);
			layout.viewbag.price.setText(GameState.crops[item.crop].selling_price * item.harvested_quantity);
			layout.viewbag.sell.image = (item.time_left > 0 ? "button_buy" : "button_close");
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
		if (this._building.storedCropCount >= GameState.buildings[this._building.data.codename].capacity) {
			this.rightPage.viewbag.listLayout.viewbag.switch.image = "button_deposit_disabled";
		} else {
			this.rightPage.viewbag.listLayout.viewbag.switch.image = "button_deposit";
		}
		this.rightPage.viewbag.list.setData(tmpInventoryData);
		this.rightPage.viewbag.inventoryFillMeter.setProgress(tmpInventoryData.length);
		this.rightPage.viewbag.inventoryFillMeter.setMaxProgress(GameState.inventorySize);
		this.rightPage.viewbag.inventoryFillMeter.setText(tmpInventoryData.length + " / " + GameState.inventorySize);
		if (tmpInventoryData.length >= GameState.inventorySize) {
			this.rightPage.viewbag.inventoryFillMeter.setProgressImage("progressbar_red");
		} else {
			this.rightPage.viewbag.inventoryFillMeter.setProgressImage("progressbar_green");
		}
	}).bind(inventory);

	inventory.refresh();

	return inventory;
};