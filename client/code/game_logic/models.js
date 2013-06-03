LogicItems = {};

function LogicItem(col, line) {
	this.position = {
		col: col,
		line: line
	};
}

LogicItem.prototype = {
	constructor: LogicItem
};