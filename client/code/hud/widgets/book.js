/*
 Book HUD elements
 */
HudElements.Book = function () {
	HudElement.call(this, "Book", null);
	this.image = "book";
	this.width = 978;
	this.height = 602;
	this.anchor = HudElement.Anchors.CENTER;
	var tmpCloseBtn = new HudElements.Button(37, 37, 15, -15, " ", HudElement.Anchors.TOP_RIGHT);
	tmpCloseBtn.image = "button_close";
	tmpCloseBtn.onClick = (function() {
		this.visible = false;
	}).bind(this);
	this.addChild(tmpCloseBtn);
}

HudElements.Book.prototype = new HudElement();
HudElements.Book.prototype.constructor = HudElements.Book;
