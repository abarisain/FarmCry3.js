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
	this.anchor = anchor || HudElement.Anchors.TOP_LEFT;
	this.width = width || 10; // Set width or height to -1 for page width/height
	this.height = height || 10;
	this.visible = true;
	this.opacity = 1;
	this.disabled = false;
	this.children = [];
	this.parent = null;
	this.viewbag = {}; // Use this to maintain readable references to your children
	this.ninepatch = {
		enabled: false,
		left_width: 0,
		right_width: 0,
		top_height: 0,
		bottom_height: 0
	}
	this.clickable = typeof clickable == 'undefined' ? true : clickable;
	this.targetCanvas = null;

	this.onClick = function (x, y, data1, data2) {
		//Override this for custom click behaviour.
		//Return true if you handled the click and want to consume the event
		return this.baseOnClick(x, y, data1, data2);
	}

	this.onOutsideClick = function (x, y, data1, data2) {
		//Override this for custom ouside click behaviour (only works if you are modal).
		return this.baseOnOutsideClick(x, y, data1, data2);
	}

	this.modal = false; // A modal item will prevent the game for getting clicks outside it. Books, popups are modal.

	this.close = function () {
		this.baseClose();
	}
}

HudElement.prototype = {
	constructor: HudElement,
	//attention a bien se préoccuper du context avant, ici je m'en occupe pas
	draw: function () {
		if (this.visible) {
			if(this.targetCanvas == null) // We can't do that in the constructor
				this.targetCanvas = CrymeEngine.canvas.hud.context;
			if (this.image != null) {
				this.targetCanvas.globalAlpha = this.opacity;
				if(!this.ninepatch.enabled) {
					this.targetCanvas.drawImage(CrymeEngine.hud.textures[this.image].image, this._x, this._y);
				} else {
					var tmpImage = CrymeEngine.hud.textures[this.image];
					//Top left
					this.targetCanvas.drawImage(tmpImage.image,
						0, 0,
						this.ninepatch.left_width, this.ninepatch.top_height,
						this._x, this._y,
						this.ninepatch.left_width, this.ninepatch.top_height);
					//Top right
					this.targetCanvas.drawImage(tmpImage.image,
						tmpImage.width - this.ninepatch.right_width, 0,
						this.ninepatch.right_width, this.ninepatch.top_height,
						this._x + this.width - this.ninepatch.right_width, this._y,
						this.ninepatch.right_width, this.ninepatch.top_height);
					//Bottom left
					this.targetCanvas.drawImage(tmpImage.image,
						0, tmpImage.height - this.ninepatch.bottom_height,
						this.ninepatch.left_width, this.ninepatch.bottom_height,
						this._x, this._y + this.height - this.ninepatch.bottom_height,
						this.ninepatch.left_width, this.ninepatch.bottom_height);
					//Bottom right
					this.targetCanvas.drawImage(tmpImage.image,
						tmpImage.width - this.ninepatch.right_width, tmpImage.height - this.ninepatch.bottom_height,
						this.ninepatch.right_width, this.ninepatch.bottom_height,
						this._x + this.width - this.ninepatch.right_width, this._y + this.height - this.ninepatch.bottom_height,
						this.ninepatch.right_width, this.ninepatch.bottom_height);
					//Top middle
					this.targetCanvas.drawImage(tmpImage.image,
						this.ninepatch.left_width + 1, 0,
						tmpImage.width - this.ninepatch.left_width - this.ninepatch.right_width, this.ninepatch.top_height,
						this._x + this.ninepatch.left_width, this._y,
						this.width - this.ninepatch.left_width - this.ninepatch.right_width, this.ninepatch.top_height);
					//Bottom middle
					this.targetCanvas.drawImage(tmpImage.image,
						this.ninepatch.left_width + 1, tmpImage.height - this.ninepatch.bottom_height,
						tmpImage.width - this.ninepatch.left_width - this.ninepatch.right_width, this.ninepatch.bottom_height,
						this._x + this.ninepatch.left_width, this._y + this.height - this.ninepatch.bottom_height,
						this.width - this.ninepatch.left_width - this.ninepatch.right_width, this.ninepatch.bottom_height);
					//Middle
					this.targetCanvas.drawImage(tmpImage.image,
						this.ninepatch.left_width + 1, this.ninepatch.top_height + 1,
						tmpImage.width - this.ninepatch.left_width - this.ninepatch.right_width,
						tmpImage.height - this.ninepatch.top_height - this.ninepatch.bottom_height,
						this._x + this.ninepatch.left_width, this._y + this.ninepatch.top_height,
						this.width - this.ninepatch.left_width - this.ninepatch.right_width, this.height - this.ninepatch.top_height - this.ninepatch.bottom_height);
					//Middle left
					this.targetCanvas.drawImage(tmpImage.image,
						0, this.ninepatch.top_height + 1,
						this.ninepatch.left_width, tmpImage.height - this.ninepatch.top_height - this.ninepatch.bottom_height,
						this._x, this._y + this.ninepatch.top_height,
						this.ninepatch.left_width, this.height - this.ninepatch.top_height - this.ninepatch.bottom_height);
					//Middle right
					this.targetCanvas.drawImage(tmpImage.image,
						tmpImage.width - this.ninepatch.right_width, this.ninepatch.top_height + 1,
						this.ninepatch.right_width, tmpImage.height - this.ninepatch.top_height - this.ninepatch.bottom_height,
						this._x + this.width - this.ninepatch.right_width, this._y + this.ninepatch.top_height,
						this.ninepatch.right_width, this.height - this.ninepatch.top_height - this.ninepatch.bottom_height);
				}
				this.targetCanvas.globalAlpha = 1;
			}
			var childrenCount = this.children.length;
			for (var i = 0; i < childrenCount; i++) {
				this.children[i].draw();
			}
		}
	},
	setTargetCanvas: function(context) {
		this.targetCanvas = context;
		var childrenCount = this.children.length;
		for (var i = 0; i < childrenCount; i++) {
			this.children[i].setTargetCanvas(context);
		}
	},
	resize: function (width, height) {
		if (width < 1 || height < 1) {
			console.log("Invalid resize for HudElement '" + this.name + "'");
			return;
		}
		this.width = width || this.width;
		this.height = height || this.height;
		this.computeLayout();
	},
	/*
	 This method computes where the child will position itself in it's parent. I know it's weird
	 */
	computeLayout: function () {
		//If the element is an orphan, automatically attach it to RootHud. Except if it's root itself.
		if (this.parent == null && this.name != "RootHudElement") {
			this.parent = CrymeEngine.hud.rootHudElement;
		}
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

		this._x = Math.ceil(this._x);
		this._y = Math.ceil(this._y);

		var childrenCount = this.children.length;
		for (var i = 0; i < childrenCount; i++) {
			this.children[i].computeLayout();
		}
	},
	isPointInBounds: function (x, y) { //Point corrdinates are absolute (relative to the canvas/screen)
		return x >= this._x && x < (this._x + this.width) && y >= this._y && y < (this._y + this.height);
	},
	/*
	 The event is always consumed if you are in a window
	 Once you are in this function, you can safely assume that the user clicked inside your view
	 */
	baseOnClick: function (x, y, data1, data2) {
		var childrenCount = this.children.length;
		var child;
		var modalIndex = -1;
		// Check for the topmost modal item index.
		for (var i = 0; i < childrenCount; i++) {
			child = this.children[i];
			if (child.visible && child.modal) {
				modalIndex = i;
				// Don't break, that way we find the topmost
			}
		}
		// Only send the event to the modal item if there is one
		if(modalIndex >= 0) {
			child = this.children[modalIndex];
			if(child.clickable) { // Visibility has already been checked
				if(child.isPointInBounds(x, y)) {
					child.onClick(x, y, data1, data2);
				} else {
					child.onOutsideClick(x, y, data1, data2);
				}
			}
			return true; // Consume whatever happened
		} else {
			// If there is no modal item, do a "classic" propagation
			for (var i = 0; i < childrenCount; i++) {
				child = this.children[i];
				if (child.visible && child.clickable && child.isPointInBounds(x, y)) {
					//STOP ! HAMMERTIME (I mean that the even has been consumed by a children, so we propagate this)
					//Don't propagate if onClick returned false, for obvious reasons
					child.onClick(x, y, data1, data2);
					return true;
				}
			}
		}
		// Don't catch the click if we are the root element
		return this != CE.hud.rootHudElement;
	},
	baseOnOutsideClick: function (x, y, data1, data2) {
		// No base action, only here for easy overriding
	},
	baseClose: function () {
		if(this != CE.hud.rootHudElement)
			this.parent.removeChild(this);
	},
	onEscapeKeyPressed: function () {
		if(this.modal) {
			this.close();
		} else {
			var childrenCount = this.children.length;
			for (var i = 0; i < childrenCount; i++) {
				this.children[i].onEscapeKeyPressed();
			}
		}
	},
	addChild: function (hudElement) { //Override this if you want your view not to be able to have children (poor view)
		hudElement.parent = this;
		hudElement.computeLayout();
		hudElement.onAttached();
		this.children.push(hudElement);
	},
	removeChild: function (hudElement) {
		this.children.removeItem(hudElement);
		hudElement.onDetached();
	},
	removeAllChildren: function () {
		this.children.length = 0; //ECMAScript specification : all elements with index >= .length are deleted.
	},
	onAttached: function () {
	},
	onDetached: function () {
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

HudElements = {};