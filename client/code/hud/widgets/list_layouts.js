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
	tmpLayout.viewbag.delete.onClick = function (x, y, index, item) {
		alert(index);
	};

	tmpLayout.addChild(tmpLayout.viewbag.icon);
	tmpLayout.addChild(tmpLayout.viewbag.name);
	tmpLayout.addChild(tmpLayout.viewbag.price);
	tmpLayout.addChild(tmpLayout.viewbag.delete);
	return tmpLayout;
}