function HudElement(name, image, width, height, verticalMargin, horizontalMargin, anchor, clickable) {
	// -- Do NOT touch these values manually, they are recalculated by "computeLayout" --
	// Please note that for simplicity, they will be relative to the canvas
	this._x = 0;
	this._y = 0;
	// -------------
	this.name = name || 'BasicHudElement'; //Just a name for easier debugging
	this.image = image || null;
	this.verticalMargin = verticalMargin || 0;
	this.horizontalMargin = horizontalMargin || 0;
	this.anchor = anchor || HudElement.Anchors.CENTER;
	this.width = width || 10; // Set width or height to -1 for page width/height
	this.height = height || 10;
	this.visible = true;
	this.opacity = 1;
	this.disabled = false;
	this.children = [];
	this.parent = null;
	this.clickable = clickable || true;

	this.onClick = function (x, y) {
		//Override this for custom click behaviour.
		//Return true if you handled the click and want to consume the event
		return this.baseOnClick(x, y);
	}
}

HudElement.prototype = {
	constructor: HudElement,
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	draw: function (imageList) {
		if (this.visible) {
			if (this.image != null) {
				CrymeEngine.canvas.hud.context.drawImage(imageList[this.image].image, this._x, this._y);
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
		this.width = width;
		this.height = height;
		this.computeLayout();
	},
	/*
	 This method computes where the child will position itself in it's parent. I know it's weird
	 */
	computeLayout: function () {
		//RootHudElement has a anchor of 0, which will position the view at 0,0
		//Compute the vertial margin
		switch (this.anchor) {
			case HudElement.Anchors.TOP_LEFT:
			case HudElement.Anchors.TOP_RIGHT:
			case HudElement.Anchors.TOP_CENTER:
				this._y = this.parent._y + this.verticalMargin;
				break;
			case HudElement.Anchors.BOTTOM_LEFT:
			case HudElement.Anchors.BOTTOM_RIGHT:
			case HudElement.Anchors.BOTTOM_CENTER:
				this._y = this.parent._y + this.parent.height - this.height + this.verticalMargin;
				break;
			case HudElement.Anchors.CENTER:
			case HudElement.Anchors.CENTER_LEFT:
			case HudElement.Anchors.CENTER_RIGHT:
				this._y = this.parent._y + this.parent.height / 2 - this.height / 2 + this.verticalMargin;
				break;
			default:
				this._y = 0;
				break;
		}

		//Now for horizontal margins
		switch (this.anchor) {
			case HudElement.Anchors.BOTTOM_LEFT:
			case HudElement.Anchors.TOP_LEFT:
			case HudElement.Anchors.CENTER_LEFT:
				this._x = this.parent._x + this.horizontalMargin;
				break;
			case HudElement.Anchors.BOTTOM_RIGHT:
			case HudElement.Anchors.TOP_RIGHT:
			case HudElement.Anchors.CENTER_RIGHT:
				this._x = this.parent._x + this.parent.width - this.width + this.horizontalMargin;
				break;
			case HudElement.Anchors.BOTTOM_CENTER:
			case HudElement.Anchors.TOP_CENTER:
			case HudElement.Anchors.CENTER:
				this._x = this.parent._x + this.parent.width / 2 - this.width / 2 + this.horizontalMargin;
				break;
			default:
				this._x = 0;
				break;
		}

		var childrenCount = this.children.length;
		for (var i = 0; i < childrenCount; i++) {
			this.children[i].computeLayout();
		}
	},
	isPointInBounds: function (x, y) { //Point corrdinates are absolute (relative to the canvas/screen)
		return x >= this._x && x < (this._x + this.width) && y >= this._y && y < (this._y + this.height);
	},
	/*
	 Return true if you handled the click and want to consume the event
	 Once you are in this function, you can safely assume that the user clicked inside your view
	 */
	baseOnClick: function (x, y) {
		var childrenCount = this.children.length;
		var child;
		for (var i = 0; i < childrenCount; i++) {
			child = this.children[i];
			if (!child.isPointInBounds(x, y)) {
				if (child.clickable && child.onClick(x, y)) {
					//STOP ! HAMMERTIME (I mean that the even has been consumed by a children, so we propagate this)
					//Don't propagate if onClick returned false, for obvious reasons
					return true;
				}
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

function RootHudElement() {
	HudElement.call(this);
	this.name = "RootHudElement";
	this.anchor = 0;
	this.image = null;
}

RootHudElement.prototype = new HudElement();
RootHudElement.prototype.constructor = RootHudElement;

