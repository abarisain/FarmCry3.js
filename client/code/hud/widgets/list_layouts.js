/*
 Premade layouts
 */
HudElements.List.PremadeLayouts = {};

HudElements.List.PremadeLayouts.marketItem = function (name, height) {
	var tmpLayout = new HudElement(name || "marketListItemLayout", null, 1, height);
	tmpLayout.viewbag.icon = new HudElements.Button(64, 64, 0, 5, " ", HudElement.Anchors.CENTER_LEFT);

	tmpLayout.viewbag.name = new HudElements.Text("");
	tmpLayout.viewbag.name.anchor = HudElement.Anchors.CENTER_LEFT;
	tmpLayout.viewbag.name.verticalMargin = 0;
	tmpLayout.viewbag.name.horizontalMargin = 75;

	tmpLayout.viewbag.price = new HudElements.Text("");
	tmpLayout.viewbag.price.anchor = HudElement.Anchors.CENTER_LEFT;
	tmpLayout.viewbag.price.verticalMargin = 0;
	tmpLayout.viewbag.price.horizontalMargin = 300;

	tmpLayout.viewbag.delete = HudElements.Button.Premade.delete(0, -15, HudElement.Anchors.CENTER_RIGHT);

	tmpLayout.addChild(tmpLayout.viewbag.icon);
	tmpLayout.addChild(tmpLayout.viewbag.name);
	tmpLayout.addChild(tmpLayout.viewbag.price);
	tmpLayout.addChild(tmpLayout.viewbag.delete);
	return tmpLayout;
}

HudElements.List.PremadeLayouts.buildingMarketItem = function (name) {
	var tmpLayout = new HudElement(name || "buildingListItemLayout", null, 1, 220);
	tmpLayout.viewbag.icon = new HudElement("buildingIcon", null, 200, 200, 0, 15, HudElement.Anchors.CENTER_LEFT, false);

	tmpLayout.viewbag.capacityLabel = new HudElements.Text("Capacity : ");
	tmpLayout.viewbag.capacityLabel.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.capacityLabel.verticalMargin = 10;
	tmpLayout.viewbag.capacityLabel.horizontalMargin = tmpLayout.viewbag.icon.horizontalMargin + tmpLayout.viewbag.icon.width + 10;
	tmpLayout.addChild(tmpLayout.viewbag.capacityLabel);

	tmpLayout.viewbag.capacity = new HudElements.Text(" ");
	tmpLayout.viewbag.capacity.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.capacity.verticalMargin = tmpLayout.viewbag.capacityLabel._y + tmpLayout.viewbag.capacityLabel.height + 10;
	tmpLayout.viewbag.capacity.horizontalMargin = tmpLayout.viewbag.capacityLabel.horizontalMargin + 20;
	tmpLayout.addChild(tmpLayout.viewbag.capacity);

	tmpLayout.viewbag.witheringLabel = new HudElements.Text("Stops withering : ");
	tmpLayout.viewbag.witheringLabel.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.witheringLabel.verticalMargin = tmpLayout.viewbag.capacity._y + tmpLayout.viewbag.capacity.height + 10;
	tmpLayout.viewbag.witheringLabel.horizontalMargin = tmpLayout.viewbag.capacityLabel.horizontalMargin;
	tmpLayout.addChild(tmpLayout.viewbag.witheringLabel);

	tmpLayout.viewbag.withering = new HudElements.Text(" ");
	tmpLayout.viewbag.withering.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.withering.verticalMargin = tmpLayout.viewbag.witheringLabel._y + tmpLayout.viewbag.witheringLabel.height + 10;
	tmpLayout.viewbag.withering.horizontalMargin = tmpLayout.viewbag.capacityLabel.horizontalMargin + 20;
	tmpLayout.addChild(tmpLayout.viewbag.withering);

	tmpLayout.viewbag.maintenanceLabel = new HudElements.Text("Maintenance : ");
	tmpLayout.viewbag.maintenanceLabel.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.maintenanceLabel.verticalMargin = tmpLayout.viewbag.withering._y + tmpLayout.viewbag.withering.height + 10;
	tmpLayout.viewbag.maintenanceLabel.horizontalMargin = tmpLayout.viewbag.capacityLabel.horizontalMargin;
	tmpLayout.addChild(tmpLayout.viewbag.maintenanceLabel);

	tmpLayout.viewbag.maintenance = new HudElements.Text(" ");
	tmpLayout.viewbag.maintenance.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.maintenance.verticalMargin = tmpLayout.viewbag.maintenanceLabel._y + tmpLayout.viewbag.maintenanceLabel.height + 10;
	tmpLayout.viewbag.maintenance.horizontalMargin = tmpLayout.viewbag.maintenanceLabel.horizontalMargin + 20;
	tmpLayout.addChild(tmpLayout.viewbag.maintenance);

	tmpLayout.viewbag.price = new HudElements.Text("");
	tmpLayout.viewbag.price.anchor = HudElement.Anchors.BOTTOM_RIGHT;
	tmpLayout.viewbag.price.verticalMargin = -24;
	tmpLayout.viewbag.price.horizontalMargin = -60;

	tmpLayout.viewbag.buy = HudElements.Button.Premade.buy(-10, -10, HudElement.Anchors.BOTTOM_RIGHT);

	tmpLayout.addChild(tmpLayout.viewbag.icon);
	tmpLayout.addChild(tmpLayout.viewbag.price);
	tmpLayout.addChild(tmpLayout.viewbag.buy);
	return tmpLayout;
}

