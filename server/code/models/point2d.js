function Point2D(x, y) {
	this.x = x;
	this.y = y;
}

Point2D.prototype = {
	toString: function() {
		return this.x + ',' + this.y;
	}	
};

exports = Point2D;