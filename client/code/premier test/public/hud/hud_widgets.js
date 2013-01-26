HudElements = {};

/*
 Root HUD element
 */
HudElements.Root = function () {
	HudElement.call(this);
	this.name = "RootHudElement";
	this.anchor = 0;
	this.image = null;
}

HudElements.Root.prototype = new HudElement();
HudElements.Root.prototype.constructor = HudElements.Root;
HudElements.Root.prototype.resize = function () {
	HudElement.prototype.resize.call(this, canvasWidth, canvasHeight);
}