HudElements.List.PremadeLayouts.cropMarketItem = function (name) {
	var tmpLayout = new HudElement(name || "cropListItemLayout", null, 1, 220);
	tmpLayout.viewbag.icon = new HudElement("cropIcon", null, 200, 200, 0, 15, HudElement.Anchors.CENTER_LEFT, false);

	tmpLayout.viewbag.maturationLabel = new HudElements.Text("Maturation time : ");
	tmpLayout.viewbag.maturationLabel.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.maturationLabel.verticalMargin = 10;
	tmpLayout.viewbag.maturationLabel.horizontalMargin = tmpLayout.viewbag.icon.horizontalMargin + tmpLayout.viewbag.icon.width + 10;
	tmpLayout.addChild(tmpLayout.viewbag.maturationLabel);

	tmpLayout.viewbag.maturation = new HudElements.Text(" ");
	tmpLayout.viewbag.maturation.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.maturation.verticalMargin = tmpLayout.viewbag.maturationLabel._y + tmpLayout.viewbag.maturationLabel.height + 10;
	tmpLayout.viewbag.maturation.horizontalMargin = tmpLayout.viewbag.maturationLabel.horizontalMargin + 20;
	tmpLayout.addChild(tmpLayout.viewbag.maturation);

	tmpLayout.viewbag.productionLabel = new HudElements.Text("Ideal production : ");
	tmpLayout.viewbag.productionLabel.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.productionLabel.verticalMargin = tmpLayout.viewbag.maturation._y + tmpLayout.viewbag.maturation.height + 10;
	tmpLayout.viewbag.productionLabel.horizontalMargin = tmpLayout.viewbag.maturationLabel.horizontalMargin;
	tmpLayout.addChild(tmpLayout.viewbag.productionLabel);

	tmpLayout.viewbag.production = new HudElements.Text(" ");
	tmpLayout.viewbag.production.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.production.verticalMargin = tmpLayout.viewbag.productionLabel._y + tmpLayout.viewbag.productionLabel.height + 10;
	tmpLayout.viewbag.production.horizontalMargin = tmpLayout.viewbag.maturationLabel.horizontalMargin + 20;
	tmpLayout.addChild(tmpLayout.viewbag.production);

	tmpLayout.viewbag.storabilityLabel = new HudElements.Text("Withering time : ");
	tmpLayout.viewbag.storabilityLabel.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.storabilityLabel.verticalMargin = tmpLayout.viewbag.production._y + tmpLayout.viewbag.production.height + 10;
	tmpLayout.viewbag.storabilityLabel.horizontalMargin = tmpLayout.viewbag.maturationLabel.horizontalMargin;
	tmpLayout.addChild(tmpLayout.viewbag.storabilityLabel);

	tmpLayout.viewbag.storability = new HudElements.Text(" ");
	tmpLayout.viewbag.storability.anchor = HudElement.Anchors.TOP_LEFT;
	tmpLayout.viewbag.storability.verticalMargin = tmpLayout.viewbag.storabilityLabel._y + tmpLayout.viewbag.storabilityLabel.height + 10;
	tmpLayout.viewbag.storability.horizontalMargin = tmpLayout.viewbag.maturationLabel.horizontalMargin + 20;
	tmpLayout.addChild(tmpLayout.viewbag.storability);

	tmpLayout.viewbag.price = new HudElements.Text("");
	tmpLayout.viewbag.price.anchor = HudElement.Anchors.BOTTOM_RIGHT;
	tmpLayout.viewbag.price.verticalMargin = -24;
	tmpLayout.viewbag.price.horizontalMargin = -60;

	tmpLayout.viewbag.buy = HudElements.Button.Premade.buy(-10, -10, HudElement.Anchors.BOTTOM_RIGHT);

	tmpLayout.addChild(tmpLayout.viewbag.icon);
	tmpLayout.addChild(tmpLayout.viewbag.price);
	tmpLayout.addChild(tmpLayout.viewbag.buy);
	return tmpLayout;
}