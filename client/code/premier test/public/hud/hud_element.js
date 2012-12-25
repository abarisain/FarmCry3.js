function HudElement(name, image, width, height, verticalMargin, horizontalMargin, anchor) {
	// -- Do NOT touch these values manually, they are recalculated by "computeLayout" --
	this._x = 0;
	this._y = 0;
	// -------------
	this.name = name; //Just a name for easier debugging
	this.image = image;
	this.verticalMargin = verticalMargin;
	this.horizontalMargin = horizontalMargin;
	this.anchor = anchor;
	this.width = width; // Set width or height to -1 for page width/height
	this.height = height;
	this.visible = true;
	this.opacity = 1;
	this.clickable = true;
	this.children = [];
	this.parent = null;
}

HudElement.prototype = {
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	draw: function (imageList) {
		if (this.visible) {
			if (this.image != null) {
				CrymeEngine.canvas.hud.context.drawImage(imageList[this.image].image, this.x, this.y);
			}
			var childrenCount = this.children.length;
			for (var i = 0; i < childrenCount; i++) {
				this.children[i].draw();
			}
		}
	},
	resize: function (width, height) {
		if (width < 1 || height < 1) {
			console.log("Invalid resize for HudElement '" + this.name + "'");
			return;
		}
		this.computeLayout();
	},
	computeLayout: function () {
		//Todo : Do the magic with the anchors and parent relativity here
	},
	isPointInBounds: function (x, y) { //Point corrdinates are absolute (relative to the canvas/screen)
		return x >= this._x && x < (this._x + this.width) && y >= this._y && y < (this._y + this.height);
	},
	/*
	 Return true if you handled the click and want to consume the event
	 Once you are in this function, you can safely assume that the user clicked inside your view
	 */
	onClick: function (x, y) {
		var childrenCount = this.children.length;
		for (var i = 0; i < childrenCount; i++) {
			if (!this.children[i].isPointInBounds(x, y))
				if (this.children[i].onClick(x, y)) {
					//STOP ! HAMMERTIME (I mean that the even has been consumed by a children, so we propagate this)
					//Don't propagate if onClick returned false, for obvious reasons
					return true;
				}
		}
		//Nothing happened
		return false;
	},
	addChild: function (hudElement) { //Override this if you want your view not to be able to have children (poor view)
		hudElement.parent = this;
		this.children.push(hudElement);
	},
	removeAllChildren: function () {
		this.children.length = 0; //ECMAScript specification : all elements with index >= .length are deleted.
	}
};

HudElement.Anchors = {
	TOP_LEFT: 1,
	TOP_RIGHT: 2,
	TOP_CENTER: 3,
	CENTER_LEFT: 4,
	CENTER_RIGHT: 5,
	CENTER: 6,
	BOTTOM_LEFT: 7,
	BOTTOM_RIGHT: 8,
	BOTTOM_CENTER: 9
};