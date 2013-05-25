/*
 List HUD elements
 */
HudElements.List = function (width, height, verticalMargin, horizontalMargin, anchor, data, layout, dataBinder) {
	HudElement.call(this, "List", null);
	this.image = null;
	this.width = width;
	this.height = height;
	this.verticalMargin = verticalMargin;
	this.horizontalMargin = horizontalMargin;
	this.data = data || [];
	this.layout = layout;
	this.anchor = anchor || this.anchor;
	this.dataBinder = dataBinder;
	this.separator = {
		enabled: true,
		color: "#d1c8a8"
	}
	this._marginRight = 40;
	this._drawcache = null;
	this._internalHeight = height;
	this._verticalScrollOffset = 0;
	this.upButton = new HudElements.Button(38, 38, 0, 0, "Λ", HudElement.Anchors.TOP_RIGHT, "#fff");
	this.upButton.onClick = (function () {
		this.scroll(-120);
	}).bind(this);
	HudElement.prototype.addChild.call(this, this.upButton);
	this.downButton = new HudElements.Button(38, 38, 0, 0, "V", HudElement.Anchors.BOTTOM_RIGHT, "#fff");
	this.downButton.onClick = (function () {
		this.scroll(120);
	}).bind(this);
	HudElement.prototype.addChild.call(this, this.downButton);
	this.scrollbar = new HudElements.Button(38, this.height - 80, 40, 0, "", HudElement.Anchors.TOP_RIGHT, "#fff");
	HudElement.prototype.addChild.call(this, this.scrollbar);
}

HudElements.List.prototype = new HudElement();
HudElements.List.prototype.constructor = HudElements.List;

HudElements.List.prototype.draw = function () {
	if (this.visible) {
		if (this._drawcache == null) {
			var elementCount = this.data.length;
			this._internalHeight = elementCount * this.layout.height;
			if(this.separator.enabled)
				this._internalHeight += (elementCount - 1); // Separators are 1 px tall
			this._internalHeight = Math.max(this._internalHeight, this.height);
			if(this._internalHeight > this.height) {
				this.upButton.visible = true;
				this.downButton.visible = true;
				this.scrollbar.visible = true;
			} else {
				this.upButton.visible = false;
				this.downButton.visible = false;
				this.scrollbar.visible = false;
			}
			this.scrollTo(0);
			this._drawcache = document.createElement('canvas');
			this._drawcache.width = this.width;
			this._drawcache.height = this._internalHeight;
			var drawcacheContext = this._drawcache.getContext('2d');
			this.layout.parent = new HudElement();
			this.layout.parentList = this;
			this.layout.setTargetCanvas(drawcacheContext);
			this.layout.anchor = HudElement.Anchors.TOP_LEFT;
			this.layout.width = this.width - this._marginRight;
			this.layout.verticalMargin = 0;
			this.layout.horizontalMargin = 0;
			for(var i = 0; i < elementCount; i++) {
				if(i > 0) {
					this.layout.verticalMargin += this.layout.height;
					if(this.separator.enabled) {
						drawcacheContext.fillStyle = this.separator.color;
						drawcacheContext.fillRect(0, this.layout.verticalMargin, this.width - this._marginRight, 1);
						this.layout.verticalMargin++;
					}
				}
				this.layout.computeLayout();
				this.dataBinder(this.layout, i, this.data[i]);
				this.layout.draw();
			}
			// For click hitbox detection
			this.layout.verticalMargin = 0;
			this.layout.computeLayout();
		}
		if(this.targetCanvas == null) // We can't do that in the constructor
			this.targetCanvas = CrymeEngine.canvas.hud.context;
		this.targetCanvas.drawImage(this._drawcache, 0, this._verticalScrollOffset, this.width, this.height, this._x, this._y, this.width, this.height);

		var childrenCount = this.children.length;
		for (var i = 0; i < childrenCount; i++) {
			this.children[i].draw();
		}
	}
};

HudElements.List.prototype.scroll = function (offset) {
	this.scrollTo(this._verticalScrollOffset + offset);
};

HudElements.List.prototype.scrollTo = function (position) {
	this._verticalScrollOffset = position;
	if(this._verticalScrollOffset < 0)
		this._verticalScrollOffset = 0;
	// Don't allow to scroll too far
	this._verticalScrollOffset = Math.min(this._verticalScrollOffset, this._internalHeight - this.height);
	var maxScrollbarHeight = this.height - 160;
	this.scrollbar.height = maxScrollbarHeight * (this.height /this._internalHeight);
	this.scrollbar.verticalMargin = (this._verticalScrollOffset) * (this.height / this._internalHeight) + 40;
	this.scrollbar.computeLayout();

};

HudElements.List.prototype.setData = function (data) {
	this.data = data || [];
	this._verticalScrollOffset = 0;
	this.invalidate();
};

HudElements.List.prototype.invalidate = function () {
	this._drawcache = null;
};

HudElements.List.prototype.resize = function (width, height) {
	var tmpWidth = width || this.width;
	var tmpHeight = height || this.height;
	if(tmpWidth != this.width || tmpHeight > this._internalHeight)
		this._drawcache = null; // Screw it, redraw everything once, the deadline is too close for proper implementation
	HudElement.prototype.resize.call(this, width, height);
	this.invalidate();
};

HudElements.List.prototype.indexForRelativeMouseCoordinates = function (x, y) {
	y += this._verticalScrollOffset;
	var elementCount = this.data.length;
	var minY = 0;
	var maxY = 0;
	for(var i = 0; i < elementCount; i++) {
		minY = maxY;
		maxY += this.layout.height;
		if (this.separator.enabled) { // Slight miscalculation for the last item, but we don't care
			maxY++;
		}
		if (y >= minY && y < maxY)
			return i;
	}
	return -1;
}

HudElements.List.prototype.baseOnClick = function (x, y) {
	if ( (x - this._x) > this.width - this._marginRight) {
		HudElement.prototype.baseOnClick.call(this, x, y);
	} else {
		// Make the mouse coordinates relative
		x -= this._x;
		y -= this._y;
		var itemIndex = this.indexForRelativeMouseCoordinates(x,y);
		y += this._verticalScrollOffset;
		y -= itemIndex * this.layout.height;
		if (this.separator.enabled)
			y -= itemIndex;
		// If you are in a list, onClick gets a 3rd argument (which is the current item position) !
		// And a 4th (current item) !
		this.layout.onClick(x, y, itemIndex, this.data[itemIndex]);
	}
}

/*
 Text cannot have any children
 */
HudElements.Text.prototype.addChild = function () {
	console.log("Error : addChild called on HudElements.List. A list cannot have any children");
}
HudElements.Text.prototype.removeAllChildren = function () {
	console.log("Error : removeAllChildren called on HudElements.List. A list cannot have any children");
}
