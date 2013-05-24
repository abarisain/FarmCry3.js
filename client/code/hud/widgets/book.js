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
	this.rightPage.anchor = HudElement.Anchors.CENTER_RIGHT;
	this.addChild(this.leftPage);
	this.addChild(this.rightPage);
	var tmpCloseBtn = new HudElements.Button(37, 37, 15, -15, null, HudElement.Anchors.TOP_RIGHT);
	tmpCloseBtn.ninepatch.enabled = false;
	tmpCloseBtn.image = "button_close";
	tmpCloseBtn.onClick = (function() {
		this.visible = false;
	}).bind(this);
	this.addChild(tmpCloseBtn);
}

HudElements.Book.prototype = new HudElement();
HudElements.Book.prototype.constructor = HudElements.Book;

HudElements.BookPage = function () {
	HudElement.call(this, "BookPage", null);
	this.image = null;
	this.width = 490;
	this.height = 602;
	this.anchor = HudElement.Anchors.CENTER;
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
