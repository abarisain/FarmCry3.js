/*
 Book HUD elements
 */
HudElements.Book = function () {
	HudElement.call(this, "Book", null);
	this.image = "book";
	this.width = 978;
	this.height = 602;
	this.anchor = HudElement.Anchors.CENTER;
	this.leftPage = new HudElements.BookPage();
	this.rightPage = new HudElements.BookPage();
	this.rightPage.anchor = HudElement.Anchors.BOTTOM_RIGHT;
	this.addChild(this.leftPage);
	this.addChild(this.rightPage);
	var tmpCloseBtn = new HudElements.Button(37, 37, 15, -15, null, HudElement.Anchors.TOP_RIGHT);
	tmpCloseBtn.ninepatch.enabled = false;
	tmpCloseBtn.image = "button_close";
	tmpCloseBtn.removeAllChildren();
	tmpCloseBtn.onClick = (function() {
		this.visible = false;
	}).bind(this);
	var tmpLeftTitle = new HudElements.Text();
	tmpLeftTitle.setTextFunction((function() {
		return this.title;
	}).bind(this.leftPage));
	tmpLeftTitle.verticalMargin = 22;
	tmpLeftTitle.horizontalMargin = 27;
	var tmpRightTitle = new HudElements.Text();
	tmpRightTitle.setTextFunction((function() {
		return this.title;
	}).bind(this.rightPage));
	tmpRightTitle.verticalMargin = 22;
	tmpRightTitle.horizontalMargin = 517;
	this.addChild(tmpLeftTitle);
	this.addChild(tmpRightTitle);
	this.addChild(tmpCloseBtn);
}

HudElements.Book.prototype = new HudElement();
HudElements.Book.prototype.constructor = HudElements.Book;

HudElements.BookPage = function () {
	HudElement.call(this, "BookPage", null);
	this.image = null;
	this.width = 490;
	this.height = 557;
	this.anchor = HudElement.Anchors.BOTTOM_LEFT;
	this.title = "cacaca";
}

HudElements.BookPage.prototype = new HudElement();
HudElements.BookPage.prototype.constructor = HudElements.BookPage;

HudElements.BookPage.prototype.addChild = function (hudElement) {
	if(this.children.length > 0) {
		// Nuh-uh ! This is only a container
		console.log("Hud error : BookPage cannot have more than one child. It's like china.");
	} else {
		HudElement.prototype.addChild.call(this, hudElement);
	}
};
